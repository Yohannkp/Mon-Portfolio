import type { Metadata } from "next"
import { Accueil } from "@/components/pages/accueil"

/**
 * /presentation : l'accueil, avec une telecommande (precedent / suivant) pour presenter le portfolio en direct.
 * Reservee a son auteur : voir proxy.ts (sans la cle, cette adresse renvoie une 404), et jamais indexee.
 */
export const metadata: Metadata = {
  title: "Présentation",
  robots: { index: false, follow: false, nocache: true },
}

export default function PagePresentation() {
  return <Accueil telecommande />
}
