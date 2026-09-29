"use client"

import { foc, GuideShell, useTween, useTyping, type Etape } from "@/components/sections/demo-guide"

/**
 * Mina-Translator : un corpus fait main, un petit modele affine, et la chaine
 * parole -> texte -> traduction. Les 360 points sont les 360 paires du corpus.
 */

const FRANCAIS = "Je suis allé à l'école aujourd'hui."
const MINA = "Meyi suku egbea."

const ETAPES: Etape[] = [
  {
    titre: "Le mina : peu de données",
    texte: "Le mina est parlé dans le sud du Togo. Il n'existe aucun corpus parallèle public : tout part de là.",
    humeur: "neutre",
  },
  {
    titre: "Un corpus fait main",
    texte: "J'ai constitué 360 paires de phrases, sur 7 domaines, chacune validée par un locuteur.",
    humeur: "concentre",
    attente: 1800,
  },
  {
    titre: "Affiner un petit modèle",
    texte:
      "Avec ces paires, j'affine Qwen2-0.5B en QLoRA 4 bits : le modèle reste petit, seule une couche d'adaptation est apprise.",
    humeur: "curieux",
    attente: 800,
  },
  {
    titre: "Une phrase, à voix haute",
    texte: "Voici la chaîne au travail. Quelqu'un dit une phrase en français : « Je suis allé à l'école aujourd'hui. »",
    humeur: "concentre",
    attente: 800,
  },
  {
    titre: "Whisper écoute",
    texte: "Whisper transforme la parole en texte : la voix devient une phrase écrite.",
    humeur: "concentre",
  },
  {
    titre: "Le modèle traduit",
    texte: "Le modèle affiné reçoit ce texte et le traduit en mina.",
    humeur: "concentre",
    attente: 600,
  },
  {
    titre: "La sortie",
    texte: "La traduction sort en mina : « Meyi suku egbea. »",
    humeur: "content",
  },
  {
    titre: "Ce qui compte",
    texte: "La chaîne fait parole, texte, traduction. Mais c'est le corpus de 360 paires qui rend la traduction possible.",
    humeur: "content",
  },
]

const BARRES = Array.from({ length: 30 }, (_, i) => 22 + Math.round(Math.abs(Math.sin(i * 0.62)) * 62 + ((i * 37) % 13)))
const DOTS = Array.from({ length: 360 }, (_, i) => i)

/** Quelle boite de la chaine travaille a cette etape ; -1 : aucune, 9 : toutes. */
const BOITE = [-1, -1, 2, 0, 1, 2, 3, 9]

function Scene({ etape }: { etape: number }) {
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
          <span>paires de phrases</span>
          <em data-on={etape >= 1 ? "1" : "0"}>7 domaines · chacune validée par un locuteur</em>
          <em data-on={etape === 0 ? "1" : "0"}>aucun corpus parallèle public</em>
        </div>
      </div>

      <div className="mi__chaine" data-vive={chaine ? "1" : "0"}>
        <div className="mi__boite" data-etat={on(0)} {...foc(etape === 3)}>
          <b>Voix</b>
          <div className="mi__onde" data-on={etape === 3 ? "1" : "0"}>
            {BARRES.map((h, i) => (
              <i key={i} style={{ height: `${h}%`, animationDelay: `${(i % 9) * 70}ms` }} />
            ))}
          </div>
        </div>
        <span className="mi__fleche" data-on={etape === 4 ? "1" : "0"} />
        <div className="mi__boite" data-etat={on(1)} {...foc(etape === 4)}>
          <b>Whisper</b>
          <span>parole → texte</span>
        </div>
        <span className="mi__fleche" data-on={etape === 5 ? "1" : "0"} />
        <div className="mi__boite mi__boite--modele" data-etat={etape === 2 ? "actif" : on(2)} {...foc(etape === 2 || etape === 5)}>
          <b>Qwen2-0.5B</b>
          <span>QLoRA 4 bits</span>
          <div className="mi__couches">
            <i>modèle de base · 4 bits</i>
            <i data-lora={etape === 2 ? "1" : "0"}>adaptateur LoRA</i>
          </div>
        </div>
        <span className="mi__fleche" data-on={etape === 6 ? "1" : "0"} />
        <div className="mi__boite" data-etat={on(3)} {...foc(etape === 6)}>
          <b>Sortie</b>
          <span>mina</span>
        </div>
      </div>

      <div className="mi__textes">
        <div className="mi__champ" data-on={etape >= 3 ? "1" : "0"}>
          <small>Transcription (français)</small>
          <p>{etape === 3 ? "écoute…" : fr}</p>
        </div>
        <div className="mi__champ mi__champ--sortie" data-on={etape >= 6 ? "1" : "0"} {...foc(etape === 6)}>
          <small>Traduction (mina)</small>
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
  return (
    <GuideShell
      nom="Mina-Translator"
      sim="Simulation — aucun modèle n'est exécuté"
      etapes={ETAPES}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
