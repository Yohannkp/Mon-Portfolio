import type { MetadataRoute } from "next"
import { projects } from "@/lib/projects"
import { ETUDES } from "@/lib/etudes"
import { SITE_URL } from "@/lib/site"

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/projects", "/about", "/contact"].map((chemin) => ({
    url: `${SITE_URL}${chemin}`,
    changeFrequency: "monthly" as const,
    priority: chemin === "" ? 1 : 0.8,
  }))
  const fiches = [...projects.map((p) => p.slug), ...ETUDES.map((e) => e.slug)].map((slug) => ({
    url: `${SITE_URL}/projects/${slug}`,
    changeFrequency: "yearly" as const,
    priority: 0.6,
  }))
  return [...pages, ...fiches]
}
