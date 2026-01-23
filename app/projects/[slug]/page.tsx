import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { ArrowLeft, ExternalLink, Github, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects, getProjectBySlug } from "@/lib/projects"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  return projects.map((project) => ({
    slug: project.slug,
  }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const project = getProjectBySlug(slug)
  
  if (!project) {
    return { title: "Projet non trouvé" }
  }

  return {
    title: project.name,
    description: project.pitch,
  }
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  if (!project) {
    notFound()
  }

  return (
    <article className="mx-auto max-w-4xl px-6 py-24">
      {/* Back link */}
      <Link 
        href="/projects" 
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Retour aux projets
      </Link>

      {/* Hero */}
      <header className="mt-8">
        <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{project.pitch}</p>
        
        {/* Tags */}
        <div className="mt-6 flex flex-wrap gap-2">
          {project.tags.map((tag) => (
            <Badge key={tag} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="mt-8 flex flex-wrap gap-4">
          {project.links.demo && (
            <Button asChild className="gap-2">
              <a href={project.links.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                Voir la démo
              </a>
            </Button>
          )}
          {project.links.github && (
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                Code source
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Main image */}
      <div className="mt-12 overflow-hidden rounded-xl border border-border/40 bg-secondary">
        <div className="relative aspect-video">
          <Image
            src={project.image || "/placeholder.svg"}
            alt={project.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 896px) 100vw, 896px"
          />
        </div>
      </div>

      {/* Content */}
      <div className="mt-16 space-y-16">
        {/* Problem */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Le problème</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{project.problem}</p>
        </section>

        {/* Solution */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">La solution</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{project.solution}</p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Fonctionnalités clés</h2>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {project.features.map((feature) => (
              <li key={feature} className="flex items-start gap-3">
                <div className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent">
                  <Check className="h-3 w-3" />
                </div>
                <span className="text-muted-foreground">{feature}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Stack */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Stack technique</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Frontend</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.frontend.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Backend</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.backend.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Base de données</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.database.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">Outils</h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {project.stack.tools.map((tech) => (
                  <Badge key={tech} variant="secondary">{tech}</Badge>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Challenges */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Défis techniques</h2>
          <ul className="mt-6 space-y-4">
            {project.challenges.map((challenge, index) => (
              <li key={index} className="flex gap-4">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-medium">
                  {index + 1}
                </span>
                <span className="text-muted-foreground">{challenge}</span>
              </li>
            ))}
          </ul>
        </section>

        {/* Learnings */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">Ce que j&apos;ai appris</h2>
          <ul className="mt-6 space-y-3">
            {project.learnings.map((learning) => (
              <li key={learning} className="flex items-start gap-3">
                <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                <span className="text-muted-foreground">{learning}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {/* Footer CTA */}
      <footer className="mt-20 rounded-xl border border-border/40 bg-card p-8 text-center">
        <h3 className="text-xl font-semibold">Intéressé par ce projet ?</h3>
        <p className="mt-2 text-muted-foreground">
          N&apos;hésitez pas à me contacter pour en discuter ou voir d&apos;autres projets.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/contact">Me contacter</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">Voir d&apos;autres projets</Link>
          </Button>
        </div>
      </footer>
    </article>
  )
}
