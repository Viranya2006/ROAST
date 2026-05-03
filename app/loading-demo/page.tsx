"use client";

import { useState } from "react";
import { LoadingScreen } from "@/components/loading-screen";
import { motion } from "framer-motion";

export default function LoadingDemoPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [showRestart, setShowRestart] = useState(false);

  const handleComplete = () => {
    setIsLoading(false);
    setShowRestart(true);
  };

  const handleRestart = () => {
    setShowRestart(false);
    setIsLoading(true);
  };

  return (
    <>
      {isLoading && <LoadingScreen onComplete={handleComplete} />}
      
      {showRestart && (
        <div className="min-h-screen bg-black flex flex-col items-center justify-center gap-8 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <h1
              className="text-4xl sm:text-6xl font-black text-white mb-4"
              style={{ fontFamily: "var(--font-display), Space Grotesk, sans-serif" }}
            >
              Analysis Complete
            </h1>
            <p className="text-white/50 mb-8">
              The roasting process has finished.
            </p>
            <button
              onClick={handleRestart}
              className="px-8 py-4 bg-[#00FF41] text-black font-bold rounded-full hover:shadow-[0_0_30px_rgba(0,255,65,0.5)] transition-all duration-200"
            >
              Watch Again
            </button>
          </motion.div>
        </div>
      )}
    </>
  );
}
