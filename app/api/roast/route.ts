import Anthropic from "anthropic";

export async function POST(request: Request) {
  try {
    const { url } = await request.json();

    if (!url) {
      return Response.json({ error: "URL is required" }, { status: 400 });
    }

    // Fetch site metadata from Microlink
    const encodedUrl = encodeURIComponent(url);
    const microlinkResponse = await fetch(
      `https://api.microlink.io?url=${encodedUrl}&screenshot=true&meta=true`
    );
    const microlinkData = await microlinkResponse.json();

    const siteTitle = microlinkData.data?.title || "Unknown";
    const siteDescription = microlinkData.data?.description || "No description available";
    const screenshot = microlinkData.data?.screenshot?.url || null;

    // Initialize Anthropic client
    const anthropic = new Anthropic({
      baseURL: process.env.ANTHROPIC_BASE_URL,
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

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

    // Extract the text content
    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text response from Claude");
    }

    // Parse the JSON response
    const roastData = JSON.parse(textContent.text);

    return Response.json({ roastData, screenshot, url });
  } catch (error) {
    console.error("Roast API error:", error);
    return Response.json(
      { error: "Failed to roast the website" },
      { status: 500 }
    );
  }
}
