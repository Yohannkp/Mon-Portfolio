"use client"

import type { ReactNode } from "react"
import { useLangue } from "@/lib/langue"

/** Du texte dans les deux langues : s'utilise aussi dans les composants serveur, `fr` et `en` pouvant contenir du JSX. */
export function T({ fr, en }: { fr: ReactNode; en: ReactNode }) {
  return <>{useLangue() === "en" ? en : fr}</>
}
