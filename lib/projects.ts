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
    screenshots: ["/projects/applyflow.jpg"],
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
    screenshots: ["/projects/minisearch.jpg"],
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
    screenshots: ["/projects/taskboard.jpg"],
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
  {
    slug: "gestion-tickets-it",
    name: "Système de Gestion de Tickets IT",
    pitch: "Application web complète de gestion de tickets IT avec authentification sécurisée et communication en temps réel.",
    description: "Une application Flask pour gérer les tickets IT avec système d'authentification sécurisé, distinction de rôles (Admin/User), messagerie en temps réel via WebSocket et tableau de bord pour le suivi des tickets.",
    image: "/projects/Gestion_tickets.png",
    tags: ["Flask", "MySQL", "WebSocket", "Authentication", "Python"],
    stack: {
      frontend: ["Jinja2", "Bootstrap", "CSS", "JavaScript"],
      backend: ["Flask", "Flask-SQLAlchemy", "Flask-SocketIO", "Flask-Login"],
      database: ["MySQL", "Alembic (Migrations)"],
      tools: ["Flask-WTF", "Bcrypt", "Git", "Render"],
    },
    links: {
      demo: "https://sqlite-tp-flask-8.onrender.com/login",
      github: "https://github.com/Yohannkp/Site_Flask",
    },
    problem: "Les équipes IT ont besoin d'une solution pour gérer efficacement les tickets de support. Un système centralisé et sécurisé est essentiel pour tracer les problèmes, communiquer avec les utilisateurs et maintenir une archive des interventions.",
    solution: "Une application Flask complète offrant un système de gestion de tickets avec authentification robuste, rôles administrateur/utilisateur, messagerie en temps réel et statistiques d'administration. La base MySQL assure la persistance des données et les migrations Alembic facilitent l'évolution du schéma.",
    features: [
      "Inscription et connexion sécurisées avec hashage bcrypt",
      "Distinction de rôles : Admin et User",
      "Création, modification et suppression de tickets",
      "Messagerie en temps réel avec WebSocket (SocketIO)",
      "Tableau de bord avec gestion de tâches personnelles",
      "Vue d'ensemble des statistiques pour les administrateurs",
      "Consultation de tous les tickets (Admin)",
      "États multiples des tickets : ouvert, en cours, fermé, en attente",
    ],
    challenges: [
      "Implémenter la communication WebSocket avec Flask-SocketIO pour les messages temps réel",
      "Gérer les permissions et les rôles de manière robuste",
      "Concevoir une interface responsive avec Bootstrap",
      "Maintenir la cohérence des données avec les migrations Alembic",
    ],
    learnings: [
      "Maîtrise du framework Flask et de son écosystème (SQLAlchemy, Login, WTF)",
      "Implémentation de WebSocket en temps réel avec Flask-SocketIO",
      "Sécurité des applications web : hashage, validation, protection CSRF",
      "Gestion des migrations de base de données avec Alembic",
      "Architecture MVC et design patterns pour les applications web",
    ],
    screenshots: ["/projects/Gestion_tickets.png"],
  },
  {
    slug: "emmergency",
    name: "Emmergency - Plateforme d'Urgence Intégrée",
    pitch: "Solution multi-plateforme pour la gestion des situations critiques et services d'urgence.",
    description: "Plateforme complète de gestion des urgences combinant une API Django robuste avec des interfaces Flutter pour mobile et desktop. Permet aux personnes en danger de signaler rapidement leur situation aux services d'urgence avec géolocalisation intégrée.",
    image: "/projects/emmergency.png",
    tags: ["Django", "Flutter", "MySQL", "API REST", "Mobile", "Desktop"],
    stack: {
      frontend: ["Flutter", "Dart", "Awesome Notifications", "Window Manager"],
      backend: ["Django", "Django REST Framework", "Python", "PyMySQL"],
      database: ["MySQL", "ORM Django"],
      tools: ["Git", "CORS Headers", "JWT Tokens"],
    },
    links: {
      github: "https://github.com/Yohannkp/emmergency",
    },
    problem: "Les situations d'urgence exigent une réponse rapide et coordonnée. Les personnes en danger ont besoin d'un moyen simple et intuitif de signaler leur localisation aux services d'urgence les plus proches. Les hôpitaux et services d'urgence doivent avoir une vue centralisée des demandes.",
    solution: "Emmergency offre une plateforme intégrée qui réunit personnes en danger et services d'urgence. L'application mobile permet des signalements instantanés avec géolocalisation. Le dashboard desktop centralize la gestion des demandes. L'API Django orchestre la communication en temps réel.",
    features: [
      "Signalement d'urgence instantané avec localisation automatique",
      "Interface mobile optimisée pour les situations critiques",
      "Tableau de bord desktop pour les hôpitaux et services d'urgence",
      "Système de confirmation/refus des demandes d'urgence",
      "Notifications en temps réel sur l'état de la requête",
      "Authentification sécurisée avec tokens JWT",
      "Répertoire d'urgence avec numéros de secours locaux",
      "Historique complet des interventions",
    ],
    challenges: [
      "Implémenter la géolocalisation fiable et sécurisée",
      "Assurer la communication temps réel entre mobile et desktop",
      "Gérer les notifications push multi-plateforme",
      "Concevoir une UX optimale pour les situations de stress",
    ],
    learnings: [
      "Développement backend avec Django REST Framework et MySQL",
      "Création d'applications multi-plateforme avec Flutter (mobile + desktop)",
      "Architecture API robuste et sécurisée avec tokens JWT",
      "Gestion de la géolocalisation et notifications en temps réel",
      "Design UX pour applications critiques et sensibles au temps",
    ],
    screenshots: ["/projects/emmergency.png"],
  },
  {
    slug: "cloudus-api",
    name: "CloudUs - API de Gestion de Fichiers",
    pitch: "API REST sécurisée pour la gestion de fichiers et d'espace de stockage cloud.",
    description: "API REST complète développée avec Symfony pour gérer les fichiers et l'espace de stockage. Authentification JWT sécurisée, gestion des rôles (Admin/User), système d'achat d'espace et génération automatique de factures PDF.",
    image: "/projects/api_gestion_fichier.png",
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
    screenshots: ["/projects/api_gestion_fichier.png"],
  },
  {
    slug: "chili-loco",
    name: "Chili Loco",
    pitch: "Application web de gestion de fast-food avec administration des plats et menus.",
    description: "Application Symfony pour gérer efficacement un fast-food. Permet l'affichage, la modification et la suppression des plats, ainsi que la gestion des sous-menus. Interface développée à partir de maquettes Figma pour une expérience utilisateur optimale.",
    image: "/projects/Chili_Loco.png",
    tags: ["Symfony", "PHP", "MySQL", "Figma", "Admin"],
    stack: {
      frontend: ["Twig", "CSS", "Bootstrap", "Figma Design"],
      backend: ["Symfony", "PHP 7.x/8.x", "Doctrine ORM"],
      database: ["MySQL", "Migrations Doctrine"],
      tools: ["Composer", "VSCode", "Git"],
    },
    links: {
      github: "https://github.com/Yohannkp/Chililoco",
    },
    problem: "Les fast-foods ont besoin d'une solution simple et efficace pour gérer leur menu et leurs plats. L'administration doit être centralisée et facile d'utilisation pour permettre des mises à jour rapides des offres et des prix.",
    solution: "Chili Loco offre une interface admin intuitive basée sur des maquettes Figma professionnelles. Les responsables peuvent facilement ajouter, modifier et supprimer les plats du menu. Le système de gestion des sous-menus facilite l'organisation des catégories.",
    features: [
      "Affichage de la liste complète des plats disponibles",
      "Modification des informations des plats (nom, prix, description)",
      "Suppression des plats qui ne sont plus proposés",
      "Gestion des sous-menus et catégories",
      "Interface responsive adaptée au fast-food",
      "Système de gestion administrateur sécurisé",
      "Détails précis de chaque plat",
      "Navigation intuitive basée sur les maquettes Figma",
    ],
    challenges: [
      "Implémenter une interface admin intuitive et efficace",
      "Gérer les relations entre plats et sous-menus",
      "Assurer la validation des données de saisie",
      "Concevoir une UX adaptée aux cas d'usage du fast-food",
    ],
    learnings: [
      "Développement complet d'application CRUD avec Symfony",
      "Conversion de maquettes Figma en interfaces web fonctionnelles",
      "Gestion des formulaires et validations côté serveur",
      "Architecture MVC avec Symfony et Doctrine",
      "Gestion des relations en base de données MySQL",
    ],
    screenshots: ["/projects/Chili_Loco.png"],
  },
  {
    slug: "leboncoin-clone",
    name: "Le Bon Coin - Clone MERN",
    pitch: "Clone MERN de petites annonces avec authentification sécurisée et gestion complète des listings.",
    description: "Application MERN inspirée de Le Bon Coin permettant de publier, consulter, modifier et supprimer des annonces. Authentification JWT/bcrypt, autorisations par auteur, interface React stylisée et responsive.",
    image: "/projects/leboncoin.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "JWT"],
    stack: {
      frontend: ["React", "React Router", "CSS"],
      backend: ["Node.js", "Express", "JWT", "bcryptjs"],
      database: ["MongoDB"],
      tools: ["Git", "dotenv", "VS Code"],
    },
    links: {
      github: "https://github.com/Yohannkp/React-MERN-Project",
    },
    problem: "Les utilisateurs veulent une plateforme simple pour publier et gérer des annonces avec contrôle d'accès sur les modifications et suppressions.",
    solution: "Un stack MERN avec authentification JWT et rôles basés sur l'auteur. UI React conditionnelle pour n'autoriser l'édition/suppression qu'aux propriétaires des annonces.",
    features: [
      "Inscription et connexion sécurisées (JWT + bcrypt)",
      "Création, consultation, modification et suppression d'annonces",
      "Restrictions : seuls les auteurs peuvent modifier/supprimer leurs annonces",
      "Routing conditionnel et pages protégées",
      "Interface moderne, responsive et fluide",
      "Liste et détails d'annonce avec actions contextuelles",
    ],
    challenges: [
      "Mettre en place l'authentification JWT et la protection des routes",
      "Assurer le contrôle d'accès par auteur sur les opérations CRUD",
      "Structurer le code backend (controllers, routes, middleware)",
      "Gérer l'état et la navigation conditionnelle côté front",
    ],
    learnings: [
      "Architecture MERN complète (MongoDB, Express, React, Node)",
      "Implémentation JWT + bcrypt pour la sécurité",
      "Design d'UI responsive avec React",
      "Structuration d'un backend REST avec controllers et middleware",
    ],
    screenshots: ["/projects/leboncoin.png"],
  },
  {
    slug: "marketplace-mern",
    name: "Marketplace MERN - Plateforme de Gestion de Produits",
    pitch: "Application full-stack MERN pour cr�er, g�rer et parcourir des produits avec upload d'images.",
    description: "Plateforme moderne de gestion de produits avec stack MERN compl�te. Syst�me d'authentification JWT, CRUD produits, upload d'images avec Multer, filtrage avanc� par nom/cat�gorie/prix. Seul le propri�taire peut modifier ses produits.",
    image: "/projects/porduct_mearn.png",
    tags: ["React", "Node.js", "Express", "MongoDB", "Multer"],
    stack: {
      frontend: ["React 19.1.0", "React Router", "React Bootstrap", "Material-UI", "TailwindCSS"],
      backend: ["Node.js", "Express", "JWT", "bcryptjs", "Multer"],
      database: ["MongoDB", "Mongoose"],
      tools: ["Axios", "CORS", "dotenv", "Git"],
    },
    links: {
      github: "https://github.com/fayesarah555/tp-groupe-mern-",
    },
    problem: "Les utilisateurs ont besoin d'une plateforme de marketplace pour g�rer leurs produits avec contr�le d'acc�s strict, upload d'images et recherche avanc�e. La gestion de propri�t� doit �tre s�curis�e.",
    solution: "Application MERN avec authentification JWT robuste, middleware de v�rification de propri�t�, upload d'images avec Multer (5MB, formats JPG/PNG/GIF/WebP), et filtrage dynamique. Context API pour la gestion d'�tat globale.",
    features: [
      "Authentification compl�te (inscription, connexion, JWT)",
      "CRUD complet des produits avec protection propri�taire",
      "Upload d'images avec Multer (5MB max)",
      "Filtrage avanc� : nom, cat�gorie, fourchette de prix",
      "Dashboard utilisateur pour g�rer ses propres produits",
      "Interface moderne avec React Bootstrap et Material-UI",
      "Routes priv�es prot�g�es avec middleware",
      "Grille de produits avec cartes interactives",
    ],
    challenges: [
      "Impl�menter un syst�me d'upload d'images s�curis� avec Multer",
      "G�rer les autorisations par propri�taire avec middleware personnalis�",
      "Optimiser le filtrage et la recherche de produits",
      "Structurer une architecture MERN compl�te et scalable",
    ],
    learnings: [
      "Architecture MERN full-stack avec s�paration frontend/backend",
      "Upload de fichiers avec Multer et gestion du stockage",
      "Middleware d'authentification et de v�rification de propri�t�",
      "Context API pour la gestion d'�tat React",
      "Filtrage avanc� et requ�tes MongoDB avec Mongoose",
    ],
    screenshots: ["/projects/porduct_mearn.png"],
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

