"use client"

import type { CSSProperties, ReactNode } from "react"
import { cn } from "@/lib/utils"
import { useVu } from "@/components/use-vu"

/**
 * L'apparition d'un bloc quand il entre dans l'ecran (fondu + leger glissement), en CSS pur :
 * un IntersectionObserver pose data-vu, une transition fait le reste (voir .rv dans globals.css).
 * Meme rendu qu'avant, mais sans embarquer toute la bibliotheque d'animation sur la page : ces animations
 * n'ont besoin que de opacity et transform, que le navigateur sait deja faire sur son compositeur.
 */
export function Reveal({
  y = 20,
  duration = 0.5,
  delay = 0,
  className,
  children,
}: {
  y?: number
  duration?: number
  delay?: number
  className?: string
  children: ReactNode
}) {
  const [ref, vu] = useVu<HTMLDivElement>(0)
  return (
    <div
      ref={ref}
      className={cn("rv", className)}
      data-vu={vu ? "1" : "0"}
      style={{ "--rv-y": `${y}px`, "--rv-d": `${duration}s`, "--rv-delay": `${delay}s` } as CSSProperties}
    >
      {children}
    </div>
  )
}
