import { HeroSection } from "@/components/hero-section"
import { MarqueeSection } from "@/components/marquee-section"
import { FeaturesSection } from "@/components/features-section"
import { StatsSection } from "@/components/stats-section"
import { FooterSection } from "@/components/footer-section"
import { BackgroundEffects } from "@/components/background-effects"

export default function Home() {
  return (
    <main className="relative min-h-screen bg-background overflow-hidden">
      <BackgroundEffects />
      
      <div className="relative z-10">
        <HeroSection />
        <MarqueeSection />
        <FeaturesSection />
        <StatsSection />
        <FooterSection />
      </div>
    </main>
  )
}
