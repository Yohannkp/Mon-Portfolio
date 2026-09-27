"use client"

import { useEffect, useRef } from "react"

/**
 * Jauge de lecture fixee a gauche : la ligne conductrice du site.
 * Volontairement sans dependance d'animation — un simple rAF suffit,
 * et le resultat suit le scroll au pixel pres.
 */
export function ReadingRail() {
  const fillRef = useRef<HTMLDivElement>(null)
  const nodeRef = useRef<HTMLDivElement>(null)
  const pctRef = useRef<HTMLSpanElement>(null)

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
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => {
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
      </div>
    </div>
  )
}
