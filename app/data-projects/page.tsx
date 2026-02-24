import type { Metadata } from "next"
import { DataProjectsGrid } from "@/components/data-projects-grid"
import { dataProjects } from "@/lib/data-projects"

export const metadata: Metadata = {
  title: "Projets Data",
  description:
    "Decouvrez mes projets en Data Science, Machine Learning, Deep Learning et analyse de donnees.",
}

export default function DataProjectsPage() {
  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Projets Data</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Mes projets en Data Science, Machine Learning, Deep Learning, analyse
          de donnees et visualisation. Des analyses exploratoires aux modeles
          predictifs en passant par les dashboards interactifs.
        </p>
      </div>

      <DataProjectsGrid projects={dataProjects} />
    </div>
  )
}
