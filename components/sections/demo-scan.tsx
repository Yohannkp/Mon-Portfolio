"use client"

import { useMemo } from "react"
import { foc, GuideShell, useSerie, useTyping, versEtapes, type EtapeT } from "@/components/sections/demo-guide"
import { useLangue } from "@/lib/langue"

/**
 * Une page scannee (une image, donc zero texte) devient interrogeable :
 * le modèle de vision repère les lignes, les transcrit, puis une question retrouve le passage.
 */

const QUESTION: [string, string] = ["Quelle est la durée du préavis de résiliation ?", "What is the notice period for termination?"]
const REPONSE: [string, string] = [
  "Le préavis de résiliation est de trois mois, à compter de la réception de la lettre recommandée.",
  "The termination notice period is three months, starting from receipt of the registered letter.",
]

const ETAPES: EtapeT[] = [
  {
    titre: ["Une page scannée", "A scanned page"],
    texte: [
      "C'est une photo de page : pour l'ordinateur, il n'y a aucun texte à chercher ni à copier.",
      "It's a photo of a page: to the computer, there is no text to search or copy.",
    ],
    humeur: "neutre",
  },
  {
    titre: ["Le modèle de vision lit", "The vision model reads"],
    texte: [
      "Un modèle de vision local balaie la page et repère chaque ligne de texte.",
      "A local vision model sweeps the page and spots each line of text.",
    ],
    humeur: "concentre",
    attente: 900,
  },
  {
    titre: ["Transcrire", "Transcribing"],
    texte: [
      "Chaque ligne repérée est transcrite. Le texte apparaît à droite, ligne après ligne.",
      "Each spotted line is transcribed. The text appears on the right, line after line.",
    ],
    humeur: "concentre",
    attente: 1800,
  },
  {
    titre: ["Une page cherchable", "A searchable page"],
    texte: [
      "412 caractères de texte : la page entre dans l'index, comme n'importe quel document.",
      "412 characters of text: the page enters the index, like any other document.",
    ],
    humeur: "content",
  },
  {
    titre: ["La question", "The question"],
    texte: [
      "Je demande : « Quelle est la durée du préavis de résiliation ? »",
      "I ask: “What is the notice period for termination?”",
    ],
    humeur: "concentre",
  },
  {
    titre: ["Retrouver le passage", "Finding the passage"],
    texte: [
      "La recherche retrouve le passage de la page qui parle de préavis, et le marque.",
      "The search finds the passage of the page that talks about notice, and highlights it.",
    ],
    humeur: "curieux",
    attente: 600,
  },
  {
    titre: ["Répondre en citant", "Answering with a citation"],
    texte: [
      "La réponse est rédigée à partir de ce passage, pas de mémoire, avec un renvoi [1] vers la page.",
      "The answer is written from that passage, not from memory, with a reference [1] to the page.",
    ],
    humeur: "concentre",
    attente: 1200,
  },
  {
    titre: ["Vérifiable", "Verifiable"],
    texte: [
      "Le [1] pointe la ligne exacte : on peut vérifier au lieu de faire confiance.",
      "The [1] points to the exact line: you can verify instead of trusting.",
    ],
    humeur: "content",
  },
]

type Ligne = { t: string; cle?: boolean; pre?: string }
const LIGNES_FR: Ligne[] = [
  { t: "ARTICLE 7 — RÉSILIATION" },
  { t: "Chacune des parties peut résilier le présent contrat" },
  { t: "par lettre recommandée avec accusé de réception," },
  { t: "sous réserve de respecter un préavis de", cle: true },
  { t: " à compter de la réception.", cle: true, pre: "trois (3) mois" },
  { t: "Toute résiliation intervenant sans ce préavis" },
  { t: "ouvre droit à une indemnité compensatrice." },
]
const LIGNES_EN: Ligne[] = [
  { t: "ARTICLE 7 — TERMINATION" },
  { t: "Either party may terminate this contract" },
  { t: "by registered letter with acknowledgement of receipt," },
  { t: "subject to observing a notice period of", cle: true },
  { t: " from receipt.", cle: true, pre: "three (3) months" },
  { t: "Any termination occurring without this notice" },
  { t: "gives rise to compensatory damages." },
]
const N = LIGNES_FR.length
const CLE = 4 // la ligne que le renvoi [1] designe

function Scene({ etape }: { etape: number }) {
  const en = useLangue() === "en"
  const LIGNES = en ? LIGNES_EN : LIGNES_FR
  const QUESTION_L = QUESTION[en ? 1 : 0]
  const k1 = useSerie(etape === 1, N, 300)
  const k2 = useSerie(etape === 2, N, 520)
  const question = useTyping(QUESTION_L, etape >= 4, 34).affiche
  const reponse = useTyping(REPONSE[en ? 1 : 0], etape >= 6, 38)

  const boite = (i: number) => etape > 1 || (etape === 1 && i < k1)
  const ecrite = (i: number) => etape > 2 || (etape === 2 && i < k2)
  const chars = etape > 2 ? 412 : etape === 2 ? Math.round((412 * k2) / N) : 0

  return (
    <div className="sc">
      <div className="sc__page-zone">
        <p className="sc__legende">
          <span>page1.jpg</span> <em>{en ? "image · 0 characters of text" : "image · 0 caractère de texte"}</em>
        </p>
        <div className="sc__page" {...foc(etape <= 1)}>
          <div className="sc__faisceau" key={etape === 1 ? "on" : "off"} data-on={etape === 1 ? "1" : "0"} />
          {LIGNES.map((l, i) => (
            <div
              key={i}
              className="sc__l"
              data-boite={boite(i) ? "1" : "0"}
              data-cours={etape === 2 && i === k2 - 1 ? "1" : "0"}
              data-marque={etape >= 5 && l.cle ? "1" : "0"}
              {...foc((etape === 2 && i === k2 - 1) || (etape === 5 && i === CLE))}
            >
              {l.pre ? <mark>{l.pre}</mark> : null}
              {l.t}
              {i === CLE ? (
                <span className="sc__renvoi" data-on={etape >= 6 ? "1" : "0"} data-fort={etape === 7 ? "1" : "0"} {...foc(etape === 7)}>
                  1
                </span>
              ) : null}
            </div>
          ))}
          {/* Une signature et un cachet : de l'image, pas du texte. Le modele les voit, ils ne donnent aucun caractere. */}
          <div className="sc__pied" aria-hidden="true">
            <svg viewBox="0 0 120 44" className="sc__signature">
              <path d="M4 32 C 14 6, 22 6, 24 24 S 34 40, 44 16 S 58 6, 62 22 S 78 36, 94 14 L 116 20" />
            </svg>
            <div className="sc__cachet">
              <span>{en ? "STAMP" : "CACHET"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sc__droite">
        <div className="sc__vol">
          <div className="sc__tete">
            <span>{en ? "Transcribed text" : "Texte transcrit"}</span>
            <b data-ok={etape >= 3 ? "1" : "0"} {...foc(etape === 3)}>
              {etape < 2 ? (en ? "extractable text: none" : "texte extractible : aucun") : `${chars} ${en ? "characters" : "caractères"}`}
            </b>
          </div>
          <div className="sc__texte">
            {LIGNES.map((l, i) => (
              <div key={i} className="sc__t" data-on={ecrite(i) ? "1" : "0"}>
                {(l.pre ? l.pre : "") + l.t}
              </div>
            ))}
          </div>
        </div>

        <div className="sc__qr">
          <div className="sc__champ" data-on={etape >= 4 ? "1" : "0"} {...foc(etape === 4)}>
            <span>{question}</span>
            <i data-ecrit={question.length >= QUESTION_L.length ? "1" : "0"} />
          </div>
          <div className="sc__rep" data-on={etape >= 6 ? "1" : "0"} {...foc(etape === 6)}>
            <p>
              {reponse.affiche}
              {reponse.fini ? <sup className="sc__cit">1</sup> : null}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function DemoScan(_props: { nu?: boolean } = {}) {
  const en = useLangue() === "en"
  const etapes = useMemo(() => versEtapes(ETAPES, en), [en])
  return (
    <GuideShell
      nom={en ? "Searchable scan" : "Scan cherchable"}
      sim={en ? "Simulation — no model is executed" : "Simulation — aucun modèle n'est exécuté"}
      etapes={etapes}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
