"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Chiffre } from "@/components/chiffre"
import { Glyphe } from "@/components/glyphes"
import { useVu } from "@/components/use-vu"
import type { Dossier } from "@/lib/dossiers"
import { useDossiers } from "@/lib/dossiers-langue"
import { useT } from "@/lib/langue"

/**
 * Les projets phares, presentes comme des etudes de cas : la question qu'un
 * recruteur se pose, la preuve chiffree en grand, le schema de l'idee, et la
 * methode a un clic. Les donnees viennent de lib/dossiers.ts.
 *
 * Le robot lit cette section (voir objet-3d.tsx) : .cas, .cas__code b, .cas__lien.
 */

function Cas({ d, i, total }: { d: Dossier; i: number; total: number }) {
  const [ref, vu] = useVu<HTMLElement>(0.2)
  const [ouvert, setOuvert] = useState(false)
  const t = useT()
  const ph = d.phare!
  const long = (d.chiffre?.valeur.length ?? 0) > 7

  return (
    <article className="cas" ref={ref} data-vu={vu ? "1" : "0"}>
      <div className="cas__gauche">
        <span className="cas__n">
          {String(i + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
        </span>
        {d.chiffre ? (
          <>
            <b className="cas__chiffre" data-long={long ? "1" : "0"}>
              <Chiffre valeur={d.chiffre.valeur} actif={vu} />
            </b>
            <span className="cas__unite">{d.chiffre.unite}</span>
          </>
        ) : null}
      </div>

      <div className="cas__corps">
        <p className="cas__code">
          <b>{d.nom}</b> · {d.role}
        </p>
        <p className="cas__question">{ph.question}</p>
        <h3>{ph.titre}</h3>
        <p className="cas__enjeu">{d.enjeu}</p>

        <button className="cas__comment" aria-expanded={ouvert} onClick={() => setOuvert((o) => !o)}>
          {t("Comment j'ai fait", "How I did it")} <ChevronDown size={14} />
        </button>
        <div className="cas__resultat" data-ouvert={ouvert ? "1" : "0"}>
          <div>
            <p>{d.resultat}</p>
          </div>
        </div>

        <div className="cas__pied">
          <ul className="cas__prouve" aria-label={t("Ce que ce projet démontre", "What this project demonstrates")}>
            {d.prouve.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="cas__stack">{d.stack.join(" · ")}</p>
        </div>

        <div className="cas__liens">
          {d.depot ? (
            <a className="cas__lien" href={d.depot} target="_blank" rel="noreferrer noopener">
              {t("Voir le dépôt", "View the repository")}
            </a>
          ) : null}
          {d.fiche ? (
            <Link className="cas__lien" href={d.fiche}>
              {t("Étude de cas", "Case study")}
            </Link>
          ) : null}
        </div>
      </div>

      <div className="cas__visuel">
        {d.glyphe ? (
          <Glyphe id={d.glyphe} />
        ) : d.image ? (
          <Image src={d.image} alt={t(`Résultat du projet ${d.nom}`, `Result of the ${d.nom} project`)} width={320} height={200} data-ajuste={d.ajuste ?? "cover"} />
        ) : null}
      </div>
    </article>
  )
}

export function Stations() {
  const { AXES, DOSSIERS, NB_PHARES_MOT, PHARES, dossiersParAxe } = useDossiers()
  const t = useT()
  return (
    <section id="sec-stations" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="rag__kicker">{t("Projets", "Projects")}</p>
        <h2 className="rag__h2">
          {t(
            `${NB_PHARES_MOT.charAt(0).toUpperCase() + NB_PHARES_MOT.slice(1)} projets, ${NB_PHARES_MOT} preuves`,
            `${NB_PHARES_MOT.charAt(0).toUpperCase() + NB_PHARES_MOT.slice(1)} projects, ${NB_PHARES_MOT} proofs`,
          )}
        </h2>
        <p className="rag__lede mb-12">
          {t(
            "Chacun répond à une question qu'un recruteur se pose. Le chiffre est ce que j'ai pu établir ; la méthode se déplie en un clic, et le reste est dans le dépôt.",
            "Each one answers a question a recruiter asks. The figure is what I was able to establish; the method unfolds in one click, and the rest is in the repository.",
          )}
        </p>

        <div className="cas-liste">
          {PHARES.map((d, i) => (
            <Cas key={d.slug} d={d} i={i} total={PHARES.length} />
          ))}
        </div>

        <div className="cas-suite">
          <p>
            <b>{t(`Les ${DOSSIERS.length} projets`, `The ${DOSSIERS.length} projects`)}</b>
            {t(", classés par ce qu'ils démontrent :", ", ranked by what they demonstrate:")}
          </p>
          <div>
            {AXES.map((a) => (
              <Link key={a.id} href={`/projects#${a.id}`} className="cas-suite__axe">
                {a.titre} <span>{dossiersParAxe(a.id).length}</span>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="cas__lien inline-flex items-center gap-2">
            {t("Tous les projets", "All projects")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
