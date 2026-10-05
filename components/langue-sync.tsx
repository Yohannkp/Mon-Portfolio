"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { surLangue, langueActive } from "@/lib/langue"

/** L'onglet du navigateur : le titre de chaque page est ecrit en francais cote serveur ; en anglais, on le traduit ici. */
const TITRES: [string, string][] = [
  ["Projets |", "Projects |"],
  ["À propos |", "About |"],
  ["Projet non trouvé |", "Project not found |"],
  ["Présentation |", "Presentation |"],
]

/** Les noms des etudes de cas, [francais, anglais] : charges seulement sur les pages /projects/…, pour ne rien ajouter aux autres. */
let noms: [string, string][] | null = null
let chargement: Promise<void> | null = null
const chargerNoms = () =>
  (chargement ??= Promise.all([import("@/lib/projects"), import("@/lib/projects-en")]).then(([a, b]) => {
    noms = a.projects.map((p) => [p.name, b.PROJETS_EN[p.slug]?.name ?? p.name] as [string, string])
  }))

function traduire(titre: string, vers: "fr" | "en") {
  const de = vers === "en" ? 0 : 1
  const a = vers === "en" ? 1 : 0
  for (const t of TITRES) if (titre.startsWith(t[de])) return t[a] + titre.slice(t[de].length)
  for (const n of noms ?? []) if (titre.startsWith(`${n[de]} |`)) return `${n[a]}${titre.slice(n[de].length)}`
  return titre
}

/**
 * Garde `document.title` dans la langue du visiteur : apres un changement de langue, et apres chaque navigation
 * (Next ecrit alors le titre francais de la nouvelle page). Ne rend rien.
 */
export function LangueSync() {
  const pathname = usePathname()

  useEffect(() => {
    const appliquer = () => {
      const l = langueActive()
      // Une fiche projet : il faut d'abord connaitre les noms (chargement unique, a la demande).
      if (noms === null && !chargement && pathname.startsWith("/projects/")) void chargerNoms().then(appliquer)
      const bon = traduire(traduire(document.title, "fr"), l)
      if (document.title !== bon) document.title = bon
    }
    appliquer()
    const hors = surLangue(appliquer)
    const obs = new MutationObserver(appliquer)
    obs.observe(document.head, { subtree: true, childList: true, characterData: true })
    return () => {
      hors()
      obs.disconnect()
    }
  }, [pathname])

  return null
}
