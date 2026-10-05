"use client"

import { useState } from "react"
import { DemoFichiers } from "@/components/sections/demo-fichiers"
import { DemoScan } from "@/components/sections/demo-scan"
import { DemoAgent } from "@/components/sections/demo-agent"
import { DemoMina } from "@/components/sections/demo-mina"
import { useT } from "@/lib/langue"

const ONGLETS = [
  {
    cle: "fichiers",
    nom: ["Mes fichiers", "My files"],
    titre: ["Où sont mes photos prises à la plage ?", "Where are my beach photos?"],
    texte: [
      "RAG-Local indexe un dossier de l'ordinateur et retrouve des images par leur contenu — elles ne contiennent pourtant aucun texte.",
      "RAG-Local indexes a folder on the computer and finds images by their content — even though they contain no text.",
    ],
  },
  {
    cle: "scan",
    nom: ["Un scan cherchable", "A searchable scan"],
    titre: ["Une page scannée devient interrogeable", "A scanned page becomes searchable"],
    texte: [
      "Une page scannée est une image : zéro texte extractible. Un modèle de vision local la transcrit, puis elle entre dans l'index.",
      "A scanned page is an image: zero extractable text. A local vision model transcribes it, then it enters the index.",
    ],
  },
  {
    cle: "agent",
    nom: ["SELF_DEV_AGENT", "SELF_DEV_AGENT"],
    titre: ["L'agent corrige un bug", "The agent fixes a bug"],
    texte: ["Le test échoue d'abord, puis la correction est écrite, puis le test repasse.", "The test fails first, then the fix is written, then the test passes again."],
  },
  {
    cle: "mina",
    nom: ["Mina-Translator", "Mina-Translator"],
    titre: ["Du français au mina", "From French to Mina"],
    texte: ["Transcription, traduction par le modèle affiné, et l'état réel du corpus.", "Transcription, translation by the fine-tuned model, and the real state of the corpus."],
  },
] as const

export function Demos() {
  const t = useT()
  const [actif, setActif] = useState<(typeof ONGLETS)[number]["cle"]>("fichiers")
  const courant = ONGLETS.find((o) => o.cle === actif)!

  return (
    <section id="sec-demos" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <div className="demo-zone">
        <p className="rag__kicker">{t("Démonstrations", "Demonstrations")}</p>
        <h2 className="rag__h2">{t("Voir les projets à l'œuvre", "See the projects at work")}</h2>
        <p className="rag__lede">
          {t(
            "Quatre scénarios joués au clic. Rien n'est exécuté pour de vrai — ce sont des simulations, et elles le disent.",
            "Four scenarios played on click. Nothing is actually executed — these are simulations, and they say so.",
          )}
        </p>

        <div className="onglets" role="tablist" aria-label={t("Choisir une démonstration", "Choose a demonstration")}>
          {ONGLETS.map((o) => (
            <button
              key={o.cle}
              role="tab"
              aria-selected={o.cle === actif}
              className={`onglet ${o.cle === actif ? "onglet--actif" : ""}`}
              onClick={() => setActif(o.cle)}
            >
              {t(o.nom[0], o.nom[1])}
            </button>
          ))}
        </div>

        <div className="onglets__entete">
          <h3>{t(courant.titre[0], courant.titre[1])}</h3>
          <p>{t(courant.texte[0], courant.texte[1])}</p>
        </div>

        {actif === "fichiers" ? <DemoFichiers nu /> : null}
        {actif === "scan" ? <DemoScan nu /> : null}
        {actif === "agent" ? <DemoAgent nu /> : null}
        {actif === "mina" ? <DemoMina nu /> : null}
        </div>
      </div>
    </section>
  )
}
