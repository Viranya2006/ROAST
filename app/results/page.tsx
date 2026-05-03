"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ExternalLink, Loader2 } from "lucide-react";
import { BackgroundEffects } from "@/components/background-effects";
import { ScoreGauge } from "@/components/results/score-gauge";
import { CategoryCard } from "@/components/results/category-card";
import { TypewriterVerdict } from "@/components/results/typewriter-verdict";
import { FixesList } from "@/components/results/fixes-list";

interface RoastData {
  roastData: {
    overallScore: number;
    overallVerdict: string;
    fullRoast: string;
    categories: {
      ui: { score: number; comment: string };
      ux: { score: number; comment: string };
      copy: { score: number; comment: string };
      performance: { score: number; comment: string };
    };
    fixes: string[];
  };
  screenshot: string | null;
  url: string;
}

export default function ResultsPage() {
  const [data, setData] = useState<RoastData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem("roastData");
    if (stored) {
      setData(JSON.parse(stored));
    }
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10 flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Loading results...</p>
        </div>
      </main>
    );
  }

  if (!data) {
    return (
      <main className="relative min-h-screen bg-background text-foreground flex items-center justify-center">
        <BackgroundEffects />
        <div className="relative z-10 flex flex-col items-center gap-6 text-center px-4">
          <h1 className="text-2xl font-bold">No roast data found</h1>
          <p className="text-muted-foreground">Go back and roast a website first.</p>
          <Link
            href="/"
            className="px-6 py-3 rounded-full bg-primary text-primary-foreground font-semibold"
          >
            Roast a Website
          </Link>
        </div>
      </main>
    );
  }

  const { roastData, url } = data;
  const categories = [
    { category: "UI Design", score: roastData.categories.ui.score, comment: roastData.categories.ui.comment },
    { category: "UX Flow", score: roastData.categories.ux.score, comment: roastData.categories.ux.comment },
    { category: "Copy & Messaging", score: roastData.categories.copy.score, comment: roastData.categories.copy.comment },
    { category: "Performance", score: roastData.categories.performance.score, comment: roastData.categories.performance.comment },
  ];

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
              <span className="text-foreground text-sm md:text-base font-medium truncate">{url}</span>
              
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
            <ScoreGauge score={roastData.overallScore} verdict={roastData.overallVerdict} />
          </section>

          {/* Category Grid */}
          <section>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
              {categories.map((cat, index) => (
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
            <TypewriterVerdict text={roastData.fullRoast} />
          </section>

          {/* Fixes Section */}
          <section>
            <FixesList fixes={roastData.fixes} />
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
