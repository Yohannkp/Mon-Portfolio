"use client"

import { useCallback, useEffect, useRef, useState } from "react"

type Ligne = { classe: string; texte?: string; outil?: string; arg?: string; vide?: boolean }

const LIGNES: Ligne[] = [
  { classe: "inv", texte: "selfdev> corrige le bug dans la fonction divide" },
  { classe: "", vide: true },
  { classe: "out", outil: "grep", arg: "divide" },
  { classe: "out fic", texte: "   calc.py:42   def divide(a, b):" },
  { classe: "", vide: true },
  { classe: "out", outil: "read_file", arg: "calc.py — lignes 38 à 48" },
  { classe: "out", texte: "   42  def divide(a, b):" },
  { classe: "out", texte: "   43      return a / b" },
  { classe: "", vide: true },
  { classe: "out", outil: "run_python", arg: "tests.py" },
  { classe: "out ko", texte: "   FAILED test_divide_by_zero — ZeroDivisionError" },
  { classe: "", vide: true },
  { classe: "out", outil: "edit_file", arg: "calc.py" },
  { classe: "out moins", texte: "   -      return a / b" },
  { classe: "out plus", texte: "   +      if b == 0:" },
  { classe: "out plus", texte: '   +          raise ValueError("division par zero")' },
  { classe: "out plus", texte: "   +      return a / b" },
  { classe: "", vide: true },
  { classe: "out", outil: "run_python", arg: "tests.py" },
  { classe: "out ok", texte: "   4 passed in 0.03s" },
  { classe: "", vide: true },
  { classe: "ok", texte: "✓ Corrigé et vérifié. La correction n'est pas proposée : elle est testée." },
]

export function DemoAgent() {
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
    anime.utils.set(el.querySelectorAll(".term__l"), { opacity: 0 })
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
    const t = anime.createTimeline()
    tl.current = t as unknown as { pause: () => void }
    let pos = 0
    Array.from(el.querySelectorAll<HTMLElement>(".term__l")).forEach((ligne, i) => {
      const d = LIGNES[i]
      t.add(ligne, { opacity: [0, 1], x: [-6, 0], duration: 240, ease: "out(3)" }, pos)
      pos += d?.vide ? 90 : d?.outil ? 420 : 230
    })
    t.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => setEnCours(false) }, pos + 300)
  }, [reinitialiser])

  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="rag__kicker">Démonstration</p>
        <h2 className="rag__h2">SELF_DEV_AGENT corrige un bug</h2>
        <p className="rag__lede mb-8">
          Un modèle local de 7 milliards de paramètres n&apos;est pas fiable. Alors l&apos;agent ne propose pas une
          correction : il la teste.
        </p>

        <div className="demo">
          <div className="demo__bar">
            <span className="demo__titre">Démonstration</span>
            <span className="demo__sim">Simulation — aucun agent n&apos;est exécuté</span>
          </div>
          <div className="demo__corps">
            <div className="term" ref={racine}>
              {LIGNES.map((l, i) => (
                <div className={`term__l ${l.classe}`} key={i}>
                  {l.outil ? (
                    <>
                      <span className="term__outil">{l.outil}</span>
                      {l.arg}
                    </>
                  ) : (
                    l.texte ?? " "
                  )}
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
      </div>
    </section>
  )
}
