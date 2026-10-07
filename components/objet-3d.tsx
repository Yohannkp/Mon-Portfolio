"use client"

import { useEffect, useRef } from "react"
import { EXPRESSIONS, cheminBouche, nouvelleExpr, versExpr, type Humeur } from "@/components/robot-emotions"
import { t as tr } from "@/lib/langue"

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
 *   contact       il reste grand dans son cercle, au-dessus du titre, et
 *                 regarde le bouton « Me contacter »
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
  /** Passe devant le contenu : pour se poser dans un emplacement reserve (le guide d'une demonstration). */
  devant?: boolean
  /** Il est passe dans la marge de gauche (visite automatique) : la legende du rail s'efface pour lui laisser la place. */
  gauche?: boolean
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
const PREUVES: { badge: string; texte: [string, string] }[] = [
  { badge: "Go", texte: ["Backend d'un moteur de traitement de données en production — stage 2026", "Backend of a data-processing engine in production — 2026 internship"] },
  { badge: "Fine-tuning LoRA / QLoRA", texte: ["Affinage de Qwen2-0.5B dans Mina-Translator", "Fine-tuning of Qwen2-0.5B in Mina-Translator"] },
  { badge: "Docker", texte: ["Compose, images et conteneurs — stage, et RAG-Local", "Compose, images and containers — internship, and RAG-Local"] },
  { badge: "ETL", texte: ["Moteur de traitement de données — stage 2026", "Data-processing engine — 2026 internship"] },
]

const IDS = [
  "sec-rag",
  "sec-chiffres",
  "sec-stations",
  "sec-demos",
  "sec-apropos",
  "sec-competences",
  "sec-formations",
  "sec-methode",
  "sec-veille",
  "sec-contact",
]

/** Un accessoire du visage, partage par le robot et par son fantome. */
const EPAULE_X = 84
const EPAULE_Y = 44
const ARM = { L1: 70, L2: 72 }

/**
 * Dessine un bras : epaule fixe, main donnee, coude calcule (cinematique inverse a deux os, coude vers l'exterieur et le bas).
 * Le bras n'est PAS fait de deux batons : c'est un seul tube souple, une courbe qui passe par l'epaule, le coude et la main,
 * dont la largeur diminue vers le poignet. Aucune articulation visible, donc rien qui « casse » quand le coude bouge.
 * `k` (0..1) fait « pousser » le bras ; `bd` (0..1) tend l'index ; `ouv` (0..1) ouvre la main a plat (le poing serre a 0).
 */
function dessinerBras(el: HTMLElement, cote: 1 | -1, h: { x: number; y: number }, k: number, bd: number, ouv: number, resp: number) {
  const g = el.querySelector(`.obj__bras-${cote === 1 ? "d" : "g"}`)
  if (!g) return
  const $ = (sel: string) => g.querySelector<SVGElement>(sel)!
  const kk = Math.max(k, 0.05)
  const L1 = ARM.L1 * Math.max(k, 0.02)
  const L2 = ARM.L2 * Math.max(k, 0.02)
  const sx = EPAULE_X * cote
  const sy = EPAULE_Y + resp
  let dx = h.x * cote - sx
  let dy = h.y - sy
  let d = Math.hypot(dx, dy) || 1
  const dc = Math.min(L1 + L2 - 0.5, Math.max(Math.abs(L1 - L2) + 0.5, d))
  const ux = dx / d
  const uy = dy / d
  dx = ux * dc
  dy = uy * dc
  d = dc
  const a = (L1 * L1 - L2 * L2 + d * d) / (2 * d)
  const hh = Math.sqrt(Math.max(0, L1 * L1 - a * a))
  const c1 = { x: sx + ux * a - uy * hh, y: sy + uy * a + ux * hh }
  const c2 = { x: sx + ux * a + uy * hh, y: sy + uy * a - ux * hh }
  const note = (p: { x: number; y: number }) => p.x * cote + p.y * 0.6
  const e = note(c1) > note(c2) ? c1 : c2
  const hx = sx + dx
  const hy = sy + dy
  const f = (v: number) => v.toFixed(1)
  const set = (sel: string, attr: string, v: string) => $(sel).setAttribute(attr, v)

  // Le tube : une courbe de Bezier quadratique qui passe exactement par le coude en son milieu.
  const cx = 2 * e.x - (sx + hx) / 2
  const cy = 2 * e.y - (sy + hy) / 2
  const N = 14
  const pts: { x: number; y: number; nx: number; ny: number; w: number }[] = []
  for (let i = 0; i <= N; i++) {
    const t = i / N
    const u = 1 - t
    const x = u * u * sx + 2 * u * t * cx + t * t * hx
    const y = u * u * sy + 2 * u * t * cy + t * t * hy
    let tx = 2 * u * (cx - sx) + 2 * t * (hx - cx)
    let ty = 2 * u * (cy - sy) + 2 * t * (hy - cy)
    const tn = Math.hypot(tx, ty) || 1
    tx /= tn
    ty /= tn
    // Un peu plus large a l'epaule et au coude (le muscle), fin au poignet.
    const w = (10 - 4.4 * t + 1.2 * Math.sin(Math.PI * t)) * kk
    pts.push({ x, y, nx: -ty, ny: tx, w })
  }
  const gauche = pts.map((p) => `${f(p.x + p.nx * p.w)} ${f(p.y + p.ny * p.w)}`)
  const droite = pts.map((p) => `${f(p.x - p.nx * p.w)} ${f(p.y - p.ny * p.w)}`).reverse()
  const dernier = pts[N]
  const premier = pts[0]
  set(
    ".b-bras",
    "d",
    `M${gauche.join(" L")} A${f(dernier.w)} ${f(dernier.w)} 0 0 0 ${droite[0]} L${droite.join(" L")} A${f(premier.w)} ${f(premier.w)} 0 0 0 ${gauche[0]}Z`,
  )
  // Un reflet le long du bras : il donne le volume (la lumiere vient d'en haut a gauche).
  set(".b-lueur", "d", `M${pts.map((p) => `${f(p.x + p.nx * p.w * 0.35)} ${f(p.y + p.ny * p.w * 0.35)}`).join(" L")}`)
  set(".b-epaule", "cx", f(sx))
  set(".b-epaule", "cy", f(sy))

  // La main : direction de l'avant-bras. Poing = sphere dense ; paume ouverte = plan (doigts ecartes) ; index tendu pour montrer.
  let fx = hx - e.x
  let fy = hy - e.y
  const fn = Math.hypot(fx, fy) || 1
  fx /= fn
  fy /= fn
  const pr = (11 + 2.5 * (1 - ouv) * (1 - bd) - 1 * ouv) * kk
  const px = hx + fx * 4
  const py = hy + fy * 4
  set(".b-paume", "cx", f(px))
  set(".b-paume", "cy", f(py))
  set(".b-paume", "r", f(pr))
  const doigt = (sel: string, ang: number, long: number, larg: number) => {
    if (long < 1.5) return set(sel, "d", "")
    const cs = Math.cos(ang * cote)
    const sn = Math.sin(ang * cote)
    const dx2 = fx * cs - fy * sn
    const dy2 = fx * sn + fy * cs
    const x1 = px + dx2 * pr * 0.55
    const y1 = py + dy2 * pr * 0.55
    const x2 = x1 + dx2 * long
    const y2 = y1 + dy2 * long
    const nx = -dy2
    const ny = dx2
    set(
      sel,
      "d",
      `M${f(x1 + nx * larg)} ${f(y1 + ny * larg)} L${f(x2 + nx * larg * 0.8)} ${f(y2 + ny * larg * 0.8)} A${f(larg * 0.8)} ${f(larg * 0.8)} 0 0 0 ${f(x2 - nx * larg * 0.8)} ${f(y2 - ny * larg * 0.8)} L${f(x1 - nx * larg)} ${f(y1 - ny * larg)}Z`,
    )
  }
  const ecart = ouv * (1 - bd)
  doigt(".b-index", -0.5 * ecart, Math.max(31 * bd, 19 * ouv) * kk, 4.4 * kk)
  doigt(".b-doigt-1", -0.12 * ecart, 20 * ecart * kk, 4.2 * kk)
  doigt(".b-doigt-2", 0.28 * ecart, 19 * ecart * kk, 4.1 * kk)
  doigt(".b-doigt-3", 0.66 * ecart, 15 * ecart * kk, 3.8 * kk)
  set(".b-pouce", "cx", f(px - fy * cote * (10 + 2 * ouv) - fx * 1))
  set(".b-pouce", "cy", f(py + fx * cote * (10 + 2 * ouv) - fy * 1))
}

/** Les bras, qui ne servent qu'a la colere. Les os, les articulations et la main sont dessines par le JS a chaque image (cinematique inverse). */
function Bras() {
  const cote = (c: "g" | "d") => (
    <g className={`obj__bras-${c}`}>
      <path className="b-os b-bras" />
      <path className="b-lueur" />
      <circle className="b-art b-epaule" r="11" />
      <path className="b-main b-index" />
      <path className="b-main b-doigt b-doigt-1" />
      <path className="b-main b-doigt b-doigt-2" />
      <path className="b-main b-doigt b-doigt-3" />
      <circle className="b-main b-paume" />
      <circle className="b-main b-pouce" r="5.5" />
    </g>
  )
  return (
    <svg className="obj__bras" viewBox="-170 -170 340 340" aria-hidden="true">
      {cote("g")}
      {cote("d")}
    </svg>
  )
}

function Visage() {
  return (
    <div className="obj__corps">
      <div className="obj__antenne" />
      <div className="obj__tete" />
      <div className="obj__visiere">
        <span className="obj__sourcil obj__sourcil--g" />
        <span className="obj__sourcil obj__sourcil--d" />
        <div className="obj__yeux">
          <span className="obj__oeil obj__oeil--g" />
          <span className="obj__oeil obj__oeil--d" />
        </div>
      </div>
      <svg className="obj__bouche" viewBox="-30 -14 60 28" aria-hidden="true">
        <path d="M-11 0 Q0 2 11 0" />
      </svg>
      <div className="obj__anneau" />
    </div>
  )
}

export function Objet3D() {
  const racine = useRef<HTMLDivElement>(null)
  const fantome = useRef<HTMLDivElement>(null)
  const bulle = useRef<HTMLDivElement>(null)
  const bulleTitre = useRef<HTMLElement>(null)
  const bulleTexte = useRef<HTMLSpanElement>(null)

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
      etapeDemo: "",
      visite: "",
      clic: null as (Point & { t: number }) | null,
      souris: { x: -1, y: -1, t: -1e9 },
      lu: 0,
      luT: 0,
      etape: -1,
      etapeT: 0,
      marques: new Map<string, Set<Element>>(),
      bulleCle: "",
      bulleMin: 0,
      survol: null as Element | null,
      // Vie du visage : clignements irreguliers, micro-saccades du regard, emotion ponctuelle (evenement), chatouilles.
      clin: 0,
      sacc: { x: 0, y: 0, t: 0 },
      emo: null as { h: Humeur; jusqua: number } | null,
      pokes: [] as number[],
      dBouche: "",
      dernierScroll: 0,
      tf: "",
      op: "",
      ftf: "",
      fop: "",
    }
    const X = nouvelleExpr()
    /**
     * Ecrit une variable CSS seulement si sa valeur a change : une ecriture identique n'est pas gratuite (elle invalide le style
     * de tout le sous-arbre du robot), et la plupart des variables ne bougent pas d'une image a l'autre (expression stable, fantome inactif...).
     */
    const memoVars = (cible: HTMLElement) => {
      const m = new Map<string, string>()
      return (nom: string, v: string) => {
        if (m.get(nom) === v) return
        m.set(nom, v)
        cible.style.setProperty(nom, v)
      }
    }
    const vEl = memoVars(el)
    const vFan = memoVars(fan)
    const vBul = memoVars(bul)
    const boucheEl = el.querySelector<SVGPathElement>(".obj__bouche path")
    const scene = el.querySelector<HTMLElement>(".obj__scene")
    const bot = el.querySelector<HTMLElement>(".obj__bot")
    const anneau = el.querySelector<HTMLElement>(".obj__anneau")
    const yeux = el.querySelector<HTMLElement>(".obj__yeux")
    const dernieres = new WeakMap<HTMLElement, Record<string, string>>()
    /** Ecrit une propriete de style en ligne seulement si elle a change. */
    const pose = (cible: HTMLElement | null, prop: "transform" | "rotate", v: string) => {
      if (!cible) return
      const m = dernieres.get(cible) ?? {}
      if (m[prop] === v) return
      m[prop] = v
      dernieres.set(cible, m)
      cible.style[prop] = v
    }

    // --- La colere : le visiteur file devant les simulations -------------------------------------------
    // Une fois par visite : le robot se fache, devient tout rouge, se balance, descend pour prendre de l'elan,
    // puis remonte en TIRANT la page avec lui jusqu'a la section des simulations. Fluide de bout en bout :
    // tout est une fonction du temps, la page et le robot partent du meme mouvement.
    const R = { etat: "non" as "non" | "joue", t0: 0, y0: 0, yCible: 0, yFixe: false, dx: 0, dy: 0, rot: 0, rage: 0, sq: 0, rk: 1, fier: false, choc: false, offChoc: 0, lock: false, glisse: false, montre: false, gx0: 0, gy0: 0, gk0: 1, spx: 0, spy: 0, spk: 1 }
    const BR = { g: { x: 0, y: 0, vx: 0, vy: 0 }, d: { x: 0, y: 0, vx: 0, vy: 0 }, pdx: 0, pdy: 0, dirx: -0.6, diry: 0.8 }
    const choc = q(".obj-choc")
    const fuite = { dedans: false, entree: 0, prevMid: window.scrollY + window.innerHeight * 0.5 }

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
      const cartes = qa("#sec-stations .cas")
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
      const lien = cartes[idx].querySelector<HTMLElement>(".cas__lien")
      // Une fois la carte lue, le regard va au lien : c'est la que se decide la visite du depot.
      const versLien = depuis > 2200 && lien
      marquer("data-robot-vise", versLien && lien ? [lien] : [])
      // Ce que le projet demontre : c'est la, pas dans la techno, que se joue sa pertinence.
      const code = cartes[idx].querySelector(".cas__code b")?.textContent ?? ""
      const prouve = Array.from(cartes[idx].querySelectorAll(".cas__prouve li"))
        .map((li) => li.textContent)
        .join(" · ")
      // Pendant la visite, la carte presentee grandit et mord sur la marge : le robot se cale
      // sur son bord reel (le rect suit l'animation), il glisse donc avec elle, sans jamais passer dessous.
      const enFocus = cartes[idx].dataset.focus === "1"
      // De temps en temps, pendant la visite, il traverse la page jusqu'a la marge de GAUCHE, y reste quelques projets, puis revient.
      const gauche = enFocus && PROJETS_A_GAUCHE.has(idx) && r.left > 90
      const mC = enFocus ? Math.max(0, gauche ? r.left - 60 : c.W - r.right) : c.marge
      const xC = !enFocus ? c.xM : gauche ? (r.left + 36) / 2 : r.right + mC / 2
      const eC = enFocus ? borne((mC - 34) / (gauche ? 190 : 215), 0.3, 0.62) : c.echM
      // Pendant la traversee il passe DEVANT le contenu (sinon les cartes le cacheraient), puis se pose.
      const traverse = enFocus && Math.abs(N.x - xC) > 60
      const largeurBulle = borne(mC - 24, 0, 200)
      return {
        x: xC,
        y: borne(centre(r).y, c.H * 0.28, c.H * 0.72),
        ech: eC,
        op: 0.95,
        regard: versLien && lien ? centre(lien.getBoundingClientRect()) : { x: r.left + r.width * 0.32, y: r.top + r.height * 0.4 },
        humeur: depuis < 900 ? "content" : "neutre",
        // Trop etroit pour la bulle (ecran a peine plus large que 1281 px) : elle se tait, la visite a deja sa phrase.
        bulle: { titre: code, texte: prouve ? tr(`Démontre : ${prouve}`, `Demonstrates: ${prouve}`) : "", largeur: largeurBulle },
        devant: traverse,
        gauche,
      }
    }

    /**
     * DEMOS — il guide la visite.
     * Chaque simulation est une visite en etapes que le robot explique (voir
     * components/sections/demo-guide.tsx). Il se pose dans la colonne du guide, devant
     * le panneau, regarde ce que l'etape montre (data-guide-focus) et prend l'humeur
     * de l'etape. Le texte, lui, est dans la page : lisible, selectionnable, accessible.
     * S'il n'y a pas de place pour lui dans le panneau (defilement, ecran etroit),
     * il retourne dans la marge et se tait.
     */
    const demos = (c: Ctx): Sortie => {
      const panneau = rect("#sec-demos .demo")
      const zone = q<HTMLElement>("#sec-demos .demo[data-guide]")
      const fin = zone?.dataset.fin === "1"
      const inactifs = qa("#sec-demos .onglet").filter((o) => !o.classList.contains("onglet--actif"))
      // Une visite terminee : les autres scenarios s'allument.
      marquer("data-robot-invite", fin ? inactifs : [])
      // Un clic sur un onglet attire son regard un instant.
      const clic = mem.clic && c.now - mem.clic.t < 800 ? mem.clic : null

      const slot = rect("#sec-demos [data-guide-slot]")
      if (zone && slot && slot.height > 0 && slot.top >= c.haut - 10 && slot.bottom <= c.H + 10) {
        const etape = `${zone.dataset.etape ?? ""}|${zone.querySelector(".gd__titre")?.textContent ?? ""}`
        if (etape !== mem.etapeDemo) {
          mem.etapeDemo = etape
          N.saut = -14 // un petit bond : on passe a l'etape suivante
        }
        const foyer = zone.querySelector("[data-guide-focus]")
        const s0 = centre(slot)
        const cible1 = inactifs[0]?.getBoundingClientRect()
        return {
          x: s0.x,
          y: s0.y + 6,
          ech: borne(slot.height / 190, 0.4, 0.8),
          op: 1,
          devant: true,
          regard: clic ?? (fin && cible1 ? centre(cible1) : foyer ? centre(foyer.getBoundingClientRect()) : null),
          humeur: fin ? "content" : ((zone.dataset.humeur as Humeur | undefined) ?? "neutre"),
        }
      }
      mem.etapeDemo = ""
      const y = panneau
        ? borne((Math.max(panneau.top, 0) + Math.min(panneau.bottom, c.H)) / 2, c.H * 0.3, c.H * 0.7)
        : c.H * 0.5
      return {
        x: c.xM, y, ech: c.echM, op: 0.95,
        regard: clic ?? (panneau ? { x: panneau.left + panneau.width * 0.45, y } : null),
        humeur: fin ? "content" : "neutre",
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
        bulle: { texte: lu === phrases.length ? tr("Disponibilité", "Availability") : tr("Ma méthode", "My method") },
      }
    }

    /** FORMATION — il reste dans la marge, au niveau de la carte (cours de SQL, puis chaque certification) qu'on est en train de lire. */
    const formations = (c: Ctx): Sortie => {
      const cartes = qa("#sec-formations .formation, #sec-formations .badge-carte")
      if (!cartes.length) return marge(c, c.H * 0.5)
      let r = cartes[0].getBoundingClientRect()
      let ecart = Infinity
      for (const k of cartes) {
        const kr = k.getBoundingClientRect()
        const d = Math.abs(centre(kr).y - c.H * 0.52)
        if (d < ecart) {
          ecart = d
          r = kr
        }
      }
      return { x: c.xM, y: borne(centre(r).y, c.H * 0.3, c.H * 0.7), ech: c.echM, op: 0.95, regard: centre(r), humeur: "content" }
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
        bulle: badge && preuve ? { titre: preuve.badge, texte: tr(preuve.texte[0], preuve.texte[1]), place: "dessous", largeur: 232 } : null,
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

    /**
     * CONTACT — il reste dans son cercle, au-dessus du titre, et garde un oeil sur le bouton.
     * Le bouton « Me contacter » est un vrai bouton de la page : le robot ne le remplace pas.
     */
    const contact = (c: Ctx): Sortie => {
      const scene = rect("[data-scene-robot]")
      if (!scene || scene.height === 0) return marge(c, c.H * 0.5)
      const bouton = rect("#sec-contact a[href='/contact']")
      const s0 = centre(scene)
      return {
        x: s0.x,
        y: s0.y + 10,
        ech: borne((scene.height - 44) / 190, 0.5, 1.05),
        op: 1,
        humeur: "content",
        regard: bouton ? centre(bouton) : null,
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
      "sec-formations": formations,
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
    /** La colere (defilement trop rapide devant les simulations) n'a lieu qu'UNE fois par visite de la page : rechargee, elle peut revenir. */
let rageJouee = false

/** Les projets (0..6) pendant lesquels, dans la visite automatique, le robot va dans la marge de gauche. */
const PROJETS_A_GAUCHE = new Set([1, 2, 5])

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
      // Presentation automatique : un petit bond a chaque arret, comme s'il presentait la suite.
      const visite = html.dataset.visiteEtape ?? ""
      if (visite !== mem.visite) {
        mem.visite = visite
        if (visite && html.dataset.visite === "1") N.saut = -16
      }
      const id = sousLaLigne(H * 0.55)
      if (id !== mem.scene) {
        mem.scene = id
        html.dataset.robotScene = id
        N.saut = -16 // petit bond a l'arrivee dans une nouvelle scene
      }
      cible = (SCENES[id] ?? hero)(c)
      // Jamais sous l'en-tete fixe.
      cible.y = Math.max(cible.y, c.haut + 113 * cible.ech)

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
      if (N.init) {
        N.x = cible.x; N.y = cible.y; N.ech = cible.ech
        N.init = false
      }
      N.x = mix(N.x, cible.x, k)
      N.y = mix(N.y, cible.y, k)
      N.ech = mix(N.ech, cible.ech, k)
      N.op = mix(N.op, cible.op ?? 0.95, k)
      // Il s'incline dans le sens du defilement : on sent la vitesse de lecture.
      const penche = reduit ? 0 : borne(N.dy * 0.7, -7, 7)
      N.incl = mix(N.incl, (cible.incl ?? 0) + penche, k)
      N.saut *= snap ? 0 : Math.exp(-dt / 220)

      // Le regard : la direction du point regarde, plafonnee a l'amplitude de la visiere.
      // Un element interactif survole prend le regard : c'est ce que le visiteur va faire.
      const surv = mem.survol && document.contains(mem.survol) ? mem.survol : null
      const g = regardVers({ x: N.x, y: N.y }, surv ? centre(surv.getBoundingClientRect()) : cible.regard, c.now)
      // Micro-saccades : l'oeil ne fixe jamais un point parfaitement immobile (+/- 1 px, toutes les quelques centaines de ms).
      if (!reduit && c.now > mem.sacc.t) {
        mem.sacc = { x: Math.round((Math.random() * 2.4 - 1.2) * 10) / 10, y: Math.round((Math.random() * 1.6 - 0.8) * 10) / 10, t: c.now + 250 + Math.random() * 550 }
      }
      N.gx = mix(N.gx, g.x * 9 + mem.sacc.x, snap || reduit ? 1 : 1 - Math.exp(-dt / 90))
      N.gy = mix(N.gy, g.y * 6 + mem.sacc.y, snap || reduit ? 1 : 1 - Math.exp(-dt / 90))

      const bob = reduit ? 0 : Math.sin(c.now / 520) * 4 + N.saut

      vEl("--mut", N.mut.toFixed(4))
      // Ce qui bouge a chaque image (rotation du cube, bob, regard, inclinaison) est ecrit directement sur l'element concerne :
      // pas de variable heritee, donc aucun recalcul de style pour le reste du robot.
      const ry = N.angle.toFixed(2)
      pose(scene, "transform", `rotateX(-20deg) rotateY(${ry}deg)`)
      pose(bot, "transform", `rotateY(${(-N.angle).toFixed(2)}deg) rotateX(20deg) translateY(${bob.toFixed(2)}px) scale(${(0.6 + N.mut * 0.4).toFixed(3)})`)
      pose(bot, "rotate", `${N.incl.toFixed(2)}deg`)
      pose(anneau, "transform", `rotateX(72deg) rotateZ(${(N.angle * 0.6).toFixed(2)}deg)`)
      pose(yeux, "transform", `translate(${N.gx.toFixed(2)}px, ${N.gy.toFixed(2)}px)`)
      // Dans le guide d'une demonstration, il passe devant le panneau (qui a un fond).
      if (R.etat === "joue") jouerRage(c, dt)
      // Position, taille et opacite : ecrites DIRECTEMENT sur l'element (pas en variables CSS). Une variable heritee qui change
      // oblige le navigateur a recalculer le style de tout le sous-arbre du robot a chaque image ; une propriete directe, non.
      const joue = R.etat === "joue"
      const tf = joue
        ? `translate3d(${(N.x + R.dx).toFixed(1)}px, ${(N.y + R.dy).toFixed(1)}px, 0) scale(${(N.ech * R.rk).toFixed(3)}) rotate(${R.rot.toFixed(2)}deg) scale(${(1 + R.sq * 0.16).toFixed(3)}, ${(1 - R.sq * 0.26).toFixed(3)})`
        : `translate3d(${N.x.toFixed(1)}px, ${N.y.toFixed(1)}px, 0) scale(${N.ech.toFixed(3)})`
      if (tf !== mem.tf) {
        mem.tf = tf
        el.style.transform = tf
      }
      const op = N.op.toFixed(3)
      if (op !== mem.op) {
        mem.op = op
        el.style.opacity = op
      }
      const devant = cible.devant || R.etat === "joue" ? "1" : "0"
      if (el.dataset.devant !== devant) el.dataset.devant = devant
      const gauche = cible.gauche ? "1" : "0"
      if (html.dataset.robotGauche !== gauche) html.dataset.robotGauche = gauche
      // Quelle emotion ? Un evenement ponctuel (pause, fin de visite...) prime, puis la reaction au survol, puis la scene.
      if (mem.emo && c.now > mem.emo.jusqua) mem.emo = null
      const anim = el.dataset.anim
      const humeur: Humeur = mem.emo
        ? mem.emo.h
        : anim === "fier"
          ? "fier"
          : anim === "avant"
            ? "surpris"
            : anim === "tour" || anim === "balance"
              ? "content"
              : surv && (cible.humeur ?? "neutre") === "neutre"
                ? "curieux"
                : (cible.humeur ?? "neutre")
      // Les yeux en arc (CSS) pour la joie et la fierte : le « sourire de Duchenne ».
      const attr = humeur === "fier" ? "content" : humeur
      if (el.dataset.humeur !== attr) el.dataset.humeur = attr

      // Transition d'un etat a l'autre : amortie (les muscles ont une masse), jamais lineaire.
      versExpr(X, EXPRESSIONS[humeur], snap || reduit ? 1 : 1 - Math.exp(-dt / 150))
      // Quand la voix parle, la bouche s'ouvre et se ferme (elle « articule » sans texte : deux oscillations desaccordees).
      const parle = !reduit && document.documentElement.dataset.robotParle === "1"
        ? 0.12 + 0.42 * Math.abs(Math.sin(c.now / 68)) * (0.55 + 0.45 * Math.abs(Math.sin(c.now / 213)))
        : 0
      vEl("--ex", X.ex.toFixed(3))
      vEl("--eyl", X.eyl.toFixed(3))
      vEl("--eyr", X.eyr.toFixed(3))
      vEl("--bt", `${X.bt.toFixed(2)}deg`)
      vEl("--byl", `${X.byl.toFixed(2)}px`)
      vEl("--byr", `${X.byr.toFixed(2)}px`)
      vEl("--bo", X.bo.toFixed(3))
      const dBouche = cheminBouche(X, parle)
      if (dBouche !== mem.dBouche) {
        mem.dBouche = dBouche
        boucheEl?.setAttribute("d", dBouche)
      }

      // Le clignement : un passage rapide a la ligne (~140 ms), a intervalles irreguliers de 2 a 6 s, parfois double.
      if (!reduit && c.now > mem.clin) {
        el.dataset.clin = "1"
        window.setTimeout(() => {
          delete el.dataset.clin
        }, 150)
        mem.clin = c.now + (Math.random() < 0.16 ? 330 : 2000 + Math.random() * 4000)
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
      const ftf = `translate3d(${N.fx.toFixed(1)}px, ${N.fy.toFixed(1)}px, 0) scale(${N.fech.toFixed(3)})`
      if (ftf !== mem.ftf) {
        mem.ftf = ftf
        fan.style.transform = ftf
      }
      const fop = (N.fo * 0.9).toFixed(3)
      if (fop !== mem.fop) {
        mem.fop = fop
        fan.style.opacity = fop
      }
      vFan("--gx", `${N.fgx.toFixed(2)}px`)
      vFan("--gy", `${N.fgy.toFixed(2)}px`)
      if (N.fo > 0.01) vFan("--bob", `${(reduit ? 0 : Math.sin(c.now / 520 + 1.7) * 4).toFixed(2)}px`)
      if (fan.dataset.humeur !== "curieux") fan.dataset.humeur = "curieux"

      // La bulle : un calque a part, au-dessus du contenu, posee dans la marge.
      const b = cible.bulle
      const largeur = b?.largeur ?? borne(c.marge - 24, 0, 200)
      const utile = !!b && largeur >= 110
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
        vBul("--bw", `${largeur}px`)
        vBul("--bx", `${borne(N.x, largeur / 2 + 8, c.W - largeur / 2 - 8).toFixed(1)}px`)
        vBul(
          "--by",
          `${(dessous ? N.y + 96 * N.ech + 10 : N.y - 113 * N.ech - 10).toFixed(1)}px`,
        )
        vBul("--bdy", dessous ? "0%" : "-100%")
      }
    }

    // ======================================================================
    //  BOUCLE, EVENEMENTS
    // ======================================================================

    const actif = () => large.matches

    const image = (now: number) => {
      const dt = Math.min(now - dernierTemps, 64)
      dernierTemps = now
      if (!actif()) {
        // Passe sous 1281 px en pleine colere (fenetre retrecie, tablette tournee) : la sequence ne peut plus aller
        // jusqu'a son terme, c'est donc ici qu'il faut rendre le defilement, sinon la page resterait bloquee.
        if (R.etat === "joue") finRage()
        return
      }
      N.vitesse = N.vitesse * 0.9 + N.brut * 0.01
      N.brut = 0
      N.dy = N.dy * 0.85 + N.dyBrut * 0.15
      N.dyBrut = 0
      N.angle += (dt / 16.7) * (0.12 + N.vitesse)
      const c = calculer(now)
      peindre(c, dt, false)
    }
    // Au repos (ni defilement, ni souris, ni visite, ni voix, ni reaction en cours), le robot ne fait que tourner et respirer tres
    // lentement : une image sur deux suffit, on ne le voit pas, et le processeur (la batterie) respire. Les durees etant mesurees
    // en temps reel (dt), rien ne change au mouvement.
    let parite = false
    const auRepos = (now: number) =>
      now - mem.dernierScroll > 1500 &&
      now - mem.souris.t > 1500 &&
      R.etat !== "joue" &&
      !mem.survol &&
      !el.dataset.anim &&
      html.dataset.visite !== "1" &&
      html.dataset.robotParle !== "1"
    const boucle = (now: number) => {
      rafId = requestAnimationFrame(boucle)
      if (auRepos(now)) {
        parite = !parite
        if (parite) return
      }
      image(now)
    }

    const ease = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2)
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3)
    /** Le defilement est verrouille pendant tout le trajet (le robot ramene la page) : aucune main ne peut lutter avec lui. */
    const verrou = (on: boolean) => {
      if (on) html.dataset.scrollVerrou = "1"
      else delete html.dataset.scrollVerrou
    }
    const finRage = () => {
      R.etat = "non"
      verrou(false)
      delete html.dataset.robotRage
      delete el.dataset.rage
      for (const v of ["--rage", "--bk"]) el.style.removeProperty(v)
      delete q("#sec-demos")?.dataset.robotMontre
    }
    const lancerRage = (top: number) => {
      rageJouee = true
      Object.assign(R, { montre: false, etat: "joue", t0: performance.now(), y0: window.scrollY, yCible: Math.max(0, top - 110), yFixe: false, dx: 0, dy: 0, rot: 0, rage: 0, sq: 0, rk: 1, fier: false, choc: false, offChoc: 0, lock: true, glisse: false })
      BR.pdx = 0
      BR.pdy = 0
      for (const c of [BR.g, BR.d]) Object.assign(c, { x: EPAULE_X, y: EPAULE_Y, vx: 0, vy: 0 })
      html.dataset.robotRage = "1"
      el.dataset.rage = "1"
      verrou(true)
      mem.emo = { h: "colere", jusqua: R.t0 + 2500 }
      N.saut = -22
    }
    /** Le visiteur vient de traverser toute la section des simulations d'un trait : trop vite pour l'avoir vue. */
    const detecterFuite = () => {
      const mid = window.scrollY + window.innerHeight * 0.5
      const prev = fuite.prevMid
      fuite.prevMid = mid
      // Les verifications peu couteuses d'abord : la plupart du temps (colere deja jouee, visite en cours...) on ne mesure rien.
      if (rageJouee || R.etat === "joue" || reduit || html.dataset.visite === "1" || N.mut < 0.7) return
      const sec = q("#sec-demos")
      if (!sec) return
      const now = performance.now()
      const r = sec.getBoundingClientRect()
      const top = r.top + window.scrollY
      const bas = top + r.height
      if (mid >= top && mid <= bas && !fuite.dedans) {
        fuite.dedans = true
        fuite.entree = now
      } else if (mid < top) fuite.dedans = false
      if (!(mid > bas && prev <= bas)) return
      const dwell = prev < top ? 0 : fuite.dedans ? now - fuite.entree : 1e9
      fuite.dedans = false
      // S'il a joue avec la demonstration, il l'a vue : pas de colere.
      const demo = sec.querySelector<HTMLElement>(".demo")
      if (dwell < 1100 && demo && demo.dataset.etape === "0") lancerRage(top)
    }
    /**
     * La choregraphie (ms depuis le depart), pendant laquelle le defilement est verrouille :
     *   0 - 950       fache : rouge, poings qui battent, balancement qui s'eteint
     *   950 - 1600    descend (prend de l'elan), les bras en arriere
     *   1600 - 2500   s'elance vers le haut en s'accelerant, la page tiree derriere lui, bras dresses... et COGNE le plafond
     *   2500 - 3100   choc : ecrase, l'ecran tremble ; la page finit d'arriver aux simulations
     *   3100 - 3900   se rend devant la section, plus grand, et tend les bras vers elle
     *   3900 - 5600   la designe des deux mains (la section brille), en la montrant tour a tour
     *   5600 - 6300   se calme, rabaisse les bras et regagne sa place habituelle
     */
    const jouerRage = (c: Ctx, dt: number) => {
      const tt = c.now - R.t0
      const T1 = 950, T2 = 1600, TC = 2500, T3 = 3100, TG = 3900, TH = 5600, T4 = 6300, TL = 5000
      if (tt >= T2 && !R.yFixe) {
        R.yFixe = true
        R.y0 = window.scrollY
      }
      const haut = 113 * N.ech // du centre du robot au sommet de son antenne
      const offPlafond = -(N.y - haut) - 8 // decalage qui amene le sommet du robot au plafond (et un peu dans l'en-tete)
      const p2 = borne((tt - T1) / (T2 - T1), 0, 1)
      const p3 = borne((tt - T2) / (TC - T2), 0, 1)
      if (tt < TC) {
        const env = Math.min(1, tt / 160) * (1 - borne((tt - 750) / 200, 0, 1))
        R.dx = 9 * Math.sin(tt / 78) * env
        R.rot = 12 * Math.sin(tt / 78 + 0.6) * env - 6 * p2 * (1 - p3) - 7 * Math.sin(Math.PI * p3 * 0.9)
        // Il s'elance : le mouvement s'acccelere jusqu'au choc (courbe cubique), il ne ralentit pas avant de frapper.
        R.dy = tt < T2 ? 150 * easeOut(p2) : mix(150, offPlafond, p3 * p3 * p3)
        R.rage = tt < 450 ? ease(tt / 450) : 1
        R.sq = 0
        if (tt >= T2) {
          const pp = ease(borne((tt - (T2 + 100)) / (T3 - T2 - 100), 0, 1))
          window.scrollTo({ top: mix(R.y0, R.yCible, pp), behavior: "instant" as ScrollBehavior })
        }
      } else if (tt < T3) {
        if (!R.choc) {
          R.choc = true
          R.offChoc = offPlafond
          mem.emo = { h: "surpris", jusqua: c.now + 650 }
          if (choc) {
            choc.style.setProperty("--cx", `${N.x.toFixed(0)}px`)
            choc.dataset.on = "1"
            window.setTimeout(() => {
              delete choc.dataset.on
            }, 650)
          }
        }
        const tau = tt - TC
        const pp = ease(borne((tt - (T2 + 100)) / (T3 - T2 - 100), 0, 1))
        // Le choc : la page tremble (secousses amorties), le robot s'ecrase puis rebondit vers le bas.
        const tremble = 8 * Math.exp(-tau / 170) * Math.sin(tau / 11)
        window.scrollTo({ top: mix(R.y0, R.yCible, pp) + tremble, behavior: "instant" as ScrollBehavior })
        R.sq = Math.exp(-tau / 130)
        R.dy = R.offChoc + 110 * easeOut(borne(tau / 520, 0, 1))
        R.dx = 3 * Math.exp(-tau / 200) * Math.sin(tau / 40)
        R.rot = mix(R.rot, 0, 1 - Math.exp(-dt / 120))
        R.rage = 1
      } else {
        if (R.lock) window.scrollTo({ top: R.yCible, behavior: "instant" as ScrollBehavior })
        if (!R.glisse) {
          // Il va se placer devant la section : a droite du titre, dans le vide, un peu plus grand, tourne vers la demonstration.
          R.glisse = true
          const sec = q("#sec-demos")
          const demo = q("#sec-demos .demo")
          const rs = sec?.getBoundingClientRect()
          const rd = demo?.getBoundingClientRect()
          const spotX = Math.min(window.innerWidth * 0.76, window.innerWidth - 190)
          const spotY = borne((rs ? rs.top : 110) + 200, 210, window.innerHeight - 250)
          R.gx0 = R.dx
          R.gy0 = R.dy
          R.gk0 = R.rk
          R.spx = spotX - N.x
          R.spy = spotY - N.y
          R.spk = borne(0.8 / N.ech, 0.8, 2.4)
          const vx = (rd ? rd.left + rd.width * 0.42 : spotX - 300) - spotX
          const vy = (rd ? rd.top + rd.height * 0.3 : spotY + 300) - spotY
          const n = Math.hypot(vx, vy) || 1
          // Direction du geste : vers la demonstration, mais assez a l'horizontale pour que les bras se tendent et se lisent comme un « regardez ca ».
          const dy0 = borne(vy / n, 0.2, 0.5)
          BR.dirx = -Math.sqrt(1 - dy0 * dy0)
          BR.diry = dy0
          mem.emo = { h: "fier", jusqua: c.now + 1800 }
        }
        const k = 1 - Math.exp(-dt / 300)
        R.sq = mix(R.sq, 0, 1 - Math.exp(-dt / 90))
        R.rage = 1 - ease(borne((tt - T3 - 200) / 1000, 0, 1))
        if (tt >= TL && R.lock) {
          R.lock = false
          verrou(false)
        }
        if (tt < TH) {
          const g = ease(borne((tt - T3) / (TG - T3), 0, 1))
          R.dx = mix(R.gx0, R.spx, g)
          R.dy = mix(R.gy0, R.spy, g)
          R.rk = mix(R.gk0, R.spk, g)
          R.rot = mix(R.rot, -7 * g, k)
          if (tt >= TG && !R.montre) {
            R.montre = true
            mem.emo = { h: "fier", jusqua: c.now + (TH - TG) }
          }
        } else {
          const g = ease(borne((tt - TH) / (T4 - TH), 0, 1))
          R.dx = mix(R.spx, 0, g)
          R.dy = mix(R.spy, 0, g)
          R.rk = mix(R.spk, 1, g)
          R.rot = mix(R.rot, 0, k)
        }
        if (tt >= T4) return finRage()
      }

      // ---- Les bras ----------------------------------------------------------------------------------
      // Chaque phase a SON profil de mouvement (raideur / amortissement du ressort), comme le veut le langage du corps :
      //   colere      : bras droits et verrouilles, qui frappent l'air (raide, peu d'amortissement)
      //   elan        : bras en arriere, puis dresses avec DEPASSEMENT (overshoot) et retour elastique
      //   choc        : « snap » : les mains s'ouvrent d'un coup, paumes en avant (surprise, sans adoucissement)
      //   montrer     : ouvert, expansif, avec un leger rebond, index tendu
      //   retour      : mouvement LOURD, tres amorti (l'energie retombe), bras qui pendent
      // Une respiration (sinus sur l'epaule) fait que le corps n'est jamais fige : rapide et saccadee dans la colere, lente ensuite.
      const sec = tt >= T2 ? q("#sec-demos") : null
      if (sec && sec.dataset.robotMontre !== "1") sec.dataset.robotMontre = "1"
      const bk = ease(borne((tt - 250) / 550, 0, 1)) * (1 - ease(borne((tt - (T4 - 500)) / 450, 0, 1)))
      const bd = ease(borne((tt - T3) / 350, 0, 1)) * (1 - ease(borne((tt - TH) / 400, 0, 1)))
      // Paume ouverte : au choc (« stop ! » de surprise), elle se referme en l'index tendu quand il montre.
      const ouv = tt < TC ? 0 : tt < T3 ? 1 : 1 - ease(borne((tt - T3) / 350, 0, 1))
      const s = Math.max(dt, 1) / 1000
      const lagX = borne(-((R.dx - BR.pdx) / s) * 0.02, -40, 40)
      const lagY = borne(-((R.dy - BR.pdy) / s) * 0.02, -45, 45)
      BR.pdx = R.dx
      BR.pdy = R.dy
      const calme = ease(borne((tt - T3) / 900, 0, 1))
      const resp = (1 - calme) * (2.4 * Math.sin(tt / 62) + 1.2 * Math.sin(tt / 27 + 1)) + calme * 1.6 * Math.sin(tt / 420)
      const REACH = ARM.L1 + ARM.L2 - 4
      for (const cote of [1, -1] as const) {
        const h = cote === 1 ? BR.d : BR.g
        const tl = tt - (cote === 1 ? 0 : 70) // la main gauche est un peu decalee : le geste n'est pas symetrique
        let tx: number, ty: number
        let raideur: number, zeta: number
        if (tl < T1) {
          // Bras tendus, coudes verrouilles, qui fouettent l'air vers l'exterieur.
          const w = tl / 78 + (cote === 1 ? 0 : 1.7)
          const ang = ((58 + 16 * Math.sin(w)) * Math.PI) / 180 // depuis la verticale basse, vers l'exterieur
          tx = EPAULE_X + REACH * Math.sin(ang)
          ty = EPAULE_Y + REACH * Math.cos(ang)
          raideur = 320
          zeta = 0.55
        } else if (tl < T2) {
          const e = ease(borne((tl - T1) / (T2 - T1), 0, 1))
          tx = mix(EPAULE_X + REACH * 0.85, 118, e)
          ty = mix(EPAULE_Y + REACH * 0.52, 132, e)
          raideur = 170
          zeta = 0.7
        } else if (tl < TC) {
          const e = ease(borne((tl - T2) / (TC - T2), 0, 1))
          tx = mix(118, 62, e)
          ty = mix(132, -100, e)
          raideur = 150
          zeta = 0.32 // peu amorti : il depasse en haut puis rebondit
        } else if (tl < T3) {
          // Le « snap » de la surprise : quasi instantane, sans adoucissement.
          tx = 92
          ty = -78 + 34 * (1 - Math.exp(-(tl - TC) / 200))
          raideur = 900
          zeta = 0.75
        } else if (tl < TH) {
          // Les deux bras se tendent vers la section, puis la montrent tour a tour (petits coups vers l'avant).
          const g = ease(borne((tl - T3) / (TG - T3), 0, 1))
          const jab = tl > TG ? 0.07 * Math.sin((tl - TG) / 190 + (cote === 1 ? 0 : Math.PI)) : 0
          const px = EPAULE_X * cote + BR.dirx * REACH * (1 + jab)
          const py = EPAULE_Y + BR.diry * REACH * (1 + jab)
          tx = mix(92, px * cote, g)
          ty = mix(-44, py, g)
          raideur = 210
          zeta = 0.45 // un leger rebond a l'arrivee : l'enthousiasme
        } else {
          // L'energie retombe : geste lourd, tres amorti, les bras pendent.
          const e = ease(borne((tl - TH) / (T4 - TH - 200), 0, 1))
          tx = mix((EPAULE_X * cote + BR.dirx * REACH) * cote, 104, e)
          ty = mix(EPAULE_Y + BR.diry * REACH, 118, e)
          raideur = 70
          zeta = 0.95
        }
        tx += lagX * cote
        ty += lagY
        // Ressort amorti (integre par petits pas pour rester stable)
        const amort = 2 * zeta * Math.sqrt(raideur)
        for (let i = 0, n = Math.max(1, Math.ceil(s / 0.006)); i < n; i++) {
          const h8 = s / n
          h.vx += ((tx - h.x) * raideur - amort * h.vx) * h8
          h.vy += ((ty - h.y) * raideur - amort * h.vy) * h8
          h.x += h.vx * h8
          h.y += h.vy * h8
        }
        dessinerBras(el, cote, h, bk, bd, ouv, resp)
      }
      el.style.setProperty("--bk", bk.toFixed(3))
      el.style.setProperty("--rage", R.rage.toFixed(3))
    }

    const surDefilement = () => {
      mem.dernierScroll = performance.now()
      const y = window.scrollY
      N.dyBrut += borne(y - N.dernierY, -90, 90)
      N.brut += Math.min(Math.abs(y - N.dernierY), 90) // plafonne : un saut d'ancre ne doit pas faire exploser l'objet
      N.dernierY = y
      if (!actif()) return
      detecterFuite()
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
    // Survol du robot : quatre petites reactions, jamais deux fois la meme de suite.
    // Le robot est derriere le contenu (il ne recoit pas d'evenement) : on teste donc la position.
    const REACTIONS = [
      { nom: "fier", ms: 2000 },
      { nom: "avant", ms: 2200 },
      { nom: "tour", ms: 1300 },
      { nom: "balance", ms: 1900 },
    ]
    const reaction = { fin: 0, derniere: -1, dedans: false, t: 0 }
    const surRobot = (x: number, y: number) => {
      if (html.dataset.robotActif !== "1" || N.mut < 0.7 || N.op < 0.3) return false
      const r = el.getBoundingClientRect()
      const k = r.width / 340
      return Math.abs(x - (r.left + r.width / 2)) < 96 * k && Math.abs(y - (r.top + r.height / 2)) < 84 * k
    }
    const finirReaction = () => {
      delete el.dataset.anim
      delete html.dataset.robotAnim
    }
    const testerSurvol = (x: number, y: number) => {
      const dedans = !reduit && surRobot(x, y)
      if (dedans && !reaction.dedans && performance.now() > reaction.fin) {
        let i = Math.floor(Math.random() * REACTIONS.length)
        if (i === reaction.derniere) i = (i + 1) % REACTIONS.length
        reaction.derniere = i
        const { nom, ms } = REACTIONS[i]
        reaction.fin = performance.now() + ms + 250
        el.dataset.anim = nom
        html.dataset.robotAnim = nom
        // Un visiteur qui le chatouille trop finit par l'agacer : 3 survols en 10 s = colere, 5 = degout.
        const t = performance.now()
        mem.pokes = mem.pokes.filter((x) => t - x < 10000).concat(t)
        if (mem.pokes.length >= 5) mem.emo = { h: "degout", jusqua: t + 1700 }
        else if (mem.pokes.length >= 3) mem.emo = { h: "colere", jusqua: t + 1500 }
        window.clearTimeout(reaction.t)
        reaction.t = window.setTimeout(finirReaction, ms)
      }
      reaction.dedans = dedans
    }
    const surSouris = (e: PointerEvent) => {
      testerSurvol(e.clientX, e.clientY)
      mem.souris = { x: e.clientX, y: e.clientY, t: performance.now() }
      const cible1 = (e.target as Element | null)?.closest?.("a, button, [role=tab]") ?? null
      mem.survol = cible1 && !cible1.closest(".obj") ? cible1 : null
    }
    const surClic = (e: MouseEvent) => {
      const tab = (e.target as Element | null)?.closest?.(".onglet")
      if (tab) mem.clic = { ...centre(tab.getBoundingClientRect()), t: performance.now() }
    }

    // Le reste du site peut faire ressentir quelque chose au robot : window.dispatchEvent(new CustomEvent("robot-emotion", { detail: { humeur, ms } })).
    const surEmotion = (e: Event) => {
      const d = (e as CustomEvent<{ humeur: Humeur; ms?: number }>).detail
      if (d && EXPRESSIONS[d.humeur]) mem.emo = { h: d.humeur, jusqua: performance.now() + (d.ms ?? 1500) }
    }
    window.addEventListener("robot-emotion", surEmotion)
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
      window.clearTimeout(reaction.t)
      finirReaction()
      window.clearTimeout(mem.bulleMin)
      large.removeEventListener("change", majService)
      window.removeEventListener("robot-emotion", surEmotion)
      if (R.etat === "joue") finRage()
      document.removeEventListener("visibilitychange", surReveil)
      window.removeEventListener("scroll", surDefilement)
      window.removeEventListener("resize", surDefilement)
      window.removeEventListener("pointermove", surSouris)
      document.removeEventListener("click", surClic)
      TOUS_ATTRS.forEach((a) => marquer(a, []))
      delete html.dataset.robotActif
      delete html.dataset.robotScene
      delete html.dataset.robotGauche
      delete (window as unknown as { __robot?: unknown }).__robot
    }
  }, [])

  return (
    <>
      {/* Le fond qui s'assombrit quand le robot se met en avant (voir globals.css). */}
      <div className="obj-ombre" aria-hidden="true" />
      {/* L'impact du robot contre le plafond de l'ecran (colere devant les simulations). */}
      <div className="obj-choc" aria-hidden="true" />
      <div ref={racine} className="obj" data-humeur="neutre">
        <div className="obj__halo" aria-hidden="true" />
        <Bras />
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
