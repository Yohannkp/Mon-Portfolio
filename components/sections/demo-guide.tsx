"use client"

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react"
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from "lucide-react"

/**
 * Le moteur des visites guidées.
 *
 * Une simulation n'est plus une timeline qui file toute seule : c'est une suite
 * d'etapes que le robot explique l'une apres l'autre. Chaque etape a un titre, une
 * phrase que le robot ecrit a une vitesse lisible, puis un temps de lecture avant
 * la suivante. Le visiteur garde la main : pause, precedent, suivant, saut direct
 * a une etape, fleches du clavier.
 *
 * Le rendu de chaque scene est une FONCTION de l'etape courante, jamais une suite
 * d'effets : on peut donc revenir en arriere, sauter, ou rejouer sans jamais
 * laisser la scene dans un etat incoherent.
 *
 * Le robot (components/objet-3d.tsx) lit ces attributs sur la racine :
 *   data-guide  data-etape  data-total  data-humeur  data-fin
 * ainsi que l'element marque data-guide-focus (ce que l'etape montre), et vient
 * se poser sur [data-guide-slot], dans la colonne du guide.
 */

export type Humeur = "neutre" | "concentre" | "content" | "curieux"

export type Etape = {
  titre: string
  texte: string
  humeur?: Humeur
  /** Temps de lecture supplementaire, en ms, quand l'etape montre beaucoup de choses. */
  attente?: number
}

const reduitMouvement = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches

/** Texte qui s'ecrit. `fini` n'est vrai que pour CE texte : jamais un reste de l'etape precedente. */
export function useTyping(texte: string, actif: boolean, cps = 30) {
  const [etat, setEtat] = useState({ texte: "", n: 0 })
  useEffect(() => {
    if (!actif) {
      setEtat({ texte, n: 0 })
      return
    }
    if (reduitMouvement()) {
      setEtat({ texte, n: texte.length })
      return
    }
    setEtat({ texte, n: 0 })
    const debut = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const n = Math.min(texte.length, Math.floor(((t - debut) / 1000) * cps))
      setEtat({ texte, n })
      if (n < texte.length) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [texte, actif, cps])
  const n = etat.texte === texte ? etat.n : 0
  return { affiche: texte.slice(0, n), fini: actif && n >= texte.length }
}

/** Un nombre qui rejoint sa cible en douceur, dans les deux sens (on peut reculer). */
export function useTween(cible: number, duree = 1000) {
  const [v, setV] = useState(cible)
  const courant = useRef(cible)
  useEffect(() => {
    if (reduitMouvement()) {
      courant.current = cible
      setV(cible)
      return
    }
    const depart = courant.current
    const t0 = performance.now()
    let raf = 0
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duree)
      const e = 1 - Math.pow(1 - k, 3)
      courant.current = depart + (cible - depart) * e
      setV(courant.current)
      if (k < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [cible, duree])
  return v
}

/** Compte de 0 a `max` toutes les `pas` ms tant que `actif` ; retombe a 0 sinon. Sert a derouler une serie. */
export function useSerie(actif: boolean, max: number, pas: number, delai = 350) {
  const [k, setK] = useState(0)
  useEffect(() => {
    if (!actif) {
      setK(0)
      return
    }
    if (reduitMouvement()) {
      setK(max)
      return
    }
    setK(0)
    let i = 0
    let id = 0
    const suite = () => {
      i += 1
      setK(i)
      if (i < max) id = window.setTimeout(suite, pas)
    }
    id = window.setTimeout(suite, delai)
    return () => window.clearTimeout(id)
  }, [actif, max, pas, delai])
  return k
}

type Scene = (s: { etape: number; fini: boolean }) => ReactNode

export function GuideShell({
  nom,
  sim,
  etapes,
  scene,
}: {
  nom: string
  sim: string
  etapes: Etape[]
  scene: Scene
}) {
  const racine = useRef<HTMLDivElement>(null)
  const [etape, setEtape] = useState(0)
  const [auto, setAuto] = useState(true)
  const [demarre, setDemarre] = useState(false)
  const [visible, setVisible] = useState(false)

  const n = etapes.length
  const e = etapes[etape]
  const dernier = etape === n - 1
  const { affiche, fini } = useTyping(e.texte, demarre)
  // Le temps de lecture depend de la longueur : on ne presse jamais une phrase longue.
  const attente = 1300 + e.texte.length * 24 + (e.attente ?? 0)
  const enMarche = auto && visible && demarre

  // La visite demarre quand on la voit, et se met en pause quand on la quitte des yeux.
  useEffect(() => {
    const el = racine.current
    if (!el || typeof IntersectionObserver === "undefined") {
      setDemarre(true)
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([entree]) => {
        setVisible(entree.isIntersecting)
        if (entree.isIntersecting && entree.intersectionRatio >= 0.35) setDemarre(true)
      },
      { threshold: [0, 0.35] },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  // Etape suivante, une fois la phrase ecrite ET le temps de lecture ecoule.
  useEffect(() => {
    if (!enMarche || !fini || dernier) return
    const id = window.setTimeout(() => setEtape((x) => Math.min(x + 1, n - 1)), attente)
    return () => window.clearTimeout(id)
  }, [enMarche, fini, dernier, etape, attente, n])

  const aller = (i: number) => setEtape(Math.max(0, Math.min(n - 1, i)))
  const surTouche = (ev: KeyboardEvent) => {
    if (ev.key === "ArrowRight") {
      ev.preventDefault()
      aller(etape + 1)
    } else if (ev.key === "ArrowLeft") {
      ev.preventDefault()
      aller(etape - 1)
    }
  }

  return (
    <div
      ref={racine}
      className="demo gd"
      data-guide="1"
      data-etape={etape}
      data-total={n}
      data-humeur={e.humeur ?? "neutre"}
      data-fin={dernier && fini ? "1" : "0"}
      onKeyDown={surTouche}
    >
      <div className="demo__bar">
        <span className="demo__titre">Visite guidée · {nom}</span>
        <span className="demo__sim">{sim}</span>
      </div>

      <div className="gd__corps">
        <aside className="gd__guide" aria-label="Le guide">
          {/* Le robot vient se poser ici (voir objet-3d.tsx) : cet espace reste vide dans la page. */}
          <div className="gd__slot" data-guide-slot aria-hidden="true" />
          <p className="gd__compteur">
            Étape {etape + 1} / {n}
          </p>
          <h4 className="gd__titre">{e.titre}</h4>
          <p className="gd__texte" aria-hidden="true">
            {affiche}
            <span className="gd__curseur" data-ecrit={fini ? "1" : "0"} />
          </p>
          <p className="sr-only" aria-live="polite">
            {e.titre}. {e.texte}
          </p>

          <div className="gd__temps" aria-hidden="true">
            <i
              key={`${etape}-${enMarche}`}
              data-on={fini && enMarche && !dernier ? "1" : "0"}
              style={{ animationDuration: `${attente}ms` }}
            />
          </div>

          <div className="gd__points" role="tablist" aria-label="Étapes">
            {etapes.map((s, i) => (
              <button
                key={s.titre}
                role="tab"
                aria-selected={i === etape}
                aria-label={`Étape ${i + 1} : ${s.titre}`}
                data-etat={i < etape ? "fait" : i === etape ? "actif" : "a-venir"}
                onClick={() => aller(i)}
              />
            ))}
          </div>

          <div className="gd__actions">
            <button className="gd__btn" onClick={() => aller(etape - 1)} disabled={etape === 0} aria-label="Étape précédente">
              <ChevronLeft size={15} />
            </button>
            <button
              className="gd__btn"
              onClick={() => (demarre ? setAuto((a) => !a) : setDemarre(true))}
              aria-label={auto ? "Mettre en pause" : "Reprendre"}
              aria-pressed={!auto}
            >
              {auto ? <Pause size={14} /> : <Play size={14} />}
            </button>
            {dernier ? (
              <button className="gd__btn gd__btn--plein" onClick={() => aller(0)}>
                <RotateCcw size={14} /> Rejouer
              </button>
            ) : (
              <button className="gd__btn gd__btn--plein" onClick={() => aller(etape + 1)}>
                Suivant <ChevronRight size={15} />
              </button>
            )}
          </div>
        </aside>

        <div className="gd__scene">{scene({ etape, fini })}</div>
      </div>
    </div>
  )
}

/** Marque l'element que l'etape courante montre : le robot y pose son regard. */
export const foc = (actif: boolean) => (actif ? ({ "data-guide-focus": "1" } as const) : {})
