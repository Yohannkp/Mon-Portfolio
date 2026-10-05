"use client"

import { useEffect, useState } from "react"
import { useDossiers } from "@/lib/dossiers-langue"
import { useT } from "@/lib/langue"

/**
 * Le sommaire collant de /projects : quatre axes, celui qu'on lit est marque.
 * Remplace le mur de filtres techniques : on choisit ce qu'on veut verifier, pas une techno.
 */
export function NavAxes() {
  const { AXES, dossiersParAxe } = useDossiers()
  const t = useT()
  const [actif, setActif] = useState<string>(AXES[0].id)

  useEffect(() => {
    const sections = AXES.map((a) => document.getElementById(a.id)).filter(Boolean) as HTMLElement[]
    if (!sections.length || typeof IntersectionObserver === "undefined") return
    const io = new IntersectionObserver(
      (entrees) => {
        // Le premier axe dont le haut est passe sous la ligne de lecture.
        const visibles = entrees.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)
        if (visibles[0]) setActif(visibles[0].target.id)
      },
      { rootMargin: "-140px 0px -60% 0px", threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [AXES])

  return (
    <nav className="axes-nav" aria-label={t("Les axes", "The themes")}>
      {AXES.map((a) => (
        <a key={a.id} href={`#${a.id}`} data-actif={actif === a.id ? "1" : "0"} onClick={() => setActif(a.id)}>
          {a.titre} <span>{dossiersParAxe(a.id).length}</span>
        </a>
      ))}
    </nav>
  )
}
