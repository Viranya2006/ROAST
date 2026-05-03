"use client"

import { motion } from "framer-motion"
import { Volume2, VolumeX } from "lucide-react"
import { useSound } from "@/lib/use-sound"

export function SoundToggle() {
  const { isMuted, isLoaded, toggleMute, playBeep } = useSound()

  if (!isLoaded) {
    return null
  }

  const handleClick = () => {
    toggleMute()
    // Play a beep when unmuting to confirm sound is working
    if (isMuted) {
      setTimeout(() => playBeep(), 50)
    }
  }

  return (
    <motion.button
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      onClick={handleClick}
      className="p-2 rounded-full border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all duration-200"
      title={isMuted ? "Unmute sounds" : "Mute sounds"}
    >
      {isMuted ? (
        <VolumeX className="w-4 h-4" />
      ) : (
        <Volume2 className="w-4 h-4" />
      )}
    </motion.button>
  )
}
