import { NextResponse, type NextRequest } from "next/server"

/**
 * /presentation n'est visible que par son auteur.
 *
 * La cle est la variable d'environnement PRESENTATION_CLE (a definir sur Vercel : Settings > Environment Variables).
 * Premiere visite, une seule fois par appareil : /presentation?cle=LA_CLE  -> un cookie (httpOnly, 30 jours) est pose,
 * puis /presentation marche sans rien. Sans cookie ni cle, la page repond comme une adresse qui n'existe pas (404) :
 * elle n'est ni dans le plan du site, ni dans robots.txt, ni indexee.
 *
 * Fermee par defaut : en production, sans PRESENTATION_CLE, elle est introuvable pour tout le monde.
 * En developpement local, sans cle definie, elle est ouverte (pour travailler dessus).
 */
const COOKIE = "pres"

async function empreinte(cle: string) {
  const data = new TextEncoder().encode(`${cle}|presentation|v1`)
  const hash = await crypto.subtle.digest("SHA-256", data)
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

function egal(a: string, b: string) {
  if (a.length !== b.length) return false
  let diff = 0
  for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i)
  return diff === 0
}

const introuvable = (req: NextRequest) => NextResponse.rewrite(new URL("/introuvable-presentation", req.url))

export async function proxy(req: NextRequest) {
  const cle = process.env.PRESENTATION_CLE
  if (!cle) return process.env.NODE_ENV === "production" ? introuvable(req) : NextResponse.next()

  const attendu = await empreinte(cle)
  const cookie = req.cookies.get(COOKIE)?.value
  if (cookie && egal(cookie, attendu)) return NextResponse.next()

  const fournie = req.nextUrl.searchParams.get("cle")
  if (fournie && egal(await empreinte(fournie), attendu)) {
    const url = req.nextUrl.clone()
    url.searchParams.delete("cle")
    const res = NextResponse.redirect(url)
    res.cookies.set(COOKIE, attendu, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/presentation",
      maxAge: 60 * 60 * 24 * 30,
    })
    return res
  }
  return introuvable(req)
}

export const config = { matcher: ["/presentation"] }
