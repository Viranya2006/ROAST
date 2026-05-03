"use client"

import { motion } from "framer-motion"

export function FooterSection() {
  return (
    <motion.footer
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      viewport={{ once: true }}
      className="py-12 border-t border-border"
    >
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-muted-foreground text-sm tracking-wide">
          <span className="text-primary font-semibold">ROAST</span>
          <span className="mx-2">·</span>
          Built at Zero to Agent 2026
          <span className="mx-2">·</span>
          Powered by{" "}
          <a 
            href="https://vercel.com" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors duration-200 underline underline-offset-2"
          >
            Vercel
          </a>
        </p>
      </div>
    </motion.footer>
  )
}
