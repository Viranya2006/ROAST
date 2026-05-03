"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { BackgroundEffects } from "@/components/background-effects";
import { ScoreGauge } from "@/components/results/score-gauge";
import { CategoryCard } from "@/components/results/category-card";
import { TypewriterVerdict } from "@/components/results/typewriter-verdict";
import { FixesList } from "@/components/results/fixes-list";

// Mock data - in a real app this would come from the analysis
const mockData = {
  url: "acme-startup.com",
  overallScore: 34,
  verdict: "This site needs a therapist, not a designer.",
  categories: [
    {
      category: "UI Design",
      score: 28,
      comment: "Your color palette looks like a fever dream from 2003.",
    },
    {
      category: "UX Flow",
      score: 45,
      comment: "Users need a map, compass, and therapy to navigate this.",
    },
    {
      category: "Copy & Messaging",
      score: 31,
      comment: "Your value prop is about as clear as mud in a thunderstorm.",
    },
    {
      category: "Performance",
      score: 52,
      comment: "Loads slower than a sloth on sedatives. Fix your images.",
    },
  ],
  fullVerdict:
    "Where do I even begin? Your hero section screams 'we couldn't decide on a direction so we picked all of them.' The typography is fighting itself like siblings in a car ride. Your CTA buttons blend into the background like a chameleon having an identity crisis. The navigation requires a PhD to understand, and don't even get me started on that footer — it looks like where design elements go to die. Your users aren't bouncing, they're sprinting away. This site needs immediate intervention.",
  fixes: [
    "Establish a clear visual hierarchy — your H1 shouldn't be fighting your nav for attention",
    "Pick ONE primary CTA color and make it actually visible against your background",
    "Compress those hero images — 4MB per image is not a flex, it's a crime",
    "Rewrite your value prop in 10 words or less that a 5-year-old could understand",
    "Add actual whitespace — your elements are packed tighter than a rush hour subway",
  ],
};

export default function ResultsPage() {
  return (
    <main className="relative min-h-screen bg-background text-foreground overflow-hidden">
      <BackgroundEffects />

      <div className="relative z-10">
        {/* Top Bar */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="sticky top-0 z-50 border-b border-white/5 bg-black/80 backdrop-blur-xl"
        >
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 md:gap-3 min-w-0">
              {/* Favicon placeholder */}
              <div className="w-7 h-7 md:w-8 md:h-8 rounded-lg bg-white/10 flex items-center justify-center flex-shrink-0">
                <ExternalLink className="w-3.5 h-3.5 md:w-4 md:h-4 text-muted-foreground" />
              </div>
              <span className="text-foreground text-sm md:text-base font-medium truncate">{mockData.url}</span>
              
              {/* Analyzed badge */}
              <motion.span
                animate={{ 
                  boxShadow: [
                    "0 0 0 0 rgba(0,255,65,0.4)",
                    "0 0 0 6px rgba(0,255,65,0)",
                  ]
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="hidden sm:inline-flex px-2.5 md:px-3 py-1 rounded-full text-[10px] md:text-xs uppercase tracking-widest font-medium bg-[#00FF41]/10 text-[#00FF41] border border-[#00FF41]/20 flex-shrink-0"
              >
                Analyzed
              </motion.span>
            </div>

            <Link
              href="/"
              className="px-3 md:px-4 py-2 rounded-full text-xs md:text-sm font-medium border border-white/10 text-foreground hover:border-[#00FF41]/40 hover:text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 whitespace-nowrap flex-shrink-0"
            >
              Roast Another
            </Link>
          </div>
        </motion.header>

        {/* Content */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 lg:py-24 space-y-16 md:space-y-24">
          {/* Hero Score Section */}
          <section className="flex flex-col items-center">
            <ScoreGauge score={mockData.overallScore} verdict={mockData.verdict} />
          </section>

          {/* Category Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {mockData.categories.map((cat, index) => (
                <CategoryCard
                  key={cat.category}
                  category={cat.category}
                  score={cat.score}
                  comment={cat.comment}
                  delay={index * 0.1}
                />
              ))}
            </div>
          </section>

          {/* The Verdict */}
          <section>
            <TypewriterVerdict text={mockData.fullVerdict} />
          </section>

          {/* Fixes Section */}
          <section>
            <FixesList fixes={mockData.fixes} />
          </section>

          {/* Share Section */}
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 3.8 }}
            className="flex flex-col items-center gap-6 pb-8"
          >
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto">
              <button className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#00FF41] text-black font-bold text-sm md:text-base uppercase tracking-wider premium-button">
                Share Your Shame
              </button>
              <Link
                href="/"
                className="w-full sm:w-auto px-8 py-4 rounded-full border border-white/20 text-foreground font-bold text-sm md:text-base uppercase tracking-wider hover:border-[#00FF41]/40 hover:text-[#00FF41] hover:shadow-[0_0_20px_rgba(0,255,65,0.15)] transition-all duration-300 text-center"
              >
                Roast Another Site
              </Link>
            </div>
            <p className="text-xs md:text-sm text-muted-foreground">
              warn your developer before sharing
            </p>
          </motion.section>
        </div>
      </div>
    </main>
  );
}
