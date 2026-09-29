import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Download, Heart, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "À propos",
  description: "Élève ingénieur Big Data & IA à l'ECE Paris, en recherche d'un stage MLOps ou data engineering à partir d'avril 2027.",
}

const values = [
  {
    icon: Heart,
    title: "Qualité",
    description: "Je préfère prendre le temps de bien faire plutôt que de livrer du code médiocre. Chaque ligne compte.",
  },
  {
    icon: Zap,
    title: "Curiosité",
    description: "J'aime comprendre comment les choses fonctionnent et explorer de nouvelles technologies.",
  },
  {
    icon: Eye,
    title: "Rigueur",
    description: "Tests, documentation, revue de code : les bonnes pratiques ne sont pas optionnelles.",
  },
]

const timeline = [
  {
    year: "2026",
    title: "Stage — développement backend en Go",
    description:
      "Backend d'un moteur de traitement de données (ETL) déjà en production : Go, Docker Compose.",
  },
  {
    year: "2025 - Présent",
    title: "Cycle ingénieur Big Data & IA - ECE Paris",
    description: "Formation avancée en intelligence artificielle et analyse de données massives. Spécialisation dans les algorithmes de machine learning, architectures distribuées et développement de solutions IA innovantes.",
  },
  {
    year: "2025",
    title: "Certifications Google & IBM Data Analytics",
    description: "Obtention des certifications Google Advanced Data Analytics Professional et IBM Data Analyst Professional. Maîtrise complète de l'analyse de données, visualisation avec Tableau, et statistiques avancées.",
  },
  {
    year: "2024 - 2025",
    title: "Bachelor Développement Fullstack & DevOps - Paris",
    description: "Formation complète en développement web et mobile avec une spécialisation DevOps. Maîtrise des technologies frontend (React, Flutter), backend (Node.js, Symfony) et des pratiques d'intégration continue.",
  },
  {
    year: "2023 - 2024",
    title: "Projets Personnels & Freelance",
    description: "Développement d'applications mobiles et web pour divers clients. Création d'une expertise en Flutter, Firebase et développement de solutions innovantes.",
  },
  {
    year: "2020 - 2023",
    title: "Diplôme en Génie Logiciel - Togo",
    description: "Formation complète axée sur le développement web et mobile, les mathématiques appliquées, les statistiques et la conception de systèmes logiciels. Acquisition de bases solides en algorithmique et architecture.",
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Hero */}
      <div className="grid gap-12 md:grid-cols-[1fr,280px] md:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">À propos</h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              Je m&apos;appelle Yendi Yohann, élève ingénieur Big Data &amp; IA à l&apos;ECE Paris. Ce qui
              m&apos;intéresse, c&apos;est la chaîne complète : affiner un modèle, le servir derrière une API, le
              conteneuriser et le déployer de façon reproductible.
            </p>
            <p>
              Je viens du développement backend, et c&apos;est ce qui fait la différence : je ne découvre pas
              Docker, les tests et l&apos;intégration continue au moment de déployer. Deux stages en
              développement, dont un en Go sur un système déjà en production.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="gap-2">
              <Link href="/contact">
                Me contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            {/* CV download removed */}
          </div>
        </div>

        {/* Photo */}
        <div className="relative mx-auto aspect-square w-full max-w-[280px] overflow-hidden rounded-2xl bg-secondary">
          <Image
            src="/avatar.jpg"
            alt="Yendi Yohann"
            fill
            className="object-cover"
            sizes="280px"
            priority
          />
        </div>
      </div>

      {/* Ce que je recherche */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Ce que je recherche</h2>
        <div className="mt-6 rounded-xl border border-border/40 bg-card p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">Stage de 4 à 6 mois</Badge>
            <Badge variant="secondary" className="text-sm">À partir d&apos;avril 2027</Badge>
            <Badge variant="secondary" className="text-sm">MLOps</Badge>
            <Badge variant="secondary" className="text-sm">Data engineering</Badge>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Je cherche une équipe technique, en <strong className="text-foreground">région parisienne ou en remote</strong>,
            où je pourrai mettre des modèles en production : les servir, les conteneuriser, les déployer, et
            mesurer qu&apos;ils font ce qu&apos;on attend d&apos;eux.
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            Mes <Link href="/projects" className="text-accent underline-offset-4 hover:underline">projets</Link> sont
            classés par ce qu&apos;ils démontrent : c&apos;est le plus rapide pour juger si cela correspond à votre besoin.
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Mon parcours</h2>
        <div className="mt-8 space-y-8">
          {timeline.map((item, index) => (
            <div key={item.year} className="relative flex gap-6">
              {/* Line */}
              {index < timeline.length - 1 && (
                <div className="absolute left-3 top-8 h-full w-px bg-border" />
              )}
              {/* Dot */}
              <div className="relative z-10 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-border bg-background">
                <div className="h-2 w-2 rounded-full bg-foreground" />
              </div>
              {/* Content */}
              <div className="pb-8">
                <span className="text-sm font-medium text-muted-foreground">{item.year}</span>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
                <p className="mt-2 text-muted-foreground">{item.description}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Mes valeurs</h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title} className="rounded-xl border border-border/40 bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">{value.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{value.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi le MLOps */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Pourquoi le MLOps ?</h2>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Un modèle qui reste dans un notebook ne sert à personne. Ce qui m&apos;intéresse, c&apos;est la partie que
            la plupart des gens sautent : rendre un résultat reproductible et savoir le mesurer, puis le servir
            derrière une API qui tient la charge.
          </p>
          <p>
            Mon parcours en développement (fullstack, mobile, DevOps) est un atout : je sais construire
            l&apos;application autour du modèle. Ma formation en Big Data &amp; IA m&apos;apporte l&apos;autre moitié :
            la donnée, l&apos;entraînement, l&apos;évaluation.
          </p>
          <p>
            Du mobile avec Flutter au backend avec Symfony, Node.js et Go, en passant par l&apos;analyse de données
            et le machine learning, j&apos;aime maîtriser toute la chaîne. C&apos;est cette polyvalence qui me permet
            de m&apos;adapter à un projet plutôt que d&apos;adapter le projet à mes outils.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-xl border border-border/40 bg-card p-8 text-center">
        <h3 className="text-xl font-semibold">Envie d&apos;en savoir plus ?</h3>
        <p className="mt-2 text-muted-foreground">
          Consultez mes projets ou contactez-moi directement.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-accent text-background hover:bg-accent/90">
            <Link href="/projects">Voir mes projets</Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">Me contacter</Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
