import { Hero } from "@/components/sections/hero"
import { AboutPreview } from "@/components/sections/about-preview"
import { ProjectsPreview } from "@/components/sections/projects-preview"
import { DataProjectsPreview } from "@/components/sections/data-projects-preview"
import { Skills } from "@/components/sections/skills"
import { Process } from "@/components/sections/process"
import { CurrentlyLearning } from "@/components/sections/currently-learning"
import { ContactCTA } from "@/components/sections/contact-cta"

export default function HomePage() {
  return (
    <>
      <Hero />
      <AboutPreview />
      <ProjectsPreview />
      <DataProjectsPreview />
      <Skills />
      <Process />
      <CurrentlyLearning />
      <ContactCTA />
    </>
  )
}
