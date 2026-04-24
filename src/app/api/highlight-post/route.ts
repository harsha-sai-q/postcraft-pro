import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { boldPhrases } from "@/lib/unicode-bold";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const data = await sarvamJSON<{ phrases: string[] }>(`Identify 3 to 5 impactful exact phrases from the post and return JSON: {"phrases": string[]}. Post: ${content}`);
    const highlighted = boldPhrases(content, data.phrases ?? []);
    return NextResponse.json({ ok: true, data: { content: highlighted, phrases: data.phrases ?? [] } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to highlight" }, { status: 500 });
  }
}
