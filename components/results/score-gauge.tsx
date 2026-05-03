"use client";

import { motion, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

interface ScoreGaugeProps {
  score: number;
  verdict: string;
}

export function ScoreGauge({ score, verdict }: ScoreGaugeProps) {
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  const springScore = useSpring(0, { stiffness: 50, damping: 20 });
  const displayScore = useTransform(springScore, (val) => Math.round(val));
  
  useEffect(() => {
    if (isClient) {
      springScore.set(score);
    }
  }, [score, springScore, isClient]);

  const getScoreColor = (s: number) => {
    if (s < 50) return "#FF3333";
    if (s < 70) return "#FF8800";
    return "#00FF41";
  };

  const color = getScoreColor(score);
  const circumference = 2 * Math.PI * 120;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="flex flex-col items-center gap-8"
    >
      <div className="relative w-72 h-72">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 280 280">
          <circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="12"
          />
          {/* Animated progress ring */}
          <motion.circle
            cx="140"
            cy="140"
            r="120"
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 }}
            style={{
              filter: `drop-shadow(0 0 20px ${color}40)`,
            }}
          />
        </svg>
        
        {/* Score display */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <motion.span
            className="text-7xl font-black tracking-tight"
            style={{ color, fontFamily: "var(--font-display)" }}
          >
            {isClient ? <motion.span>{displayScore}</motion.span> : "0"}
          </motion.span>
          <span className="text-muted-foreground text-lg tracking-widest uppercase">
            / 100
          </span>
        </div>
        
        {/* Glow effect */}
        <div
          className="absolute inset-0 rounded-full opacity-20 blur-3xl"
          style={{ backgroundColor: color }}
        />
      </div>
      
      {/* Verdict */}
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 1.2 }}
        className="text-xl md:text-2xl italic text-center max-w-2xl text-muted-foreground"
        style={{ fontFamily: "var(--font-display)" }}
      >
        &ldquo;{verdict}&rdquo;
      </motion.p>
    </motion.div>
  );
}
