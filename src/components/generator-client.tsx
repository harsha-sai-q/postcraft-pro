"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { formats, lengths, tones } from "@/lib/constants";
import type { ScoreBreakdown } from "@/lib/types";

export function GeneratorClient() {
  const searchParams = useSearchParams();
  const [topic, setTopic] = useState("");
  const [tone, setTone] = useState(tones[0]);
  const [format, setFormat] = useState(formats[0]);
  const [length, setLength] = useState<(typeof lengths)[number]>("Medium");
  const [highlight, setHighlight] = useState(true);
  const [emojiFormat, setEmojiFormat] = useState(true);
  const [needImagePrompt, setNeedImagePrompt] = useState(true);
  const [needScore, setNeedScore] = useState(true);
  const [content, setContent] = useState("");
  const [highlightedContent, setHighlightedContent] = useState("");
  const [formattedContent, setFormattedContent] = useState("");
  const [imagePrompt, setImagePrompt] = useState("");
  const [score, setScore] = useState<ScoreBreakdown | null>(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"original" | "highlighted" | "formatted">("original");



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
      setHighlightedContent(p.highlighted_content ?? "");
      setFormattedContent(p.formatted_content ?? "");
      setImagePrompt(p.image_prompt ?? "");
      setScore(p.score_breakdown ?? null);
    })();
  }, [searchParams]);
  const activeText = view === "formatted" && formattedContent ? formattedContent : view === "highlighted" && highlightedContent ? highlightedContent : content;

  const generate = async () => {
    setLoading(true);
    setError(null);
    setStatus(null);
    try {
      const generated = await fetch("/api/generate-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ topic, tone, format, length }) }).then((r) => r.json());
      if (!generated.ok) throw new Error(generated.error ?? "Failed generating post");
      const currentContent = generated.data.content as string;
      setContent(currentContent);

      let highlighted = "";
      let formatted = "";
      let scoreData: ScoreBreakdown | null = null;
      let prompt = "";

      if (highlight) {
        const h = await fetch("/api/highlight-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentContent }) }).then((r) => r.json());
        if (h.ok) {
          highlighted = h.data.content;
          setHighlightedContent(highlighted);
        }
      }
      if (emojiFormat) {
        const f = await fetch("/api/format-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentContent }) }).then((r) => r.json());
        if (f.ok) {
          formatted = f.data.content;
          setFormattedContent(formatted);
        }
      }
      if (needScore) {
        const s = await fetch("/api/score-post", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentContent }) }).then((r) => r.json());
        if (s.ok) {
          scoreData = s.data;
          setScore(scoreData);
        }
      }
      if (needImagePrompt) {
        const i = await fetch("/api/image-prompt", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ content: currentContent, topic }) }).then((r) => r.json());
        if (i.ok) {
          prompt = i.data.imagePrompt;
          setImagePrompt(prompt);
        }
      }

      const saveResult = await fetch("/api/save-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic, tone, format, length, content: currentContent, highlighted_content: highlighted || null, formatted_content: formatted || null, score_breakdown: scoreData, engagement_score: scoreData?.overallScore ?? null, image_prompt: prompt || null })
      }).then((r) => r.json());

      if (saveResult.ok) {
        setStatus("Saved successfully");
      } else {
        setStatus(null);
        setError(saveResult.error ?? "Save failed");
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return <main><h1 className="text-2xl font-bold">LinkedIn Post Generator</h1><div className="mt-4 grid gap-5 lg:grid-cols-3"><div className="card space-y-3 lg:col-span-1"><textarea className="textarea min-h-28" placeholder="Post topic or idea" value={topic} onChange={(e) => setTopic(e.target.value)} /><select className="select" value={tone} onChange={(e) => setTone(e.target.value as (typeof tones)[number])}>{tones.map((t) => <option key={t}>{t}</option>)}</select><select className="select" value={format} onChange={(e) => setFormat(e.target.value as (typeof formats)[number])}>{formats.map((f) => <option key={f}>{f}</option>)}</select><select className="select" value={length} onChange={(e) => setLength(e.target.value as (typeof lengths)[number])}>{lengths.map((l) => <option key={l}>{l}</option>)}</select><label className="flex gap-2 text-sm"><input type="checkbox" checked={highlight} onChange={(e) => setHighlight(e.target.checked)} /> Highlight key points</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={emojiFormat} onChange={(e) => setEmojiFormat(e.target.checked)} /> Add emoji formatting</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={needImagePrompt} onChange={(e) => setNeedImagePrompt(e.target.checked)} /> Generate image prompt</label><label className="flex gap-2 text-sm"><input type="checkbox" checked={needScore} onChange={(e) => setNeedScore(e.target.checked)} /> Score post</label><button disabled={!topic || loading} onClick={generate} className="btn-primary w-full">{loading ? "Generating..." : "Generate"}</button>{status && <p className="text-xs text-emerald-700">{status}</p>}{error && <p className="text-xs text-red-600">{error}</p>}</div><div className="space-y-4 lg:col-span-2"><div className="card"><div className="mb-3 flex flex-wrap gap-2"><button className="btn-secondary" onClick={() => setView("original")}>Original</button><button className="btn-secondary" onClick={() => setView("highlighted")}>Highlighted</button><button className="btn-secondary" onClick={() => setView("formatted")}>Formatted</button><button className="btn-secondary ml-auto" onClick={() => navigator.clipboard.writeText(activeText)}>Copy</button></div><textarea className="textarea min-h-72" value={activeText} onChange={(e) => setContent(e.target.value)} /></div>{score && <div className="card"><p className="text-lg font-semibold">Overall score: {score.overallScore}/100</p><div className="mt-3 grid gap-3 md:grid-cols-2">{Object.entries(score).filter(([k]) => k !== "overallScore").map(([key, value]) => <div key={key} className="rounded-lg border border-slate-200 p-3"><p className="font-medium capitalize">{key}</p><p>Score: {(value as {score:number}).score}</p><p className="text-sm text-slate-600">{(value as {tip:string}).tip}</p></div>)}</div></div>}{imagePrompt && <div className="card"><p className="font-semibold">Image prompt</p><p className="mt-2 whitespace-pre-wrap text-sm text-slate-700">{imagePrompt}</p></div>}</div></div></main>;
}
