import type { ReactNode } from "react"

/**
 * En-tete de section, unique pour tout le site.
 *
 * Avant, la moitie des sections venait de v0 (span majuscule + h2 text-3xl) et
 * l'autre moitie des sections ecrites a la main (.rag__kicker + .rag__h2).
 * Deux langages visuels sur la meme page : c'est ce qui donnait l'impression
 * de patchwork. Tout passe desormais par ici.
 */
export function SectionHead({
  kicker,
  titre,
  lede,
  children,
  className = "",
}: {
  kicker?: string
  titre: ReactNode
  lede?: ReactNode
  children?: ReactNode
  className?: string
}) {
  return (
    <div className={`sec__tete ${className}`}>
      {kicker ? <p className="sec__kicker">{kicker}</p> : null}
      <h2 className="sec__h2">{titre}</h2>
      {lede ? <p className="sec__lede">{lede}</p> : null}
      {children}
    </div>
  )
}
