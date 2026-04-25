"use client";

import { useEffect, useState } from "react";
import { AppCard, Button, EmptyState, PageHeader, StatusMessage } from "./ui-kit";

type Analysis = {
  hookTechnique: string;
  tone: string;
  structure: string;
  whatWorks: string;
  whatDoesNotWork: string;
  lessonsToApply: string;
};

function friendlyAnalyzerError(message: string | null | undefined) {
  if (!message) return "Analysis failed. Please try again.";
  return /403|schema|invalid|sarvam|json/i.test(message) ? "Analysis failed. Please try again." : message;
}

export function AnalyzerClient() {
  const [sourcePost, setSourcePost] = useState("");
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const analyze = async () => {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/analyze-competitor", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sourcePost })
    }).then((r) => r.json());

    if (!res.ok) {
      setError(friendlyAnalyzerError(res.error));
      setAnalysis(null);
    } else {
      setAnalysis(res.data.analysis);
    }

    setLoading(false);
  };

  useEffect(() => {
    void fetch("/api/competitor-history");
  }, []);

  return (
    <main className="mx-auto max-w-7xl">
      <PageHeader
        title="Competitor Analyzer"
        subtitle="Paste a post and get structured insights you can apply to your own writing."
      />

      <AppCard className="space-y-4">
        <label className="text-xs font-medium uppercase tracking-wide text-slate-500">Paste LinkedIn post</label>
        <textarea
          className="textarea min-h-64"
          placeholder="Paste competitor LinkedIn post"
          value={sourcePost}
          onChange={(e) => setSourcePost(e.target.value)}
        />

        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary" disabled={!sourcePost.trim() || loading} onClick={analyze}>
            {loading ? "Analyzing post…" : "Analyze post"}
          </Button>
          {loading ? <StatusMessage message="Reading hook, tone, and structure…" tone="neutral" /> : null}
        </div>

        {error ? <StatusMessage message={error} tone="error" /> : null}
      </AppCard>

      {!analysis && !loading ? (
        <div className="mt-4">
          <EmptyState title="Paste a post and click Analyze to see insights." />
        </div>
      ) : null}

      {analysis ? (
        <section className="mt-4 grid gap-4 md:grid-cols-2">
          <AppCard>
            <h3 className="font-semibold text-slate-900">Hook technique</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.hookTechnique}</p>
          </AppCard>
          <AppCard>
            <h3 className="font-semibold text-slate-900">Tone</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.tone}</p>
          </AppCard>
          <AppCard>
            <h3 className="font-semibold text-slate-900">Structure</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.structure}</p>
          </AppCard>
          <AppCard>
            <h3 className="font-semibold text-slate-900">What works</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.whatWorks}</p>
          </AppCard>
          <AppCard>
            <h3 className="font-semibold text-slate-900">What does not work</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.whatDoesNotWork}</p>
          </AppCard>
          <AppCard>
            <h3 className="font-semibold text-slate-900">Lessons to apply</h3>
            <p className="mt-2 text-sm leading-relaxed text-slate-700">{analysis.lessonsToApply}</p>
          </AppCard>
        </section>
      ) : null}
    </main>
  );
}
