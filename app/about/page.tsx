import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Download, Heart, Zap, Eye } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CV_URL } from "@/lib/contact"
import { Badge } from "@/components/ui/badge"
import { T } from "@/components/t"

export const metadata: Metadata = {
  title: "À propos",
  description: "Élève ingénieur Big Data & IA à l'ECE Paris, en recherche d'un stage MLOps ou data engineering à partir d'avril 2027.",
}

/** Chaque texte : [français, anglais]. */
type Texte = [string, string]

const values: { icon: typeof Heart; title: Texte; description: Texte }[] = [
  {
    icon: Heart,
    title: ["Qualité", "Quality"],
    description: [
      "Je préfère prendre le temps de bien faire plutôt que de livrer du code médiocre. Chaque ligne compte.",
      "I'd rather take the time to do it right than ship mediocre code. Every line counts.",
    ],
  },
  {
    icon: Zap,
    title: ["Curiosité", "Curiosity"],
    description: [
      "J'aime comprendre comment les choses fonctionnent et explorer de nouvelles technologies.",
      "I like understanding how things work and exploring new technologies.",
    ],
  },
  {
    icon: Eye,
    title: ["Rigueur", "Rigor"],
    description: [
      "Tests, documentation, revue de code : les bonnes pratiques ne sont pas optionnelles.",
      "Tests, documentation, code review: good practices aren't optional.",
    ],
  },
]

const timeline: { year: Texte; title: Texte; description: Texte }[] = [
  {
    year: ["Juil. - août 2026", "Jul. – Aug. 2026"],
    title: ["Stage — développeur backend Go, Soft Optimum Services", "Internship — Go backend developer, Soft Optimum Services"],
    description: [
      "Cinq semaines sur un moteur de traitement de données déjà en production : Go, Docker Compose, détection de panne automatique (heartbeat), audit des dépendances et durcissement des conteneurs.",
      "Five weeks on a data-processing engine already in production: Go, Docker Compose, automatic failure detection (heartbeat), dependency audit and container hardening.",
    ],
  },
  {
    year: ["2025 - Présent", "2025 – Present"],
    title: ["Cycle ingénieur Big Data & IA - ECE Paris", "Big Data & AI engineering cycle - ECE Paris"],
    description: [
      "Formation avancée en intelligence artificielle et analyse de données massives. Spécialisation dans les algorithmes de machine learning, architectures distribuées et développement de solutions IA innovantes.",
      "Advanced training in artificial intelligence and big data analysis. Specialisation in machine-learning algorithms, distributed architectures and the development of innovative AI solutions.",
    ],
  },
  {
    year: ["2025", "2025"],
    title: ["Certifications Google & IBM Data Analytics", "Google & IBM Data Analytics certifications"],
    description: [
      "Certifications Google Advanced Data Analytics et IBM Data Analyst Professional : analyse de données, visualisation et statistiques.",
      "Google Advanced Data Analytics and IBM Data Analyst Professional certifications: data analysis, visualisation and statistics.",
    ],
  },
  {
    year: ["2024 - 2025", "2024 – 2025"],
    title: ["Master 1 Big Data & IA - IPSSI Paris", "Master 1 Big Data & AI - IPSSI Paris"],
    description: [
      "Machine learning et deep learning (PyTorch, scikit-learn), traitement de grands volumes de données et pipelines Big Data.",
      "Machine learning and deep learning (PyTorch, scikit-learn), processing large volumes of data and Big Data pipelines.",
    ],
  },
  {
    year: ["Janv. - avr. 2024", "Jan. – Apr. 2024"],
    title: ["Stage — développeur mobile Flutter, TRUSTLINE", "Internship — Flutter mobile developer, TRUSTLINE"],
    description: [
      "Application mobile d'un produit de gestion hôtelière déjà en service, connectée aux API REST existantes du produit.",
      "Mobile application for a hotel-management product already in service, connected to the product's existing REST APIs.",
    ],
  },
  {
    year: ["2023 - 2024", "2023 – 2024"],
    title: ["Bachelor Développement Fullstack & DevOps - IPSSI Paris", "Bachelor in Fullstack Development & DevOps - IPSSI Paris"],
    description: [
      "Formation en développement web et mobile avec une spécialisation DevOps : React, Flutter, Node.js, Symfony et intégration continue.",
      "Training in web and mobile development with a DevOps specialisation: React, Flutter, Node.js, Symfony and continuous integration.",
    ],
  },
  {
    year: ["2020 - 2023", "2020 – 2023"],
    title: ["Diplôme en Génie Logiciel - Togo", "Software Engineering degree - Togo"],
    description: [
      "Formation complète axée sur le développement web et mobile, les mathématiques appliquées, les statistiques et la conception de systèmes logiciels. Acquisition de bases solides en algorithmique et architecture.",
      "Complete training focused on web and mobile development, applied mathematics, statistics and software-system design. Solid foundations in algorithmics and architecture.",
    ],
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      {/* Hero */}
      <div className="grid gap-12 md:grid-cols-[1fr_280px] md:items-start">
        <div>
          <h1 className="text-4xl font-semibold tracking-tight">
            <T fr="À propos" en="About" />
          </h1>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-muted-foreground">
            <p>
              <T
                fr="Je m'appelle Yendi Yohann, élève ingénieur Big Data & IA à l'ECE Paris. Ce qui m'intéresse, c'est la chaîne complète : affiner un modèle, le servir derrière une API, le conteneuriser et le déployer de façon reproductible."
                en="My name is Yendi Yohann, a Big Data & AI engineering student at ECE Paris. What interests me is the full chain: fine-tuning a model, serving it behind an API, containerising it and deploying it reproducibly."
              />
            </p>
            <p>
              <T
                fr="Je viens du développement backend, et c'est ce qui fait la différence : je ne découvre pas Docker, les tests et l'intégration continue au moment de déployer. Deux stages en développement, dont un en Go sur un système déjà en production."
                en="I come from backend development, and that's what makes the difference: I'm not discovering Docker, tests and continuous integration at deployment time. Two development internships, one of them in Go on a system already in production."
              />
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-4">
            <Button asChild className="gap-2">
              <Link href="/contact">
                <T fr="Me contacter" en="Contact me" />
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={CV_URL} download>
                <Download className="h-4 w-4" />
                <T fr="Télécharger mon CV" en="Download my CV (in French)" />
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
        <h2 className="text-2xl font-semibold tracking-tight">
          <T fr="Ce que je recherche" en="What I'm looking for" />
        </h2>
        <div className="mt-6 rounded-xl border border-border/40 bg-card p-6">
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-sm">
              <T fr="Stage de 4 à 6 mois" en="4–6 month internship" />
            </Badge>
            <Badge variant="secondary" className="text-sm">
              <T fr="À partir d'avril 2027" en="Starting April 2027" />
            </Badge>
            <Badge variant="secondary" className="text-sm">MLOps</Badge>
            <Badge variant="secondary" className="text-sm">Data engineering</Badge>
          </div>
          <p className="mt-4 leading-relaxed text-muted-foreground">
            <T
              fr={
                <>
                  Je cherche une équipe technique, en <strong className="text-foreground">France (région parisienne en priorité, mobile partout), au Luxembourg ou en Belgique</strong>, où je pourrai mettre des modèles en production : les servir, les conteneuriser, les déployer, et mesurer qu&apos;ils font ce qu&apos;on attend d&apos;eux.
                </>
              }
              en={
                <>
                  I&apos;m looking for a technical team, in <strong className="text-foreground">France (Paris region first, mobile anywhere), Luxembourg or Belgium</strong>, where I can put models into production: serve them, containerise them, deploy them, and measure that they do what&apos;s expected of them.
                </>
              }
            />
          </p>
          <p className="mt-3 text-sm text-muted-foreground">
            <T
              fr={
                <>
                  Mes <Link href="/projects" className="text-accent underline-offset-4 hover:underline">projets</Link> sont classés par ce qu&apos;ils démontrent : c&apos;est le plus rapide pour juger si cela correspond à votre besoin.
                </>
              }
              en={
                <>
                  My <Link href="/projects" className="text-accent underline-offset-4 hover:underline">projects</Link> are ranked by what they demonstrate: it&apos;s the quickest way to judge whether it matches your need.
                </>
              }
            />
          </p>
        </div>
      </section>

      {/* Parcours */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">
          <T fr="Mon parcours" en="My background" />
        </h2>
        <div className="mt-8 space-y-8">
          {timeline.map((item, index) => (
            <div key={item.year[0]} className="relative flex gap-6">
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
                <span className="text-sm font-medium text-muted-foreground">
                  <T fr={item.year[0]} en={item.year[1]} />
                </span>
                <h3 className="mt-1 font-semibold">
                  <T fr={item.title[0]} en={item.title[1]} />
                </h3>
                <p className="mt-2 text-muted-foreground">
                  <T fr={item.description[0]} en={item.description[1]} />
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Valeurs */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">
          <T fr="Mes valeurs" en="My values" />
        </h2>
        <div className="mt-8 grid gap-6 sm:grid-cols-3">
          {values.map((value) => (
            <div key={value.title[0]} className="rounded-xl border border-border/40 bg-card p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <value.icon className="h-5 w-5" />
              </div>
              <h3 className="mt-4 font-semibold">
                <T fr={value.title[0]} en={value.title[1]} />
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                <T fr={value.description[0]} en={value.description[1]} />
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pourquoi le MLOps */}
      <section className="mt-20">
        <h2 className="text-2xl font-semibold tracking-tight">
          <T fr="Pourquoi le MLOps ?" en="Why MLOps?" />
        </h2>
        <div className="mt-6 space-y-4 leading-relaxed text-muted-foreground">
          <p>
            <T
              fr="Un modèle qui reste dans un notebook ne sert à personne. Ce qui m'intéresse, c'est la partie que la plupart des gens sautent : rendre un résultat reproductible et savoir le mesurer, puis le servir derrière une API qui tient la charge."
              en="A model that stays in a notebook is no use to anyone. What interests me is the part most people skip: making a result reproducible and knowing how to measure it, then serving it behind an API that holds up under load."
            />
          </p>
          <p>
            <T
              fr="Mon parcours en développement (fullstack, mobile, DevOps) est un atout : je sais construire l'application autour du modèle. Ma formation en Big Data & IA m'apporte l'autre moitié : la donnée, l'entraînement, l'évaluation."
              en="My development background (fullstack, mobile, DevOps) is an asset: I know how to build the application around the model. My Big Data & AI training brings the other half: the data, the training, the evaluation."
            />
          </p>
          <p>
            <T
              fr="Du mobile avec Flutter au backend avec Symfony, Node.js et Go, en passant par l'analyse de données et le machine learning, j'aime maîtriser toute la chaîne. C'est cette polyvalence qui me permet de m'adapter à un projet plutôt que d'adapter le projet à mes outils."
              en="From mobile with Flutter to backend with Symfony, Node.js and Go, by way of data analysis and machine learning, I like mastering the whole chain. That versatility lets me adapt to a project rather than adapt the project to my tools."
            />
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-20 rounded-xl border border-border/40 bg-card p-8 text-center">
        <h3 className="text-xl font-semibold">
          <T fr="Envie d'en savoir plus ?" en="Want to know more?" />
        </h3>
        <p className="mt-2 text-muted-foreground">
          <T fr="Consultez mes projets ou contactez-moi directement." en="Have a look at my projects or contact me directly." />
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          <Button asChild className="bg-accent text-background hover:bg-accent/90">
            <Link href="/projects">
              <T fr="Voir mes projets" en="See my projects" />
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/contact">
              <T fr="Me contacter" en="Contact me" />
            </Link>
          </Button>
        </div>
      </section>
    </div>
  )
}
