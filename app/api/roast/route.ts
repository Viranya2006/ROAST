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
    let message;
    try {
      message = await anthropic.messages.create({
        model: process.env.ANTHROPIC_MODEL || "claude-sonnet-4-20250514",
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
      });
    } catch (apiError) {
      console.error("[v0] Anthropic API call failed:", apiError);
      throw new Error(`Anthropic API error: ${apiError instanceof Error ? apiError.message : "Unknown API error"}`);
    }
    
    console.log("[v0] Claude response received");
    console.log("[v0] Full message object:", JSON.stringify(message, null, 2));

    // Extract the text content - handle different response structures
    if (!message || !message.content) {
      console.error("[v0] Invalid response structure - message:", message);
      throw new Error("Invalid response from Claude - no content field");
    }
    
    console.log("[v0] message.content type:", typeof message.content);
    console.log("[v0] message.content:", JSON.stringify(message.content, null, 2));
    
    const textContent = Array.isArray(message.content) 
      ? message.content.find((block: { type: string }) => block.type === "text")
      : message.content;
      
    if (!textContent) {
      throw new Error("No text response from Claude");
    }
    
    const responseText = typeof textContent === "string" 
      ? textContent 
      : (textContent as { type: string; text: string }).text;
      
    if (!responseText) {
      throw new Error("Could not extract text from Claude response");
    }
    
    console.log("[v0] Extracted response text:", responseText.substring(0, 200) + "...");

    // Parse the JSON response
    console.log("[v0] Parsing Claude response...");
    
    // Clean the response text - remove any markdown code blocks if present
    let cleanedText = responseText.trim();
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7);
    }
    if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3);
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3);
    }
    cleanedText = cleanedText.trim();
    
    console.log("[v0] Cleaned text to parse:", cleanedText.substring(0, 200) + "...");
    
    let roastData;
    try {
      roastData = JSON.parse(cleanedText);
    } catch (parseError) {
      console.error("[v0] JSON parse failed:", parseError);
      console.error("[v0] Text that failed to parse:", cleanedText);
      throw new Error("Failed to parse Claude response as JSON");
    }
    
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
