"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { FastForward, Play, Rewind, RotateCcw, Square, Volume2, VolumeX, X } from "lucide-react"
import { creerAmbiance, dureeEstimee, parler, preparerVoix, progression, taire, voixDisponible, type Ambiance } from "@/components/audio-visite"
import { PHARES } from "@/lib/dossiers"
import { dossiersActifs } from "@/lib/dossiers-langue"
import { surLangue, t as tr, useT } from "@/lib/langue"

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
  /**
   * Ce que dit la voix, en plusieurs phrases si l'arret est long (le schema RAG, par exemple, lit une phrase par etape).
   * Sans cela : la phrase de l'arret. `debuts` dit ou en est le balayage (0..1) au debut de chaque phrase, plus 1 a la fin :
   * le defilement est alors PILOTE par la voix, phrase apres phrase.
   */
  beats?: () => string[]
  debuts?: number[]
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

const CARTES = PHARES.map((d0, i): Arret => ({
  cle: `projet-${d0.slug}`,
  // Le texte est calcule au moment de le dire : il suit la langue du visiteur, meme changee en cours de visite.
  titre: () => {
    const d = dossiersActifs().PHARES[i]
    return tr(`Projet ${i + 1} sur ${PHARES.length} · ${d.nom}`, `Project ${i + 1} of ${PHARES.length} · ${d.nom}`)
  },
  phrase: () => {
    const d = dossiersActifs().PHARES[i]
    return tr(
      `${d.phare!.question} ${d.chiffre ? `Preuve : ${d.chiffre.valeur} ${d.chiffre.unite}.` : ""}`.trim(),
      `${d.phare!.question} ${d.chiffre ? `Proof: ${d.chiffre.valeur} ${d.chiffre.unite}.` : ""}`.trim(),
    )
  },
  carte: i,
  ok: () => qa("#sec-stations .cas").length > i,
  // La ligne de lecture du robot est a 52 % de la hauteur : la carte s'y centre.
  y0: () => centreY(qa("#sec-stations .cas")[i]) - 0.52 * H(),
  duree: 4300,
}))

const ARRETS: Arret[] = [
  {
    cle: "accueil",
    titre: () => tr("Bienvenue", "Welcome"),
    phrase: () =>
      tr(
        "Je vous fais visiter ce portfolio pas à pas. Vous n'avez rien à faire : le robot vous guide.",
        "I'll show you around this portfolio step by step. You don't have to do anything: the robot guides you.",
      ),
    y0: () => 0,
    duree: 4800,
  },
  {
    cle: "rag",
    titre: () => tr("Le fil conducteur", "The common thread"),
    phrase: () =>
      tr(
        "Une requête traverse un pipeline RAG : recherche hybride, fusion, reranking, puis une réponse citée.",
        "A query goes through a RAG pipeline: hybrid search, fusion, reranking, then a cited answer.",
      ),
    ok: existe(".rag__scroll"),
    // Le schema est pilote par le defilement : on le balaie lentement, de l'introduction a la fin de l'epinglage.
    y0: () => haut(q(".rag__scroll")) - 0.3 * H(),
    y1: () => haut(q(".rag__scroll")) + (q(".rag__scroll")?.getBoundingClientRect().height ?? 0) - H(),
    duree: 17000,
    // Avec la voix, une phrase par etape du schema : le defilement suit la voix, et chaque note apparait quand on en parle.
    // Les `debuts` sont les positions (0..1 du balayage) ou chaque note du schema apparait (mesurees sur la page).
    beats: () => [
      tr(
        "Une requête traverse un pipeline RAG : recherche hybride, fusion, reranking, puis une réponse citée.",
        "A query goes through a RAG pipeline: hybrid search, fusion, reranking, then a cited answer.",
      ),
      tr(
        "Étape un, la réécriture : la question est reformulée pour devenir autonome, sinon la recherche ne retrouve rien.",
        "Step one, rewriting: the question is reformulated to stand on its own, otherwise the search finds nothing.",
      ),
      tr(
        "Étape deux, deux recherches : une vectorielle pour le sens, une BM25 pour les mots exacts.",
        "Step two, two searches: a vector one for meaning, and a BM25 one for exact words.",
      ),
      tr(
        "Étape trois, la fusion RRF : aucun poids à deviner, c'est le rang qui compte, pas le score.",
        "Step three, RRF fusion: no weights to guess, it's the rank that counts, not the score.",
      ),
      tr(
        "Étape quatre, le reranking : un cross-encoder ne garde que les six meilleurs candidats, sur le processeur.",
        "Step four, reranking: a cross-encoder keeps only the six best candidates, on the processor.",
      ),
      tr(
        "Étape cinq, la réponse : générée en streaming, avec des citations qui ouvrent la page exacte du PDF. S'il ne sait pas, il le dit.",
        "Step five, the answer: generated by streaming, with citations that open the exact page of the PDF. If it doesn't know, it says so.",
      ),
    ],
    debuts: [0, 0.27, 0.44, 0.6, 0.75, 0.89, 1],
  },
  {
    cle: "chiffres",
    titre: () => tr("En chiffres", "By the numbers"),
    phrase: () =>
      tr("Quelques repères sur le parcours, avant d'entrer dans les projets.", "A few landmarks on the journey, before getting into the projects."),
    ...rangee(".compteurs", 0.9, 0.4, 6000),
  },
  {
    cle: "projets",
    titre: () => tr("Projets", "Projects"),
    phrase: () => {
      const mot = dossiersActifs().NB_PHARES_MOT
      const Mot = mot.charAt(0).toUpperCase() + mot.slice(1)
      return tr(
        `${Mot} projets, ${mot} preuves : chacun répond à une question qu'un recruteur se pose.`,
        `${Mot} projects, ${mot} proofs: each one answers a question a recruiter asks.`,
      )
    },
    ok: existe("#sec-stations"),
    y0: () => haut(q("#sec-stations")) + 20,
    duree: 3400,
  },
  ...CARTES,
  {
    cle: "autres-projets",
    titre: () => tr("Et le reste", "And the rest"),
    phrase: () => {
      const n = dossiersActifs().DOSSIERS.length
      return tr(
        `${n} projets au total, classés par ce qu'ils démontrent : mettre en production, entraîner, mesurer, construire.`,
        `${n} projects in total, ranked by what they demonstrate: putting into production, training, measuring, building.`,
      )
    },
    ok: existe(".cas-suite"),
    y0: () => centreY(q(".cas-suite")) - 0.5 * H(),
    duree: 3600,
  },
  {
    cle: "demos",
    titre: () => tr("Démonstrations", "Demonstrations"),
    phrase: () =>
      tr(
        "Le robot guide une simulation, étape par étape. Je le laisse aller jusqu'au bout : trois autres scénarios vous attendent ensuite.",
        "The robot guides a simulation, step by step. I let it run to the end: three other scenarios await you afterwards.",
      ),
    ok: existe("#sec-demos .demo"),
    y0: () => haut(q("#sec-demos .demo")) - 110,
    duree: 3000,
    // La visite guidee de la demo se joue seule ; on attend qu'elle soit finie (plafond : 2 minutes).
    jusqua: { cond: () => q("#sec-demos .demo")?.dataset.fin === "1", min: 3000, max: 120000, apres: 3000 },
  },
  {
    cle: "apropos",
    titre: () => tr("À propos", "About"),
    phrase: () =>
      tr(
        "Je cherche un stage de 4 à 6 mois à partir d'avril 2027, en MLOps ou en data engineering.",
        "I'm looking for a 4–6 month internship starting April 2027, in MLOps or data engineering.",
      ),
    ok: existe("#sec-apropos"),
    y0: () => haut(q("#sec-apropos")) - 60,
    // Le robot souligne les phrases au fur et a mesure qu'elles passent sa ligne de lecture.
    y1: () => Math.max(haut(q("#sec-apropos")) - 60, centreY(qa("#sec-apropos .marque").slice(-1)[0]) - 0.5 * H()),
    duree: 9000,
  },
  {
    cle: "competences",
    titre: () => tr("Compétences", "Skills"),
    phrase: () =>
      tr(
        "Quatre familles de technologies. Pour chacune, une preuve tirée d'un projet.",
        "Four families of technologies. For each, a proof drawn from a project.",
      ),
    ...rangee("#sec-competences .carte", 0.94, 0.42, 8500),
  },
  {
    cle: "formations",
    titre: () => tr("Formation", "Training"),
    phrase: () =>
      tr(
        "Un cours de SQL de 30 heures, une formation Python et machine learning, et des certifications vérifiables sur Credly.",
        "A 30-hour SQL course, a Python and machine-learning course, and certifications you can verify on Credly.",
      ),
    ok: existe("#sec-formations .formation-sql"),
    // Du cours de SQL jusqu'aux certifications : on balaie lentement, une phrase pour chaque moitie.
    y0: () => centreY(q("#sec-formations .formation-sql")) - 0.42 * H(),
    y1: () => Math.max(centreY(q("#sec-formations .formation-sql")) - 0.42 * H(), centreY(qa("#sec-formations .badge-carte").slice(-1)[0]) - 0.55 * H()),
    duree: 13000,
    beats: () => [
      tr(
        "Je me forme aussi en continu : un cours de SQL de trente heures, des premières requêtes jusqu'aux jointures, aux fonctions de fenêtrage et aux CTE.",
        "I keep training too: a thirty-hour SQL course, from the first queries to joins, window functions and CTEs.",
      ),
      tr(
        "Il va jusqu'aux index et aux plans d'exécution, et se termine par un projet d'entrepôt de données. La mise en pratique, c'est le projet sur les ventes de supermarché.",
        "It goes all the way to indexes and execution plans, and ends with a data-warehouse project. The practice is the supermarket sales project.",
      ),
      tr(
        "À côté des certifications, j'ai suivi une formation Python et machine learning de trente vidéos : NumPy, Pandas, Matplotlib, SciPy et Scikit-learn.",
        "Alongside the certifications, I followed a thirty-video Python and machine-learning course: NumPy, Pandas, Matplotlib, SciPy and Scikit-learn.",
      ),
      tr(
        "Et des certifications vérifiables sur Credly : bases de données et SQL, analyse de données IBM, analyse de données avancée Google, et Python pour la data.",
        "And certifications you can verify on Credly: databases and SQL, IBM data analysis, Google advanced data analytics, and Python for data.",
      ),
    ],
    debuts: [0, 0.2, 0.42, 0.6, 1],
  },
  {
    cle: "methode",
    titre: () => tr("Méthode", "Method"),
    phrase: () =>
      tr(
        "Cadrer, préparer la donnée, construire, prouver, déployer : la démarche derrière les projets.",
        "Frame it, prepare the data, build, prove, deploy: the approach behind the projects.",
      ),
    ...rangee("#sec-methode div.rounded-full", 0.94, 0.44, 8000),
  },
  {
    cle: "veille",
    titre: () => tr("En ce moment", "Right now"),
    phrase: () => tr("Ce que j'apprends : LLMOps, architecture et DevOps.", "What I'm learning: LLMOps, architecture and DevOps."),
    ...rangee("#sec-veille .carte", 0.94, 0.5, 6500),
  },
  {
    cle: "contact",
    titre: () => tr("Travaillons ensemble", "Let's work together"),
    phrase: () =>
      tr("C'est la fin de la visite. Le bouton « Me contacter » est juste là.", "That's the end of the tour. The “Contact me” button is right there."),
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

/** Fait ressentir quelque chose au robot (voir robot-emotions.ts). */
const emotion = (humeur: string, ms = 1500) => window.dispatchEvent(new CustomEvent("robot-emotion", { detail: { humeur, ms } }))

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
  const t = useT()
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
  // La voix pilote la visite : phrases a dire (beats), la phrase en cours, et les garde-fous.
  const vx = useRef({ beats: [] as string[], debuts: [0, 1] as number[], j: 0, actif: false, fini: true, entre: false, limite: 0, tok: 0, pMax: 0, demoE: "" })
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

  const html = () => document.documentElement
  const finVoixMarque = () => {
    ambiance.current?.assourdir(false)
    delete html().dataset.robotParle
  }
  const arreterVoix = () => {
    const v = vx.current
    v.tok++
    v.actif = false
    v.fini = true
    v.entre = false
    taire()
    finVoixMarque()
  }
  const direBeat = () => {
    const v = vx.current
    const tok = v.tok
    const t = v.beats[v.j]
    if (t === undefined) {
      v.fini = true
      return
    }
    v.entre = false
    v.limite = performance.now() + dureeEstimee(t) * 1.5 + 2500
    ambiance.current?.assourdir(true)
    html().dataset.robotParle = "1"
    parler(t, () => {
      if (v.tok !== tok) return
      if (v.j < v.beats.length - 1) {
        v.j++
        v.entre = true
        window.setTimeout(() => {
          if (v.tok === tok) direBeat()
        }, 320)
      } else {
        v.fini = true
        finVoixMarque()
      }
    })
  }
  /** Lance la lecture d'une suite de phrases, a partir de la phrase qui contient l'avancement p0. */
  const lireBeats = (beats: string[], debuts: number[], p0 = 0) => {
    const v = vx.current
    v.tok++
    taire()
    const on = sonRef.current && voixDisponible() && vitesse.current === 1 && beats.length > 0
    let j = 0
    for (let k = 0; k < beats.length; k++) if (debuts[k] <= p0 + 0.001) j = k
    Object.assign(v, { beats, debuts, j, actif: on, fini: !on, entre: false, limite: 0, pMax: p0 })
    if (on) direBeat()
    else finVoixMarque()
  }
  const demarrerBeats = (a: Arret, p0 = 0) => {
    let beats = a.beats ? a.beats() : []
    if (!beats.length) beats = [texte(a.phrase)]
    const n = beats.length
    const debuts = a.debuts && a.debuts.length === n + 1 ? a.debuts : Array.from({ length: n + 1 }, (_, k) => k / n)
    lireBeats(beats, debuts, p0)
  }
  /** Ou en est le balayage de l'arret a la position actuelle (0..1). */
  const pDepuisScroll = (a: Arret) => (a.y1 ? borne((window.scrollY - a.y0()) / ((a.y1() - a.y0()) || 1), 0, 1) : 0)
  /** Quand la voix cesse de piloter le balayage (son coupe, avance rapide), le minuteur reprend exactement la ou l'on est. */
  const passerAuTemps = () => {
    const s = m.current
    const a = s.liste[s.i]
    if (!a || !a.y1 || s.phase !== "balayer") return
    const p = pDepuisScroll(a)
    s.p0 = p
    s.ecoule = 0
    s.duree = a.duree * (1 - p)
  }
  /** Tant que la voix parle, la visite attend : on ne coupe jamais une phrase. (Pas pendant l'avance rapide.) */
  const voixOccupee = () => {
    const v = vx.current
    return sonRef.current && vitesse.current === 1 && v.actif && !v.fini && performance.now() < v.limite
  }
  /** Dans la demonstration, chaque etape est lue : tant que l'etape affichee n'a pas ete dite, la demonstration attend. */
  const demoEnAttente = () => {
    const s = m.current
    const a = s.liste[s.i]
    if (etatRef.current !== "lecture" || !sonRef.current || vitesse.current !== 1 || !voixDisponible() || a?.cle !== "demos") return false
    const d = q("#sec-demos .demo")
    return !!d && d.dataset.etape !== vx.current.demoE
  }
  const occupeeTotale = () => voixOccupee() || demoEnAttente()
  // La visite guidee d'une demonstration (demo-guide.tsx) demande ici si elle peut passer a l'etape suivante.
  useEffect(() => {
    const w = window as unknown as { __voixOccupee?: () => boolean }
    w.__voixOccupee = occupeeTotale
    return () => {
      delete w.__voixOccupee
    }
  })
  const demarrerSon = () => {
    if (!sonRef.current) return
    ambiance.current = ambiance.current ?? creerAmbiance()
    ambiance.current?.demarrer()
  }
  const couperSon = () => {
    arreterVoix()
    ambiance.current?.arreter()
  }
  const basculerSon = () => {
    const v = !sonRef.current
    sonRef.current = v
    setSon(v)
    try {
      localStorage.setItem("pa-son", v ? "1" : "0")
    } catch {}
    if (!v) {
      passerAuTemps()
      couperSon()
    } else if (etatRef.current === "lecture") {
      demarrerSon()
      const a = m.current.liste[m.current.i]
      if (a && m.current.phase !== "aller") demarrerBeats(a, pDepuisScroll(a))
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
    arreterVoix()
    vx.current.demoE = ""

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
    // La voix commence a l'arrivee (pendant le trajet, on ne dit rien) ; en reprise de balayage, a la phrase qui correspond.
    if (s.phase !== "aller") demarrerBeats(a, s.phase === "balayer" ? s.p0 : 0)
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
        demarrerBeats(a, 0)
      }
    } else if (s.phase === "balayer") {
      let k = borne(s.ecoule / (s.duree || 1), 0, 1)
      // Positions relues a chaque image : si la mise en page bouge (image chargee, police), on suit.
      let p = a.y1 ? lerp(s.p0, 1, k) : 0
      const v = vx.current
      if (a.y1 && v.actif) {
        // Le balayage est PILOTE par la voix : la position suit la phrase en cours, mot apres mot.
        if (!v.fini && performance.now() > v.limite) v.fini = true // garde-fou : une voix qui ne finit jamais ne bloque pas la visite
        const debut = v.debuts[v.j] ?? 0
        const fin = v.debuts[v.j + 1] ?? 1
        const pv = v.fini ? 1 : debut + (fin - debut) * (v.entre ? 0 : progression())
        p = Math.max(pv, v.pMax)
        v.pMax = p
        k = p >= 1 ? 1 : 0
      }
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
      // La demonstration est guidee a la voix : chaque etape est lue, et elle n'avance qu'une fois lue.
      const d = q("#sec-demos .demo")
      const e = d?.dataset.etape ?? ""
      if (d && sonRef.current && vitesse.current === 1 && voixDisponible() && e !== vx.current.demoE && !voixOccupee()) {
        vx.current.demoE = e
        const t = d.querySelector(".sr-only")?.textContent?.trim()
        if (t) lireBeats([t], [0, 1], 0)
      }
      if (((s.ecoule >= j.min && j.cond()) || s.ecoule >= j.max) && !occupeeTotale()) {
        s.phase = "apres"
        s.ecoule = 0
      }
      frac = 0.5
    } else {
      poser(a0)
      if (s.ecoule >= a.jusqua!.apres && !occupeeTotale()) suivant()
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
    // Le visiteur reprend la main : un petit air triste, comme un enfant a qui l'on retire son jeu.
    emotion("triste", 2200)
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
    emotion("content", 4200)
    setNarration({ n: s.liste.length, total: s.liste.length, titre: tr("Fin de la visite", "End of the tour"), phrase: tr("Merci de votre attention. Vous pouvez la relancer à tout moment.", "Thank you for your attention. You can restart it at any time.") })
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
    emotion("content", 1400)
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
    emotion("curieux", 900)
    vitesse.current = 2
    passerAuTemps()
    arreterVoix()
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
      if (a && m.current.phase !== "aller") demarrerBeats(a, pDepuisScroll(a))
    }
  }

  const debutRetour = () => {
    if (manoeuvre) return
    const s = m.current
    avantLecture.current = etatRef.current === "lecture"
    cancelAnimationFrame(s.raf)
    arreterVoix()
    window.clearTimeout(cacheFin.current)
    setFin(false)
    s.termine = false
    s.liste = ARRETS.filter((a) => a.ok?.() ?? true)
    if (!s.liste.length) return
    emotion("surpris", 900)
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

  // Si le visiteur change de langue en pleine visite, la phrase affichee et la voix suivent tout de suite.
  useEffect(
    () =>
      surLangue(() => {
        const s = m.current
        if (!s.liste.length) return
        if (s.termine) {
          setNarration((n) =>
            n && {
              ...n,
              titre: tr("Fin de la visite", "End of the tour"),
              phrase: tr("Merci de votre attention. Vous pouvez la relancer à tout moment.", "Thank you for your attention. You can restart it at any time."),
            },
          )
          return
        }
        if (etatRef.current === "repos") return
        montrer(s.i)
        if (etatRef.current === "lecture" && s.phase !== "aller") {
          const a = s.liste[s.i]
          if (a) demarrerBeats(a, pDepuisScroll(a))
        }
      }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
  )

  // Au repos, le bouton s'efface pendant que le visiteur fait defiler la page (il ne passe plus
  // sur le texte) et revient des que le defilement s'arrete.
  useEffect(() => {
    let t = 0
    // Encore sur l'accroche ? Sous 1280px, le bouton attend qu'on l'ait quittee (voir la feuille de style).
    const majHaut = () => {
      const v = window.scrollY < window.innerHeight * 0.6 ? "1" : "0"
      if (racine.current && racine.current.dataset.haut !== v) racine.current.dataset.haut = v
    }
    majHaut()
    const surScroll = () => {
      majHaut()
      const el = racine.current
      if (!el || etatRef.current === "lecture") return
      if (el.dataset.defile !== "1") el.dataset.defile = "1"
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
  // de lancer la visite a partir de la. Jamais pendant une visite, une seule fois par session, et elle se
  // retire seule au bout de 12 s : elle passe au-dessus des cartes, elle ne doit pas s'y installer.
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
        if (lu("pa-invite") === "1" || Number(lu("pa-invite-n") ?? 0) >= 1) return
        delai = window.setTimeout(() => {
          if (etatRef.current !== "repos" || inviteVue.current) return
          inviteVue.current = true
          emotion("curieux", 2600)
          ecrire("pa-invite-n", String(Number(lu("pa-invite-n") ?? 0) + 1))
          vueDepuis.current = performance.now()
          setInvite(true)
          plafondInvite.current = window.setTimeout(cacherInvite, 12000)
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
  const libelle = enCours
    ? t("Arrêter la présentation", "Stop the presentation")
    : entame
      ? t("Reprendre la présentation", "Resume the presentation")
      : t("Présentation automatique", "Automatic presentation")
  const R = 24
  const C = 2 * Math.PI * R

  return (
    <div className="pa" ref={racine} data-etat={etat} data-fin={fin ? "1" : "0"} data-invite={invite ? "1" : "0"} data-manoeuvre={manoeuvre ? "1" : "0"}>
      <div className="pa__carte" data-on={narration && (enCours || fin || manoeuvre) ? "1" : "0"} role="status" aria-live="polite">
        {narration ? (
          <>
            <p className="pa__etape">
              {fin ? t("Terminé", "Done") : `${t("Étape", "Step")} ${narration.n} / ${narration.total}`} · {narration.titre}
            </p>
            <p className="pa__phrase">{narration.phrase}</p>
          </>
        ) : null}
      </div>

      <div className="pa__rang">
        <div className="pa__invite" data-on={invite ? "1" : "0"} role="status" aria-hidden={invite ? undefined : true}>
          <button className="pa__invite-x" onClick={fermerInvite} aria-label={t("Fermer l'invitation", "Close the invitation")} tabIndex={invite ? 0 : -1}>
            <X size={14} />
          </button>
          <p className="pa__invite-k">{t("Visite guidée", "Guided tour")}</p>
          <p className="pa__invite-t">
            {t("Envie que je vous présente les projets ? Je vous guide pas à pas, à partir d'ici.", "Want me to walk you through the projects? I'll guide you step by step, from here.")}
          </p>
          <div className="pa__invite-a">
            <button className="pa__invite-go" onClick={basculer} tabIndex={invite ? 0 : -1}>
              <Play size={13} fill="currentColor" /> {t("Lancer la visite", "Start the tour")}
            </button>
            <button className="pa__invite-non" onClick={fermerInvite} tabIndex={invite ? 0 : -1}>
              {t("Plus tard", "Later")}
            </button>
          </div>
        </div>
        <div className="pa__menu">
          <button
            className="pa__pill"
            data-mode="retour"
            data-actif={manoeuvre === "retour" ? "1" : "0"}
            aria-label={t("Retour arrière : maintenir enfoncé", "Rewind: hold down")}
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
            <span>{t("Retour", "Rewind")}</span>
            <small>{t("maintenir", "hold")}</small>
          </button>
          <button
            className="pa__pill"
            data-mode="avance"
            data-actif={manoeuvre === "avance" ? "1" : "0"}
            aria-label={t("Avance rapide ×2 : maintenir enfoncé", "Fast forward ×2: hold down")}
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
            <small>{t("maintenir", "hold")}</small>
          </button>
          <button className="pa__recom" onClick={recommencer} aria-label={t("Recommencer la présentation depuis le début", "Restart the presentation from the beginning")} title={t("Recommencer", "Restart")}>
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
          aria-label={son ? t("Couper le son (voix et musique)", "Mute sound (voice and music)") : t("Activer le son (voix et musique)", "Turn sound on (voice and music)")}
          title={son ? t("Voix et musique : activées", "Voice and music: on") : t("Voix et musique : coupées", "Voice and music: off")}
        >
          {son ? <Volume2 size={13} /> : <VolumeX size={13} />}
        </button>
      </div>
    </div>
  )
}
