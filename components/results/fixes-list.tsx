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
        className="text-2xl font-black tracking-tight mb-6"
        style={{ fontFamily: "var(--font-display)" }}
      >
        What needs surgery
      </h3>
      
      <div className="space-y-4">
        {fixes.map((fix, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 3.2 + index * 0.1 }}
            className="flex items-start gap-4 p-4 rounded-xl border-l-2 border-[#00FF41]/40 bg-white/[0.02]"
          >
            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#00FF41]/10 flex items-center justify-center mt-0.5">
              <Check className="w-4 h-4 text-[#00FF41]" />
            </div>
            <p className="text-base text-foreground/90 leading-relaxed">
              {fix}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
