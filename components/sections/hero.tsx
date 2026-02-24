"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
        <div className="flex flex-col items-start gap-8">
          {/* Availability badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 text-sm">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              Disponible pour opportunités
            </span>
          </motion.div>

          {/* Main heading */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="max-w-3xl"
          >
            <h1 className="text-4xl font-semibold leading-tight tracking-tight text-balance md:text-5xl lg:text-6xl">
              Développeur Fullstack & Data
              <span className="block text-muted-foreground">
                Des applications robustes aux analyses data actionnables.
              </span>
            </h1>
          </motion.div>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="max-w-2xl text-lg leading-relaxed text-muted-foreground md:text-xl"
          >
            Je conçois des applications web et mobiles, et je construis des projets data pour transformer les donnees en decisions.
            En cycle ingenieur Big Data & IA a l&apos;ECE Paris, je relie produit, data et IA pour livrer des solutions utiles et mesurables.
          </motion.p>

          {/* CTA buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-wrap gap-4"
          >
            <Button asChild size="lg" className="gap-2">
              <Link href="/projects">
                Voir mes projets
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="gap-2 bg-transparent">
              <Link href="/contact">
                Me contacter
              </Link>
            </Button>
            {/* CV download removed */}
          </motion.div>
        </div>
      </div>

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-1/4 -top-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 h-96 w-96 rounded-full bg-accent/5 blur-3xl" />
      </div>
    </section>
  )
}
