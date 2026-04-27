import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { inputLimits, parseJsonBody, requiredString } from "@/lib/api-input";

export async function POST(req: Request) {
  try {
    const parsed = await parseJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const contentResult = requiredString(parsed.data, "content", "Post content", inputLimits.content);
    if (!contentResult.ok) {
      return NextResponse.json({ ok: false, error: contentResult.error }, { status: 400 });
    }

    const topicResult = requiredString(parsed.data, "topic", "Topic", inputLimits.topic);
    if (!topicResult.ok) {
      return NextResponse.json({ ok: false, error: topicResult.error }, { status: 400 });
    }

    const data = await sarvamJSON<{ imagePrompt: string }>(`
Create a single professional LinkedIn image prompt for Midjourney/DALL-E/Ideogram.
Must include: subject, style, lighting, color palette, mood, 1:1 aspect ratio, professional direction.
Return JSON {"imagePrompt": string}.
Topic: ${topicResult.value}
Post: ${contentResult.value}
`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to generate image prompt" }, { status: 500 });
  }
}
