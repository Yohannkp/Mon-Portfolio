"use client"

import Image from "next/image"
import Link from "next/link"
import { Reveal } from "@/components/reveal"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutPreview() {
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
              <span className="sec__kicker">
                À propos
              </span>
              <h2 className="sec__h2">
De l'affinage du modèle à son déploiement.
              </h2>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Un modèle qui reste dans un notebook ne sert à personne. Ce qui m'intéresse, c'est la partie
                que la plupart des gens sautent : <strong className="marque">rendre un résultat reproductible</strong> et{" "}
                <strong className="marque">savoir le mesurer</strong> — puis le servir derrière une API qui tient la charge.
              </p>
              <p className="leading-relaxed">
                Je viens du développement backend, et c'est ce qui fait la différence : je ne découvre pas
                Docker, les tests et l'intégration continue au moment de déployer. Je cherche{" "}
                <strong className="marque">un stage de 4 à 6 mois à partir d'avril 2027</strong>, en MLOps ou en data
                engineering.
              </p>
            </div>

            <div>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href="/about">
                  Découvrir mon parcours
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
