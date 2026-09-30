"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    name: "Langages",
    skills: ["Python", "SQL", "Go", "TypeScript", "Java"],
  },
  {
    name: "ML & modèles",
    skills: ["PyTorch", "Scikit-learn", "XGBoost", "SHAP", "Fine-tuning LoRA / QLoRA"],
  },
  {
    name: "Mise en production",
    skills: ["Docker", "CI/CD", "FastAPI", "Git", "Tests automatisés"],
  },
  {
    name: "Données",
    skills: ["SQL avancé (CTE, fenêtrage)", "PostgreSQL", "Neo4j", "ETL", "Power BI"],
  },
]

export function Skills() {
  return (
    <section id="sec-competences" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="sec__kicker">
            Compétences
          </span>
          <h2 className="sec__h2">
            Technologies maîtrisées
          </h2>
        </motion.div>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, categoryIndex) => (
            <motion.div
              key={category.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
              className="carte carte--3d"
            >
              <h3 className="carte__etiquette">
                {category.name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) =>
                  skill.startsWith("SQL avancé") ? (
                    <Link key={skill} href="/projects#mesure" title="Voir la preuve : Ventes en supermarché">
                      <Badge className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25">{skill} ↗</Badge>
                    </Link>
                  ) : (
                    <Badge key={skill} variant="secondary">
                      {skill}
                    </Badge>
                  ),
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
