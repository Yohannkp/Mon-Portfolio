"use client"

import Image from "next/image"
import Link from "next/link"
import { ExternalLink, Github } from "lucide-react"
import { Glyphe } from "@/components/glyphes"
import { useVu } from "@/components/use-vu"
import type { Dossier } from "@/lib/dossiers"

/** Une ligne de la page /projects : le visuel, l'enjeu et le resultat, et la preuve chiffree a droite. */
export function DossierLigne({ d }: { d: Dossier }) {
  const [ref, vu] = useVu<HTMLElement>(0.15)
  return (
    <article id={d.slug} ref={ref} className="dos" data-vu={vu ? "1" : "0"} data-chiffre={d.chiffre ? "1" : "0"}>
      <div className="dos__visuel" data-ajuste={d.ajuste ?? "cover"}>
        {d.image ? (
          <Image src={d.image} alt={`Aperçu du projet ${d.nom}`} width={368} height={230} />
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
          <ul className="cas__prouve" aria-label="Ce que ce projet démontre">
            {d.prouve.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="cas__stack">{d.stack.join(" · ")}</p>
        </div>

        <div className="cas__liens">
          {d.fiche ? (
            <Link className="cas__lien" href={d.fiche}>
              Étude de cas
            </Link>
          ) : null}
          {d.depot ? (
            <a className="cas__lien cas__lien--ico" href={d.depot} target="_blank" rel="noreferrer noopener">
              <Github size={13} /> Dépôt
            </a>
          ) : null}
          {d.demo ? (
            <a className="cas__lien cas__lien--ico" href={d.demo} target="_blank" rel="noreferrer noopener">
              <ExternalLink size={13} /> Démo
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
