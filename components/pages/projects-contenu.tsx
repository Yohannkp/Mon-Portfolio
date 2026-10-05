"use client"

import { DossierLigne } from "@/components/dossier-ligne"
import { NavAxes } from "@/components/nav-axes"
import { useDossiers } from "@/lib/dossiers-langue"
import { useT } from "@/lib/langue"

// Les preuves les plus parlantes, en tete : ce qu'un recruteur retient en dix secondes.
const ORDRE_PREUVES = [
  "supermarket-sales-analysis",
  "finance-credit-scoring",
  "prediction-depart-employes",
  "mina-translator",
  "rag-local",
  "snake-rl-dqn",
  "self-dev-agent",
  "optimisation-ventes-chips",
]

/** Le contenu de /projects (la page elle-meme garde ses metadonnees, qui restent cote serveur). */
export function ProjetsContenu() {
  const t = useT()
  const { AXES, DOSSIERS, dossiersParAxe } = useDossiers()
  const preuves = ORDRE_PREUVES.map((s) => DOSSIERS.find((d) => d.slug === s)!).filter((d) => d.chiffre)

  return (
    <div className="mx-auto max-w-6xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">{t("Projets", "Projects")}</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          {t(
            `${DOSSIERS.length} projets, classés par ce qu'ils démontrent plutôt que par leur technologie. Pour chacun : le problème posé, ce qui a été fait, et la preuve quand elle est chiffrable.`,
            `${DOSSIERS.length} projects, ranked by what they demonstrate rather than by their technology. For each: the problem posed, what was done, and the proof when it can be quantified.`,
          )}
        </p>
      </div>

      <section className="preuves" aria-label={t("Les preuves en chiffres", "The proofs in numbers")}>
        {preuves.map((d) => (
          <a key={d.slug} href={`#${d.slug}`}>
            <b>{d.chiffre!.valeur}</b>
            <span>{d.chiffre!.unite}</span>
            <em>{d.nom}</em>
          </a>
        ))}
      </section>

      <NavAxes />

      {AXES.map((axe, i) => (
        <section key={axe.id} id={axe.id} className="axe" aria-labelledby={`titre-${axe.id}`}>
          <header className="axe__tete">
            <span className="axe__n">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h2 id={`titre-${axe.id}`}>{axe.titre}</h2>
              <p>{axe.promesse}</p>
            </div>
            <span className="axe__compte">
              {dossiersParAxe(axe.id).length} {t("projets", "projects")}
            </span>
          </header>
          <div>
            {dossiersParAxe(axe.id).map((d) => (
              <DossierLigne key={d.slug} d={d} />
            ))}
          </div>
        </section>
      ))}
    </div>
  )
}
