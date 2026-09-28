"use client"

import { useEffect } from "react"

/**
 * Inclinaison 3D partagee.
 *
 * Un seul ecouteur pour toute la page : on ne pose pas un listener par carte.
 * On ecrit des variables CSS (--rx, --ry, --mx, --my, --brillance) que
 * `.carte--3d` consomme ; toute la transformation reste dans la CSS, donc
 * composee par le GPU.
 *
 * Rien ne se declenche sous `prefers-reduced-motion`, ni sur un ecran tactile
 * (pointer: coarse), ou l'effet n'aurait aucun sens.
 */
export function Tilt3D() {
  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return
    if (window.matchMedia("(pointer: coarse)").matches) return

    const AMPLITUDE = 5 // degres, volontairement faible : on suggere le relief, on ne le joue pas
    let brut: { carte: HTMLElement; x: number; y: number } | null = null
    let programme = false

    const peindre = () => {
      programme = false
      if (!brut) return
      const { carte, x, y } = brut
      const r = carte.getBoundingClientRect()
      const px = (x - r.left) / r.width
      const py = (y - r.top) / r.height
      carte.style.setProperty("--ry", `${(px - 0.5) * 2 * AMPLITUDE}deg`)
      carte.style.setProperty("--rx", `${(0.5 - py) * 2 * AMPLITUDE}deg`)
      carte.style.setProperty("--mx", `${px * 100}%`)
      carte.style.setProperty("--my", `${py * 100}%`)
      carte.style.setProperty("--brillance", "1")
    }

    const surMouvement = (e: PointerEvent) => {
      const cible = (e.target as HTMLElement | null)?.closest?.(".carte--3d") as HTMLElement | null
      if (!cible) return
      brut = { carte: cible, x: e.clientX, y: e.clientY }
      if (!programme) {
        programme = true
        requestAnimationFrame(peindre)
      }
    }

    const surSortie = (e: PointerEvent) => {
      const cible = (e.target as HTMLElement | null)?.closest?.(".carte--3d") as HTMLElement | null
      if (!cible) return
      cible.style.setProperty("--rx", "0deg")
      cible.style.setProperty("--ry", "0deg")
      cible.style.setProperty("--brillance", "0")
    }

    document.addEventListener("pointermove", surMouvement, { passive: true })
    document.addEventListener("pointerout", surSortie, { passive: true })
    return () => {
      document.removeEventListener("pointermove", surMouvement)
      document.removeEventListener("pointerout", surSortie)
    }
  }, [])

  return null
}
