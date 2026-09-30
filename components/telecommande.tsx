"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { PHARES } from "@/lib/dossiers"

/**
 * La telecommande de /presentation : « Precedent » et « Suivant » passent d'etape en etape, dans l'ordre de la page,
 * SANS RIEN SAUTER — y compris les sous-parties d'une section :
 *   - le schema RAG : l'introduction, puis chacune de ses cinq etapes ;
 *   - les projets : l'introduction, chaque projet un par un (le projet presente grandit, les autres reculent), puis « le reste » ;
 *   - les demonstrations : chaque scenario (l'onglet est choisi et sa visite guidee repart de la premiere etape) ;
 *   - toutes les autres sections, dans l'ordre.
 * Les positions sont relues a chaque appui : si la page change (image chargee, fenetre redimensionnee), la telecommande suit.
 * Le clavier marche aussi (fleches gauche / droite, Page precedente / suivante : ce que les telecommandes de salle envoient).
 * Elle reprend d'ou l'on est si l'on a defile a la main.
 */

type Etape = {
  cle: string
  section: string
  titre: string
  y: () => number
  /** Action au depart de l'etape (choisir l'onglet d'une demonstration...). */
  avant?: () => void
  /** Numero du projet presente : les autres cartes s'estompent. */
  carte?: number
}

const H = () => window.innerHeight
const maxY = () => Math.max(0, document.documentElement.scrollHeight - H())
const q = (s: string) => document.querySelector<HTMLElement>(s)
const qa = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s))
const haut = (el: Element | null | undefined) => (el ? el.getBoundingClientRect().top + window.scrollY : 0)
const centreY = (el: Element | null | undefined) => (el ? haut(el) + el.getBoundingClientRect().height / 2 : 0)
const borne = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
const texte = (el: Element | null | undefined) => (el?.textContent ?? "").replace(/\s+/g, " ").trim()

/** Ou le schema RAG (pilote par le defilement) montre chacune de ses etapes : mesure sur la page (fraction du balayage). */
const RAG_ETAPES = [0.32, 0.47, 0.63, 0.78, 0.93]

function focaliser(i: number | null) {
  const liste = q("#sec-stations .cas-liste")
  const cartes = qa("#sec-stations .cas")
  if (i === null) {
    liste?.removeAttribute("data-focus")
    cartes.forEach((c) => c.removeAttribute("data-focus"))
    return
  }
  liste?.setAttribute("data-focus", "1")
  cartes.forEach((c, k) => c.setAttribute("data-focus", k === i ? "1" : "0"))
}

/** La liste des etapes, dans l'ordre de la page, avec des positions relues a la demande. */
function construire(): Etape[] {
  const etapes: Etape[] = []
  const ajoute = (e: Etape) => etapes.push(e)

  ajoute({ cle: "accueil", section: "Accueil", titre: "Bienvenue", y: () => 0 })

  const rag = q(".rag__scroll")
  if (rag) {
    const a0 = () => haut(rag) - 0.3 * H()
    const a1 = () => haut(rag) + rag.getBoundingClientRect().height - H()
    ajoute({ cle: "rag", section: "Le fil conducteur", titre: "Le chemin d'une question", y: a0 })
    const notes = qa(".rag-note b")
    RAG_ETAPES.forEach((p, i) => {
      ajoute({ cle: `rag-${i}`, section: "Le fil conducteur", titre: texte(notes[i]) || `Étape ${i + 1}`, y: () => a0() + p * (a1() - a0()) })
    })
  }

  const compteurs = q(".compteurs")
  if (compteurs) ajoute({ cle: "chiffres", section: "En chiffres", titre: "Quelques repères", y: () => centreY(compteurs) - 0.45 * H() })

  const stations = q("#sec-stations")
  if (stations) {
    ajoute({ cle: "projets", section: "Projets", titre: "Sept projets, sept preuves", y: () => haut(stations) + 20 })
    qa("#sec-stations .cas").forEach((carte, i) => {
      ajoute({
        cle: `projet-${i}`,
        section: "Projets",
        titre: texte(carte.querySelector(".cas__code b")) || PHARES[i]?.nom || `Projet ${i + 1}`,
        // La ligne de lecture du robot est a 52 % de la hauteur : la carte s'y centre.
        y: () => centreY(carte) - 0.52 * H(),
        carte: i,
      })
    })
    const suite = q(".cas-suite")
    if (suite) ajoute({ cle: "reste", section: "Projets", titre: "Et le reste", y: () => centreY(suite) - 0.5 * H() })
  }

  const demo = q("#sec-demos .demo")
  if (demo) {
    qa("#sec-demos .onglet").forEach((onglet, i) => {
      ajoute({
        cle: `demo-${i}`,
        section: "Démonstrations",
        titre: texte(onglet),
        y: () => haut(q("#sec-demos .demo")) - 110,
        avant: () => {
          const ongs = qa("#sec-demos .onglet")
          if (!ongs[i]) return
          if (!ongs[i].classList.contains("onglet--actif")) ongs[i].click()
          // La visite guidee du scenario repart de sa premiere etape.
          window.setTimeout(() => q("#sec-demos .gd__points button")?.click(), 80)
        },
      })
    })
  }

  const apropos = q("#sec-apropos")
  if (apropos) ajoute({ cle: "apropos", section: "À propos", titre: "De l'affinage au déploiement", y: () => haut(apropos) - 60 })

  const comp = qa("#sec-competences .carte")
  if (comp.length) ajoute({ cle: "competences", section: "Compétences", titre: "Technologies maîtrisées", y: () => centreY(comp[0]) - 0.45 * H() })

  const etapesMethode = qa("#sec-methode div.rounded-full")
  if (etapesMethode.length) ajoute({ cle: "methode", section: "Méthode", titre: "Comment je travaille", y: () => centreY(etapesMethode[0]) - 0.44 * H() })

  const veille = qa("#sec-veille .carte")
  if (veille.length) {
    ajoute({ cle: "veille", section: "En ce moment", titre: "Ce que j'apprends", y: () => (centreY(veille[0]) + centreY(veille[veille.length - 1])) / 2 - 0.5 * H() })
  }

  ajoute({ cle: "contact", section: "Contact", titre: "Travaillons ensemble", y: () => maxY() })
  return etapes
}

export function Telecommande() {
  const [n, setN] = useState(0)
  const [i, setI] = useState(0)
  const [peutReculer, setPeutReculer] = useState(false)
  const [titre, setTitre] = useState({ section: "", titre: "" })
  const etapes = useRef<Etape[]>([])
  const anim = useRef(0)
  const enCours = useRef(false)
  // L'etape courante est retenue explicitement : plusieurs etapes peuvent partager la meme position (les scenarios d'une demonstration)
  // ou etre tres proches (l'introduction des projets et le premier projet). On ne la recalcule que si l'on a defile a la main.
  const courant = useRef(0)

  const maj = useCallback(() => {
    etapes.current = construire()
    const ys = etapes.current.map((e) => e.y())
    const y = window.scrollY
    let k = courant.current
    if (k >= ys.length) k = ys.length - 1
    // On a defile a la main, loin de l'etape retenue : on retrouve la plus proche au-dessus de la position (la premiere d'un groupe).
    if (k < 0 || Math.abs(y - ys[k]) > 140) {
      let meilleur = -1
      ys.forEach((v) => {
        if (v <= y + 60 && v > meilleur) meilleur = v
      })
      k = meilleur < 0 ? 0 : ys.findIndex((v) => Math.abs(v - meilleur) < 2)
    }
    courant.current = k
    setN(ys.length)
    setI(k)
    setPeutReculer(k > 0 || y - (ys[0] ?? 0) > 60)
    const e = etapes.current[k]
    if (e) setTitre({ section: e.section, titre: e.titre })
    return { ys, k }
  }, [])

  const aller = useCallback((k: number) => {
    const e = etapes.current[k]
    if (!e) return
    cancelAnimationFrame(anim.current)
    courant.current = k
    focaliser(e.carte ?? null)
    document.documentElement.dataset.visiteEtape = String(k)
    e.avant?.()
    setI(k)
    setPeutReculer(k > 0)
    setTitre({ section: e.section, titre: e.titre })
    const cible = Math.round(borne(e.y(), 0, maxY()))
    const depart = window.scrollY
    const dist = Math.abs(cible - depart)
    if (dist < 4 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      window.scrollTo({ top: cible, behavior: "instant" as ScrollBehavior })
      return
    }
    // Un defilement fluide, a nous : le site defile en douceur par defaut, ici on pilote image par image.
    const duree = borne(550 + dist * 0.42, 650, 1700)
    const t0 = performance.now()
    enCours.current = true
    const pas = (t: number) => {
      const k2 = borne((t - t0) / duree, 0, 1)
      // La cible est relue a chaque image : si la page bouge (image chargee), on arrive quand meme au bon endroit.
      const vise = Math.round(borne(e.y(), 0, maxY()))
      window.scrollTo({ top: depart + (vise - depart) * ease(k2), behavior: "instant" as ScrollBehavior })
      if (k2 < 1) anim.current = requestAnimationFrame(pas)
      else enCours.current = false
    }
    anim.current = requestAnimationFrame(pas)
  }, [])

  const suivant = useCallback(() => {
    const { k } = maj()
    if (k + 1 < etapes.current.length) aller(k + 1)
  }, [aller, maj])

  const precedent = useCallback(() => {
    const { ys, k } = maj()
    // Si l'on est deja passe au-dela de l'etape courante (defilement a la main), « precedent » y revient d'abord.
    const cible = window.scrollY - ys[k] > 60 ? k : k - 1
    if (cible >= 0) aller(cible)
  }, [aller, maj])

  useEffect(() => {
    const html = document.documentElement
    html.dataset.visite = "1" // le robot presente : petit bond a chaque etape, pas de colere pendant qu'on presente
    maj()
    let raf = 0
    const surScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(() => {
        raf = 0
        if (!enCours.current) maj()
      })
    }
    const surUtilisateur = () => {
      // Le presentateur reprend la main a la molette : on arrete notre defilement.
      cancelAnimationFrame(anim.current)
      enCours.current = false
    }
    const surTouche = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return
      const cible = e.target as HTMLElement | null
      if (cible && /^(input|textarea|select)$/i.test(cible.tagName)) return
      if (e.key === "ArrowRight" || e.key === "PageDown") {
        e.preventDefault()
        suivant()
      } else if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault()
        precedent()
      }
    }
    window.addEventListener("scroll", surScroll, { passive: true })
    window.addEventListener("resize", surScroll)
    window.addEventListener("wheel", surUtilisateur, { passive: true })
    window.addEventListener("touchstart", surUtilisateur, { passive: true })
    window.addEventListener("keydown", surTouche)
    // Le contenu se charge apres le premier rendu (sections, images) : on relit les etapes un peu plus tard.
    const t = window.setTimeout(maj, 800)
    return () => {
      cancelAnimationFrame(anim.current)
      cancelAnimationFrame(raf)
      window.clearTimeout(t)
      window.removeEventListener("scroll", surScroll)
      window.removeEventListener("resize", surScroll)
      window.removeEventListener("wheel", surUtilisateur)
      window.removeEventListener("touchstart", surUtilisateur)
      window.removeEventListener("keydown", surTouche)
      focaliser(null)
      delete html.dataset.visite
      delete html.dataset.visiteEtape
    }
  }, [maj, suivant, precedent])

  return (
    <div className="tc" role="group" aria-label="Télécommande de présentation">
      <button className="tc__btn" onClick={precedent} disabled={!peutReculer} aria-label="Étape précédente">
        <ChevronLeft size={18} />
        <span>Précédent</span>
      </button>
      <div className="tc__etat" aria-live="polite">
        <span className="tc__n">
          {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
        </span>
        <span className="tc__titre">
          <b>{titre.section}</b>
          {titre.titre && titre.titre !== titre.section ? <> · {titre.titre}</> : null}
        </span>
      </div>
      <button className="tc__btn tc__btn--plein" onClick={suivant} disabled={n > 0 && i >= n - 1} aria-label="Étape suivante">
        <span>Suivant</span>
        <ChevronRight size={18} />
      </button>
    </div>
  )
}
