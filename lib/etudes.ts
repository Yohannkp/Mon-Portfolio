import type { Etude } from "@/lib/etudes-types"

export type { Etude } from "@/lib/etudes-types"

/**
 * Les etudes de cas des projets ML. Les chiffres ont ete relus dans chaque depot (fichier et ligne en `source`) ;
 * quand le depot ne mesure pas quelque chose, la page le dit au lieu d'inventer un nombre.
 */

const GH = "https://github.com/Yohannkp"
const RAG = `${GH}/RAG-Local/blob/main`
const MINA = `${GH}/mina-translator/blob/main`
const AGENT = `${GH}/Claude-local/blob/main`
// Le nom du depot se termine bien par un point.
const SALIFORT = `${GH}/Projet-Salifort-Motors./blob/main`

export const ETUDES: Etude[] = [
  /* ================================================================== RAG-Local */
  {
    slug: "rag-local",
    pitch: [
      "Un assistant qui répond à partir de vos documents, cite la page exacte, et ne fait sortir aucun fichier de la machine.",
      "An assistant that answers from your documents, cites the exact page, and never sends a file off the machine.",
    ],
    chiffres: [
      { valeur: ["4", "4"], label: ["modèles, tous locaux : dialogue, vecteurs, vision, reranking", "models, all local: chat, embeddings, vision, reranking"] },
      { valeur: ["20 → 6", "20 → 6"], label: ["extraits candidats, puis gardés après reranking", "candidate passages, then kept after reranking"] },
      { valeur: ["36", "36"], label: ["tests automatisés (pytest)", "automated tests (pytest)"] },
    ],
    sections: [
      {
        id: "probleme",
        titre: ["Le problème", "The problem"],
        paragraphes: [
          [
            "Un cabinet juridique, de conseil ou de santé ne peut pas envoyer ses documents à une API externe. Pour lui être utile, un assistant doit tout faire sur place : lire les PDF et les fichiers Word, comprendre les images qu'ils contiennent, retrouver le bon passage, et dire d'où vient sa réponse.",
            "A law, consulting or healthcare firm cannot send its documents to an external API. To be useful to it, an assistant must do everything on site: read PDFs and Word files, understand the images inside them, find the right passage, and say where its answer comes from.",
          ],
        ],
      },
      {
        id: "ingestion",
        titre: ["L'ingestion : rendre chaque page cherchable", "Ingestion: making every page searchable"],
        paragraphes: [
          [
            "Chaque document est lu page par page (ou section par section pour un fichier Word), puis découpé en extraits qui ne débordent jamais d'une page sur l'autre : c'est ce qui permet ensuite de citer la page exacte.",
            "Each document is read page by page (or section by section for a Word file), then split into passages that never run across two pages: that is what later makes it possible to cite the exact page.",
          ],
          [
            "Les images ne sont pas perdues : un modèle de vision local les décrit, et leur description devient un texte cherchable comme le reste.",
            "Images are not lost: a local vision model describes them, and the description becomes text that can be searched like everything else.",
          ],
        ],
        visuels: [
          {
            type: "pipeline",
            titre: ["De l'import à l'index", "From import to index"],
            etapes: [
              { titre: ["Lecture", "Reading"], detail: ["PDF page par page, Word par section, tableaux conservés.", "PDF page by page, Word by section, tables kept."], tech: "pypdf · python-docx" },
              { titre: ["Découpage", "Chunking"], detail: ["Extraits de 1 200 caractères, 150 de recouvrement, jamais à cheval sur deux pages.", "1,200-character passages, 150 of overlap, never across two pages."], tech: "1200 / 150" },
              { titre: ["Images", "Images"], detail: ["Chaque image de plus de 3 Ko est décrite en texte par un modèle de vision.", "Every image over 3 KB is described as text by a vision model."], tech: "qwen3-vl:4b" },
              { titre: ["Vecteurs", "Embeddings"], detail: ["Chaque extrait devient un vecteur, rangé dans une base locale.", "Each passage becomes a vector, stored in a local database."], tech: "nomic-embed-text · Chroma" },
            ],
          },
        ],
        source: { fichier: "backend/app/config.py", href: `${RAG}/backend/app/config.py` },
      },
      {
        id: "recherche",
        titre: ["La recherche : deux moteurs valent mieux qu'un", "Retrieval: two engines beat one"],
        paragraphes: [
          [
            "La recherche par vecteurs retrouve les reformulations, mais rate souvent un numéro d'article ou un nom propre. BM25, la recherche par mots, fait l'inverse. Les deux tournent en parallèle et leurs classements sont fusionnés par RRF, qui combine des rangs sans avoir à rendre leurs scores comparables.",
            "Vector search finds paraphrases but often misses an article number or a proper name. BM25, keyword search, does the opposite. Both run in parallel and their rankings are merged with RRF, which combines ranks without having to make their scores comparable.",
          ],
          [
            "Un cross-encoder relit ensuite les 20 meilleurs candidats avec la question et n'en garde que 6. Le modèle de dialogue répond en streaming, numérote ses sources et doit dire qu'il ne sait pas quand la réponse n'est pas dans les documents.",
            "A cross-encoder then rereads the 20 best candidates together with the question and keeps only 6. The chat model streams its answer, numbers its sources, and must say it does not know when the answer is not in the documents.",
          ],
        ],
        visuels: [
          {
            type: "pipeline",
            titre: ["D'une question à une réponse citée", "From a question to a cited answer"],
            etapes: [
              { titre: ["Réécriture", "Rewriting"], detail: ["En conversation, la question est reformulée à partir des 6 derniers messages.", "In a conversation, the question is rewritten from the last 6 messages."] },
              { titre: ["Deux recherches", "Two searches"], detail: ["Les 20 meilleurs extraits par le sens, et les 20 meilleurs par les mots.", "The 20 best passages by meaning, and the 20 best by keywords."], tech: "Chroma · BM25" },
              { titre: ["Fusion", "Fusion"], detail: ["Les deux classements sont fusionnés par leurs rangs.", "The two rankings are merged by rank."], tech: "RRF, k = 60" },
              { titre: ["Reranking", "Reranking"], detail: ["Un cross-encoder relit les 20 candidats et en garde 6.", "A cross-encoder rereads the 20 candidates and keeps 6."], tech: "mMiniLMv2" },
              { titre: ["Réponse", "Answer"], detail: ["En streaming, avec [n] (fichier, page) ; refus si l'information manque.", "Streamed, with [n] (file, page); refusal if the information is missing."], tech: "qwen3:8b" },
            ],
          },
        ],
        source: { fichier: "backend/app/services/hybrid_search.py", href: `${RAG}/backend/app/services/hybrid_search.py` },
      },
      {
        id: "local",
        titre: ["Vérifier que rien ne sort", "Checking that nothing leaves"],
        paragraphes: [
          [
            "« Local » ne suffit pas à l'écrire : plusieurs bibliothèques téléchargent ou envoient des données par défaut. Chacune a été fermée explicitement, et la preuve est un test simple : couper le réseau, et continuer à poser des questions.",
            "Saying “local” is not enough: several libraries download or send data by default. Each one was closed explicitly, and the proof is a simple test: cut the network, and keep asking questions.",
          ],
        ],
        points: [
          ["Les quatre modèles tournent dans Ollama ou dans le conteneur, sur la machine.", "The four models run in Ollama or inside the container, on the machine."],
          ["Télémétrie de Chroma désactivée, et aucun modèle d'embedding téléchargé à son insu.", "Chroma telemetry disabled, and no embedding model downloaded behind your back."],
          ["Le modèle de reranking est téléchargé à la construction de l'image Docker, jamais pendant l'utilisation.", "The reranking model is downloaded when the Docker image is built, never during use."],
          ["Le lecteur PDF est servi par l'application elle-même, pas par un CDN.", "The PDF viewer is served by the app itself, not by a CDN."],
          ["Le dossier personnel n'est monté qu'en lecture seule.", "The home folder is mounted read-only."],
          ["Seule exception, signalée : la dictée vocale du navigateur peut passer par Internet.", "One flagged exception: the browser's voice dictation may go through the Internet."],
        ],
        source: { fichier: "docker-compose.yml", href: `${RAG}/docker-compose.yml` },
      },
      {
        id: "mesure",
        titre: ["Mesurer la qualité", "Measuring quality"],
        paragraphes: [
          [
            "Une suite RAGAS évalue la fidélité de la réponse aux extraits, la précision et le rappel du contexte, et la pertinence de la réponse. Le juge est lui aussi local (qwen3:8b), pour que l'évaluation respecte la même règle que l'application.",
            "A RAGAS suite scores faithfulness to the passages, context precision and recall, and answer relevancy. The judge is local too (qwen3:8b), so that the evaluation follows the same rule as the app.",
          ],
          [
            "Sur les six questions du jeu actuel, les réponses évaluées sont fidèles aux extraits (1,0) et la question hors sujet est bien refusée. Mais six questions sur un document court, c'est un garde-fou, pas un banc d'essai : le document tient dans un seul extrait, donc précision et rappel du contexte valent 1 par construction.",
            "On the six questions of the current set, the scored answers are faithful to the passages (1.0) and the off-topic question is correctly refused. But six questions on a short document are a safety net, not a benchmark: the document fits in a single passage, so context precision and recall are 1 by construction.",
          ],
        ],
        source: { fichier: "backend/eval/run_eval.py", href: `${RAG}/backend/eval/run_eval.py` },
      },
    ],
    autrement: [
      [
        "Un vrai jeu d'évaluation : des dizaines de questions sur plusieurs documents, et une comparaison avec et sans recherche hybride et reranking, pour chiffrer ce que chaque étape apporte.",
        "A real evaluation set: dozens of questions over several documents, and a comparison with and without hybrid search and reranking, to measure what each stage adds.",
      ],
      [
        "L'évaluation dans l'intégration continue, avec un seuil qui bloque une régression.",
        "The evaluation in continuous integration, with a threshold that blocks a regression.",
      ],
      [
        "Un index BM25 persistant : il est reconstruit à chaque question, ce qui suffit pour des centaines de documents, pas pour des milliers.",
        "A persistent BM25 index: it is rebuilt for every question, which is fine for hundreds of documents, not thousands.",
      ],
      [
        "Un vrai OCR en plus du modèle de vision, dont la transcription peut être inexacte.",
        "Real OCR on top of the vision model, whose transcription can be inaccurate.",
      ],
    ],
  },

  /* ================================================================== Mina-Translator */
  {
    slug: "mina-translator",
    pitch: [
      "Traduire entre le français et le mina, une langue du Togo pour laquelle il n'existe aucun corpus parallèle public.",
      "Translating between French and Mina, a language of Togo with no public parallel corpus.",
    ],
    chiffres: [
      { valeur: ["68 % → 7,8 %", "68% → 7.8%"], label: ["de lignes défectueuses : corpus généré, puis corpus final audité", "of defective lines: generated corpus, then audited final corpus"] },
      { valeur: ["11,4 h", "11.4 h"], label: ["d'enregistrements Common Voice en mina", "of Common Voice recordings in Mina"] },
      { valeur: ["0,5 Md", "0.5 B"], label: ["de paramètres : Qwen2 affiné en QLoRA 4 bits", "parameters: Qwen2 fine-tuned with 4-bit QLoRA"] },
    ],
    sections: [
      {
        id: "probleme",
        titre: ["Le problème", "The problem"],
        paragraphes: [
          [
            "Le mina est parlé dans le sud du Togo. Common Voice en propose des enregistrements et leurs transcriptions, mais aucune traduction : il n'existe pas de corpus parallèle français-mina public. Sur une langue peu dotée, la difficulté n'est pas l'entraînement, c'est la donnée.",
            "Mina is spoken in southern Togo. Common Voice offers recordings and their transcriptions, but no translations: there is no public French-Mina parallel corpus. On a low-resource language, the hard part is not training, it is the data.",
          ],
        ],
      },
      {
        id: "corpus",
        titre: ["Construire un corpus là où il n'y en a pas", "Building a corpus where none exists"],
        paragraphes: [
          [
            "Trois corpus ont été construits pour l'occasion : 500 phrases de Common Voice traduites vers le français par un modèle local (llama3.1:8b), 300 paires produites par gabarits et substitution de mots, et un jeu final de 360 paires réparties sur sept domaines du quotidien (santé, famille, administration, marché, transport, éducation, justice).",
            "Three corpora were built for the occasion: 500 Common Voice sentences translated into French by a local model (llama3.1:8b), 300 pairs produced from templates and word substitution, and a final set of 360 pairs spread over seven everyday domains (health, family, administration, market, transport, education, justice).",
          ],
        ],
      },
      {
        id: "audit",
        titre: ["Auditer avant de croire", "Auditing before trusting"],
        paragraphes: [
          [
            "Un script relit chaque ligne et signale ce qui trahit une donnée inutilisable : encodage cassé, phrase tronquée, artefact de génération, source recopiée côté cible, caractère hors de l'alphabet gen, même traduction pour deux sens différents, graphies concurrentes (ɔ et ᴐ). Il accepte un seuil, pour pouvoir bloquer un corpus en intégration continue.",
            "A script rereads every line and flags what gives away unusable data: broken encoding, truncated sentence, generation artefact, source copied into the target, character outside the Gen alphabet, same translation for two different meanings, competing spellings (ɔ and ᴐ). It accepts a threshold, so that a corpus can be blocked in continuous integration.",
          ],
          [
            "Le verdict est net : le corpus traduit automatiquement a plus de deux lignes sur trois à jeter. Le corpus final descend à 7,8 %, et ses défauts restants sont listés un par un.",
            "The verdict is clear: the machine-translated corpus has more than two lines out of three to discard. The final corpus drops to 7.8%, and its remaining defects are listed one by one.",
          ],
        ],
        visuels: [
          {
            type: "barres",
            titre: ["Part des lignes signalées par l'audit, par corpus", "Share of lines flagged by the audit, per corpus"],
            unite: ["%", "%"],
            max: 100,
            decimales: 1,
            barres: [
              { label: ["Traduit par llama3.1 (500 paires)", "Translated by llama3.1 (500 pairs)"], valeur: 68.4 },
              { label: ["Fusionné (494 paires)", "Merged (494 pairs)"], valeur: 68.0 },
              { label: ["Gabarits (300 paires)", "Templates (300 pairs)"], valeur: 36.7 },
              { label: ["Final (360 paires)", "Final (360 pairs)"], valeur: 7.8, accent: true },
            ],
          },
        ],
        source: { fichier: "scripts/audit_corpus.py", href: `${MINA}/scripts/audit_corpus.py` },
      },
      {
        id: "modele",
        titre: ["La chaîne : la voix, le texte, la traduction", "The chain: voice, text, translation"],
        paragraphes: [
          [
            "Un petit modèle suffit pour apprendre une correspondance de phrases courtes, et il tient sur un GPU de portable : Qwen2-0.5B-Instruct, quantifié en 4 bits, dont seule une couche d'adaptation LoRA est entraînée. Chaque paire sert dans les deux sens, français vers mina et mina vers français.",
            "A small model is enough to learn short sentence mappings, and it fits on a laptop GPU: Qwen2-0.5B-Instruct, quantised to 4 bits, with only a LoRA adaptation layer trained. Each pair is used in both directions, French to Mina and Mina to French.",
          ],
          [
            "Sur une RTX 4060 de portable (8 Go), une traduction prend entre 900 et 1 500 ms.",
            "On a laptop RTX 4060 (8 GB), a translation takes between 900 and 1,500 ms.",
          ],
        ],
        visuels: [
          {
            type: "pipeline",
            titre: ["Ce qui se passe quand quelqu'un parle", "What happens when someone speaks"],
            etapes: [
              { titre: ["Écouter", "Listen"], detail: ["La parole devient du texte.", "Speech becomes text."], tech: "Whisper" },
              { titre: ["Traduire", "Translate"], detail: ["Le modèle affiné traduit dans un sens ou dans l'autre.", "The fine-tuned model translates in either direction."], tech: "Qwen2-0.5B + LoRA" },
              { titre: ["Servir", "Serve"], detail: ["Une API expose /translate, /transcribe et la chaîne complète /pipeline.", "An API exposes /translate, /transcribe and the full /pipeline."], tech: "FastAPI" },
              { titre: ["Collecter", "Collect"], detail: ["Une application fait écouter un enregistrement et recueille sa traduction.", "An app plays a recording and collects its translation."], tech: "Streamlit · SQLite" },
            ],
          },
          {
            type: "table",
            titre: ["Réglages de l'entraînement", "Training settings"],
            colonnes: [
              ["Paramètre", "Setting"],
              ["Valeur", "Value"],
            ],
            lignes: [
              [["Quantification", "Quantisation"], ["4 bits NF4, double quantification", "4-bit NF4, double quantisation"]],
              [["LoRA r / alpha / dropout", "LoRA r / alpha / dropout"], "16 / 32 / 0.05"],
              [["Couches adaptées", "Adapted layers"], "q, k, v, o, gate, up, down"],
              [["Taux d'apprentissage", "Learning rate"], "2e-4"],
              [["Lot effectif", "Effective batch"], ["2 × 4 (accumulation)", "2 × 4 (accumulation)"]],
              [["Matériel", "Hardware"], ["RTX 4060 de portable, 8 Go", "Laptop RTX 4060, 8 GB"]],
            ],
          },
        ],
        source: { fichier: "scripts/train_mina_llm.py", href: `${MINA}/scripts/train_mina_llm.py` },
      },
      {
        id: "resultat",
        titre: ["Où en est le modèle, honnêtement", "Where the model stands, honestly"],
        paragraphes: [
          [
            "Les traductions sont approximatives : sur les phrases courtes des domaines couverts, le sens passe souvent ; au-delà, le modèle tronque ou recopie le français. L'audit a aussi montré que l'entraînement chargeait le corpus le plus défectueux. C'est la prochaine étape : réentraîner sur le corpus final et mesurer sur un jeu de test séparé.",
            "Translations are approximate: on short sentences from the covered domains, the meaning often gets through; beyond that, the model truncates or copies the French. The audit also showed that training loaded the most defective corpus. That is the next step: retrain on the final corpus and measure on a separate test set.",
          ],
        ],
        visuels: [
          {
            type: "table",
            titre: ["Trois sorties du modèle", "Three model outputs"],
            colonnes: [
              ["Français", "French"],
              ["Sortie du modèle", "Model output"],
              ["Lecture", "Verdict"],
            ],
            lignes: [
              ["Combien ça coûte ?", "Ha kae?", ["correct", "correct"]],
              ["Je vais au marché.", "Mu gba soe la.", ["sens transmis, formulation approximative", "meaning conveyed, approximate wording"]],
              ["L'enfant est à l'école.", "L'enfant ecole.", ["échec : le français est recopié", "failure: the French is copied"]],
            ],
          },
        ],
        source: { fichier: "README.md", href: `${MINA}/README.md` },
      },
    ],
    autrement: [
      [
        "Auditer le corpus avant le premier entraînement, pas après : le script existe maintenant, il doit passer en premier.",
        "Audit the corpus before the first training run, not after: the script now exists, it has to run first.",
      ],
      [
        "Mettre de côté un jeu de test dès le départ et mesurer chrF et BLEU : aujourd'hui, la qualité n'est jugée que sur des exemples.",
        "Set a test set aside from the start and measure chrF and BLEU: today, quality is only judged on examples.",
      ],
      [
        "Faire traduire par des locuteurs plutôt que générer : c'est le rôle de l'application de collecte.",
        "Have native speakers translate rather than generate: that is what the collection app is for.",
      ],
    ],
  },

  /* ================================================================== SELF_DEV_AGENT */
  {
    slug: "self-dev-agent",
    pitch: [
      "Un agent de développement qui tourne en local, sur un modèle de 7 milliards de paramètres, et qui ne croit pas ce qu'il écrit : il l'exécute.",
      "A development agent that runs locally, on a 7-billion-parameter model, and does not believe what it writes: it runs it.",
    ],
    chiffres: [
      { valeur: ["7", "7"], label: ["outils : lister, chercher, lire, modifier, créer, exécuter, supprimer", "tools: list, search, read, edit, create, run, delete"] },
      { valeur: ["40", "40"], label: ["étapes au plus par tâche, et un arrêt s'il tourne en rond", "steps at most per task, and a stop when it goes in circles"] },
      { valeur: ["4", "4"], label: ["profils de modèles, choisis selon la RAM de la machine", "model profiles, picked from the machine's RAM"] },
    ],
    sections: [
      {
        id: "probleme",
        titre: ["Le problème", "The problem"],
        paragraphes: [
          [
            "Un modèle de 7 ou 8 milliards de paramètres tourne sur un portable, sans clé d'API ni réseau. Mais il produit des bugs subtils : on ne peut pas croire sur parole le code qu'il propose. La seule façon de s'en servir est de lui faire vérifier son propre travail.",
            "A 7 or 8-billion-parameter model runs on a laptop, with no API key and no network. But it produces subtle bugs: you cannot take the code it proposes at its word. The only way to use it is to make it check its own work.",
          ],
        ],
      },
      {
        id: "boucle",
        titre: ["La boucle : explorer, modifier, exécuter, corriger", "The loop: explore, edit, run, fix"],
        paragraphes: [
          [
            "L'agent ne répond pas d'un bloc : il appelle des outils, lit leur résultat, et recommence. Aucun outil ne lève d'exception ; une erreur revient au modèle sous forme de texte, qu'il doit lire et corriger.",
            "The agent does not answer in one go: it calls tools, reads their result, and starts again. No tool raises an exception; an error goes back to the model as text, which it has to read and fix.",
          ],
        ],
        visuels: [
          {
            type: "pipeline",
            titre: ["Une tâche, de la demande au test qui passe", "One task, from the request to a passing test"],
            etapes: [
              { titre: ["Planifier", "Plan"], detail: ["Si la demande cite plusieurs fichiers, un plan JSON fixe leur rôle et leurs imports.", "If the request names several files, a JSON plan sets their role and imports."], tech: "T = 0.1" },
              { titre: ["Explorer", "Explore"], detail: ["Lister, chercher, lire avant de toucher quoi que ce soit.", "List, search, read before touching anything."], tech: "list_files · grep · read_file" },
              { titre: ["Modifier", "Edit"], detail: ["Remplacement exact et unique ; sauvegarde, contrôle de syntaxe, retour arrière si besoin.", "Exact, unique replacement; backup, syntax check, rollback if needed."], tech: "edit_file" },
              { titre: ["Exécuter", "Run"], detail: ["Le script ou les tests tournent pour de vrai (15 s par défaut, 30 s au plus).", "The script or the tests actually run (15 s by default, 30 s at most)."], tech: "run_python" },
              { titre: ["Corriger", "Fix"], detail: ["L'erreur revient au modèle, qui recommence ; 40 étapes au plus.", "The error goes back to the model, which tries again; 40 steps at most."] },
            ],
          },
        ],
        source: { fichier: "agent.py", href: `${AGENT}/agent.py` },
      },
      {
        id: "fiabiliser",
        titre: ["Rendre fiable un petit modèle", "Making a small model reliable"],
        paragraphes: [
          [
            "Un petit modèle se trompe aussi dans la forme : il oublie le format d'appel d'outil, décrit un correctif sans l'appliquer, ou répète la même action. Chaque travers a son garde-fou.",
            "A small model also gets the form wrong: it forgets the tool-call format, describes a fix without applying it, or repeats the same action. Each habit has its safeguard.",
          ],
        ],
        points: [
          ["Trois lectures de secours pour comprendre un appel d'outil mal formé (balises, JSON brut, pseudo-appel).", "Three fallback parsers to understand a malformed tool call (tags, bare JSON, pseudo-call)."],
          ["Une relance si le modèle montre du code au lieu de modifier le fichier.", "A nudge when the model shows code instead of editing the file."],
          ["Un arrêt si le même outil vise le même fichier 4 fois sur les 6 derniers appels.", "A stop when the same tool targets the same file 4 times in the last 6 calls."],
          ["Une écriture refusée si le fichier devient vide ou perd plus des trois quarts de sa taille.", "A write is refused if the file becomes empty or loses more than three quarters of its size."],
          ["Des tests unittest qui doivent vraiment s'exécuter (« Ran N tests »), pas seulement se lancer.", "unittest tests must actually run (“Ran N tests”), not just start."],
        ],
        source: { fichier: "tools.py", href: `${AGENT}/tools.py` },
      },
      {
        id: "installation",
        titre: ["Installer en une commande", "Installing with one command"],
        paragraphes: [
          [
            "L'installateur, écrit avec la seule bibliothèque standard de Python, détecte le système (Windows, Linux, macOS), la RAM et l'espace disque, installe Ollama s'il manque, télécharge les modèles adaptés et ajoute la commande selfdev au PATH.",
            "The installer, written with Python's standard library only, detects the system (Windows, Linux, macOS), the RAM and the disk space, installs Ollama if it is missing, downloads the right models and adds the selfdev command to the PATH.",
          ],
        ],
        visuels: [
          {
            type: "table",
            titre: ["Les modèles choisis selon la RAM", "Models picked from the RAM"],
            colonnes: [
              ["RAM", "RAM"],
              ["Modèle d'aiguillage", "Routing model"],
              ["Modèle de code", "Code model"],
              ["Taille estimée", "Estimated size"],
            ],
            lignes: [
              [["moins de 6 Go", "under 6 GB"], "qwen2.5-coder:1.5b", "deepseek-coder:1.3b", ["2 Go", "2 GB"]],
              [["moins de 12 Go", "under 12 GB"], "qwen2.5-coder:3b", "deepseek-coder:1.3b", ["3 Go", "3 GB"]],
              [["moins de 24 Go", "under 24 GB"], "qwen2.5-coder:7b", "deepseek-coder:6.7b", ["8 Go", "8 GB"]],
              [["24 Go et plus", "24 GB and more"], "qwen2.5-coder:14b", "deepseek-coder:6.7b", ["13 Go", "13 GB"]],
            ],
          },
        ],
        source: { fichier: "install.py", href: `${AGENT}/install.py` },
      },
      {
        id: "limites",
        titre: ["Ce qu'il fait, et ce qu'il ne fait pas encore", "What it does, and what it does not do yet"],
        paragraphes: [
          [
            "Sur des tâches courtes et bien délimitées, l'agent livre du code vérifié par ses tests. Sur un projet de cinq fichiers interdépendants ou plus, le résultat devient aléatoire : le plan n'est pas toujours suivi, et la détection de boucle arrête l'agent sans résoudre le problème. Les petits pas supervisés restent la bonne façon de s'en servir.",
            "On short, well-scoped tasks, the agent delivers code checked by its tests. On a project of five or more interdependent files, the outcome becomes hit-or-miss: the plan is not always followed, and loop detection stops the agent without solving the problem. Small supervised steps remain the right way to use it.",
          ],
        ],
        source: { fichier: "README.md", href: `${AGENT}/README.md` },
      },
    ],
    autrement: [
      [
        "Mesurer : un banc de tâches fixe, avec taux de réussite et nombre d'étapes, pour comparer les modèles et les versions du prompt au lieu de juger à l'œil.",
        "Measure: a fixed task benchmark, with success rate and step count, to compare models and prompt versions instead of judging by eye.",
      ],
      [
        "Confiner l'agent au dossier du projet et exécuter le code dans un conteneur.",
        "Confine the agent to the project folder and run the code in a container.",
      ],
      [
        "Des tests et une intégration continue pour l'agent lui-même.",
        "Tests and continuous integration for the agent itself.",
      ],
    ],
  },

  /* ================================================================== Salifort Motors */
  {
    slug: "prediction-depart-employes",
    pitch: [
      "Prédire quels salariés risquent de partir, sans tricher avec une variable qui contient déjà la réponse, et livrer le modèle jusqu'à un outil.",
      "Predict which employees are likely to leave, without cheating with a variable that already holds the answer, and ship the model all the way to a tool.",
    ],
    chiffres: [
      { valeur: ["90 %", "90%"], label: ["des départs réels retrouvés sur le jeu de test (rappel)", "of actual departures found on the test set (recall)"] },
      { valeur: ["87 %", "87%"], label: ["des alertes justes (précision)", "of alerts correct (precision)"] },
      { valeur: ["11 991", "11,991"], label: ["salariés après retrait de 3 008 doublons", "employees after removing 3,008 duplicates"] },
    ],
    sections: [
      {
        id: "probleme",
        titre: ["Le problème", "The problem"],
        paragraphes: [
          [
            "Salifort Motors (un cas d'étude) veut savoir quels salariés risquent de partir, et pourquoi. La base compte 14 999 lignes et 10 colonnes : satisfaction, dernière évaluation, nombre de projets, heures mensuelles, ancienneté, accident du travail, promotion, département, salaire et départ.",
            "Salifort Motors (a case study) wants to know which employees are likely to leave, and why. The data has 14,999 rows and 10 columns: satisfaction, last evaluation, number of projects, monthly hours, tenure, work accident, promotion, department, salary and departure.",
          ],
          [
            "Premier constat : 3 008 lignes sont des doublons. Une fois retirées, il reste 11 991 salariés, dont 16,6 % sont partis. Les classes sont déséquilibrées : un modèle qui prédit « reste » pour tout le monde aurait déjà 83 % d'exactitude, d'où l'attention portée au rappel et à la précision plutôt qu'à l'exactitude.",
            "First finding: 3,008 rows are duplicates. Once removed, 11,991 employees remain, 16.6% of whom left. The classes are imbalanced: a model predicting “stays” for everyone would already be 83% accurate, hence the focus on recall and precision rather than accuracy.",
          ],
        ],
        source: { fichier: "Projet.ipynb", href: `${SALIFORT}/Projet.ipynb` },
      },
      {
        id: "fuite",
        titre: ["La fuite de données : le score trop beau", "Data leakage: the score that is too good"],
        paragraphes: [
          [
            "Avec toutes les variables, la forêt aléatoire atteint 0,980 d'AUC en validation croisée. Mais la satisfaction n'existe pas pour tous les salariés au moment où l'on voudrait prédire, et quelqu'un qui a décidé de partir travaille peut-être déjà moins d'heures. Ces deux variables annoncent la réponse au lieu de la prédire.",
            "With every variable, the random forest reaches 0.980 AUC in cross-validation. But satisfaction does not exist for every employee at the moment you would want to predict, and someone who has decided to leave may already be working fewer hours. These two variables give the answer away instead of predicting it.",
          ],
          [
            "La satisfaction est donc retirée, et les heures sont remplacées par un indicateur de surmenage (plus de 175 h par mois). Le modèle honnête perd un point et demi d'AUC : c'est le prix d'un modèle utilisable.",
            "Satisfaction is therefore removed, and hours are replaced with an overwork flag (more than 175 h a month). The honest model loses one and a half points of AUC: that is the price of a usable model.",
          ],
        ],
        visuels: [
          {
            type: "barres",
            titre: ["AUC en validation croisée (4 plis), avec et sans les variables suspectes", "Cross-validated AUC (4 folds), with and without the suspect variables"],
            max: 1,
            decimales: 3,
            barres: [
              { label: ["Arbre de décision, avec satisfaction", "Decision tree, with satisfaction"], valeur: 0.969819 },
              { label: ["Forêt aléatoire, avec satisfaction", "Random forest, with satisfaction"], valeur: 0.980425 },
              { label: ["Arbre de décision, sans", "Decision tree, without"], valeur: 0.958675 },
              { label: ["Forêt aléatoire, sans (retenue)", "Random forest, without (kept)"], valeur: 0.96481, accent: true },
            ],
          },
        ],
        source: { fichier: "Projet.ipynb", href: `${SALIFORT}/Projet.ipynb` },
      },
      {
        id: "modeles",
        titre: ["Trois modèles comparés", "Three models compared"],
        paragraphes: [
          [
            "Une régression logistique, un arbre de décision et une forêt aléatoire, réglés par recherche sur grille. Sur le jeu de test, la régression logistique ne retrouve qu'un départ sur quatre ; la forêt aléatoire finale, sans les variables suspectes, en retrouve neuf sur dix.",
            "A logistic regression, a decision tree and a random forest, tuned by grid search. On the test set, logistic regression finds only one departure in four; the final random forest, without the suspect variables, finds nine in ten.",
          ],
          [
            "La matrice ci-dessous est reconstituée à partir des scores imprimés dans le notebook (précision, rappel, exactitude, sur 2 998 salariés dont 498 départs) : le notebook ne l'affiche qu'en image.",
            "The matrix below is rebuilt from the scores printed in the notebook (precision, recall, accuracy, over 2,998 employees including 498 departures): the notebook only shows it as an image.",
          ],
        ],
        visuels: [
          {
            type: "barres",
            titre: ["Rappel sur les départs, jeu de test", "Recall on departures, test set"],
            max: 1,
            decimales: 2,
            barres: [
              { label: ["Régression logistique", "Logistic regression"], valeur: 0.26 },
              { label: ["Forêt aléatoire, avec satisfaction", "Random forest, with satisfaction"], valeur: 0.919679 },
              { label: ["Forêt aléatoire, sans (retenue)", "Random forest, without (kept)"], valeur: 0.903614, accent: true },
            ],
          },
          {
            type: "matrice",
            titre: ["Forêt aléatoire retenue, jeu de test", "Kept random forest, test set"],
            positif: ["part", "leaves"],
            negatif: ["reste", "stays"],
            vn: 2433,
            fp: 67,
            fn: 48,
            vp: 450,
          },
        ],
        source: { fichier: "Projet.ipynb", href: `${SALIFORT}/Projet.ipynb` },
      },
      {
        id: "pourquoi",
        titre: ["Ce qui pèse dans la décision", "What drives the decision"],
        paragraphes: [
          [
            "Quatre variables font presque tout : la dernière évaluation, le nombre de projets, l'ancienneté et le surmenage. Le salaire et le département ne pèsent presque rien. Dans les données, les 145 salariés qui avaient sept projets sont tous partis.",
            "Four variables do almost everything: last evaluation, number of projects, tenure and overwork. Salary and department weigh almost nothing. In the data, all 145 employees who had seven projects left.",
          ],
        ],
        visuels: [
          {
            type: "barres",
            titre: ["Importance des variables (arbre de décision sans fuite, Gini)", "Feature importance (leak-free decision tree, Gini)"],
            max: 0.4,
            decimales: 3,
            barres: [
              { label: ["Dernière évaluation", "Last evaluation"], valeur: 0.343958, accent: true },
              { label: ["Nombre de projets", "Number of projects"], valeur: 0.343385, accent: true },
              { label: ["Ancienneté", "Tenure"], valeur: 0.215681, accent: true },
              { label: ["Surmenage (> 175 h/mois)", "Overwork (> 175 h/month)"], valeur: 0.093498, accent: true },
              { label: ["Département support", "Support department"], valeur: 0.001142 },
              { label: ["Salaire", "Salary"], valeur: 0.00091 },
            ],
          },
        ],
        source: { fichier: "Projet.ipynb", href: `${SALIFORT}/Projet.ipynb` },
      },
      {
        id: "livrer",
        titre: ["Livrer jusqu'au bout", "Shipping it all the way"],
        paragraphes: [
          [
            "Le modèle ne reste pas dans le notebook : il est sérialisé, servi par une API, et utilisé par une application où un responsable RH peut tester un profil.",
            "The model does not stay in the notebook: it is serialised, served by an API, and used by an app where an HR manager can test a profile.",
          ],
        ],
        visuels: [
          {
            type: "pipeline",
            titre: ["Du notebook à l'outil", "From notebook to tool"],
            etapes: [
              { titre: ["Analyse", "Analysis"], detail: ["Nettoyage, exploration, trois modèles, recherche sur grille en 4 plis.", "Cleaning, exploration, three models, 4-fold grid search."], tech: "pandas · scikit-learn" },
              { titre: ["Modèle", "Model"], detail: ["La forêt retenue (500 arbres, profondeur 5) est sérialisée.", "The kept forest (500 trees, depth 5) is serialised."], tech: "pickle" },
              { titre: ["API", "API"], detail: ["POST /predict : 17 variables en entrée, la prédiction et sa probabilité en sortie.", "POST /predict: 17 variables in, the prediction and its probability out."], tech: "FastAPI" },
              { titre: ["Application", "App"], detail: ["Un formulaire qui interroge l'API et affiche le risque.", "A form that queries the API and shows the risk."], tech: "Streamlit" },
              { titre: ["Tableau de bord", "Dashboard"], detail: ["Les indicateurs RH pour la direction.", "HR indicators for management."], tech: "Power BI" },
            ],
          },
        ],
        source: { fichier: "main.py", href: `${SALIFORT}/main.py` },
      },
    ],
    autrement: [
      [
        "Calculer l'AUC sur les probabilités du modèle : le notebook la calcule sur les prédictions binaires, ce qui revient à une exactitude équilibrée. C'est pour cela que cette page met en avant le rappel et la précision.",
        "Compute AUC on the model's probabilities: the notebook computes it on binary predictions, which amounts to balanced accuracy. That is why this page leads with recall and precision.",
      ],
      [
        "Tester aussi sans la dernière évaluation, pour écarter une fuite résiduelle.",
        "Also test without the last evaluation, to rule out residual leakage.",
      ],
      [
        "Choisir le seuil de décision selon le coût d'un départ manqué face à celui d'une fausse alerte, et essayer XGBoost.",
        "Pick the decision threshold from the cost of a missed departure versus a false alarm, and try XGBoost.",
      ],
    ],
  },
]

export const getEtude = (slug: string) => ETUDES.find((e) => e.slug === slug)
