/**
 * Les etudes de cas des projets ML (RAG-Local, Mina-Translator, SELF_DEV_AGENT, Salifort Motors).
 *
 * Chaque texte est une paire [francais, anglais] (comme lib/formations.ts) : une seule source, pas de fichier -en.
 * Chaque chiffre et chaque graphique vient du depot du projet ; `source` dit d'ou, avec un lien, pour qu'un
 * recruteur puisse verifier. Un graphique ne recoit que des valeurs mesurees, jamais d'illustration.
 */

export type Txt = [fr: string, en: string]

export type Barre = { label: Txt; valeur: number; /** La barre dont parle le texte : en couleur, les autres en gris. */ accent?: boolean }

export type Visuel =
  | {
      type: "barres"
      titre: Txt
      /** Ex. « AUC », « paires » : rappele a cote de chaque valeur. */
      unite?: Txt
      /** Haut de l'echelle (1 pour un score, sinon la plus grande valeur). */
      max?: number
      decimales?: number
      barres: Barre[]
    }
  | {
      type: "matrice"
      titre: Txt
      /** Ce que represente la classe positive (« part », « leaves »). */
      positif: Txt
      negatif: Txt
      vn: number
      fp: number
      fn: number
      vp: number
    }
  | {
      type: "pipeline"
      titre: Txt
      etapes: { titre: Txt; detail: Txt; tech?: string }[]
    }
  | {
      type: "table"
      titre: Txt
      colonnes: Txt[]
      /** Une cellule : du texte identique dans les deux langues, ou une paire [fr, en]. */
      lignes: (string | Txt)[][]
    }

export type Section = {
  id: string
  titre: Txt
  paragraphes: Txt[]
  /** Une liste a puces apres les paragraphes. */
  points?: Txt[]
  /** Un ou deux visuels : graphique, schema ou tableau. */
  visuels?: Visuel[]
  /** D'ou viennent les chiffres de la section : un fichier du depot. */
  source?: { fichier: string; href: string }
}

export type Etude = {
  /** Le meme slug que le dossier (lib/dossiers.ts) : la fiche reprend son axe, son nom et ses liens. */
  slug: string
  /** Une phrase : le projet et sa contrainte. */
  pitch: Txt
  /** Les trois ou quatre chiffres qui resument le projet, en tete de page. */
  chiffres: { valeur: Txt; label: Txt }[]
  sections: Section[]
  /** Ce que je ferais autrement : les limites, dites franchement. */
  autrement: Txt[]
}
