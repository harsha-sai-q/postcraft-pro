import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const { topic, tone, format, length } = await req.json();
    const data = await sarvamJSON<{ content: string; hashtags: string[] }>(`
Create a LinkedIn post as JSON: {"content": string, "hashtags": string[]}
Rules: strong first-line hook, short paragraphs, spacing, CTA at end, no markdown, no fake engagement claims, no pricing.
Inputs: topic=${topic}, tone=${tone}, format=${format}, length=${length}
`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to generate" }, { status: 500 });
  }
}
