"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, Github, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { projects, getProjectBySlug } from "@/lib/projects"
import { projetLocalise } from "@/lib/projects-en"
import { useDossiers } from "@/lib/dossiers-langue"
import { useLangue, useT } from "@/lib/langue"

/** La page d'une etude de cas, dans la langue du visiteur (la page serveur garde les metadonnees et la generation statique). */
export function ProjetContenu({ slug }: { slug: string }) {
  const t = useT()
  const en = useLangue() === "en"
  const { AXES, DOSSIERS } = useDossiers()
  const brut = getProjectBySlug(slug)
  if (!brut) return null
  const project = projetLocalise(brut, en)

  // Ce que ce projet demontre : le meme dossier que celui de la page /projects.
  const dossier = DOSSIERS.find((d) => d.slug === slug)
  const axe = dossier ? AXES.find((a) => a.id === dossier.axe) : undefined
  const suivantBrut = projects[(projects.findIndex((p) => p.slug === slug) + 1) % projects.length]
  const suivant = suivantBrut ? projetLocalise(suivantBrut, en) : undefined

  return (
    <article className="mx-auto max-w-4xl px-6 py-24">
      {/* Back link */}
      <Link
        href="/projects"
        className="inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("Retour aux projets", "Back to projects")}
      </Link>

      {/* Hero */}
      <header className="mt-8">
        <h1 className="text-4xl font-semibold tracking-tight">{project.name}</h1>
        <p className="mt-4 text-xl text-muted-foreground">{project.pitch}</p>

        {dossier && axe ? (
          <div className="mt-8 rounded-xl border border-border/40 bg-card p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("Ce que ce projet démontre", "What this project demonstrates")} ·{" "}
              <Link href={`/projects#${axe.id}`} className="text-accent underline-offset-4 hover:underline">
                {axe.titre}
              </Link>
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {dossier.prouve.map((p) => (
                <span key={p} className="rounded-full border border-accent/40 bg-accent/10 px-3 py-1 font-mono text-xs text-accent">
                  {p}
                </span>
              ))}
            </div>
            {dossier.chiffre ? (
              <p className="mt-4 text-sm text-muted-foreground">
                <span className="mr-2 font-mono text-lg text-foreground">{dossier.chiffre.valeur}</span>
                {dossier.chiffre.unite}
              </p>
            ) : null}
          </div>
        ) : null}

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
                {t("Voir la démo", "See the demo")}
              </a>
            </Button>
          )}
          {project.links.github && (
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={project.links.github} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                {t("Code source", "Source code")}
              </a>
            </Button>
          )}
        </div>
      </header>

      {/* Main image */}
      <div className="mt-12 overflow-hidden rounded-xl border border-border/40 bg-secondary">
        <Image
          src={project.image || "/placeholder.svg"}
          alt={t(`Aperçu de ${project.name}`, `Preview of ${project.name}`)}
          width={1600}
          height={900}
          className="h-auto w-full"
          priority
          sizes="(max-width: 896px) 100vw, 896px"
        />
      </div>

      {/* Content */}
      <div className="mt-16 space-y-16">
        {/* Problem */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">{t("Le problème", "The problem")}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{project.problem}</p>
        </section>

        {/* Solution */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">{t("La solution", "The solution")}</h2>
          <p className="mt-4 leading-relaxed text-muted-foreground">{project.solution}</p>
        </section>

        {/* Features */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">{t("Fonctionnalités clés", "Key features")}</h2>
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
          <h2 className="text-2xl font-semibold tracking-tight">{t("Stack technique", "Tech stack")}</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {(
              [
                ["Frontend", "Frontend", project.stack.frontend],
                ["Backend", "Backend", project.stack.backend],
                ["Base de données", "Database", project.stack.database],
                ["Outils", "Tools", project.stack.tools],
              ] as const
            ).map(([fr, enLabel, techs]) => (
              <div key={fr}>
                <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">{t(fr, enLabel)}</h3>
                <div className="mt-3 flex flex-wrap gap-2">
                  {techs.map((tech) => (
                    <Badge key={tech} variant="secondary">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Challenges */}
        <section>
          <h2 className="text-2xl font-semibold tracking-tight">{t("Défis techniques", "Technical challenges")}</h2>
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
          <h2 className="text-2xl font-semibold tracking-tight">{t("Ce que j'ai appris", "What I learned")}</h2>
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
        <h3 className="text-xl font-semibold">{t("Intéressé par ce projet ?", "Interested in this project?")}</h3>
        <p className="mt-2 text-muted-foreground">
          {t(
            "N'hésitez pas à me contacter pour en discuter ou voir d'autres projets.",
            "Don't hesitate to contact me to discuss it or to see other projects.",
          )}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-accent text-background hover:bg-accent/90">
            <Link href="/contact">{t("Me contacter", "Contact me")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">{t("Voir d'autres projets", "See other projects")}</Link>
          </Button>
        </div>
      </footer>

      {suivant && suivant.slug !== slug ? (
        <Link
          href={`/projects/${suivant.slug}`}
          className="group mt-6 flex items-center justify-between gap-4 rounded-xl border border-border/40 p-5 transition-colors hover:border-accent/50"
        >
          <span>
            <span className="block text-xs font-medium uppercase tracking-wider text-muted-foreground">
              {t("Étude de cas suivante", "Next case study")}
            </span>
            <span className="mt-1 block font-semibold">{suivant.name}</span>
          </span>
          <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </article>
  )
}
