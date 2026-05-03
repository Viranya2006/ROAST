"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { ArrowRight, Loader2 } from "lucide-react"

function SoundWave() {
  return (
    <div className="flex items-center gap-1 h-6">
      {[0, 1, 2, 3, 4].map((i) => (
        <motion.div
          key={i}
          className="w-1 bg-primary/60 rounded-full"
          animate={{
            height: ["8px", "24px", "8px"],
          }}
          transition={{
            duration: 0.8,
            repeat: Infinity,
            delay: i * 0.1,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  )
}

export function HeroSection() {
  const [isGlitching, setIsGlitching] = useState(false)
  const [isFocused, setIsFocused] = useState(false)
  const [url, setUrl] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleRoast = async () => {
    if (!url.trim() || isLoading) return

    console.log("[v0] Starting roast for URL:", url.trim())
    setError(null)
    setIsLoading(true)

    try {
      const response = await fetch("/api/roast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      })

      console.log("[v0] Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("[v0] API Error response:", errorData)
        throw new Error(errorData.details || errorData.error || "Failed to roast")
      }

      const data = await response.json()
      console.log("[v0] Roast data received, score:", data?.roastData?.overallScore)
      sessionStorage.setItem("roastData", JSON.stringify(data))
      router.push("/results")
    } catch (err) {
      console.error("[v0] Roast failed:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error"
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setIsGlitching(true)
      setTimeout(() => setIsGlitching(false), 300)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-24 md:py-32 overflow-hidden">
      {/* Hero gradient glow */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] rounded-full pointer-events-none"
        style={{
          background: "radial-gradient(circle, rgba(0, 255, 65, 0.08) 0%, rgba(0, 255, 65, 0.02) 40%, transparent 70%)",
        }}
        aria-hidden="true"
      />

      {/* Tagline */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="text-muted-foreground text-sm md:text-base tracking-widest uppercase mb-8"
      >
        Your website has problems. We&apos;ll find them all.
      </motion.p>

      {/* Giant ROAST Typography */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="relative mb-12 md:mb-16"
      >
        {/* Glow behind text */}
        <div 
          className="absolute inset-0 blur-3xl opacity-30"
          style={{
            background: "linear-gradient(180deg, transparent 0%, rgba(0, 255, 65, 0.3) 50%, transparent 100%)",
          }}
          aria-hidden="true"
        />
        
        <h1 
          className="relative text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] font-black tracking-tighter leading-none text-foreground select-none"
          style={{ fontFamily: 'var(--font-display)' }}
        >
          ROAST
        </h1>
        
        {/* Glitch layers */}
        {isGlitching && (
          <>
            <span 
              className="absolute inset-0 text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] font-black tracking-tighter leading-none text-primary animate-glitch"
              style={{ fontFamily: 'var(--font-display)' }}
              aria-hidden="true"
            >
              ROAST
            </span>
            <span 
              className="absolute inset-0 text-[18vw] sm:text-[16vw] md:text-[14vw] lg:text-[12vw] font-black tracking-tighter leading-none text-[#ff0040] animate-glitch2"
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
        transition={{ duration: 0.5, delay: 0.5 }}
        className="relative w-full max-w-xl"
      >
        {/* Pulse ring around input */}
        <motion.div
          className="absolute -inset-1 rounded-2xl opacity-0"
          animate={isFocused ? {
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.01, 1],
          } : {
            opacity: [0.1, 0.2, 0.1],
            scale: [1, 1.005, 1],
          }}
          transition={{ duration: 2, repeat: Infinity }}
          style={{
            background: "linear-gradient(90deg, transparent, rgba(0, 255, 65, 0.3), transparent)",
          }}
        />
        
        <div className="relative glass rounded-2xl p-2">
          <div className="flex flex-col sm:flex-row gap-2 items-stretch">
            <div className="flex-1 flex items-center gap-3">
              {/* Sound wave indicator */}
              <div className="hidden sm:flex pl-4">
                <SoundWave />
              </div>
              <input
                type="url"
                placeholder="drop your URL here. we won't be gentle."
                className="flex-1 bg-transparent px-4 sm:px-2 py-4 text-foreground placeholder:text-muted-foreground focus:outline-none text-sm md:text-base"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                onKeyDown={(e) => e.key === "Enter" && handleRoast()}
                disabled={isLoading}
              />
            </div>
            <button
              onClick={handleRoast}
              disabled={isLoading || !url.trim()}
              className="premium-button px-6 py-4 bg-primary text-primary-foreground font-semibold rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Roasting...
                  </>
                ) : (
                  <>
                    Roast It
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </>
                )}
              </span>
            </button>
          </div>
        </div>

        {/* Helper / error text */}
        {error ? (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-sm text-[#ff4444] text-center"
          >
            {error}
          </motion.p>
        ) : isLoading ? (
          <p className="mt-4 text-sm text-muted-foreground text-center">
            analyzing your site... this may take a moment.
          </p>
        ) : (
          <p className="mt-4 text-xs text-muted-foreground text-center">
            try anything: vercel.com, your-portfolio.com, that-startup-you-hate.io
          </p>
        )}
      </motion.div>
    </section>
  )
}
