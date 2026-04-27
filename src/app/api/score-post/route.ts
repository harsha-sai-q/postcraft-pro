import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { normalizeScoreBreakdown } from "@/lib/score-normalization";
import { ScoreBreakdown } from "@/lib/types";
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

    const data = await sarvamJSON<Partial<ScoreBreakdown>>(`
Score this LinkedIn post and return JSON with exactly this shape:
{"overallScore": number, "hookStrength": {"score": number, "tip": string}, "readability": {"score": number, "tip": string}, "ctaClarity": {"score": number, "tip": string}, "hashtagRelevance": {"score": number, "tip": string}}
Post:\n${contentResult.value}
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
