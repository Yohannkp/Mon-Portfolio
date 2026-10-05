/**
 * Se former, puis le prouver : le cours de SQL de 30 heures et les certifications Credly.
 *
 * Rien n'est invente : les badges (nom, emetteur, date, image, lien de verification) viennent du profil public Credly,
 * et chaque lien « Verifier » mene a la page du badge, qui est la preuve. Les competences sont decrites en une ligne,
 * au plus pres de l'intitule de la certification.
 */

export const CREDLY_PROFIL = "https://www.credly.com/users/yendi-yohann/badges"
/** Le nombre total de badges du profil (on n'en met en avant que les plus utiles pour viser MLOps / data engineering). */
export const NB_BADGES_CREDLY = 11

export type Badge = {
  id: string
  nom: string
  emetteur: string
  /** AAAA-MM-JJ */
  date: string
  image: string
  /** Ce que la certification atteste, en une ligne : [francais, anglais]. */
  competence: [string, string]
}

export const badgeUrl = (b: Badge) => `https://www.credly.com/badges/${b.id}`

export const BADGES: Badge[] = [
  {
    id: "e79047b5-a040-474e-bbac-a12a781a4e1f",
    nom: "Databases and SQL for Data Science",
    emetteur: "Coursera",
    date: "2025-05-04",
    image: "https://images.credly.com/images/f2573aac-d21c-483d-acda-afaa366b4f51/image.png",
    competence: ["SQL et bases de données relationnelles, appliqués à la data science.", "SQL and relational databases, applied to data science."],
  },
  {
    id: "2c5a26cb-151e-4f9b-89f0-21994f6abfce",
    nom: "IBM Data Analyst Professional Certificate",
    emetteur: "Coursera",
    date: "2025-05-17",
    image: "https://images.credly.com/images/d9ab365d-7897-4973-a764-8acf6c277570/Coursera_20IBM_20Data_20Analyst_20Prof_20Cert_20V3.png",
    competence: ["Analyse de données de bout en bout : Excel, SQL, Python et visualisation.", "End-to-end data analysis: Excel, SQL, Python and visualisation."],
  },
  {
    id: "8ed72404-fd7d-469e-9630-b75fe195b5fb",
    nom: "Google Advanced Data Analytics Certificate",
    emetteur: "Coursera",
    date: "2025-03-04",
    image: "https://images.credly.com/images/9267a387-1a51-4ebe-8c05-976a5ec4c3d0/image.png",
    competence: ["Analyse de données avancée : statistiques, Python et initiation au machine learning.", "Advanced data analytics: statistics, Python and an introduction to machine learning."],
  },
  {
    id: "b32a4388-fb85-45ba-8c40-fb8796a85354",
    nom: "Python for Data Science and AI",
    emetteur: "Coursera",
    date: "2025-05-09",
    image: "https://images.credly.com/images/40bee502-a5b3-4365-90e7-57eed5067594/image.png",
    competence: ["Python pour la donnée : les bases du langage et les bibliothèques d'analyse.", "Python for data: the language basics and the analysis libraries."],
  },
]

/** La formation SQL suivie en video. `apprentissages` : ce qui en a ete retenu (liste vide : la rubrique n'est pas affichee). */
export const FORMATION_SQL = {
  heures: 30,
  video: "https://www.youtube.com/watch?v=SSKVgrwhzus",
  /** Le projet qui met ce cours en pratique : l'ancre de sa ligne sur /projects. */
  projet: "supermarket-sales-analysis",
  apprentissages: [] as [string, string][],
}
