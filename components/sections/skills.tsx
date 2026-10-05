"use client"

import Link from "next/link"
import { Reveal } from "@/components/reveal"
import { Badge } from "@/components/ui/badge"
import { useT } from "@/lib/langue"

/** Une compétence : le même mot dans les deux langues quand c'est une technologie, sinon fr / en. */
type Competence = string | { fr: string; en: string; preuve?: boolean }

const skillCategories: { fr: string; en: string; skills: Competence[] }[] = [
  {
    fr: "Langages",
    en: "Languages",
    skills: ["Python", "SQL", "Go", "TypeScript", "Java"],
  },
  {
    fr: "ML & modèles",
    en: "ML & models",
    skills: ["PyTorch", "Scikit-learn", "XGBoost", "SHAP", "Fine-tuning LoRA / QLoRA"],
  },
  {
    fr: "Mise en production",
    en: "Production",
    skills: ["Docker", "CI/CD", "FastAPI", "Git", { fr: "Tests automatisés", en: "Automated tests" }],
  },
  {
    fr: "Données",
    en: "Data",
    skills: [{ fr: "SQL avancé (CTE, fenêtrage)", en: "Advanced SQL (CTEs, window functions)", preuve: true }, "PostgreSQL", "Neo4j", "ETL", "Power BI"],
  },
]

export function Skills() {
  const t = useT()
  return (
    <section id="sec-competences" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5}>
          <span className="sec__kicker">{t("Compétences", "Skills")}</span>
          <h2 className="sec__h2">{t("Technologies maîtrisées", "Technologies I master")}</h2>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {skillCategories.map((category, categoryIndex) => (
            <Reveal key={category.fr} y={20} duration={0.5} delay={categoryIndex * 0.1} className="carte carte--3d">
              <h3 className="carte__etiquette">{t(category.fr, category.en)}</h3>
              <div className="mt-4 flex flex-wrap gap-2">
                {category.skills.map((s) => {
                  const nom = typeof s === "string" ? s : t(s.fr, s.en)
                  return typeof s !== "string" && s.preuve ? (
                    <Link key={s.fr} href="/#sec-formations" title={t("Voir la formation et la preuve : Ventes en supermarché", "See the training and the proof: Supermarket sales")}>
                      <Badge className="border-accent/50 bg-accent/15 text-accent hover:bg-accent/25">{nom} ↗</Badge>
                    </Link>
                  ) : (
                    <Badge key={nom} variant="secondary">
                      {nom}
                    </Badge>
                  )
                })}
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
