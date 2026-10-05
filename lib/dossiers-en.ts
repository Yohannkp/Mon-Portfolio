import type { Axe, Dossier } from "@/lib/dossiers"

/**
 * La version anglaise des dossiers (lib/dossiers.ts) : meme structure, seuls les textes changent.
 * Les chiffres sont les memes (seule la typographie change : 0.88 au lieu de 0,88, 878,000 au lieu de 878 000).
 * Un champ absent ici garde sa valeur francaise (noms de projets, piles techniques, liens).
 */
export const AXES_EN: Record<Axe, { titre: string; promesse: string }> = {
  production: {
    titre: "Putting models into production",
    promesse: "Serve, containerise, make reliable: so that a model serves someone, not just a notebook.",
  },
  modele: {
    titre: "Fine-tuning and training models",
    promesse: "Understand what you train: the data, the environment, the architecture, and what is missing when nothing exists.",
  },
  mesure: {
    titre: "Measuring and proving",
    promesse: "Don't stop at “it works”: pick the right test, quantify the effect, explain the decision.",
  },
  application: {
    titre: "Building applications",
    promesse: "The development foundation: backend, authentication, databases, interfaces.",
  },
}

type Surcharge = Partial<Pick<Dossier, "nom" | "role" | "enjeu" | "resultat" | "prouve" | "chiffre" | "phare" | "stack">>

export const DOSSIERS_EN: Record<string, Surcharge> = {
  "rag-local": {
    role: "document assistant",
    enjeu: "An assistant that is useful on your own documents, without sending a single file to an external service.",
    resultat:
      "Hybrid search (BM25 + vectors, RRF fusion), cross-encoder reranking, answers cited down to the page. The images in PDFs are described by a local vision model and become searchable like text. A RAGAS suite measures quality.",
    chiffre: { valeur: "0", unite: "outgoing network requests: everything stays on the machine" },
    prouve: ["Putting into production", "Evaluating a RAG"],
    phare: { rang: 1, titre: "No data leaves the machine", question: "Can they deliver an AI system without exposing the data?" },
  },
  "self-dev-agent": {
    role: "development agent",
    enjeu: "A local 7-billion-parameter model isn't reliable: you can't just believe its answers.",
    resultat:
      "The agent doesn't write code and hope: it explores, edits, runs the tests and corrects itself. It runs entirely locally through Ollama, with a one-click installer that picks the models according to the available RAM.",
    chiffre: { valeur: "7 B", unite: "parameters: unreliable alone, verified by the tests" },
    prouve: ["Making a model reliable", "Tooling"],
    phare: { rang: 4, titre: "An agent that checks its own work", question: "Can they make an unreliable model reliable?" },
  },
  "prediction-productivite": {
    nom: "Productivity prediction",
    role: "model served by an API",
    enjeu: "Predict a team's productivity, and make the prediction usable in an application.",
    resultat:
      "A trained model served by a FastAPI API, consumed by a cross-platform Flutter app that displays the tracking and the predictions.",
    prouve: ["Serving a model"],
  },
  "mina-translator": {
    role: "French ↔ Mina translation",
    enjeu: "Mina has no public parallel corpus: on a low-resource language, the difficulty is the data, not the training.",
    resultat:
      "A corpus generated for the occasion then audited by script: 360 usable pairs out of 500, spread over seven domains, completed by ~19,600 Common Voice transcriptions. Qwen2-0.5B fine-tuned with 4-bit QLoRA, Whisper upstream, a FastAPI service, and a crowdsourced collection app to extend the corpus.",
    chiffre: { valeur: "360", unite: "pairs kept after audit, out of 500 generated" },
    prouve: ["Fine-tuning a model", "Building the data"],
    phare: { rang: 3, titre: "A language with no corpus", question: "Can they work when the data doesn't exist?" },
  },
  "snake-rl-dqn": {
    role: "reinforcement learning",
    enjeu: "Learn to play Snake without a single hand-written rule.",
    resultat:
      "A custom-built Gymnasium-compatible environment, a PyTorch DQN with a target network and replay memory, trained on GPU. A project split into modules (agent, training, evaluation, demo), not a notebook.",
    chiffre: { valeur: "0", unite: "hand-written rules: the agent learns on its own" },
    prouve: ["Training a model"],
    phare: { rang: 6, titre: "An environment written by hand", question: "Do they understand what they train?" },
  },
  "analyse-emotions-temps-reel": {
    nom: "Emotion detection",
    role: "computer vision",
    enjeu: "Recognise emotions frame by frame, in real time, on a webcam stream.",
    resultat: "A convolutional network trained with PyTorch, with the stream captured and preprocessed by OpenCV.",
    prouve: ["Real-time vision"],
  },
  "fake-news-lstm": {
    nom: "Fake news detection",
    role: "text classification",
    enjeu: "Tell real news articles from fake ones.",
    resultat:
      "Cleaning and tokenisation, an embedding layer, a bidirectional LSTM in Keras, then an analysis of the words characteristic of each class.",
    prouve: ["Processing text"],
  },
  "optimisation-ventes-chips": {
    nom: "Sales optimisation",
    role: "impact of an in-store layout",
    enjeu: "Measure the effect of a new layout when stores can't be randomly assigned.",
    resultat:
      "Each test store is matched to a control store, chosen by correlation on sales and footfall before the intervention, then the gap is tested statistically. That is what makes the measurement defensible. Delivered as a report for a Category Manager.",
    chiffre: { valeur: "1 : 1", unite: "one control store matched to each test store" },
    stack: ["pandas", "Causal inference", "Statistical tests"],
    prouve: ["Proving an effect", "Causal inference"],
    phare: { rang: 7, titre: "Measuring without being able to randomise", question: "Can they prove an effect when you can't draw lots?" },
  },
  "finance-credit-scoring": {
    nom: "Credit risk scoring",
    role: "imbalanced classification",
    enjeu: "Predict default on heavily imbalanced banking data, while limiting false negatives.",
    resultat: "Rebalancing with SMOTE, XGBoost and SHAP explainability, with a scoring dashboard for loan officers.",
    chiffre: { valeur: "0.88", unite: "AUC on the test set" },
    prouve: ["Explaining a model"],
  },
  "prediction-depart-employes": {
    nom: "Employee attrition",
    role: "employee retention",
    enjeu: "Identify employees at risk of leaving, and what keeps them, before they resign.",
    resultat:
      "A Random Forest in Scikit-learn, compared with a logistic regression and a decision tree, which recovers 90% of the actual departures and highlights the most explanatory retention factors, delivered in a Power BI dashboard.",
    chiffre: { valeur: "0.94", unite: "AUC on the test set" },
    prouve: ["Interpreting a model"],
  },
  "supermarket-sales-analysis": {
    nom: "Supermarket sales",
    role: "SQL analysis",
    enjeu: "Find out what earns and what costs in a supermarket's sales: over 878,000 sales lines, wholesale prices and loss rates.",
    resultat:
      "Analytical SQL queries (CTEs, window functions) on a SQLite database: most profitable products, high-volume but low-margin products, cost of losses by category, returns and the effect of discounts.",
    chiffre: { valeur: "878,000", unite: "sales lines analysed in SQL" },
    stack: ["SQL", "CTE", "Window functions"],
    prouve: ["Advanced SQL", "Business analysis"],
    phare: { rang: 2, titre: "Finding the value in 878,000 sales lines", question: "Can they make a large database talk with SQL?" },
  },
  "ab-test-landing-page": {
    nom: "A/B test of a page",
    role: "experimentation",
    enjeu: "Decide which of two versions of a page converts better.",
    resultat:
      "Method over result: normality (Shapiro) before choosing between Student and Mann-Whitney, chi-square on conversion rates, reading the p-values, delivered in a Streamlit app.",
    prouve: ["Choosing the right test"],
  },
  "leboncoin-mern": {
    role: "classified-ads platform",
    enjeu: "Authenticate without storing plaintext passwords, and guarantee that a user only edits their own ads.",
    resultat:
      "An Express backend split into controllers, models, routes and middleware: passwords hashed with bcrypt, a JWT verified by middleware, an ownership check on every edit. These refusals are covered by tests, run by GitHub Actions before every release.",
    chiffre: { valeur: "401 / 403", unite: "no token, or not the author: refusals tested in CI" },
    prouve: ["Designing a backend", "Securing an API"],
    phare: { rang: 5, titre: "Every ad protected from outsiders", question: "Can they secure a backend?" },
  },
  applyflow: {
    role: "job-application tracking SaaS",
    enjeu: "Stop losing track of dozens of applications in spreadsheets.",
    resultat: "A kanban board, detailed records with notes, contacts and reminders, and a progress dashboard.",
    prouve: ["Full-stack product"],
  },
  "movies-database": {
    nom: "Movie recommendation",
    role: "graph database",
    enjeu: "Navigate the relationships between films, actors, directors and genres, with an error-tolerant search.",
    resultat: "Neo4j to model the relationships, a FastAPI API and a React interface, with fuzzy search and similarity-based recommendations.",
    prouve: ["Graph database"],
  },
  "cloudus-api": {
    role: "cloud storage API",
    enjeu: "Store files, manage storage quotas and bill automatically.",
    resultat: "A Symfony REST API with JWT authentication, quotas, storage top-up purchases, PDF invoices, and administrator roles with dashboards.",
    prouve: ["Secure REST API"],
  },
  minisearch: {
    role: "internal search engine",
    enjeu: "Find the relevant information among thousands of documents, fast, with filters.",
    resultat:
      "PostgreSQL's native full-text search and a decomposed score (text relevance, title boost, recency, popularity, quality), with React and Supabase.",
    prouve: ["Full-text search"],
  },
}

export const MOTS_EN = ["zero", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"]
