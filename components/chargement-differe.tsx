"use client"

import dynamic from "next/dynamic"

/**
 * Le robot, la visite automatique et la telecommande : des composants lourds (animation, voix, musique) dont la page n'a pas
 * besoin pour s'afficher. On les charge juste apres le premier rendu, dans leur propre fichier, au lieu de les embarquer
 * dans le code que le navigateur doit telecharger et analyser avant de pouvoir afficher quoi que ce soit.
 */
export const Objet3D = dynamic(() => import("@/components/objet-3d").then((m) => m.Objet3D), { ssr: false })
export const PresentationAuto = dynamic(() => import("@/components/presentation-auto").then((m) => m.PresentationAuto), { ssr: false })
export const Telecommande = dynamic(() => import("@/components/telecommande").then((m) => m.Telecommande), { ssr: false })
