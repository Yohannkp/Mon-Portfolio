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
  const [fin, setFin] = useState(false)

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
    let dernierFin = false

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
    const peindre = (anime: boolean) => {
      const p = avancement()
      const { bx, by } = surLeChemin(p)
      if (anime) {
        vitesse = vitesse * 0.9 + brut * 0.01
        brut = 0
        angle += 0.12 + vitesse
        temps += 1
        el.style.setProperty("--bob", `${(Math.sin(temps / 52) * 9).toFixed(2)}px`)
      }
      // 0 = cube, 1 = robot ; la mutation se joue entre 8 % et 20 % de la page
      const mut = Math.min(Math.max((p - 0.08) / 0.12, 0), 1)
      el.style.setProperty("--prog", p.toFixed(4))
      el.style.setProperty("--mut", mut.toFixed(4))
      el.style.setProperty("--ry", `${(angle + p * 420).toFixed(2)}deg`)
      el.style.setProperty("--bx", `${bx.toFixed(2)}%`)
      el.style.setProperty("--by", `${by.toFixed(2)}%`)
      const s = sectionVue()
      const id = s?.id ?? "—"
      if (id !== dernierId) {
        dernierId = id
        setSection(s)
      }
      // Le robot se replie en bouton quand on ARRIVE dans la section contact,
      // pas a un pourcentage fixe de la page : le pied de page compte dans la
      // hauteur totale, et 94 % tombait encore deux sections plus haut.
      // On monte le lien seulement a ce moment-la : un lien invisible en
      // permanence serait atteignable au clavier sans rien donner a voir.
      const f = id === "sec-contact"
      if (f !== dernierFin) {
        dernierFin = f
        setFin(f)
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
      document.removeEventListener("visibilitychange", surReveil)
      window.removeEventListener("scroll", surDefilement)
      window.removeEventListener("resize", surDefilement)
      cancelAnimationFrame(rafId)
    }
  }, [])

  return (
    <div ref={racine} className={`obj ${section && !fin ? "obj--parle" : ""} ${fin ? "obj--bouton" : ""}`}>
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
      {fin ? (
        <Link href="/contact" className="obj__bouton">
          Me contacter
        </Link>
      ) : null}
    </div>
  )
}
