import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";

type GenerateResponse = {
  content: string;
  hashtags: string[];
  topicLabel: string;
};

function extractHashtags(text: string): string[] {
  const matches = text.match(/#[\p{L}\p{N}_]+/gu) ?? [];
  return Array.from(new Set(matches.map((tag) => (tag.startsWith("#") ? tag : `#${tag}`))));
}

function normalizeHashtags(raw: unknown, content: string): string[] {
  if (Array.isArray(raw)) {
    const cleaned = raw
      .filter((value): value is string => typeof value === "string")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));

    if (cleaned.length > 0) {
      return Array.from(new Set(cleaned));
    }
  }

  return extractHashtags(content);
}

export async function POST(req: Request) {
  try {
    const { topic, tone, format, length } = await req.json();
    const storyRule =
      format === "Story"
        ? "If using personal storytelling, keep it realistic, grounded, and specific."
        : "Do not invent personal stories or personal life events.";

    const ai = await sarvamJSON<Partial<GenerateResponse>>(
      `Write a human-sounding LinkedIn post and return JSON with exactly this shape: {"content": string, "hashtags": string[], "topicLabel": string}.
Rules:
- Start with a strong hook in the very first line.
- Use short, punchy paragraphs (1-2 lines each).
- Sound practical and real, not cheesy or overly motivational.
- Avoid cliches, including phrases like "in today's fast-paced world".
- No markdown, no headings, no **bold** markers.
- ${storyRule}
- End with a specific, natural CTA (e.g., ask for one opinion, one example, or one action).
- Keep hashtags relevant to the topic and limited to 3-5 max.
- No fake stats, no fake outcomes, no pricing claims.
Inputs: topic=${topic}, tone=${tone}, format=${format}, length=${length}`
    );

    const content = typeof ai.content === "string" ? ai.content.trim() : "";
    if (!content) {
      throw new Error("Generated post is empty.");
    }

    const data: GenerateResponse = {
      content,
      hashtags: normalizeHashtags(ai.hashtags, content).slice(0, 5),
      topicLabel: typeof ai.topicLabel === "string" && ai.topicLabel.trim() ? ai.topicLabel.trim() : String(topic ?? "General")
    };

    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to generate" }, { status: 500 });
  }
}
