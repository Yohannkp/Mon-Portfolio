import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Download, Heart, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export const metadata: Metadata = {
  title: "À propos",
  description: "Découvrez mon parcours, ma motivation et ce que je recherche en tant que développeur web junior.",
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
    year: "2025 - Present",
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
              Bonjour, je m&apos;appelle Yendi Yohann. Je suis Data Analyst / Data Scientist
              base en France, avec une solide formation en data et une passion pour l&apos;innovation.
            </p>
            <p>
              Je conçois des analyses actionnables, des dashboards clairs et des modeles predictifs.
              Actuellement en cycle ingenieur Big Data & IA a l&apos;ECE Paris, j&apos;allie data, IA et sens produit
              pour livrer des solutions mesurables.
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

          <div className="mt-6 rounded-xl border border-border/40 bg-card p-4">
            <h3 className="font-semibold">Portfolio Data</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Je dispose d'un portfolio dédié à la data science présentant mes études de cas, notebooks, visualisations
              et projets analytiques réalisés pendant ma formation d'ingénierie Data. Vous y trouverez des démonstrations
              pratiques de mes compétences en nettoyage de données, modélisation et visualisation.
            </p>
            <div className="mt-3">
              <Button asChild variant="secondary" className="gap-2">
                <a href="https://www.datascienceportfol.io/yendiyohann" target="_blank" rel="noopener noreferrer">
                  Voir mon portfolio Data
                </a>
              </Button>
            </div>
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
            <Badge variant="secondary" className="text-sm">Stage</Badge>
            <Badge variant="secondary" className="text-sm">Alternance</Badge>
            <Badge variant="secondary" className="text-sm">Premier CDI</Badge>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            Je cherche une opportunité en <strong className="text-foreground">région parisienne ou en remote</strong> où 
            je pourrai m&apos;intégrer à une équipe technique bienveillante. L&apos;idéal serait 
            de travailler sur des projets concrets avec des technologies modernes (React, 
            Next.js, TypeScript) tout en bénéficiant d&apos;un accompagnement pour progresser.
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

      {/* Pourquoi le dev */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">Pourquoi le développement ?</h2>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            Ce qui m&apos;a attiré vers le développement, c&apos;est la capacité de créer des solutions 
            qui résolvent de vrais problèmes. Combiner développement fullstack, mobile et intelligence 
            artificielle me permet d&apos;apporter une vision globale et innovante à chaque projet.
          </p>
          <p>
            Ma formation en Big Data & IA complète parfaitement mes compétences en développement. 
            Je peux concevoir des applications qui ne sont pas seulement fonctionnelles, mais aussi 
            intelligentes et data-driven. C&apos;est cette double expertise qui me passionne et me différencie.
          </p>
          <p>
            Du mobile avec Flutter au backend avec Symfony et Node.js, en passant par l&apos;analyse de données 
            et le machine learning, j&apos;aime maîtriser toute la chaîne de développement. Cette polyvalence 
            me permet de m&apos;adapter à différents projets et de toujours apporter une valeur ajoutée.
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
          <Button asChild>
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
