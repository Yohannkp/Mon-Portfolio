"use client"

import { useEffect, useRef } from "react"

const NOTES = [
  {
    titre: "Étape 1 — Réécriture",
    texte:
      "« Et pour les mineurs ? » ne veut rien dire seule. La question est reformulée en question autonome à partir de l'historique, sinon la recherche ne retrouve rien.",
  },
  {
    titre: "Étape 2 — Deux recherches",
    texte:
      "Vectorielle pour le sens, BM25 pour les mots exacts. Vingt candidats chacune. Le vectoriel rate les références et les numéros ; BM25 les attrape.",
  },
  {
    titre: "Étape 3 — Fusion RRF",
    texte:
      "Les deux classements fusionnent par Reciprocal Rank Fusion. Aucun poids à deviner : c'est le rang qui compte, pas le score.",
  },
  {
    titre: "Étape 4 — Reranking",
    texte:
      "Un cross-encoder relit les candidats et n'en garde que six. Il tourne sur le CPU : le GPU reste entièrement dédié au modèle de chat.",
  },
  {
    titre: "Étape 5 — Réponse",
    texte:
      "qwen3:8b répond en streaming avec des citations cliquables. Un clic ouvre la page exacte du PDF source. S'il ne sait pas, il le dit.",
  },
]

const TRACES = [
  "M112,150 H172",
  "M264,150 H300 Q316,150 316,134 V98 Q316,86 332,86 H360",
  "M264,150 H300 Q316,150 316,166 V202 Q316,214 332,214 H360",
  "M452,86 H480 Q496,86 496,102 V138 Q496,150 512,150 H540",
  "M452,214 H480 Q496,214 496,198 V162 Q496,150 512,150 H540",
  "M632,150 H688",
  "M780,150 H836",
]

const ETAGES = [
  { id: "n0", x: 4, w: 108, y: 124, titre: "Question", sous: "+ historique" },
  { id: "n1", x: 172, w: 92, y: 124, titre: "Réécriture", sous: "autonome" },
  { id: "n2", x: 360, w: 92, y: 60, titre: "Vectoriel", sous: "Chroma · 20" },
  { id: "n3", x: 360, w: 92, y: 188, titre: "BM25", sous: "lexical · 20" },
  { id: "n4", x: 540, w: 92, y: 124, titre: "Fusion RRF", sous: "k = 60" },
  { id: "n5", x: 688, w: 92, y: 124, titre: "Reranking", sous: "CPU → top 6" },
  { id: "n6", x: 836, w: 120, y: 124, titre: "Réponse citée", sous: "qwen3:8b · SSE" },
]

export function RagPipeline() {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (typeof window === "undefined") return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let cancelled = false
    let cleanup: (() => void) | undefined

    import("animejs")
      .then((A) => {
      if (cancelled || !root.current) return
      const { createTimeline, onScroll, svg, utils } = A
      const el = root.current
      const q = (s: string) => el.querySelector(s) as Element

      const flows = TRACES.map((_, i) => svg.createDrawable(q(`#rag-f${i}`) as SVGPathElement))
      const notes = el.querySelectorAll(".rag-note")

      utils.set(el.querySelectorAll(".rag-node"), { opacity: 0.34 })
      utils.set(notes, { opacity: 0, y: 20 })

      const tl = createTimeline({
        autoplay: onScroll({ target: el, enter: "top top", leave: "bottom bottom", sync: 0.45 }),
      })

      tl.add(q("#rag-n0"), { opacity: 1, duration: 60 }, 0)
        .add(flows[0], { draw: "0 1", duration: 100 }, 60)
        .add(q("#rag-n1"), { opacity: 1, duration: 60 }, 140)
        .add([flows[1], flows[2]], { draw: "0 1", duration: 110 }, 200)
        .add([q("#rag-n2"), q("#rag-n3")], { opacity: 1, duration: 60 }, 290)
        .add([flows[3], flows[4]], { draw: "0 1", duration: 110 }, 360)
        .add(q("#rag-n4"), { opacity: 1, duration: 60 }, 450)
        .add(flows[5], { draw: "0 1", duration: 90 }, 510)
        .add(q("#rag-n5"), { opacity: 1, duration: 60 }, 580)
        .add(flows[6], { draw: "0 1", duration: 90 }, 640)
        .add(q("#rag-n6"), { opacity: 1, duration: 80 }, 710)
        .add(
          q("#rag-token"),
          { opacity: [0, 1, 1, 0], cx: [58, 218, 406, 586, 734, 896], duration: 760, ease: "linear" },
          60,
        )

      const creneaux: [number, number][] = [
        [60, 210],
        [210, 370],
        [370, 520],
        [520, 650],
        [650, 830],
      ]
      creneaux.forEach(([debut, fin], i) => {
        const n = notes[i]
        if (!n) return
        tl.add(n, { opacity: [0, 1], y: [20, 0], duration: 70, ease: "out(3)" }, debut).add(
          n,
          { opacity: [1, 0], y: [0, -12], duration: 55, ease: "in(2)" },
          fin - 55,
        )
      })

      cleanup = () => tl.revert()
      })
      .catch(() => {
        // anime.js indisponible : on retombe sur une version statique lisible
        root.current?.classList.add("rag--degrade")
      })

    return () => {
      cancelled = true
      cleanup?.()
    }
  }, [])

  return (
    <section id="sec-rag" className="rag" aria-labelledby="rag-titre">
      <div className="rag__intro">
        <p className="rag__kicker">Pièce maîtresse</p>
        <h2 id="rag-titre" className="rag__h2">
          Ce qui se passe quand vous posez une question à RAG-Local
        </h2>
        <p className="rag__lede">
          Un assistant documentaire dont aucune donnée ne quitte la machine. Voici le chemin réel d'une question à
          travers le système — les chiffres sont ceux du code.
        </p>
      </div>

      <div className="rag__scroll" ref={root}>
        <div className="rag__sticky">
          <p className="rag__astuce" aria-hidden="true">Faites glisser le schéma →</p>
          <div className="rag__svgbox">
            <svg
              className="rag__diagram"
              viewBox="0 0 960 300"
              role="img"
              aria-label="Pipeline RAG-Local : question, réécriture, recherche vectorielle et BM25, fusion RRF, reranking, réponse citée"
            >
              <defs>
                <marker id="rag-ar" viewBox="0 0 8 8" refX="6" refY="4" markerWidth="6" markerHeight="6" orient="auto">
                  <path d="M0,0 L8,4 L0,8 z" className="rag__arrow" />
                </marker>
              </defs>

              {TRACES.map((d, i) => (
                <path key={`s${i}`} className="rag__flow" d={d} markerEnd="url(#rag-ar)" />
              ))}
              {TRACES.map((d, i) => (
                <path key={`l${i}`} id={`rag-f${i}`} className="rag__flow-live" d={d} />
              ))}

              {ETAGES.map((e) => (
                <g key={e.id} id={`rag-${e.id}`} className="rag-node">
                  <rect className="rag__box" x={e.x} y={e.y} width={e.w} height={52} rx={3} />
                  <text className="rag__label" x={e.x + e.w / 2} y={e.y + 22} textAnchor="middle">
                    {e.titre}
                  </text>
                  <text className="rag__sub" x={e.x + e.w / 2} y={e.y + 39} textAnchor="middle">
                    {e.sous}
                  </text>
                </g>
              ))}

              <circle id="rag-token" className="rag__token" r={5} cx={58} cy={150} opacity={0} />
              <text className="rag__cap" x={4} y={286}>
                100 % local — aucune requête réseau sortante
              </text>
            </svg>
          </div>

          <div className="rag__notebox">
            {NOTES.map((n) => (
              <div className="rag-note" key={n.titre}>
                <b>{n.titre}</b>
                <span>{n.texte}</span>
              </div>
            ))}
          </div>
        </div>

        {NOTES.map((n) => (
          <div className="rag__spacer" key={`sp-${n.titre}`} aria-hidden="true" />
        ))}
      </div>
    </section>
  )
}
