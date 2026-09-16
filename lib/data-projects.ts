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
    title: "Credit Risk Scoring Engine",
    description:
      "End-to-end banking risk classification system. Tackled extreme class imbalance (SMOTE) to minimize false negatives in default prediction. Deployed interactive scoring dashboards for loan officers.",
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
    title: "Employee Retention AI",
    description:
      "Predictive model identifying at-risk employees with 85% accuracy. Designed to reduce turnover costs by flagging key retention factors before resignation occurs.",
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
    title: "Application de Prediction de Productivite d'une equipe",
    description:
      "Solution complete combinant une application Flutter multi-plateforme et un workspace avance de Machine Learning pour le suivi et la prediction de la productivite.",
    image: "/projects/Application de Prédiction de Productivité d'une équipe.png",
    tags: ["Flutter", "Machine Learning", "FastAPI", "Python"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Application-prediction-de-productivit-",
    },
  },
  {
    slug: "analyse-emotions-temps-reel",
    title: "Analyse d'Emotions en Temps Reel avec PyTorch",
    description:
      "Systeme de reconnaissance d'emotions en temps reel utilisant un CNN avec PyTorch et OpenCV pour la detection via webcam.",
    image: "/projects/Projet d'Analyse d'Émotions en Temps Réel avec PyTorch.png",
    tags: ["Python", "PyTorch", "Deep Learning", "OpenCV", "CNN"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/D-tection-des-motions",
    },
  },
  {
    slug: "supermarket-sales-analysis",
    title: "Supermarket Sales Intelligence",
    description:
      "Transforming raw transaction logs into actionable business strategy. Used advanced SQL window functions and CTEs to identify high-value customer segments and optimize inventory turnover by 15%.",
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
