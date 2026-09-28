"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const FRANCAIS = "Je suis allé à l'école aujourd'hui."
const MINA = "Meyi suku egbea."
const NB_BARRES = 56

const BOITES = [
  { titre: "Whisper", sous: "parole → texte" },
  { titre: "Qwen2-0.5B + LoRA", sous: "QLoRA 4 bits" },
  { titre: "Sortie", sous: "mina" },
]

export function DemoMina({ nu = false }: { nu?: boolean } = {}) {
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
    const tr = el.querySelector<HTMLElement>("[data-tr]")
    const tx = el.querySelector<HTMLElement>("[data-tx]")
    if (tr) tr.textContent = ""
    if (tx) tx.textContent = ""
    anime.utils.set(el.querySelectorAll(".onde i"), { height: 6, background: "var(--input)" })
    anime.utils.set(el.querySelectorAll(".chaine__boite"), { opacity: 0.38 })
    anime.utils.set(el.querySelectorAll("[data-note]"), { opacity: 0 })
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

    const barres = Array.from(el.querySelectorAll<HTMLElement>(".onde i"))
    const boites = Array.from(el.querySelectorAll<HTMLElement>(".chaine__boite"))
    const tr = el.querySelector<HTMLElement>("[data-tr]")!
    const tx = el.querySelector<HTMLElement>("[data-tx]")!
    const note = el.querySelector<HTMLElement>("[data-note]")!

    const ecrire = (cible: HTMLElement, texte: string, debut: number, duree: number) => {
      const etat = { n: 0 }
      t.add(
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

    barres.forEach((b, i) => {
      const h = 8 + Math.round(Math.abs(Math.sin(i * 0.55)) * 30) + Math.round(Math.random() * 8)
      t.add(b, { height: [6, h], background: "var(--accent)", duration: 520, ease: "out(3)" }, 60 + i * 22)
      t.add(b, { background: "oklch(0.5 0.1 250)", duration: 600, ease: "out(2)" }, 900 + i * 8)
    })

    t.add(boites[0], { opacity: 1, duration: 220 }, 300)
    ecrire(tr, FRANCAIS, 700, 1000)
    t.add(boites[1], { opacity: 1, duration: 220 }, 1900)
    ecrire(tx, MINA, 2200, 900)
    t.add(boites[2], { opacity: 1, duration: 220 }, 3150)
    t.add(note, { opacity: [0, 1], y: [8, 0], duration: 420 }, 3350)
    t.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => setEnCours(false) }, 3900)
  }, [reinitialiser])

  // Lancement automatique a l'entree dans le champ de vision : un recruteur ne
  // doit jamais tomber sur un panneau vide en attendant de cliquer. Une seule
  // fois, puis l'observateur se debranche ; le bouton reste pour rejouer.
  useEffect(() => {
    const el = racine.current
    if (!pret || !el || typeof IntersectionObserver === "undefined") return
    let lance = false
    const io = new IntersectionObserver(
      (entrees) => {
        for (const e of entrees) {
          if (e.isIntersecting && !lance) {
            lance = true
            io.disconnect()
            jouer()
          }
        }
      },
      { threshold: 0.3 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [pret, jouer])

  const carte = (
    <div className="demo" ref={racine}>
          <div className="demo__bar">
            <span className="demo__titre">Démonstration</span>
            <span className="demo__sim">Simulation — aucun modèle n&apos;est exécuté</span>
          </div>
          <div className="demo__corps">
            <p className="demo__etiq">Entrée vocale</p>
            <div className="onde">
              {Array.from({ length: NB_BARRES }).map((_, i) => (
                <i key={i} />
              ))}
            </div>

            <p className="demo__etiq">Chaîne de traitement</p>
            <div className="chaine">
              {BOITES.map((b, i) => (
                <div key={b.titre} style={{ display: "contents" }}>
                  <div className="chaine__boite">
                    <b>{b.titre}</b>
                    <span>{b.sous}</span>
                  </div>
                  {i < BOITES.length - 1 ? <div className="chaine__fleche">→</div> : null}
                </div>
              ))}
            </div>

            <p className="demo__etiq">Transcription</p>
            <div className="demo__champ">
              <span data-tr />
            </div>

            <p className="demo__etiq">Traduction</p>
            <div className="demo__champ demo__champ--sortie">
              <span data-tx />
            </div>

            <div className="demo__journal">
              <div data-note>
                <b>corpus d&apos;entraînement</b> 360 paires · 7 domaines ·{" "}
                <i>paire validée par un locuteur</i>
              </div>
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
        <h2 className="rag__h2">Du français au mina</h2>
        <p className="rag__lede mb-8">
          Le mina est parlé dans le sud du Togo. Aucun corpus parallèle public n&apos;existe pour cette langue : tout le
          projet part de là.
        </p>

        {carte}
      </div>
    </section>
  )
}
