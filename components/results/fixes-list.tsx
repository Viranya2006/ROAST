"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface FixesListProps {
  fixes: string[];
}

export function FixesList({ fixes }: FixesListProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 3 }}
      className="w-full"
    >
      <h3 
        className="text-xl md:text-2xl font-black tracking-tight mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        What needs surgery
      </h3>
      
      <div className="space-y-3 md:space-y-4">
        {fixes.map((fix, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 3.2 + index * 0.1 }}
            whileHover={{ x: 4, transition: { duration: 0.2 } }}
            className="flex items-start gap-3 md:gap-4 p-3 md:p-4 rounded-xl border-l-2 border-[#00FF41]/40 bg-white/[0.02] hover:bg-white/[0.04] transition-colors duration-300 cursor-default"
          >
            <div className="flex-shrink-0 w-5 h-5 md:w-6 md:h-6 rounded-full bg-[#00FF41]/10 flex items-center justify-center mt-0.5">
              <Check className="w-3 h-3 md:w-4 md:h-4 text-[#00FF41]" />
            </div>
            <p className="text-sm md:text-base text-foreground/90 leading-relaxed">
              {fix}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
