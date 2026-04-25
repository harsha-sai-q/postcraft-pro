"use client";

import { useEffect, useState } from "react";
import { Card, EmptyState, SectionHeading, StatusMessage } from "./ui-kit";

type Analysis = {
  hookTechnique: string;
  tone: string;
  structure: string;
  whatWorks: string;
  whatDoesNotWork: string;
  lessonsToApply: string;
};

export function AnalyzerClient() {
  const [sourcePost, setSourcePost] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);
    const res = await fetch("/api/analyze-competitor", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ sourcePost }) }).then((r) => r.json());
    if (!res.ok) setError(res.error || "Failed to analyze this post");
    else setAnalysis(res.data.analysis);
    setLoading(false);
  };

  useEffect(() => {
    void fetch("/api/competitor-history");
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">Competitor Analyzer</h1>
      <p className="mt-1 text-sm text-slate-600">Break down why a post works, then apply those lessons to your own writing.</p>

      <Card className="mt-4 space-y-3">
        <SectionHeading title="Analyze a competitor post" />
        <textarea className="textarea min-h-44" placeholder="Paste competitor LinkedIn post" value={sourcePost} onChange={(e) => setSourcePost(e.target.value)} />
        <button className="btn-primary" disabled={!sourcePost.trim() || loading} onClick={analyze}>
          {loading ? "Analyzing…" : "Analyze post"}
        </button>
        {loading ? <StatusMessage message="Analyzing post structure and messaging…" tone="neutral" /> : null}
        {error ? <StatusMessage message={error} tone="error" /> : null}
      </Card>

      {!analysis && !loading ? (
        <div className="mt-4">
          <EmptyState title="Paste a post and click Analyze to see insights." />
        </div>
      ) : null}

      {analysis ? (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <Card><h3 className="font-semibold">Hook technique</h3><p className="mt-2 text-sm text-slate-700">{analysis.hookTechnique}</p></Card>
          <Card><h3 className="font-semibold">Tone</h3><p className="mt-2 text-sm text-slate-700">{analysis.tone}</p></Card>
          <Card><h3 className="font-semibold">Structure</h3><p className="mt-2 text-sm text-slate-700">{analysis.structure}</p></Card>
          <Card><h3 className="font-semibold">What works</h3><p className="mt-2 text-sm text-slate-700">{analysis.whatWorks}</p></Card>
          <Card><h3 className="font-semibold">What does not work</h3><p className="mt-2 text-sm text-slate-700">{analysis.whatDoesNotWork}</p></Card>
          <Card><h3 className="font-semibold">Lessons to apply</h3><p className="mt-2 text-sm text-slate-700">{analysis.lessonsToApply}</p></Card>
        </div>
      ) : null}
    </main>
  );
}
