"use client"

import type { Barre, Txt, Visuel } from "@/lib/etudes-types"
import { useLangue, useT } from "@/lib/langue"

/**
 * Les graphiques des etudes de cas, aux couleurs du site : l'accent pour ce dont parle le texte, le gris pour le
 * contexte. Chaque valeur est ecrite a cote de sa marque : rien ne se lit seulement au survol.
 */

const useNombre = () => {
  const en = useLangue() === "en"
  return (v: number, decimales = 0) =>
    v.toLocaleString(en ? "en-US" : "fr-FR", { minimumFractionDigits: decimales, maximumFractionDigits: decimales })
}

function Cadre({ titre, children }: { titre: Txt; children: React.ReactNode }) {
  const t = useT()
  return (
    <figure className="et-fig">
      <figcaption className="et-fig__titre">{t(...titre)}</figcaption>
      {children}
    </figure>
  )
}

/* ------------------------------------------------------------------ Barres horizontales */

function Barres({ v }: { v: Extract<Visuel, { type: "barres" }> }) {
  const t = useT()
  const nombre = useNombre()
  const max = v.max ?? Math.max(...v.barres.map((b) => b.valeur))
  const unite = v.unite ? ` ${t(...v.unite)}` : ""
  return (
    <Cadre titre={v.titre}>
      <ul className="et-barres">
        {v.barres.map((b: Barre) => (
          <li key={b.label[0]} className="et-barres__ligne" data-accent={b.accent ? "1" : "0"}>
            <span className="et-barres__label">{t(...b.label)}</span>
            <span className="et-barres__piste" aria-hidden="true">
              <span className="et-barres__barre" style={{ width: `${Math.max(1.5, (b.valeur / max) * 100)}%` }} />
            </span>
            <span className="et-barres__valeur">
              {nombre(b.valeur, v.decimales ?? 0)}
              <small>{unite}</small>
            </span>
          </li>
        ))}
      </ul>
    </Cadre>
  )
}

/* ------------------------------------------------------------------ Matrice de confusion */

function Matrice({ v }: { v: Extract<Visuel, { type: "matrice" }> }) {
  const t = useT()
  const nombre = useNombre()
  const total = v.vn + v.fp + v.fn + v.vp
  const rappel = v.vp / (v.vp + v.fn)
  const precision = v.vp / (v.vp + v.fp)
  const pos = t(...v.positif)
  const neg = t(...v.negatif)
  const cases: { n: number; nom: Txt; juste: boolean }[] = [
    { n: v.vn, nom: ["Vrais négatifs", "True negatives"], juste: true },
    { n: v.fp, nom: ["Faux positifs", "False positives"], juste: false },
    { n: v.fn, nom: ["Faux négatifs", "False negatives"], juste: false },
    { n: v.vp, nom: ["Vrais positifs", "True positives"], juste: true },
  ]
  return (
    <Cadre titre={v.titre}>
      <div className="et-matrice">
        <span className="et-matrice__coin" aria-hidden="true" />
        <span className="et-matrice__tete">
          {t("Prédit", "Predicted")} : {neg}
        </span>
        <span className="et-matrice__tete">
          {t("Prédit", "Predicted")} : {pos}
        </span>
        {[0, 1].map((ligne) => (
          <div key={ligne} className="et-matrice__ligne" role="presentation">
            <span className="et-matrice__tete et-matrice__tete--ligne">
              {t("Réel", "Actual")} : {ligne ? pos : neg}
            </span>
            {cases.slice(ligne * 2, ligne * 2 + 2).map((c) => (
              <div
                key={c.nom[0]}
                className="et-matrice__case"
                data-juste={c.juste ? "1" : "0"}
              >
                <b>{nombre(c.n)}</b>
                <span>{t(...c.nom)}</span>
              </div>
            ))}
          </div>
        ))}
      </div>
      <p className="et-matrice__bilan">
        {t("Sur", "Out of")} {nombre(total)} {t("cas", "cases")} · {t("rappel", "recall")}{" "}
        <b>{nombre(rappel * 100, 1)} %</b> · {t("précision", "precision")} <b>{nombre(precision * 100, 1)} %</b>
      </p>
    </Cadre>
  )
}

/* ------------------------------------------------------------------ Pipeline */

function Pipeline({ v }: { v: Extract<Visuel, { type: "pipeline" }> }) {
  const t = useT()
  return (
    <Cadre titre={v.titre}>
      <ol className="et-pipe" style={{ ["--n" as string]: v.etapes.length }}>
        {v.etapes.map((e, k) => (
          <li key={e.titre[0]} className="et-pipe__etape">
            <span className="et-pipe__n">{String(k + 1).padStart(2, "0")}</span>
            <b>{t(...e.titre)}</b>
            <span className="et-pipe__detail">{t(...e.detail)}</span>
            {e.tech ? <code className="et-pipe__tech">{e.tech}</code> : null}
          </li>
        ))}
      </ol>
    </Cadre>
  )
}

/* ------------------------------------------------------------------ Tableau */

function Tableau({ v }: { v: Extract<Visuel, { type: "table" }> }) {
  const t = useT()
  const cellule = (c: string | Txt) => (typeof c === "string" ? c : t(...c))
  return (
    <Cadre titre={v.titre}>
      <div className="et-table__boite">
        <table className="et-table">
          <thead>
            <tr>
              {v.colonnes.map((c) => (
                <th key={c[0]} scope="col">
                  {t(...c)}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {v.lignes.map((l, k) => (
              <tr key={k}>
                {l.map((c, j) =>
                  j === 0 ? (
                    <th key={j} scope="row">
                      {cellule(c)}
                    </th>
                  ) : (
                    <td key={j}>{cellule(c)}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Cadre>
  )
}

export function VisuelEtude({ v }: { v: Visuel }) {
  switch (v.type) {
    case "table":
      return <Tableau v={v} />
    case "barres":
      return <Barres v={v} />
    case "matrice":
      return <Matrice v={v} />
    case "pipeline":
      return <Pipeline v={v} />
  }
}
