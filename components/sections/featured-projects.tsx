"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { dataProjects } from "@/lib/data-projects"
import { projects } from "@/lib/projects"

type Card = {
  key: string
  title: string
  blurb: string
  tags: string[]
  href?: string
  github?: string
  demo?: string
}

const dp = (slug: string) => dataProjects.find((p) => p.slug === slug)
const sp = (slug: string) => projects.find((p) => p.slug === slug)

const mina = dp("mina-translator")
const agent = dp("self-dev-agent")
const applyflow = sp("applyflow")

const featured: Card[] = [
  {
    key: "mina-translator",
    title: "Mina-Translator",
    blurb:
      "Un LLM affiné en QLoRA pour traduire entre le français et le mina, une langue du Togo sans ressources numériques. Corpus parallèle constitué pour l'occasion et service exposé par une API FastAPI.",
    tags: mina?.tags ?? [],
    github: mina?.links?.github,
  },
  {
    key: "self-dev-agent",
    title: "SELF_DEV_AGENT",
    blurb:
      "Un agent de développement qui tourne entièrement en local sur Ollama : il lit le code du projet et le modifie. L'installateur détecte la machine et choisit les modèles selon la RAM disponible.",
    tags: agent?.tags ?? [],
    github: agent?.links?.github,
  },
  {
    key: "applyflow",
    title: applyflow?.name ?? "ApplyFlow",
    blurb:
      "Un SaaS de suivi de candidatures conçu, déployé et accessible en ligne : kanban, fiches détaillées et tableau de bord de progression.",
    tags: applyflow?.tags ?? [],
    href: "/projects/applyflow",
    github: applyflow?.links.github,
    demo: applyflow?.links.demo,
  },
]

export function FeaturedProjects() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between"
        >
          <div>
            <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
              Projets
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Ce que j&apos;ai mis en production
            </h2>
          </div>
          <Button asChild variant="ghost" className="w-fit gap-2">
            <Link href="/projects">
              Voir tous les projets
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((item, index) => (
            <motion.article
              key={item.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="flex flex-col rounded-xl border border-border/40 bg-card p-6 transition-colors hover:border-border"
            >
              <h3 className="text-lg font-semibold tracking-tight">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{item.blurb}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto flex flex-wrap gap-2 pt-6">
                {item.href && (
                  <Button asChild variant="outline" size="sm" className="gap-2 bg-transparent">
                    <Link href={item.href}>
                      Voir le projet
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                )}
                {item.github && (
                  <Button asChild variant="ghost" size="sm" className="gap-2">
                    <a href={item.github} target="_blank" rel="noopener noreferrer">
                      <Github className="h-4 w-4" />
                      Code
                    </a>
                  </Button>
                )}
                {item.demo && (
                  <Button asChild variant="ghost" size="sm" className="gap-2">
                    <a href={item.demo} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-4 w-4" />
                      Démo
                    </a>
                  </Button>
                )}
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
