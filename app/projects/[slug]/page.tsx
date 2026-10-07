import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjetContenu } from "@/components/pages/projet-contenu"
import { EtudeContenu } from "@/components/pages/etude-contenu"
import { projects, getProjectBySlug } from "@/lib/projects"
import { ETUDES, getEtude } from "@/lib/etudes"
import { DOSSIERS } from "@/lib/dossiers"

interface ProjectPageProps {
  params: Promise<{ slug: string }>
}

/** Deux sortes de fiches : les applications (lib/projects.ts) et les etudes de cas des projets ML (lib/etudes.ts). */
export async function generateStaticParams() {
  return [...projects.map((p) => p.slug), ...ETUDES.map((e) => e.slug)].map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params
  const etude = getEtude(slug)
  const dossier = DOSSIERS.find((d) => d.slug === slug)
  if (etude && dossier) {
    return { title: `${dossier.nom} : étude de cas`, description: etude.pitch[0] }
  }

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

  if (getEtude(slug)) return <EtudeContenu slug={slug} />

  if (!getProjectBySlug(slug)) {
    notFound()
  }

  return <ProjetContenu slug={slug} />
}
