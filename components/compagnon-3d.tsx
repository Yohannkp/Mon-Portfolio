"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Le compagnon : un petit objet 3D fixe, en bas a droite, qui suit la lecture.
 *
 * Il ne flotte pas pour flotter — il sert de reperage. Sa forme change selon
 * la section traversee et son etiquette la nomme, donc le visiteur sait
 * toujours ou il en est. Il reagit aussi a la vitesse de defilement : plus on
 * descend vite, plus il tourne vite, puis il revient a son rythme de croisiere.
 *
 * Cout : une seule boucle rAF qui ecrit UNE propriete transform, et un
 * Pas de dependance, pas de canvas, pas de WebGL, pas d'observateur.
 * Il disparait sous 1200px, sous prefers-reduced-motion, et dans le hero
 * (ou le grand objet occupe deja la place).
 */

type Forme = "index" | "chaine" | "treillis" | "noyau"

/** Chaque section porte un id ; on associe id -> forme + etiquette. */
const ETAPES: { id: string; forme: Forme; nom: string }[] = [
  { id: "sec-rag", forme: "index", nom: "Pièce maîtresse" },
  { id: "sec-chiffres", forme: "index", nom: "En chiffres" },
  { id: "sec-stations", forme: "chaine", nom: "Projets" },
  { id: "sec-demos", forme: "chaine", nom: "Démonstrations" },
  { id: "sec-apropos", forme: "treillis", nom: "À propos" },
  { id: "sec-competences", forme: "treillis", nom: "Compétences" },
  { id: "sec-methode", forme: "treillis", nom: "Méthode" },
  { id: "sec-veille", forme: "treillis", nom: "Veille" },
  { id: "sec-contact", forme: "noyau", nom: "Contact" },
]

export function Compagnon3D() {
  const racine = useRef<HTMLDivElement>(null)
  const scene = useRef<HTMLDivElement>(null)
  const [etape, setEtape] = useState<number>(-1)

  // --- Rotation, vitesse, et section courante : une seule boucle ----------
  //
  // Volontairement SANS IntersectionObserver. On calcule la section active a
  // partir de la position de defilement, dans la boucle qui tourne deja : c'est
  // une poignee de getBoundingClientRect toutes les six images, et surtout ca
  // marche dans tous les etats de rendu (un observateur, lui, se met en pause
  // quand l'onglet ou la fenetre ne peint plus, et l'objet resterait fige).
  useEffect(() => {
    const el = scene.current
    if (typeof window === "undefined" || !el) return
    const douce = !window.matchMedia("(prefers-reduced-motion: reduce)").matches

    let angle = 0
    let vitesse = 0
    let dernierY = window.scrollY
    let brut = 0
    let image = 0
    let rafId = 0
    let derniereEtape = -2

    const majEtape = () => {
      const e = quelleEtape()
      if (e !== derniereEtape) {
        derniereEtape = e
        setEtape(e)
      }
    }

    const surDefilement = () => {
      const y = window.scrollY
      // on plafonne : un saut d'ancre ne doit pas faire exploser l'objet
      brut += Math.min(Math.abs(y - dernierY), 90)
      dernierY = y
      // La forme se met a jour ici AUSSI, pas seulement dans la boucle : les
      // evenements de defilement arrivent meme quand le navigateur suspend les
      // images (onglet en arriere-plan, fenetre reduite). Sans ca, on revient
      // sur l'onglet et le compagnon affiche encore la section d'avant.
      majEtape()
    }

    // On retient la section qui OCCUPE le plus l'ecran, pas celle qui touche
    // son milieu : avec des sections plus courtes que la fenetre, le milieu
    // tombe deja dans la suivante et l'etiquette a un temps d'avance.
    const quelleEtape = () => {
      const haut = window.innerHeight
      let meilleur = -1
      let surface = haut * 0.25 // en dessous d'un quart d'ecran, on ne nomme rien
      ETAPES.forEach((et, i) => {
        const n = document.getElementById(et.id)
        if (!n) return
        const r = n.getBoundingClientRect()
        const vu = Math.min(r.bottom, haut) - Math.max(r.top, 0)
        if (vu > surface) {
          surface = vu
          meilleur = i
        }
      })
      return meilleur
    }

    const boucle = () => {
      if (douce) {
        vitesse = vitesse * 0.92 + brut * 0.012
        brut = 0
        angle += 0.16 + vitesse
        el.style.transform = `rotateX(-22deg) rotateY(${angle}deg)`
      }
      if (image++ % 6 === 0) majEtape()
      rafId = requestAnimationFrame(boucle)
    }

    window.addEventListener("scroll", surDefilement, { passive: true })
    window.addEventListener("resize", majEtape, { passive: true })
    majEtape() // position correcte des la premiere peinture, sans attendre une image
    rafId = requestAnimationFrame(boucle)
    return () => {
      window.removeEventListener("scroll", surDefilement)
      window.removeEventListener("resize", majEtape)
      cancelAnimationFrame(rafId)
    }
  }, [])

  const courant = etape >= 0 ? ETAPES[etape] : null

  return (
    <div
      ref={racine}
      className={`comp ${courant ? "comp--visible" : ""}`}
      data-forme={courant?.forme ?? "index"}
      aria-hidden="true"
    >
      <div className="comp__objet">
        <div ref={scene} className="comp__scene">
          {/* index : trois plans empiles — les couches de l'index */}
          <div className="comp__f comp__f--index" />
          <div className="comp__f comp__f--index" />
          <div className="comp__f comp__f--index" />
          {/* chaine : trois boites alignees — les etapes d'un projet */}
          <div className="comp__b comp__b--chaine" />
          <div className="comp__b comp__b--chaine" />
          <div className="comp__b comp__b--chaine" />
          {/* treillis : trois carres orthogonaux — la structure */}
          <div className="comp__t comp__t--treillis" />
          <div className="comp__t comp__t--treillis" />
          <div className="comp__t comp__t--treillis" />
          {/* noyau : le point qui reste, toujours la */}
          <div className="comp__noyau" />
        </div>
      </div>
      <span className="comp__nom">{courant?.nom ?? ""}</span>
    </div>
  )
}
