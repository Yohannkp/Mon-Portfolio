/**
 * Les emotions du robot, en geometrie pure : des points, des lignes, des courbes.
 *
 * Pas de visage 3D realiste (la « vallee de l'etrange ») : le cerveau reconnait un visage partout, il suffit
 * de deformer trois choses — les yeux, les sourcils, la bouche — selon les emotions de base de Paul Ekman.
 *   joie      : bouche a courbure positive ET yeux qui se plissent (le sourire de Duchenne, l'arc des yeux) ;
 *   tristesse : bouche a courbure negative, extremites INTERIEURES des sourcils vers le haut ;
 *   colere    : sourcils fortement inclines vers le centre, bouche resserree ;
 *   surprise  : yeux tres ouverts, sourcils tres hauts, bouche en ovale vertical ;
 *   degout    : asymetrique — un cote de la levre releve, yeux plisses inegalement.
 *
 * Ce qui donne la vie n'est pas la forme mais le mouvement : chaque valeur est amortie (inertie musculaire)
 * vers sa cible, les yeux clignent a intervalles irreguliers (2 a 6 s, ~140 ms), et le regard fait de
 * minuscules saccades. Tout est ecrit en variables CSS (yeux, sourcils) et en un seul trace SVG (bouche).
 */

export type Humeur = "neutre" | "concentre" | "content" | "curieux" | "fier" | "triste" | "colere" | "surpris" | "degout"

export type Expr = {
  /** Largeur des yeux (echelle). */
  ex: number
  /** Hauteur de chaque oeil (echelle) : gauche, droit. */
  eyl: number
  eyr: number
  /** Inclinaison des sourcils, en degres : > 0 = extremites interieures en haut (tristesse), < 0 = vers le bas (colere). */
  bt: number
  /** Position verticale des sourcils, en px : < 0 = plus haut. Gauche, droit. */
  byl: number
  byr: number
  /** Visibilite des sourcils. */
  bo: number
  /** Courbure de la bouche : > 0 sourire, < 0 moue. */
  mc: number
  /** Ouverture de la bouche (0 fermee, 1 grand ovale). */
  mo: number
  /** Largeur de la bouche (echelle). */
  mw: number
  /** Asymetrie de la bouche (degout) : > 0 releve le cote droit. */
  ma: number
}

const E = (o: Partial<Expr>): Expr => ({ ex: 1, eyl: 1, eyr: 1, bt: 0, byl: 0, byr: 0, bo: 0.5, mc: 0.1, mo: 0, mw: 1, ma: 0, ...o })

export const EXPRESSIONS: Record<Humeur, Expr> = {
  neutre: E({}),
  concentre: E({ ex: 1.05, eyl: 0.55, eyr: 0.55, bt: -5, byl: 2, byr: 2, bo: 0.75, mc: 0, mw: 0.8 }),
  curieux: E({ ex: 1.22, eyl: 1.22, eyr: 1.22, bt: 5, byl: -5, byr: -2, bo: 0.85, mc: 0.12, mw: 0.9 }),
  content: E({ bo: 0.6, byl: -1, byr: -1, mc: 0.95, mw: 1.25 }),
  fier: E({ bo: 0.7, byl: -3, byr: -3, bt: -2, mc: 0.7, mw: 1.15 }),
  triste: E({ eyl: 0.82, eyr: 0.82, bt: 15, byl: -1, byr: -1, bo: 0.95, mc: -0.85, mw: 0.9 }),
  colere: E({ eyl: 0.6, eyr: 0.6, bt: -22, byl: 3, byr: 3, bo: 1, mc: -0.3, mw: 0.85 }),
  surpris: E({ ex: 1.35, eyl: 1.45, eyr: 1.45, byl: -8, byr: -8, bo: 1, mc: 0, mo: 1, mw: 0.55 }),
  degout: E({ eyl: 0.5, eyr: 0.8, bt: -9, byl: 3, byr: -1, bo: 0.9, mc: -0.45, mw: 0.95, ma: 1 }),
}

export const nouvelleExpr = (): Expr => ({ ...EXPRESSIONS.neutre })

/** Amortit `x` vers `cible` (k entre 0 et 1) : l'inertie des muscles du visage. */
export function versExpr(x: Expr, cible: Expr, k: number) {
  for (const cle of Object.keys(cible) as (keyof Expr)[]) x[cle] += (cible[cle] - x[cle]) * k
}

/** Le trace de la bouche, dans un repere centre (viewBox -30 -14 60 28). */
export function cheminBouche(x: Expr, parle: number) {
  const w = 11 * x.mw
  const yl = -x.ma * 1
  const yr = -x.ma * 4
  const c = x.mc * 9
  const ouverte = Math.min(1, x.mo + parle)
  if (ouverte < 0.1) return `M${(-w).toFixed(1)} ${yl.toFixed(1)} Q0 ${(c * 2).toFixed(1)} ${w.toFixed(1)} ${yr.toFixed(1)}`
  // Bouche ouverte : deux courbes de Bezier cubiques, pour un ovale bien rond (et non un triangle).
  const haut = c * 0.9 - ouverte * 4
  const bas = c * 0.9 + ouverte * 13
  const a = w * 0.85
  return `M${(-w).toFixed(1)} ${yl.toFixed(1)} C${(-a).toFixed(1)} ${haut.toFixed(1)} ${a.toFixed(1)} ${haut.toFixed(1)} ${w.toFixed(1)} ${yr.toFixed(1)} C${a.toFixed(1)} ${bas.toFixed(1)} ${(-a).toFixed(1)} ${bas.toFixed(1)} ${(-w).toFixed(1)} ${yl.toFixed(1)} Z`
}
