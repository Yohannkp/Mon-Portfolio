import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { CV_URL, EMAIL } from "@/lib/contact"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-moi pour discuter d'opportunités ou de projets.",
}

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: EMAIL,
    href: `mailto:${EMAIL}`,
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "linkedin.com/in/yohannkp",
    href: "https://www.linkedin.com/in/yohannkp/",
  },
  {
    icon: Github,
    label: "GitHub",
    value: "github.com/Yohannkp",
    href: "https://github.com/Yohannkp",
  },
  {
    icon: MapPin,
    label: "Localisation",
    value: "Paris, France",
    href: null,
  },
]

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-4xl px-6 py-24">
      <div className="max-w-2xl">
        <h1 className="text-4xl font-semibold tracking-tight">Contact</h1>
        <p className="mt-4 text-lg text-muted-foreground">
          Vous avez une opportunité à me proposer ou simplement envie de discuter ? 
          N&apos;hésitez pas à me contacter, je réponds généralement sous 24h.
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Form */}
        <div>
          <h2 className="text-xl font-semibold">Envoyez-moi un message</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Écrivez votre message ici : il s&apos;ouvre dans votre application e-mail, prêt à envoyer.
          </p>
          <ContactForm />
        </div>

        {/* Contact info */}
        <div>
          <h2 className="text-xl font-semibold">Autres moyens de contact</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Vous pouvez également me retrouver sur ces plateformes.
          </p>
          
          <div className="mt-8 space-y-4">
            {contactInfo.map((item) => (
              <div key={item.label} className="flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-secondary">
                  <item.icon className="h-5 w-5 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{item.label}</p>
                  {item.href ? (
                    <a 
                      href={item.href}
                      target={item.href.startsWith("mailto") ? undefined : "_blank"}
                      rel={item.href.startsWith("mailto") ? undefined : "noopener noreferrer"}
                      className="font-medium transition-colors hover:text-accent"
                    >
                      {item.value}
                    </a>
                  ) : (
                    <p className="font-medium">{item.value}</p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Availability */}
          <div className="mt-8 rounded-lg border border-border/40 bg-card p-6">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
              </span>
              <span className="font-medium">Disponible pour opportunités</span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              Je cherche un stage de 4 à 6 mois à partir d&apos;avril 2027, en MLOps ou en data
              engineering. Ouvert aux propositions partout en France, au Luxembourg et en Belgique, en priorité en région parisienne.
            </p>
            <a
              href={CV_URL}
              download
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              <Download className="h-4 w-4" />
              Télécharger mon CV (PDF)
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
