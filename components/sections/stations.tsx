"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

type Station = {
  cle: string
  code: string
  role: string
  titre: string
  texte: string
  pile: string[]
  depot?: string
}

const STATIONS: Station[] = [
  {
    cle: "rag-local",
    code: "RAG-LOCAL",
    role: "assistant documentaire",
    titre: "Aucune donnée ne quitte la machine",
    texte:
      "Recherche hybride, reranking cross-encoder, réponses citées à la page près. Les images des PDF sont décrites par un modèle de vision local et deviennent cherchables comme du texte.",
    pile: ["FastAPI", "Chroma", "Ollama", "Next.js", "Docker Compose", "RAGAS"],
    depot: "https://github.com/Yohannkp/RAG-Local",
  },
  {
    cle: "mina-translator",
    code: "MINA-TRANSLATOR",
    role: "traduction FR ↔ mina",
    titre: "Une langue sans corpus",
    texte:
      "Le mina n'a aucun corpus parallèle public. J'en ai construit un à la main — 500 paires — pour affiner Qwen2-0.5B en QLoRA 4 bits, et une application de collecte participative pour l'étendre.",
    pile: ["QLoRA", "Whisper", "FastAPI", "Streamlit"],
    depot: "https://github.com/Yohannkp/mina-translator",
  },
  {
    cle: "self-dev-agent",
    code: "SELF_DEV_AGENT",
    role: "agent de développement",
    titre: "Un agent qui vérifie son propre travail",
    texte:
      "Un modèle de 7 milliards de paramètres n'est pas fiable. Alors l'agent n'écrit pas du code en espérant : il explore, modifie, exécute les tests, et se corrige.",
    pile: ["Ollama", "Tool calling", "AST", "Python"],
    depot: "https://github.com/Yohannkp/Claude-local",
  },
  {
    cle: "leboncoin-mern",
    code: "LE BON COIN",
    role: "plateforme d'annonces",
    titre: "Changer de base sans tout casser",
    texte:
      "Backend Express structuré, authentification par jeton, autorisation par propriétaire. Puis migration de MongoDB vers SQLite : modèles et contrôleurs entièrement réécrits.",
    pile: ["Node.js", "Express", "JWT", "Sequelize", "React"],
    depot: "https://github.com/Yohannkp/React-MERN-Project",
  },
  {
    cle: "snake-rl",
    code: "SNAKE RL",
    role: "apprentissage par renforcement",
    titre: "Un environnement écrit à la main",
    texte:
      "Environnement Gymnasium sur mesure, DQN en PyTorch avec réseau cible et mémoire de rejeu. Entraînement sur GPU, modules séparés.",
    pile: ["PyTorch", "Gymnasium", "DQN"],
    depot: "https://github.com/Yohannkp/Apprentissage-par-renforcement-Snake-Game",
  },
  {
    cle: "optimisation-ventes",
    code: "OPTIMISATION",
    role: "impact d'un agencement",
    titre: "Mesurer sans pouvoir randomiser",
    texte:
      "Chaque magasin test est apparié à un magasin contrôle choisi par corrélation avant l'intervention. C'est ce qui rend la mesure défendable.",
    pile: ["pandas", "Inférence causale", "Tests statistiques"],
    depot: "https://github.com/Yohannkp/Optimisation-des-ventes",
  },
]

export function Stations() {
  const racine = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = racine.current
    if (!el) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let annule = false
    const observateurs: IntersectionObserver[] = []

    import("animejs")
      .then(({ animate, stagger, utils }) => {
        if (annule || !racine.current) return
        el.querySelectorAll<HTMLElement>(".station").forEach((carte) => {
          const io = new IntersectionObserver(
            (entrees) => {
              entrees.forEach((e) => {
                if (!e.isIntersecting) return
                io.disconnect()
                animate(carte, { opacity: [0, 1], y: [34, 0], duration: 820, ease: "out(3)" })
                animate(carte.querySelectorAll(".station__pile span"), {
                  opacity: [0, 1],
                  y: [8, 0],
                  duration: 520,
                  ease: "out(3)",
                  delay: stagger(34, { start: 180 }),
                })
              })
            },
            { threshold: 0.18, rootMargin: "0px 0px -8% 0px" },
          )
          io.observe(carte)
          observateurs.push(io)
          utils.set(carte, { opacity: 0 })
        })
      })
      .catch(() => {
        /* les cartes restent visibles */
      })

    return () => {
      annule = true
      observateurs.forEach((o) => o.disconnect())
    }
  }, [])

  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="rag__kicker">Stations</p>
        <h2 className="rag__h2">Six projets, menés jusqu&apos;au déploiement</h2>
        <p className="rag__lede mb-12">
          Chacun résout un problème que je me suis posé, pas un exercice de cours.
        </p>

        <div className="stations" ref={racine}>
          {STATIONS.map((s, i) => (
            <article className="station" key={s.cle}>
              <div className="station__id">
                <b>{s.code}</b>
                {s.role}
              </div>
              <div className="station__corps">
                <h3>{s.titre}</h3>
                <p>{s.texte}</p>
                <div className="station__pile">
                  {s.pile.map((t) => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
                {s.depot ? (
                  <a className="station__lien" href={s.depot} target="_blank" rel="noreferrer noopener">
                    Voir le dépôt
                  </a>
                ) : null}
              </div>
              <div className="station__n">{String(i + 1).padStart(2, "0")}</div>
            </article>
          ))}
        </div>

        <div className="mt-12">
          <Link href="/projects" className="station__lien inline-flex items-center gap-2">
            Tous les projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
