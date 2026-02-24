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
    slug: "supermarket-sales-analysis",
    title: "Supermarket Sales Analysis -- SQL-Driven Business Insights",
    description:
      "Projet 100% SQL base sur des donnees reelles de ventes en supermarche. Extraction, modelisation, et analyses avancees des performances commerciales, marges, pertes et comportements d'achat.",
    image: "/projects/Supermarket Sales Analysis – SQL-Driven Business Insights.png",
    tags: ["SQL", "Exploration de donnees", "Analyse metier", "Analyse temporelle", "Insights strategiques"],
    category: "data-analysis",
    links: {
      github: "https://github.com/Yohannkp/Supermarket-Sales-Analysis-SQL-Driven-Business-Insights",
    },
  },
  {
    slug: "prediction-depart-employes",
    title: "Prediction du depart des Employes avec le Machine Learning",
    description:
      "L'objectif est d'aider les entreprises a mieux comprendre les raisons du depart et a ameliorer la retention des employes grace a une analyse de donnees et des modeles predictifs.",
    image: "/projects/Prédiction du départ des Employés avec le Machine Learning.png",
    tags: ["pandas", "scikit-learn", "matplotlib", "Streamlit", "Random Forest", "AUC"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Projet-Salifort-Motors",
      portfolio: "https://projet-salifort-motors-app.streamlit.app/",
      dashboard:
        "https://app.powerbi.com/groups/me/reports/b183b9be-a9f1-43d1-82a3-b4e6f0c88b3a/156f70583003d97a3e26?experience=power-bi",
    },
  },
  {
    slug: "finance-credit-scoring",
    title: "Finance Analytics - Credit Scoring",
    description:
      "Mise en place d'un modele de credit scoring pour estimer la probabilite de defaut et prioriser le risque. Pipeline complet : EDA, gestion du desequilibre (SMOTE), modeles avances (XGBoost) et explicabilite (SHAP). Restitution via dashboards Power BI et app Streamlit.",
    image: "/projects/Finance Analytics - Credit Scoring.png",
    tags: ["Power BI", "Python", "Scikit-learn", "XGBoost", "SHAP", "SMOTE"],
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
    slug: "optimisation-ventes-chips",
    title: "Optimisation des ventes de chips via l'analyse comportementale client et A/B testing",
    description:
      "Analyse complete des donnees transactionnelles pour identifier les segments clients cles et evaluer l'impact d'un nouveau layout en magasin a l'aide de tests statistiques.",
    image:
      "/projects/Optimisation des ventes de chips via l'analyse comportementale client et A/B testing.png",
    tags: ["Python", "Pandas", "Matplotlib", "A/B testing", "Correlation", "Insight commercial"],
    category: "data-analysis",
    links: {
      github: "https://github.com/Yohannkp/Optimisation-des-ventes",
    },
  },
  {
    slug: "tableau-bord-automobiles",
    title: "Tableau de Bord des Statistiques Automobiles",
    description:
      "Tableau de bord interactif avec Dash et Plotly pour visualiser les donnees de ventes automobiles, statistiques annuelles et periodes de recession.",
    image: "/projects/Tableau de Bord des Statistiques Automobiles.png",
    tags: ["Python", "Pandas", "Plotly", "Dash", "Matplotlib", "Seaborn", "Folium"],
    category: "visualization",
    links: {
      github: "https://github.com/Yohannkp/Visualisation-des-donn-es-avec-python-IBM-/tree/main/Projet%20Finale",
      portfolio: "https://visualisation-des-donn-es-avec-python-ibm-49d0.onrender.com/",
    },
  },
  {
    slug: "segmentation-clients",
    title: "Analyse Exploratoire et Segmentation des Clients",
    description:
      "Analyse d'un dataset marketing pour identifier les segments de clients les plus rentables en fonction de leur engagement avec les campagnes et leurs depenses.",
    image: "/projects/Analyse Exploratoire et Segmentation des Clients.png",
    tags: ["Python", "pandas", "scikit-learn", "Streamlit", "K-Means", "DBSCAN", "PCA"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Analyse-Marketing",
    },
  },
  {
    slug: "snake-reinforcement-learning",
    title: "Apprentissage par renforcement Snake Game",
    description:
      "Agent d'apprentissage par renforcement qui apprend autonomement a jouer au jeu Snake en utilisant l'algorithme Deep Q-Network (DQN) avec PyTorch, accelere par GPU.",
    image: "/projects/Apprentissage par renforcement Snake Game.png",
    tags: ["Python", "PyTorch", "Pygame", "NumPy", "DQN", "CUDA"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/Apprentissage-par-renforcement-Snake-Game",
    },
  },
  {
    slug: "clustering-analysis",
    title: "Projet d'Analyse de Clustering",
    description:
      "Analyse complete de clustering utilisant K-Means et Clustering Hierarchique Agglomeratif pour identifier des groupes naturels dans les donnees.",
    image: "/projects/Projet d'Analyse de Clustering.png",
    tags: ["Python", "Machine Learning", "K-Means", "Clustering Hierarchique"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-clustering-analysis",
    },
  },
  {
    slug: "detection-fraudes-bancaires",
    title: "Detection de fraudes bancaires",
    description:
      "Analyse d'un dataset de transactions bancaires pour identifier les transactions frauduleuses via une Analyse Exploratoire des Donnees. Application Streamlit interactive.",
    image: "/projects/Detection de fraudes bancaires.png",
    tags: ["Python", "pandas", "seaborn", "Streamlit", "EDA", "Detection de valeurs aberrantes"],
    category: "data-analysis",
    links: {
      github: "https://github.com/Yohannkp/AED-D-tection-de-fraudes",
    },
  },
  {
    slug: "analyse-churn-client",
    title: "Analyse du churn client",
    description:
      "Identifier les facteurs influencant le depart des clients (churn) a partir de donnees transactionnelles, comportementales ou sociodemographiques, puis fournir des recommandations concretes.",
    image: "/projects/Analyse du churn client.png",
    tags: ["Python", "Machine Learning", "Data Science", "Data viz"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Analyse-du-churn-client",
      portfolio: "https://yohannchurnclient.streamlit.app/",
    },
  },
  {
    slug: "prediction-prix-immobilier",
    title: "Prediction des Prix de l'Immobilier",
    description:
      "Modeles de regression pour predire les prix unitaires de l'immobilier en utilisant differentes caracteristiques comme l'age, la distance aux transports et la localisation.",
    image: "/projects/Projet de Régression Linéaire - Prédiction des Prix de l'Immobilier.png",
    tags: ["Python", "Machine Learning", "Regression lineaire"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-linear-regression",
    },
  },
  {
    slug: "classification-vins",
    title: "Projet de Classification de Vins",
    description:
      "Modele de classification pour identifier la variete d'un vin (A, B ou C) en analysant ses proprietes chimiques via un pipeline ML complet.",
    image: "/projects/Projet de Classification de Vins.png",
    tags: ["Python", "Classification", "Machine Learning", "Pipeline ML"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-wine-classification",
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
    slug: "cnn-classification-formes",
    title: "Reseaux de Neurones Convolutifs avec PyTorch",
    description:
      "CNN utilisant PyTorch pour classifier des images de formes geometriques : cercles, carres et triangles.",
    image: "/projects/Réseaux de Neurones Convolutifs avec PyTorch.png",
    tags: ["PyTorch", "CNN", "Deep Learning", "Machine Learning"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-cnn-pytorch",
    },
  },
  {
    slug: "classification-manchots",
    title: "Classification des Manchots avec PyTorch",
    description:
      "Reseau de neurones profond (DNN) pour classifier les manchots en especes bases sur leurs caracteristiques physiques avec PyTorch.",
    image: "/projects/Classification des Manchots avec PyTorch.png",
    tags: ["PyTorch", "Machine Learning", "Deep Learning", "DNN"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-dnn-pytorch",
    },
  },
  {
    slug: "transfer-learning-pytorch",
    title: "Transfer Learning avec PyTorch",
    description:
      "Implementation du Transfer Learning pour la classification d'images geometriques en reutilisant un modele pre-entraine et l'adaptant a une tache specifique.",
    image: "/projects/Transfer Learning avec PyTorch.png",
    tags: ["PyTorch", "Deep Learning", "Transfer Learning"],
    category: "deep-learning",
    links: {
      github: "https://github.com/Yohannkp/azure-ds-transfer-learning",
    },
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
    image: "/projects/Fake News Detection with Machine Learning.png",
    tags: ["Python", "LSTM", "NLP", "Deep Learning", "Matplotlib"],
    category: "nlp",
    links: {
      github: "https://github.com/Yohannkp/Fake-News-Detection-with-Machine-Learning",
    },
  },
  {
    slug: "detection-cancer-sein",
    title: "Detection Cancer du sein",
    description:
      "Modele de regression logistique avec Scikit-learn pour classer des cas de cancer du sein (malin ou benin) a partir du jeu de donnees Breast Cancer Wisconsin.",
    image: "/projects/Détection Cancer du seins.png",
    tags: ["Python", "Machine Learning", "Logistic Regression", "Scikit-learn"],
    category: "machine-learning",
    links: {
      github: "https://github.com/Yohannkp/Breast-Cancer-Prediction-Using-Machine-Learning",
      portfolio: "https://breast-cancer-prediction-using-machine-learning.streamlit.app/",
    },
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
    slug: "analyse-inventaire-excel",
    title: "Analyse d'Inventaire Complexe sous Excel",
    description:
      "Analyse complete de l'inventaire de flotte du comte de Montgomery : nettoyage, doublons, validation, formules et reporting avance avec tableaux croises dynamiques.",
    image: "/projects/Montgomery Fleet Inventory Analysis part2.png",
    tags: ["Excel", "Nettoyage de donnees", "Validation", "AutoSum", "Reporting"],
    category: "data-analysis",
    links: {
      github:
        "https://github.com/Yohannkp/Excel/blob/main/Montgomery%20Project/Montgomery_Fleet_Equipment_Inventory_FA_PART_2_START.xlsx",
    },
  },
  {
    slug: "peer-graded-assignment-excel",
    title: "Peer-Graded Assignment - IBM Data Analyst",
    description:
      "Visualisations a partir de donnees reelles du secteur automobile pour analyser les ventes et les profits par concessionnaire dans le cadre du certificat IBM.",
    image: "/projects/Peer-Graded Assignment.png",
    tags: ["Excel", "Tableaux croises dynamiques", "Graphiques", "Dashboard"],
    category: "visualization",
    links: {
      github:
        "https://github.com/Yohannkp/Excel/tree/main/Data%20Visualization%20and%20Dashboard%20Excel%20cognos/Practice4",
    },
  },
]

const visibleDataProjectSlugs = [
  "finance-credit-scoring",
  "snake-reinforcement-learning",
  "prediction-productivite",
  "analyse-emotions-temps-reel",
  "cnn-classification-formes",
  "transfer-learning-pytorch",
  "fake-news-detection",
  "supermarket-sales-analysis",
  "prediction-depart-employes",
  "optimisation-ventes-chips",
  "tableau-bord-automobiles",
  "analyse-churn-client",
  "detection-fraudes-bancaires",
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
