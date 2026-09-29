/** Les coordonnees, a un seul endroit : le formulaire, la page Contact et le pied de page s'en servent. */
export const EMAIL = "yendiyohann@gmail.com"

/**
 * Le lien mailto d'un message : sujet et corps deja remplis.
 * Ce site n'a pas de serveur qui envoie du courrier : le formulaire prepare le message dans
 * l'application e-mail du visiteur, et il ne part que lorsque celui-ci l'envoie.
 */
export function lienMessage(nom: string, email: string, sujet: string, message: string) {
  const corps = `${message}\n\n— ${nom} (${email})`
  return `mailto:${EMAIL}?subject=${encodeURIComponent(sujet)}&body=${encodeURIComponent(corps)}`
}
