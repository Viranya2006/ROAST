import { ImageResponse } from "@vercel/og"
import { NextRequest } from "next/server"

export const runtime = "edge"

function getSeverityConfig(score: number) {
  if (score < 30) {
    return { label: "CRIMINAL", color: "#FF3333", bg: "rgba(255, 51, 51, 0.2)" }
  }
  if (score < 50) {
    return { label: "ROUGH", color: "#FF8800", bg: "rgba(255, 136, 0, 0.2)" }
  }
  if (score < 70) {
    return { label: "SURVIVABLE", color: "#FFCC00", bg: "rgba(255, 204, 0, 0.2)" }
  }
  return { label: "RESPECTABLE", color: "#00FF41", bg: "rgba(0, 255, 65, 0.2)" }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const score = parseInt(searchParams.get("score") || "0", 10)
  const url = searchParams.get("url") || "unknown"
  const verdict = searchParams.get("verdict") || "No verdict"

  const severity = getSeverityConfig(score)

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#000000",
          fontFamily: "system-ui, sans-serif",
          position: "relative",
        }}
      >
        {/* Scanline overlay effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0, 255, 65, 0.03) 2px, rgba(0, 255, 65, 0.03) 4px)",
            pointerEvents: "none",
          }}
        />

        {/* Glow background */}
        <div
          style={{
            position: "absolute",
            width: 600,
            height: 600,
            borderRadius: "50%",
            background: `radial-gradient(circle, ${severity.bg} 0%, transparent 70%)`,
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* ROAST branding */}
        <div
          style={{
            display: "flex",
            fontSize: 32,
            fontWeight: 900,
            color: "#00FF41",
            letterSpacing: "-0.02em",
            marginBottom: 40,
          }}
        >
          ROAST
        </div>

        {/* Score circle */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: `6px solid ${severity.color}`,
            boxShadow: `0 0 60px ${severity.color}40`,
            marginBottom: 24,
          }}
        >
          <div
            style={{
              fontSize: 80,
              fontWeight: 900,
              color: severity.color,
              lineHeight: 1,
            }}
          >
            {score}
          </div>
          <div
            style={{
              fontSize: 20,
              color: "#888888",
              letterSpacing: "0.1em",
            }}
          >
            / 100
          </div>
        </div>

        {/* Severity badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            padding: "8px 20px",
            borderRadius: 999,
            backgroundColor: severity.bg,
            border: `1px solid ${severity.color}40`,
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              backgroundColor: severity.color,
            }}
          />
          <div
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: severity.color,
              letterSpacing: "0.15em",
            }}
          >
            {severity.label}
          </div>
        </div>

        {/* URL */}
        <div
          style={{
            fontSize: 24,
            color: "#ffffff",
            fontWeight: 600,
            marginBottom: 12,
          }}
        >
          {url}
        </div>

        {/* Verdict */}
        <div
          style={{
            fontSize: 18,
            color: "#888888",
            fontStyle: "italic",
            maxWidth: 500,
            textAlign: "center",
            display: "flex",
          }}
        >
          &ldquo;{verdict.slice(0, 80)}{verdict.length > 80 ? "..." : ""}&rdquo;
        </div>

        {/* Footer */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 14,
            color: "#555555",
          }}
        >
          roast your site at roast.app
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  )
}
