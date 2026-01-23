export interface Project {
  slug: string
  name: string
  pitch: string
  description: string
  image: string
  tags: string[]
  stack: {
    frontend: string[]
    backend: string[]
    database: string[]
    tools: string[]
  }
  links: {
    demo?: string
    github?: string
  }
  problem: string
  solution: string
  features: string[]
  challenges: string[]
  learnings: string[]
  screenshots: string[]
}

export const projects: Project[] = [
  {
    slug: "applyflow",
    name: "ApplyFlow",
    pitch: "Une application pour organiser et suivre ses candidatures d'emploi efficacement.",
    description: "ApplyFlow est un outil de gestion de candidatures qui aide les chercheurs d'emploi à organiser leur recherche. L'application permet de suivre l'état de chaque candidature, de stocker les informations importantes et de visualiser sa progression.",
    image: "/projects/applyflow.jpg",
    tags: ["React", "TypeScript", "API REST", "Auth"],
    stack: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "React Query"],
      backend: ["Node.js", "Express", "JWT"],
      database: ["PostgreSQL", "Prisma"],
      tools: ["Git", "Vercel", "Postman"],
    },
    links: {
      demo: "https://role-route-finder.lovable.app/",
      github: "https://github.com/Yohannkp/apply-flow",
    },
    problem: "Quand on cherche un emploi, on postule à des dizaines d'offres. Sans un système organisé, on perd le fil : quel poste, quelle entreprise, où en est-on dans le processus ? Les spreadsheets deviennent vite un cauchemar à maintenir.",
    solution: "ApplyFlow centralise toutes les candidatures dans une interface claire avec un système de kanban. Chaque candidature a sa fiche détaillée avec notes, contacts et rappels. Le dashboard offre une vue d'ensemble de la progression.",
    features: [
      "Tableau kanban drag & drop pour gérer les étapes",
      "Fiches candidatures détaillées avec notes",
      "Système de rappels et notifications",
      "Statistiques et graphiques de progression",
      "Export des données en CSV",
      "Authentification sécurisée",
    ],
    challenges: [
      "Implémenter le drag & drop fluide avec React DnD tout en maintenant la synchronisation avec le backend",
      "Gérer les états optimistes pour une UX réactive malgré la latence réseau",
      "Concevoir un schéma de base de données flexible pour différents workflows de recrutement",
    ],
    learnings: [
      "Maîtrise de React Query pour la gestion du cache et des mutations",
      "Architecture API REST propre avec validation des données",
      "Importance des tests d'intégration pour les fonctionnalités critiques",
      "Gestion des états de chargement et d'erreur pour une meilleure UX",
    ],
    screenshots: ["/projects/applyflow-1.jpg", "/projects/applyflow-2.jpg"],
  },
  {
    slug: "minisearch",
    name: "MiniSearch",
    pitch: "Un moteur de recherche interne performant pour naviguer dans de grandes bases documentaires.",
    description: "MiniSearch est un moteur de recherche full-text conçu pour être intégré dans des applications internes. Il permet de rechercher rapidement dans des milliers de documents avec des fonctionnalités avancées comme les filtres, la recherche floue et la mise en surbrillance des résultats.",
    image: "/projects/minisearch.jpg",
    tags: ["Next.js", "Elasticsearch", "Full-text", "API"],
    stack: {
      frontend: ["Next.js", "TypeScript", "Tailwind CSS", "Framer Motion"],
      backend: ["Next.js API Routes", "Node.js"],
      database: ["Elasticsearch", "Redis (cache)"],
      tools: ["Docker", "Git", "GitHub Actions"],
    },
    links: {
      demo: "https://minisearch.demo",
      github: "https://github.com/alexmartin/minisearch",
    },
    problem: "Les entreprises accumulent des tonnes de documents : wikis, rapports, emails archivés. Trouver une information précise devient un parcours du combattant. Les solutions existantes sont souvent lourdes ou trop chères pour les petites équipes.",
    solution: "MiniSearch offre une recherche instantanée avec auto-complétion et filtres intelligents. L'indexation incrémentale permet de maintenir la base à jour sans downtime. L'interface épurée met l'accent sur les résultats pertinents.",
    features: [
      "Recherche full-text avec typo-tolérance",
      "Auto-complétion et suggestions en temps réel",
      "Filtres par type, date et catégorie",
      "Mise en surbrillance des termes recherchés",
      "API REST pour intégration externe",
      "Dashboard d'analytics des recherches",
    ],
    challenges: [
      "Optimiser les requêtes Elasticsearch pour des temps de réponse < 100ms",
      "Implémenter un système de cache intelligent avec Redis pour réduire la charge",
      "Gérer l'indexation de documents volumineux sans bloquer l'application",
    ],
    learnings: [
      "Fonctionnement interne d'Elasticsearch et optimisation des mappings",
      "Stratégies de cache et invalidation avec Redis",
      "Patterns de debouncing et throttling pour les recherches en temps réel",
      "Importance du monitoring et des métriques de performance",
    ],
    screenshots: ["/projects/minisearch-1.jpg", "/projects/minisearch-2.jpg"],
  },
  {
    slug: "taskboard",
    name: "TaskBoard",
    pitch: "Un clone Trello minimaliste pour la gestion de projets en équipe.",
    description: "TaskBoard est une application de gestion de tâches inspirée de Trello. Elle permet de créer des tableaux, des listes et des cartes pour organiser le travail en équipe. L'application met l'accent sur la simplicité et la performance.",
    image: "/projects/taskboard.jpg",
    tags: ["React", "Node.js", "WebSocket", "Collaboration"],
    stack: {
      frontend: ["React", "TypeScript", "Tailwind CSS", "Zustand"],
      backend: ["Node.js", "Express", "Socket.io"],
      database: ["MongoDB", "Mongoose"],
      tools: ["Git", "Docker", "Jest"],
    },
    links: {
      demo: "https://taskboard.demo",
      github: "https://github.com/alexmartin/taskboard",
    },
    problem: "Les outils de gestion de projet comme Trello ou Asana sont puissants mais parfois trop complexes pour des petites équipes. On veut juste un tableau avec des colonnes et des cartes, sans toutes les fonctionnalités premium.",
    solution: "TaskBoard va à l'essentiel : tableaux, listes, cartes. Le temps réel permet la collaboration instantanée. L'interface minimaliste réduit la charge cognitive et permet de se concentrer sur les tâches.",
    features: [
      "Tableaux et listes personnalisables",
      "Cartes avec descriptions et assignations",
      "Collaboration en temps réel via WebSocket",
      "Drag & drop intuitif",
      "Labels et filtres par couleur",
      "Historique des modifications",
    ],
    challenges: [
      "Synchroniser l'état en temps réel entre plusieurs utilisateurs avec Socket.io",
      "Gérer les conflits d'édition concurrent (optimistic locking)",
      "Optimiser le rendu React pour des tableaux avec beaucoup de cartes",
    ],
    learnings: [
      "Architecture temps réel avec WebSocket et gestion des événements",
      "State management avec Zustand et patterns de normalisation",
      "Tests d'intégration pour les fonctionnalités collaboratives",
      "DevOps basique avec Docker pour le développement local",
    ],
    screenshots: ["/projects/taskboard-1.jpg", "/projects/taskboard-2.jpg"],
  },
  {
    slug: "movies-database",
    name: "Movies Database",
    pitch: "Application web moderne pour explorer et gérer une base de données de films.",
    description: "Une application web moderne pour explorer et gérer une base de données de films utilisant React, FastAPI et Neo4j. Interface intuitive avec recherche avancée, détails complets des films et système de recommandations intelligentes.",
    image: "/projects/movie_database.png",
    tags: ["React", "FastAPI", "Neo4j", "Vite", "Python"],
    stack: {
      frontend: ["React", "Vite", "TypeScript", "Axios", "CSS"],
      backend: ["FastAPI", "Python", "Uvicorn"],
      database: ["Neo4j", "Graph Database"],
      tools: ["PowerShell", "Git", "Neo4j Browser"],
    },
    links: {
      github: "https://github.com/fayesarah555/movies-webapp.git",
    },
    problem: "Explorer de grandes bases de données de films peut être complexe sans une interface intuitive. Les relations entre films, acteurs, réalisateurs et genres sont difficiles à naviguer avec des bases de données traditionnelles. Les utilisateurs ont besoin d'une recherche performante et tolérante aux erreurs.",
    solution: "Movies Database utilise Neo4j comme base de données graphique pour modéliser naturellement les relations entre entités. L'architecture React + FastAPI offre une interface moderne et performante. La recherche floue et les recommandations basées sur les similitudes améliorent l'expérience utilisateur.",
    features: [
      "Interface responsive et navigation intuitive",
      "Affichage paginé des films avec 'Charger plus'",
      "Recherche avancée floue et tolérante aux erreurs",
      "Détails complets : casting, réalisateurs, producteurs",
      "Système de recommandations de films similaires",
      "Monitoring de l'état des services (API + Neo4j)",
      "Gestion des erreurs et loading states",
      "Documentation API interactive avec Swagger",
    ],
    challenges: [
      "Implémenter une recherche floue performante avec algorithme de similarité",
      "Modéliser efficacement les relations complexes dans Neo4j avec Cypher",
      "Gérer la pagination et le chargement progressif pour une meilleure UX",
      "Mettre en place un monitoring robuste de la connexion Neo4j et de l'API",
    ],
    learnings: [
      "Maîtrise des bases de données graphiques Neo4j et du langage Cypher",
      "Développement d'API REST moderne avec FastAPI et validation Pydantic",
      "Architecture micro-services et communication front-end/back-end",
      "Gestion des états de chargement et d'erreurs pour une UX optimale",
      "Configuration CORS et sécurisation des API",
    ],
    screenshots: ["/projects/movie_database.png"],
  },
  {
    slug: "auto-ecole",
    name: "Auto-école en ligne",
    pitch: "Plateforme de réservation de cours de conduite avec gestion complète des élèves et instructeurs.",
    description: "Plateforme web complète pour la gestion d'une auto-école en ligne. Permet la réservation de cours de conduite, la gestion des disponibilités des instructeurs, le suivi des progrès des élèves et l'administration des offres via un back-office modulable.",
    image: "/projects/auto_ecole.png",
    tags: ["Symfony", "PHP", "Stripe", "Dashboard", "Email"],
    stack: {
      frontend: ["Twig", "Bootstrap", "JavaScript", "CSS"],
      backend: ["Symfony", "PHP 8", "Doctrine ORM"],
      database: ["MySQL", "Doctrine"],
      tools: ["Stripe", "Email notifications", "Git", "Composer"],
    },
    links: {
      github: "https://github.com/Yohannkp/AUTO_ECOLE",
    },
    problem: "Les auto-écoles traditionnelles gèrent souvent leurs plannings et réservations de manière manuelle ou avec des outils dispersés. La coordination entre instructeurs et élèves, le suivi des heures de conduite et les paiements sont des processus chronophages et sources d'erreurs.",
    solution: "Une plateforme centralisée développée avec Symfony qui digitalise l'ensemble du processus. Le système de planning intelligent synchronise les disponibilités des instructeurs avec les demandes des élèves. Les notifications email automatiques assurent une communication fluide. Le back-office modulable permet une gestion efficace des offres et services.",
    features: [
      "Planning intelligent instructeurs vs élèves avec synchronisation",
      "Système de réservation de cours en ligne",
      "Notifications email automatiques pour les rendez-vous",
      "Espace élève personnel : bilans, heures restantes, progression",
      "Back-office d'administration modulable pour gérer les offres",
      "Intégration Stripe pour les paiements en ligne",
      "Gestion des disponibilités des instructeurs",
      "Suivi détaillé des progrès et performances des élèves",
    ],
    challenges: [
      "Développer un système de planning robuste gérant les conflits de disponibilités",
      "Intégrer Stripe pour des paiements sécurisés et conformes",
      "Concevoir un back-office modulable et évolutif pour différents types d'offres",
      "Mettre en place un système de notifications email fiable et automatisé",
    ],
    learnings: [
      "Maîtrise du framework Symfony et de son architecture MVC",
      "Intégration de solutions de paiement avec Stripe API",
      "Conception de systèmes de planning et gestion de calendriers",
      "Développement de dashboards administratifs complexes",
      "Gestion des notifications email et templating",
    ],
    screenshots: ["/projects/auto_ecole.png"],
  },
  {
    slug: "text-to-speech-ai",
    name: "Text-to-Speech avec IA",
    pitch: "Assistant vocal multilingue avec interface animée et réponses IA en temps réel.",
    description: "Application mobile Flutter permettant d'interagir avec une IA via la voix. L'utilisateur envoie des requêtes textuelles qui sont converties en parole naturelle. Intègre la correction orthographique, la traduction multilingue et la synchronisation Firebase.",
    image: "/projects/text_to_speech_ai.png",
    tags: ["Flutter", "Firebase", "IA vocale", "Android", "TTS"],
    stack: {
      frontend: ["Flutter", "Dart", "Animated UI"],
      backend: ["Firebase Realtime Database", "AI API"],
      database: ["Firebase Realtime DB"],
      tools: ["Text-to-Speech API", "Git", "Android Studio"],
    },
    links: {
      demo: "https://drive.google.com/file/d/1a76glMwJPePfoZuSV2Zj6k68_7VsRG-P/view?usp=sharing",
      github: "https://github.com/Yohannkp/application_translate_flutter",
    },
    problem: "Les applications d'assistant vocal existantes manquent souvent de personnalisation et ne combinent pas efficacement la synthèse vocale avec les capacités d'IA moderne. Les utilisateurs ont besoin d'une interface accessible, multilingue et qui conserve l'historique des conversations.",
    solution: "Une application Flutter native qui intègre Text-to-Speech avec des réponses IA intelligentes. Firebase assure la synchronisation de l'historique entre appareils. L'interface animée et le mode accessibilité rendent l'expérience fluide et inclusive. La correction orthographique et la traduction multilingue élargissent les possibilités d'utilisation.",
    features: [
      "Synthèse vocale naturelle avec personnalisation des voix",
      "Requêtes à l'IA avec réponses intelligentes en temps réel",
      "Historique des conversations synchronisé via Firebase",
      "Correction automatique des fautes d'orthographe",
      "Traduction de texte en plusieurs langues",
      "Mode accessibilité avec commandes gestuelles",
      "Interface animée et réactive",
      "Contrôle de la lecture vocale (pause, arrêt, reprise)",
    ],
    challenges: [
      "Intégrer l'API Text-to-Speech avec des voix naturelles et personnalisables",
      "Synchroniser en temps réel l'historique des conversations avec Firebase",
      "Optimiser les performances de l'interface animée sur mobile",
      "Gérer la correction orthographique et la traduction multilingue efficacement",
    ],
    learnings: [
      "Développement d'applications mobiles natives avec Flutter et Dart",
      "Intégration de Firebase Realtime Database pour la synchronisation",
      "Implémentation d'APIs Text-to-Speech et d'IA conversationnelle",
      "Conception d'interfaces animées et accessibles sur mobile",
      "Gestion des permissions Android et optimisation des performances",
    ],
    screenshots: ["/projects/text_to_speech_ai.png"],
  },
]

export function getProjectBySlug(slug: string): Project | undefined {
  return projects.find((project) => project.slug === slug)
}

export function getAllTags(): string[] {
  const tags = new Set<string>()
  projects.forEach((project) => {
    project.tags.forEach((tag) => tags.add(tag))
  })
  return Array.from(tags).sort()
}
