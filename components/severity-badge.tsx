"use client"

import { motion } from "framer-motion"
import { getSeverity, SeverityTier } from "@/lib/severity"

interface SeverityBadgeProps {
  score: number
  size?: "sm" | "md" | "lg"
  showDescription?: boolean
  animate?: boolean
}

export function SeverityBadge({ 
  score, 
  size = "md", 
  showDescription = false,
  animate = true 
}: SeverityBadgeProps) {
  const severity = getSeverity(score)

  const sizeClasses = {
    sm: "px-2 py-0.5 text-[10px]",
    md: "px-3 py-1 text-xs",
    lg: "px-4 py-1.5 text-sm",
  }

  const Badge = animate ? motion.div : "div"
  const badgeProps = animate ? {
    initial: { opacity: 0, scale: 0.8 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.3, delay: 0.5 },
  } : {}

  return (
    <div className="flex flex-col items-center gap-2">
      <Badge
        {...badgeProps}
        className={`${sizeClasses[size]} rounded-full font-bold uppercase tracking-widest flex items-center gap-1.5`}
        style={{
          backgroundColor: severity.bgColor,
          color: severity.color,
          border: `1px solid ${severity.borderColor}`,
          boxShadow: `0 0 20px ${severity.glowColor}`,
        }}
      >
        <span
          className="w-1.5 h-1.5 rounded-full animate-pulse"
          style={{ backgroundColor: severity.color }}
        />
        {severity.label}
      </Badge>
      
      {showDescription && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground"
        >
          {severity.description}
        </motion.p>
      )}
    </div>
  )
}
