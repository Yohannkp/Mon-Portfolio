"use client"

import * as React from "react"
import { Check, Copy, Mail, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { EMAIL, lienMessage } from "@/lib/contact"
import { useT } from "@/lib/langue"

/**
 * Le formulaire prepare le message dans l'application e-mail du visiteur.
 *
 * Il ne pretend pas l'avoir envoye : ce site n'a pas de serveur de courrier, et un faux
 * « Message envoye ! » ferait croire a un recruteur qu'il a ete lu alors que rien ne serait
 * parti. On dit ce qui se passe, et on donne l'adresse au cas ou rien ne s'ouvre.
 */
export function ContactForm() {
  const t = useT()
  const [pret, setPret] = React.useState<string | null>(null)
  const [copie, setCopie] = React.useState(false)

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const d = new FormData(event.currentTarget)
    const href = lienMessage(String(d.get("name")), String(d.get("email")), String(d.get("subject")), String(d.get("message")))
    setPret(href)
    window.location.href = href
  }

  async function copier() {
    try {
      await navigator.clipboard.writeText(EMAIL)
      setCopie(true)
      window.setTimeout(() => setCopie(false), 2000)
    } catch {
      /* le presse-papiers peut etre refuse : l'adresse reste affichee, on ne bloque rien */
    }
  }

  return (
    <>
      {pret ? (
        <div className="carte mt-8" role="status">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
            <Mail className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-semibold">{t("Votre message est prêt dans votre application e-mail", "Your message is ready in your email application")}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
            {t(
              "Il ne part que lorsque vous l'envoyez depuis votre messagerie. Rien ne s'est ouvert ? Écrivez-moi directement à ",
              "It only goes out when you send it from your mail app. Nothing opened? Write to me directly at ",
            )}
            <a className="font-medium text-foreground underline-offset-4 hover:underline" href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild variant="outline" className="gap-2 bg-transparent">
              <a href={pret}>
                <Mail className="h-4 w-4" />
                {t("Rouvrir mon application e-mail", "Reopen my email application")}
              </a>
            </Button>
            <Button variant="outline" className="gap-2 bg-transparent" onClick={copier}>
              {copie ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              {copie ? t("Adresse copiée", "Address copied") : t("Copier l'adresse", "Copy the address")}
            </Button>
            <Button variant="ghost" className="gap-2" onClick={() => setPret(null)}>
              <RotateCcw className="h-4 w-4" />
              {t("Modifier le message", "Edit the message")}
            </Button>
          </div>
        </div>
      ) : null}

      {/* Le formulaire reste dans la page (masque) : « Modifier le message » retrouve ce qui a ete saisi. */}
      <form onSubmit={handleSubmit} className="mt-8 space-y-6" hidden={!!pret}>
        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="name">{t("Nom", "Name")}</Label>
            <Input id="name" name="name" placeholder={t("Votre nom", "Your name")} autoComplete="name" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" placeholder={t("votre@email.com", "you@email.com")} autoComplete="email" required />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="subject">{t("Sujet", "Subject")}</Label>
          <Input id="subject" name="subject" placeholder={t("Objet de votre message", "Subject of your message")} required />
        </div>

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea id="message" name="message" placeholder={t("Votre message…", "Your message…")} rows={6} className="min-h-40" required />
        </div>

        <Button type="submit" className="w-full gap-2 bg-accent text-background hover:bg-accent/90">
          <Mail className="h-4 w-4" />
          {t("Envoyer par e-mail", "Send by email")}
        </Button>
        <p className="text-xs leading-relaxed text-muted-foreground">
          {t(
            "Ce bouton ouvre votre application e-mail avec le message déjà rédigé : il vous reste à l'envoyer.",
            "This button opens your email application with the message already written: all that's left is to send it.",
          )}
        </p>
      </form>
    </>
  )
}
