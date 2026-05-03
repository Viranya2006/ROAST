"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { History, ChevronDown, Trash2, ExternalLink } from "lucide-react"
import { useRoastHistory, RoastHistoryItem } from "@/lib/use-roast-history"
import { getSeverity } from "@/lib/severity"

function formatTimeAgo(timestamp: number): string {
  const seconds = Math.floor((Date.now() - timestamp) / 1000)
  
  if (seconds < 60) return "just now"
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`
  return `${Math.floor(seconds / 86400)}d ago`
}

function formatUrl(url: string): string {
  try {
    const parsed = new URL(url.startsWith("http") ? url : `https://${url}`)
    return parsed.hostname.replace("www.", "")
  } catch {
    return url.slice(0, 30)
  }
}

interface RoastHistoryProps {
  onSelect?: (item: RoastHistoryItem) => void
}

export function RoastHistory({ onSelect }: RoastHistoryProps) {
  const [isOpen, setIsOpen] = useState(false)
  const { history, isLoaded, clearHistory } = useRoastHistory()

  if (!isLoaded || history.length === 0) {
    return null
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full text-xs font-medium border border-white/10 text-muted-foreground hover:text-foreground hover:border-white/20 transition-all duration-200"
      >
        <History className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Previous Roasts</span>
        <span className="sm:hidden">{history.length}</span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute top-full right-0 mt-2 w-72 sm:w-80 z-50 glass rounded-xl border border-white/10 overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5">
                <span className="text-sm font-medium text-foreground">Recent Roasts</span>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    clearHistory()
                    setIsOpen(false)
                  }}
                  className="text-xs text-muted-foreground hover:text-[#FF3333] transition-colors flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" />
                  Clear
                </button>
              </div>

              {/* List */}
              <div className="max-h-64 overflow-y-auto">
                {history.map((item, index) => {
                  const severity = getSeverity(item.score)
                  
                  return (
                    <motion.button
                      key={item.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onSelect?.(item)
                        setIsOpen(false)
                      }}
                      className="w-full px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition-colors text-left border-b border-white/5 last:border-b-0"
                    >
                      {/* Score badge */}
                      <div
                        className="w-10 h-10 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                        style={{
                          backgroundColor: severity.bgColor,
                          color: severity.color,
                          border: `1px solid ${severity.borderColor}`,
                        }}
                      >
                        {item.score}
                      </div>
                      
                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm text-foreground font-medium truncate">
                            {formatUrl(item.url)}
                          </span>
                          <ExternalLink className="w-3 h-3 text-muted-foreground flex-shrink-0" />
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.verdict}
                        </p>
                      </div>
                      
                      {/* Time */}
                      <span className="text-xs text-muted-foreground flex-shrink-0">
                        {formatTimeAgo(item.timestamp)}
                      </span>
                    </motion.button>
                  )
                })}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
