"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export function ContactCTA() {
  return (
    <section className="border-t border-border/40">
      <div className="mx-auto max-w-6xl px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center text-center"
        >
          <h2 className="text-3xl font-semibold tracking-tight md:text-4xl">
            Travaillons ensemble
          </h2>
          <p className="mt-4 max-w-xl text-lg text-muted-foreground">
            Vous avez un projet en tête ou une opportunité à me proposer ? 
            Je suis toujours ouvert à la discussion.
          </p>
          <Button asChild size="lg" className="mt-8 gap-2">
            <Link href="/contact">
              Me contacter
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </motion.div>
      </div>
    </section>
  )
}
