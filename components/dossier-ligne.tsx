"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { Glyphe } from "@/components/glyphes"
import { useVu } from "@/components/use-vu"
import type { Dossier } from "@/lib/dossiers"
import { useDossiers } from "@/lib/dossiers-langue"
import { useT } from "@/lib/langue"

/** Une ligne de la page /projects : le visuel, l'enjeu et le resultat, et la preuve chiffree a droite. */
export function DossierLigne({ d: dFr }: { d: Dossier }) {
  const t = useT()
  const { DOSSIERS } = useDossiers()
  const d = DOSSIERS.find((x) => x.slug === dFr.slug) ?? dFr
  const [ref, vu] = useVu<HTMLElement>(0.15)
  return (
    <article id={d.slug} ref={ref} className="dos" data-vu={vu ? "1" : "0"} data-chiffre={d.chiffre ? "1" : "0"}>
      <div className="dos__visuel" data-ajuste={d.ajuste ?? "cover"}>
        {d.image ? (
          <Image src={d.image} alt={t(`Aperçu du projet ${d.nom}`, `Preview of the ${d.nom} project`)} width={368} height={230} />
        ) : d.glyphe ? (
          <Glyphe id={d.glyphe} />
        ) : null}
      </div>

      <div className="dos__corps">
        <p className="dos__role">{d.role}</p>
        <h3>{d.nom}</h3>
        <p className="dos__enjeu">{d.enjeu}</p>
        <p className="dos__resultat">{d.resultat}</p>

        <div className="dos__pied">
          <ul className="cas__prouve" aria-label={t("Ce que ce projet démontre", "What this project demonstrates")}>
            {d.prouve.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="cas__stack">{d.stack.join(" · ")}</p>
        </div>

        <div className="cas__liens">
          {d.fiche ? (
            <Link className="cas__lien" href={d.fiche}>
              {t("Étude de cas", "Case study")}
            </Link>
          ) : null}
          {d.depot ? (
            <a className="cas__lien cas__lien--ico" href={d.depot} target="_blank" rel="noreferrer noopener">
              <Github size={13} /> {t("Dépôt", "Repository")}
            </a>
          ) : null}
          {d.demo ? (
            <a className="cas__lien cas__lien--ico" href={d.demo} target="_blank" rel="noreferrer noopener">
              <ExternalLink size={13} /> {t("Démo", "Demo")}
            </a>
          ) : null}
        </div>
      </div>

      {d.chiffre ? (
        <div className="dos__chiffre">
          <b>{d.chiffre.valeur}</b>
          <span>{d.chiffre.unite}</span>
        </div>
      ) : null}
    </article>
  )
}
