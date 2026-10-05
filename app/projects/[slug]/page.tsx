import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { ProjetContenu } from "@/components/pages/projet-contenu"
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

  if (!getProjectBySlug(slug)) {
    notFound()
  }

  return <ProjetContenu slug={slug} />
}
