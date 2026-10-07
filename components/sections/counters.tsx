"use client"

import { useEffect, useRef } from "react"
import { NB_PHARES } from "@/lib/dossiers"
import { useT } from "@/lib/langue"

const CHIFFRES = [
  { valeur: 23, suffixe: "", fr: "Dépôts actifs", en: "Active repositories" },
  { valeur: 2, suffixe: "", fr: "Stages en entreprise", en: "Company internships" },
  { valeur: NB_PHARES, suffixe: "", fr: "Projets en vitrine", en: "Featured projects" },
  // Vrai pour RAG-Local seulement : ApplyFlow, Salifort ou MiniSearch sont heberges en ligne.
  { valeur: 100, suffixe: " %", fr: "RAG-Local, sans cloud", en: "RAG-Local, no cloud" },
]

export function Counters() {
  const t = useT()
  const racine = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = racine.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let annule = false
    const observateurs: IntersectionObserver[] = []

    import("animejs")
      .then(({ animate }) => {
        if (annule || !racine.current) return
        el.querySelectorAll<HTMLElement>("[data-valeur]").forEach((cible) => {
          const fin = Number(cible.dataset.valeur)
          const suffixe = cible.dataset.suffixe ?? ""
          const compteur = { v: 0 }
          const io = new IntersectionObserver(
            (entrees) => {
              entrees.forEach((e) => {
                if (!e.isIntersecting) return
                io.disconnect()
                animate(compteur, {
                  v: fin,
                  duration: 1500,
                  ease: "out(4)",
                  onUpdate: () => {
                    cible.textContent = Math.round(compteur.v) + suffixe
                  },
                  onComplete: () => {
                    cible.textContent = fin + suffixe
                  },
                })
              })
            },
            { threshold: 0.4 },
          )
          io.observe(cible)
          observateurs.push(io)
        })
      })
      .catch(() => {
        /* les valeurs finales sont deja dans le HTML */
      })

    return () => {
      annule = true
      observateurs.forEach((o) => o.disconnect())
    }
  }, [])

  return (
    <section id="sec-chiffres" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="rag__kicker">{t("En chiffres", "By the numbers")}</p>
        <h2 className="rag__h2">{t("Ce qui existe vraiment", "What really exists")}</h2>
        <div className="compteurs" ref={racine}>
          {CHIFFRES.map((c) => (
            <div className="compteur" key={c.fr}>
              <b data-valeur={c.valeur} data-suffixe={c.suffixe}>
                {c.valeur}
                {c.suffixe}
              </b>
              <span>{t(c.fr, c.en)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
