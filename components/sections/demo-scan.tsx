"use client"

import { foc, GuideShell, useSerie, useTyping, type Etape } from "@/components/sections/demo-guide"

/**
 * Une page scannee (une image, donc zero texte) devient interrogeable :
 * le modèle de vision repère les lignes, les transcrit, puis une question retrouve le passage.
 */

const QUESTION = "Quelle est la durée du préavis de résiliation ?"
const REPONSE = "Le préavis de résiliation est de trois mois, à compter de la réception de la lettre recommandée."

const ETAPES: Etape[] = [
  {
    titre: "Une page scannée",
    texte: "C'est une photo de page : pour l'ordinateur, il n'y a aucun texte à chercher ni à copier.",
    humeur: "neutre",
  },
  {
    titre: "Le modèle de vision lit",
    texte: "Un modèle de vision local balaie la page et repère chaque ligne de texte.",
    humeur: "concentre",
    attente: 900,
  },
  {
    titre: "Transcrire",
    texte: "Chaque ligne repérée est transcrite. Le texte apparaît à droite, ligne après ligne.",
    humeur: "concentre",
    attente: 1800,
  },
  {
    titre: "Une page cherchable",
    texte: "412 caractères de texte : la page entre dans l'index, comme n'importe quel document.",
    humeur: "content",
  },
  {
    titre: "La question",
    texte: "Je demande : « Quelle est la durée du préavis de résiliation ? »",
    humeur: "concentre",
  },
  {
    titre: "Retrouver le passage",
    texte: "La recherche retrouve le passage de la page qui parle de préavis, et le marque.",
    humeur: "curieux",
    attente: 600,
  },
  {
    titre: "Répondre en citant",
    texte: "La réponse est rédigée à partir de ce passage, pas de mémoire, avec un renvoi [1] vers la page.",
    humeur: "concentre",
    attente: 1200,
  },
  {
    titre: "Vérifiable",
    texte: "Le [1] pointe la ligne exacte : on peut vérifier au lieu de faire confiance.",
    humeur: "content",
  },
]

const LIGNES: { t: string; cle?: boolean; pre?: string }[] = [
  { t: "ARTICLE 7 — RÉSILIATION" },
  { t: "Chacune des parties peut résilier le présent contrat" },
  { t: "par lettre recommandée avec accusé de réception," },
  { t: "sous réserve de respecter un préavis de", cle: true },
  { t: " à compter de la réception.", cle: true, pre: "trois (3) mois" },
  { t: "Toute résiliation intervenant sans ce préavis" },
  { t: "ouvre droit à une indemnité compensatrice." },
]
const N = LIGNES.length
const CLE = 4 // la ligne que le renvoi [1] designe

function Scene({ etape }: { etape: number }) {
  const k1 = useSerie(etape === 1, N, 300)
  const k2 = useSerie(etape === 2, N, 520)
  const question = useTyping(QUESTION, etape >= 4, 34).affiche
  const reponse = useTyping(REPONSE, etape >= 6, 38)

  const boite = (i: number) => etape > 1 || (etape === 1 && i < k1)
  const ecrite = (i: number) => etape > 2 || (etape === 2 && i < k2)
  const chars = etape > 2 ? 412 : etape === 2 ? Math.round((412 * k2) / N) : 0

  return (
    <div className="sc">
      <div className="sc__page-zone">
        <p className="sc__legende">
          <span>page1.jpg</span> <em>image · 0 caractère de texte</em>
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
              <span>CACHET</span>
            </div>
          </div>
        </div>
      </div>

      <div className="sc__droite">
        <div className="sc__vol">
          <div className="sc__tete">
            <span>Texte transcrit</span>
            <b data-ok={etape >= 3 ? "1" : "0"} {...foc(etape === 3)}>
              {etape < 2 ? "texte extractible : aucun" : `${chars} caractères`}
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
            <i data-ecrit={question.length >= QUESTION.length ? "1" : "0"} />
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
  return (
    <GuideShell
      nom="Scan cherchable"
      sim="Simulation — aucun modèle n'est exécuté"
      etapes={ETAPES}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
