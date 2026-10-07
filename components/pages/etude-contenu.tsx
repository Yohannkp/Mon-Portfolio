"use client"

import Link from "next/link"
import { ArrowLeft, ArrowRight, ExternalLink, FileCode2, Github } from "lucide-react"
import { Button } from "@/components/ui/button"
import { VisuelEtude } from "@/components/etude/visuels"
import { ETUDES, getEtude } from "@/lib/etudes"
import { useDossiers } from "@/lib/dossiers-langue"
import { useT } from "@/lib/langue"
import "@/app/etudes.css"

/**
 * L'etude de cas d'un projet ML : le probleme, la donnee, la methode, les resultats mesures et ce que je ferais
 * autrement. Le nom, l'axe, la question du recruteur, la pile et les liens viennent du dossier (lib/dossiers.ts) ;
 * le recit et les chiffres de lib/etudes.ts, chacun avec le fichier du depot d'ou il vient.
 */
export function EtudeContenu({ slug }: { slug: string }) {
  const t = useT()
  const { AXES, DOSSIERS } = useDossiers()
  const etude = getEtude(slug)
  const d = DOSSIERS.find((x) => x.slug === slug)
  if (!etude || !d) return null
  const axe = AXES.find((a) => a.id === d.axe)
  const rang = ETUDES.findIndex((e) => e.slug === slug)
  const suivante = ETUDES[(rang + 1) % ETUDES.length]
  const dSuivante = DOSSIERS.find((x) => x.slug === suivante.slug)

  return (
    <article className="et">
      <Link href="/projects" className="et__retour">
        <ArrowLeft className="h-4 w-4" />
        {t("Retour aux projets", "Back to projects")}
      </Link>

      <header className="et__tete">
        <p className="rag__kicker">
          {t("Étude de cas", "Case study")} · {axe?.titre}
        </p>
        <h1 className="et__h1">{d.nom}</h1>
        {d.phare ? <p className="et__question">{d.phare.question}</p> : null}
        <p className="et__pitch">{t(...etude.pitch)}</p>

        <ul className="cas__prouve et__prouve" aria-label={t("Ce que ce projet démontre", "What this project demonstrates")}>
          {d.prouve.map((p) => (
            <li key={p}>{p}</li>
          ))}
        </ul>

        <div className="et__liens">
          {d.depot ? (
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={d.depot} target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                {t("Code source", "Source code")}
              </a>
            </Button>
          ) : null}
          {d.demo ? (
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={d.demo} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-4 w-4" />
                {t("Démo", "Demo")}
              </a>
            </Button>
          ) : null}
        </div>
        <p className="cas__stack et__stack">{d.stack.join(" · ")}</p>
      </header>

      <dl className="et__chiffres">
        {etude.chiffres.map((c) => (
          <div key={c.label[0]} className="et__chiffre">
            <dt>{t(...c.label)}</dt>
            <dd>{t(...c.valeur)}</dd>
          </div>
        ))}
      </dl>

      <nav className="et__sommaire" aria-label={t("Sommaire", "Contents")}>
        <ol>
          {etude.sections.map((s, k) => (
            <li key={s.id}>
              <a href={`#${s.id}`}>
                <span>{String(k + 1).padStart(2, "0")}</span>
                {t(...s.titre)}
              </a>
            </li>
          ))}
          <li>
            <a href="#autrement">
              <span>{String(etude.sections.length + 1).padStart(2, "0")}</span>
              {t("Ce que je ferais autrement", "What I would do differently")}
            </a>
          </li>
        </ol>
      </nav>

      {etude.sections.map((s, k) => (
        <section key={s.id} id={s.id} className="et__section">
          <h2 className="et__h2">
            <span className="et__n">{String(k + 1).padStart(2, "0")}</span>
            {t(...s.titre)}
          </h2>
          <div className="et__texte">
            {s.paragraphes.map((p) => (
              <p key={p[0].slice(0, 40)}>{t(...p)}</p>
            ))}
            {s.points ? (
              <ul className="et__points">
                {s.points.map((p) => (
                  <li key={p[0].slice(0, 40)}>{t(...p)}</li>
                ))}
              </ul>
            ) : null}
          </div>
          {s.visuels?.map((v) => <VisuelEtude key={v.titre[0]} v={v} />)}
          {s.source ? (
            <p className="et__source">
              <FileCode2 className="h-3.5 w-3.5" aria-hidden="true" />
              {t("Source", "Source")} :{" "}
              <a href={s.source.href} target="_blank" rel="noopener noreferrer">
                {s.source.fichier}
              </a>
            </p>
          ) : null}
        </section>
      ))}

      <section id="autrement" className="et__section">
        <h2 className="et__h2">
          <span className="et__n">{String(etude.sections.length + 1).padStart(2, "0")}</span>
          {t("Ce que je ferais autrement", "What I would do differently")}
        </h2>
        <ul className="et__autrement">
          {etude.autrement.map((a) => (
            <li key={a[0].slice(0, 40)}>{t(...a)}</li>
          ))}
        </ul>
      </section>

      <footer className="et__pied">
        <p>
          {t(
            "Une question sur ce projet, ou envie d'en parler pour un stage ?",
            "A question about this project, or want to talk about it for an internship?",
          )}
        </p>
        <div className="et__liens">
          <Button asChild className="bg-accent text-background hover:bg-accent/90">
            <Link href="/contact">{t("Me contacter", "Contact me")}</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/projects">{t("Tous les projets", "All projects")}</Link>
          </Button>
        </div>
      </footer>

      {dSuivante && suivante.slug !== slug ? (
        <Link href={`/projects/${suivante.slug}`} className="et__suivante group">
          <span>
            <span className="et__suivante-k">{t("Étude de cas suivante", "Next case study")}</span>
            <span className="et__suivante-nom">{dSuivante.nom}</span>
          </span>
          <ArrowRight className="h-5 w-5 text-accent transition-transform group-hover:translate-x-1" />
        </Link>
      ) : null}
    </article>
  )
}
