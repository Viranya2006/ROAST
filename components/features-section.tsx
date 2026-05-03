"use client"

import { useState } from "react"
import { motion } from "framer-motion"

const features = [
  {
    id: "ui",
    title: "UI Dissected",
    subtitle: "VISUAL_ANALYSIS.exe",
    description: "Every pixel analyzed. Every alignment questioned. Your design choices, under the microscope.",
    stats: ["Color contrast", "Typography scale", "Visual hierarchy", "Component spacing"],
    color: "#00FF41",
  },
  {
    id: "ux",
    title: "UX Exposed",
    subtitle: "FLOW_SCANNER.exe",
    description: "User flows mapped and scrutinized. Friction points identified. No dead end goes unnoticed.",
    stats: ["Navigation depth", "Click paths", "Dead ends", "Conversion blockers"],
    color: "#00FF41",
  },
  {
    id: "copy",
    title: "Copy Shredded",
    subtitle: "TEXT_ANALYZER.exe",
    description: "Headlines judged. CTAs evaluated. Every word measured against conversion best practices.",
    stats: ["Headline impact", "CTA strength", "Value clarity", "Trust signals"],
    color: "#00FF41",
  }
]

// Animated icon components
function UIIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* Grid lines */}
      {[0, 1, 2].map((row) =>
        [0, 1, 2].map((col) => (
          <motion.rect
            key={`${row}-${col}`}
            x={6 + col * 14}
            y={6 + row * 14}
            width="10"
            height="10"
            rx="2"
            fill="none"
            stroke="#00FF41"
            strokeWidth="1.5"
            initial={{ opacity: 0.3, scale: 0.8 }}
            animate={{
              opacity: isHovered ? [0.3, 1, 0.3] : 0.5,
              scale: isHovered ? [0.8, 1, 0.8] : 0.9,
            }}
            transition={{
              duration: 1.5,
              delay: (row * 3 + col) * 0.1,
              repeat: isHovered ? Infinity : 0,
            }}
          />
        ))
      )}
      {/* Scanning line */}
      <motion.line
        x1="4"
        y1="24"
        x2="44"
        y2="24"
        stroke="#00FF41"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isHovered ? [0, 1, 0] : 0,
          y1: isHovered ? [4, 44] : 24,
          y2: isHovered ? [4, 44] : 24,
        }}
        transition={{
          duration: 2,
          repeat: isHovered ? Infinity : 0,
          ease: "linear",
        }}
      />
    </svg>
  )
}

function UXIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* Flow path */}
      <motion.path
        d="M8 24 L16 24 L20 12 L28 36 L32 24 L40 24"
        fill="none"
        stroke="#00FF41"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0, opacity: 0.5 }}
        animate={{
          pathLength: isHovered ? 1 : 0.6,
          opacity: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
      {/* Pulse dots */}
      {[8, 24, 40].map((x, i) => (
        <motion.circle
          key={i}
          cx={x}
          cy="24"
          r="3"
          fill="#00FF41"
          initial={{ scale: 0.5, opacity: 0.3 }}
          animate={{
            scale: isHovered ? [0.5, 1.2, 0.5] : 0.7,
            opacity: isHovered ? [0.3, 1, 0.3] : 0.5,
          }}
          transition={{
            duration: 1.2,
            delay: i * 0.2,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      ))}
    </svg>
  )
}

function CopyIcon({ isHovered }: { isHovered: boolean }) {
  return (
    <svg viewBox="0 0 48 48" className="w-full h-full">
      {/* Text lines being "shredded" */}
      {[0, 1, 2, 3].map((i) => (
        <motion.rect
          key={i}
          x="8"
          y={10 + i * 9}
          width={32 - i * 4}
          height="4"
          rx="2"
          fill="#00FF41"
          initial={{ opacity: 0.3, x: 8 }}
          animate={{
            opacity: isHovered ? [0.3, 1, 0.3] : 0.5,
            x: isHovered ? [8, 12, 8] : 8,
            scaleX: isHovered ? [1, 0.9, 1] : 1,
          }}
          transition={{
            duration: 0.8,
            delay: i * 0.15,
            repeat: isHovered ? Infinity : 0,
          }}
        />
      ))}
      {/* Strike-through effect */}
      <motion.line
        x1="4"
        y1="24"
        x2="44"
        y2="24"
        stroke="#FF3333"
        strokeWidth="2"
        strokeLinecap="round"
        initial={{ scaleX: 0, opacity: 0 }}
        animate={{
          scaleX: isHovered ? 1 : 0,
          opacity: isHovered ? 0.8 : 0,
        }}
        transition={{ duration: 0.3, delay: 0.5 }}
        style={{ transformOrigin: "left" }}
      />
    </svg>
  )
}

const iconComponents = {
  ui: UIIcon,
  ux: UXIcon,
  copy: CopyIcon,
}

function FeatureCard({ feature, index }: { feature: typeof features[0]; index: number }) {
  const [isHovered, setIsHovered] = useState(false)
  const IconComponent = iconComponents[feature.id as keyof typeof iconComponents]

  return (
    <motion.div
      initial={{ opacity: 0, y: 60 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.6, delay: index * 0.15, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative"
    >
      {/* Card */}
      <div className="relative h-full rounded-2xl overflow-hidden">
        {/* Animated border */}
        <motion.div
          className="absolute inset-0 rounded-2xl"
          style={{
            background: `linear-gradient(135deg, ${feature.color}20, transparent, ${feature.color}10)`,
            padding: "1px",
          }}
          animate={{
            opacity: isHovered ? 1 : 0.3,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-[1px] rounded-2xl bg-[#0a0a0a]" />
        </motion.div>

        {/* Glowing border on hover */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: `0 0 30px ${feature.color}20, inset 0 0 30px ${feature.color}05`,
          }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Content */}
        <div className="relative z-10 p-8 h-full flex flex-col">
          {/* Header row */}
          <div className="flex items-start justify-between mb-6">
            {/* Icon container */}
            <div className="relative w-16 h-16">
              <motion.div
                className="absolute inset-0 rounded-xl"
                style={{ backgroundColor: `${feature.color}10` }}
                animate={{
                  backgroundColor: isHovered ? `${feature.color}20` : `${feature.color}10`,
                  boxShadow: isHovered ? `0 0 30px ${feature.color}30` : "none",
                }}
                transition={{ duration: 0.3 }}
              />
              <div className="relative z-10 w-full h-full p-3">
                <IconComponent isHovered={isHovered} />
              </div>
            </div>

            {/* Status indicator */}
            <motion.div
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border"
              style={{ borderColor: `${feature.color}30` }}
              initial={{ backgroundColor: "rgba(0, 255, 65, 0)" }}
              animate={{
                borderColor: isHovered ? feature.color : `${feature.color}30`,
                backgroundColor: isHovered ? "rgba(0, 255, 65, 0.06)" : "rgba(0, 255, 65, 0)",
              }}
              transition={{ duration: 0.3 }}
            >
              <motion.div
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: feature.color }}
                animate={{
                  scale: isHovered ? [1, 1.3, 1] : 1,
                  opacity: isHovered ? [0.5, 1, 0.5] : 0.5,
                }}
                transition={{
                  duration: 1,
                  repeat: isHovered ? Infinity : 0,
                }}
              />
              <span className="text-xs font-mono text-muted-foreground uppercase tracking-wider">
                Active
              </span>
            </motion.div>
          </div>

          {/* Subtitle terminal style */}
          <motion.div
            className="font-mono text-xs mb-3 flex items-center gap-2"
            style={{ color: feature.color }}
            animate={{ opacity: isHovered ? 1 : 0.6 }}
            transition={{ duration: 0.3 }}
          >
            <span className="opacity-50">{">>"}</span>
            <span>{feature.subtitle}</span>
            <motion.span
              animate={{ opacity: isHovered ? [1, 0] : 0 }}
              transition={{ duration: 0.5, repeat: isHovered ? Infinity : 0 }}
            >
              _
            </motion.span>
          </motion.div>

          {/* Title */}
          <h3
            className="text-2xl font-bold mb-4 text-foreground"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {feature.title}
          </h3>

          {/* Description */}
          <p className="text-muted-foreground leading-relaxed mb-6 flex-grow">
            {feature.description}
          </p>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-2">
            {feature.stats.map((stat, i) => (
              <motion.div
                key={stat}
                className="flex items-center gap-2 text-xs"
                initial={{ opacity: 0, x: -10 }}
                animate={{
                  opacity: isHovered ? 1 : 0.5,
                  x: 0,
                }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
              >
                <motion.div
                  className="w-1 h-1 rounded-full"
                  style={{ backgroundColor: feature.color }}
                  animate={{
                    scale: isHovered ? [1, 1.5, 1] : 1,
                  }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.1,
                    repeat: isHovered ? Infinity : 0,
                  }}
                />
                <span className="text-muted-foreground">{stat}</span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Scan line effect */}
        <motion.div
          className="absolute inset-x-0 h-px pointer-events-none"
          style={{
            background: `linear-gradient(90deg, transparent, ${feature.color}60, transparent)`,
          }}
          initial={{ top: "0%", opacity: 0 }}
          animate={{
            top: isHovered ? ["0%", "100%"] : "0%",
            opacity: isHovered ? [0, 1, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: isHovered ? Infinity : 0,
            ease: "linear",
          }}
        />
      </div>
    </motion.div>
  )
}

export function FeaturesSection() {
  return (
    <section className="py-24 md:py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <motion.div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#00FF41]/20 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <span className="w-2 h-2 rounded-full bg-[#00FF41] animate-pulse" />
            <span className="text-xs font-mono uppercase tracking-widest text-[#00FF41]">
              Analysis Modules
            </span>
          </motion.div>
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-black text-foreground mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Three Ways to <span className="text-[#00FF41]">Destroy</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Our AI runs your site through three brutal analysis engines. Nothing escapes.
          </p>
        </motion.div>

        {/* Cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
          {features.map((feature, index) => (
            <FeatureCard key={feature.id} feature={feature} index={index} />
          ))}
        </div>
      </div>
    </section>
  )
}
