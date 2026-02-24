export interface DataProject {
  slug: string
  title: string
  description: string
  tags: string[]
  category: "machine-learning" | "data-analysis" | "deep-learning" | "visualization" | "nlp"
  links?: {
    portfolio?: string
    github?: string
  }
}

export const dataProjects: DataProject[] = [
  {
    slug: "supermarket-sales-analysis",
    title: "Supermarket Sales Analysis -- SQL-Driven Business Insights",
    description:
      "Projet 100% SQL base sur des donnees reelles de ventes en supermarche. Extraction, modelisation, et analyses avancees des performances commerciales, marges, pertes et comportements d'achat.",
    tags: ["SQL", "Exploration de donnees", "Analyse metier", "Analyse temporelle", "Insights strategiques"],
    category: "data-analysis",
  },
  {
    slug: "prediction-depart-employes",
    title: "Prediction du depart des Employes avec le Machine Learning",
    description:
      "L'objectif est d'aider les entreprises a mieux comprendre les raisons du depart et a ameliorer la retention des employes grace a une analyse de donnees et des modeles predictifs.",
    tags: ["pandas", "scikit-learn", "matplotlib", "Streamlit", "Random Forest", "AUC"],
    category: "machine-learning",
  },
  {
    slug: "finance-credit-scoring",
    title: "Finance Analytics - Credit Scoring",
    description:
      "Modele de scoring de credit capable d'identifier les clients a risque de defaut de paiement grave. Techniques avancees de machine learning et de gestion des desequilibres de classes.",
    tags: ["Power BI", "Python", "Scikit-learn", "XGBoost", "SHAP", "SMOTE"],
    category: "machine-learning",
  },
  {
    slug: "optimisation-ventes-chips",
    title: "Optimisation des ventes de chips via l'analyse comportementale client et A/B testing",
    description:
      "Analyse complete des donnees transactionnelles pour identifier les segments clients cles et evaluer l'impact d'un nouveau layout en magasin a l'aide de tests statistiques.",
    tags: ["Python", "Pandas", "Matplotlib", "A/B testing", "Correlation", "Insight commercial"],
    category: "data-analysis",
  },
  {
    slug: "tableau-bord-automobiles",
    title: "Tableau de Bord des Statistiques Automobiles",
    description:
      "Tableau de bord interactif avec Dash et Plotly pour visualiser les donnees de ventes automobiles, statistiques annuelles et periodes de recession.",
    tags: ["Python", "Pandas", "Plotly", "Dash", "Matplotlib", "Seaborn", "Folium"],
    category: "visualization",
  },
  {
    slug: "segmentation-clients",
    title: "Analyse Exploratoire et Segmentation des Clients",
    description:
      "Analyse d'un dataset marketing pour identifier les segments de clients les plus rentables en fonction de leur engagement avec les campagnes et leurs depenses.",
    tags: ["Python", "pandas", "scikit-learn", "Streamlit", "K-Means", "DBSCAN", "PCA"],
    category: "machine-learning",
  },
  {
    slug: "snake-reinforcement-learning",
    title: "Apprentissage par renforcement Snake Game",
    description:
      "Agent d'apprentissage par renforcement qui apprend autonomement a jouer au jeu Snake en utilisant l'algorithme Deep Q-Network (DQN) avec PyTorch, accelere par GPU.",
    tags: ["Python", "PyTorch", "Pygame", "NumPy", "DQN", "CUDA"],
    category: "deep-learning",
  },
  {
    slug: "clustering-analysis",
    title: "Projet d'Analyse de Clustering",
    description:
      "Analyse complete de clustering utilisant K-Means et Clustering Hierarchique Agglomeratif pour identifier des groupes naturels dans les donnees.",
    tags: ["Python", "Machine Learning", "K-Means", "Clustering Hierarchique"],
    category: "machine-learning",
  },
  {
    slug: "detection-fraudes-bancaires",
    title: "Detection de fraudes bancaires",
    description:
      "Analyse d'un dataset de transactions bancaires pour identifier les transactions frauduleuses via une Analyse Exploratoire des Donnees. Application Streamlit interactive.",
    tags: ["Python", "pandas", "seaborn", "Streamlit", "EDA", "Detection de valeurs aberrantes"],
    category: "data-analysis",
  },
  {
    slug: "analyse-churn-client",
    title: "Analyse du churn client",
    description:
      "Identifier les facteurs influencant le depart des clients (churn) a partir de donnees transactionnelles, comportementales ou sociodemographiques, puis fournir des recommandations concretes.",
    tags: ["Python", "Machine Learning", "Data Science", "Data viz"],
    category: "machine-learning",
  },
  {
    slug: "prediction-prix-immobilier",
    title: "Prediction des Prix de l'Immobilier",
    description:
      "Modeles de regression pour predire les prix unitaires de l'immobilier en utilisant differentes caracteristiques comme l'age, la distance aux transports et la localisation.",
    tags: ["Python", "Machine Learning", "Regression lineaire"],
    category: "machine-learning",
  },
  {
    slug: "classification-vins",
    title: "Projet de Classification de Vins",
    description:
      "Modele de classification pour identifier la variete d'un vin (A, B ou C) en analysant ses proprietes chimiques via un pipeline ML complet.",
    tags: ["Python", "Classification", "Machine Learning", "Pipeline ML"],
    category: "machine-learning",
  },
  {
    slug: "prediction-productivite",
    title: "Application de Prediction de Productivite d'une equipe",
    description:
      "Solution complete combinant une application Flutter multi-plateforme et un workspace avance de Machine Learning pour le suivi et la prediction de la productivite.",
    tags: ["Flutter", "Machine Learning", "FastAPI", "Python"],
    category: "machine-learning",
  },
  {
    slug: "analyse-emotions-temps-reel",
    title: "Analyse d'Emotions en Temps Reel avec PyTorch",
    description:
      "Systeme de reconnaissance d'emotions en temps reel utilisant un CNN avec PyTorch et OpenCV pour la detection via webcam.",
    tags: ["Python", "PyTorch", "Deep Learning", "OpenCV", "CNN"],
    category: "deep-learning",
  },
  {
    slug: "cnn-classification-formes",
    title: "Reseaux de Neurones Convolutifs avec PyTorch",
    description:
      "CNN utilisant PyTorch pour classifier des images de formes geometriques : cercles, carres et triangles.",
    tags: ["PyTorch", "CNN", "Deep Learning", "Machine Learning"],
    category: "deep-learning",
  },
  {
    slug: "classification-manchots",
    title: "Classification des Manchots avec PyTorch",
    description:
      "Reseau de neurones profond (DNN) pour classifier les manchots en especes bases sur leurs caracteristiques physiques avec PyTorch.",
    tags: ["PyTorch", "Machine Learning", "Deep Learning", "DNN"],
    category: "deep-learning",
  },
  {
    slug: "transfer-learning-pytorch",
    title: "Transfer Learning avec PyTorch",
    description:
      "Implementation du Transfer Learning pour la classification d'images geometriques en reutilisant un modele pre-entraine et l'adaptant a une tache specifique.",
    tags: ["PyTorch", "Deep Learning", "Transfer Learning"],
    category: "deep-learning",
  },
  {
    slug: "dashboard-ventes-ecommerce",
    title: "Tableau de bord des ventes -- Analyse E-commerce multicanal",
    description:
      "Tableau de bord interactif Power BI pour suivre les performances commerciales, detecter les produits et canaux les plus rentables, et identifier les leviers d'optimisation.",
    tags: ["Power BI", "Data analytics", "Dashboard", "E-commerce"],
    category: "visualization",
  },
  {
    slug: "landing-page-ab-test",
    title: "Landing Page A/B Test",
    description:
      "Comparaison de deux versions d'une landing page (control vs treatment) pour determiner laquelle convertit le mieux les utilisateurs.",
    tags: ["Python", "pandas", "matplotlib", "seaborn", "Streamlit", "A/B testing"],
    category: "data-analysis",
  },
  {
    slug: "fake-news-detection",
    title: "Fake News Detection with Machine Learning",
    description:
      "Classification automatique d'articles d'actualite via un modele LSTM bidirectionnel pour identifier les fausses nouvelles sans analyse manuelle.",
    tags: ["Python", "LSTM", "NLP", "Deep Learning", "Matplotlib"],
    category: "nlp",
  },
  {
    slug: "detection-cancer-sein",
    title: "Detection Cancer du sein",
    description:
      "Modele de regression logistique avec Scikit-learn pour classer des cas de cancer du sein (malin ou benin) a partir du jeu de donnees Breast Cancer Wisconsin.",
    tags: ["Python", "Machine Learning", "Logistic Regression", "Scikit-learn"],
    category: "machine-learning",
  },
  {
    slug: "modelisation-donnees-automobiles",
    title: "Analyse et Modelisation des Donnees Automobiles",
    description:
      "Analyse des relations entre caracteristiques des voitures et leur prix via regression lineaire, multiple, polynomiale et pipelines pour des predictions precises.",
    tags: ["Python", "Regression", "Pipeline", "Visualisation", "Correlation"],
    category: "data-analysis",
  },
  {
    slug: "graphiques-excel",
    title: "Creation de graphiques de base avec Excel",
    description:
      "Projet IBM Data Analyst : familiarisation avec la creation de graphiques de base dans Excel a partir de donnees de ventes de voitures.",
    tags: ["Excel", "Graphiques", "Tableaux croises dynamiques", "Reporting"],
    category: "visualization",
  },
  {
    slug: "prix-ordinateurs-portables",
    title: "Analyse des Prix des Ordinateurs Portables",
    description:
      "Analyse des facteurs influencant les prix des ordinateurs portables avec pandas, numpy, matplotlib, seaborn et scipy.",
    tags: ["Python", "pandas", "seaborn", "scipy", "EDA", "Correlation"],
    category: "data-analysis",
  },
  {
    slug: "prediction-prix-maisons",
    title: "Analyse et Modelisation des Prix des Maisons",
    description:
      "Analyse d'un ensemble de donnees sur les maisons, preprocessing, exploration des variables, et construction de modeles de regression pour predire les prix.",
    tags: ["Python", "Scikit-learn", "Regression", "GridSearchCV", "Validation croisee"],
    category: "machine-learning",
  },
  {
    slug: "analyse-donnees-medicales",
    title: "Analyse de donnees medicales",
    description:
      "Analyse d'un ensemble de donnees medicales pour comprendre les relations entre variables et frais medicaux, avec des modeles predictifs.",
    tags: ["Python", "Pandas", "Scikit-learn", "Regression", "EDA"],
    category: "data-analysis",
  },
  {
    slug: "cognos-analytics-dashboard",
    title: "Visualisations avec IBM Cognos Analytics",
    description:
      "Tableau de bord interactif dans Cognos Analytics permettant d'analyser les ventes et services de plusieurs concessions automobiles.",
    tags: ["IBM Cognos", "Dashboard", "KPIs", "Reporting"],
    category: "visualization",
  },
  {
    slug: "recommandation-films",
    title: "Recommandation de films",
    description:
      "Modele de machine learning sophistique destine a la recommandation de films personnalisee en fonction des preferences des utilisateurs.",
    tags: ["Python", "Machine Learning", "Recommandation"],
    category: "machine-learning",
  },
  {
    slug: "montgomery-fleet-part1",
    title: "Montgomery Fleet Inventory Analysis - Part 1",
    description:
      "Nettoyage et analyse d'un ensemble de donnees relatif a l'inventaire des equipements de la flotte du comte de Montgomery avec Excel.",
    tags: ["Excel", "Nettoyage de donnees", "Tableaux croises dynamiques", "Reporting"],
    category: "data-analysis",
  },
  {
    slug: "montgomery-fleet-part2",
    title: "Montgomery Fleet Inventory Analysis - Part 2",
    description:
      "Suite de l'analyse de l'inventaire Montgomery avec exploration avancee, doublons, validation de donnees et formules.",
    tags: ["Excel", "Nettoyage de donnees", "Validation", "AutoSum"],
    category: "data-analysis",
  },
  {
    slug: "peer-graded-assignment-excel",
    title: "Peer-Graded Assignment - IBM Data Analyst",
    description:
      "Visualisations a partir de donnees reelles du secteur automobile pour analyser les ventes et les profits par concessionnaire dans le cadre du certificat IBM.",
    tags: ["Excel", "Tableaux croises dynamiques", "Graphiques", "Dashboard"],
    category: "visualization",
  },
]

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
  dataProjects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}

export function getDataProjectBySlug(slug: string): DataProject | undefined {
  return dataProjects.find((p) => p.slug === slug)
}
