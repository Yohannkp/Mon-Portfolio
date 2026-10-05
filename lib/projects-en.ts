import type { Project } from "@/lib/projects"

/** La version anglaise des fiches projet (lib/projects.ts) : seuls les textes changent, la pile technique et les liens restent. */
type Surcharge = Partial<Pick<Project, "name" | "pitch" | "description" | "tags" | "problem" | "solution" | "features" | "challenges" | "learnings">>

export const PROJETS_EN: Record<string, Surcharge> = {
  "leboncoin-mern": {
    name: "Le Bon Coin — MERN clone",
    pitch: "A classified-ads platform: authentication, full CRUD and owner-based authorisation.",
    description:
      "A classified-ads application built end to end: an Express backend structured into controllers, models, routes and middleware, token-based authentication, and a React interface published on GitHub Pages. The access rules are checked by automated tests on every change.",
    tags: ["Fullstack", "MERN", "Authentication", "CRUD"],
    problem:
      "A classifieds platform raises two questions you can't dodge: how to authenticate users without storing plaintext passwords, and how to guarantee that a user only edits their own ads.",
    solution:
      "Passwords hashed with bcrypt, a JWT verified by a middleware that reloads the user on every protected request, and an ownership check on write operations. The backend is split into controllers, models, routes and middleware rather than a single server file.",
    features: [
      "Sign-up and login with hashed passwords",
      "Create, read, update and delete ads",
      "Authorisation: only the author can edit or delete their ad",
      "Navigation that depends on the login state",
      "Responsive interface",
      "Automated API and frontend tests, then publication to GitHub Pages by GitHub Actions",
    ],
    challenges: [
      "Refuse the edit on the server, not just hide the button: the ownership check lives in the API, which answers 403 to anyone who isn't the author",
      "Protect the routes without weighing down every controller, by centralising token verification in a middleware",
      "Cleanly separate the deployment of the frontend from that of the backend in two distinct workflows",
    ],
    learnings: [
      "Token authentication is designed as a cross-cutting layer, not as a check copied into every route",
      "Hiding a button protects nothing: an access rule only exists if the API checks it, and a test proves it",
      "A backend split into controllers, models and middleware stays readable as the project grows",
    ],
  },
  applyflow: {
    pitch: "A job-application tracking SaaS: kanban, detailed records and a progress dashboard.",
    description:
      "A complete SaaS solution that turns the chaos of a job search into a structured pipeline. ApplyFlow centralises tracking, automates reminders and provides analytics on application conversion rates.",
    problem:
      "When you're job hunting, you apply to dozens of postings. Without an organised system, you lose track: which role, which company, where are we in the process? Spreadsheets quickly become a nightmare to maintain.",
    solution:
      "ApplyFlow centralises every application in a clear interface with a kanban system. Each application has its own detailed record with notes, contacts and reminders. The dashboard gives an overview of progress.",
    features: [
      "Drag-and-drop kanban board to manage the stages",
      "Detailed application records with notes",
      "Reminders and notifications",
      "Statistics and progress charts",
      "CSV data export",
      "Secure authentication",
    ],
    challenges: [
      "Implement smooth drag and drop with React DnD while keeping it in sync with the backend",
      "Handle optimistic states for a responsive UX despite network latency",
      "Design a flexible database schema for different recruitment workflows",
    ],
    learnings: [
      "Mastering React Query for cache management and mutations",
      "Clean REST API architecture with data validation",
      "The importance of integration tests for critical features",
      "Handling loading and error states for a better UX",
    ],
  },
  "movies-database": {
    name: "Movie recommendation",
    pitch: "A movie recommendation engine powered by Neo4j and FastAPI.",
    description:
      "More than a simple database, this project harnesses the power of graphs to reveal the hidden connections between films. It uses similarity algorithms to offer ultra-fast, contextual recommendations.",
    problem:
      "Exploring large movie databases can be complex without an intuitive interface. The relationships between films, actors, directors and genres are hard to navigate with traditional databases. Users need a fast, error-tolerant search.",
    solution:
      "Movies Database uses Neo4j as a graph database to model the relationships between entities naturally. The React + FastAPI architecture provides a modern, fast interface. Fuzzy search and similarity-based recommendations improve the user experience.",
    features: [
      "Responsive interface and intuitive navigation",
      "Paginated display of films with 'Load more'",
      "Advanced fuzzy, error-tolerant search",
      "Full details: cast, directors, producers",
      "Similar-movie recommendation system",
      "Service health monitoring (API + Neo4j)",
      "Error handling and loading states",
      "Interactive API documentation with Swagger",
    ],
    challenges: [
      "Implement a fast fuzzy search with a similarity algorithm",
      "Efficiently model complex relationships in Neo4j with Cypher",
      "Handle pagination and progressive loading for a better UX",
      "Set up robust monitoring of the Neo4j connection and the API",
    ],
    learnings: [
      "Mastering Neo4j graph databases and the Cypher language",
      "Modern REST API development with FastAPI and Pydantic validation",
      "Microservice architecture and front-end/back-end communication",
      "Handling loading and error states for an optimal UX",
      "CORS configuration and API security",
    ],
  },
  "cloudus-api": {
    name: "CloudUs — file-management API",
    pitch: "A secure REST API for managing files and cloud storage space.",
    description:
      "A complete REST API built with Symfony to manage files and storage space. Secure JWT authentication, role management (Admin/User), a storage-purchase system and automatic PDF invoice generation.",
    problem:
      "Users need a reliable cloud solution to store and manage their files. Administrators need full visibility into resource usage. An automated purchase and billing system is essential to monetise the service.",
    solution:
      "CloudUs offers a robust REST API based on Symfony with JWT authentication. The system automatically manages storage quotas, extension purchases and PDF invoice generation. Administrator roles provide full oversight with dashboards and detailed statistics.",
    features: [
      "Secure sign-up and authentication with JWT",
      "File management: upload, download, delete",
      "Storage purchase system (20 GB per purchase)",
      "Real-time tracking of used vs available space",
      "Automatic PDF invoice generation",
      "Invoices sent by email",
      "Administrator dashboard with statistics",
      "Customer list with storage details",
      "Complete view of all files in the system",
    ],
    challenges: [
      "Implement secure JWT authentication with Symfony",
      "Manage storage quotas and upload limits",
      "Generate dynamic and secure PDF invoices",
      "Ensure the integrity and security of file storage",
    ],
    learnings: [
      "Developing a secure REST API with Symfony 6",
      "Authentication and authorisation with JWT",
      "Complex handling of files and quotas",
      "PDF document generation and email sending",
      "Designing administrative dashboards",
    ],
  },
  minisearch: {
    name: "MiniSearch — internal search engine",
    pitch: "A high-performance search engine with full-text search, dynamic filters and advanced ranking, built with React, TypeScript and Supabase.",
    description:
      "An advanced document-search platform with multilingual support (FR/EN), native PostgreSQL full-text search, smart scoring with score breakdown, dynamic filtering by category, source, language, tag and date. A modern responsive interface with Shadcn/ui components.",
    problem:
      "Organisations need a high-performance internal search engine able to search across thousands of documents while delivering relevant, filterable and fast results.",
    solution:
      "A full-stack search platform using native PostgreSQL full-text search for optimised indexing, React for the modern UI, and Supabase for the backend. A smart scoring system with score breakdown (text relevance, title boost, recency, popularity, quality).",
    features: [
      "Multilingual (FR/EN) full-text search with native PostgreSQL support",
      "Smart scoring with 5 boost criteria (title, recency, popularity, quality, relevance)",
      "Dynamic filtering: categories, sources, languages, tags, dates, scores",
      "Multiple sorts: Relevance, Most recent, Most popular",
      "Configurable pagination, 10 results shown by default",
      "Trending searches shown on the home page",
      "Recommended popular documents",
      "Snippets extracted from the content for a quick preview",
      "Click history for usage analysis",
      "Debug mode to inspect queries",
      "Responsive interface with a modern Shadcn/ui design",
      "Dark mode support through next-themes",
    ],
    challenges: [
      "Implement a high-performance multi-criteria scoring system with PostgreSQL",
      "Optimise full-text search queries for millions of documents",
      "Manage indexing and caching for optimal performance",
      "Design advanced filters while keeping the UX simple",
      "Integrate Supabase RPC for custom stored functions",
    ],
    learnings: [
      "Native PostgreSQL full-text search with tsvector and tsquery",
      "Architecture with React Query for state management and caching",
      "Supabase RPC functions for optimised backend logic",
      "Responsive design with Shadcn/ui and Tailwind CSS",
      "Advanced scoring and ranking systems",
      "Performance optimisation with Vite code splitting and tree shaking",
      "Testing with Vitest and React Testing Library",
    ],
  },
}

/** La fiche d'un projet dans la langue demandee. */
export function projetLocalise(p: Project, en: boolean): Project {
  return en && PROJETS_EN[p.slug] ? { ...p, ...PROJETS_EN[p.slug] } : p
}
