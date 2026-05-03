"use client"

import { useState, useEffect, useCallback } from "react"

export interface RoastHistoryItem {
  id: string
  url: string
  score: number
  verdict: string
  timestamp: number
}

const STORAGE_KEY = "roast-history"
const MAX_HISTORY = 5

export function useRoastHistory() {
  const [history, setHistory] = useState<RoastHistoryItem[]>([])
  const [isLoaded, setIsLoaded] = useState(false)

  // Load history from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (stored) {
        setHistory(JSON.parse(stored))
      }
    } catch (e) {
      console.error("Failed to load roast history:", e)
    }
    setIsLoaded(true)
  }, [])

  // Save a new roast to history
  const addRoast = useCallback((url: string, score: number, verdict: string) => {
    const newItem: RoastHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`,
      url,
      score,
      verdict,
      timestamp: Date.now(),
    }

    setHistory((prev) => {
      // Remove duplicate URLs, keep the latest
      const filtered = prev.filter((item) => item.url !== url)
      const updated = [newItem, ...filtered].slice(0, MAX_HISTORY)
      
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
      } catch (e) {
        console.error("Failed to save roast history:", e)
      }
      
      return updated
    })
  }, [])

  // Clear all history
  const clearHistory = useCallback(() => {
    setHistory([])
    try {
      localStorage.removeItem(STORAGE_KEY)
    } catch (e) {
      console.error("Failed to clear roast history:", e)
    }
  }, [])

  return { history, isLoaded, addRoast, clearHistory }
}
