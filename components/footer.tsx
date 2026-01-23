import Link from "next/link"
import { Github, Linkedin, Mail } from "lucide-react"

const socialLinks = [
  { name: "GitHub", href: "https://github.com/Yohannkp", icon: Github },
  { name: "LinkedIn", href: "https://www.linkedin.com/in/yohannkp/", icon: Linkedin },
  { name: "Email", href: "mailto:yendiyohann@gmail.com", icon: Mail },
]

export function Footer() {
  return (
    <footer className="border-t border-border/40 bg-background">
      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex flex-col items-center gap-2 md:items-start">
            <span className="text-sm font-medium">Yendi Yohann</span>
            <span className="text-sm text-muted-foreground">
              Développeur Web Junior
            </span>
          </div>

          <div className="flex items-center gap-4">
            {socialLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              >
                <link.icon className="h-5 w-5" />
                <span className="sr-only">{link.name}</span>
              </Link>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-border/40 pt-8 text-sm text-muted-foreground md:flex-row">
          <p>&copy; {new Date().getFullYear()} Yendi Yohann. Tous droits réservés.</p>
          <div className="flex items-center gap-1">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
            </span>
            <span className="ml-2">Disponible pour opportunités</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
