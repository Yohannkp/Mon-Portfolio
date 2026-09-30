/**
 * Les projets, presentes par ce qu'ils PROUVENT plutot que par leur techno.
 *
 * Chaque dossier repond a trois questions : quel probleme, quelle preuve, et ce que
 * cela demontre. Rien n'est invente : chaque chiffre vient d'un projet documente
 * (lib/projects.ts, ou les depots). Un projet sans chiffre ne recoit pas de chiffre :
 * il a un enjeu et un resultat, c'est plus honnete qu'un nombre de decoration.
 *
 * Source unique : l'accueil (les projets phares) et la page /projects s'en servent.
 */

export type Axe = "production" | "modele" | "mesure" | "application"

export const AXES: { id: Axe; titre: string; promesse: string }[] = [
  {
    id: "production",
    titre: "Mettre des modèles en production",
    promesse: "Servir, conteneuriser, rendre fiable : qu'un modèle serve à quelqu'un, pas seulement dans un notebook.",
  },
  {
    id: "modele",
    titre: "Affiner et entraîner des modèles",
    promesse: "Comprendre ce qu'on entraîne : la donnée, l'environnement, l'architecture, et ce qui manque quand rien n'existe.",
  },
  {
    id: "mesure",
    titre: "Mesurer et prouver",
    promesse: "Ne pas s'arrêter à « ça marche » : choisir le bon test, quantifier l'effet, expliquer la décision.",
  },
  {
    id: "application",
    titre: "Construire des applications",
    promesse: "Le socle de développement : backend, authentification, bases de données, interfaces.",
  },
]

export type GlypheId = "rag" | "sql" | "mina" | "agent" | "bascule" | "paires" | "ab" | "texte"

export type Dossier = {
  slug: string
  nom: string
  /** En quelques mots : ce que c'est. */
  role: string
  axe: Axe
  /** Le probleme, en une phrase. */
  enjeu: string
  /** Ce qui a ete fait et obtenu. */
  resultat: string
  /** La preuve chiffree, quand elle existe. */
  chiffre?: { valeur: string; unite: string }
  /** Ce que ce projet demontre. */
  prouve: string[]
  stack: string[]
  depot?: string
  demo?: string
  /** Page d'etude de cas, quand il y en a une. */
  fiche?: string
  image?: string
  /** `contain` pour un graphique : on ne rogne pas une courbe. */
  ajuste?: "cover" | "contain"
  glyphe?: GlypheId
  /** Les projets phares de l'accueil : leur rang, leur titre et la question qu'un recruteur se pose. */
  phare?: { rang: number; titre: string; question: string }
}

export const DOSSIERS: Dossier[] = [
  /* ------------------------------ Production ------------------------------ */
  {
    slug: "rag-local",
    nom: "RAG-Local",
    role: "assistant documentaire",
    axe: "production",
    enjeu: "Un assistant utile sur ses documents, sans envoyer un seul fichier à un service externe.",
    resultat:
      "Recherche hybride (BM25 + vecteurs, fusion RRF), reranking cross-encoder, réponses citées à la page près. Les images des PDF sont décrites par un modèle de vision local et deviennent cherchables comme du texte. Une suite RAGAS mesure la qualité.",
    chiffre: { valeur: "0", unite: "requête réseau sortante : tout reste sur la machine" },
    prouve: ["Mettre en production", "Évaluer un RAG"],
    stack: ["FastAPI", "Chroma", "Ollama", "Next.js", "Docker Compose", "RAGAS"],
    depot: "https://github.com/Yohannkp/RAG-Local",
    glyphe: "rag",
    phare: { rang: 1, titre: "Aucune donnée ne quitte la machine", question: "Peut-il livrer un système d'IA sans exposer les données ?" },
  },
  {
    slug: "self-dev-agent",
    nom: "SELF_DEV_AGENT",
    role: "agent de développement",
    axe: "production",
    enjeu: "Un modèle local de 7 milliards de paramètres n'est pas fiable : on ne peut pas croire ses réponses.",
    resultat:
      "L'agent n'écrit pas du code en espérant : il explore, modifie, exécute les tests et se corrige. Il tourne entièrement en local via Ollama, avec un installateur en un clic qui choisit les modèles selon la RAM disponible.",
    chiffre: { valeur: "7 Md", unite: "de paramètres : peu fiable seul, vérifié par les tests" },
    prouve: ["Fiabiliser un modèle", "Outillage"],
    stack: ["Ollama", "Tool calling", "AST", "Python"],
    depot: "https://github.com/Yohannkp/Claude-local",
    glyphe: "agent",
    phare: { rang: 4, titre: "Un agent qui vérifie son propre travail", question: "Peut-il rendre fiable un modèle qui ne l'est pas ?" },
  },
  {
    slug: "prediction-productivite",
    nom: "Prédiction de productivité",
    role: "modèle servi par une API",
    axe: "production",
    enjeu: "Prédire la productivité d'une équipe, et que la prédiction serve dans une application.",
    resultat:
      "Un modèle entraîné puis servi par une API FastAPI, consommée par une application Flutter multiplateforme qui affiche le suivi et les prédictions.",
    prouve: ["Servir un modèle"],
    stack: ["FastAPI", "Flutter", "Python", "Machine Learning"],
    depot: "https://github.com/Yohannkp/Application-prediction-de-productivit-",
    image: "/projects/Application de Prédiction de Productivité d'une équipe.png",
  },

  /* ------------------------------- Modeles -------------------------------- */
  {
    slug: "mina-translator",
    nom: "Mina-Translator",
    role: "traduction français ↔ mina",
    axe: "modele",
    enjeu: "Le mina n'a aucun corpus parallèle public : sur une langue peu dotée, la difficulté est la donnée, pas l'entraînement.",
    resultat:
      "Un corpus généré pour l'occasion puis audité par script : 360 paires exploitables sur 500, réparties en sept domaines, complétées par ~19 600 transcriptions Common Voice. Qwen2-0.5B affiné en QLoRA 4 bits, Whisper en amont, service FastAPI, et une application de collecte participative pour étendre le corpus.",
    chiffre: { valeur: "360", unite: "paires retenues après audit, sur 500 générées" },
    prouve: ["Affiner un modèle", "Construire la donnée"],
    stack: ["QLoRA", "Whisper", "FastAPI", "Streamlit"],
    depot: "https://github.com/Yohannkp/mina-translator",
    glyphe: "mina",
    phare: { rang: 3, titre: "Une langue sans corpus", question: "Sait-il travailler quand la donnée n'existe pas ?" },
  },
  {
    slug: "snake-rl-dqn",
    nom: "Snake RL",
    role: "apprentissage par renforcement",
    axe: "modele",
    enjeu: "Apprendre à jouer à Snake sans aucune règle écrite à la main.",
    resultat:
      "Environnement compatible Gymnasium écrit sur mesure, DQN en PyTorch avec réseau cible et mémoire de rejeu, entraînement sur GPU. Un projet en modules (agent, entraînement, évaluation, démonstration), pas un notebook.",
    chiffre: { valeur: "0", unite: "règle écrite à la main : l'agent apprend seul" },
    prouve: ["Entraîner un modèle"],
    stack: ["PyTorch", "Gymnasium", "DQN"],
    depot: "https://github.com/Yohannkp/Apprentissage-par-renforcement-Snake-Game",
    image: "/projects/Apprentissage par renforcement Snake Game.png",
    ajuste: "contain",
    phare: { rang: 6, titre: "Un environnement écrit à la main", question: "Comprend-il ce qu'il entraîne ?" },
  },
  {
    slug: "analyse-emotions-temps-reel",
    nom: "Détection d'émotions",
    role: "vision par ordinateur",
    axe: "modele",
    enjeu: "Reconnaître des émotions image par image, en temps réel, sur un flux webcam.",
    resultat: "Un réseau convolutif entraîné avec PyTorch, avec capture et prétraitement du flux par OpenCV.",
    prouve: ["Vision temps réel"],
    stack: ["PyTorch", "OpenCV", "CNN"],
    depot: "https://github.com/Yohannkp/D-tection-des-motions",
    image: "/projects/Projet d'Analyse d'Émotions en Temps Réel avec PyTorch.png",
  },
  {
    slug: "fake-news-lstm",
    nom: "Détection de fausses actualités",
    role: "classification de texte",
    axe: "modele",
    enjeu: "Distinguer les vrais des faux articles de presse.",
    resultat:
      "Nettoyage et tokenisation, couche d'embedding, LSTM bidirectionnel sous Keras, puis analyse des mots caractéristiques de chaque classe.",
    prouve: ["Traiter du texte"],
    stack: ["Keras", "LSTM", "NLP"],
    depot: "https://github.com/Yohannkp/Fake-News-Detection-with-Machine-Learning",
    glyphe: "texte",
  },

  /* ------------------------------- Mesure --------------------------------- */
  {
    slug: "optimisation-ventes-chips",
    nom: "Optimisation des ventes",
    role: "impact d'un agencement en magasin",
    axe: "mesure",
    enjeu: "Mesurer l'effet d'un nouvel agencement quand on ne peut pas tirer les magasins au sort.",
    resultat:
      "Chaque magasin test est apparié à un magasin contrôle, choisi par corrélation sur les ventes et la fréquentation avant l'intervention, puis l'écart est testé statistiquement. C'est ce qui rend la mesure défendable. Restitution pour un Category Manager.",
    chiffre: { valeur: "1 : 1", unite: "un magasin contrôle apparié à chaque magasin test" },
    prouve: ["Prouver un effet", "Inférence causale"],
    stack: ["pandas", "Inférence causale", "Tests statistiques"],
    depot: "https://github.com/Yohannkp/Optimisation-des-ventes",
    image: "/projects/optimisation-ventes-chips.png",
    glyphe: "paires",
    phare: { rang: 7, titre: "Mesurer sans pouvoir randomiser", question: "Peut-il prouver un effet quand on ne peut pas tirer au sort ?" },
  },
  {
    slug: "finance-credit-scoring",
    nom: "Scoring de risque crédit",
    role: "classification déséquilibrée",
    axe: "mesure",
    enjeu: "Prévoir le défaut sur des données bancaires fortement déséquilibrées, en limitant les faux négatifs.",
    resultat: "Rééquilibrage par SMOTE, XGBoost et explicabilité SHAP, avec un tableau de bord de scoring pour les chargés de prêt.",
    chiffre: { valeur: "0,88", unite: "d'AUC sur le jeu de test" },
    prouve: ["Expliquer un modèle"],
    stack: ["XGBoost", "SHAP", "SMOTE"],
    depot: "https://github.com/Yohannkp/Finance-Analytics---Credit-Scoring",
    image: "/projects/Finance Analytics - Credit Scoring.png",
  },
  {
    slug: "prediction-depart-employes",
    nom: "Départ des employés",
    role: "rétention des salariés",
    axe: "mesure",
    enjeu: "Identifier les salariés à risque de départ, et ce qui les retient avant qu'ils démissionnent.",
    resultat: "Un Random Forest sous Scikit-learn, comparé à une régression logistique et à un arbre de décision, qui retrouve 90 % des départs réels et met en évidence les facteurs de rétention les plus explicatifs, restitué dans un tableau de bord Power BI.",
    chiffre: { valeur: "0,94", unite: "d'AUC sur le jeu de test" },
    prouve: ["Interpréter un modèle"],
    stack: ["Random Forest", "Scikit-learn", "Power BI"],
    depot: "https://github.com/Yohannkp/Projet-Salifort-Motors.",
    image: "/projects/Prédiction du départ des Employés avec le Machine Learning.png",
  },
  {
    slug: "supermarket-sales-analysis",
    nom: "Ventes en supermarché",
    role: "analyse SQL",
    axe: "mesure",
    enjeu: "Savoir ce qui rapporte et ce qui coûte dans les ventes d'un supermarché : plus de 878 000 lignes de vente, prix de gros et taux de perte.",
    resultat: "Des requêtes SQL analytiques (CTE, fonctions de fenêtrage) sur une base SQLite : produits les plus rentables, produits très vendus mais peu rentables, coût des pertes par catégorie, retours et effet des remises.",
    chiffre: { valeur: "878 000", unite: "lignes de vente analysées en SQL" },
    prouve: ["SQL avancé", "Analyse métier"],
    stack: ["SQL", "CTE", "Fonctions de fenêtrage"],
    depot: "https://github.com/Yohannkp/Supermarket-Sales-Analysis-SQL-Driven-Business-Insights",
    image: "/projects/Supermarket Sales Analysis – SQL-Driven Business Insights.png",
    glyphe: "sql",
    phare: { rang: 2, titre: "Trouver la valeur dans 878 000 lignes de vente", question: "Sait-il faire parler une grande base avec du SQL ?" },
  },
  {
    slug: "ab-test-landing-page",
    nom: "Test A/B d'une page",
    role: "expérimentation",
    axe: "mesure",
    enjeu: "Décider laquelle de deux versions d'une page convertit le mieux.",
    resultat:
      "La méthode prime sur le résultat : normalité (Shapiro) avant de choisir entre Student et Mann-Whitney, khi-deux sur les taux de conversion, lecture des p-values, restitution dans une application Streamlit.",
    prouve: ["Choisir le bon test"],
    stack: ["scipy", "pandas", "Streamlit"],
    depot: "https://github.com/Yohannkp/Tests-Statistiques-Landing-Page",
    glyphe: "ab",
  },

  /* ---------------------------- Applications ------------------------------ */
  {
    slug: "leboncoin-mern",
    nom: "Le Bon Coin",
    role: "plateforme d'annonces",
    axe: "application",
    enjeu: "Authentifier sans stocker de mot de passe en clair, et garantir qu'un utilisateur ne modifie que ses propres annonces.",
    resultat:
      "Un backend Express découpé en contrôleurs, modèles, routes et middleware, un jeton JWT vérifié par un middleware, puis une migration de MongoDB vers SQLite : modèles et contrôleurs entièrement réécrits.",
    chiffre: { valeur: "MongoDB → SQLite", unite: "migration : modèles et contrôleurs réécrits" },
    prouve: ["Concevoir un backend", "Migrer une base"],
    stack: ["Node.js", "Express", "JWT", "Sequelize", "React"],
    depot: "https://github.com/Yohannkp/React-MERN-Project",
    fiche: "/projects/leboncoin-mern",
    image: "/projects/leboncoin.png",
    glyphe: "bascule",
    phare: { rang: 5, titre: "Changer de base sans tout casser", question: "Sait-il faire évoluer un backend sans le casser ?" },
  },
  {
    slug: "applyflow",
    nom: "ApplyFlow",
    role: "SaaS de suivi de candidatures",
    axe: "application",
    enjeu: "Ne plus perdre le fil de dizaines de candidatures dans des tableurs.",
    resultat: "Un kanban, des fiches détaillées avec notes, contacts et rappels, et un tableau de bord de progression.",
    prouve: ["Produit full-stack"],
    stack: ["Next.js", "TypeScript", "Supabase", "Tailwind CSS"],
    demo: "https://v0-apply-flow-saa-s-app.vercel.app/",
    fiche: "/projects/applyflow",
    image: "/projects/applyflow.jpg",
  },
  {
    slug: "movies-database",
    nom: "Recommandation de films",
    role: "base de graphes",
    axe: "application",
    enjeu: "Naviguer les relations entre films, acteurs, réalisateurs et genres, avec une recherche tolérante aux erreurs.",
    resultat: "Neo4j pour modéliser les relations, une API FastAPI et une interface React, avec recherche floue et recommandations par similarité.",
    prouve: ["Base de graphes"],
    stack: ["Neo4j", "FastAPI", "React", "Docker Compose"],
    depot: "https://github.com/fayesarah555/movies-webapp",
    fiche: "/projects/movies-database",
    image: "/projects/movie_database.png",
  },
  {
    slug: "cloudus-api",
    nom: "CloudUs",
    role: "API de stockage cloud",
    axe: "application",
    enjeu: "Stocker des fichiers, gérer les quotas d'espace et facturer automatiquement.",
    resultat: "Une API REST Symfony avec authentification JWT, quotas, achats d'extension, factures PDF, et des rôles d'administrateur avec tableaux de bord.",
    prouve: ["API REST sécurisée"],
    stack: ["Symfony", "PHP", "JWT", "MySQL"],
    depot: "https://github.com/Batyeste/CloudUs",
    fiche: "/projects/cloudus-api",
    image: "/projects/api_gestion_fichier.png",
  },
  {
    slug: "minisearch",
    nom: "MiniSearch",
    role: "moteur de recherche interne",
    axe: "application",
    enjeu: "Retrouver l'information pertinente parmi des milliers de documents, vite, avec des filtres.",
    resultat:
      "La recherche full-text native de PostgreSQL et un scoring décomposé (pertinence textuelle, boost du titre, récence, popularité, qualité), avec React et Supabase.",
    prouve: ["Recherche full-text"],
    stack: ["PostgreSQL", "React", "TypeScript", "Supabase"],
    demo: "https://find-all-finder.lovable.app/",
    fiche: "/projects/minisearch",
    image: "/projects/MiniSearch.png",
  },
]

export const PHARES = DOSSIERS.filter((d) => d.phare).sort((a, b) => a.phare!.rang - b.phare!.rang)

export const dossiersParAxe = (axe: Axe) => DOSSIERS.filter((d) => d.axe === axe)

/** Les preuves chiffrees : ce que la page /projects met en avant en tete. */
export const PREUVES = DOSSIERS.filter((d) => d.chiffre)

/** Le nombre de projets phares, en toutes lettres (« Sept projets, sept preuves »). */
const MOTS = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix"]
export const NB_PHARES = PHARES.length
export const NB_PHARES_MOT = MOTS[PHARES.length] ?? String(PHARES.length)
