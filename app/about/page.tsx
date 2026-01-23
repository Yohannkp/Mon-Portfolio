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
    year: "2024",
    title: "Formation intensive",
    description: "Bootcamp de développement web full-stack. JavaScript, React, Node.js, bases de données.",
  },
  {
    year: "2023",
    title: "Apprentissage autodidacte",
    description: "Premiers pas en programmation. HTML, CSS, JavaScript. Projets personnels et tutoriels.",
  },
  {
    year: "2022",
    title: "Découverte du code",
    description: "Première ligne de code. Fascination pour la création et la résolution de problèmes.",
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
              Bonjour, je m&apos;appelle Yendi Yohann. Je suis développeur web junior 
              passionné par la création d&apos;applications web modernes et performantes.
            </p>
            <p>
              Mon parcours a commencé il y a quelques années par curiosité, et s&apos;est 
              rapidement transformé en passion. Après une formation intensive et de 
              nombreux projets personnels, je suis prêt à rejoindre une équipe où je 
              pourrai contribuer tout en continuant à apprendre.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="gap-2">
              <Link href="/contact">
                Me contacter
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href="/cv.pdf" download>
                <Download className="h-4 w-4" />
                Télécharger mon CV
              </a>
            </Button>
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
            Ce qui m&apos;a attiré vers le développement, c&apos;est la combinaison unique de 
            créativité et de logique. Créer quelque chose à partir de rien, voir une 
            idée prendre forme sur l&apos;écran, résoudre des problèmes complexes — tout 
            ça me passionne.
          </p>
          <p>
            J&apos;aime particulièrement le front-end car il permet de créer des expériences 
            qui ont un impact direct sur les utilisateurs. Mais j&apos;apprécie aussi le 
            backend pour sa logique et sa structure. C&apos;est pourquoi je me forme en 
            full-stack.
          </p>
          <p>
            Le développement, c&apos;est aussi un domaine où l&apos;apprentissage ne s&apos;arrête 
            jamais. Il y a toujours une nouvelle technologie à explorer, une meilleure 
            façon de faire les choses. Cette évolution permanente me motive.
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
