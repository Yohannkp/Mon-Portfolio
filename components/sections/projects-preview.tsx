"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, ExternalLink, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects } from "@/lib/projects"

const featuredProjects = projects.filter((p) => ["applyflow"].includes(p.slug))

export function ProjectsPreview() {
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
              Portfolio
            </span>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight">
              Projets phares
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
          {featuredProjects.map((project, index) => (
            <motion.article
              key={project.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
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
                  <h3 className="text-lg font-semibold tracking-tight transition-colors group-hover:text-accent">
                    {project.name}
                  </h3>
                </Link>
                <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {project.pitch}
                </p>

                {/* Tags */}
                <div className="mt-4 flex flex-wrap gap-2">
                  {project.tags.slice(0, 4).map((tag) => (
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
        </div>
      </div>
    </section>
  )
}
