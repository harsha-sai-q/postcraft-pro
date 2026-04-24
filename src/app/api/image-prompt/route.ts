import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const { content, topic } = await req.json();
    const data = await sarvamJSON<{ imagePrompt: string }>(`
Create a single professional LinkedIn image prompt for Midjourney/DALL-E/Ideogram.
Must include: subject, style, lighting, color palette, mood, 1:1 aspect ratio, professional direction.
Return JSON {"imagePrompt": string}.
Topic: ${topic}
Post: ${content}
`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to generate image prompt" }, { status: 500 });
  }
}
