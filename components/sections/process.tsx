"use client"

import { motion } from "framer-motion"
import { Search, Database, Code, TestTube, Repeat } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Cadrer",
    description: "Définir ce qu'on mesure avant de construire : la métrique, le jeu de test, ce qui compterait comme un échec.",
  },
  {
    icon: Database,
    title: "Préparer la donnée",
    description: "La difficulté est souvent la donnée : la constituer, la nettoyer, la valider. Pour Mina, 500 paires générées, 360 retenues après un audit automatique.",
  },
  {
    icon: Code,
    title: "Construire",
    description: "Un projet en modules, reproductible, pas un notebook : agent, entraînement, évaluation et démonstration séparés.",
  },
  {
    icon: TestTube,
    title: "Prouver",
    description: "Évaluer avec la bonne méthode : magasin contrôle, test statistique, suite RAGAS. Un résultat non mesuré n'existe pas.",
  },
  {
    icon: Repeat,
    title: "Déployer",
    description: "Conteneuriser, servir derrière une API, intégration continue. Puis observer ce qui tourne réellement.",
  },
]

export function Process() {
  return (
    <section id="sec-methode" className="border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="sec__kicker">
            Méthode
          </span>
          <h2 className="sec__h2">
            Comment je travaille
          </h2>
        </motion.div>

        <div className="mt-24 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              {/* Connector line */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-6 hidden h-0.5 w-full bg-border/40 lg:block" />
              )}
              
              {/* Icon */}
              <div className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-background border border-border">
                <step.icon className="h-5 w-5 text-foreground" />
              </div>
              
              {/* Content */}
              <h3 className="mt-4 font-medium">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
