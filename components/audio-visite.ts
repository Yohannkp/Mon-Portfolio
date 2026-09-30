/**
 * Le son de la presentation automatique : une voix et une musique d'ambiance.
 *
 * Rien n'est telecharge et rien n'est enregistre :
 *  - la VOIX est celle du navigateur (Web Speech API, `speechSynthesis`) : on choisit la meilleure
 *    voix francaise disponible sur l'appareil (voix « naturelles » ou « en ligne » en priorite) ;
 *  - la MUSIQUE est fabriquee en direct (Web Audio) : un nappe d'accords doux avec de la reverberation,
 *    et quelques notes cristallines qui passent de temps en temps. Pas de fichier, pas de droit d'auteur.
 *
 * Le navigateur n'autorise le son qu'apres un geste : tout demarre donc depuis le clic sur ▶.
 * Quand la voix parle, la musique baisse d'elle-meme (ducking) puis remonte.
 */

/* ----------------------------------------------------------------------------------------- voix */

let voixChoisie: SpeechSynthesisVoice | null = null
let enCours: SpeechSynthesisUtterance | null = null // garde une reference : certains navigateurs ramassent l'enonce sinon
let jeton = 0

export const voixDisponible = () => typeof window !== "undefined" && "speechSynthesis" in window

/** Les voix francaises, de la plus agreable a la moins agreable (les voix reseau / neuronales d'abord). */
function choisirVoix(): SpeechSynthesisVoice | null {
  if (!voixDisponible()) return null
  const voix = window.speechSynthesis.getVoices().filter((v) => /^fr(-|_|$)/i.test(v.lang))
  if (!voix.length) return null
  const note = (v: SpeechSynthesisVoice) => {
    let s = 0
    if (/natural|neural|online|premium|enhanced|am[eé]lior/i.test(v.name)) s += 6
    if (/google/i.test(v.name)) s += 4
    if (/thomas|am[eé]lie|audrey|denise|henri|hortense|julie|paul|marie|vivienne|remy/i.test(v.name)) s += 3
    if (/^fr[-_]FR$/i.test(v.lang)) s += 2
    if (/compact|espeak|robot/i.test(v.name)) s -= 5
    if (!v.localService) s += 1
    return s
  }
  return voix.sort((a, b) => note(b) - note(a))[0]
}

/** Ce que dit la voix : la meme phrase que celle affichee, mais lisible a haute voix. */
export function nettoyer(t: string) {
  return t
    .replace(/[·—–]/g, ",")
    .replace(/→/g, " vers ")
    .replace(/_/g, " ")
    .replace(/\+(\d)/g, "plus $1")
    .replace(/(\d)\s?Md\b/g, "$1 milliards")
    .replace(/\b1\s?:\s?1\b/g, "un pour un")
    .replace(/\s+/g, " ")
    .trim()
}

/**
 * Le rythme de la voix, appris en ecoutant : millisecondes par caractere. On part d'une valeur moyenne,
 * puis chaque phrase terminee affine la mesure (moyenne mobile) : la synchronisation s'ameliore d'elle-meme.
 */
let msParCar = 74
/** Duree estimee d'une phrase (ms) : sert aussi de garde-fou si le navigateur ne signale jamais la fin. */
export const dureeEstimee = (t: string) => Math.min(24000, 900 + nettoyer(t).length * msParCar)

/** Ou en est la phrase en cours. Se met a jour a chaque evenement de la voix, et se prolonge entre deux. */
type Suivi = { debut: number; len: number; c: number; tc: number; mots: number; p: number; fini: boolean }
let suivi: Suivi | null = null

/**
 * Avancement (0..1) de la phrase en cours de lecture.
 *  - si le navigateur signale les mots (evenement `boundary`), on suit le mot en cours et on interpole entre deux mots ;
 *  - sinon (certaines voix reseau n'en envoient pas), on suit l'horloge avec le rythme appris ci-dessus.
 * Jamais de retour en arriere ; 1 seulement quand la voix a vraiment fini.
 */
export function progression(): number {
  const u = suivi
  if (!u) return 0
  if (u.fini) return 1
  const now = performance.now()
  let p: number
  if (u.mots > 0) {
    const c = Math.min(u.c + (now - u.tc) / msParCar, u.c + 14)
    p = c / u.len
  } else {
    p = (now - u.debut) / (msParCar * u.len)
  }
  u.p = Math.max(u.p, Math.min(0.985, p))
  return u.p
}

/** Lit `texte`. `onFin` est appele une seule fois, a la fin ou en cas d'erreur (pas si la phrase est remplacee). */
export function parler(texte: string, onFin?: () => void) {
  if (!voixDisponible()) {
    onFin?.()
    return
  }
  const moi = ++jeton
  const synth = window.speechSynthesis
  const propre = nettoyer(texte)
  suivi = { debut: performance.now(), len: Math.max(1, propre.length), c: 0, tc: 0, mots: 0, p: 0, fini: false }
  synth.cancel()
  const dire = () => {
    if (moi !== jeton) return
    const u = new SpeechSynthesisUtterance(propre)
    voixChoisie = voixChoisie ?? choisirVoix()
    if (voixChoisie) u.voice = voixChoisie
    u.lang = voixChoisie?.lang ?? "fr-FR"
    u.rate = 0.97
    u.pitch = 1
    u.volume = 1
    const cette = suivi
    // Si le navigateur ne signale pas le debut, l'horloge part de l'appel a speak().
    if (cette) cette.debut = performance.now()
    u.onstart = () => {
      if (moi === jeton && cette) cette.debut = performance.now()
    }
    u.onboundary = (e: SpeechSynthesisEvent) => {
      if (moi !== jeton || !cette) return
      cette.c = e.charIndex
      cette.tc = performance.now()
      cette.mots++
    }
    const fin = () => {
      if (moi !== jeton) return
      if (cette) {
        // On apprend le rythme de la voix (phrases assez longues seulement, et rythme plausible).
        const dur = performance.now() - cette.debut
        if (cette.len >= 30 && dur > 600) msParCar = Math.min(150, Math.max(45, msParCar * 0.55 + (dur / cette.len) * 0.45))
        cette.fini = true
      }
      onFin?.()
    }
    u.onend = fin
    u.onerror = fin
    enCours = u
    synth.speak(u)
  }
  // Un `cancel()` suivi tout de suite d'un `speak()` fait parfois taire le second (Chrome).
  window.setTimeout(dire, 70)
}

export function taire() {
  jeton++
  enCours = null
  suivi = null
  if (voixDisponible()) window.speechSynthesis.cancel()
}

/** Les voix arrivent parfois apres le chargement de la page. */
export function preparerVoix() {
  if (!voixDisponible()) return () => {}
  const maj = () => {
    voixChoisie = choisirVoix()
  }
  maj()
  window.speechSynthesis.addEventListener?.("voiceschanged", maj)
  return () => window.speechSynthesis.removeEventListener?.("voiceschanged", maj)
}

/* ------------------------------------------------------------------------------------- musique */

export type Ambiance = {
  demarrer: () => void
  /** Fondu de sortie, puis fermeture du contexte audio. */
  arreter: () => void
  /** La voix parle : la musique baisse. */
  assourdir: (baisse: boolean) => void
}

// Accords tres doux (Do maj7 → La m9 → Fa maj7 → Sol 6/9), chacun tenu 8 s, en fondu enchaine.
const ACCORDS: number[][] = [
  [130.81, 164.81, 196.0, 246.94],
  [110.0, 164.81, 196.0, 246.94],
  [174.61, 220.0, 261.63, 329.63],
  [196.0, 246.94, 329.63, 440.0],
]
const BASSES = [65.41, 55.0, 87.31, 98.0]
const CRISTAL = [523.25, 587.33, 659.25, 783.99, 880.0]

const NIVEAU = 0.5
const NIVEAU_VOIX = 0.22

export function creerAmbiance(): Ambiance | null {
  if (typeof window === "undefined") return null
  const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
  if (!AC) return null

  let ctx: AudioContext | null = null
  let master: GainNode | null = null
  let bus: GainNode | null = null
  let timerAccord = 0
  let timerCristal = 0
  let timerFermeture = 0
  let indice = 0
  let assourdi = false

  const reverberation = (c: AudioContext) => {
    const l = Math.floor(c.sampleRate * 3.4)
    const buf = c.createBuffer(2, l, c.sampleRate)
    for (let ch = 0; ch < 2; ch++) {
      const d = buf.getChannelData(ch)
      for (let i = 0; i < l; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / l, 2.6)
    }
    const conv = c.createConvolver()
    conv.buffer = buf
    return conv
  }

  const voix = (c: AudioContext, freq: number, t: number, duree: number, volume: number, type: OscillatorType, detune: number) => {
    const o = c.createOscillator()
    const g = c.createGain()
    o.type = type
    o.frequency.value = freq
    o.detune.value = detune
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(volume, t + 3)
    g.gain.setValueAtTime(volume, t + duree - 1)
    g.gain.linearRampToValueAtTime(0.0001, t + duree + 4)
    o.connect(g)
    g.connect(bus!)
    o.start(t)
    o.stop(t + duree + 4.2)
  }

  const accord = () => {
    if (!ctx) return
    const t = ctx.currentTime + 0.05
    const i = indice++ % ACCORDS.length
    for (const f of ACCORDS[i]) {
      voix(ctx, f, t, 8, 0.02, "sine", -6)
      voix(ctx, f, t, 8, 0.014, "triangle", 7)
    }
    voix(ctx, BASSES[i], t, 8, 0.05, "sine", 0)
  }

  const cristal = () => {
    if (!ctx || !bus) return
    const t = ctx.currentTime + 0.05
    const o = ctx.createOscillator()
    const g = ctx.createGain()
    o.type = "sine"
    o.frequency.value = CRISTAL[Math.floor(Math.random() * CRISTAL.length)]
    g.gain.setValueAtTime(0.0001, t)
    g.gain.linearRampToValueAtTime(0.03, t + 0.03)
    g.gain.exponentialRampToValueAtTime(0.0001, t + 2.6)
    o.connect(g)
    g.connect(bus)
    o.start(t)
    o.stop(t + 2.8)
    timerCristal = window.setTimeout(cristal, 2600 + Math.random() * 3200)
  }

  const cible = () => (assourdi ? NIVEAU_VOIX : NIVEAU)

  return {
    demarrer() {
      window.clearTimeout(timerFermeture)
      if (ctx && ctx.state !== "closed") {
        // Deja la (arret tres court suivi d'une reprise) : on remonte simplement le volume.
        void ctx.resume()
        master?.gain.setTargetAtTime(cible(), ctx.currentTime, 0.8)
        window.clearInterval(timerAccord)
        window.clearTimeout(timerCristal)
        accord()
        timerAccord = window.setInterval(accord, 8000)
        timerCristal = window.setTimeout(cristal, 3500)
        return
      }
      ctx = new AC()
      void ctx.resume()
      master = ctx.createGain()
      master.gain.value = 0
      const comp = ctx.createDynamicsCompressor()
      master.connect(comp)
      comp.connect(ctx.destination)

      // Le chemin sonore : notes → filtre doux qui respire → (direct + reverberation) → sortie.
      const filtre = ctx.createBiquadFilter()
      filtre.type = "lowpass"
      filtre.frequency.value = 1100
      filtre.Q.value = 0.3
      const lfo = ctx.createOscillator()
      const lfoG = ctx.createGain()
      lfo.frequency.value = 0.06
      lfoG.gain.value = 320
      lfo.connect(lfoG)
      lfoG.connect(filtre.frequency)
      lfo.start()

      bus = ctx.createGain()
      bus.connect(filtre)
      const direct = ctx.createGain()
      direct.gain.value = 0.55
      const conv = reverberation(ctx)
      const humide = ctx.createGain()
      humide.gain.value = 1.1
      filtre.connect(direct)
      filtre.connect(conv)
      conv.connect(humide)
      direct.connect(master)
      humide.connect(master)

      accord()
      timerAccord = window.setInterval(accord, 8000)
      timerCristal = window.setTimeout(cristal, 3500)
      master.gain.setTargetAtTime(cible(), ctx.currentTime, 1.2)
    },

    arreter() {
      window.clearInterval(timerAccord)
      window.clearTimeout(timerCristal)
      if (!ctx || !master) return
      const c = ctx
      master.gain.setTargetAtTime(0, c.currentTime, 0.45)
      window.clearTimeout(timerFermeture)
      timerFermeture = window.setTimeout(() => {
        void c.close().catch(() => {})
        if (ctx === c) {
          ctx = null
          master = null
          bus = null
        }
      }, 2200)
    },

    assourdir(baisse: boolean) {
      assourdi = baisse
      if (ctx && master) master.gain.setTargetAtTime(cible(), ctx.currentTime, 0.35)
    },
  }
}
