"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formats, lengths, tones } from "@/lib/constants";
import type { ScoreBreakdown } from "@/lib/types";
import { normalizeScoreBreakdown } from "@/lib/score-normalization";
import { Button, EmptyState, PageHeader, ScoreCard, SectionHeading, StatusMessage, AppCard } from "./ui-kit";
import { CopyButton } from "./copy-button";

const SCORE_LABELS: Record<Exclude<keyof ScoreBreakdown, "overallScore">, string> = {
  hookStrength: "Hook Strength",
  readability: "Readability",
  ctaClarity: "CTA Clarity",
  hashtagRelevance: "Hashtag Relevance"
};

type StatusTone = "neutral" | "success" | "warning" | "error";

function getScoreLabel(score: number) {
  if (score >= 80) return "Strong";
  if (score >= 60) return "Good";
  if (score >= 40) return "Needs work";
  return "Weak";
}

function friendlyCriticalError(message: string | null | undefined, fallback: string) {
  if (!message) return fallback;
  return /403|schema|invalid json|response shape|sarvam|empty/i.test(message) ? fallback : message;
}

function friendlyOptionalError(kind: "formatted" | "score" | "image") {
  if (kind === "formatted") return "Formatted version was not available, so we saved the original.";
  if (kind === "score") return "We could not calculate a score this time, but your post is ready.";
  return "Image prompt was not available this time.";
}

function ScorePanel({ score }: { score: ScoreBreakdown | null }) {
  const scoreEntries = useMemo(
    () =>
      score
        ? (Object.entries(score) as Array<[keyof ScoreBreakdown, ScoreBreakdown[keyof ScoreBreakdown]]>).filter(([key]) => key !== "overallScore")
        : [],
    [score]
  );

  return (
    <AppCard>
      <SectionHeading title="Post quality" />
      {score ? (
        <>
          <div className="mb-4 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-center">
            <p className="text-5xl font-semibold tracking-tight text-slate-900">{Math.round(score.overallScore)}</p>
            <p className="text-sm text-slate-500">/100</p>
            <p className="mt-2 text-sm font-medium text-slate-700">{getScoreLabel(score.overallScore)}</p>
          </div>
          <div className="space-y-3">
            {scoreEntries.map(([key, value]) => (
              <ScoreCard
                key={String(key)}
                title={SCORE_LABELS[key as Exclude<keyof ScoreBreakdown, "overallScore">]}
                score={(value as { score: number }).score}
                tip={(value as { tip: string }).tip}
              />
            ))}
          </div>
        </>
      ) : (
        <EmptyState title="Generate a post to see quality insights." />
      )}
    </AppCard>
  );
}

export function GeneratorClient() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [format, setFormat] = useState(formats[0]);
  const [length, setLength] = useState<(typeof lengths)[number]>("Medium");
  const [needImagePrompt, setNeedImagePrompt] = useState(true);
  const [needScore, setNeedScore] = useState(true);
  const [content, setContent] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [progressText, setProgressText] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusTone, setStatusTone] = useState<StatusTone>("neutral");
  const [warnings, setWarnings] = useState<string[]>([]);
  const [view, setView] = useState<"original" | "formatted">("original");

  useEffect(() => {
    const postId = searchParams.get("postId");
    if (!postId) return;

    void (async () => {
      const res = await fetch(`/api/history/${postId}`).then((r) => r.json());
      if (!res.ok) return;
      const p = res.data;
      setTopic(p.topic);
      setTone(p.tone);
      setFormat(p.format);
      setLength(p.length);
      setContent(p.content);
      setFormattedContent(p.formatted_content ?? "");
      setImagePrompt(p.image_prompt ?? "");
      setScore(normalizeScoreBreakdown(p.score_breakdown) ?? null);
    })();
  }, [searchParams]);

  const activeText = view === "formatted" && formattedContent ? formattedContent : content;

  const generate = async () => {
    setLoading(true);
    setStatusMessage(null);
    setWarnings([]);
    setStatusTone("neutral");

    try {
      setProgressText("Writing post…");
      const generated = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, format, length })
      }).then((r) => r.json());

      if (!generated.ok || !generated?.data?.content) {
        throw new Error(friendlyCriticalError(generated.error, "Post generation failed. Please try again."));
      }

      const currentContent = generated.data.content as string;
      setContent(currentContent);

      let formatted = "";
      let scoreData: ScoreBreakdown | null = null;
      let prompt = "";
      const optionalWarnings: string[] = [];

      const f = await fetch("/api/format-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContent })
      }).then((r) => r.json());

      if (f.ok && f?.data?.content) {
        formatted = f.data.content;
        setFormattedContent(formatted);
      } else {
        optionalWarnings.push(friendlyOptionalError("formatted"));
        setFormattedContent("");
      }

      if (needScore) {
        setProgressText("Scoring post…");
        const s = await fetch("/api/score-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentContent })
        }).then((r) => r.json());

        if (s.ok && s?.data) {
          scoreData = normalizeScoreBreakdown(s.data);
          setScore(scoreData);
        } else {
          optionalWarnings.push(friendlyOptionalError("score"));
          setScore(null);
        }
      } else {
        setScore(null);
      }

      if (needImagePrompt) {
        setProgressText("Generating image prompt…");
        const i = await fetch("/api/image-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentContent, topic })
        }).then((r) => r.json());

        if (i.ok && i?.data?.imagePrompt) {
          prompt = i.data.imagePrompt;
          setImagePrompt(prompt);
        } else {
          optionalWarnings.push(friendlyOptionalError("image"));
          setImagePrompt("");
        }
      } else {
        setImagePrompt("");
      }

      setWarnings(optionalWarnings);

      setProgressText("Saving draft…");
      const saveResult = await fetch("/api/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          topic,
          tone,
          format,
          length,
          content: currentContent,
          formatted_content: formatted || null,
          score_breakdown: scoreData,
          engagement_score: scoreData?.overallScore ?? null,
          image_prompt: prompt || null
        })
      }).then((r) => r.json());

      if (saveResult.ok) {
        setStatusMessage("Draft saved to history.");
        setStatusTone("success");
      } else {
        setStatusMessage(friendlyCriticalError(saveResult.error, "Save failed. Please try again."));
        setStatusTone("error");
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Post generation failed. Please try again.";
      setStatusMessage(friendlyCriticalError(message, "Post generation failed. Please try again."));
      setStatusTone("error");
    } finally {
      setProgressText(null);
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-7xl">
      <PageHeader
        title="Create a post"
        subtitle="Turn your idea into a publish-ready LinkedIn draft with optional formatting, score, and image prompt."
      />

      <div className="grid gap-5 xl:grid-cols-12">
        <AppCard className="space-y-4 xl:col-span-3">
          <SectionHeading title="Post settings" />

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Topic / idea</label>
            <textarea
              className="textarea min-h-28"
              placeholder="Example: Lessons I learned building my first AI product"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Tone</label>
            <select className="select" value={tone} onChange={(e) => setTone(e.target.value as (typeof tones)[number])}>
              {tones.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Format</label>
            <select className="select" value={format} onChange={(e) => setFormat(e.target.value as (typeof formats)[number])}>
              {formats.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Length</label>
            <select className="select" value={length} onChange={(e) => setLength(e.target.value as (typeof lengths)[number])}>
              {lengths.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={needScore} onChange={(e) => setNeedScore(e.target.checked)} />
              Score
            </label>
            <label className="flex items-center gap-2 text-sm text-slate-700">
              <input type="checkbox" checked={needImagePrompt} onChange={(e) => setNeedImagePrompt(e.target.checked)} />
              Image prompt
            </label>
          </div>

          <Button variant="primary" fullWidth disabled={!topic.trim() || loading} onClick={generate}>
            {loading ? "Writing post…" : "Generate post"}
          </Button>

          {progressText ? <StatusMessage message={progressText} tone="neutral" /> : null}
          {statusMessage ? <StatusMessage message={statusMessage} tone={statusTone} /> : null}
          {warnings.map((warning) => (
            <StatusMessage key={warning} message={warning} tone="warning" />
          ))}
        </AppCard>

        <AppCard className="xl:col-span-6">
          <SectionHeading title="Draft" />

          <div className="mb-4 flex flex-wrap items-center gap-2">
            <button
              type="button"
              className={`btn-secondary ${view === "original" ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : ""}`}
              onClick={() => setView("original")}
            >
              Original
            </button>
            <button
              type="button"
              className={`btn-secondary ${view === "formatted" ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : ""}`}
              onClick={() => setView("formatted")}
            >
              Formatted
            </button>
            <CopyButton className="ml-auto" value={activeText} />
          </div>

          {content ? (
            <textarea
              className="textarea min-h-[540px] bg-slate-50"
              placeholder="Your LinkedIn post will appear here."
              value={activeText}
              onChange={(e) => {
                if (view === "formatted" && formattedContent) {
                  setFormattedContent(e.target.value);
                } else {
                  setContent(e.target.value);
                }
              }}
            />
          ) : (
            <EmptyState title="Your LinkedIn post will appear here." />
          )}
        </AppCard>

        <div className="space-y-5 xl:col-span-3">
          <ScorePanel score={score} />

          <AppCard>
            <SectionHeading title="Image prompt" subtitle="Optional" />
            {imagePrompt ? (
              <div className="space-y-3">
                <p className="whitespace-pre-wrap rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm leading-relaxed text-slate-700">
                  {imagePrompt}
                </p>
                <CopyButton value={imagePrompt} />
              </div>
            ) : (
              <EmptyState title="Generate a post to create an image prompt." />
            )}
          </AppCard>
        </div>
      </div>
    </main>
  );
}
