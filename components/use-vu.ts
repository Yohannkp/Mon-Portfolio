"use client"

import { useEffect, useRef, useState } from "react"

/**
 * Vrai quand l'element est entre dans le champ de vision (et le reste : on n'anime qu'une fois).
 * Sans IntersectionObserver, ou avec prefers-reduced-motion, on considere l'element vu tout de suite :
 * un contenu ne doit jamais dependre d'une animation pour exister.
 */
export function useVu<T extends HTMLElement>(seuil = 0.25) {
  const ref = useRef<T>(null)
  const [vu, setVu] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (typeof IntersectionObserver === "undefined" || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setVu(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVu(true)
          io.disconnect()
        }
      },
      { threshold: seuil, rootMargin: "0px 0px -8% 0px" },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [seuil])
  return [ref, vu] as const
}
