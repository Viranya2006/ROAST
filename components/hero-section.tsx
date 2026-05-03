"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"

export function HeroSection() {
  const [isGlitching, setIsGlitching] = useState(false)

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 py-20 overflow-hidden">
      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="text-muted-foreground text-sm md:text-base tracking-widest uppercase mb-8"
      >
        Your website has problems. We&apos;ll find them all.
      </motion.p>

      {/* Giant ROAST Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="relative mb-12 md:mb-16"
      >
        <h1 
          className="text-[20vw] md:text-[18vw] lg:text-[15vw] font-bold tracking-tighter leading-none text-foreground select-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ROAST
        </h1>
        
        {/* Glitch layers */}
        {isGlitching && (
          <>
            <span 
              className="absolute inset-0 text-[20vw] md:text-[18vw] lg:text-[15vw] font-bold tracking-tighter leading-none text-primary animate-glitch"
              style={{ fontFamily: 'var(--font-display)' }}
              aria-hidden="true"
            >
              ROAST
            </span>
            <span 
              className="absolute inset-0 text-[20vw] md:text-[18vw] lg:text-[15vw] font-bold tracking-tighter leading-none text-[#ff0040] animate-glitch2"
              style={{ fontFamily: 'var(--font-display)' }}
              aria-hidden="true"
            >
              ROAST
            </span>
          </>
        )}
      </motion.div>

      {/* URL Input Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.6 }}
        className="glass rounded-2xl p-2 w-full max-w-xl"
      >
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="url"
            placeholder="drop your URL here. we won't be gentle."
            className="flex-1 bg-transparent px-5 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm md:text-base"
          />
          <button className="group relative px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-2 overflow-hidden">
            {/* Glow effect */}
            <span className="absolute inset-0 bg-primary opacity-0 group-hover:opacity-50 blur-xl transition-opacity duration-300" />
            <span className="relative flex items-center gap-2">
              Roast It
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </span>
          </button>
        </div>
      </motion.div>
    </section>
  )
}
