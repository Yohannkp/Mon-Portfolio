import React from "react"
import type { Metadata, Viewport } from 'next'
import { Inter, Geist_Mono } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import { ThemeProvider } from '@/components/theme-provider'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import './globals.css'

const _inter = Inter({ subsets: ['latin'], variable: '--font-inter' })
const _geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: {
    default: 'Alex Martin | Développeur Web Junior',
    template: '%s | Alex Martin',
  },
  description: 'Développeur Web Junior spécialisé en front-end et full-stack. Je transforme des idées en applications propres et utiles.',
  keywords: ['développeur web', 'junior', 'front-end', 'full-stack', 'React', 'Next.js', 'TypeScript'],
  authors: [{ name: 'Alex Martin' }],
  creator: 'Alex Martin',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://alexmartin.dev',
    title: 'Alex Martin | Développeur Web Junior',
    description: 'Développeur Web Junior spécialisé en front-end et full-stack. Je transforme des idées en applications propres et utiles.',
    siteName: 'Alex Martin Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Alex Martin | Développeur Web Junior',
    description: 'Développeur Web Junior spécialisé en front-end et full-stack.',
  },
  robots: {
    index: true,
    follow: true,
  },
    generator: 'v0.app'
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#1a1a1a' },
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
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  )
}
