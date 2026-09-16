import type { Metadata } from "next"
import { ProjectsGrid } from "@/components/projects-grid"
import { DataProjectsGrid } from "@/components/data-projects-grid"
import { projects, getAllTags } from "@/lib/projects"
import { visibleDataProjects } from "@/lib/data-projects"

export const metadata: Metadata = {
  title: "Projets",
  description:
    "Modeles affines et mis en production, APIs, pipelines de donnees et applications deployees.",
}

export default function ProjectsPage() {
  const allTags = getAllTags()

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projets</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Des mod&egrave;les affin&eacute;s et mis en production, des APIs, des pipelines de
          donn&eacute;es et des applications d&eacute;ploy&eacute;es. Chaque projet indique ce qu&apos;il
          r&eacute;sout et comment il tourne.
        </p>
      </div>

      <section aria-labelledby="ml" className="mt-16">
        <h2 id="ml" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Mod&egrave;les &amp; donn&eacute;es
        </h2>
        <DataProjectsGrid projects={visibleDataProjects} />
      </section>

      <section aria-labelledby="soft" className="mt-24 border-t border-border/40 pt-16">
        <h2 id="soft" className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          Applications &amp; APIs
        </h2>
        <ProjectsGrid projects={projects} allTags={allTags} />
      </section>
    </div>
  )
}
