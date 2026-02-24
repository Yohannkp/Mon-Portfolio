"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Database, BarChart3, Brain, Eye, MessageSquare, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { DataProject } from "@/lib/data-projects"
import { dataCategories } from "@/lib/data-projects"

interface DataProjectsGridProps {
  projects: DataProject[]
}

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

export function DataProjectsGrid({ projects }: DataProjectsGridProps) {
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all")

  const filteredProjects =
    selectedCategory === "all"
      ? projects
      : projects.filter((p) => p.category === selectedCategory)

  return (
    <div className="mt-12">
      {/* Category Filters */}
      <div className="flex flex-wrap gap-2">
        {dataCategories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedCategory(cat.id)}
            className="gap-2"
          >
            {cat.id !== "all" && categoryIcons[cat.id]}
            {cat.label}
            {cat.id !== "all" && (
              <span className="ml-1 text-xs opacity-60">
                ({projects.filter((p) => p.category === cat.id).length})
              </span>
            )}
          </Button>
        ))}
      </div>

      {/* Results count */}
      <p className="mt-6 text-sm text-muted-foreground">
        {filteredProjects.length} projet{filteredProjects.length > 1 ? "s" : ""}
      </p>

      {/* Grid */}
      <motion.div layout className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25 }}
              className="group flex flex-col rounded-xl border border-border/40 bg-card p-5 transition-all hover:border-border hover:shadow-lg"
            >
              {/* Category badge */}
              <div className="flex items-center justify-between">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${categoryColors[project.category]}`}
                >
                  {categoryIcons[project.category]}
                  {dataCategories.find((c) => c.id === project.category)?.label}
                </span>
                {project.links?.github && (
                  <a
                    href={project.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-muted-foreground opacity-0 transition-opacity hover:text-foreground group-hover:opacity-100"
                    aria-label={`Voir ${project.title} sur GitHub`}
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
              </div>

              {/* Title */}
              <h3 className="mt-3 text-base font-semibold leading-snug tracking-tight text-foreground">
                {project.title}
              </h3>

              {/* Description */}
              <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                {project.description}
              </p>

              {/* Tags */}
              <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                {project.tags.slice(0, 4).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {project.tags.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{project.tags.length - 4}
                  </Badge>
                )}
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Aucun projet ne correspond a ce filtre.</p>
        </div>
      )}
    </div>
  )
}
