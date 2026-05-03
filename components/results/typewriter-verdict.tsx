"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

interface TypewriterVerdictProps {
  text: string;
}

export function TypewriterVerdict({ text }: TypewriterVerdictProps) {
  const [displayText, setDisplayText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const [startTyping, setStartTyping] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStartTyping(true), 2500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!startTyping) return;
    
    let i = 0;
    const interval = setInterval(() => {
      if (i < text.length) {
        setDisplayText(text.slice(0, i + 1));
        i++;
      } else {
        setIsTyping(false);
        clearInterval(interval);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [text, startTyping]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 2.3 }}
      className="w-full"
    >
      <h3 className="text-sm uppercase tracking-widest text-[#00FF41] mb-4 font-mono">
        {"// THE VERDICT"}
      </h3>
      
      <div className="relative p-6 md:p-8 rounded-2xl bg-black border border-[#00FF41]/20 overflow-hidden">
        {/* Scanline effect */}
        <div 
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,65,0.1) 2px, rgba(0,255,65,0.1) 4px)"
          }}
        />
        
        {/* Terminal glow */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#00FF41]/30 to-transparent" />
        
        <p className="font-mono text-base md:text-lg leading-relaxed text-[#00FF41]/90">
          <span className="text-[#00FF41]/50 mr-2">$</span>
          {displayText}
          {isTyping && (
            <motion.span
              animate={{ opacity: [1, 0] }}
              transition={{ duration: 0.5, repeat: Infinity, repeatType: "reverse" }}
              className="inline-block w-3 h-5 ml-1 bg-[#00FF41] align-middle"
            />
          )}
        </p>
      </div>
    </motion.div>
  );
}
