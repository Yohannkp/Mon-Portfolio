"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowRight, Download } from "lucide-react"
import type { EasingParam } from "animejs"
import { Button } from "@/components/ui/button"
import { CV_URL } from "@/lib/contact"
import { useT } from "@/lib/langue"

const TITRE_1 = "MLOps & Machine Learning Engineering"
const TITRE_2 = {
  fr: "J'affine des modèles, je les mets en production, et je sais prouver qu'ils marchent.",
  en: "I fine-tune models, I put them into production, and I can prove they work.",
}

/** Decoupe une phrase en mots enveloppes, pour les animer un par un. */
function Mots({ texte, className }: { texte: string; className?: string }) {
  return (
    <span className={className}>
      {texte.split(" ").map((mot, i) => (
        <span className="mot-masque" key={`${mot}-${i}`}>
          <span className="mot">{mot}</span>
          {i < texte.split(" ").length - 1 ? " " : ""}
        </span>
      ))}
    </span>
  )
}

export function Hero() {
  const racine = React.useRef<HTMLElement>(null)
  const t = useT()

  React.useEffect(() => {
    const el = racine.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let annule = false
    // Regle de securite : l'etat de repos du titre est VISIBLE. On anime depuis
    // l'invisible avec des images-cles, jamais en masquant d'abord — si anime.js
    // ne se charge pas ou echoue, le titre reste lisible au lieu de disparaitre.
    import("animejs")
      .then((A) => {
        if (annule || !racine.current) return
        const ressort = (A.spring ?? A.createSpring) as (o: object) => EasingParam
        const mots = el.querySelectorAll(".mot")
        const suite = el.querySelectorAll("[data-apres]")

        A.animate(mots, {
          opacity: [0, 1],
          y: ["0.5em", "0em"],
          ease: ressort({ stiffness: 105, damping: 16 }),
          delay: A.stagger(38),
        })
        A.animate(suite, {
          opacity: [0, 1],
          y: [16, 0],
          duration: 760,
          ease: "out(3)",
          delay: A.stagger(110, { start: 520 }),
        })
      })
      .catch(() => {
        /* rien a faire : tout est deja visible */
      })

    return () => {
      annule = true
    }
  }, [])

  return (
    <section ref={racine} className="relative overflow-hidden">
      <div className="pointer-events-none absolute inset-0 overflow-hidden" style={{ zIndex: -1 }}>
        <div className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="hero-grille" />

      </div>

      <div className="mx-auto max-w-6xl px-6 py-16 sm:py-24 md:py-32" style={{ position: "relative", zIndex: 1 }}>
        <div className="flex flex-col items-start gap-6 sm:gap-8">
          <div data-apres>
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
              </span>
              {t("Stage de 4 à 6 mois — à partir d'avril 2027", "4–6 month internship — starting April 2027")}
            </span>
          </div>

          <h1 className="max-w-3xl text-3xl font-semibold leading-tight tracking-tight text-balance sm:text-4xl md:text-5xl lg:text-6xl">
            <Mots texte={TITRE_1} />
            <Mots texte={t(TITRE_2.fr, TITRE_2.en)} className="mt-2 block text-2xl font-semibold text-muted-foreground sm:text-4xl md:text-5xl lg:text-6xl" />
          </h1>

          <p data-apres className="max-w-2xl text-base leading-relaxed text-muted-foreground sm:text-lg md:text-xl">
            {t(
              "Élève ingénieur Big Data & IA à l'ECE Paris. Ce qui m'intéresse est la chaîne complète : affiner un modèle, le servir derrière une API, le conteneuriser et le déployer de façon reproductible. Deux stages en développement, dont un en Go sur un système déjà en production.",
              "Big Data & AI engineering student at ECE Paris. What interests me is the full chain: fine-tuning a model, serving it behind an API, containerising it and deploying it reproducibly. Two development internships, one of them in Go on a system already in production.",
            )}
          </p>

          <div data-apres className="flex flex-wrap gap-4">
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                {t("Voir mes projets", "See my projects")}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <Link href="/contact">{t("Me contacter", "Contact me")}</Link>
            </Button>
            <Button asChild variant="ghost" size="lg" className="gap-2">
              <a href={CV_URL} download>
                <Download className="h-4 w-4" />
                {t("Télécharger mon CV", "Download my CV (in French)")}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
