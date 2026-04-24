import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { ScoreBreakdown } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const data = await sarvamJSON<ScoreBreakdown>(`
Score this LinkedIn post and return JSON with exactly this shape:
{"overallScore": number, "hookStrength": {"score": number, "tip": string}, "readability": {"score": number, "tip": string}, "ctaClarity": {"score": number, "tip": string}, "hashtagRelevance": {"score": number, "tip": string}}
Post:\n${content}
`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to score" }, { status: 500 });
  }
}
