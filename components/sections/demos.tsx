"use client"

import { useState } from "react"
import { DemoRag } from "@/components/sections/demo-rag"
import { DemoAgent } from "@/components/sections/demo-agent"
import { DemoMina } from "@/components/sections/demo-mina"

const ONGLETS = [
  {
    cle: "rag",
    nom: "RAG-Local",
    titre: "Une question traverse le pipeline",
    texte: "De la question posée jusqu'à la réponse citée, avec la page source qui s'ouvre.",
  },
  {
    cle: "agent",
    nom: "SELF_DEV_AGENT",
    titre: "L'agent corrige un bug",
    texte: "Le test échoue d'abord, puis la correction est écrite, puis le test repasse.",
  },
  {
    cle: "mina",
    nom: "Mina-Translator",
    titre: "Du français au mina",
    texte: "Transcription, traduction par le modèle affiné, et l'état réel du corpus.",
  },
] as const

export function Demos() {
  const [actif, setActif] = useState<(typeof ONGLETS)[number]["cle"]>("rag")
  const courant = ONGLETS.find((o) => o.cle === actif)!

  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="rag__kicker">Démonstrations</p>
        <h2 className="rag__h2">Voir les projets à l&apos;œuvre</h2>
        <p className="rag__lede">
          Trois scénarios joués au clic. Rien n&apos;est exécuté pour de vrai — ce sont des simulations, et elles le
          disent.
        </p>

        <div className="onglets" role="tablist" aria-label="Choisir une démonstration">
          {ONGLETS.map((o) => (
            <button
              key={o.cle}
              role="tab"
              aria-selected={o.cle === actif}
              className={`onglet ${o.cle === actif ? "onglet--actif" : ""}`}
              onClick={() => setActif(o.cle)}
            >
              {o.nom}
            </button>
          ))}
        </div>

        <div className="onglets__entete">
          <h3>{courant.titre}</h3>
          <p>{courant.texte}</p>
        </div>

        {actif === "rag" ? <DemoRag nu /> : null}
        {actif === "agent" ? <DemoAgent nu /> : null}
        {actif === "mina" ? <DemoMina nu /> : null}
      </div>
    </section>
  )
}
