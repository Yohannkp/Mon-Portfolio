"use client"

import { motion } from "framer-motion"
import { Badge } from "@/components/ui/badge"

const skillCategories = [
  {
    name: "Développement Fullstack",
    skills: ["React", "Flutter", "Symfony", "Node.js", "PHP 8", "Python"],
  },
  {
    name: "Intelligence Artificielle & Data",
    skills: ["Machine Learning", "Data Analytics", "Tableau", "SQL", "TensorFlow", "Pandas"],
  },
  {
    name: "Base de données",
    skills: ["MySQL", "MongoDB", "Firebase", "PostgreSQL"],
  },
  {
    name: "Outils & DevOps",
    skills: ["Docker", "Git", "CI/CD", "Firebase", "Vercel", "Matplotlib"],
  },
]

export function Skills() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
            Compétences
          </span>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
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
              className="rounded-xl border border-border/40 bg-card p-6"
            >
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                {category.name}
              </h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill}
                  </Badge>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
