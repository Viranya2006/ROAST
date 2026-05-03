"use client"

import { useState, useEffect, useCallback, useRef } from "react"

const STORAGE_KEY = "roast-sound-enabled"

// Pre-generated base64 audio data for tiny sound effects
// These are minimal beeps/tones that work without external files

export function useSound() {
  const [isMuted, setIsMuted] = useState(true) // Default muted
  const [isLoaded, setIsLoaded] = useState(false)
  const audioContextRef = useRef<AudioContext | null>(null)

  // Load mute preference from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored !== null) {
        // stored === "false" means sound is enabled (not muted)
        setIsMuted(stored !== "false")
      }
    } catch {
      // Ignore errors
    }
    setIsLoaded(true)
  }, [])

  // Initialize AudioContext lazily and resume if suspended
  const getAudioContext = useCallback(async () => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    }
    
    // Resume if suspended (browsers require user interaction)
    if (audioContextRef.current.state === "suspended") {
      await audioContextRef.current.resume()
    }
    
    return audioContextRef.current
  }, [])

  // Toggle mute and resume AudioContext on unmute
  const toggleMute = useCallback(async () => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    
    try {
      localStorage.setItem(STORAGE_KEY, newMuted ? "true" : "false")
      
      // If unmuting, try to resume AudioContext immediately
      if (!newMuted && audioContextRef.current?.state === "suspended") {
        await audioContextRef.current.resume()
      }
    } catch {
      // Ignore errors
    }
  }, [isMuted])

  // Play a beep sound (terminal style)
  const playBeep = useCallback(async () => {
    if (isMuted) return
    
    try {
      const ctx = await getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = "square"
      oscillator.frequency.setValueAtTime(800, ctx.currentTime)
      
      gainNode.gain.setValueAtTime(0.1, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.05)
    } catch {
      // Audio not supported, fail silently
    }
  }, [isMuted, getAudioContext])

  // Play a "thunk" sound (score reveal)
  const playThunk = useCallback(async () => {
    if (isMuted) return
    
    try {
      const ctx = await getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = "sine"
      oscillator.frequency.setValueAtTime(150, ctx.currentTime)
      oscillator.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.15)
      
      gainNode.gain.setValueAtTime(0.3, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.2)
    } catch {
      // Audio not supported, fail silently
    }
  }, [isMuted, getAudioContext])

  // Play a success/positive sound
  const playSuccess = useCallback(async () => {
    if (isMuted) return
    
    try {
      const ctx = await getAudioContext()
      
      const playTone = (freq: number, delay: number) => {
        const oscillator = ctx.createOscillator()
        const gainNode = ctx.createGain()
        
        oscillator.connect(gainNode)
        gainNode.connect(ctx.destination)
        
        oscillator.type = "sine"
        oscillator.frequency.setValueAtTime(freq, ctx.currentTime + delay)
        
        gainNode.gain.setValueAtTime(0, ctx.currentTime + delay)
        gainNode.gain.linearRampToValueAtTime(0.15, ctx.currentTime + delay + 0.02)
        gainNode.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + delay + 0.15)
        
        oscillator.start(ctx.currentTime + delay)
        oscillator.stop(ctx.currentTime + delay + 0.15)
      }
      
      playTone(523, 0)      // C5
      playTone(659, 0.08)   // E5
      playTone(784, 0.16)   // G5
    } catch {
      // Audio not supported
    }
  }, [isMuted, getAudioContext])

  // Play typing sound
  const playType = useCallback(async () => {
    if (isMuted) return
    
    try {
      const ctx = await getAudioContext()
      const oscillator = ctx.createOscillator()
      const gainNode = ctx.createGain()
      
      oscillator.connect(gainNode)
      gainNode.connect(ctx.destination)
      
      oscillator.type = "square"
      oscillator.frequency.setValueAtTime(600 + Math.random() * 200, ctx.currentTime)
      
      gainNode.gain.setValueAtTime(0.03, ctx.currentTime)
      gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.02)
      
      oscillator.start(ctx.currentTime)
      oscillator.stop(ctx.currentTime + 0.02)
    } catch {
      // Audio not supported
    }
  }, [isMuted, getAudioContext])

  return {
    isMuted,
    isLoaded,
    toggleMute,
    playBeep,
    playThunk,
    playSuccess,
    playType,
  }
}
