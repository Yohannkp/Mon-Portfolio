"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

/**
 * L'objet : un cube filaire qui devient un robot, et qui accompagne la lecture.
 *
 * Il est unique — il remplace a la fois le gros objet du hero et le petit
 * badge de coin. Dans le premier ecran c'est un cube ferme ; entre 8 % et 20 %
 * de la page il se resorbe pendant que le robot emerge de son noyau lumineux ;
 * ensuite il traverse l'ecran, monte et descend, et commente la section en cours.
 *
 * Le JS n'ecrit que quatre variables CSS sur un seul element. Le volume, la
 * mutation et la trajectoire sont calcules en CSS, donc composes par le GPU.
 */

/** Trajectoire : a quel avancement, a quelle distance du bord droit et a quelle hauteur. */
const CHEMIN = [
  { p: 0.0, bx: 7, by: 50 },
  { p: 0.2, bx: 4, by: 26 },
  { p: 0.36, bx: 13, by: 66 },
  { p: 0.52, bx: 4, by: 30 },
  { p: 0.68, bx: 14, by: 68 },
  { p: 0.84, bx: 5, by: 28 },
  { p: 1.0, bx: 10, by: 54 },
]

/** Ce que le robot dit, section par section. */
const SECTIONS = [
  {
    id: "sec-rag",
    nom: "Pièce maîtresse",
    dit: "Le chemin réel d'une question dans RAG-Local : réécriture, recherche hybride, reranking, réponse citée. Les chiffres affichés sont ceux du code.",
  },
  {
    id: "sec-chiffres",
    nom: "En chiffres",
    dit: "Ce qui existe vraiment — dépôts publics, stages effectués, projets en vitrine. Rien d'arrondi vers le haut.",
  },
  {
    id: "sec-stations",
    nom: "Projets",
    dit: "Six projets menés jusqu'au déploiement. Chacun résout un problème posé, pas un exercice de cours.",
  },
  {
    id: "sec-demos",
    nom: "Démonstrations",
    dit: "Quatre scénarios joués au clic. Rien n'est exécuté pour de vrai — ce sont des simulations, et elles le disent.",
  },
  {
    id: "sec-apropos",
    nom: "À propos",
    dit: "La chaîne complète : affiner un modèle, le servir derrière une API, le conteneuriser, le déployer.",
  },
  {
    id: "sec-competences",
    nom: "Compétences",
    dit: "Les technologies réellement pratiquées sur les projets d'à côté, pas une liste de mots-clés.",
  },
  { id: "sec-methode", nom: "Méthode", dit: "Comment je travaille, étape par étape, du problème posé à la mise en production." },
  { id: "sec-veille", nom: "Veille", dit: "Ce que j'apprends en ce moment, et pourquoi." },
  {
    id: "sec-contact",
    nom: "Contact",
    dit: "Stage de 4 à 6 mois à partir d'avril 2027. Le plus simple est de m'écrire directement.",
  },
]

/** Interpolation adoucie entre les deux points du chemin qui encadrent p. */
function surLeChemin(p: number) {
  let a = CHEMIN[0]
  let b = CHEMIN[CHEMIN.length - 1]
  for (let i = 0; i < CHEMIN.length - 1; i++) {
    if (p >= CHEMIN[i].p && p <= CHEMIN[i + 1].p) {
      a = CHEMIN[i]
      b = CHEMIN[i + 1]
      break
    }
  }
  const etendue = b.p - a.p
  const t = etendue > 0 ? (p - a.p) / etendue : 0
  const d = t * t * (3 - 2 * t) // pas de cassure au passage d'un point a l'autre
  return { bx: a.bx + (b.bx - a.bx) * d, by: a.by + (b.by - a.by) * d }
}

export function Objet3D() {
  const racine = useRef<HTMLDivElement>(null)
  const [section, setSection] = useState<(typeof SECTIONS)[number] | null>(null)
  // Le robot DEVIENT le bouton : on monte le lien quand il commence a se poser.
  const [pilule, setPilule] = useState(false)

  useEffect(() => {
    const el = racine.current
    if (typeof window === "undefined" || !el) return
    const fige = window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let angle = 0
    let vitesse = 0
    let dernierY = window.scrollY
    let brut = 0
    let temps = 0
    let rafId = 0
    let dernierId = "—"
    let dernierePilule = false

    const avancement = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      return max > 0 ? Math.min(Math.max(window.scrollY / max, 0), 1) : 0
    }

    /** La section qui OCCUPE le plus l'ecran — pas celle qui touche son milieu :
     *  une section plus courte que la fenetre donnerait un commentaire en avance. */
    const sectionVue = () => {
      const H = window.innerHeight
      let trouvee: (typeof SECTIONS)[number] | null = null
      let surface = H * 0.3
      for (const s of SECTIONS) {
        const n = document.getElementById(s.id)
        if (!n) continue
        const r = n.getBoundingClientRect()
        const vu = Math.min(r.bottom, H) - Math.max(r.top, 0)
        if (vu > surface) {
          surface = vu
          trouvee = s
        }
      }
      return trouvee
    }

    /** Appele par la boucle ET par le defilement : les evenements de defilement
     *  continuent d'arriver quand le navigateur suspend les images (onglet en
     *  arriere-plan, fenetre reduite), les images non. Sans ce second appel,
     *  on revient sur l'onglet et le robot commente encore la section d'avant. */
    /** L'atterrissage.
     *
     *  Le robot ne se pose pas A COTE du bouton : il EST le bouton. L'element
     *  de la section contact ne sert que d'emplacement — il reserve la place
     *  dans la mise en page et donne la mesure exacte a viser. Il reste visible
     *  tant que le robot n'a pas commence a se poser (ecran etroit, mouvement
     *  reduit, JS en echec) : sans ce garde-fou, une panne du robot laisserait
     *  la page sans aucun bouton de contact.
     */
    const viserLaCible = () => {
      const cible = document.querySelector<HTMLElement>("[data-cible-robot]")
      if (!cible) return null
      const r = cible.getBoundingClientRect()
      if (r.width === 0) return null
      const H = window.innerHeight
      // Deux rampes, et on garde la plus avancee des deux.
      //
      // 1. la position : la descente commence quand l'emplacement entre par le
      //    bas de l'ecran.
      const parPosition = Math.min(Math.max((H * 0.95 - r.top) / (H * 0.4), 0), 1)
      // 2. le fond de page : l'emplacement est dans la DERNIERE section, donc
      //    il ne remonte jamais assez haut pour que la rampe 1 atteigne 1 —
      //    mesure ici, elle plafonnait a 0,89, et le robot restait suspendu a
      //    mi-chemin, visible derriere une pilule a 89 % d'opacite.
      const reste = document.documentElement.scrollHeight - window.scrollY - H
      const parLaFin = Math.min(Math.max(1 - reste / (H * 0.5), 0), 1)
      const t = Math.max(parPosition, parLaFin)
      if (t <= 0) return null
      const cx = r.left + r.width / 2
      const cy = r.top + r.height / 2
      // clientWidth, PAS innerWidth : innerWidth compte la barre de defilement,
      // que le positionnement CSS ignore. L'ecart mesure faisait exactement ses
      // 15 px, et le robot se posait a cote du bouton.
      const largeur = document.documentElement.clientWidth
      // .obj fait 340 de large, ancre par son bord droit, et sa hauteur est
      // compensee par margin-top:-170 — son centre est donc a (largeur - bx - 170, by).
      return { pose: t, bx: largeur - cx - 170, by: cy, l: r.width, h: r.height }
    }

    const peindre = (anime: boolean) => {
      const p = avancement()
      // 0 = cube, 1 = robot ; la mutation se joue entre 8 % et 20 % de la page
      const mutPrecalc = Math.min(Math.max((p - 0.08) / 0.12, 0), 1)
      el.style.setProperty("--mut", mutPrecalc.toFixed(4))
      let { bx, by } = surLeChemin(p)
      let bxPx: number | null = null
      let byPx: number | null = null
      let pose = 0
      let pil = 0
      const cible = viserLaCible()
      if (cible) {
        pose = cible.pose
        const d = pose * pose * (3 - 2 * pose)
        // on melange la trajectoire libre et la cible, en pixels
        const bxLibre = (bx / 100) * document.documentElement.clientWidth
        const byLibre = (by / 100) * document.documentElement.clientHeight
        bxPx = bxLibre + (cible.bx - bxLibre) * d
        byPx = byLibre + (cible.by - byLibre) * d
        // La pilule prend le relais sur la derniere moitie de la descente.
        const q = Math.min(Math.max((pose - 0.45) / 0.55, 0), 1)
        pil = q * q * (3 - 2 * q)
        // Elle adopte la taille exacte de l'emplacement qu'elle remplace.
        el.style.setProperty("--pl", `${cible.l.toFixed(1)}px`)
        el.style.setProperty("--ph", `${cible.h.toFixed(1)}px`)
      }
      // L'echelle de l'objet revient a 1 quand la pilule prend le dessus, pour
      // qu'elle s'affiche a sa taille reelle et non a celle du robot reduit.
      const echRobot = 1 - mutPrecalc * 0.36
      el.style.setProperty("--ech", (echRobot + (1 - echRobot) * pil).toFixed(4))
      el.style.setProperty("--pilule", pil.toFixed(4))
      if (pil > 0.05 !== dernierePilule) {
        dernierePilule = pil > 0.05
        setPilule(dernierePilule)
        // L'emplacement ne s'efface qu'une fois le robot en train de se poser.
        // Tant qu'il ne se passe rien, le bouton de la page reste visible :
        // une panne du robot ne doit pas priver la page de son bouton.
        document.documentElement.dataset.robotPose = dernierePilule ? "1" : "0"
      }
      if (anime) {
        vitesse = vitesse * 0.9 + brut * 0.01
        brut = 0
        angle += 0.12 + vitesse
        temps += 1
        el.style.setProperty("--bob", `${(Math.sin(temps / 52) * 9).toFixed(2)}px`)
      }
      el.style.setProperty("--prog", p.toFixed(4))
      el.style.setProperty("--ry", `${(angle + p * 420).toFixed(2)}deg`)
      el.style.setProperty("--bx", bxPx === null ? `${bx.toFixed(2)}%` : `${bxPx.toFixed(1)}px`)
      el.style.setProperty("--by", byPx === null ? `${by.toFixed(2)}%` : `${byPx.toFixed(1)}px`)
      el.style.setProperty("--pose", pose.toFixed(4))
      const s = pose > 0.25 ? null : sectionVue()
      const id = s?.id ?? "—"
      if (id !== dernierId) {
        dernierId = id
        setSection(s)
      }
    }

    const surDefilement = () => {
      const y = window.scrollY
      brut += Math.min(Math.abs(y - dernierY), 90) // plafonne : un saut d'ancre ne doit pas faire exploser l'objet
      dernierY = y
      peindre(false)
    }

    const boucle = () => {
      peindre(true)
      rafId = requestAnimationFrame(boucle)
    }

    // Au retour sur l'onglet : le navigateur a suspendu les images et les
    // evenements pendant l'absence, et la position a pu changer entre-temps.
    // Sans ce rattrapage, l'objet reprend dans l'etat qu'il avait en partant.
    const surReveil = () => {
      if (document.visibilityState === "visible") {
        dernierY = window.scrollY
        peindre(false)
      }
    }
    document.addEventListener("visibilitychange", surReveil)
    window.addEventListener("scroll", surDefilement, { passive: true })
    window.addEventListener("resize", surDefilement, { passive: true })
    peindre(false) // juste des la premiere peinture, sans attendre une image
    if (!fige) rafId = requestAnimationFrame(boucle)
    return () => {
      delete document.documentElement.dataset.robotPose
      document.removeEventListener("visibilitychange", surReveil)
      window.removeEventListener("scroll", surDefilement)
      window.removeEventListener("resize", surDefilement)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={racine} className={`obj ${section ? "obj--parle" : ""}`}>
      <div className="obj__halo" aria-hidden="true" />
      <div className="obj__scene" aria-hidden="true">
        <div className="obj__cube">
          <div className="obj__f" />
          <div className="obj__f" />
          <div className="obj__f" />
          <div className="obj__f" />
          <div className="obj__f" />
          <div className="obj__f" />
        </div>
        <div className="obj__coeur">
          <div className="obj__d" />
          <div className="obj__d" />
          <div className="obj__d" />
        </div>
        <div className="obj__bot">
          <div className="obj__antenne" />
          <div className="obj__tete" />
          <div className="obj__visiere">
            <span className="obj__oeil obj__oeil--g" />
            <span className="obj__oeil obj__oeil--d" />
          </div>
          <div className="obj__anneau" />
        </div>
        <div className="obj__noyau" />
      </div>
      <div className="obj__bulle" aria-hidden="true">
        <b>{section?.nom ?? ""}</b>
        <span>{section?.dit ?? ""}</span>
      </div>
      {pilule ? (
        <Link href="/contact" className="obj__pilule">
          Me contacter
        </Link>
      ) : null}
    </div>
  )
}
