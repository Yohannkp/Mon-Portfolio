import { useCallback, useMemo, useSyncExternalStore } from "react"

/**
 * La langue du site. Le français est la langue d'origine ; l'anglais est une option, choisie avec le bouton FR / EN de
 * l'en-tête (ou avec ?lang=en dans l'adresse), et retenue dans ce navigateur.
 *
 * Tout le texte garde son français dans le code (lisible, sans clé à chercher) et reçoit son anglais juste a cote :
 *   - en JSX :           <T fr="Bonjour" en="Hello" />
 *   - dans un composant : const t = useT();  t("Bonjour", "Hello")
 *   - hors de React :    t("Bonjour", "Hello") avec l'import de ce fichier (lit la langue du moment)
 *
 * Le serveur produit toujours le français ; l'anglais s'applique des le premier rendu du navigateur.
 */
export type Langue = "fr" | "en"

const CLE = "langue"
const abonnes = new Set<() => void>()
let courante: Langue = "fr"

function lireChoix(): Langue {
  try {
    const param = new URLSearchParams(window.location.search).get("lang")
    if (param === "en" || param === "fr") {
      window.localStorage.setItem(CLE, param)
      return param
    }
    return window.localStorage.getItem(CLE) === "en" ? "en" : "fr"
  } catch {
    return "fr"
  }
}

if (typeof window !== "undefined") {
  courante = lireChoix()
  document.documentElement.lang = courante
}

/** La langue du moment, pour le code qui ne vit pas dans un composant (le robot, la voix...). */
export const langueActive = (): Langue => courante

/** Le texte dans la langue du moment (hors React : ne declenche aucun rendu). */
export const t = (fr: string, en: string): string => (courante === "en" ? en : fr)

export function changerLangue(l: Langue) {
  if (l === courante) return
  courante = l
  try {
    window.localStorage.setItem(CLE, l)
  } catch {
    /* navigation privee : le choix vaut pour cette visite */
  }
  document.documentElement.lang = l
  abonnes.forEach((f) => f())
}

/** Pour le code hors React : etre prevenu quand la langue change. */
export function surLangue(rappel: () => void): () => void {
  abonnes.add(rappel)
  return () => abonnes.delete(rappel)
}

const abonner = (f: () => void) => surLangue(f)
const instantane = () => courante
const serveur = (): Langue => "fr"

export function useLangue(): Langue {
  return useSyncExternalStore(abonner, instantane, serveur)
}

/** `t(fr, en)` qui re-rend le composant quand la langue change. */
export function useT() {
  const l = useLangue()
  return useCallback((fr: string, en: string) => (l === "en" ? en : fr), [l])
}

/** Choisit entre deux valeurs (un tableau, un objet...) selon la langue. */
export function useChoix<A>(fr: A, en: A): A {
  const l = useLangue()
  return useMemo(() => (l === "en" ? en : fr), [l, fr, en])
}
