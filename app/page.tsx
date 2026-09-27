import { Hero } from "@/components/sections/hero"
import { RagPipeline } from "@/components/sections/rag-pipeline"
import { ReadingRail } from "@/components/reading-rail"
import { AboutPreview } from "@/components/sections/about-preview"
import { FeaturedProjects } from "@/components/sections/featured-projects"
import { Skills } from "@/components/sections/skills"
import { Process } from "@/components/sections/process"
import { CurrentlyLearning } from "@/components/sections/currently-learning"
import { ContactCTA } from "@/components/sections/contact-cta"

export default function HomePage() {
  return (
    <>
      <ReadingRail />
      <Hero />
      <RagPipeline />
      <AboutPreview />
      <FeaturedProjects />
      <Skills />
      <Process />
      <CurrentlyLearning />
      <ContactCTA />
    </>
  )
}
