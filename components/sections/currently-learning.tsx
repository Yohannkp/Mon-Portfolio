"use client"

import { Reveal } from "@/components/reveal"
import { BookOpen } from "lucide-react"
import { useT } from "@/lib/langue"

const learningItems = [
  {
    title: ["LLMOps & Déploiement de modèles", "LLMOps & model deployment"],
    description: ["CI/CD ML, monitoring, drift et inference en production", "ML CI/CD, monitoring, drift and inference in production"],
  },
  {
    title: ["Architecture", "Architecture"],
    description: ["Clean Architecture et Domain-Driven Design", "Clean Architecture and Domain-Driven Design"],
  },
  {
    title: ["DevOps", "DevOps"],
    description: ["CI/CD avec GitHub Actions, Docker en production", "CI/CD with GitHub Actions, Docker in production"],
  },
]

export function CurrentlyLearning() {
  const t = useT()
  return (
    <section id="sec-veille" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5} className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">{t("En ce moment j'apprends...", "What I'm learning right now...")}</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {learningItems.map((item, index) => (
                <Reveal key={item.title[0]} y={10} duration={0.3} delay={index * 0.1} className="carte">
                  <h3 className="font-medium">{t(item.title[0], item.title[1])}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{t(item.description[0], item.description[1])}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
