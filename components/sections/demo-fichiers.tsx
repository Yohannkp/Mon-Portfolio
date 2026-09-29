"use client"

import { foc, GuideShell, useSerie, useTween, useTyping, type Etape } from "@/components/sections/demo-guide"

/**
 * RAG-Local sur un dossier : indexer (texte et images), puis retrouver par le sens.
 * La carte de droite est une projection illustrative de l'espace d'embeddings :
 * les positions sont fixees a la main pour la lisibilite, pas calculees.
 */

const QUESTION = "Où sont mes photos prises à la plage ?"

const ETAPES: Etape[] = [
  {
    titre: "Un dossier à explorer",
    texte: "1 247 fichiers : des documents, des tableurs, des PDF… et des photos, qui ne contiennent aucun texte.",
    humeur: "neutre",
  },
  {
    titre: "Lire les textes",
    texte: "L'indexation lit les fichiers un par un et en extrait le texte.",
    humeur: "concentre",
    attente: 1500,
  },
  {
    titre: "Décrire les images",
    texte: "Pour une photo, un modèle de vision local écrit une description. C'est cette description qui sera cherchée.",
    humeur: "curieux",
    attente: 1500,
  },
  {
    titre: "Ne pas refaire",
    texte: "Un fichier inchangé n'est pas réanalysé : archives/2019.pdf est ignoré. L'indexation est incrémentale.",
    humeur: "content",
  },
  {
    titre: "Des points sur une carte",
    texte: "Chaque texte devient un point dans un espace : deux contenus proches par le sens sont proches sur la carte.",
    humeur: "curieux",
    attente: 800,
  },
  {
    titre: "La question",
    texte: "Je demande : « Où sont mes photos prises à la plage ? » Elle devient un point à son tour.",
    humeur: "concentre",
    attente: 800,
  },
  {
    titre: "Les plus proches voisins",
    texte: "On ne compare pas des mots : on cherche les points les plus proches de la question, avec un score de similarité.",
    humeur: "concentre",
    attente: 800,
  },
  {
    titre: "Le résultat",
    texte: "Trois photos sont retrouvées. Aucune ne contient de texte : c'est leur description qui a été cherchée.",
    humeur: "content",
  },
  {
    titre: "100 % local",
    texte: "Modèle de vision, embeddings, index : tout tourne sur la machine. Requêtes réseau sortantes : 0.",
    humeur: "content",
  },
]

type Tuile = { nom: string; ext: string; img?: [string, string]; ignore?: boolean }
const TUILES: Tuile[] = [
  { nom: "notes_reunion.md", ext: "MD" },
  { nom: "contrat_prestation.pdf", ext: "PDF" },
  { nom: "IMG_2831.jpg", ext: "JPG", img: ["#e8a87c", "#3b7ea1"] },
  { nom: "budget_2026.xlsx", ext: "XLS" },
  { nom: "DSC_0147.png", ext: "PNG", img: ["#6fb3d2", "#d9c18a"] },
  { nom: "rapport_annuel.docx", ext: "DOC" },
  { nom: "capture_ecran_plage.webp", ext: "WEBP", img: ["#7fc4a0", "#3f6f5e"] },
  { nom: "archives/2019.pdf", ext: "PDF", ignore: true },
]
const ORDRE_TEXTES = [0, 1, 3, 5]
const ORDRE_IMAGES = [2, 4, 6]

const RESULTATS = [
  {
    nom: "IMG_2831.jpg",
    chemin: "~/Documents/Photos/Vacances 2025/",
    desc: "Une plage au coucher du soleil, deux transats sous un parasol rayé, la mer calme en arrière-plan.",
    score: "0,91",
    c: ["#e8a87c", "#3b7ea1"],
  },
  {
    nom: "DSC_0147.png",
    chemin: "~/Documents/Photos/Lomé/",
    desc: "Vue sur le sable et les vagues, des pirogues colorées tirées sur le rivage, ciel dégagé.",
    score: "0,87",
    c: ["#6fb3d2", "#d9c18a"],
  },
  {
    nom: "capture_ecran_plage.webp",
    chemin: "~/Documents/Inspirations/",
    desc: "Photographie de bord de mer avec palmiers et cabane en bois au premier plan.",
    score: "0,79",
    c: ["#7fc4a0", "#3f6f5e"],
  },
]

/* --- La carte : quatre nuages, et la question au milieu des photos de plage --- */
const hasard = (graine: number) => () => {
  graine = (graine + 0x6d2b79f5) | 0
  let t = Math.imul(graine ^ (graine >>> 15), 1 | graine)
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296
}
const NUAGES = [
  { g: "doc", x: 105, y: 92, r: 36, n: 15, nom: "documents" },
  { g: "xls", x: 320, y: 78, r: 30, n: 11, nom: "tableurs" },
  { g: "autres", x: 98, y: 252, r: 36, n: 12, nom: "autres photos" },
]
const rnd = hasard(11)
const POINTS: { g: string; x: number; y: number }[] = []
NUAGES.forEach((n) => {
  for (let i = 0; i < n.n; i++) {
    const a = rnd() * Math.PI * 2
    const d = Math.sqrt(rnd()) * n.r
    POINTS.push({ g: n.g, x: Math.round((n.x + Math.cos(a) * d) * 10) / 10, y: Math.round((n.y + Math.sin(a) * d * 0.85) * 10) / 10 })
  }
})
const Q = { x: 296, y: 232 }
// Les trois plus proches (les resultats), puis le reste des photos de plage, plus loin.
const VOISINS = [
  { x: 283, y: 226, score: "0,91" },
  { x: 312, y: 246, score: "0,87" },
  { x: 326, y: 224, score: "0,79" },
]
const PLAGE_AUTRES = [
  { x: 262, y: 214 },
  { x: 268, y: 262 },
  { x: 342, y: 258 },
  { x: 306, y: 194 },
  { x: 250, y: 240 },
]

function Tuiles({ etape }: { etape: number }) {
  const k = useSerie(etape === 1 || etape === 2, etape === 1 ? ORDRE_TEXTES.length : ORDRE_IMAGES.length, 620)
  const n = Math.round(useTween(etape === 0 ? 0 : etape === 1 ? 480 : etape === 2 ? 1020 : 1247, 1800))
  const legende = useTyping(RESULTATS[0].desc, etape >= 2, 52).affiche

  const etatTuile = (t: Tuile, i: number) => {
    if (t.ignore) return etape >= 3 ? "ignore" : "attente"
    const liste = t.img ? ORDRE_IMAGES : ORDRE_TEXTES
    const seuil = t.img ? 2 : 1
    const rang = liste.indexOf(i)
    if (etape > seuil) return t.img ? "vision" : "lu"
    if (etape === seuil) return rang < k ? (t.img ? "vision" : "lu") : rang === k ? "cours" : "attente"
    return "attente"
  }
  const LIBELLE: Record<string, string> = {
    attente: "—",
    cours: "lecture…",
    lu: "texte extrait",
    vision: "décrit par le modèle",
    ignore: "inchangé — ignoré",
  }

  return (
    <div className="fi__gauche">
      <div className="fi__tete">
        <span>~/Documents</span>
        <b>{n.toLocaleString("fr-FR")} / 1 247</b>
      </div>
      <div className="fi__barre">
        <i style={{ width: `${(n / 1247) * 100}%` }} />
      </div>
      <div className="fi__tuiles" {...foc(etape <= 1)}>
        {TUILES.map((t, i) => {
          const e = etatTuile(t, i)
          return (
            <div key={t.nom} className="fi__tuile" data-etat={e} {...foc((etape === 1 || etape === 2) && e === "cours")} {...(etape === 3 && t.ignore ? foc(true) : {})}>
              <span
                className="fi__vign"
                style={t.img ? { background: `linear-gradient(135deg, ${t.img[0]}, ${t.img[1]})` } : undefined}
              >
                {t.ext}
              </span>
              <span className="fi__nom">{t.nom}</span>
              <span className="fi__etat">{LIBELLE[e]}</span>
            </div>
          )
        })}
      </div>
      <div className="fi__legende" data-on={etape >= 2 ? "1" : "0"}>
        <p>Description écrite localement · IMG_2831.jpg</p>
        <span>{legende}</span>
      </div>
    </div>
  )
}

function Resultats({ etape }: { etape: number }) {
  return (
    <div className="fi__gauche fi__gauche--res" key="res">
      <div className="fi__tete">
        <span>Fichiers retrouvés</span>
        <b>3 sur 1 247</b>
      </div>
      <div className="fi__res">
        {RESULTATS.map((r, i) => (
          <div key={r.nom} className="fi__fic" style={{ animationDelay: `${i * 140}ms` }} {...foc(etape === 7 && i === 0)}>
            <span className="fi__vign fi__vign--g" style={{ background: `linear-gradient(135deg, ${r.c[0]}, ${r.c[1]})` }} />
            <div>
              <b>{r.nom}</b>
              <em>{r.chemin}</em>
              <p>{r.desc}</p>
            </div>
            <span className="fi__score">{r.score}</span>
          </div>
        ))}
      </div>
      <div className="fi__local" data-on={etape >= 8 ? "1" : "0"} {...foc(etape === 8)}>
        <div>
          <span>modèle de vision</span>
          <b>qwen3-vl:4b · local</b>
        </div>
        <div>
          <span>embeddings</span>
          <b>nomic-embed-text · local</b>
        </div>
        <div>
          <span>requêtes réseau sortantes</span>
          <b className="fi__zero">0</b>
        </div>
      </div>
    </div>
  )
}

function Carte({ etape }: { etape: number }) {
  const question = useTyping(QUESTION, etape >= 5, 34).affiche
  const apparu = etape >= 4
  // La camera s'approche de la question : c'est la que se joue la recherche.
  const zoom = etape === 6 || etape === 7
  // La question est ramenee au centre de la carte, puis on grossit autour d'elle.
  const camera = zoom ? `translate(210px, 160px) scale(1.75) translate(${-Q.x}px, ${-Q.y}px)` : "none"
  return (
    <div className="fi__droite">
      <div className="fi__tete">
        <span>Espace de recherche</span>
        <b>nomic-embed-text</b>
      </div>
      <div className="fi__champ" data-on={etape >= 5 ? "1" : "0"} {...foc(etape === 5)}>
        <span>{question}</span>
        <i data-ecrit={question.length >= QUESTION.length ? "1" : "0"} />
      </div>
      <svg className="fi__svg" viewBox="0 0 420 320" role="img" aria-label="Carte des documents par similarité de sens" {...foc(etape === 4)}>
        <g className="fi__cam" style={{ transform: camera }}>
        {NUAGES.map((n) => (
          <g key={n.g} className="fi__nuage" data-on={apparu ? "1" : "0"}>
            <ellipse cx={n.x} cy={n.y} rx={n.r + 16} ry={(n.r + 16) * 0.8} />
            <text x={n.x} y={n.y - n.r * 0.85 - 14}>{n.nom}</text>
          </g>
        ))}
        <g className="fi__nuage fi__nuage--plage" data-on={apparu ? "1" : "0"}>
          <ellipse cx={300} cy={236} rx={62} ry={50} />
          <text x={300} y={168}>photos de plage</text>
        </g>

        {POINTS.map((p, i) => (
          <circle key={i} className="fi__pt" data-g={p.g} data-on={apparu ? "1" : "0"} data-dim={etape >= 7 ? "1" : "0"} cx={p.x} cy={p.y} r={3.6} style={{ transitionDelay: `${i * 22}ms` }} />
        ))}
        {PLAGE_AUTRES.map((p, i) => (
          <circle key={`pa${i}`} className="fi__pt" data-g="plage" data-on={apparu ? "1" : "0"} data-dim={etape >= 7 ? "1" : "0"} cx={p.x} cy={p.y} r={3.6} style={{ transitionDelay: `${(40 + i) * 22}ms` }} />
        ))}
        {VOISINS.map((p, i) => (
          <circle key={`v${i}`} className="fi__pt fi__pt--voisin" data-g="plage" data-on={apparu ? "1" : "0"} data-choisi={etape >= 6 ? "1" : "0"} cx={p.x} cy={p.y} r={4.6} style={{ transitionDelay: `${(46 + i) * 22}ms` }} />
        ))}

        {VOISINS.map((p, i) => (
          <g key={`r${i}`} className="fi__rayon" data-on={etape >= 6 ? "1" : "0"} style={{ transitionDelay: `${i * 180}ms` }}>
            <line x1={Q.x} y1={Q.y} x2={p.x} y2={p.y} pathLength={1} />
            <text x={p.x + (i === 0 ? -13 : 11)} y={p.y + (i === 1 ? 17 : -11)} textAnchor={i === 0 ? "end" : "start"}>{p.score}</text>
          </g>
        ))}

        <g className="fi__question" data-on={etape >= 5 ? "1" : "0"} {...foc(etape === 6)}>
          <circle className="fi__onde" cx={Q.x} cy={Q.y} r={9} />
          <circle className="fi__onde fi__onde--2" cx={Q.x} cy={Q.y} r={9} />
          <path d={`M ${Q.x} ${Q.y - 8} L ${Q.x + 8} ${Q.y} L ${Q.x} ${Q.y + 8} L ${Q.x - 8} ${Q.y} Z`} />
        </g>
        </g>
      </svg>
    </div>
  )
}

function Scene({ etape }: { etape: number }) {
  return (
    <div className="fi">
      {etape >= 7 ? <Resultats etape={etape} /> : <Tuiles etape={etape} />}
      <Carte etape={etape} />
    </div>
  )
}

export function DemoFichiers(_props: { nu?: boolean } = {}) {
  return (
    <GuideShell
      nom="RAG-Local"
      sim="Simulation — aucun modèle n'est exécuté"
      etapes={ETAPES}
      scene={({ etape }) => <Scene etape={etape} />}
    />
  )
}
