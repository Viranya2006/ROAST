"use client"

import { motion } from "framer-motion"

export function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="py-16 md:py-24 border-t border-white/5"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-muted-foreground text-sm tracking-wide">
          <span className="text-primary font-semibold">ROAST</span>
          <span className="mx-3 text-white/20">·</span>
          Built at Zero to Agent 2026
          <span className="mx-3 text-white/20">·</span>
          Powered by{" "}
          <a 
            href="https://vercel.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors duration-300 underline underline-offset-4 decoration-white/20 hover:decoration-primary/50"
          >
            Vercel
          </a>
        </p>
      </div>
    </motion.footer>
  )
}
