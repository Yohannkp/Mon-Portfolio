"use client"

import { useMemo } from "react"
import { foc, GuideShell, useTween, useTyping, versEtapes, type EtapeT } from "@/components/sections/demo-guide"
import { useLangue } from "@/lib/langue"

/**
 * Mina-Translator : un corpus genere puis audite, un petit modele affine, et la chaine
 * parole -> texte -> traduction. Les 360 points sont les 360 paires du corpus.
 */

const FRANCAIS = "Je suis allé à l'école aujourd'hui."
const MINA = "Meyi suku egbea."

const ETAPES: EtapeT[] = [
  {
    titre: ["Le mina : peu de données", "Mina: little data"],
    texte: [
      "Le mina est parlé dans le sud du Togo. Il n'existe aucun corpus parallèle public : tout part de là.",
      "Mina is spoken in southern Togo. No public parallel corpus exists: everything starts there.",
    ],
    humeur: "neutre",
  },
  {
    titre: ["Un corpus à construire", "A corpus to build"],
    texte: [
      "Faute de corpus, j'en ai généré un, puis un script a audité chaque ligne : 360 paires exploitables sur 500, sur 7 domaines.",
      "With no corpus, I generated one, then a script audited every line: 360 usable pairs out of 500, across 7 domains.",
    ],
    humeur: "concentre",
    attente: 1800,
  },
  {
    titre: ["Affiner un petit modèle", "Fine-tuning a small model"],
    texte: [
      "Avec ces paires, j'affine Qwen2-0.5B en QLoRA 4 bits : le modèle reste petit, seule une couche d'adaptation est apprise.",
      "With these pairs, I fine-tune Qwen2-0.5B with 4-bit QLoRA: the model stays small, only an adaptation layer is learned.",
    ],
    humeur: "curieux",
    attente: 800,
  },
  {
    titre: ["Une phrase, à voix haute", "A sentence, out loud"],
    texte: [
      "Voici la chaîne au travail. Quelqu'un dit une phrase en français : « Je suis allé à l'école aujourd'hui. »",
      "Here is the chain at work. Someone says a sentence in French: “Je suis allé à l'école aujourd'hui.” (“I went to school today.”)",
    ],
    humeur: "concentre",
    attente: 800,
  },
  {
    titre: ["Whisper écoute", "Whisper listens"],
    texte: [
      "Whisper transforme la parole en texte : la voix devient une phrase écrite.",
      "Whisper turns speech into text: the voice becomes a written sentence.",
    ],
    humeur: "concentre",
  },
  {
    titre: ["Le modèle traduit", "The model translates"],
    texte: ["Le modèle affiné reçoit ce texte et le traduit en mina.", "The fine-tuned model receives this text and translates it into Mina."],
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: ["La sortie", "The output"],
    texte: ["La traduction sort en mina : « Meyi suku egbea. »", "The translation comes out in Mina: “Meyi suku egbea.”"],
    humeur: "content",
  },
  {
    titre: ["Ce qui compte", "What matters"],
    texte: [
      "La chaîne fait parole, texte, traduction. Mais c'est le corpus de 360 paires qui rend la traduction possible.",
      "The chain does speech, text, translation. But it's the 360-pair corpus that makes the translation possible.",
    ],
    humeur: "content",
  },
]

const BARRES = Array.from({ length: 30 }, (_, i) => 22 + Math.round(Math.abs(Math.sin(i * 0.62)) * 62 + ((i * 37) % 13)))
const DOTS = Array.from({ length: 360 }, (_, i) => i)

/** Quelle boite de la chaine travaille a cette etape ; -1 : aucune, 9 : toutes. */
const BOITE = [-1, -1, 2, 0, 1, 2, 3, 9]

function Scene({ etape }: { etape: number }) {
  const en = useLangue() === "en"
  const paires = Math.round(useTween(etape >= 1 ? 360 : 0, 2600))
  const fr = useTyping(FRANCAIS, etape >= 4, 30).affiche
  const mina = useTyping(MINA, etape >= 6, 9)
  const actif = BOITE[etape]
  const on = (i: number) => (actif === 9 || actif === i ? "actif" : etape >= 3 ? "vu" : "attente")
  const chaine = etape >= 2

  return (
    <div className="mi">
      <div className="mi__corpus">
        <div className="mi__points" aria-hidden="true" {...foc(etape === 0 || etape === 1)}>
          {DOTS.map((i) => (
            <i key={i} data-on={i < paires ? "1" : "0"} />
          ))}
        </div>
        <div className="mi__stat" {...foc(etape === 7)}>
          <b>{paires}</b>
          <span>{en ? "sentence pairs" : "paires de phrases"}</span>
          <em data-on={etape >= 1 ? "1" : "0"}>{en ? "7 domains · audited by script" : "7 domaines · auditées par script"}</em>
          <em data-on={etape === 0 ? "1" : "0"}>{en ? "no public parallel corpus" : "aucun corpus parallèle public"}</em>
        </div>
      </div>

      <div className="mi__chaine" data-vive={chaine ? "1" : "0"}>
        <div className="mi__boite" data-etat={on(0)} {...foc(etape === 3)}>
          <b>{en ? "Voice" : "Voix"}</b>
          <div className="mi__onde" data-on={etape === 3 ? "1" : "0"}>
            {BARRES.map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${(i % 9) * 70}ms` }} />
            ))}
          </div>
        </div>
        <span className="mi__fleche" data-on={etape === 4 ? "1" : "0"} />
        <div className="mi__boite" data-etat={on(1)} {...foc(etape === 4)}>
          <b>Whisper</b>
          <span>{en ? "speech → text" : "parole → texte"}</span>
        </div>
        <span className="mi__fleche" data-on={etape === 5 ? "1" : "0"} />
        <div className="mi__boite mi__boite--modele" data-etat={etape === 2 ? "actif" : on(2)} {...foc(etape === 2 || etape === 5)}>
          <b>Qwen2-0.5B</b>
          <span>{en ? "QLoRA 4-bit" : "QLoRA 4 bits"}</span>
          <div className="mi__couches">
            <i>{en ? "base model · 4-bit" : "modèle de base · 4 bits"}</i>
            <i data-lora={etape === 2 ? "1" : "0"}>{en ? "LoRA adapter" : "adaptateur LoRA"}</i>
          </div>
        </div>
        <span className="mi__fleche" data-on={etape === 6 ? "1" : "0"} />
        <div className="mi__boite" data-etat={on(3)} {...foc(etape === 6)}>
          <b>{en ? "Output" : "Sortie"}</b>
          <span>{en ? "Mina" : "mina"}</span>
        </div>
      </div>

      <div className="mi__textes">
        <div className="mi__champ" data-on={etape >= 3 ? "1" : "0"}>
          <small>{en ? "Transcription (French)" : "Transcription (français)"}</small>
          <p>{etape === 3 ? (en ? "listening…" : "écoute…") : fr}</p>
        </div>
        <div className="mi__champ mi__champ--sortie" data-on={etape >= 6 ? "1" : "0"} {...foc(etape === 6)}>
          <small>{en ? "Translation (Mina)" : "Traduction (mina)"}</small>
          <p>
            {mina.affiche}
            <i data-ecrit={mina.fini ? "1" : "0"} />
          </p>
        </div>
      </div>
    </div>
  )
}

export function DemoMina(_props: { nu?: boolean } = {}) {
  const en = useLangue() === "en"
  const etapes = useMemo(() => versEtapes(ETAPES, en), [en])
  return (
    <GuideShell
      nom="Mina-Translator"
      sim={en ? "Simulation — no model is executed" : "Simulation — aucun modèle n'est exécuté"}
      etapes={etapes}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
