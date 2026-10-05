import type { Metadata } from "next"
import { ContactForm } from "@/components/contact-form"
import { Download, Github, Linkedin, Mail, MapPin } from "lucide-react"
import { CV_URL, EMAIL } from "@/lib/contact"
import { T } from "@/components/t"
import type { ReactNode } from "react"

export const metadata: Metadata = {
  title: "Contact",
  description: "Contactez-moi pour discuter d'opportunités ou de projets.",
}

const contactInfo: { icon: typeof Mail; label: ReactNode; value: ReactNode; href: string | null }[] = [
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
    label: <T fr="Localisation" en="Location" />,
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
          <T
            fr="Vous avez une opportunité à me proposer ou simplement envie de discuter ? N'hésitez pas à me contacter, je réponds généralement sous 24h."
            en="Do you have an opportunity to offer me, or just want to chat? Don't hesitate to get in touch; I usually reply within 24 hours."
          />
        </p>
      </div>

      <div className="mt-16 grid gap-16 lg:grid-cols-2">
        {/* Form */}
        <div>
          <h2 className="text-xl font-semibold">
            <T fr="Envoyez-moi un message" en="Send me a message" />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <T
              fr="Écrivez votre message ici : il s'ouvre dans votre application e-mail, prêt à envoyer."
              en="Write your message here: it opens in your email application, ready to send."
            />
          </p>
          <ContactForm />
        </div>

        {/* Contact info */}
        <div>
          <h2 className="text-xl font-semibold">
            <T fr="Autres moyens de contact" en="Other ways to reach me" />
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            <T fr="Vous pouvez également me retrouver sur ces plateformes." en="You can also find me on these platforms." />
          </p>
          
          <div className="mt-8 space-y-4">
            {contactInfo.map((item) => (
              <div key={item.href ?? "lieu"} className="flex items-center gap-4 rounded-lg border border-border/40 bg-card p-4">
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
              <span className="font-medium">
                <T fr="Disponible pour opportunités" en="Open to opportunities" />
              </span>
            </div>
            <p className="mt-3 text-sm text-muted-foreground">
              <T
                fr="Je cherche un stage de 4 à 6 mois à partir d'avril 2027, en MLOps ou en data engineering. Ouvert aux propositions partout en France, au Luxembourg et en Belgique, en priorité en région parisienne."
                en="I'm looking for a 4–6 month internship starting April 2027, in MLOps or data engineering. Open to offers anywhere in France, in Luxembourg and in Belgium, with priority given to the Paris region."
              />
            </p>
            <a
              href={CV_URL}
              download
              className="mt-4 inline-flex items-center gap-2 text-sm font-medium text-accent underline-offset-4 hover:underline"
            >
              <Download className="h-4 w-4" />
              <T fr="Télécharger mon CV (PDF)" en="Download my CV (PDF, in French)" />
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
