import { generateText, Output } from "ai"
import { createAnthropic } from "@ai-sdk/anthropic"
import { z } from "zod"

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
  baseURL: process.env.ANTHROPIC_BASE_URL,
})

const roastSchema = z.object({
  overallScore: z.number().min(0).max(100).describe("Overall score 0-100, lower is worse"),
  overallVerdict: z.string().describe("One punchy brutal sentence summarizing the site"),
  fullRoast: z.string().describe("2-3 paragraph brutal but constructive roast"),
  categories: z.object({
    ui: z.object({
      score: z.number().min(0).max(100),
      comment: z.string().describe("Brutal one-liner about UI design"),
    }),
    ux: z.object({
      score: z.number().min(0).max(100),
      comment: z.string().describe("Brutal one-liner about UX flow"),
    }),
    copy: z.object({
      score: z.number().min(0).max(100),
      comment: z.string().describe("Brutal one-liner about copy and messaging"),
    }),
    performance: z.object({
      score: z.number().min(0).max(100),
      comment: z.string().describe("Brutal one-liner about performance"),
    }),
  }),
  fixes: z.array(z.string()).min(3).max(6).describe("Actionable improvements"),
})

function normalizeUrl(input: string): string {
  const trimmed = input.trim()
  if (!/^https?:\/\//i.test(trimmed)) {
    return `https://${trimmed}`
  }
  return trimmed
}

async function fetchSiteContext(url: string): Promise<{
  title: string
  description: string
  screenshot: string | null
}> {
  try {
    console.log("[v0] Fetching Microlink data for:", url)
    const encodedUrl = encodeURIComponent(url)
    const microlinkResponse = await fetch(
      `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=true`,
      { signal: AbortSignal.timeout(15000) }
    )

    if (!microlinkResponse.ok) {
      console.log("[v0] Microlink response not OK:", microlinkResponse.status)
      return { title: "Unknown", description: "Unable to fetch metadata", screenshot: null }
    }

    const microlinkData = await microlinkResponse.json()
    console.log("[v0] Microlink status:", microlinkData.status)

    return {
      title: microlinkData.data?.title || "Unknown",
      description: microlinkData.data?.description || "No description available",
      screenshot: microlinkData.data?.screenshot?.url || null,
    }
  } catch (error) {
    console.error("[v0] Microlink fetch failed:", error)
    return { title: "Unknown", description: "Unable to fetch metadata", screenshot: null }
  }
}

export async function POST(request: Request) {
  console.log("[v0] Roast API called")

  try {
    const body = await request.json()
    const rawUrl = body?.url

    if (!rawUrl || typeof rawUrl !== "string") {
      return Response.json({ error: "URL is required" }, { status: 400 })
    }

    const url = normalizeUrl(rawUrl)
    console.log("[v0] Normalized URL:", url)

    // Fetch site metadata + screenshot (gracefully degrades if it fails)
    const { title, description, screenshot } = await fetchSiteContext(url)
    console.log("[v0] Site title:", title)

    const modelId = process.env.ANTHROPIC_MODEL || "claude-sonnet-4-5-20250929"
    console.log("[v0] Calling Anthropic with model:", modelId)

    const { output } = await generateText({
      model: anthropic(modelId),
      output: Output.object({ schema: roastSchema }),
      system: `You are ROAST — a brutally honest, witty AI website critic. You write savage but CONSTRUCTIVE roasts of websites. Your tone is sharp, clever, and unflinching, but you always deliver actionable insight underneath the burns. Never be hateful or personal — roast the *site*, not the people. Scores are 0-100 where lower is worse.`,
      prompt: `Roast this website:

URL: ${url}
Title: ${title}
Description: ${description}

Deliver:
- overallScore (0-100, lower = worse)
- overallVerdict: one punchy brutal sentence
- fullRoast: 2-3 paragraphs of savage but constructive critique
- categories.ui / ux / copy / performance: each with a 0-100 score and a witty one-liner
- fixes: 3-6 actionable improvements

Be witty. Be brutal. Be specific. No filler.`,
    })

    console.log("[v0] AI response received, score:", output.overallScore)

    return Response.json({
      roastData: output,
      screenshot,
      url,
    })
  } catch (error) {
    console.error("[v0] Roast API error:", error)
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return Response.json(
      { error: "Failed to roast the website", details: errorMessage },
      { status: 500 }
    )
  }
}
