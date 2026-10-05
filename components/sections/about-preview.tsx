"use client"

import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/reveal"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useT } from "@/lib/langue"

export function AboutPreview() {
  const t = useT()
  return (
    <section id="sec-apropos" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5} className="grid gap-12 md:grid-cols-2 md:items-center">
          {/* Image */}
          <div className="relative mx-auto aspect-square w-full max-w-sm overflow-hidden rounded-2xl bg-secondary">
            <Image
              src="/avatar.jpg"
              alt="Yendi Yohann"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>

          {/* Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="sec__kicker">{t("À propos", "About")}</span>
              <h2 className="sec__h2">{t("De l'affinage du modèle à son déploiement.", "From fine-tuning the model to deploying it.")}</h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                {t(
                  "Un modèle qui reste dans un notebook ne sert à personne. Ce qui m'intéresse, c'est la partie que la plupart des gens sautent : ",
                  "A model that stays in a notebook is no use to anyone. What interests me is the part most people skip: ",
                )}
                <strong className="marque">{t("rendre un résultat reproductible", "making a result reproducible")}</strong>
                {t(" et ", " and ")}
                <strong className="marque">{t("savoir le mesurer", "knowing how to measure it")}</strong>
                {t(" — puis le servir derrière une API qui tient la charge.", " — then serving it behind an API that holds up under load.")}
              </p>
              <p className="leading-relaxed">
                {t(
                  "Je viens du développement backend, et c'est ce qui fait la différence : je ne découvre pas Docker, les tests et l'intégration continue au moment de déployer. Je cherche ",
                  "I come from backend development, and that's what makes the difference: I'm not discovering Docker, tests and continuous integration at deployment time. I'm looking for ",
                )}
                <strong className="marque">{t("un stage de 4 à 6 mois à partir d'avril 2027", "a 4–6 month internship starting April 2027")}</strong>
                {t(", en MLOps ou en data engineering.", ", in MLOps or data engineering.")}
              </p>
            </div>

            <div>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href="/about">
                  {t("Découvrir mon parcours", "Discover my background")}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
