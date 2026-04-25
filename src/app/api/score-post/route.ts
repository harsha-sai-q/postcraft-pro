import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import type { ScoreBreakdown } from "@/lib/types";

type AnyObject = Record<string, unknown>;

function clampScore(value: number): number {
  return Math.min(100, Math.max(0, value));
}

function normalizeScoreValue(raw: unknown): number {
  const parsed = typeof raw === "number" ? raw : Number(raw);
  if (!Number.isFinite(parsed)) return 0;

  const scaled = parsed <= 10 ? parsed * 10 : parsed;
  return clampScore(Math.round(scaled));
}

function getObjectValue(source: AnyObject, keys: string[]): AnyObject {
  for (const key of keys) {
    const value = source[key];
    if (value && typeof value === "object") {
      return value as AnyObject;
    }
  }
  return {};
}

function getTip(value: unknown, fallback: string): string {
  if (typeof value === "string" && value.trim()) {
    return value.trim();
  }
  return fallback;
}

function buildScoreBreakdown(raw: AnyObject): ScoreBreakdown {
  const hookRaw = getObjectValue(raw, ["hookStrength", "HookStrength", "hook_strength", "hook"]);
  const readabilityRaw = getObjectValue(raw, ["readability", "Readability"]);
  const ctaRaw = getObjectValue(raw, ["ctaClarity", "CtaClarity", "cta_clarity", "cta"]);
  const hashtagRaw = getObjectValue(raw, ["hashtagRelevance", "HashtagRelevance", "hashtag_relevance", "hashtags"]);

  const hookStrength = {
    score: normalizeScoreValue(hookRaw.score),
    tip: getTip(hookRaw.tip, "Start with a stronger opening line that creates curiosity.")
  };

  const readability = {
    score: normalizeScoreValue(readabilityRaw.score),
    tip: getTip(readabilityRaw.tip, "Use shorter lines and simpler wording for easier scanning.")
  };

  const ctaClarity = {
    score: normalizeScoreValue(ctaRaw.score),
    tip: getTip(ctaRaw.tip, "Add a clear and specific call-to-action at the end.")
  };

  const hashtagRelevance = {
    score: normalizeScoreValue(hashtagRaw.score),
    tip: getTip(hashtagRaw.tip, "Use fewer, more targeted hashtags aligned with the topic.")
  };

  const rawOverall = normalizeScoreValue(raw.overallScore);
  const average = Math.round((hookStrength.score + readability.score + ctaClarity.score + hashtagRelevance.score) / 4);

  return {
    overallScore: rawOverall > 0 ? rawOverall : average,
    hookStrength,
    readability,
    ctaClarity,
    hashtagRelevance
  };
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const ai = await sarvamJSON<AnyObject>(
      `Score this LinkedIn post and return JSON with this shape only: {"overallScore": number, "hookStrength": {"score": number, "tip": string}, "readability": {"score": number, "tip": string}, "ctaClarity": {"score": number, "tip": string}, "hashtagRelevance": {"score": number, "tip": string}}. Post:\n${content}`
    );

    const data = buildScoreBreakdown(ai);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to score" }, { status: 500 });
  }
}
