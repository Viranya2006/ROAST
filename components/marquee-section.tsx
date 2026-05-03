"use client"

import { motion } from "framer-motion"

const marqueeItems = [
  "UI", "UX", "COPY", "PERFORMANCE", "ACCESSIBILITY", 
  "BRANDING", "TYPOGRAPHY", "COLOR", "LAYOUT", "SPEED"
]

export function MarqueeSection() {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="py-6 md:py-8 border-y border-white/5 overflow-hidden bg-black/40"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Double the items for seamless loop */}
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={index}
            className="mx-4 md:mx-6 text-base md:text-lg font-medium text-muted-foreground/80 tracking-widest uppercase"
          >
            {item}
            <span className="ml-4 md:ml-6 text-primary/60">·</span>
          </span>
        ))}
      </div>
    </motion.section>
  )
}
