"use client"

import { useState } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, PlayCircle, ShieldCheck } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { BADGES, CREDLY_PROFIL, FORMATION_SQL, NB_BADGES_CREDLY, badgeUrl, type Badge } from "@/lib/formations"
import { useLangue, useT } from "@/lib/langue"

/** L'image d'un badge, chargee depuis Credly ; si elle ne vient pas, une pastille avec l'initiale prend sa place. */
function ImageBadge({ b }: { b: Badge }) {
  const [echec, setEchec] = useState(false)
  if (echec) {
    return (
      <span className="badge-carte__repli" aria-hidden="true">
        {b.nom.charAt(0)}
      </span>
    )
  }
  return (
    // Une image distante qu'on ne maitrise pas : un <img> simple, charge a la demande, sans envoyer l'adresse du site (referrer).
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={b.image}
      alt=""
      width={112}
      height={112}
      loading="lazy"
      decoding="async"
      referrerPolicy="no-referrer"
      onError={() => setEchec(true)}
    />
  )
}

export function Formations() {
  const t = useT()
  const langue = useLangue()
  const mois = (iso: string) =>
    new Intl.DateTimeFormat(langue === "en" ? "en-GB" : "fr-FR", { month: "long", year: "numeric" }).format(new Date(`${iso}T12:00:00`))

  return (
    <section id="sec-formations" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5}>
          <span className="sec__kicker">{t("Formation", "Training")}</span>
          <h2 className="sec__h2">{t("Se former, puis le prouver", "Learn, then prove it")}</h2>
          <p className="sec__lede">
            {t(
              "Un cours de SQL de 30 heures, des certifications vérifiables sur Credly, et des projets qui mettent tout cela en pratique.",
              "A 30-hour SQL course, certifications you can verify on Credly, and projects that put it all into practice.",
            )}
          </p>
        </Reveal>

        {/* Le cours de SQL : la formation, puis la preuve (le projet). */}
        <Reveal y={20} duration={0.5} className="formation-sql carte mt-12">
          <div className="formation-sql__heures" aria-hidden="true">
            <b>{FORMATION_SQL.heures}</b>
            <span>{t("heures", "hours")}</span>
          </div>
          <div className="formation-sql__corps">
            <p className="formation-sql__etiquette">SQL</p>
            <h3 className="formation-sql__titre">{t("Formation SQL de 30 heures", "30-hour SQL training")}</h3>
            <p className="formation-sql__texte">
              {t(
                "Un cours vidéo complet, suivi de bout en bout pour maîtriser le SQL en profondeur. La mise en pratique est dans un projet : 878 000 lignes de vente analysées avec des requêtes SQL analytiques.",
                "A complete video course, followed from start to finish to master SQL in depth. The practice is in a project: 878,000 sales lines analysed with analytical SQL queries.",
              )}
            </p>
            {FORMATION_SQL.apprentissages.length > 0 ? (
              <div className="formation-sql__appris">
                <p>{t("Ce que j'y ai appris", "What I learned")}</p>
                <ul>
                  {FORMATION_SQL.apprentissages.map((a) => (
                    <li key={a[0]}>{t(a[0], a[1])}</li>
                  ))}
                </ul>
              </div>
            ) : null}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={FORMATION_SQL.video} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="h-4 w-4" />
                  {t("Voir la formation", "Watch the course")}
                </a>
              </Button>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href={`/projects#${FORMATION_SQL.projet}`}>
                  {t("Voir le projet", "See the project")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>

        {/* Les certifications : chaque badge se vérifie sur Credly. */}
        <Reveal y={20} duration={0.5} className="mt-16">
          <h3 className="formation-badges__titre">
            <ShieldCheck className="h-5 w-5" />
            {t("Certifications vérifiables", "Verifiable certifications")}
          </h3>
        </Reveal>
        <div className="formation-badges mt-8 grid gap-6 sm:grid-cols-2">
          {BADGES.map((b, i) => (
            <Reveal key={b.id} y={20} duration={0.5} delay={i * 0.08} className="badge-carte carte">
              <div className="badge-carte__image">
                <ImageBadge b={b} />
              </div>
              <div className="badge-carte__corps">
                <h4>{b.nom}</h4>
                <p className="badge-carte__meta">
                  {b.emetteur} · {mois(b.date)}
                </p>
                <p className="badge-carte__competence">{t(b.competence[0], b.competence[1])}</p>
                <a className="badge-carte__lien" href={badgeUrl(b)} target="_blank" rel="noopener noreferrer">
                  {t("Vérifier sur Credly", "Verify on Credly")} <ExternalLink size={13} />
                </a>
              </div>
            </Reveal>
          ))}
        </div>
        <Reveal y={10} duration={0.4} className="mt-8">
          <a className="cas__lien inline-flex items-center gap-2" href={CREDLY_PROFIL} target="_blank" rel="noopener noreferrer">
            {t(`Voir les ${NB_BADGES_CREDLY} badges sur Credly`, `See all ${NB_BADGES_CREDLY} badges on Credly`)}
            <ArrowRight className="h-4 w-4" />
          </a>
        </Reveal>
      </div>
    </section>
  )
}
