"use client";

import { motion } from "framer-motion";

interface CategoryCardProps {
  category: string;
  score: number;
  comment: string;
  delay?: number;
}

type Severity = "BRUTAL" | "PAINFUL" | "MEH" | "DECENT";

export function CategoryCard({ category, score, comment, delay = 0 }: CategoryCardProps) {
  const getSeverity = (s: number): { label: Severity; color: string; bgColor: string } => {
    if (s < 30) return { label: "BRUTAL", color: "#FF3333", bgColor: "rgba(255,51,51,0.15)" };
    if (s < 50) return { label: "PAINFUL", color: "#FF8800", bgColor: "rgba(255,136,0,0.15)" };
    if (s < 70) return { label: "MEH", color: "#FFCC00", bgColor: "rgba(255,204,0,0.15)" };
    return { label: "DECENT", color: "#00FF41", bgColor: "rgba(0,255,65,0.15)" };
  };

  const severity = getSeverity(score);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 1.5 + delay }}
      className="relative p-6 rounded-2xl border border-[#00FF41]/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden group"
    >
      {/* Top glow line */}
      <div 
        className="absolute top-0 left-0 right-0 h-[2px] opacity-60"
        style={{ 
          background: `linear-gradient(90deg, transparent, ${severity.color}, transparent)` 
        }}
      />
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm uppercase tracking-widest text-muted-foreground">
          {category}
        </span>
        <span
          className="px-3 py-1 rounded-full text-xs uppercase tracking-widest font-medium"
          style={{ 
            color: severity.color, 
            backgroundColor: severity.bgColor,
          }}
        >
          {severity.label}
        </span>
      </div>
      
      {/* Score */}
      <div className="mb-4">
        <span 
          className="text-5xl font-black"
          style={{ color: severity.color, fontFamily: "var(--font-display)" }}
        >
          {score}
        </span>
        <span className="text-muted-foreground text-lg ml-1">/100</span>
      </div>
      
      {/* Progress bar */}
      <div className="h-2 bg-white/5 rounded-full overflow-hidden mb-4">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${score}%` }}
          transition={{ duration: 1, delay: 1.8 + delay, ease: "easeOut" }}
          className="h-full rounded-full"
          style={{ 
            backgroundColor: severity.color,
            boxShadow: `0 0 20px ${severity.color}40`
          }}
        />
      </div>
      
      {/* Comment */}
      <p className="text-sm text-muted-foreground leading-relaxed">
        {comment}
      </p>
      
      {/* Hover glow */}
      <div 
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${severity.color}08 0%, transparent 70%)`
        }}
      />
    </motion.div>
  );
}
