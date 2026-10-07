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
    slug: "leboncoin-mern",
    name: "Le Bon Coin — clone MERN",
    pitch: "Plateforme de petites annonces : authentification, CRUD complet et autorisation par propriétaire.",
    description: "Une application de petites annonces construite de bout en bout : un backend Express structuré en contrôleurs, modèles, routes et middleware, une authentification par jeton, et une interface React publiée sur GitHub Pages. Les règles d'accès sont vérifiées par des tests automatisés à chaque modification.",
    image: "/projects/leboncoin.jpg",
    tags: ["Fullstack", "MERN", "Authentification", "CRUD"],
    stack: {
      frontend: ["React", "JavaScript"],
      backend: ["Node.js", "Express", "JWT", "bcryptjs"],
      database: ["MongoDB (Mongoose)"],
      tools: ["GitHub Actions", "node:test", "Testing Library", "Git"],
    },
    links: {
      github: "https://github.com/Yohannkp/React-MERN-Project",
    },
    problem: "Une plateforme d'annonces pose deux questions qu'on ne peut pas éluder : comment authentifier les utilisateurs sans stocker de mot de passe en clair, et comment garantir qu'un utilisateur ne modifie que ses propres annonces.",
    solution: "Mots de passe hachés avec bcrypt, jeton JWT vérifié par un middleware qui recharge l'utilisateur à chaque requête protégée, et contrôle de propriété sur les opérations d'écriture. Le backend est découpé en contrôleurs, modèles, routes et middleware plutôt qu'en un seul fichier de serveur.",
    features: [
      "Inscription et connexion avec mots de passe hachés",
      "Création, consultation, modification et suppression d'annonces",
      "Autorisation : seul l'auteur peut modifier ou supprimer son annonce",
      "Navigation conditionnelle selon l'état de connexion",
      "Interface responsive",
      "Tests automatisés de l'API et du frontend, puis publication sur GitHub Pages par GitHub Actions",
    ],
    challenges: [
      "Refuser la modification côté serveur, pas seulement masquer le bouton : le contrôle de propriété vit dans l'API, qui répond 403 à qui n'est pas l'auteur",
      "Protéger les routes sans alourdir chaque contrôleur, en centralisant la vérification du jeton dans un middleware",
      "Séparer proprement le déploiement du frontend et celui du backend dans deux workflows distincts",
    ],
    learnings: [
      "Une authentification par jeton se conçoit comme une couche traversante, pas comme un contrôle recopié dans chaque route",
      "Masquer un bouton ne protège rien : une règle d'accès n'existe que si l'API la vérifie, et qu'un test le prouve",
      "Un backend découpé en contrôleurs, modèles et middleware reste lisible quand le projet grossit",
    ],
    screenshots: ["/projects/leboncoin.jpg"],
  },
  {
    slug: "applyflow",
    name: "ApplyFlow",
    pitch: "SaaS de suivi de candidatures : kanban, fiches détaillées et tableau de bord de progression.",
    description: "Une solution SaaS complète qui transforme le chaos de la recherche d'emploi en un pipeline structuré. ApplyFlow centralise le suivi, automatise les rappels et fournit des analytics sur les taux de conversion des candidatures.",
    image: "/projects/applyflow.jpg",
    tags: ["SaaS", "Productivity", "React Query", "Fullstack"],
    stack: {
      frontend: ["Next.js", "React", "TypeScript", "Tailwind CSS"],
      backend: ["Supabase (auth + API)"],
      database: ["PostgreSQL (Supabase)"],
      tools: ["Vercel", "Git"],
    },
    links: {
      demo: "https://v0-apply-flow-saa-s-app.vercel.app/",
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
    screenshots: ["/projects/applyflow.jpg"],
  },
  {
    slug: "movies-database",
    name: "Recommandation de films",
    pitch: "Moteur de recommandation de films propulsé par Neo4j et FastAPI.",
    description: "Plus qu'une simple base de données, ce projet exploite la puissance des graphes pour révéler les connexions cachées entre films. Utilise des algorithmes de similarité pour offrir des recommandations contextuelles ultra-rapides.",
    image: "/projects/movie_database.jpg",
    tags: ["Graph DB", "Recommendation Engine", "FastAPI", "Neo4j"],
    stack: {
      frontend: ["React", "Vite", "TypeScript", "Zustand"],
      backend: ["FastAPI", "Python", "Pydantic"],
      database: ["Neo4j", "Cypher Query Language"],
      tools: ["Docker Compose", "Swagger UI"],
    },
    links: {
      github: "https://github.com/fayesarah555/movies-webapp",
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
    screenshots: ["/projects/movie_database.jpg"],
  },
  {
    slug: "cloudus-api",
    name: "CloudUs — API de gestion de fichiers",
    pitch: "API REST sécurisée pour la gestion de fichiers et d'espace de stockage cloud.",
    description: "API REST complète développée avec Symfony pour gérer les fichiers et l'espace de stockage. Authentification JWT sécurisée, gestion des rôles (Admin/User), système d'achat d'espace et génération automatique de factures PDF.",
    image: "/projects/api_gestion_fichier.jpg",
    tags: ["Symfony", "PHP", "JWT", "API REST", "MySQL"],
    stack: {
      frontend: [],
      backend: ["Symfony 6.0+", "PHP 8.2+", "JWT Auth", "Doctrine ORM"],
      database: ["MySQL", "Migrations Doctrine"],
      tools: ["Composer", "PDF Generation", "Email", "Git"],
    },
    links: {
      github: "https://github.com/Batyeste/CloudUs",
    },
    problem: "Les utilisateurs ont besoin d'une solution cloud fiable pour stocker et gérer leurs fichiers. Les administrateurs doivent avoir une visibilité complète sur l'utilisation des ressources. Un système d'achat et de facturation automatisée est essentiel pour monétiser le service.",
    solution: "CloudUs propose une API REST robuste basée sur Symfony avec authentification JWT. Le système gère automatiquement les quotas d'espace, les achats d'extension et la génération de factures PDF. Les rôles d'administrateur offrent une surveillance complète avec dashboards et statistiques détaillées.",
    features: [
      "Inscription et authentification sécurisée avec JWT",
      "Gestion des fichiers : upload, téléchargement, suppression",
      "Système d'achat d'espace de stockage (20 Go par achat)",
      "Suivi en temps réel de l'espace utilisé vs disponible",
      "Génération automatique de factures PDF",
      "Envoi des factures par email",
      "Tableau de bord administrateur avec statistiques",
      "Liste des clients avec détails de stockage",
      "Vue complète de tous les fichiers du système",
    ],
    challenges: [
      "Implémenter l'authentification JWT sécurisée avec Symfony",
      "Gérer les quotas d'espace et les limitations d'upload",
      "Générer des factures PDF dynamiques et sécurisées",
      "Assurer l'intégrité et la sécurité du stockage de fichiers",
    ],
    learnings: [
      "Développement d'API REST sécurisée avec Symfony 6",
      "Authentification et autorisation avec JWT",
      "Gestion complexe des fichiers et des quotas",
      "Génération de documents PDF et envoi d'emails",
      "Conception de dashboards administratifs",
    ],
    screenshots: ["/projects/api_gestion_fichier.jpg"],
  },
  {
    slug: "minisearch",
    name: "MiniSearch — moteur de recherche interne",
    pitch: "Moteur de recherche haute performance avec full-text search, filtres dynamiques et ranking avancé construit avec React, TypeScript et Supabase.",
    description: "Plateforme de recherche documentaire avancée avec support multilingue (FR/EN), full-text search natif PostgreSQL, scoring intelligent avec décomposition des scores, filtrage dynamique par catégories, sources, langues, tags et dates. Interface responsive moderne avec composants Shadcn/ui.",
    image: "/projects/minisearch.jpg",
    tags: ["React", "TypeScript", "Supabase", "PostgreSQL", "Tailwind CSS"],
    stack: {
      frontend: ["React 18.3", "TypeScript", "Vite", "React Router", "TanStack Query", "Tailwind CSS", "Shadcn/ui", "React Hook Form", "Lucide React"],
      backend: ["Supabase", "PostgreSQL"],
      database: ["PostgreSQL", "Full-text search"],
      tools: ["Vitest", "ESLint", "PostCSS", "Bun"],
    },
    links: {
      demo: "https://find-all-finder.lovable.app/",
    },
    problem: "Les organisations ont besoin d'un moteur de recherche interne performant capable de rechercher parmi des milliers de documents tout en fournissant des résultats pertinents, filtrables et rapides.",
    solution: "Plateforme de recherche full-stack utilisant PostgreSQL full-text search natif pour l'indexation optimisée, React pour l'UI moderne, et Supabase pour le backend. Système de scoring intelligent avec décomposition des scores (pertinence textuelle, boost titre, récence, popularité, qualité).",
    features: [
      "Full-text search multilingue (FR/EN) avec support PostgreSQL natif",
      "Scoring intelligent avec 5 critères de boost (titre, récence, popularité, qualité, pertinence)",
      "Filtrage dynamique : catégories, sources, langues, tags, dates, scores",
      "Tri multiples : Pertinence, Plus récent, Plus populaire",
      "Pagination configurable avec affichage par défaut 10 résultats",
      "Recherches tendances affichées en accueil",
      "Documents populaires recommandés",
      "Snippets extraits du contenu pour aperçu rapide",
      "Historique des clics pour l'analyse d'usage",
      "Mode debug pour inspection des requêtes",
      "Interface responsive avec design moderne Shadcn/ui",
      "Support dark mode via next-themes",
    ],
    challenges: [
      "Implémenter un système de scoring multi-critères performant avec PostgreSQL",
      "Optimiser les requêtes full-text search pour des millions de documents",
      "Gérer l'indexation et le cache pour performance optimale",
      "Concevoir des filtres avancés tout en maintenant l'UX simple",
      "Intégrer RPC Supabase pour des fonctions stockées personnalisées",
    ],
    learnings: [
      "PostgreSQL full-text search natif avec tsvector et tsquery",
      "Architecture avec React Query pour la gestion d'état et cache",
      "Fonctions RPC Supabase pour logique backend optimisée",
      "Design responsive avec Shadcn/ui et Tailwind CSS",
      "Systèmes de scoring et ranking avancés",
      "Optimisation des performances avec code splitting et tree shaking Vite",
      "Testing avec Vitest et React Testing Library",
    ],
    screenshots: ["/projects/minisearch.jpg"],
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


