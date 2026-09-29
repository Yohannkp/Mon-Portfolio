"use client"

import { useEffect, useState } from "react"

/**
 * Le chiffre cle d'un projet. S'il commence par un nombre ("360", "0,88", "+15 %", "7 Md"),
 * il monte de 0 a sa valeur quand le projet apparait ; sinon ("MongoDB → SQLite") il s'affiche tel quel.
 * Le texte final est TOUJOURS celui de la donnee : l'animation ne fait que l'atteindre.
 */
const MOTIF = /^(\+?)(\d+(?:,\d+)?)(.*)$/

export function Chiffre({ valeur, actif }: { valeur: string; actif: boolean }) {
  const m = valeur.match(MOTIF)
  const cible = m ? parseFloat(m[2].replace(",", ".")) : 0
  const decimales = m && m[2].includes(",") ? m[2].split(",")[1].length : 0
  const [n, setN] = useState(m ? 0 : cible)

  useEffect(() => {
    if (!m || cible === 0) {
      setN(cible)
      return
    }
    if (!actif) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setN(cible)
      return
    }
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / 1400)
      setN(cible * (1 - Math.pow(1 - k, 3)))
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [actif, valeur])

  if (!m) return <>{valeur}</>
  const texte = n.toFixed(decimales).replace(".", ",")
  return (
    <>
      <span className="sr-only">{valeur}</span>
      <span aria-hidden="true">
        {m[1]}
        {texte}
        {m[3]}
      </span>
    </>
  )
}
