"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { LazyMotion, m } from "framer-motion"
import { Menu, X, Moon, Sun, Languages } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { changerLangue, useLangue, useT } from "@/lib/langue"

// Charge a la demande : la pastille animee du menu n'est pas necessaire au premier affichage.
const chargerAnimations = () => import("@/components/motion-features").then((r) => r.default)

const navigation = [
  { fr: "Accueil", en: "Home", href: "/" },
  { fr: "Projets", en: "Projects", href: "/projects" },
  { fr: "À propos", en: "About", href: "/about" },
  { fr: "Contact", en: "Contact", href: "/contact" },
]

export function Header() {
  const pathname = usePathname()
  const langue = useLangue()
  const t = useT()
  const { theme, setTheme } = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  // Le menu mobile se ferme quand la page change : la transition de page
  // intercepte le clic, donc le onClick du lien ne suffit plus.
  React.useEffect(() => {
    setMobileMenuOpen(false)
  }, [pathname])

  return (
    <LazyMotion features={chargerAnimations}>
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur-md">
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="h-entree text-lg font-semibold tracking-tight">Yendi Yohann</div>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative px-4 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {t(item.fr, item.en)}
                {isActive && (
                  <m.div
                    layoutId="activeNav"
                    className="absolute inset-0 rounded-lg bg-secondary"
                    style={{ zIndex: -1 }}
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          {/* Langue : FR <-> EN. Le bouton affiche la langue vers laquelle on bascule. */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => changerLangue(langue === "fr" ? "en" : "fr")}
            className="h-9 gap-1.5 px-2.5 font-mono text-xs"
            aria-label={t("Switch to English", "Passer en français")}
            title={t("Switch to English", "Passer en français")}
            lang={langue === "fr" ? "en" : "fr"}
          >
            <Languages className="h-4 w-4" />
            <span className={langue === "fr" ? "text-foreground" : "text-muted-foreground"}>FR</span>
            <span className="text-muted-foreground/50">/</span>
            <span className={langue === "en" ? "text-foreground" : "text-muted-foreground"}>EN</span>
          </Button>

          {/* Theme toggle */}
          {mounted && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              className="h-9 w-9"
            >
              {theme === "dark" ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              <span className="sr-only">{t("Changer de thème", "Toggle theme")}</span>
            </Button>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className="h-4 w-4" />
            ) : (
              <Menu className="h-4 w-4" />
            )}
            <span className="sr-only">{t("Ouvrir le menu", "Toggle menu")}</span>
          </Button>
        </div>
      </nav>

      {/* Mobile navigation */}
      {mobileMenuOpen && (
        <div className="h-menu border-t border-border/40 bg-background md:hidden">
          <div className="space-y-1 px-6 py-4">
            {navigation.map((item) => {
              const isActive = pathname === item.href
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={cn(
                    "block rounded-lg px-4 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "bg-secondary text-foreground"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  )}
                >
                  {t(item.fr, item.en)}
                </Link>
              )
            })}
          </div>
        </div>
      )}
    </header>
    </LazyMotion>
  )
}
