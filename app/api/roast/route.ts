import Anthropic from "@anthropic-ai/sdk";

export async function POST(request: Request) {
  console.log("[v0] Roast API called");
  
  try {
    const body = await request.json();
    const { url } = body;
    
    console.log("[v0] Incoming URL:", url);
    console.log("[v0] ANTHROPIC_BASE_URL:", process.env.ANTHROPIC_BASE_URL ? "set" : "NOT SET");
    console.log("[v0] ANTHROPIC_API_KEY:", process.env.ANTHROPIC_API_KEY ? "set" : "NOT SET");
    console.log("[v0] ANTHROPIC_MODEL:", process.env.ANTHROPIC_MODEL || "not set, using default");

    if (!url) {
      console.log("[v0] Error: URL is required");
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch site metadata from Microlink
    console.log("[v0] Fetching Microlink data...");
    const encodedUrl = encodeURIComponent(url);
    const microlinkResponse = await fetch(
      `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=true`
    );
    const microlinkData = await microlinkResponse.json();
    console.log("[v0] Microlink response status:", microlinkData.status);

    const siteTitle = microlinkData.data?.title || "Unknown";
    const siteDescription = microlinkData.data?.description || "No description available";
    const screenshot = microlinkData.data?.screenshot?.url || null;
    console.log("[v0] Site title:", siteTitle);
    console.log("[v0] Screenshot URL:", screenshot ? "obtained" : "null");

    // Initialize Anthropic client
    console.log("[v0] Initializing Anthropic client...");
    const anthropic = new Anthropic({
      baseURL: process.env.ANTHROPIC_BASE_URL,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });
    console.log("[v0] Anthropic client initialized");

    // Create the prompt for Claude
    const prompt = `You are ROAST, a brutally honest AI website critic. Analyze this website and provide a savage but constructive roast.

Website URL: ${url}
Title: ${siteTitle}
Description: ${siteDescription}

Respond ONLY with valid JSON in this exact format, no markdown, no extra text:
{
  "overallScore": 42,
  "overallVerdict": "one punchy brutal sentence",
  "fullRoast": "2-3 paragraph brutal roast",
  "categories": {
    "ui": { "score": 40, "comment": "brutal one-liner" },
    "ux": { "score": 50, "comment": "brutal one-liner" },
    "copy": { "score": 35, "comment": "brutal one-liner" },
    "performance": { "score": 60, "comment": "brutal one-liner" }
  },
  "fixes": ["fix 1", "fix 2", "fix 3", "fix 4"]
}

Rules:
- Scores are 0-100 (lower = worse)
- Be brutally honest but constructive
- Comments should be witty and memorable
- fullRoast should be 2-3 paragraphs of savage critique
- fixes should be actionable improvements
- overallVerdict is one punchy sentence summarizing the site`;

    // Call Claude
    console.log("[v0] Calling Claude with model:", process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514");
    const message = await anthropic.messages.create({
      model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
      max_tokens: 1024,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    console.log("[v0] Claude response received");

    // Extract the text content
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    console.log("[v0] Parsing Claude response...");
    const roastData = JSON.parse(textContent.text);
    console.log("[v0] Roast data parsed successfully");

    return Response.json({ roastData, screenshot, url });
  } catch (error) {
    console.error("[v0] Roast API error:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("[v0] Error message:", errorMessage);
    return Response.json(
      { error: "Failed to roast the website", details: errorMessage },
      { status: 500 }
    );
  }
}
