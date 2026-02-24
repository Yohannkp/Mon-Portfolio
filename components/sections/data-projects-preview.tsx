"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  ArrowRight,
  Brain,
  BarChart3,
  Database,
  Eye,
  MessageSquare,
  Github,
  Globe,
  LayoutDashboard,
  FileText,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { visibleDataProjects } from "@/lib/data-projects"
import { dataCategories } from "@/lib/data-projects"

const categoryIcons: Record<string, React.ReactNode> = {
  "machine-learning": <Brain className="h-4 w-4" />,
  "data-analysis": <BarChart3 className="h-4 w-4" />,
  "deep-learning": <Database className="h-4 w-4" />,
  visualization: <Eye className="h-4 w-4" />,
  nlp: <MessageSquare className="h-4 w-4" />,
}

const categoryColors: Record<string, string> = {
  "machine-learning": "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  "data-analysis": "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  "deep-learning": "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20",
  visualization: "bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border-cyan-500/20",
  nlp: "bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20",
}

const featuredDataProjects = visibleDataProjects.filter((project) =>
  ["finance-credit-scoring", "snake-reinforcement-learning"].includes(project.slug)
)

const categoryCounts = dataCategories
  .filter((c) => c.id !== "all")
  .map((cat) => ({
    ...cat,
    count: visibleDataProjects.filter((p) => p.category === cat.id).length,
    icon: categoryIcons[cat.id],
    color: categoryColors[cat.id],
  }))
  .filter((cat) => cat.count > 0)

export function DataProjectsPreview() {
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
              Data Science & ML
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Projets Data
            </h2>
            <p className="mt-2 max-w-lg text-muted-foreground">
              Analyses exploratoires, modeles predictifs, deep learning et
              dashboards interactifs.
            </p>
          </div>
          <Button asChild variant="ghost" className="w-fit gap-2">
            <Link href="/data-projects">
              Voir tous les projets data
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>

        {/* Category summary chips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8 flex flex-wrap gap-3"
        >
          {categoryCounts.map((cat) => (
            <div
              key={cat.id}
              className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-medium ${cat.color}`}
            >
              {cat.icon}
              {cat.label}
              <span className="opacity-60">({cat.count})</span>
            </div>
          ))}
        </motion.div>

        {/* Featured data projects grid */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {featuredDataProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.07 }}
              className="group flex flex-col rounded-xl border border-border/40 bg-card p-5 transition-all hover:border-border hover:shadow-lg"
            >
              {project.image && (
                <div className="relative mb-4 h-32 w-full overflow-hidden rounded-lg">
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1024px) 320px, (min-width: 640px) 45vw, 90vw"
                    className="object-cover"
                  />
                </div>
              )}
              {/* Category badge + links */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[project.category]}`}
                >
                  {categoryIcons[project.category]}
                  {dataCategories.find((c) => c.id === project.category)?.label}
                </span>
                {project.links && (
                  <div className="flex items-center gap-2 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
                    {project.links.github && (
                      <a
                        href={project.links.github}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                        aria-label={`Voir ${project.title} sur GitHub`}
                      >
                        <Github className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.portfolio && (
                      <a
                        href={project.links.portfolio}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                        aria-label={`Voir la demo de ${project.title}`}
                      >
                        <Globe className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.dashboard && (
                      <a
                        href={project.links.dashboard}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                        aria-label={`Voir le dashboard de ${project.title}`}
                      >
                        <LayoutDashboard className="h-4 w-4" />
                      </a>
                    )}
                    {project.links.article && (
                      <a
                        href={project.links.article}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-foreground"
                        aria-label={`Lire l'article sur ${project.title}`}
                      >
                        <FileText className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Title */}
              <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
                {project.title}
              </h3>

              {/* Description */}
              <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {project.tags.slice(0, 3).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 3 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 3}
                  </Badge>
                )}
              </div>
            </motion.article>
          ))}
        </div>

        {/* See all link */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8 text-center"
        >
          <Button asChild variant="outline" className="gap-2 bg-transparent">
            <Link href="/data-projects">
              Voir les {visibleDataProjects.length} projets data
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
