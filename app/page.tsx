import { Hero } from "@/components/sections/hero"
import { RagPipeline } from "@/components/sections/rag-pipeline"
import { DemoRag } from "@/components/sections/demo-rag"
import { DemoAgent } from "@/components/sections/demo-agent"
import { DemoMina } from "@/components/sections/demo-mina"
import { ReadingRail } from "@/components/reading-rail"
import { Counters } from "@/components/sections/counters"
import { Stations } from "@/components/sections/stations"
import { AboutPreview } from "@/components/sections/about-preview"
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
      <DemoRag />
      <Counters />
      <Stations />
      <DemoAgent />
      <DemoMina />
      <AboutPreview />
      <Skills />
      <Process />
      <CurrentlyLearning />
      <ContactCTA />
    </>
  )
}
