"use client"

import { Reveal } from "@/components/reveal"
import { Search, Database, Code, TestTube, Repeat } from "lucide-react"
import { useT } from "@/lib/langue"

const steps = [
  {
    icon: Search,
    title: ["Cadrer", "Frame it"],
    description: [
      "Définir ce qu'on mesure avant de construire : la métrique, le jeu de test, ce qui compterait comme un échec.",
      "Define what you measure before building: the metric, the test set, what would count as a failure.",
    ],
  },
  {
    icon: Database,
    title: ["Préparer la donnée", "Prepare the data"],
    description: [
      "La difficulté est souvent la donnée : la constituer, la nettoyer, la valider. Pour Mina, 500 paires générées, 360 retenues après un audit automatique.",
      "The difficulty is often the data: building it, cleaning it, validating it. For Mina, 500 pairs generated, 360 kept after an automatic audit.",
    ],
  },
  {
    icon: Code,
    title: ["Construire", "Build"],
    description: [
      "Un projet en modules, reproductible, pas un notebook : agent, entraînement, évaluation et démonstration séparés.",
      "A project in modules, reproducible, not a notebook: agent, training, evaluation and demo kept separate.",
    ],
  },
  {
    icon: TestTube,
    title: ["Prouver", "Prove"],
    description: [
      "Évaluer avec la bonne méthode : magasin contrôle, test statistique, suite RAGAS. Un résultat non mesuré n'existe pas.",
      "Evaluate with the right method: control store, statistical test, RAGAS suite. A result that isn't measured doesn't exist.",
    ],
  },
  {
    icon: Repeat,
    title: ["Déployer", "Deploy"],
    description: [
      "Conteneuriser, servir derrière une API, intégration continue. Puis observer ce qui tourne réellement.",
      "Containerise, serve behind an API, continuous integration. Then observe what actually runs.",
    ],
  },
]

export function Process() {
  const t = useT()
  return (
    <section id="sec-methode" className="border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5} className="text-center">
          <span className="sec__kicker">{t("Méthode", "Method")}</span>
          <h2 className="sec__h2">{t("Comment je travaille", "How I work")}</h2>
        </Reveal>

        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <Reveal key={step.title[0]} y={20} duration={0.5} delay={index * 0.1} className="relative flex flex-col items-center text-center">
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-border/40 lg:block" />
              )}
              
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border">
                <step.icon className="h-5 w-5 text-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="mt-4 font-medium">{t(step.title[0], step.title[1])}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {t(step.description[0], step.description[1])}
              </p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
