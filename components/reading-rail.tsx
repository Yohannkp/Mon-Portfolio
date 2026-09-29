"use client"

import { useEffect, useRef } from "react"

/**
 * Le trajet d'un modele, de la donnee au deploiement. Le robot publie sa scene
 * (data-robot-scene sur <html>) ; le rail la traduit en etape.
 * Sans robot (ecran etroit, JS en echec), l'attribut est absent : on n'affiche que le pourcentage.
 */
const ETAPES: Record<string, string> = {
  hero: "Données",
  "sec-rag": "Recherche",
  "sec-chiffres": "Mesures",
  "sec-stations": "Projets",
  "sec-demos": "Inférence",
  "sec-apropos": "Contexte",
  "sec-competences": "Preuves",
  "sec-methode": "Méthode",
  "sec-veille": "Veille",
  "sec-contact": "Déploiement",
}
const CLES = Object.keys(ETAPES)

/**
 * Jauge de lecture fixee a gauche : la ligne conductrice du site.
 * Volontairement sans dependance d'animation — un simple rAF suffit,
 * et le resultat suit le scroll au pixel pres.
 */
export function ReadingRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)
  const etapeRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    let raf = 0
    const update = () => {
      raf = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      const top = p * window.innerHeight
      if (fillRef.current) fillRef.current.style.height = `${top}px`
      if (nodeRef.current) nodeRef.current.style.transform = `translateY(${top}px)`
      if (pctRef.current) pctRef.current.textContent = `${String(Math.round(p * 100)).padStart(2, "0")}%`
      const scene = document.documentElement.dataset.robotScene
      if (etapeRef.current) {
        const i = scene ? CLES.indexOf(scene) : -1
        const texte = i >= 0 ? `${String(i + 1).padStart(2, "0")} · ${ETAPES[scene!]}` : ""
        if (etapeRef.current.textContent !== texte) etapeRef.current.textContent = texte
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    // Le robot annonce sa scene apres le premier rendu : on relit alors l'etape.
    const obs = new MutationObserver(onScroll)
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-robot-scene"] })
    return () => {
      obs.disconnect()
      window.removeEventListener("scroll", onScroll)
      window.removeEventListener("resize", onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <div className="rail" aria-hidden="true">
      <div className="rail__track" />
      <div className="rail__fill" ref={fillRef} />
      <div className="rail__node" ref={nodeRef}>
        <span className="rail__pct" ref={pctRef}>
          00%
        </span>
        <span className="rail__etape" ref={etapeRef} />
      </div>
    </div>
  )
}
