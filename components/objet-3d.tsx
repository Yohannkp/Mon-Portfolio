"use client"

import Link from "next/link"
import { useEffect, useRef, useState } from "react"

/**
 * L'objet : un cube filaire qui devient un robot, puis accompagne la lecture.
 *
 * Le robot ne bouge jamais « pour bouger ». Chaque section lui donne un ROLE,
 * ancre sur un element reel de la page dont on lit la position a chaque image :
 *
 *   hero          cube ferme, il attend
 *   schema        il porte la requete le long du pipeline, et se dedouble
 *                 quand la recherche se fait en parallele
 *   en chiffres   il passe sous le bandeau et designe les chiffres un a un
 *   projets       il suit la carte qu'on lit, puis attire l'oeil vers son lien
 *   demos         il regarde la simulation, puis invite a essayer un autre onglet
 *   a propos      il surligne les phrases qui portent le propos
 *   competences   il s'arrete sous chaque carte sur le badge dont il a la preuve
 *   methode       il parcourt les etapes et les allume derriere lui
 *   veille        il lit les trois chantiers
 *   contact       il grossit dans sa scene, puis se replie sur l'emplacement
 *                 du bouton et devient le bouton
 *
 * Fil conducteur : la page suit le trajet d'un modele, de la donnee brute au
 * deploiement. Le robot publie l'etape en cours (data-robot-scene sur <html>),
 * que le rail de lecture affiche. Son echelle raconte la meme chose : grand
 * quand il presente (hero, finale), petit quand il travaille sur le contenu.
 *
 * Regle commune : jamais sur le texte. Il vit dans la marge droite, dans les
 * bandes vides entre deux blocs, ou sur le diagramme lui-meme.
 *
 * Cout : pas de canvas, pas de WebGL, pas de dependance. Le JS ecrit des
 * variables CSS sur trois elements ; le GPU compose le reste.
 */

type Humeur = "neutre" | "concentre" | "content" | "curieux"
type Point = { x: number; y: number }
type Bulle = { titre?: string; texte: string; place?: "dessus" | "dessous"; largeur?: number }

type Sortie = {
  x: number
  y: number
  ech: number
  op?: number
  regard?: Point | null
  humeur?: Humeur
  incl?: number
  bulle?: Bulle | null
  fantome?: { x: number; y: number; regard?: Point | null; force: number; ech: number } | null
  /** 0..1 : le robot rejoint l'emplacement du bouton. */
  pose?: number
  /** 0..1 : la pilule cliquable remplace le robot. */
  pil?: number
  pl?: number
  ph?: number
}

type Ctx = {
  W: number
  H: number
  Y: number
  now: number
  /** Bord droit / gauche du contenu, marge libre a droite, centre de cette marge. */
  droite: number
  gauche: number
  marge: number
  xM: number
  /** Echelle du robot qui tient dans la marge. */
  echM: number
  /** Bas de l'en-tete fixe : rien ne doit passer dessous. */
  haut: number
  /** Vrai quand aucune image n'est rendue : on ne peut pas compter sur le temps. */
  snap: boolean
}

const borne = (v: number, a: number, b: number) => Math.min(Math.max(v, a), b)
const rampe = (v: number, a: number, b: number) => borne((v - a) / (b - a), 0, 1)
const lisse = (t: number) => {
  const x = borne(t, 0, 1)
  return x * x * (3 - 2 * x)
}
const mix = (a: number, b: number, t: number) => a + (b - a) * t
const centre = (r: DOMRect): Point => ({ x: r.left + r.width / 2, y: r.top + r.height / 2 })

/**
 * Position le long d'une suite de n points : on s'arrete un moment sur chacun,
 * puis on glisse au suivant. Sans ce palier, le robot ne fait que passer.
 */
function palier(u: number, n: number) {
  const k = borne(u, 0, n - 1)
  const i = Math.min(Math.floor(k), n - 2)
  return i + lisse(rampe(k - i, 0.4, 0.9))
}

/* --- Le schema : ou est la requete ? --------------------------------------
 * Le jeton du diagramme parcourt ces abscisses (unites du viewBox 960x300),
 * de t=60 a t=820 sur une timeline de 830. On rejoue le meme calcul plutot que
 * de lire le jeton : le robot est ainsi deterministe, et il ne subit pas le
 * retard de lissage de la timeline. */
const DUREE_RAG = 830
const CX_JETON = [58, 218, 406, 586, 734, 896]
function cxJeton(t: number) {
  const u = rampe(t, 60, 820) * 5
  const i = Math.min(Math.floor(u), 4)
  return mix(CX_JETON[i], CX_JETON[i + 1], u - i)
}
function etapeRag(t: number) {
  if (t < 210) return 1
  if (t < 370) return 2
  if (t < 520) return 3
  if (t < 650) return 4
  return 5
}
const HUMEUR_RAG: Record<number, Humeur> = { 1: "concentre", 2: "curieux", 3: "concentre", 4: "concentre", 5: "content" }

/* --- Competences : la preuve de chaque famille, tiree du site lui-meme --- */
const PREUVES = [
  { badge: "Go", texte: "Backend d'un moteur de traitement de données en production — stage 2026" },
  { badge: "Fine-tuning LoRA / QLoRA", texte: "Affinage de Qwen2-0.5B dans Mina-Translator" },
  { badge: "Docker", texte: "Compose, images et conteneurs — stage, et RAG-Local" },
  { badge: "ETL", texte: "Moteur de traitement de données — stage 2026" },
]

const IDS = [
  "sec-rag",
  "sec-chiffres",
  "sec-stations",
  "sec-demos",
  "sec-apropos",
  "sec-competences",
  "sec-methode",
  "sec-veille",
  "sec-contact",
]

/** Un accessoire du visage, partage par le robot et par son fantome. */
function Visage() {
  return (
    <>
      <div className="obj__antenne" />
      <div className="obj__tete" />
      <div className="obj__visiere">
        <div className="obj__yeux">
          <span className="obj__oeil obj__oeil--g" />
          <span className="obj__oeil obj__oeil--d" />
        </div>
      </div>
      <div className="obj__anneau" />
    </>
  )
}

export function Objet3D() {
  const racine = useRef<HTMLDivElement>(null)
  const fantome = useRef<HTMLDivElement>(null)
  const bulle = useRef<HTMLDivElement>(null)
  const bulleTitre = useRef<HTMLElement>(null)
  const bulleTexte = useRef<HTMLSpanElement>(null)
  // Le robot DEVIENT le bouton : on monte le lien quand il se pose.
  const [pilule, setPilule] = useState(false)

  useEffect(() => {
    const el = racine.current
    const fan = fantome.current
    const bul = bulle.current
    const titre = bulleTitre.current
    const texte = bulleTexte.current
    if (typeof window === "undefined" || !el || !fan || !bul || !titre || !texte) return

    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    const large = window.matchMedia("(min-width: 1281px)")
    const html = document.documentElement

    // Le bouton de la section contact ne doit jamais se montrer quand le robot
    // est en service : c'est LUI le bouton. Sous 1280px le robot n'existe pas,
    // et le bouton de la page reprend son role.
    const majService = () => {
      html.dataset.robotActif = large.matches ? "1" : "0"
    }
    majService()
    large.addEventListener("change", majService)

    const q = <T extends Element = HTMLElement>(s: string) => document.querySelector<T>(s)
    const qa = (s: string) => Array.from(document.querySelectorAll<HTMLElement>(s))
    const rect = (s: string) => q(s)?.getBoundingClientRect() ?? null

    // Marge de gouttiere du conteneur (px-6), lue une fois.
    const conteneur = q("#sec-stations > div")
    const PAD = conteneur ? parseFloat(getComputedStyle(conteneur).paddingRight) || 24 : 24

    // --- Memoire des scenes ------------------------------------------------
    const mem = {
      scene: "",
      carte: -1,
      carteT: 0,
      demo: { btn: null as Element | null, dispo: false, vu: false, fin: false },
      clic: null as (Point & { t: number }) | null,
      souris: { x: -1, y: -1, t: -1e9 },
      lu: 0,
      luT: 0,
      etape: -1,
      etapeT: 0,
      marques: new Map<string, Set<Element>>(),
      bulleCle: "",
      bulleMin: 0,
      dernierePilule: false,
      survol: null as Element | null,
    }

    // --- Etat lisse (ce qui est effectivement a l'ecran) --------------------
    const N = {
      init: true,
      x: 0, y: 0, ech: 1, op: 0.95,
      gx: 0, gy: 0, incl: 0, mut: 0,
      fx: 0, fy: 0, fech: 0.5, fo: 0, fgx: 0, fgy: 0,
      saut: 0,
      angle: 0, vitesse: 0, brut: 0, dy: 0, dyBrut: 0, dernierY: window.scrollY,
    }
    let cible: Sortie = { x: 0, y: 0, ech: 1 }
    let dernierTemps = performance.now()
    let rafId = 0

    /** Pose un attribut sur exactement les elements donnes, et l'ote des autres. */
    const marquer = (attr: string, els: Element[], valeur = "1") => {
      const ancien = mem.marques.get(attr)
      const neuf = new Set(els)
      ancien?.forEach((e) => {
        if (!neuf.has(e)) e.removeAttribute(attr)
      })
      neuf.forEach((e) => {
        if (e.getAttribute(attr) !== valeur) e.setAttribute(attr, valeur)
      })
      mem.marques.set(attr, neuf)
    }

    // ======================================================================
    //  LES SCENES
    // ======================================================================

    const marge = (c: Ctx, y: number): Sortie => ({ x: c.xM, y, ech: c.echM, op: 0.95 })

    /** HERO — le cube, grand, du cote droit. Il attend qu'on descende. */
    const hero = (c: Ctx): Sortie => {
      // Le plus grand qu'il sera : la donnee brute, seule, avant tout traitement.
      // Il rentre dans la colonne libre a droite du titre, jamais dessus.
      const ech = borne((c.W - c.gauche - 700) / 300, 0.8, 1.2)
      return { x: c.W * 0.93 - 170 * ech, y: c.H * 0.5, ech, op: 0.95, humeur: "neutre" }
    }

    /** SCHEMA — il porte la requete le long du pipeline. */
    const schema = (c: Ctx): Sortie => {
      const piste = q(".rag__scroll")
      const svgEl = q(".rag__diagram")
      const intro = q(".rag__intro")
      if (!piste || !svgEl) return marge(c, c.H * 0.5)

      const rs = piste.getBoundingClientRect()
      const sv = svgEl.getBoundingClientRect()
      const sc = sv.width / 960
      const ir = intro?.getBoundingClientRect()

      // Avancement dans la section epinglee, puis position de la requete.
      const f = rampe(-rs.top, 0, Math.max(rs.height - c.H, 1))
      const t = f * DUREE_RAG
      const cx = cxJeton(t)
      const etape = etapeRag(t)

      const ech = 0.5
      const sx = sv.left + cx * sc
      // Au-dessus du noeud le plus haut (Vectoriel, y=60), sans jamais le toucher.
      const sy = sv.top + 60 * sc - 8 - 96 * ech

      // Avant l'epinglage il est encore devant l'introduction, dans la marge.
      const yIntro = ir ? borne(ir.top + ir.height / 2, c.H * 0.3, c.H * 0.62) : c.H * 0.45
      const entree = lisse(rampe(rs.top, c.H * 0.45, 0))
      // Apres l'epinglage le diagramme remonte : il rejoint la marge plutot que de partir avec.
      const sortie = lisse(rampe(rs.bottom, c.H, c.H * 0.78))

      let x = mix(c.xM, sx, entree)
      let y = mix(yIntro, sy, entree)
      let e = mix(c.echM, ech, entree)
      x = mix(x, c.xM, sortie)
      y = mix(y, c.H * 0.5, sortie)
      e = mix(e, c.echM, sortie)

      const actif = entree * (1 - sortie)
      const rangee = sv.top + 150 * sc

      // Le regard : la requete qu'il porte. Au reranking il relit les candidats.
      let regard: Point = { x: sx, y: rangee }
      if (etape === 2) regard = { x: sx, y: sv.top + 92 * sc }
      if (etape === 4) regard = { x: sx + Math.sin(c.now / 240) * 120 * sc, y: rangee }
      if (actif < 0.5 && ir) regard = { x: ir.left + 320, y: ir.top + 30 }

      // La recherche vectorielle et BM25 tournent EN PARALLELE : le robot se
      // dedouble sous le noeud BM25, puis les deux fusionnent avant le RRF.
      const g = lisse(rampe(cx, 250, 350)) * (1 - lisse(rampe(cx, 470, 580))) * actif
      const fusion = lisse(rampe(cx, 470, 580))
      // Plus petit que le robot : sous le noeud BM25 il reste de la place juste
      // au-dessus de la carte de note, pas davantage.
      const echF = ech * 0.84
      const gy0 = sv.top + 248 * sc + 8 + 113 * echF
      const fantomeOut =
        g > 0.01
          ? {
              x: sx,
              y: mix(gy0, sy, fusion),
              regard: { x: sx, y: sv.top + 218 * sc },
              force: g,
              ech: mix(echF, ech, fusion),
            }
          : null

      return {
        x, y, ech: e, op: 1, regard,
        humeur: actif < 0.5 ? "neutre" : HUMEUR_RAG[etape],
        fantome: fantomeOut,
      }
    }

    /** EN CHIFFRES — il passe sous le bandeau et designe chaque chiffre. */
    const chiffres = (c: Ctx): Sortie => {
      const cellules = qa(".compteur")
      const bande = rect(".compteurs")
      if (!bande || cellules.length < 2) return marge(c, c.H * 0.5)
      const n = cellules.length
      const ech = 0.56
      const u = rampe(centre(bande).y, c.H * 0.84, c.H * 0.46) * (n - 1)
      const p = palier(u, n)
      const i = Math.min(Math.floor(p), n - 2)
      const xs = cellules.map((cl) => centre(cl.getBoundingClientRect()).x)
      const x = mix(xs[i], xs[i + 1], p - i)
      // Sous le bandeau : l'antenne pointe vers les chiffres, rien n'est recouvert.
      const y = bande.bottom + 10 + 113 * ech
      const proche = Math.round(p)
      const arrive = Math.abs(p - proche) < 0.12
      marquer("data-robot-vise", arrive ? [cellules[proche]] : [])
      return {
        x, y, ech, op: 1,
        regard: { x, y: bande.top + bande.height * 0.35 },
        humeur: arrive && proche === n - 1 ? "content" : "neutre",
      }
    }

    /** PROJETS — il suit la carte qu'on lit, puis attire l'oeil vers son lien. */
    const projets = (c: Ctx): Sortie => {
      const cartes = qa(".station")
      if (!cartes.length) return marge(c, c.H * 0.5)
      let idx = 0
      let dmin = Infinity
      cartes.forEach((carte, i) => {
        const d = Math.abs(centre(carte.getBoundingClientRect()).y - c.H * 0.52)
        if (d < dmin) {
          dmin = d
          idx = i
        }
      })
      if (idx !== mem.carte) {
        mem.carte = idx
        mem.carteT = c.now
      }
      const r = cartes[idx].getBoundingClientRect()
      const depuis = c.now - mem.carteT
      const lien = cartes[idx].querySelector<HTMLElement>(".station__lien")
      // Une fois la carte lue, le regard va au lien : c'est la que se decide la visite du depot.
      const versLien = depuis > 2200 && lien
      marquer("data-robot-vise", versLien && lien ? [lien] : [])
      const code = cartes[idx].querySelector("b")?.textContent ?? ""
      return {
        x: c.xM,
        y: borne(centre(r).y, c.H * 0.28, c.H * 0.72),
        ech: c.echM,
        op: 0.95,
        regard: versLien && lien ? centre(lien.getBoundingClientRect()) : { x: r.left + r.width * 0.32, y: r.top + r.height * 0.4 },
        humeur: depuis < 900 ? "content" : "neutre",
        bulle: { titre: `${String(idx + 1).padStart(2, "0")} / ${String(cartes.length).padStart(2, "0")}`, texte: code },
      }
    }

    /** DEMOS — il regarde la simulation, puis invite a essayer un autre onglet. */
    const demos = (c: Ctx): Sortie => {
      const panneau = rect("#sec-demos .demo")
      const rangee = rect("#sec-demos .onglets")
      const btn = q("#sec-demos .demo__bouton")
      const d = mem.demo
      if (btn !== d.btn) {
        d.btn = btn
        d.dispo = false
        d.vu = false
        d.fin = false
      }
      // Le bouton est desactive tant que la simulation tourne (et avant que
      // anime.js soit charge) : on ne conclut « en cours » qu'apres l'avoir vu actif.
      const off = (btn as HTMLButtonElement | null)?.disabled ?? true
      if (!off) d.dispo = true
      const enCours = off && d.dispo
      if (enCours) {
        d.vu = true
        d.fin = false
      }
      if (!off && d.vu) d.fin = true

      const onglets = qa("#sec-demos .onglet")
      const inactifs = onglets.filter((o) => !o.classList.contains("onglet--actif"))
      const invite = d.fin && !enCours

      // Un clic sur un onglet attire son regard un instant.
      const clic = mem.clic && c.now - mem.clic.t < 800 ? mem.clic : null

      if (invite && rangee) {
        marquer("data-robot-invite", inactifs)
        const cible1 = inactifs[0]?.getBoundingClientRect()
        return {
          x: c.xM,
          y: borne(centre(rangee).y, c.H * 0.2, c.H * 0.8),
          ech: c.echM,
          op: 0.95,
          regard: clic ?? (cible1 ? centre(cible1) : null),
          humeur: "content",
          bulle: { titre: "Terminé", texte: "Essaie un autre scénario" },
        }
      }
      marquer("data-robot-invite", [])
      const y = panneau
        ? borne((Math.max(panneau.top, 0) + Math.min(panneau.bottom, c.H)) / 2, c.H * 0.3, c.H * 0.7)
        : c.H * 0.5
      return {
        x: c.xM, y, ech: c.echM, op: 0.95,
        regard: clic ?? (panneau ? { x: panneau.left + panneau.width * 0.45, y } : null),
        humeur: enCours ? "concentre" : "neutre",
        bulle: enCours ? { titre: "Simulation", texte: "Je regarde le scénario se dérouler" } : null,
      }
    }

    /** A PROPOS — il surligne les phrases qui portent le propos. */
    const apropos = (c: Ctx): Sortie => {
      const phrases = qa("#sec-apropos .marque")
      const photo = rect("#sec-apropos img")
      const ligne = c.H * 0.62
      let atteintes = 0
      phrases.forEach((p, i) => {
        if (centre(p.getBoundingClientRect()).y < ligne) atteintes = i + 1
      })
      // Il lit UNE phrase a la fois : deux phrases sur des lignes voisines
      // atteignent la ligne de lecture ensemble, mais se soulignent l'une apres l'autre.
      let lu = mem.lu
      if (atteintes < lu) lu = atteintes
      else if (atteintes > lu && (c.snap || c.now - mem.luT > 700)) lu = lu + 1
      if (lu !== mem.lu) {
        mem.lu = lu
        mem.luT = c.now
      }
      marquer("data-lu", phrases.slice(0, lu))
      if (lu === 0 || !phrases.length) {
        return {
          x: c.xM, y: photo ? borne(centre(photo).y, c.H * 0.3, c.H * 0.7) : c.H * 0.5,
          ech: c.echM, op: 0.95,
          regard: photo ? centre(photo) : null,
          humeur: "neutre",
        }
      }
      const r = phrases[lu - 1].getBoundingClientRect()
      const p = centre(r)
      const recent = c.now - mem.luT < 1100
      return {
        x: c.xM, y: borne(p.y, c.H * 0.25, c.H * 0.75), ech: c.echM, op: 0.95,
        regard: p,
        humeur: lu === phrases.length ? "content" : recent ? "concentre" : "neutre",
        bulle: { texte: lu === phrases.length ? "Disponibilité" : "Ma méthode" },
      }
    }

    /** COMPETENCES — il s'arrete sous chaque carte, sur le badge dont il a la preuve. */
    const competences = (c: Ctx): Sortie => {
      const cartes = qa("#sec-competences .carte")
      if (cartes.length < 2) return marge(c, c.H * 0.5)
      const n = cartes.length
      const rects = cartes.map((k) => k.getBoundingClientRect())
      const bas = Math.max(...rects.map((r) => r.bottom))
      const ech = 0.5
      const u = rampe(centre(rects[0]).y, c.H * 0.94, c.H * 0.42) * (n - 1)
      const p = palier(u, n)
      const i = Math.min(Math.floor(p), n - 2)
      const x = mix(centre(rects[i]).x, centre(rects[i + 1]).x, p - i)
      const y = bas + 10 + 113 * ech
      const k = Math.round(p)
      const arrive = Math.abs(p - k) < 0.12
      const preuve = PREUVES[k]
      const badge = arrive && preuve
        ? Array.from(cartes[k].querySelectorAll<HTMLElement>("*")).find(
            (e) => e.children.length === 0 && e.textContent?.trim() === preuve.badge,
          )
        : undefined
      marquer("data-preuve", badge ? [badge] : [])
      return {
        x, y, ech, op: 1,
        regard: { x, y: rects[Math.min(k, n - 1)].top + rects[0].height * 0.5 },
        humeur: arrive ? "content" : "neutre",
        bulle: badge && preuve ? { titre: preuve.badge, texte: preuve.texte, place: "dessous", largeur: 232 } : null,
      }
    }

    /** METHODE — il parcourt les etapes et les allume derriere lui. */
    const methode = (c: Ctx): Sortie => {
      const etapes = qa("#sec-methode div.grid > div")
      const icones = etapes.map((e) => e.querySelector<HTMLElement>("div.rounded-full"))
      if (etapes.length < 2 || icones.some((i) => !i)) return marge(c, c.H * 0.5)
      const n = etapes.length
      const rects = icones.map((i) => i!.getBoundingClientRect())
      const ech = 0.28
      const u = rampe(centre(rects[0]).y, c.H * 0.94, c.H * 0.44) * (n - 1)
      const p = palier(u, n)
      const i = Math.min(Math.floor(p), n - 2)
      const f = p - i
      const x = mix(centre(rects[i]).x, centre(rects[i + 1]).x, f)
      // Il se pose AU-DESSUS de l'icone, jamais sur le trait ni sur le texte.
      const saut = Math.sin(Math.PI * f) * 16
      const y = rects[0].top - 6 - 96 * ech - saut
      const k = Math.round(p)
      const arrive = Math.abs(p - k) < 0.1
      // Une etape allumee le reste tant que le robot ne repasse pas en arriere :
      // c'est la progression. On ne l'eteint pas quand il repart vers la suivante.
      marquer("data-actif", etapes.filter((_, j) => j <= p + 0.06))
      if (k !== mem.etape) {
        mem.etape = k
        mem.etapeT = c.now
      }
      return {
        x, y, ech, op: 1,
        regard: { x, y: rects[0].bottom },
        humeur: arrive ? "content" : "concentre",
      }
    }

    /** VEILLE — il lit les trois chantiers, l'un apres l'autre. */
    const veille = (c: Ctx): Sortie => {
      const cartes = qa("#sec-veille .carte")
      if (cartes.length < 2) return marge(c, c.H * 0.5)
      const n = cartes.length
      const rects = cartes.map((k) => k.getBoundingClientRect())
      const bas = Math.max(...rects.map((r) => r.bottom))
      const ech = 0.5
      const u = rampe(centre(rects[0]).y, c.H * 0.94, c.H * 0.5) * (n - 1)
      const p = palier(u, n)
      const i = Math.min(Math.floor(p), n - 2)
      const x = mix(centre(rects[i]).x, centre(rects[i + 1]).x, p - i)
      const k = Math.round(p)
      return {
        x, y: bas + 10 + 113 * ech, ech, op: 1,
        regard: { x, y: rects[Math.min(k, n - 1)].top + 30 },
        humeur: "curieux",
        incl: Math.sin(c.now / 900) * 6,
      }
    }

    /** CONTACT — il grossit dans sa scene, puis se replie et devient le bouton. */
    const contact = (c: Ctx): Sortie => {
      const cib = q("[data-cible-robot]")
      const r = cib?.getBoundingClientRect()
      if (!r || r.width === 0) return marge(c, c.H * 0.5)
      // Deux rampes, on garde la plus avancee : la position, et le fond de page.
      // L'emplacement est dans la DERNIERE section, il ne remonte jamais assez
      // haut pour que la premiere seule atteigne 1.
      const parPosition = rampe(r.top, c.H * 0.95, c.H * 0.55)
      const reste = html.scrollHeight - c.Y - c.H
      const parLaFin = borne(1 - reste / (c.H * 0.5), 0, 1)
      const pose = Math.max(parPosition, parLaFin)
      const pil = lisse(rampe(pose, 0.8, 1))
      const p = centre(r)
      const d = lisse(pose)

      // Sa scene : un emplacement reserve au-dessus du titre. C'est le seul
      // endroit de la page ou il est grand, et il est seul : rien ne le recouvre.
      const scene = rect("[data-scene-robot]")
      let x0 = c.xM
      let y0 = c.H * 0.5
      let e0 = c.echM
      let regard: Point | null = null
      if (scene && scene.height > 0) {
        const s0 = centre(scene)
        e0 = borne((scene.height - 44) / 190, 0.5, 1.05)
        x0 = s0.x
        y0 = s0.y + 10
        // Il regarde le titre qui suit, puis le bouton quand il s'en approche.
        regard = { x: p.x, y: mix(scene.bottom + 60, p.y, d) }
      }
      // Le titre et le texte sont entre la scene et le bouton : il les contourne
      // par la droite au lieu de les traverser.
      const detour = Math.sin(Math.PI * rampe(d, 0, 0.85)) * Math.min(460, Math.max(c.W - p.x - 110, 0))
      return {
        x: mix(x0, p.x, d) + detour, y: mix(y0, p.y, d),
        ech: mix(mix(e0, 0.7, d), 1, pil), op: 1, humeur: "content", regard,
        pose, pil, pl: r.width, ph: r.height,
      }
    }

    const SCENES: Record<string, (c: Ctx) => Sortie> = {
      hero,
      "sec-rag": schema,
      "sec-chiffres": chiffres,
      "sec-stations": projets,
      "sec-demos": demos,
      "sec-apropos": apropos,
      "sec-competences": competences,
      "sec-methode": methode,
      "sec-veille": veille,
      "sec-contact": contact,
    }
    // Chaque scene declare les attributs qu'elle pose : ceux des autres sont retires.
    const ATTRS_PAR_SCENE: Record<string, string[]> = {
      "sec-chiffres": ["data-robot-vise"],
      "sec-stations": ["data-robot-vise"],
      "sec-demos": ["data-robot-invite"],
      "sec-apropos": ["data-lu"],
      "sec-competences": ["data-preuve"],
      "sec-methode": ["data-actif"],
    }
    const TOUS_ATTRS = ["data-robot-vise", "data-robot-invite", "data-lu", "data-preuve", "data-actif"]

    // ======================================================================
    //  CALCUL DE LA CIBLE, PUIS PEINTURE
    // ======================================================================

    const sousLaLigne = (ligne: number) => {
      let courant = "hero"
      for (const id of IDS) {
        const n = document.getElementById(id)
        if (!n) continue
        if (n.getBoundingClientRect().top <= ligne) courant = id
        else break
      }
      return courant
    }

    const entete = q("header")
    const calculer = (now: number, snap = false) => {
      const W = html.clientWidth
      const H = window.innerHeight
      const Y = window.scrollY
      const cr = conteneur?.getBoundingClientRect()
      const droite = cr ? cr.right - PAD : W - 190
      const gauche = cr ? cr.left + PAD : 190
      const m = W - droite
      const c: Ctx = {
        W, H, Y, now, droite, gauche, marge: m,
        xM: droite + m / 2,
        echM: borne((m - 34) / 215, 0.34, 0.62),
        haut: (entete?.getBoundingClientRect().bottom ?? 64) + 6,
        snap,
      }
      const id = sousLaLigne(H * 0.55)
      if (id !== mem.scene) {
        mem.scene = id
        html.dataset.robotScene = id
        N.saut = -16 // petit bond a l'arrivee dans une nouvelle scene
      }
      cible = (SCENES[id] ?? hero)(c)
      // Jamais sous l'en-tete fixe (sauf en vol vers le bouton, qui est plus bas).
      if (!cible.pose) cible.y = Math.max(cible.y, c.haut + 113 * cible.ech)

      // Les marques posees sur la page par les scenes qui ne sont plus actives disparaissent.
      const gardes = new Set(ATTRS_PAR_SCENE[id] ?? [])
      TOUS_ATTRS.forEach((a) => {
        if (!gardes.has(a) && mem.marques.get(a)?.size) marquer(a, [])
      })

      // Le cube devient robot en quittant le hero.
      N.mut = lisse(rampe(Y, H * 0.3, H * 1.05))
      return c
    }

    const regardVers = (depuis: Point, vers: Point | null | undefined, now: number): Point => {
      let p = vers
      if (!p && now - mem.souris.t < 2500) p = mem.souris
      if (!p) return { x: 0, y: 0.6 }
      const dx = p.x - depuis.x
      const dy = p.y - depuis.y
      const l = Math.hypot(dx, dy) || 1
      const s = Math.min(l / 180, 1)
      return { x: (dx / l) * s, y: (dy / l) * s }
    }

    const peindre = (c: Ctx, dt: number, snap: boolean) => {
      const k = snap || reduit ? 1 : 1 - Math.exp(-dt / 130)
      // Pose sur le bouton : il doit coller a l'emplacement, sans le moindre retard.
      const kPos = (cible.pose ?? 0) > 0.98 ? 1 : k
      if (N.init) {
        N.x = cible.x; N.y = cible.y; N.ech = cible.ech
        N.init = false
      }
      N.x = mix(N.x, cible.x, kPos)
      N.y = mix(N.y, cible.y, kPos)
      N.ech = mix(N.ech, cible.ech, kPos)
      N.op = mix(N.op, cible.op ?? 0.95, k)
      // Il s'incline dans le sens du defilement : on sent la vitesse de lecture.
      const penche = reduit ? 0 : borne(N.dy * 0.7, -7, 7)
      N.incl = mix(N.incl, (cible.incl ?? 0) + penche, k)
      N.saut *= snap ? 0 : Math.exp(-dt / 220)

      // Le regard : la direction du point regarde, plafonnee a l'amplitude de la visiere.
      // Un element interactif survole prend le regard : c'est ce que le visiteur va faire.
      const surv = mem.survol && document.contains(mem.survol) && !cible.pose ? mem.survol : null
      const g = regardVers({ x: N.x, y: N.y }, surv ? centre(surv.getBoundingClientRect()) : cible.regard, c.now)
      N.gx = mix(N.gx, g.x * 9, snap || reduit ? 1 : 1 - Math.exp(-dt / 90))
      N.gy = mix(N.gy, g.y * 6, snap || reduit ? 1 : 1 - Math.exp(-dt / 90))

      const bob = reduit ? 0 : Math.sin(c.now / 520) * 4 + N.saut

      el.style.setProperty("--tx", `${N.x.toFixed(1)}px`)
      el.style.setProperty("--ty", `${N.y.toFixed(1)}px`)
      el.style.setProperty("--ech", N.ech.toFixed(3))
      el.style.setProperty("--op", N.op.toFixed(3))
      el.style.setProperty("--mut", N.mut.toFixed(4))
      el.style.setProperty("--ry", `${N.angle.toFixed(2)}deg`)
      el.style.setProperty("--bob", `${bob.toFixed(2)}px`)
      el.style.setProperty("--gx", `${N.gx.toFixed(2)}px`)
      el.style.setProperty("--gy", `${N.gy.toFixed(2)}px`)
      el.style.setProperty("--incl", `${N.incl.toFixed(2)}deg`)
      const humeur = surv && (cible.humeur ?? "neutre") === "neutre" ? "curieux" : (cible.humeur ?? "neutre")
      if (el.dataset.humeur !== humeur) el.dataset.humeur = humeur

      // Pose sur le bouton.
      const pose = cible.pose ?? 0
      const pil = cible.pil ?? 0
      el.style.setProperty("--pose", pose.toFixed(4))
      el.style.setProperty("--pilule", pil.toFixed(4))
      if (cible.pl) el.style.setProperty("--pl", `${cible.pl.toFixed(1)}px`)
      if (cible.ph) el.style.setProperty("--ph", `${cible.ph.toFixed(1)}px`)
      const enPilule = pil > 0.05
      if (enPilule !== mem.dernierePilule) {
        mem.dernierePilule = enPilule
        setPilule(enPilule)
        // L'emplacement ne s'efface que lorsque le robot se pose reellement.
        html.dataset.robotPose = enPilule ? "1" : "0"
      }

      // Le fantome : la seconde recherche.
      const f = cible.fantome
      const fo = f ? f.force : 0
      N.fo = mix(N.fo, fo, k)
      if (f) {
        N.fx = mix(N.fx, f.x, k)
        N.fy = mix(N.fy, f.y, k)
        N.fech = mix(N.fech, f.ech, k)
        const fg = regardVers({ x: N.fx, y: N.fy }, f.regard, c.now)
        N.fgx = mix(N.fgx, fg.x * 9, k)
        N.fgy = mix(N.fgy, fg.y * 6, k)
      }
      fan.style.setProperty("--tx", `${N.fx.toFixed(1)}px`)
      fan.style.setProperty("--ty", `${N.fy.toFixed(1)}px`)
      fan.style.setProperty("--ech", N.fech.toFixed(3))
      fan.style.setProperty("--fo", (N.fo * 0.9).toFixed(3))
      fan.style.setProperty("--gx", `${N.fgx.toFixed(2)}px`)
      fan.style.setProperty("--gy", `${N.fgy.toFixed(2)}px`)
      fan.style.setProperty("--bob", `${(reduit ? 0 : Math.sin(c.now / 520 + 1.7) * 4).toFixed(2)}px`)
      if (fan.dataset.humeur !== "curieux") fan.dataset.humeur = "curieux"

      // La bulle : un calque a part, au-dessus du contenu, posee dans la marge.
      const b = cible.bulle
      const largeur = b?.largeur ?? borne(c.marge - 24, 0, 200)
      const utile = !!b && largeur >= 110 && pose < 0.2
      const cle = utile && b ? `${b.titre ?? ""}|${b.texte}` : ""
      if (cle !== mem.bulleCle) {
        mem.bulleCle = cle
        bul.dataset.on = "0"
        window.clearTimeout(mem.bulleMin)
        if (utile && b) {
          const poser = () => {
            titre.textContent = b.titre ?? ""
            texte.textContent = b.texte
            bul.dataset.on = "1"
          }
          if (snap) poser()
          else mem.bulleMin = window.setTimeout(poser, 200)
        }
      }
      if (utile && b) {
        // Au-dessus si la place existe sous l'en-tete, sinon dessous.
        const hauteur = bul.offsetHeight || 70
        const placeDessus = N.y - 113 * N.ech - 10 - hauteur >= c.haut
        const dessous = b.place === "dessous" || !placeDessus
        bul.style.setProperty("--bw", `${largeur}px`)
        bul.style.setProperty("--bx", `${borne(N.x, largeur / 2 + 8, c.W - largeur / 2 - 8).toFixed(1)}px`)
        bul.style.setProperty(
          "--by",
          `${(dessous ? N.y + 96 * N.ech + 10 : N.y - 113 * N.ech - 10).toFixed(1)}px`,
        )
        bul.style.setProperty("--bdy", dessous ? "0%" : "-100%")
      }
    }

    // ======================================================================
    //  BOUCLE, EVENEMENTS
    // ======================================================================

    const actif = () => large.matches

    const image = (now: number) => {
      const dt = Math.min(now - dernierTemps, 64)
      dernierTemps = now
      if (!actif()) return
      N.vitesse = N.vitesse * 0.9 + N.brut * 0.01
      N.brut = 0
      N.dy = N.dy * 0.85 + N.dyBrut * 0.15
      N.dyBrut = 0
      N.angle += (dt / 16.7) * (0.12 + N.vitesse)
      const c = calculer(now)
      peindre(c, dt, false)
    }
    const boucle = (now: number) => {
      image(now)
      rafId = requestAnimationFrame(boucle)
    }

    const surDefilement = () => {
      const y = window.scrollY
      N.dyBrut += borne(y - N.dernierY, -90, 90)
      N.brut += Math.min(Math.abs(y - N.dernierY), 90) // plafonne : un saut d'ancre ne doit pas faire exploser l'objet
      N.dernierY = y
      if (!actif()) return
      // Les evenements de defilement continuent d'arriver quand le navigateur
      // suspend les images (onglet en arriere-plan) : on peint alors sans lissage,
      // pour que le robot soit juste au retour sur l'onglet.
      if (document.visibilityState !== "visible") {
        const c = calculer(performance.now(), true)
        peindre(c, 16, true)
      }
    }
    const surReveil = () => {
      if (document.visibilityState !== "visible" || !actif()) return
      N.dernierY = window.scrollY
      const c = calculer(performance.now(), true)
      peindre(c, 16, true)
    }
    const surSouris = (e: PointerEvent) => {
      mem.souris = { x: e.clientX, y: e.clientY, t: performance.now() }
      const cible1 = (e.target as Element | null)?.closest?.("a, button, [role=tab]") ?? null
      mem.survol = cible1 && !cible1.closest(".obj") ? cible1 : null
    }
    const surClic = (e: MouseEvent) => {
      const tab = (e.target as Element | null)?.closest?.(".onglet")
      if (tab) mem.clic = { ...centre(tab.getBoundingClientRect()), t: performance.now() }
    }

    document.addEventListener("visibilitychange", surReveil)
    window.addEventListener("scroll", surDefilement, { passive: true })
    window.addEventListener("resize", surDefilement, { passive: true })
    window.addEventListener("pointermove", surSouris, { passive: true })
    document.addEventListener("click", surClic)

    if (actif()) {
      const c = calculer(performance.now(), true)
      peindre(c, 16, true) // juste des la premiere peinture, sans attendre une image
    }
    rafId = requestAnimationFrame(boucle)

    // Point d'entree pour les tests : rejoue un calcul complet sans lissage.
    ;(window as unknown as { __robot?: () => Record<string, unknown> }).__robot = () => {
      const c = calculer(performance.now(), true)
      peindre(c, 16, true)
      return { scene: mem.scene, cible, etat: { ...N }, ctx: c }
    }

    return () => {
      window.cancelAnimationFrame(rafId)
      window.clearTimeout(mem.bulleMin)
      large.removeEventListener("change", majService)
      document.removeEventListener("visibilitychange", surReveil)
      window.removeEventListener("scroll", surDefilement)
      window.removeEventListener("resize", surDefilement)
      window.removeEventListener("pointermove", surSouris)
      document.removeEventListener("click", surClic)
      TOUS_ATTRS.forEach((a) => marquer(a, []))
      delete html.dataset.robotActif
      delete html.dataset.robotPose
      delete html.dataset.robotScene
      delete (window as unknown as { __robot?: unknown }).__robot
    }
  }, [])

  return (
    <>
      <div ref={racine} className={`obj ${pilule ? "obj--pose" : ""}`} data-humeur="neutre">
        <div className="obj__halo" aria-hidden="true" />
        <div className="obj__scene" aria-hidden="true">
          <div className="obj__cube">
            <div className="obj__f" />
            <div className="obj__f" />
            <div className="obj__f" />
            <div className="obj__f" />
            <div className="obj__f" />
            <div className="obj__f" />
          </div>
          <div className="obj__coeur">
            <div className="obj__d" />
            <div className="obj__d" />
            <div className="obj__d" />
          </div>
          <div className="obj__bot">
            <Visage />
          </div>
          <div className="obj__noyau" />
        </div>
        {pilule ? (
          <Link href="/contact" className="obj__pilule">
            Me contacter
          </Link>
        ) : null}
      </div>

      {/* La seconde recherche, quand deux se font en parallele. */}
      <div ref={fantome} className="obj-fantome" data-humeur="curieux" aria-hidden="true">
        <div className="obj__bot">
          <Visage />
        </div>
      </div>

      {/* Calque a part : la bulle reste lisible meme si le robot est derriere le contenu. */}
      <div ref={bulle} className="obj-bulle" data-on="0" aria-hidden="true">
        <b ref={bulleTitre} />
        <span ref={bulleTexte} />
      </div>
    </>
  )
}
