import type { Metadata } from "next"
import { ProjectsGrid } from "@/components/projects-grid"
import { projects, getAllTags } from "@/lib/projects"

export const metadata: Metadata = {
  title: "Projets",
  description: "Découvrez mes projets de développement web : applications, sites et expérimentations techniques.",
}

export default function ProjectsPage() {
  const allTags = getAllTags()

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projets</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Une sélection de projets personnels et d&apos;études de cas qui 
          illustrent mes compétences techniques et ma façon de résoudre des problèmes.
        </p>
      </div>

      <ProjectsGrid projects={projects} allTags={allTags} />
    </div>
  )
}
