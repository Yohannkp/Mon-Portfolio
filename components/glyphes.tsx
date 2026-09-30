import type { GlypheId } from "@/lib/dossiers"

/**
 * Un petit schema par projet : l'IDEE du projet, pas ses donnees.
 * Ce sont des illustrations (elles ne representent aucune mesure) ; les vrais
 * chiffres sont a cote, dans le dossier.
 *
 * Le mouvement ne vit pas ici : chaque element porte data-a et un delai (--d), et
 * le CSS (app/projets.css) les fait entrer quand l'ancetre [data-vu="1"] apparait.
 */

const d = (i: number, pas = 90) => ({ ["--d" as string]: `${i * pas}ms` }) as React.CSSProperties

function Rag() {
  return (
    <>
      <rect x="6" y="8" width="88" height="68" rx="9" className="gl__trait gl__doux" />
      {[0, 1, 2].map((i) => (
        <rect key={i} data-a style={d(i)} x="18" y={20 + i * 17} width="34" height="9" rx="2" className="gl__plein gl__doux" />
      ))}
      <g data-a style={d(3)}>
        <rect x="64" y="42" width="20" height="16" rx="3" className="gl__plein gl__accent" />
        <path d="M68 42 v-6 a6 6 0 0 1 12 0 v6" className="gl__trait gl__accent" />
      </g>
      <path data-a style={d(4)} d="M94 42 H120" className="gl__trait gl__doux gl__tirets" />
      <path data-a style={d(5)} d="M100 36 l10 12 M110 36 l-10 12" className="gl__trait gl__ko" />
      <path data-a style={d(4)} d="M118 46 a7 7 0 0 1 1-13 a9 9 0 0 1 17 3 a6 6 0 0 1-1 10 z" className="gl__trait gl__doux gl__tirets" />
    </>
  )
}

function Sql() {
  return (
    <>
      <rect x="6" y="10" width="38" height="64" rx="5" className="gl__trait gl__doux" />
      {[0, 1, 2, 3].map((i) => (
        <path key={i} data-a style={d(i, 70)} d={`M12 ${24 + i * 14} H38`} className="gl__trait gl__doux" />
      ))}
      <path data-a style={d(4)} d="M48 42 H58" className="gl__trait gl__doux" />
      <g data-a style={d(5)}>
        <rect x="60" y="28" width="30" height="28" rx="5" className="gl__plein gl__accent" />
        <text x="66" y="46" className="gl__texte gl__accent">CTE</text>
      </g>
      <path data-a style={d(6)} d="M93 42 H102" className="gl__trait gl__accent" />
      {[0, 1, 2].map((i) => (
        <rect key={i} data-a style={d(7 + i)} x={104 + i * 11} y={62 - (3 - i) * 16} width="8" height={(3 - i) * 16} rx="2"
          className={`gl__plein ${i === 0 ? "gl__accent" : "gl__doux"}`} />
      ))}
    </>
  )
}

function Mina() {
  const points: React.ReactNode[] = []
  for (let c = 0; c < 30; c++) {
    for (let r = 0; r < 12; r++) {
      points.push(<circle key={`${c}-${r}`} data-a style={d(c, 22)} cx={10 + c * 4} cy={14 + r * 4.8} r="1.4" className="gl__plein gl__accent" />)
    }
  }
  return <>{points}</>
}

function Agent() {
  const carre = (x: number, y: number, etat: "ok" | "ko", i: number) => (
    <g key={`${x}-${y}`} data-a style={d(i)}>
      <rect x={x} y={y} width="26" height="20" rx="4" className={`gl__plein gl__${etat}`} />
      {etat === "ok" ? (
        <path d={`M${x + 7} ${y + 10} l5 5 l8 -9`} className="gl__trait gl__ok" />
      ) : (
        <path d={`M${x + 8} ${y + 6} l10 8 M${x + 18} ${y + 6} l-10 8`} className="gl__trait gl__ko" />
      )}
    </g>
  )
  return (
    <>
      {[0, 1, 2].map((i) => carre(8 + i * 32, 8, "ok", i))}
      {carre(104, 8, "ko", 3)}
      <path data-a style={d(4)} d="M117 32 C 117 44, 110 46, 74 46 S 30 46, 30 50" className="gl__trait gl__doux gl__tirets" />
      <path data-a style={d(4)} d="M25 46 l5 5 l5 -5" className="gl__trait gl__doux" />
      {[0, 1, 2, 3].map((i) => carre(8 + i * 32, 56, "ok", 5 + i))}
    </>
  )
}

function Bascule() {
  const base = (x: number, plein: boolean, i: number) => (
    <g data-a style={d(i)} key={x}>
      <path d={`M${x} 22 v34 a24 8 0 0 0 48 0 v-34`} className={`gl__trait ${plein ? "gl__accent" : "gl__doux gl__tirets"}`} />
      <ellipse cx={x + 24} cy="22" rx="24" ry="8" className={`gl__trait ${plein ? "gl__accent gl__plein" : "gl__doux gl__tirets"}`} />
      <path d={`M${x} 38 a24 8 0 0 0 48 0`} className={`gl__trait ${plein ? "gl__accent" : "gl__doux gl__tirets"}`} />
    </g>
  )
  return (
    <>
      {base(6, false, 0)}
      {base(86, true, 2)}
      <path data-a style={d(1)} d="M58 40 H80" className="gl__trait gl__accent" />
      <path data-a style={d(1)} d="M74 34 l7 6 l-7 6" className="gl__trait gl__accent" />
    </>
  )
}

function Paires() {
  return (
    <>
      {[0, 1, 2, 3, 4].map((i) => (
        <g key={i}>
          <rect data-a style={d(i)} x={10 + i * 22} y="12" width="16" height="16" rx="3" className="gl__plein gl__accent" />
          <path data-a style={d(i + 1)} d={`M${18 + i * 22} 28 V54`} className="gl__trait gl__doux gl__tirets" />
          <rect data-a style={d(i + 2)} x={10 + i * 22} y="54" width="16" height="16" rx="3" className="gl__plein gl__doux" />
        </g>
      ))}
      <text data-a style={d(6)} x="126" y="24" className="gl__texte gl__accent">test</text>
      <text data-a style={d(6)} x="126" y="66" className="gl__texte gl__doux">ctrl</text>
    </>
  )
}

function Ab() {
  return (
    <>
      <path d="M10 70 H130" className="gl__trait gl__doux" />
      <rect data-a style={d(0)} x="24" y="36" width="30" height="34" rx="3" className="gl__plein gl__doux" />
      <rect data-a style={d(1)} x="72" y="14" width="30" height="56" rx="3" className="gl__plein gl__accent" />
      <text data-a style={d(2)} x="35" y="63" className="gl__texte gl__fond">A</text>
      <text data-a style={d(2)} x="83" y="63" className="gl__texte gl__fond">B</text>
      <text data-a style={d(3)} x="110" y="22" className="gl__texte gl__accent">χ²</text>
    </>
  )
}

function Texte() {
  const lignes: [number, "ok" | "ko"][] = [
    [0, "ok"],
    [1, "ko"],
    [2, "ok"],
    [3, "ko"],
  ]
  return (
    <>
      {lignes.map(([i, etat]) => (
        <g key={i} data-a style={d(i)}>
          <rect x="10" y={12 + i * 16} width={etat === "ok" ? 86 : 70} height="8" rx="2" className={`gl__plein ${etat === "ok" ? "gl__doux" : "gl__ko-doux"}`} />
          <path d={etat === "ok" ? `M108 ${16 + i * 16} l4 4 l8 -9` : `M108 ${12 + i * 16} l10 9 M118 ${12 + i * 16} l-10 9`} className={`gl__trait gl__${etat}`} />
        </g>
      ))}
    </>
  )
}

const GLYPHES: Record<GlypheId, () => React.JSX.Element> = {
  rag: Rag,
  sql: Sql,
  mina: Mina,
  agent: Agent,
  bascule: Bascule,
  paires: Paires,
  ab: Ab,
  texte: Texte,
}

export function Glyphe({ id, className }: { id: GlypheId; className?: string }) {
  const Dessin = GLYPHES[id]
  return (
    <svg className={`gl ${className ?? ""}`} viewBox="0 0 140 84" role="img" aria-hidden="true" data-glyphe={id}>
      <Dessin />
    </svg>
  )
}
