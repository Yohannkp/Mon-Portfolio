import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { Tilt3D } from '@/components/tilt-3d'
import { PageTransition } from '@/components/page-transition'
import { SITE_URL } from '@/lib/site'
import './globals.css'
import './demo-guide.css'
import './projets.css'
import './presentation-auto.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Yendi Yohann | MLOps & Machine Learning Engineering',
    template: '%s | Yendi Yohann',
  },
  description: "Élève ingénieur Big Data & IA à l'ECE Paris. J'affine des modèles et je les mets en production : pipelines de données, APIs, conteneurisation, déploiement continu.",
  keywords: ['MLOps', 'machine learning engineering', 'data engineering', 'Python', 'SQL', 'Go', 'Docker', 'PyTorch', 'FastAPI', 'fine-tuning LLM', 'ECE Paris'],
  authors: [{ name: 'Yendi Yohann' }],
  creator: 'Yendi Yohann',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: SITE_URL,
    title: 'Yendi Yohann | MLOps & Machine Learning Engineering',
    description: "Élève ingénieur Big Data & IA à l'ECE Paris. J'affine des modèles et je les mets en production : pipelines de données, APIs, conteneurisation, déploiement continu.",
    siteName: 'Yendi Yohann — Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yendi Yohann | MLOps & Machine Learning Engineering',
    description: "Élève ingénieur Big Data & IA à l'ECE Paris. J'affine des modèles et je les mets en production : pipelines de données, APIs, conteneurisation, déploiement continu.",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
          <Tilt3D />
          <PageTransition />
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
