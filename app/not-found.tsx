import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { T } from "@/components/t"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-24">
      <p className="rag__kicker">
        <T fr="Erreur 404" en="Error 404" />
      </p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">
        <T fr="Cette page n'existe pas." en="This page does not exist." />
      </h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        <T fr="Le lien est peut-être ancien, ou l'adresse mal recopiée. Voici où reprendre." en="The link may be old, or the address mistyped. Here is where to pick up." />
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild size="lg" className="gap-2 bg-accent text-background hover:bg-accent/90">
          <Link href="/">
            <T fr="Retour à l'accueil" en="Back to home" />
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-transparent">
          <Link href="/projects">
            <T fr="Voir mes projets" en="See my projects" />
          </Link>
        </Button>
      </div>
    </div>
  )
}
