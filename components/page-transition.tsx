"use client"

import { useEffect, useRef } from "react"
import { usePathname, useRouter } from "next/navigation"

/**
 * Transition entre les pages : la page sort, une fine barre indique qu'on
 * charge, puis la suivante entre en cascade.
 *
 * Tout passe par des attributs sur <html> que le CSS anime (voir globals.css) :
 *   data-leaving   la page actuelle se retire
 *   data-nav       a / b, alterne a chaque page pour rejouer l'entree
 *
 * Choix d'ingenierie :
 * - Rien n'entoure le contenu de la page. Un parent avec `transform` ou `filter`
 *   deviendrait le repere des elements fixes : le robot et le rail sauteraient.
 *   Les animations d'entree ne visent donc que les sections elles-memes.
 * - Le clic n'est intercepte que pour un lien interne ordinaire vers une AUTRE
 *   page. Ctrl/Cmd/Maj, clic milieu, target, download et ancres passent
 *   normalement, comme le retour arriere du navigateur.
 * - Si la navigation n'aboutit pas, la page se reaffiche seule apres 2,5 s :
 *   on ne peut jamais rester bloque sur une page blanche.
 */
const SORTIE_MS = 220

export function PageTransition() {
  const pathname = usePathname()
  const router = useRouter()
  const precedent = useRef(pathname)
  const filet = useRef(0)
  const reduit = useRef(false)

  useEffect(() => {
    const html = document.documentElement
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)")
    reduit.current = mq.matches
    const surMq = () => (reduit.current = mq.matches)
    mq.addEventListener("change", surMq)

    const surClic = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
      const a = (e.target as Element | null)?.closest?.("a")
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.hasAttribute("data-sans-transition")) return
      const url = new URL(a.href, window.location.href)
      if (url.origin !== window.location.origin) return
      if (url.pathname === window.location.pathname) return // meme page : ancre ou rien
      if (reduit.current) return // navigation immediate, sans mise en scene

      e.preventDefault()
      e.stopPropagation()
      html.dataset.leaving = "1"
      window.clearTimeout(filet.current)
      window.setTimeout(() => router.push(url.pathname + url.search + url.hash), SORTIE_MS)
      filet.current = window.setTimeout(() => delete html.dataset.leaving, 2500)
    }

    // En capture : on passe avant le routeur, qui naviguerait sans attendre la sortie.
    document.addEventListener("click", surClic, true)
    return () => {
      document.removeEventListener("click", surClic, true)
      mq.removeEventListener("change", surMq)
      window.clearTimeout(filet.current)
    }
  }, [router])

  // La nouvelle page est la : on rejoue l'entree et on leve le voile.
  useEffect(() => {
    if (pathname === precedent.current) return
    precedent.current = pathname
    const html = document.documentElement
    window.clearTimeout(filet.current)
    html.dataset.nav = html.dataset.nav === "a" ? "b" : "a"
    delete html.dataset.leaving
  }, [pathname])

  return null
}
