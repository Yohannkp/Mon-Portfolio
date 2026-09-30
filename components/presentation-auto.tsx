"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FastForward, Play, Rewind, RotateCcw, Square, Volume2, VolumeX, X } from "lucide-react"
import { creerAmbiance, dureeEstimee, parler, preparerVoix, taire, voixDisponible, type Ambiance } from "@/components/audio-visite"
import { DOSSIERS, NB_PHARES_MOT, PHARES } from "@/lib/dossiers"

/**
 * La presentation automatique : une visite de l'accueil qui defile toute seule.
 *
 * Le visiteur n'a rien a faire. La page defile d'un arret a l'autre, et les animations
 * et le robot suivent : ils ne lisent que la position de defilement, donc rien n'est
 * « joue » a part — c'est le meme comportement que si l'on faisait defiler a la main.
 *
 *   ▶ / ■        lance, ou arrete
 *   defiler      (molette, tactile, clavier, barre de defilement) arrete aussitot
 *   ▶ ensuite    reprend la ou l'on est, jusqu'a la fin
 *   ↺ (survol)   revient tout en haut et recommence a zero
 *
 * Un arret = une position, une phrase du guide, et soit un temps de lecture, soit un
 * balayage lent (les sections pilotees par le defilement, comme le schema RAG, se jouent
 * ainsi), soit l'attente de la fin d'une animation (la visite guidee d'une demo).
 */

type Arret = {
  cle: string
  titre: string | (() => string)
  phrase: string | (() => string)
  /** Numero du projet presente (0..5) : les autres cartes s'estompent pendant cet arret. */
  carte?: number
  /** Un arret dont l'element n'existe pas est saute. */
  ok?: () => boolean
  y0: () => number
  /** S'il existe, l'arret est un balayage lent de y0 a y1 ; sinon, un temps de lecture a y0. */
  y1?: () => number
  duree: number
  /** Attend la fin d'une animation de la page (avec un plafond : on ne reste jamais bloque). */
  jusqua?: { cond: () => boolean; min: number; max: number; apres: number }
}

/* ------------------------------ mesures de la page ------------------------------ */
const H = () => window.innerHeight
const maxY = () => Math.max(0, document.documentElement.scrollHeight - H())
const haut = (el: Element | null | undefined) => (el ? el.getBoundingClientRect().top + window.scrollY : 0)
const centreY = (el: Element | null | undefined) => (el ? haut(el) + el.getBoundingClientRect().height / 2 : 0)
const q = (s: string) => document.querySelector<HTMLElement>(s)
const qa = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s))
const existe = (s: string) => () => !!q(s)

/** Une rangee d'elements que le robot parcourt de gauche a droite : on la fait monter dans la fenetre. */
const rangee = (s: string, de: number, a: number, duree: number) => ({
  ok: existe(s),
  y0: () => centreY(q(s)) - de * H(),
  y1: () => centreY(q(s)) - a * H(),
  duree,
})

const CARTES = PHARES.map((d, i): Arret => ({
  cle: `projet-${d.slug}`,
  titre: `Projet ${i + 1} sur ${PHARES.length} · ${d.nom}`,
  phrase: `${d.phare!.question} ${d.chiffre ? `Preuve : ${d.chiffre.valeur} ${d.chiffre.unite}.` : ""}`.trim(),
  carte: i,
  ok: () => qa("#sec-stations .cas").length > i,
  // La ligne de lecture du robot est a 52 % de la hauteur : la carte s'y centre.
  y0: () => centreY(qa("#sec-stations .cas")[i]) - 0.52 * H(),
  duree: 4300,
}))

const ARRETS: Arret[] = [
  {
    cle: "accueil",
    titre: "Bienvenue",
    phrase: "Je vous fais visiter ce portfolio pas à pas. Vous n'avez rien à faire : le robot vous guide.",
    y0: () => 0,
    duree: 4800,
  },
  {
    cle: "rag",
    titre: "Le fil conducteur",
    phrase: "Une requête traverse un pipeline RAG : recherche hybride, fusion, reranking, puis une réponse citée.",
    ok: existe(".rag__scroll"),
    // Le schema est pilote par le defilement : on le balaie lentement, de l'introduction a la fin de l'epinglage.
    y0: () => haut(q(".rag__scroll")) - 0.3 * H(),
    y1: () => haut(q(".rag__scroll")) + (q(".rag__scroll")?.getBoundingClientRect().height ?? 0) - H(),
    duree: 17000,
  },
  {
    cle: "chiffres",
    titre: "En chiffres",
    phrase: "Quelques repères sur le parcours, avant d'entrer dans les projets.",
    ...rangee(".compteurs", 0.9, 0.4, 6000),
  },
  {
    cle: "projets",
    titre: "Projets",
    phrase: `${NB_PHARES_MOT.charAt(0).toUpperCase() + NB_PHARES_MOT.slice(1)} projets, ${NB_PHARES_MOT} preuves : chacun répond à une question qu'un recruteur se pose.`,
    ok: existe("#sec-stations"),
    y0: () => haut(q("#sec-stations")) + 20,
    duree: 3400,
  },
  ...CARTES,
  {
    cle: "autres-projets",
    titre: "Et le reste",
    phrase: `${DOSSIERS.length} projets au total, classés par ce qu'ils démontrent : mettre en production, entraîner, mesurer, construire.`,
    ok: existe(".cas-suite"),
    y0: () => centreY(q(".cas-suite")) - 0.5 * H(),
    duree: 3600,
  },
  {
    cle: "demos",
    titre: "Démonstrations",
    phrase: "Le robot guide une simulation, étape par étape. Je le laisse aller jusqu'au bout : trois autres scénarios vous attendent ensuite.",
    ok: existe("#sec-demos .demo"),
    y0: () => haut(q("#sec-demos .demo")) - 110,
    duree: 3000,
    // La visite guidee de la demo se joue seule ; on attend qu'elle soit finie (plafond : 2 minutes).
    jusqua: { cond: () => q("#sec-demos .demo")?.dataset.fin === "1", min: 3000, max: 120000, apres: 3000 },
  },
  {
    cle: "apropos",
    titre: "À propos",
    phrase: "Je cherche un stage de 4 à 6 mois à partir d'avril 2027, en MLOps ou en data engineering.",
    ok: existe("#sec-apropos"),
    y0: () => haut(q("#sec-apropos")) - 60,
    // Le robot souligne les phrases au fur et a mesure qu'elles passent sa ligne de lecture.
    y1: () => Math.max(haut(q("#sec-apropos")) - 60, centreY(qa("#sec-apropos .marque").slice(-1)[0]) - 0.5 * H()),
    duree: 9000,
  },
  {
    cle: "competences",
    titre: "Compétences",
    phrase: "Quatre familles de technologies. Pour chacune, une preuve tirée d'un projet.",
    ...rangee("#sec-competences .carte", 0.94, 0.42, 8500),
  },
  {
    cle: "methode",
    titre: "Méthode",
    phrase: "Cadrer, préparer la donnée, construire, prouver, déployer : la démarche derrière les projets.",
    ...rangee("#sec-methode div.rounded-full", 0.94, 0.44, 8000),
  },
  {
    cle: "veille",
    titre: "En ce moment",
    phrase: "Ce que j'apprends : LLMOps, architecture et DevOps.",
    ...rangee("#sec-veille .carte", 0.94, 0.5, 6500),
  },
  {
    cle: "contact",
    titre: "Travaillons ensemble",
    phrase: "C'est la fin de la visite. Le bouton « Me contacter » est juste là.",
    y0: () => maxY(),
    duree: 5500,
  },
]

/**
 * Met en valeur le projet presente : les autres cartes s'estompent (le style est dans projets.css).
 * `null` remet tout en place — a chaque fin d'arret sur un projet, a l'arret de la visite, au demontage.
 */
function focaliser(i: number | null) {
  const liste = q("#sec-stations .cas-liste")
  const cartes = qa("#sec-stations .cas")
  if (i === null) {
    liste?.removeAttribute("data-focus")
    cartes.forEach((c) => c.removeAttribute("data-focus"))
    return
  }
  liste?.setAttribute("data-focus", "1")
  cartes.forEach((c, k) => c.setAttribute("data-focus", k === i ? "1" : "0"))
}

const texte = (v: string | (() => string)) => (typeof v === "function" ? v() : v)
const borne = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const facile = (k: number) => (k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2)
const lerp = (a: number, b: number, t: number) => a + (b - a) * t

type Phase = "aller" | "balayer" | "attendre" | "apres"
type Etat = "repos" | "lecture" | "pause"

/** Ce que le moteur tient a jour entre deux images : rien de tout cela ne doit provoquer un rendu React. */
type Moteur = {
  liste: Arret[]
  i: number
  phase: Phase
  ecoule: number
  duree: number
  depuis: number
  p0: number
  dernierY: number
  dernierT: number
  raf: number
  termine: boolean
}

export function PresentationAuto() {
  const [etat, setEtat] = useState<Etat>("repos")
  const [narration, setNarration] = useState<{ n: number; total: number; titre: string; phrase: string } | null>(null)
  const [avancement, setAvancement] = useState(0)
  const [fin, setFin] = useState(false)
  const m = useRef<Moteur>({
    liste: [], i: 0, phase: "aller", ecoule: 0, duree: 0, depuis: 0, p0: 0,
    dernierY: 0, dernierT: 0, raf: 0, termine: false,
  })
  const etatRef = useRef<Etat>("repos")
  const reduit = useRef(false)
  const cacheFin = useRef(0)
  const racine = useRef<HTMLDivElement>(null)
  const derniereMaj = useRef(0)
  const [manoeuvre, setManoeuvre] = useState<null | "retour" | "avance">(null)
  const vitesse = useRef(1)
  // Le son : la voix lit la phrase de chaque arret, la musique tient l'ambiance. Preference gardee d'une visite a l'autre.
  const [son, setSon] = useState(true)
  const sonRef = useRef(true)
  const ambiance = useRef<Ambiance | null>(null)
  const parle = useRef({ actif: false, jusqua: 0 })
  const avantLecture = useRef(false)
  const recul = useRef(0)
  const [invite, setInvite] = useState(false)
  const inviteVue = useRef(false)

  const changerEtat = useCallback((e: Etat) => {
    etatRef.current = e
    setEtat(e)
    const html = document.documentElement
    if (e === "lecture") html.dataset.visite = "1"
    else delete html.dataset.visite
  }, [])

  const poser = (y: number) => {
    const cible = Math.round(borne(y, 0, maxY()))
    m.current.dernierY = cible
    // Le site defile en douceur par defaut : ici, on pilote image par image, donc instantane.
    if (Math.round(window.scrollY) !== cible) window.scrollTo({ top: cible, behavior: "instant" as ScrollBehavior })
  }

  const dire = (phrase: string) => {
    if (!sonRef.current || !voixDisponible()) {
      parle.current.actif = false
      return
    }
    parle.current = { actif: true, jusqua: performance.now() + dureeEstimee(phrase) + 1500 }
    ambiance.current?.assourdir(true)
    parler(phrase, () => {
      parle.current.actif = false
      ambiance.current?.assourdir(false)
    })
  }
  /** Tant que la voix parle, la visite attend : on ne coupe jamais une phrase. (Pas pendant l'avance rapide.) */
  const voixOccupee = () => sonRef.current && vitesse.current === 1 && parle.current.actif && performance.now() < parle.current.jusqua
  const demarrerSon = () => {
    if (!sonRef.current) return
    ambiance.current = ambiance.current ?? creerAmbiance()
    ambiance.current?.demarrer()
  }
  const couperSon = () => {
    taire()
    parle.current.actif = false
    ambiance.current?.assourdir(false)
    ambiance.current?.arreter()
  }
  const basculerSon = () => {
    const v = !sonRef.current
    sonRef.current = v
    setSon(v)
    try {
      localStorage.setItem("pa-son", v ? "1" : "0")
    } catch {}
    if (!v) couperSon()
    else if (etatRef.current === "lecture") {
      demarrerSon()
      const a = m.current.liste[m.current.i]
      if (a) dire(texte(a.phrase))
    }
  }

  /** Affiche l'arret i (phrase, carte mise en avant, robot) sans toucher a la position ni au minuteur. */
  const montrer = (i: number) => {
    const s = m.current
    const a = s.liste[i]
    document.documentElement.dataset.visiteEtape = String(i)
    focaliser(a.carte ?? null)
    setNarration({ n: i + 1, total: s.liste.length, titre: texte(a.titre), phrase: texte(a.phrase) })
  }

  const fixerArret = (i: number, depuisY: number) => {
    const s = m.current
    const a = s.liste[i]
    s.i = i
    s.ecoule = 0
    s.depuis = depuisY
    s.p0 = 0
    const a0 = a.y0()
    const a1 = a.y1 ? a.y1() : a0
    montrer(i)
    if (vitesse.current === 1) dire(texte(a.phrase))
    else parle.current.actif = false

    const dedans = !!a.y1 && depuisY >= Math.min(a0, a1) - 30 && depuisY <= Math.max(a0, a1) + 30
    if (dedans) {
      // On reprend un balayage la ou l'on est : on ne rejoue pas ce qui est deja passe.
      s.phase = "balayer"
      s.p0 = borne((depuisY - a0) / (a1 - a0 || 1), 0, 1)
      s.duree = a.duree * (1 - s.p0)
    } else if (Math.abs(depuisY - a0) > 20) {
      s.phase = "aller"
      s.duree = reduit.current ? 1 : borne(650 + Math.abs(a0 - depuisY) * 0.75, 700, 2800)
    } else {
      s.phase = "balayer"
      s.duree = a.duree
    }
  }

  const suivant = () => {
    const s = m.current
    if (s.i + 1 >= s.liste.length) {
      terminer()
      return
    }
    fixerArret(s.i + 1, window.scrollY)
  }

  const boucle = (t: number) => {
    const s = m.current
    if (etatRef.current !== "lecture") return
    // Le temps s'accumule par petits pas : un onglet en arriere-plan ne fait pas « sauter » la visite.
    const dt = Math.min(t - (s.dernierT || t), 64)
    s.dernierT = t
    s.ecoule += dt * vitesse.current
    const a = s.liste[s.i]
    const a0 = a.y0()
    const a1 = a.y1 ? a.y1() : a0
    let frac = 0

    if (s.phase === "aller") {
      const k = borne(s.ecoule / s.duree, 0, 1)
      poser(lerp(s.depuis, a0, facile(k)))
      if (k >= 1) {
        s.phase = "balayer"
        s.ecoule = 0
        s.p0 = 0
        s.duree = a.duree
      }
    } else if (s.phase === "balayer") {
      const k = borne(s.ecoule / (s.duree || 1), 0, 1)
      // Positions relues a chaque image : si la mise en page bouge (image chargee, police), on suit.
      const p = a.y1 ? lerp(s.p0, 1, k) : 0
      poser(a.y1 ? lerp(a0, a1, p) : a0)
      frac = a.y1 ? p : k
      if (k >= 1) {
        if (a.jusqua) {
          s.phase = "attendre"
          s.ecoule = 0
        } else if (!voixOccupee()) suivant()
      }
    } else if (s.phase === "attendre") {
      poser(a0)
      const j = a.jusqua!
      if ((s.ecoule >= j.min && j.cond()) || s.ecoule >= j.max) {
        s.phase = "apres"
        s.ecoule = 0
      }
      frac = 0.5
    } else {
      poser(a0)
      if (s.ecoule >= a.jusqua!.apres && !voixOccupee()) suivant()
      frac = 1
    }

    // L'anneau autour du bouton : ou en est la visite (rendu limite a quelques fois par seconde).
    if (t - derniereMaj.current > 250) {
      derniereMaj.current = t
      setAvancement((s.i + frac) / s.liste.length)
    }
    s.raf = requestAnimationFrame(boucle)
  }

  /* ---------------------------- arret par le visiteur ---------------------------- */
  const surUtilisateur = useCallback((e: Event) => {
    const cible = e.target as Element | null
    // Un clic ou une touche sur le controle lui-meme n'est pas un defilement.
    if (e.type !== "wheel" && cible?.closest?.(".pa")) return
    if (e.type === "keydown") {
      const k = (e as KeyboardEvent).key
      if (!["Escape", "ArrowUp", "ArrowDown", "PageUp", "PageDown", "Home", "End", " ", "Spacebar"].includes(k)) return
    }
    if (e.type === "mousedown") {
      // Seule la barre de defilement (a droite du contenu) compte ici.
      if ((e as MouseEvent).clientX < document.documentElement.clientWidth) return
    }
    if (e.type === "scroll") {
      // Un defilement que nous n'avons pas fait : on tolere l'ecart d'une image, pas davantage.
      if (Math.abs(window.scrollY - m.current.dernierY) < 160) return
    }
    arreter()
  }, [])

  const ecouter = (actif: boolean) => {
    const f = actif ? window.addEventListener : window.removeEventListener
    for (const type of ["wheel", "touchstart", "touchmove", "keydown", "mousedown", "scroll"] as const)
      f.call(window, type, surUtilisateur, { capture: true, passive: true })
  }

  const arreter = () => {
    const s = m.current
    cancelAnimationFrame(s.raf)
    ecouter(false)
    // Le visiteur reprend la main : les cartes reviennent toutes a leur place.
    focaliser(null)
    couperSon()
    if (etatRef.current === "lecture") changerEtat("pause")
  }

  const terminer = () => {
    const s = m.current
    cancelAnimationFrame(s.raf)
    ecouter(false)
    s.termine = true
    focaliser(null)
    couperSon()
    changerEtat("repos")
    setAvancement(1)
    setNarration({ n: s.liste.length, total: s.liste.length, titre: "Fin de la visite", phrase: "Merci de votre attention. Vous pouvez la relancer à tout moment." })
    setFin(true)
    window.clearTimeout(cacheFin.current)
    cacheFin.current = window.setTimeout(() => {
      setFin(false)
      setNarration(null)
      setAvancement(0)
    }, 5000)
  }

  const lancer = (depuisY: number, auDebut = false) => {
    const s = m.current
    window.clearTimeout(cacheFin.current)
    setFin(false)
    s.liste = ARRETS.filter((a) => a.ok?.() ?? true)
    if (!s.liste.length) return
    let i = 0
    if (!auDebut) {
      i = s.liste.findIndex((a) => (a.y1 ? a.y1() : a.y0()) >= depuisY - 30)
      if (i < 0) i = s.liste.length - 1
    }
    s.termine = false
    s.dernierT = 0
    s.dernierY = Math.round(depuisY)
    fixerArret(i, depuisY)
    changerEtat("lecture")
    demarrerSon()
    ecouter(true)
    cancelAnimationFrame(s.raf)
    s.raf = requestAnimationFrame(boucle)
  }

  /** ▶ / ■ : arrete si ca joue ; sinon (re)prend la ou l'on est. Apres la fin, repart du debut. */
  const basculer = () => {
    if (etatRef.current === "lecture") {
      arreter()
      return
    }
    if (m.current.termine) lancer(window.scrollY, true)
    else lancer(window.scrollY)
  }

  /* ------------------- maintenir : avance rapide x2 et retour ------------------- */
  // Le geste compte : tant que la bulle est tenue, la visite avance a double vitesse ou remonte ;
  // au relachement elle reprend normalement si elle jouait, sinon elle reste en pause.
  const debutAvance = () => {
    if (manoeuvre) return
    avantLecture.current = etatRef.current === "lecture"
    vitesse.current = 2
    taire()
    parle.current.actif = false
    setManoeuvre("avance")
    if (!avantLecture.current) basculer()
  }
  const finAvance = () => {
    if (vitesse.current !== 2) return
    vitesse.current = 1
    setManoeuvre(null)
    if (!avantLecture.current && etatRef.current === "lecture") arreter()
    else if (etatRef.current === "lecture") {
      // Retour a la vitesse normale : on reprend la phrase de l'arret ou l'on est arrive.
      const a = m.current.liste[m.current.i]
      if (a) dire(texte(a.phrase))
    }
  }

  const debutRetour = () => {
    if (manoeuvre) return
    const s = m.current
    avantLecture.current = etatRef.current === "lecture"
    cancelAnimationFrame(s.raf)
    taire()
    parle.current.actif = false
    window.clearTimeout(cacheFin.current)
    setFin(false)
    s.termine = false
    s.liste = ARRETS.filter((a) => a.ok?.() ?? true)
    if (!s.liste.length) return
    setManoeuvre("retour")
    const t0 = performance.now()
    let dernier = t0
    let courant = -1
    const pas = (t: number) => {
      const dt = Math.min(t - dernier, 64)
      dernier = t
      // Elle accelere doucement : un appui bref recule un peu, un appui long remonte loin.
      const v = 650 + Math.min((t - t0) / 1600, 1) * 1350
      const y = Math.max(0, window.scrollY - (v * dt) / 1000)
      poser(y)
      let idx = 0
      s.liste.forEach((a, k) => {
        if (a.y0() <= y + 40) idx = k
      })
      if (idx !== courant) {
        courant = idx
        montrer(idx)
        setAvancement((idx + 0.5) / s.liste.length)
      }
      if (y > 0) recul.current = requestAnimationFrame(pas)
    }
    recul.current = requestAnimationFrame(pas)
  }
  const finRetour = () => {
    cancelAnimationFrame(recul.current)
    if (manoeuvre !== "retour") return
    setManoeuvre(null)
    // Elle repart la ou l'on est arrive ; sinon elle attend en pause, prete a « Reprendre ».
    if (avantLecture.current) lancer(window.scrollY)
    else {
      focaliser(null)
      changerEtat("pause")
    }
  }

  /** Revient tout en haut, remet la demo a zero, et recommence la presentation depuis le debut. */
  const recommencer = () => {
    if (etatRef.current === "lecture") {
      cancelAnimationFrame(m.current.raf)
      ecouter(false)
    }
    // La visite guidee de la demo repart de sa premiere etape, sur son premier scenario.
    const premier = q("#sec-demos .onglet")
    if (premier && !premier.classList.contains("onglet--actif")) premier.click()
    window.setTimeout(() => q("#sec-demos .gd__points button")?.click(), 60)
    lancer(window.scrollY, true)
  }

  useEffect(() => {
    reduit.current = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const s = m.current
    try {
      const v = localStorage.getItem("pa-son") !== "0"
      sonRef.current = v
      setSon(v)
    } catch {}
    const finVoix = preparerVoix()
    return () => {
      finVoix()
      taire()
      ambiance.current?.arreter()
      cancelAnimationFrame(s.raf)
      ecouter(false)
      window.clearTimeout(cacheFin.current)
      focaliser(null)
      const html = document.documentElement
      delete html.dataset.visite
      delete html.dataset.visiteEtape
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Au repos, le bouton s'efface pendant que le visiteur fait defiler la page (il ne passe plus
  // sur le texte) et revient des que le defilement s'arrete.
  useEffect(() => {
    let t = 0
    const surScroll = () => {
      const el = racine.current
      if (!el || etatRef.current === "lecture") return
      el.dataset.defile = "1"
      window.clearTimeout(t)
      t = window.setTimeout(() => delete el.dataset.defile, 1100)
    }
    window.addEventListener("scroll", surScroll, { passive: true })
    return () => {
      window.removeEventListener("scroll", surScroll)
      window.clearTimeout(t)
    }
  }, [])

  // L'invitation : quand le visiteur arrive de lui-meme sur les projets, un petit message doux lui propose
  // de lancer la visite a partir de la. Jamais pendant une visite. Fermee d'un geste = plus jamais ;
  // simplement quittee (il a defile plus loin) = elle peut revenir, trois fois au plus par session.
  const lu = (cle: string) => {
    try {
      return sessionStorage.getItem(cle)
    } catch {
      return null
    }
  }
  const ecrire = (cle: string, v: string) => {
    try {
      sessionStorage.setItem(cle, v)
    } catch {}
  }
  const plafondInvite = useRef(0)
  const vueDepuis = useRef(0)
  const departInvite = useRef(0)
  const cacherInvite = useCallback(() => {
    window.clearTimeout(plafondInvite.current)
    window.clearTimeout(departInvite.current)
    inviteVue.current = false
    setInvite(false)
  }, [])
  const fermerInvite = useCallback(() => {
    cacherInvite()
    ecrire("pa-invite", "1")
  }, [cacherInvite])

  useEffect(() => {
    const section = document.getElementById("sec-stations")
    if (!section || typeof IntersectionObserver === "undefined") return
    // /?invitation remet les compteurs a zero : pratique pour la revoir sans navigation privee.
    if (new URLSearchParams(window.location.search).has("invitation")) {
      try {
        sessionStorage.removeItem("pa-invite")
        sessionStorage.removeItem("pa-invite-n")
      } catch {}
    }
    let delai = 0
    const io = new IntersectionObserver(
      ([e]) => {
        window.clearTimeout(delai)
        if (!e.isIntersecting) {
          // Il quitte les projets. S'il a file tres vite, elle reste au moins 6 s : il doit pouvoir la lire.
          if (inviteVue.current) {
            const reste = 6000 - (performance.now() - vueDepuis.current)
            if (reste <= 0) cacherInvite()
            else departInvite.current = window.setTimeout(cacherInvite, reste)
          }
          return
        }
        window.clearTimeout(departInvite.current)
        if (inviteVue.current || etatRef.current !== "repos" || m.current.termine) return
        if (lu("pa-invite") === "1" || Number(lu("pa-invite-n") ?? 0) >= 3) return
        delai = window.setTimeout(() => {
          if (etatRef.current !== "repos" || inviteVue.current) return
          inviteVue.current = true
          ecrire("pa-invite-n", String(Number(lu("pa-invite-n") ?? 0) + 1))
          vueDepuis.current = performance.now()
          setInvite(true)
          plafondInvite.current = window.setTimeout(cacherInvite, 45000)
        }, 250)
      },
      // Le haut de la section a passe les 40 % bas de l'ecran (sur telephone, la section est bien trop haute pour un seuil de surface).
      { threshold: 0, rootMargin: "0px 0px -40% 0px" },
    )
    io.observe(section)
    return () => {
      io.disconnect()
      window.clearTimeout(delai)
      window.clearTimeout(plafondInvite.current)
      window.clearTimeout(departInvite.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Des que la visite demarre (par l'invitation ou par le bouton), elle disparait.
  useEffect(() => {
    if (etat === "lecture" && invite) fermerInvite()
  }, [etat, invite, fermerInvite])

  useEffect(() => {
    if (!invite) return
    const surTouche = (ev: KeyboardEvent) => {
      if (ev.key === "Escape") fermerInvite()
    }
    window.addEventListener("keydown", surTouche)
    return () => window.removeEventListener("keydown", surTouche)
  }, [invite, fermerInvite])

  const enCours = etat === "lecture"
  const entame = avancement > 0 && !fin
  const libelle = enCours ? "Arrêter la présentation" : entame ? "Reprendre la présentation" : "Présentation automatique"
  const R = 24
  const C = 2 * Math.PI * R

  return (
    <div className="pa" ref={racine} data-etat={etat} data-fin={fin ? "1" : "0"} data-invite={invite ? "1" : "0"} data-manoeuvre={manoeuvre ? "1" : "0"}>
      <div className="pa__carte" data-on={narration && (enCours || fin || manoeuvre) ? "1" : "0"} role="status" aria-live="polite">
        {narration ? (
          <>
            <p className="pa__etape">
              {fin ? "Terminé" : `Étape ${narration.n} / ${narration.total}`} · {narration.titre}
            </p>
            <p className="pa__phrase">{narration.phrase}</p>
          </>
        ) : null}
      </div>

      <div className="pa__rang">
        <div className="pa__invite" data-on={invite ? "1" : "0"} role="status" aria-hidden={invite ? undefined : true}>
          <button className="pa__invite-x" onClick={fermerInvite} aria-label="Fermer l'invitation" tabIndex={invite ? 0 : -1}>
            <X size={14} />
          </button>
          <p className="pa__invite-k">Visite guidée</p>
          <p className="pa__invite-t">Envie que je vous présente les projets ? Je vous guide pas à pas, à partir d&apos;ici.</p>
          <div className="pa__invite-a">
            <button className="pa__invite-go" onClick={basculer} tabIndex={invite ? 0 : -1}>
              <Play size={13} fill="currentColor" /> Lancer la visite
            </button>
            <button className="pa__invite-non" onClick={fermerInvite} tabIndex={invite ? 0 : -1}>
              Plus tard
            </button>
          </div>
        </div>
        <div className="pa__menu">
          <button
            className="pa__pill"
            data-mode="retour"
            data-actif={manoeuvre === "retour" ? "1" : "0"}
            aria-label="Retour arrière : maintenir enfoncé"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId)
              debutRetour()
            }}
            onPointerUp={finRetour}
            onPointerCancel={finRetour}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault()
                debutRetour()
              }
            }}
            onKeyUp={(e) => (e.key === " " || e.key === "Enter") && finRetour()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <Rewind size={14} fill="currentColor" />
            <span>Retour</span>
            <small>maintenir</small>
          </button>
          <button
            className="pa__pill"
            data-mode="avance"
            data-actif={manoeuvre === "avance" ? "1" : "0"}
            aria-label="Avance rapide ×2 : maintenir enfoncé"
            onPointerDown={(e) => {
              e.currentTarget.setPointerCapture?.(e.pointerId)
              debutAvance()
            }}
            onPointerUp={finAvance}
            onPointerCancel={finAvance}
            onKeyDown={(e) => {
              if ((e.key === " " || e.key === "Enter") && !e.repeat) {
                e.preventDefault()
                debutAvance()
              }
            }}
            onKeyUp={(e) => (e.key === " " || e.key === "Enter") && finAvance()}
            onContextMenu={(e) => e.preventDefault()}
          >
            <FastForward size={14} fill="currentColor" />
            <span>×2</span>
            <small>maintenir</small>
          </button>
          <button className="pa__recom" onClick={recommencer} aria-label="Recommencer la présentation depuis le début" title="Recommencer">
            <RotateCcw size={16} />
          </button>
        </div>
        <button className="pa__btn" onClick={basculer} aria-label={libelle} title={libelle} aria-pressed={enCours} data-etat={etat}>
          <svg className="pa__anneau" viewBox="0 0 56 56" aria-hidden="true">
            <circle cx="28" cy="28" r={R} className="pa__piste" />
            <circle
              cx="28"
              cy="28"
              r={R}
              className="pa__progres"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - avancement)}
              transform="rotate(-90 28 28)"
            />
          </svg>
          {enCours ? <Square size={16} fill="currentColor" /> : <Play size={18} fill="currentColor" />}
        </button>
        <button
          className="pa__son"
          data-on={son ? "1" : "0"}
          onClick={basculerSon}
          aria-pressed={son}
          aria-label={son ? "Couper le son (voix et musique)" : "Activer le son (voix et musique)"}
          title={son ? "Voix et musique : activées" : "Voix et musique : coupées"}
        >
          {son ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
      </div>
    </div>
  )
}
