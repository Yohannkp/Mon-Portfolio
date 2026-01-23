"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import type { Project } from "@/lib/projects"

interface ProjectsGridProps {
  projects: Project[]
  allTags: string[]
}

export function ProjectsGrid({ projects, allTags }: ProjectsGridProps) {
  const [selectedTag, setSelectedTag] = React.useState<string | null>(null)

  const filteredProjects = selectedTag
    ? projects.filter((project) => project.tags.includes(selectedTag))
    : projects

  return (
    <div className="mt-12">
      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={selectedTag === null ? "default" : "outline"}
          size="sm"
          onClick={() => setSelectedTag(null)}
        >
          Tous
        </Button>
        {allTags.map((tag) => (
          <Button
            key={tag}
            variant={selectedTag === tag ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedTag(tag)}
          >
            {tag}
          </Button>
        ))}
      </div>

      {/* Grid */}
      <motion.div layout className="mt-8 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {filteredProjects.map((project) => (
            <motion.article
              key={project.slug}
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
              className="group flex flex-col overflow-hidden rounded-xl border border-border/40 bg-card transition-all hover:border-border hover:shadow-lg"
            >
              {/* Image */}
              <Link href={`/projects/${project.slug}`} className="relative aspect-video overflow-hidden bg-secondary">
                <Image
                  src={project.image || "/placeholder.svg"}
                  alt={project.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              </Link>

              {/* Content */}
              <div className="flex flex-1 flex-col p-6">
                <Link href={`/projects/${project.slug}`}>
                  <h2 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {project.name}
                  </h2>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.pitch}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <Badge key={tag} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {/* Links */}
                <div className="mt-auto flex gap-2 pt-6">
                  <Button asChild variant="outline" size="sm" className="flex-1 gap-2 bg-transparent">
                    <Link href={`/projects/${project.slug}`}>
                      Voir le projet
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                  {project.links.github && (
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                      <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-4 w-4" />
                        <span className="sr-only">GitHub</span>
                      </a>
                    </Button>
                  )}
                  {project.links.demo && (
                    <Button asChild variant="ghost" size="icon" className="h-9 w-9">
                      <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" />
                        <span className="sr-only">Demo</span>
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredProjects.length === 0 && (
        <div className="mt-12 text-center">
          <p className="text-muted-foreground">Aucun projet ne correspond à ce filtre.</p>
        </div>
      )}
    </div>
  )
}
