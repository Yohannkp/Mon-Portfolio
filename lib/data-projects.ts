export interface DataProject {
  slug: string
  title: string
  description: string
  image?: string
  tags: string[]
  category: "machine-learning" | "data-analysis" | "deep-learning" | "visualization" | "nlp"
  links?: {
    portfolio?: string
    github?: string
    dashboard?: string
    article?: string
  }
}

export const dataProjects: DataProject[] = [
  {
    slug: "mina-translator",
    title: "Mina-Translator — traduction français / mina par LLM affiné",
    description:
      "Traduction entre le français et le mina, une langue du Togo sans ressources numériques. Qwen2-0.5B affiné en QLoRA 4 bits, chaîne Whisper → LLM → synthèse vocale. Corpus parallèle de 500+ paires construit à la main, complété par ~19 600 clips Common Voice validés, et service exposé par une API FastAPI. Sur une langue peu dotée, la difficulté est la donnée, pas l'entraînement.",
    tags: ["Fine-tuning", "QLoRA", "LLM", "FastAPI", "Speech-to-Text"],
    category: "nlp",
    links: {
      github: "https://github.com/Yohannkp/Api-Fran-ais-a-Mina",
    },
  },
  {
    slug: "self-dev-agent",
    title: "SELF_DEV_AGENT — agent de développement autonome en local",
    description:
      "Agent qui tourne entièrement sur la machine de l'utilisateur via Ollama : il comprend une demande en langage naturel, lit le code du projet et le modifie. Installateur en un clic qui détecte la machine, installe Ollama et choisit les modèles selon la RAM disponible, avec routage entre modèles et désinstallation propre.",
    tags: ["LLM local", "Ollama", "Agents", "Python", "Outillage"],
    category: "nlp",
    links: {},
  },
  {
    slug: "finance-credit-scoring",
    title: "Scoring de risque crédit",
    description:
      "Classification du risque de défaut sur des données bancaires fortement déséquilibrées : rééquilibrage par SMOTE pour limiter les faux négatifs, XGBoost et explicabilité SHAP — AUC 0,88 sur le jeu de test. Tableau de bord de scoring destiné aux chargés de prêt.",
    image: "/projects/Finance Analytics - Credit Scoring.png",
    tags: ["FinTech", "Risk Management", "XGBoost", "SHAP Explainability"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Finance-Analytics---Credit-Scoring",
      portfolio: "https://finance-analytics---credit-scoring.streamlit.app/",
      dashboard:
        "https://app.powerbi.com/groups/me/reports/1247c610-71ea-4df2-b8cc-b71f992e27aa/1bdb29f134b7576fc281?experience=power-bi",
      article: "https://github.com/Yohannkp/Finance-Analytics---Credit-Scoring#readme",
    },
  },
  {
    slug: "prediction-depart-employes",
    title: "Prédiction du départ des employés",
    description:
      "Modèle de classification qui identifie les salariés à risque de départ avec 85 % de précision sur le jeu de test, et met en évidence les facteurs de rétention les plus explicatifs avant la démission. Random Forest, Scikit-learn, tableau de bord Power BI.",
    image: "/projects/Prédiction du départ des Employés avec le Machine Learning.png",
    tags: ["Predictive Modeling", "HR Analytics", "Random Forest", "Scikit-learn"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Projet-Salifort-Motors",
      portfolio: "https://projet-salifort-motors-app.streamlit.app/",
      dashboard:
        "https://app.powerbi.com/groups/me/reports/b183b9be-a9f1-43d1-82a3-b4e6f0c88b3a/156f70583003d97a3e26?experience=power-bi",
    },
  },
  {
    slug: "prediction-productivite",
    title: "Prédiction de la productivité d'une équipe",
    description:
      "Chaîne complète : un modèle entraîné puis servi par une API FastAPI, consommée par une application Flutter multiplateforme qui affiche le suivi et les prédictions.",
    image: "/projects/Application de Prédiction de Productivité d'une équipe.png",
    tags: ["Flutter", "Machine Learning", "FastAPI", "Python"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Application-prediction-de-productivit-",
    },
  },
  {
    slug: "analyse-emotions-temps-reel",
    title: "Détection d'émotions en temps réel",
    description:
      "Reconnaissance d'émotions image par image sur un flux webcam : réseau convolutif entraîné avec PyTorch, capture et prétraitement avec OpenCV.",
    image: "/projects/Projet d'Analyse d'Émotions en Temps Réel avec PyTorch.png",
    tags: ["Python", "PyTorch", "Deep Learning", "OpenCV", "CNN"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/D-tection-des-motions",
    },
  },
  {
    slug: "supermarket-sales-analysis",
    title: "Analyse des ventes en supermarché — SQL",
    description:
      "Requêtes SQL analytiques (CTE, fonctions de fenêtrage) sur plus de 300 000 transactions pour identifier les segments de clients à forte valeur ; les leviers dégagés ont contribué à une hausse de 15 % de la rotation des stocks.",
    image: "/projects/Supermarket Sales Analysis – SQL-Driven Business Insights.png",
    tags: ["Advanced SQL", "Business Intelligence", "Revenue Optimization"],
    category: "data-analysis",
    links: {
      github: "https://github.com/Yohannkp/Supermarket-Sales-Analysis-SQL-Driven-Business-Insights",
    },
  },
]

const visibleDataProjectSlugs = [
  "mina-translator",
  "self-dev-agent",
  "finance-credit-scoring",
  "prediction-depart-employes",
  "prediction-productivite",
  "analyse-emotions-temps-reel",
  "supermarket-sales-analysis",
]

export const visibleDataProjects = dataProjects.filter((project) =>
  visibleDataProjectSlugs.includes(project.slug)
)

export const dataCategories = [
  { id: "all", label: "Tous" },
  { id: "machine-learning", label: "Machine Learning" },
  { id: "deep-learning", label: "Deep Learning" },
  { id: "data-analysis", label: "Analyse de Donnees" },
  { id: "visualization", label: "Visualisation" },
  { id: "nlp", label: "NLP" },
] as const

export function getAllDataTags(): string[] {
  const tags = new Set<string>()
  visibleDataProjects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getDataProjectBySlug(slug: string): DataProject | undefined {
  return dataProjects.find((p) => p.slug === slug)
}
