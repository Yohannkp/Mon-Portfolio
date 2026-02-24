"use client"

import { motion } from "framer-motion"
import { BookOpen } from "lucide-react"

const learningItems = [
  {
    title: "LLMOps & Déploiement de modèles",
    description: "CI/CD ML, monitoring, drift et inference en production",
  },
  {
    title: "Architecture",
    description: "Clean Architecture et Domain-Driven Design",
  },
  {
    title: "DevOps",
    description: "CI/CD avec GitHub Actions, Docker en production",
  },
]

export function CurrentlyLearning() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex items-start gap-4"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-accent/10 text-accent">
            <BookOpen className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-lg font-semibold">En ce moment j&apos;apprends...</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              {learningItems.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className="rounded-lg border border-border/40 bg-card p-4"
                >
                  <h3 className="font-medium">{item.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
