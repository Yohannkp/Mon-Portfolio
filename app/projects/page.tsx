import type { Metadata } from "next"
import { ProjetsContenu } from "@/components/pages/projects-contenu"
import { DOSSIERS } from "@/lib/dossiers"

export const metadata: Metadata = {
  title: "Projets",
  description:
    `${DOSSIERS.length} projets classés par ce qu'ils démontrent : mettre des modèles en production, les entraîner, mesurer et prouver, construire des applications.`,
}

export default function ProjectsPage() {
  return <ProjetsContenu />
}
