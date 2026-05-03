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
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-8 border-y border-border overflow-hidden"
    >
      <div className="flex animate-marquee whitespace-nowrap">
        {/* Double the items for seamless loop */}
        {[...marqueeItems, ...marqueeItems].map((item, index) => (
          <span
            key={index}
            className="mx-6 text-lg md:text-xl font-medium text-muted-foreground tracking-widest"
          >
            {item}
            <span className="ml-6 text-primary">·</span>
          </span>
        ))}
      </div>
    </motion.section>
  )
}
