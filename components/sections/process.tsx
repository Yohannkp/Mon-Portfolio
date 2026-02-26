"use client"

import { motion } from "framer-motion"
import { Search, Palette, Code, TestTube, Repeat } from "lucide-react"

const steps = [
  {
    icon: Search,
    title: "Discovery & Strategy",
    description: "Aligner les besoins business avec la faisabilité technique. Définition claire des KPIs et scope.",
  },
  {
    icon: Palette,
    title: "System Design",
    description: "Architecture scalable et résiliente. Choix des technos adaptés (SQL vs NoSQL, Microservices).",
  },
  {
    icon: Code,
    title: "Clean Code",
    description: "Développement modulaire, typé (TypeScript/Python) et auto-documenté. Focus sur la maintenabilité.",
  },
  {
    icon: TestTube,
    title: "Quality Assurance",
    description: "Tests unitaires et d'intégration systématiques. Pipeline CI/CD pour des déploiements sans stress.",
  },
  {
    icon: Repeat,
    title: "Feedback Loop",
    description: "Monitoring en production, analyse des logs et itérations rapides basées sur la donnée réelle.",
  },
]

export function Process() {
  return (
    <section className="border-t border-border/40 bg-secondary/30">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Méthode
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Comment je travaille
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-5">
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
