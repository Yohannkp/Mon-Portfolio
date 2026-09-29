"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ChevronDown } from "lucide-react"
import { Chiffre } from "@/components/chiffre"
import { Glyphe } from "@/components/glyphes"
import { useVu } from "@/components/use-vu"
import { AXES, DOSSIERS, PHARES, dossiersParAxe, type Dossier } from "@/lib/dossiers"

/**
 * Les six projets phares, presentes comme des etudes de cas : la question qu'un
 * recruteur se pose, la preuve chiffree en grand, le schema de l'idee, et la
 * methode a un clic. Les donnees viennent de lib/dossiers.ts.
 *
 * Le robot lit cette section (voir objet-3d.tsx) : .cas, .cas__code b, .cas__lien.
 */

function Cas({ d, i, total }: { d: Dossier; i: number; total: number }) {
  const [ref, vu] = useVu<HTMLElement>(0.2)
  const [ouvert, setOuvert] = useState(false)
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
          Comment j&apos;ai fait <ChevronDown size={14} />
        </button>
        <div className="cas__resultat" data-ouvert={ouvert ? "1" : "0"}>
          <div>
            <p>{d.resultat}</p>
          </div>
        </div>

        <div className="cas__pied">
          <ul className="cas__prouve" aria-label="Ce que ce projet démontre">
            {d.prouve.map((p) => (
              <li key={p}>{p}</li>
            ))}
          </ul>
          <p className="cas__stack">{d.stack.join(" · ")}</p>
        </div>

        <div className="cas__liens">
          {d.depot ? (
            <a className="cas__lien" href={d.depot} target="_blank" rel="noreferrer noopener">
              Voir le dépôt
            </a>
          ) : null}
          {d.fiche ? (
            <Link className="cas__lien" href={d.fiche}>
              Étude de cas
            </Link>
          ) : null}
        </div>
      </div>

      <div className="cas__visuel">
        {d.glyphe ? (
          <Glyphe id={d.glyphe} />
        ) : d.image ? (
          <Image src={d.image} alt={`Résultat du projet ${d.nom}`} width={320} height={200} data-ajuste={d.ajuste ?? "cover"} />
        ) : null}
      </div>
    </article>
  )
}

export function Stations() {
  return (
    <section id="sec-stations" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <p className="rag__kicker">Projets</p>
        <h2 className="rag__h2">Six projets, six preuves</h2>
        <p className="rag__lede mb-12">
          Chacun répond à une question qu&apos;un recruteur se pose. Le chiffre est ce que j&apos;ai pu établir ; la méthode
          se déplie en un clic, et le reste est dans le dépôt.
        </p>

        <div className="cas-liste">
          {PHARES.map((d, i) => (
            <Cas key={d.slug} d={d} i={i} total={PHARES.length} />
          ))}
        </div>

        <div className="cas-suite">
          <p>
            <b>Les {DOSSIERS.length} projets</b>, classés par ce qu&apos;ils démontrent :
          </p>
          <div>
            {AXES.map((a) => (
              <Link key={a.id} href={`/projects#${a.id}`} className="cas-suite__axe">
                {a.titre} <span>{dossiersParAxe(a.id).length}</span>
              </Link>
            ))}
          </div>
          <Link href="/projects" className="cas__lien inline-flex items-center gap-2">
            Tous les projets
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
