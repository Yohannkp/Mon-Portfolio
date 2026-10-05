import { useMemo } from "react"
import { AXES, DOSSIERS, PHARES as PHARES_FR, MOTS, type Axe, type Dossier } from "@/lib/dossiers"
import { AXES_EN, DOSSIERS_EN, MOTS_EN } from "@/lib/dossiers-en"
import { langueActive, useLangue, type Langue } from "@/lib/langue"

/** Les dossiers, les axes et les projets phares dans la langue demandee (le francais, c'est lib/dossiers.ts tel quel). */
export function donneesDossiers(l: Langue) {
  const dossiers: Dossier[] =
    l === "en"
      ? DOSSIERS.map((d) => {
          const e = DOSSIERS_EN[d.slug]
          return e ? { ...d, ...e, phare: e.phare ?? d.phare } : d
        })
      : DOSSIERS
  const phares = (l === "en" ? dossiers.filter((d) => d.phare) : PHARES_FR).slice().sort((a, b) => a.phare!.rang - b.phare!.rang)
  const axes = AXES.map((a) => (l === "en" ? { ...a, ...AXES_EN[a.id] } : a))
  const mot = (l === "en" ? MOTS_EN : MOTS)[phares.length] ?? String(phares.length)
  return {
    DOSSIERS: dossiers,
    PHARES: phares,
    AXES: axes,
    PREUVES: dossiers.filter((d) => d.chiffre),
    dossiersParAxe: (axe: Axe) => dossiers.filter((d) => d.axe === axe),
    NB_PHARES_MOT: mot,
  }
}

const memo: Partial<Record<Langue, ReturnType<typeof donneesDossiers>>> = {}
const lire = (l: Langue) => (memo[l] ??= donneesDossiers(l))

/** Dans un composant : se met a jour quand la langue change. */
export function useDossiers() {
  const l = useLangue()
  return useMemo(() => lire(l), [l])
}

/** Hors React (le robot, la visite) : la langue du moment. */
export const dossiersActifs = () => lire(langueActive())
