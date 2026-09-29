import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-start justify-center px-6 py-24">
      <p className="rag__kicker">Erreur 404</p>
      <h1 className="mt-3 text-4xl font-semibold tracking-tight md:text-5xl">Cette page n&apos;existe pas.</h1>
      <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
        Le lien est peut-être ancien, ou l&apos;adresse mal recopiée. Voici où reprendre.
      </p>
      <div className="mt-8 flex flex-wrap gap-4">
        <Button asChild size="lg" className="gap-2 bg-accent text-background hover:bg-accent/90">
          <Link href="/">
            Retour à l&apos;accueil
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
        <Button asChild size="lg" variant="outline" className="bg-transparent">
          <Link href="/projects">Voir mes projets</Link>
        </Button>
      </div>
    </div>
  )
}
