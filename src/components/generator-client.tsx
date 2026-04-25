"use client";

import { useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formats, lengths, tones } from "@/lib/constants";
import type { ScoreBreakdown } from "@/lib/types";
import { normalizeScoreBreakdown } from "@/lib/score-normalization";
import { Card, EmptyState, ScoreCard, SectionHeading, StatusMessage } from "./ui-kit";
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

  const scoreEntries = useMemo(
    () =>
      score
        ? (Object.entries(score) as Array<[keyof ScoreBreakdown, ScoreBreakdown[keyof ScoreBreakdown]]>).filter(([key]) => key !== "overallScore")
        : [],
    [score]
  );

  const generate = async () => {
    setLoading(true);
    setStatusMessage(null);
    setWarnings([]);
    setStatusTone("neutral");

    try {
      setProgressText("Writing your post…");
      const generated = await fetch("/api/generate-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, format, length })
      }).then((r) => r.json());

      if (!generated.ok || !generated?.data?.content) {
        throw new Error(generated.error ?? "Failed generating post");
      }

      const currentContent = generated.data.content as string;
      setContent(currentContent);

      let formatted = "";
      let scoreData: ScoreBreakdown | null = null;
      let prompt = "";
      const optionalWarnings: string[] = [];

      setProgressText("Formatting…");
      const f = await fetch("/api/format-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: currentContent })
      }).then((r) => r.json());

      if (f.ok && f?.data?.content) {
        formatted = f.data.content;
        setFormattedContent(formatted);
      } else {
        optionalWarnings.push("Formatted version was not generated. Showing original.");
        setFormattedContent("");
      }

      if (needScore) {
        setProgressText("Scoring…");
        const s = await fetch("/api/score-post", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentContent })
        }).then((r) => r.json());

        if (s.ok && s?.data) {
          scoreData = normalizeScoreBreakdown(s.data);
          setScore(scoreData);
        } else {
          optionalWarnings.push("Score could not be generated. You can still edit and save your post.");
          setScore(null);
        }
      } else {
        setScore(null);
      }

      if (needImagePrompt) {
        const i = await fetch("/api/image-prompt", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ content: currentContent, topic })
        }).then((r) => r.json());

        if (i.ok && i?.data?.imagePrompt) {
          prompt = i.data.imagePrompt;
          setImagePrompt(prompt);
        } else {
          optionalWarnings.push("Image prompt was not generated this time.");
          setImagePrompt("");
        }
      } else {
        setImagePrompt("");
      }

      setWarnings(optionalWarnings);

      setProgressText("Saving…");
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
        setStatusMessage("Post saved to history");
        setStatusTone("success");
      } else {
        setStatusMessage(saveResult.error ?? "Failed to save post to history");
        setStatusTone("error");
      }
    } catch (e) {
      setStatusMessage(e instanceof Error ? e.message : "Unexpected error");
      setStatusTone("error");
    } finally {
      setProgressText(null);
      setLoading(false);
    }
  };

  return (
    <main className="space-y-4">
      <h1 className="text-2xl font-bold tracking-tight">LinkedIn Post Generator</h1>
      <p className="text-sm text-slate-600">Create, refine, and reuse polished posts in one calm workspace.</p>

      <div className="grid gap-4 xl:grid-cols-12">
        <Card className="space-y-4 xl:col-span-3">
          <SectionHeading title="Post settings" />
          <div>
            <textarea className="textarea min-h-28" placeholder="Post topic or idea" value={topic} onChange={(e) => setTopic(e.target.value)} />
            <p className="mt-2 text-xs text-slate-500">Example: What I learned building my first AI tool</p>
          </div>

          <select className="select" value={tone} onChange={(e) => setTone(e.target.value as (typeof tones)[number])}>
            {tones.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select className="select" value={format} onChange={(e) => setFormat(e.target.value as (typeof formats)[number])}>
            {formats.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <select className="select" value={length} onChange={(e) => setLength(e.target.value as (typeof lengths)[number])}>
            {lengths.map((item) => (
              <option key={item}>{item}</option>
            ))}
          </select>

          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={needImagePrompt} onChange={(e) => setNeedImagePrompt(e.target.checked)} /> Generate image prompt
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-600">
            <input type="checkbox" checked={needScore} onChange={(e) => setNeedScore(e.target.checked)} /> Score post
          </label>

          <button disabled={!topic.trim() || loading} onClick={generate} className="btn-primary w-full py-3 text-base">
            {loading ? "Generating…" : "Generate post"}
          </button>

          {progressText ? <StatusMessage message={progressText} tone="neutral" /> : null}
          {statusMessage ? <StatusMessage message={statusMessage} tone={statusTone} /> : null}
          {warnings.map((warning) => (
            <StatusMessage key={warning} message={warning} tone="warning" />
          ))}
        </Card>

        <Card className="xl:col-span-6">
          <SectionHeading title="Generated post" />
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <button className={`btn-secondary ${view === "original" ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : ""}`} onClick={() => setView("original")}>
              Original
            </button>
            <button className={`btn-secondary ${view === "formatted" ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800" : ""}`} onClick={() => setView("formatted")}>
              Formatted
            </button>
            <CopyButton className="ml-auto" value={activeText} />
          </div>

          {view === "formatted" && !formattedContent && content ? (
            <div className="mb-3">
              <StatusMessage message="Formatted version was not generated. Showing original." tone="warning" />
            </div>
          ) : null}

          {content ? (
            <textarea
              className="textarea min-h-[440px]"
              value={activeText}
              onChange={(e) => {
                if (view === "formatted" && formattedContent) setFormattedContent(e.target.value);
                else setContent(e.target.value);
              }}
            />
          ) : (
            <EmptyState title="Your generated LinkedIn post will appear here." />
          )}
        </Card>

        <div className="space-y-4 xl:col-span-3">
          <Card>
            <SectionHeading title="Engagement score" />
            {score ? (
              <>
                <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50 p-4 text-center">
                  <p className="text-4xl font-bold text-slate-900">{Math.round(score.overallScore)}</p>
                  <p className="mt-1 text-sm font-medium text-slate-600">{getScoreLabel(score.overallScore)}</p>
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
              <EmptyState title="Generate a post to see the score." />
            )}
          </Card>

          <Card>
            <SectionHeading title="Image prompt" />
            {imagePrompt ? (
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{imagePrompt}</p>
            ) : (
              <EmptyState title="Generate a post to get an image prompt." />
            )}
          </Card>
        </div>
      </div>
    </main>
  );
}
