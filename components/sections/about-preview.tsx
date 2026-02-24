"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AboutPreview() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="grid gap-12 md:grid-cols-2 md:items-center"
        >
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
              <span className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                À propos
              </span>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight">
                Yendi Yohann
              </h2>
              <p className="mt-2 text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Ingénieur Big Data & IA en alternance · Basé en France
              </p>
            </div>

            <div className="space-y-4 text-muted-foreground">
              <p className="leading-relaxed">
                Software Engineer spécialisé en IA, je construis des applications full-stack et des systèmes intelligents
                qui relient données, modèles et expérience utilisateur. Basé à Paris, je propose une approche complète,
                du backend au frontend, avec un focus sur l&apos;impact produit.
              </p>
              <p className="leading-relaxed">
                En cycle ingénieur Big Data & IA à l&apos;ECE Paris, j&apos;allie IA, software engineering et data pour livrer
                des solutions mesurables : pipelines fiables, modèles prédictifs et intégrations propres dans les apps.
              </p>
            </div>

            <div>
              <Button asChild variant="outline" className="gap-2 bg-transparent">
                <Link href="/about">
                  En savoir plus
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
