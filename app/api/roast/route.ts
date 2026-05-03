// Direct Google Gemini REST API — no SDKs, no Vercel AI Gateway.
// Uses Gemini 2.5 Flash via the generativelanguage.googleapis.com endpoint.

const GEMINI_MODEL = "gemini-2.5-flash"
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`

// JSON schema for Gemini's structured output (responseSchema).
// Gemini follows OpenAPI 3 schema subset — keep it simple.
const responseSchema = {
  type: "object",
  properties: {
    overallScore: {
      type: "integer",
      description: "Overall score 0-100, lower is worse",
    },
    overallVerdict: {
      type: "string",
      description: "One punchy brutal sentence summarizing the site",
    },
    fullRoast: {
      type: "string",
      description: "2-3 paragraph brutal but constructive roast",
    },
    categories: {
      type: "object",
      properties: {
        ui: {
          type: "object",
          properties: {
            score: { type: "integer" },
            comment: { type: "string" },
          },
          required: ["score", "comment"],
        },
        ux: {
          type: "object",
          properties: {
            score: { type: "integer" },
            comment: { type: "string" },
          },
          required: ["score", "comment"],
        },
        copy: {
          type: "object",
          properties: {
            score: { type: "integer" },
            comment: { type: "string" },
          },
          required: ["score", "comment"],
        },
        performance: {
          type: "object",
          properties: {
            score: { type: "integer" },
            comment: { type: "string" },
          },
          required: ["score", "comment"],
        },
      },
      required: ["ui", "ux", "copy", "performance"],
    },
    fixes: {
      type: "array",
      items: { type: "string" },
      description: "3-6 actionable improvements",
    },
  },
  required: ["overallScore", "overallVerdict", "fullRoast", "categories", "fixes"],
}

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

async function callGemini(prompt: string, apiKey: string) {
  console.log("[v0] Calling Gemini API:", GEMINI_MODEL)

  const response = await fetch(`${GEMINI_ENDPOINT}?key=${apiKey}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.9,
        responseMimeType: "application/json",
        responseSchema,
      },
    }),
    signal: AbortSignal.timeout(60000),
  })

  if (!response.ok) {
    const errorText = await response.text()
    console.error("[v0] Gemini API error:", response.status, errorText)
    throw new Error(`Gemini API error (${response.status}): ${errorText.slice(0, 300)}`)
  }

  const data = await response.json()
  console.log("[v0] Gemini response received")

  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text
  if (!text) {
    console.error("[v0] No text in Gemini response:", JSON.stringify(data).slice(0, 500))
    throw new Error("Gemini returned no text content")
  }

  try {
    return JSON.parse(text)
  } catch (parseError) {
    console.error("[v0] Failed to parse Gemini JSON:", text.slice(0, 500))
    throw new Error("Gemini returned invalid JSON")
  }
}

export async function POST(request: Request) {
  console.log("[v0] Roast API called")

  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured" },
        { status: 500 }
      )
    }

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

    const prompt = `You are ROAST — a brutally honest, witty AI website critic. You write savage but CONSTRUCTIVE roasts of websites. Your tone is sharp, clever, and unflinching, but you always deliver actionable insight underneath the burns. Never be hateful or personal — roast the *site*, not the people. Scores are 0-100 where lower is worse.

Roast this website:

URL: ${url}
Title: ${title}
Description: ${description}

Deliver:
- overallScore (0-100, lower = worse)
- overallVerdict: one punchy brutal sentence
- fullRoast: 2-3 paragraphs of savage but constructive critique
- categories.ui / ux / copy / performance: each with a 0-100 score and a witty one-liner
- fixes: 3-6 actionable improvements

Be witty. Be brutal. Be specific. No filler. Return ONLY the structured JSON.`

    const output = await callGemini(prompt, apiKey)
    console.log("[v0] Roast generated, score:", output.overallScore)

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
