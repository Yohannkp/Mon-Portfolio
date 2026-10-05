"use client"

import Link from "next/link"
import { Reveal } from "@/components/reveal"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useT } from "@/lib/langue"

export function ContactCTA() {
  const t = useT()
  return (
    <section id="sec-contact" className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <Reveal y={20} duration={0.5} className="flex flex-col items-center text-center">
          {/* Reserve pour le robot, seulement quand il est en service (voir globals.css). */}
          <div data-scene-robot aria-hidden="true" />
          <h2 className="sec__h2">{t("Travaillons ensemble", "Let's work together")}</h2>
          <p className="sec__lede">
            {t(
              "Vous avez un projet en tête ou une opportunité à me proposer ? Je suis toujours ouvert à la discussion.",
              "Do you have a project in mind or an opportunity to offer? I'm always open to a conversation.",
            )}
          </p>
          <Button asChild size="lg" className="mt-8 gap-2 bg-accent text-background hover:bg-accent/90 hover:shadow-[0_10px_28px_-12px_var(--accent)]">
            <Link href="/contact">
              {t("Me contacter", "Contact me")}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </Reveal>
      </div>
    </section>
  )
}
