"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const scanLines = [
  "› Initializing roast protocol...",
  "› Fetching site architecture...",
  "› Judging your font choices...",
  "› Consulting the council of good taste...",
  "› Analyzing UX decisions...",
  "› Calculating damage...",
  "› Preparing brutal honesty...",
  "› Almost ready to destroy...",
];

function TypewriterLine({
  text,
  delay,
  onComplete,
}: {
  text: string;
  delay: number;
  onComplete?: () => void;
}) {
  const [displayedText, setDisplayedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => {
      let currentIndex = 0;
      const interval = setInterval(() => {
        if (currentIndex <= text.length) {
          setDisplayedText(text.slice(0, currentIndex));
          currentIndex++;
        } else {
          clearInterval(interval);
          setIsComplete(true);
          onComplete?.();
        }
      }, 30);

      return () => clearInterval(interval);
    }, delay);

    return () => clearTimeout(timeout);
  }, [text, delay, onComplete]);

  return (
    <div className="flex items-start gap-2 font-mono text-sm sm:text-base">
      <span className="text-[#00FF41]">{displayedText.slice(0, 1)}</span>
      <span className="text-white/80">{displayedText.slice(2)}</span>
      {!isComplete && (
        <motion.span
          className="inline-block w-2 h-4 bg-[#00FF41] ml-0.5"
          animate={{ opacity: [1, 0] }}
          transition={{ duration: 0.5, repeat: Infinity }}
        />
      )}
    </div>
  );
}

function FloatingParticles() {
  const particles = Array.from({ length: 30 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    duration: Math.random() * 10 + 10,
    delay: Math.random() * 5,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute rounded-full bg-[#00FF41]/20"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: particle.size,
            height: particle.size,
          }}
          animate={{
            y: [0, -30, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

export function LoadingScreen({ onComplete }: { onComplete?: () => void }) {
  const [visibleLines, setVisibleLines] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 100 / 80;
      });
    }, 100);

    return () => clearInterval(progressInterval);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const timeout = setTimeout(() => {
        onComplete?.();
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [progress, onComplete]);

  const handleLineComplete = (index: number) => {
    if (index === visibleLines) {
      setVisibleLines((prev) => prev + 1);
    }
  };

  return (
    <div className="fixed inset-0 bg-black z-50 flex flex-col items-center justify-center overflow-hidden">
      {/* Scanline overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.03]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.1) 2px, rgba(0, 255, 65, 0.1) 4px)",
        }}
      />

      {/* Floating particles */}
      <FloatingParticles />

      {/* Glitching ROAST text */}
      <motion.div
        className="relative mb-8 sm:mb-12"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1
          className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white"
          style={{ fontFamily: "var(--font-display), Space Grotesk, sans-serif" }}
        >
          ROAST
        </h1>
        {/* Glitch layers */}
        <motion.h1
          className="absolute inset-0 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-[#00FF41]/70"
          style={{ fontFamily: "var(--font-display), Space Grotesk, sans-serif" }}
          animate={{
            x: [0, -2, 2, 0],
            opacity: [0, 0.7, 0, 0.7, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 3,
          }}
        >
          ROAST
        </motion.h1>
        <motion.h1
          className="absolute inset-0 text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-red-500/50"
          style={{ fontFamily: "var(--font-display), Space Grotesk, sans-serif" }}
          animate={{
            x: [0, 2, -2, 0],
            opacity: [0, 0.5, 0, 0.5, 0],
          }}
          transition={{
            duration: 0.2,
            repeat: Infinity,
            repeatDelay: 3,
            delay: 0.05,
          }}
        >
          ROAST
        </motion.h1>
      </motion.div>

      {/* Terminal window */}
      <motion.div
        className="w-full max-w-2xl mx-4 sm:mx-8"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div
          className="rounded-2xl overflow-hidden"
          style={{
            background: "rgba(10, 10, 10, 0.8)",
            border: "1px solid rgba(0, 255, 65, 0.2)",
            boxShadow: "0 0 60px rgba(0, 255, 65, 0.1)",
          }}
        >
          {/* Terminal header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
              <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
              <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
            </div>
            <span className="text-white/50 text-xs sm:text-sm font-mono">
              roast.exe — analyzing
            </span>
            <div className="w-16" />
          </div>

          {/* Terminal content */}
          <div className="p-4 sm:p-6 min-h-[280px] sm:min-h-[320px]">
            <div className="space-y-3">
              {scanLines.map((line, index) => (
                <AnimatePresence key={index}>
                  {index <= visibleLines && (
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <TypewriterLine
                        text={line}
                        delay={index === 0 ? 500 : 0}
                        onComplete={() => handleLineComplete(index)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Subtitle text */}
      <motion.p
        className="mt-6 sm:mt-8 text-white/40 text-xs sm:text-sm text-center px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        this may take a moment. your site is being thoroughly judged.
      </motion.p>

      {/* Progress bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/5">
        <motion.div
          className="h-full bg-[#00FF41]"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.1, ease: "linear" }}
          style={{
            boxShadow: "0 0 20px rgba(0, 255, 65, 0.5)",
          }}
        />
      </div>

      {/* Progress percentage */}
      <motion.div
        className="absolute bottom-4 right-4 font-mono text-[#00FF41]/60 text-xs"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {Math.round(progress)}%
      </motion.div>
    </div>
  );
}
