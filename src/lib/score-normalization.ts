import type { ScoreBreakdown } from "@/lib/types";

type DimensionKey = Exclude<keyof ScoreBreakdown, "overallScore">;

const DIMENSIONS: DimensionKey[] = ["hookStrength", "readability", "ctaClarity", "hashtagRelevance"];

function normalizeScoreValue(value: unknown): number {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 0;

  const scaled = numeric >= 0 && numeric <= 10 ? numeric * 10 : numeric;
  const clamped = Math.max(0, Math.min(100, scaled));

  return Math.round(clamped);
}

export function normalizeScoreBreakdown(input: Partial<ScoreBreakdown> | null | undefined): ScoreBreakdown | null {
  if (!input || typeof input !== "object") return null;

  const normalizedDimensions = DIMENSIONS.map((dimension) => {
    const entry = input[dimension];
    return {
      key: dimension,
      score: normalizeScoreValue(entry?.score),
      tip: typeof entry?.tip === "string" ? entry.tip : ""
    };
  });

  const computedOverall = Math.round(
    normalizedDimensions.reduce((sum, entry) => sum + entry.score, 0) / normalizedDimensions.length
  );

  const hasOverallScore = input.overallScore !== null && input.overallScore !== undefined;
  const overallScore = hasOverallScore ? normalizeScoreValue(input.overallScore) : computedOverall;

  return {
    overallScore,
    hookStrength: {
      score: normalizedDimensions[0].score,
      tip: normalizedDimensions[0].tip
    },
    readability: {
      score: normalizedDimensions[1].score,
      tip: normalizedDimensions[1].tip
    },
    ctaClarity: {
      score: normalizedDimensions[2].score,
      tip: normalizedDimensions[2].tip
    },
    hashtagRelevance: {
      score: normalizedDimensions[3].score,
      tip: normalizedDimensions[3].tip
    }
  };
}
