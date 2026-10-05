"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ExternalLink, PlayCircle, ShieldCheck } from "lucide-react"
import { Reveal } from "@/components/reveal"
import { Button } from "@/components/ui/button"
import { BADGES, CREDLY_PROFIL, FORMATION_PYTHON, FORMATION_SQL, NB_BADGES_CREDLY, badgeUrl, type Badge } from "@/lib/formations"
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

/** L'apercu d'une video YouTube : sa vignette et un bouton lecture, qui mene a la video (pas de lecteur integre, donc rien a charger). */
function ApercuVideo({ id, href, titre }: { id: string; href: string; titre: string }) {
  const [qualite, setQualite] = useState<"maxresdefault" | "hqdefault">("maxresdefault")
  const [echec, setEchec] = useState(false)
  return (
    <a className="apercu-video" href={href} target="_blank" rel="noopener noreferrer" aria-label={titre}>
      {!echec && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={`https://i.ytimg.com/vi/${id}/${qualite}.jpg`}
          alt=""
          width={1280}
          height={720}
          loading="lazy"
          decoding="async"
          referrerPolicy="no-referrer"
          onError={() => (qualite === "maxresdefault" ? setQualite("hqdefault") : setEchec(true))}
        />
      )}
      <span className="apercu-video__lecture" aria-hidden="true">
        <PlayCircle className="h-7 w-7" />
      </span>
      <span className="apercu-video__legende">YouTube</span>
    </a>
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
              "Un cours de SQL de 30 heures, une formation Python et machine learning, des certifications vérifiables sur Credly, et des projets qui mettent tout cela en pratique.",
              "A 30-hour SQL course, a Python and machine-learning course, certifications you can verify on Credly, and projects that put it all into practice.",
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
            <p className="formation-sql__source">
              <a href={FORMATION_SQL.video} target="_blank" rel="noopener noreferrer">
                {FORMATION_SQL.titre}
              </a>{" "}
              {t("par", "by")}{" "}
              <a href={FORMATION_SQL.chaineUrl} target="_blank" rel="noopener noreferrer">
                {FORMATION_SQL.chaine}
              </a>{" "}
              · {t("gratuit", "free")} · {mois(FORMATION_SQL.date)}
            </p>
            <p className="formation-sql__texte">
              {t(
                "Un cours vidéo complet, suivi de bout en bout : des premières requêtes jusqu'à l'optimisation et à un entrepôt de données. La mise en pratique est dans un projet : 878 000 lignes de vente analysées avec des requêtes SQL analytiques.",
                "A complete video course, followed from start to finish: from the first queries to optimisation and a data warehouse. The practice is in a project: 878,000 sales lines analysed with analytical SQL queries.",
              )}
            </p>
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
          <div className="formation-sql__media">
            <ApercuVideo id={FORMATION_SQL.videoId} href={FORMATION_SQL.video} titre={t("Voir la vidéo du cours de SQL sur YouTube", "Watch the SQL course video on YouTube")} />
            <figure className="formation-sql__photo">
              <Image
                src="/formation/sql-notes.jpg"
                alt={t(
                  "Mes notes manuscrites sur les fonctions SQL, prises sur une tablette pendant le cours",
                  "My handwritten notes on SQL functions, taken on a tablet during the course",
                )}
                width={944}
                height={1008}
                sizes="(min-width: 720px) 260px, 90vw"
              />
              <figcaption>{t("Mes notes de cours, à la main : les fonctions SQL.", "My handwritten course notes: SQL functions.")}</figcaption>
            </figure>
          </div>
          <div className="formation-sql__appris">
            <p>{t("Ce que j'y ai appris", "What I learned")}</p>
            <ul>
              {FORMATION_SQL.apprentissages.map((a) => (
                <li key={a.titre[0]}>
                  <b>{t(a.titre[0], a.titre[1])}</b>
                  <span>{t(a.detail[0], a.detail[1])}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>

        {/* La formation Python / machine learning, suivie a cote des certifications. */}
        <Reveal y={20} duration={0.5} className="formation-sql formation-python carte mt-8">
          <div className="formation-sql__heures" aria-hidden="true">
            <b>{FORMATION_PYTHON.nombreVideos}</b>
            <span>{t("vidéos", "videos")}</span>
          </div>
          <div className="formation-sql__corps">
            <p className="formation-sql__etiquette">Python · Machine Learning</p>
            <h3 className="formation-sql__titre">{t("Formation Python et machine learning", "Python and machine-learning training")}</h3>
            <p className="formation-sql__source">
              <a href={FORMATION_PYTHON.video} target="_blank" rel="noopener noreferrer">
                {FORMATION_PYTHON.titre}
              </a>{" "}
              {t("par", "by")}{" "}
              <a href={FORMATION_PYTHON.chaineUrl} target="_blank" rel="noopener noreferrer">
                {FORMATION_PYTHON.chaine}
              </a>{" "}
              ({FORMATION_PYTHON.auteur}) · {t("gratuit", "free")} · {mois(FORMATION_PYTHON.date)}
            </p>
            <p className="formation-sql__texte">
              {t(
                "Suivie à côté des certifications Coursera pour apprendre la data science : une série de trente vidéos qui prend en main les bibliothèques de référence de Python pour la donnée et le machine learning.",
                "Followed alongside the Coursera certifications to learn data science: a series of thirty videos covering Python's core libraries for data and machine learning.",
              )}
            </p>
            <ul className="formation-python__libs" aria-label={t("Bibliothèques abordées", "Libraries covered")}>
              {FORMATION_PYTHON.bibliotheques.map((l) => (
                <li key={l}>{l}</li>
              ))}
            </ul>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild className="gap-2">
                <a href={FORMATION_PYTHON.video} target="_blank" rel="noopener noreferrer">
                  <PlayCircle className="h-4 w-4" />
                  {t("Voir la formation", "Watch the course")}
                </a>
              </Button>
            </div>
          </div>
          <div className="formation-sql__media formation-python__media">
            <ApercuVideo id={FORMATION_PYTHON.videoId} href={FORMATION_PYTHON.video} titre={t("Voir la première vidéo de la formation Python sur YouTube", "Watch the first video of the Python course on YouTube")} />
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
