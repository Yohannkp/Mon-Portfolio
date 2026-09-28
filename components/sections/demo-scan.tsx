"use client"

import { useCallback, useEffect, useRef, useState } from "react"

const QUESTION = "Quelle est la durée du préavis de résiliation ?"
const REPONSE =
  "Le préavis de résiliation est de trois mois, à compter de la réception de la lettre recommandée. "

const LIGNES: { t: string; cle?: boolean; surligne?: string }[] = [
  { t: "ARTICLE 7 — RÉSILIATION", cle: true },
  { t: "Chacune des parties peut résilier le présent contrat" },
  { t: "par lettre recommandée avec accusé de réception," },
  { t: "sous réserve de respecter un préavis de" },
  { t: " à compter de la réception.", cle: true, surligne: "trois (3) mois" },
  { t: "Toute résiliation intervenant sans ce préavis" },
  { t: "ouvre droit à une indemnité compensatrice." },
]

const BANDES = [
  { c: "titre" }, { c: "" }, { c: "moyen" }, { c: "" }, { c: "court" },
  { c: "cle", w: "88%", mt: true }, { c: "cle", w: "64%" },
  { c: "", mt: true }, { c: "moyen" }, { c: "court" }, { c: "" }, { c: "moyen" },
]

export function DemoScan({ nu = false }: { nu?: boolean } = {}) {
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
    const rep = el.querySelector<HTMLElement>("[data-rep]")
    const avant = el.querySelector<HTMLElement>("[data-avant]")
    if (q) q.textContent = ""
    if (rep) rep.innerHTML = ""
    if (avant) avant.innerHTML = 'texte extractible : <b>aucun</b>'
    anime.utils.set(el.querySelectorAll(".scan__l, [data-rep], [data-curseur], [data-j]"), { opacity: 0 })
    anime.utils.set(el.querySelectorAll("[data-scan]"), { opacity: 0, top: -60 })
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

    const page = el.querySelector<HTMLElement>(".page")!
    const scan = el.querySelector<HTMLElement>("[data-scan]")!
    const lignes = el.querySelectorAll<HTMLElement>(".scan__l")
    const avant = el.querySelector<HTMLElement>("[data-avant]")!
    const q = el.querySelector<HTMLElement>("[data-q]")!
    const curseur = el.querySelector<HTMLElement>("[data-curseur]")!
    const rep = el.querySelector<HTMLElement>("[data-rep]")!
    const journal = el.querySelectorAll<HTMLElement>("[data-j]")
    const h = page.offsetHeight

    const ecrire = (cible: HTMLElement, texte: string, debut: number, duree: number) => {
      const e = { n: 0 }
      t.add(
        e,
        { n: texte.length, duration: duree, ease: "linear", onUpdate: () => (cible.textContent = texte.slice(0, Math.round(e.n))) },
        debut,
      )
    }

    t.add(scan, { opacity: [0, 1], duration: 200 }, 0)
    t.add(scan, { top: [-60, h], duration: 1800, ease: "inOut(2)" }, 150)
    t.add(scan, { opacity: 0, duration: 250 }, 1900)
    t.add(lignes, { opacity: [0, 1], x: [-8, 0], duration: 340, delay: anime.stagger(190) }, 700)
    t.add(
      { v: 0 },
      {
        v: 1,
        duration: 10,
        onComplete: () => {
          avant.innerHTML = 'transcrit par le modèle : <b class="violet">412 caractères</b>'
        },
      },
      2100,
    )
    t.add(curseur, { opacity: [0, 1], duration: 120 }, 2500)
    ecrire(q, QUESTION, 2600, 1000)
    t.add(curseur, { opacity: 0, duration: 200 }, 3700)
    t.add(rep, { opacity: [0, 1], duration: 260 }, 3900)
    ecrire(rep, REPONSE, 4000, 1300)
    t.add(
      { v: 0 },
      {
        v: 1,
        duration: 10,
        onComplete: () => {
          rep.textContent = REPONSE
          const b = document.createElement("span")
          b.className = "demo__cit"
          b.textContent = "1"
          rep.appendChild(b)
          anime.animate(b, { opacity: [0, 1], scale: [0.6, 1], duration: 380, ease: "out(4)" })
        },
      },
      5350,
    )
    t.add(journal, { opacity: [0, 1], x: [-8, 0], duration: 340, delay: anime.stagger(150) }, 5600)
    t.add({ v: 0 }, { v: 1, duration: 10, onComplete: () => setEnCours(false) }, 6400)
  }, [reinitialiser])

  const carte = (
    <div className="demo" ref={racine}>
      <div className="demo__bar">
        <span className="demo__titre">Démonstration</span>
        <span className="demo__sim">Simulation — aucun modèle n&apos;est exécuté</span>
      </div>
      <div className="demo__corps">
        <div className="colonnes">
          <div>
            <p className="demo__etiq">Page 4 du PDF</p>
            <div className="page">
              {BANDES.map((b, i) => (
                <div
                  className={`page__bande ${b.c}`}
                  key={i}
                  style={{ width: b.w, marginTop: b.mt ? "0.85rem" : undefined }}
                />
              ))}
              <div className="page__grain" />
              <div className="page__scan" data-scan />
              <div className="page__etiq">image · 0 caractère</div>
            </div>
            <p className="avant" data-avant>
              texte extractible : <b>aucun</b>
            </p>
          </div>

          <div>
            <p className="demo__etiq">Transcription par le modèle de vision</p>
            <div className="zone">
              {LIGNES.map((l, i) => (
                <div className={`scan__l ${l.cle ? "cle" : ""}`} key={i}>
                  {l.surligne ? <span className="demo__surligne">{l.surligne}</span> : null}
                  {l.t}
                </div>
              ))}
            </div>
          </div>
        </div>

        <p className="demo__etiq">Question posée ensuite</p>
        <div className="demo__champ">
          <span data-q />
          <span className="demo__curseur" data-curseur />
        </div>

        <p className="demo__etiq">Réponse</p>
        <div className="demo__reponse" data-rep />

        <div className="demo__journal">
          <div data-j>
            <b>modèle de vision</b> qwen3-vl:4b · <i>local</i>
          </div>
          <div data-j>
            <b>page source</b> <em className="violet">cliquable — ouvre la page 4 du PDF d&apos;origine</em>
          </div>
          <div data-j>
            <b>requêtes réseau sortantes</b> <i>0</i>
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
      <div className="mx-auto max-w-4xl px-6 py-24">
        <p className="rag__kicker">Démonstration</p>
        <h2 className="rag__h2">Un document scanné devient cherchable</h2>
        <p className="rag__lede mb-8">
          Une page scannée est une image : aucun texte à extraire, invisible pour une recherche classique.
        </p>
        {carte}
      </div>
    </section>
  )
}
