import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Tilt3D } from '@/components/tilt-3d'
import { PageTransition } from '@/components/page-transition'
import { LangueSync } from '@/components/langue-sync'
import { SITE_URL } from '@/lib/site'
import './globals.css'
import './demo-guide.css'
import './projets.css'
import './presentation-auto.css'
import './telecommande.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: './' },
  title: {
    default: 'Yendi Yohann | MLOps & Machine Learning Engineering',
    template: '%s | Yendi Yohann',
  },
  description: "Élève ingénieur Big Data & IA à l'ECE Paris. J'affine des modèles et je les mets en production : pipelines de données, APIs, conteneurisation, déploiement continu.",
  keywords: ['MLOps', 'machine learning engineering', 'data engineering', 'Python', 'SQL', 'Go', 'Docker', 'PyTorch', 'FastAPI', 'fine-tuning LLM', 'ECE Paris'],
  authors: [{ name: 'Yendi Yohann' }],
  creator: 'Yendi Yohann',
  // Ni titre ni description ici : Next reprend ceux de chaque page, et l'adresse './' se resout page par page.
  // Sinon, un lien vers /about ou un projet partage sur LinkedIn afficherait l'apercu de l'accueil.
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: './',
    siteName: 'Yendi Yohann — Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: [
      { url: '/icon-light-32x32.png', media: '(prefers-color-scheme: light)' },
      { url: '/icon-dark-32x32.png', media: '(prefers-color-scheme: dark)' },
    ],
    apple: '/apple-icon.png',
    shortcut: '/icon-light-32x32.png',
  },
  generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ecedf1' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0b0e' },
  ],
  width: 'device-width',
  initialScale: 1,
}

/** Donnees structurees : ce que les moteurs de recherche lisent pour presenter la personne (rien qui ne soit deja ecrit sur le site). */
const DONNEES_STRUCTUREES = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: 'Yendi Yohann',
  url: SITE_URL,
  image: `${SITE_URL}/avatar.jpg`,
  jobTitle: 'Élève ingénieur Big Data & IA',
  description: "J'affine des modèles, je les mets en production et je sais prouver qu'ils marchent.",
  alumniOf: { '@type': 'CollegeOrUniversity', name: 'ECE Paris' },
  knowsAbout: ['MLOps', 'Machine learning engineering', 'Data engineering', 'Python', 'SQL', 'Go', 'Docker', 'PyTorch', 'FastAPI'],
  sameAs: ['https://github.com/Yohannkp', 'https://www.linkedin.com/in/yohannkp/'],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={`${_inter.variable} ${_geistMono.variable} font-sans antialiased`}>
        {/* Premier element focalisable : au clavier, on peut sauter l'en-tete. */}
        <a href="#contenu" className="lien-evitement" style={{ position: 'fixed', left: 12, top: 8, transform: 'translateY(-200%)' }}>
          Aller au contenu
        </a>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main id="contenu" className="flex-1">
              {children}
            </main>
            <Footer />
          </div>
          <Tilt3D />
          <PageTransition />
          <LangueSync />
        </ThemeProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(DONNEES_STRUCTUREES).replace(/</g, '\\u003c') }}
        />
        <Analytics />
      </body>
    </html>
  )
}
