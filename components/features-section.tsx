"use client"

import { motion } from "framer-motion"
import { Grid3X3, GitBranch, PenTool } from "lucide-react"

const features = [
  {
    icon: Grid3X3,
    title: "UI Dissected",
    description: "Every pixel analyzed. Every alignment questioned. Your design choices, under the microscope."
  },
  {
    icon: GitBranch,
    title: "UX Exposed",
    description: "User flows mapped and scrutinized. Friction points identified. No dead end goes unnoticed."
  },
  {
    icon: PenTool,
    title: "Copy Shredded",
    description: "Headlines judged. CTAs evaluated. Every word measured against conversion best practices."
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15
    }
  }
}

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
}

export function FeaturesSection() {
  return (
    <section className="py-24 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className="group relative glass rounded-2xl p-8 overflow-hidden"
            >
              {/* Top border glow */}
              <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 group-hover:opacity-100 transition-opacity duration-300" />
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              
              <div className="relative z-10">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors duration-300">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 
                  className="text-xl font-bold mb-3 text-foreground"
                  style={{ fontFamily: 'var(--font-display)' }}
                >
                  {feature.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
