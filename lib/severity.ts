export type SeverityTier = "CRIMINAL" | "ROUGH" | "SURVIVABLE" | "RESPECTABLE"

export interface SeverityConfig {
  tier: SeverityTier
  label: string
  color: string
  bgColor: string
  borderColor: string
  glowColor: string
  description: string
}

export function getSeverity(score: number): SeverityConfig {
  if (score < 30) {
    return {
      tier: "CRIMINAL",
      label: "CRIMINAL",
      color: "#FF3333",
      bgColor: "rgba(255, 51, 51, 0.1)",
      borderColor: "rgba(255, 51, 51, 0.3)",
      glowColor: "rgba(255, 51, 51, 0.4)",
      description: "This site should be illegal.",
    }
  }
  
  if (score < 50) {
    return {
      tier: "ROUGH",
      label: "ROUGH",
      color: "#FF8800",
      bgColor: "rgba(255, 136, 0, 0.1)",
      borderColor: "rgba(255, 136, 0, 0.3)",
      glowColor: "rgba(255, 136, 0, 0.4)",
      description: "Needs serious intervention.",
    }
  }
  
  if (score < 70) {
    return {
      tier: "SURVIVABLE",
      label: "SURVIVABLE",
      color: "#FFCC00",
      bgColor: "rgba(255, 204, 0, 0.1)",
      borderColor: "rgba(255, 204, 0, 0.3)",
      glowColor: "rgba(255, 204, 0, 0.4)",
      description: "Could be worse. But also better.",
    }
  }
  
  return {
    tier: "RESPECTABLE",
    label: "RESPECTABLE",
    color: "#00FF41",
    bgColor: "rgba(0, 255, 65, 0.1)",
    borderColor: "rgba(0, 255, 65, 0.3)",
    glowColor: "rgba(0, 255, 65, 0.4)",
    description: "Actually not terrible.",
  }
}

export function getSeverityEmoji(tier: SeverityTier): string {
  switch (tier) {
    case "CRIMINAL":
      return "💀"
    case "ROUGH":
      return "😬"
    case "SURVIVABLE":
      return "😐"
    case "RESPECTABLE":
      return "👍"
  }
}
