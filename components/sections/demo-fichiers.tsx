"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const QUESTION = "Où sont mes photos prises à la plage ?"

const FICHIERS = [
  {
    nom: "IMG_2831.jpg",
    chemin: "~/Documents/Photos/Vacances 2025/",
    date: "12 août 2025",
    desc: "Une plage au coucher du soleil, deux transats sous un parasol rayé, la mer calme en arrière-plan.",
    score: "0,91",
    c1: "#e8a87c",
    c2: "#3b7ea1",
    ext: "JPG",
  },
  {
    nom: "DSC_0147.png",
    chemin: "~/Documents/Photos/Lomé/",
    date: "3 janv. 2026",
    desc: "Vue sur le sable et les vagues, des pirogues colorées tirées sur le rivage, ciel dégagé.",
    score: "0,87",
    c1: "#6fb3d2",
    c2: "#d9c18a",
    ext: "PNG",
  },
  {
    nom: "capture_ecran_plage.webp",
    chemin: "~/Documents/Inspirations/",
    date: "28 mai 2025",
    desc: "Photographie de bord de mer avec palmiers et cabane en bois au premier plan.",
    score: "0,79",
    c1: "#7fc4a0",
    c2: "#3f6f5e",
    ext: "WEBP",
  },
]

const ETAPES = [
  "Lecture de notes_reunion.md",
  "Lecture de contrat_prestation.pdf",
  "Description de l'image IMG_2831.jpg",
  "Lecture de budget_2026.xlsx",
  "Description de l'image DSC_0147.png",
  "Lecture de rapport_annuel.docx",
  "Description de l'image capture_ecran_plage.webp",
  "Fichier inchangé — ignoré : archives/2019.pdf",
  "Indexation terminée",
]

const JOURNAL = [
  { cle: "modèle de vision", val: "qwen3-vl:4b", note: "local" },
  { cle: "embeddings", val: "nomic-embed-text", note: "local" },
  { cle: "indexation", val: "incrémentale — un fichier inchangé n'est pas réanalysé", note: "" },
  { cle: "requêtes réseau sortantes", val: "", note: "0" },
]

export function DemoFichiers({ nu = false }: { nu?: boolean } = {}) {
  const racine = useRef<HTMLDivElement>(null)
  const lib = useRef<typeof import("animejs") | null>(null)
  const tl = useRef<{ pause: () => void } | null>(null)
  const [pret, setPret] = useState(false)
  const [enCours, setEnCours] = useState(false)

  const reinitialiser = useCallback((A?: typeof import("animejs") | null) => {
    const anime = A ?? lib.current
    const el = racine.current
    if (!anime || !el) return
    tl.current?.pause()
    tl.current = null
    const q = el.querySelector<HTMLElement>("[data-q]")
    const ligne = el.querySelector<HTMLElement>("[data-ligne-idx]")
    const cpt = el.querySelector<HTMLElement>("[data-cpt]")
    const barre = el.querySelector<HTMLElement>("[data-barre]")
    if (q) q.textContent = ""
    if (ligne) ligne.textContent = "en attente"
    if (cpt) cpt.textContent = "0 / 1 247 fichiers"
    if (barre) barre.style.width = "0%"
    anime.utils.set(el.querySelectorAll("[data-curseur], .fic, .note-vision, [data-j]"), { opacity: 0 })
    setEnCours(false)
  }, [])

  useEffect(() => {
    let annule = false
    import("animejs")
      .then((A) => {
        if (annule) return
        lib.current = A
        setPret(true)
        reinitialiser(A)
      })
      .catch(() => setPret(false))
    return () => {
      annule = true
      tl.current?.pause()
    }
  }, [reinitialiser])

  const jouer = useCallback(() => {
    const anime = lib.current
    const el = racine.current
    if (!anime || !el) return
    reinitialiser(anime)
    setEnCours(true)

    const t = anime.createTimeline({ defaults: { ease: "out(3)" } })
    tl.current = t as unknown as { pause: () => void }

    const q = el.querySelector<HTMLElement>("[data-q]")!
    const curseur = el.querySelector<HTMLElement>("[data-curseur]")!
    const ligne = el.querySelector<HTMLElement>("[data-ligne-idx]")!
    const cpt = el.querySelector<HTMLElement>("[data-cpt]")!
    const barre = el.querySelector<HTMLElement>("[data-barre]")!
    const fics = el.querySelectorAll<HTMLElement>(".fic")
    const note = el.querySelector<HTMLElement>(".note-vision")!
    const journal = el.querySelectorAll<HTMLElement>("[data-j]")

    const etat = { p: 0 }
    t.add(
      etat,
      {
        p: 100,
        duration: 2600,
        ease: "inOut(2)",
        onUpdate: () => {
          barre.style.width = `${etat.p}%`
          cpt.textContent = `${Math.round(etat.p * 12.47)} / 1 247 fichiers`
        },
      },
      0,
    )
    ETAPES.forEach((texte, i) => {
      t.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => (ligne.textContent = texte) }, 60 + i * 290)
    })

    t.add(curseur, { opacity: [0, 1], duration: 120 }, 2750)
    const e = { n: 0 }
    t.add(
      e,
      {
        n: QUESTION.length,
        duration: 1000,
        ease: "linear",
        onUpdate: () => (q.textContent = QUESTION.slice(0, Math.round(e.n))),
      },
      2850,
    )
    t.add(curseur, { opacity: 0, duration: 200 }, 3950)
    t.add(fics, { opacity: [0, 1], y: [14, 0], duration: 520, delay: anime.stagger(180) }, 4150)
    t.add(note, { opacity: [0, 1], y: [10, 0], duration: 480 }, 5100)
    t.add(journal, { opacity: [0, 1], x: [-8, 0], duration: 340, delay: anime.stagger(150) }, 5500)
    t.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => setEnCours(false) }, 6400)
  }, [reinitialiser])

  const carte = (
    <div className="demo" ref={racine}>
      <div className="demo__bar">
        <span className="demo__titre">Démonstration</span>
        <span className="demo__sim">Simulation — aucun modèle n&apos;est exécuté</span>
      </div>
      <div className="demo__corps">
        <p className="demo__etiq">Indexation du dossier</p>
        <div className="idx">
          <div className="idx__tete">
            <span>~/Documents</span>
            <b data-cpt>0 / 1 247 fichiers</b>
          </div>
          <div className="idx__barre">
            <i data-barre />
          </div>
          <div className="idx__ligne" data-ligne-idx>
            en attente
          </div>
        </div>

        <p className="demo__etiq">Question</p>
        <div className="demo__champ">
          <span data-q />
          <span className="demo__curseur" data-curseur />
        </div>

        <p className="demo__etiq">Fichiers retrouvés</p>
        <div className="res">
          {FICHIERS.map((f) => (
            <div className="fic" key={f.nom}>
              <div className="vign" style={{ background: `linear-gradient(135deg, ${f.c1}, ${f.c2})` }}>
                <span>{f.ext}</span>
              </div>
              <div>
                <div className="fic__nom">{f.nom}</div>
                <div className="fic__chemin">
                  {f.chemin} · {f.date}
                </div>
                <div className="fic__desc">
                  <b>description générée en local :</b> {f.desc}
                </div>
              </div>
              <div className="fic__score">
                pertinence<b>{f.score}</b>
              </div>
            </div>
          ))}
        </div>

        <div className="note-vision">
          <b>Ce qui vient de se passer</b>
          <span>
            Ces trois fichiers sont des <strong>images</strong>. Elles ne contiennent aucun texte, aucun nom parlant,
            aucune métadonnée exploitable. Elles ont été décrites par un modèle de vision exécuté sur la machine, et ce
            sont ces descriptions qui ont été indexées — puis retrouvées par la question.
          </span>
        </div>

        <div className="demo__journal">
          {JOURNAL.map((j) => (
            <div data-j key={j.cle}>
              <b>{j.cle}</b> {j.val} {j.note ? <i>{j.note}</i> : null}
            </div>
          ))}
        </div>

        <div className="demo__actions">
          <button className="demo__bouton" onClick={jouer} disabled={!pret || enCours}>
            Tester
          </button>
          <button className="demo__bouton demo__bouton--fantome" onClick={() => reinitialiser()} disabled={!pret}>
            Réinitialiser
          </button>
        </div>
      </div>
    </div>
  )

  if (nu) return carte

  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="rag__kicker">Démonstration</p>
        <h2 className="rag__h2">Question sur mon ordinateur</h2>
        <p className="rag__lede mb-8">
          RAG-Local ne se limite pas aux documents importés : il indexe un dossier de la machine et répond en langage
          naturel — y compris sur des images, qui n&apos;ont pourtant aucun texte.
        </p>
        {carte}
      </div>
    </section>
  )
}
