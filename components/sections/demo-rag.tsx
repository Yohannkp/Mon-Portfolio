"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const QUESTION = "Quel est le délai de rétractation dans le contrat ?"
const REPONSE =
  "Le délai de rétractation est de quatorze jours calendaires à compter de la signature, sans justification ni pénalité. "
const GARDES = [2, 7, 13, 19, 24, 31]
const NB_CANDIDATS = 40

const ETAPES = [
  { titre: "Réécriture", sous: "question autonome" },
  { titre: "Recherche", sous: "vectoriel + BM25" },
  { titre: "Fusion RRF", sous: "k = 60" },
  { titre: "Reranking", sous: "40 → 6" },
]

const JOURNAL = [
  { cle: "modèle de chat", valeur: "qwen3:8b", note: "local" },
  { cle: "embeddings", valeur: "nomic-embed-text", note: "local" },
  { cle: "requêtes réseau sortantes", valeur: "", note: "0" },
]

type Anime = typeof import("animejs")

export function DemoRag({ nu = false }: { nu?: boolean } = {}) {
  const racine = useRef<HTMLDivElement>(null)
  const lib = useRef<Anime | null>(null)
  const timeline = useRef<{ pause: () => void } | null>(null)
  const [enCours, setEnCours] = useState(false)
  const [pret, setPret] = useState(false)

  useEffect(() => {
    let annule = false
    import("animejs").then((A) => {
      if (annule) return
      lib.current = A
      setPret(true)
      reinitialiser(A)
    })
    return () => {
      annule = true
      timeline.current?.pause()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const reinitialiser = useCallback((A?: Anime | null) => {
    const anime = A ?? lib.current
    const el = racine.current
    if (!anime || !el) return
    timeline.current?.pause()
    timeline.current = null

    const q = el.querySelector<HTMLElement>("[data-q]")
    const rep = el.querySelector<HTMLElement>("[data-rep]")
    if (q) q.textContent = ""
    if (rep) rep.innerHTML = ""

    anime.utils.set(el.querySelectorAll("[data-curseur]"), { opacity: 0 })
    anime.utils.set(el.querySelectorAll("[data-rep], [data-src]"), { opacity: 0 })
    anime.utils.set(el.querySelectorAll("[data-ligne]"), { opacity: 0 })
    anime.utils.set(el.querySelectorAll(".demo__morceau"), { opacity: 0, scaleY: 1 })
    el.querySelectorAll(".demo__morceau").forEach((m) => m.classList.remove("garde", "rejete"))
    el.querySelectorAll<HTMLElement>(".demo__etape").forEach((e) => {
      anime.utils.set(e, { opacity: 0.4 })
      anime.utils.set(e.querySelector("i"), { width: "0%" })
    })
    setEnCours(false)
  }, [])

  const jouer = useCallback(() => {
    const anime = lib.current
    const el = racine.current
    if (!anime || !el) return
    reinitialiser(anime)
    setEnCours(true)

    const { createTimeline, stagger, animate } = anime
    const q = el.querySelector<HTMLElement>("[data-q]")!
    const curseur = el.querySelector<HTMLElement>("[data-curseur]")!
    const rep = el.querySelector<HTMLElement>("[data-rep]")!
    const src = el.querySelector<HTMLElement>("[data-src]")!
    const etapes = Array.from(el.querySelectorAll<HTMLElement>(".demo__etape"))
    const morceaux = Array.from(el.querySelectorAll<HTMLElement>(".demo__morceau"))
    const lignes = Array.from(el.querySelectorAll<HTMLElement>("[data-ligne]"))

    const tl = createTimeline({ defaults: { ease: "out(3)" } })
    timeline.current = tl as unknown as { pause: () => void }

    const ecrire = (cible: HTMLElement, texte: string, debut: number, duree: number) => {
      const etat = { n: 0 }
      tl.add(
        etat,
        {
          n: texte.length,
          duration: duree,
          ease: "linear",
          onUpdate: () => {
            cible.textContent = texte.slice(0, Math.round(etat.n))
          },
        },
        debut,
      )
    }

    tl.add(curseur, { opacity: [0, 1], duration: 120 }, 0)
    ecrire(q, QUESTION, 200, 1100)
    tl.add(curseur, { opacity: 0, duration: 200 }, 1400)

    etapes.forEach((e, i) => {
      const t = 1500 + i * 700
      tl.add(e, { opacity: 1, duration: 220 }, t)
      tl.add(e.querySelector("i"), { width: "100%", duration: 560, ease: "inOut(2)" }, t + 40)
    })

    tl.add(morceaux, { opacity: [0, 1], scaleY: [0.55, 1], duration: 420, delay: stagger(14) }, 2250)

    tl.add(
      { v: 0 },
      {
        v: 1,
        duration: 10,
        onComplete: () => {
          morceaux.forEach((m, i) => m.classList.add(GARDES.includes(i) ? "garde" : "rejete"))
        },
      },
      4400,
    )
    tl.add(
      morceaux.filter((_, i) => GARDES.includes(i)),
      { scaleY: [1, 1.28, 1], duration: 520 },
      4420,
    )

    tl.add(rep, { opacity: [0, 1], duration: 260 }, 4900)
    ecrire(rep, REPONSE, 5000, 1500)
    tl.add(
      { v: 0 },
      {
        v: 1,
        duration: 10,
        onComplete: () => {
          rep.textContent = REPONSE
          const b = document.createElement("button")
          b.className = "demo__cit"
          b.textContent = "1"
          b.title = "Ouvrir la source"
          b.addEventListener("click", () => animate(src, { opacity: 1, y: 0, duration: 300 }))
          rep.appendChild(b)
          animate(b, { opacity: [0, 1], scale: [0.6, 1], duration: 420, ease: "out(4)" })
        },
      },
      6550,
    )

    tl.add(src, { opacity: [0, 1], y: [10, 0], duration: 480 }, 7000)
    tl.add(lignes, { opacity: [0, 1], x: [-8, 0], duration: 380, delay: stagger(160) }, 7400)
    tl.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => setEnCours(false) }, 8200)
  }, [reinitialiser])

  const carte = (
    <div className="demo" ref={racine}>
          <div className="demo__bar">
            <span className="demo__titre">Démonstration</span>
            <span className="demo__sim">Simulation — aucun modèle n&apos;est exécuté</span>
          </div>

          <div className="demo__corps">
            <p className="demo__etiq">Question posée</p>
            <div className="demo__champ">
              <span data-q />
              <span className="demo__curseur" data-curseur />
            </div>

            <p className="demo__etiq">Traitement</p>
            <div className="demo__etapes">
              {ETAPES.map((e) => (
                <div className="demo__etape" key={e.titre}>
                  <b>{e.titre}</b>
                  <span>{e.sous}</span>
                  <div className="demo__jauge">
                    <i />
                  </div>
                </div>
              ))}
            </div>
            <div className="demo__morceaux">
              {Array.from({ length: NB_CANDIDATS }).map((_, i) => (
                <div className={`demo__morceau ${i < 20 ? "vect" : "bm"}`} key={i} />
              ))}
            </div>

            <p className="demo__etiq">Réponse</p>
            <div className="demo__reponse" data-rep />
            <div className="demo__source" data-src>
              <div className="demo__source-tete">contrat_prestation.pdf — page 12</div>
              <div className="demo__source-corps">
                […] Le Client dispose d&apos;un délai de rétractation de{" "}
                <span className="demo__surligne">quatorze (14) jours calendaires</span> à compter de la signature du
                présent contrat, sans avoir à motiver sa décision ni à supporter de pénalité. […]
              </div>
            </div>

            <div className="demo__journal">
              {JOURNAL.map((j) => (
                <div data-ligne key={j.cle}>
                  <b>{j.cle}</b> {j.valeur} <i>{j.note}</i>
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
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="rag__kicker">Démonstration</p>
        <h2 className="rag__h2">Voir RAG-Local à l&apos;œuvre</h2>
        <p className="rag__lede mb-8">
          Un exemple concret, du moment où la question est posée jusqu&apos;à la réponse citée.
        </p>

        {carte}
      </div>
    </section>
  )
}
