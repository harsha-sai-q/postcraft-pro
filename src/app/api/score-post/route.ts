import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { normalizeScoreBreakdown } from "@/lib/score-normalization";
import { ScoreBreakdown } from "@/lib/types";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const data = await sarvamJSON<Partial<ScoreBreakdown>>(`
Score this LinkedIn post and return JSON with exactly this shape:
{"overallScore": number, "hookStrength": {"score": number, "tip": string}, "readability": {"score": number, "tip": string}, "ctaClarity": {"score": number, "tip": string}, "hashtagRelevance": {"score": number, "tip": string}}
Post:\n${content}
`);

    const normalized = normalizeScoreBreakdown(data);
    if (!normalized) {
      throw new Error("Failed to normalize score response");
    }

    return NextResponse.json({ ok: true, data: normalized });
  } catch {
    return NextResponse.json({ ok: false, error: "Failed to score" }, { status: 500 });
  }
}
