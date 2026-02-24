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
    default: 'Yendi Yohann | Ingénieur Big Data & IA',
    template: '%s | Yendi Yohann',
  },
  description: 'Ingénieur Big Data & IA spécialisé en IA appliquée et software full-stack.',
  keywords: ['ingénieur', 'big data', 'IA', 'software', 'machine learning', 'full-stack', 'Python', 'React'],
  authors: [{ name: 'Yendi Yohann' }],
  creator: 'Yendi Yohann',
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://alexmartin.dev',
    title: 'Yendi Yohann | Ingénieur Big Data & IA',
    description: 'Ingénieur Big Data & IA spécialisé en IA appliquée et software full-stack.',
    siteName: 'Yendi Yohann Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yendi Yohann | Ingénieur Big Data & IA',
    description: 'Ingénieur Big Data & IA spécialisé en IA appliquée et software full-stack.',
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
