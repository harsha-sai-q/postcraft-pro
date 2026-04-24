"use client";

import { useEffect, useState } from "react";

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
    if (!res.ok) setError(res.error || "Failed");
    else setAnalysis(res.data.analysis);
    setLoading(false);
  };

  useEffect(() => {
    void fetch("/api/competitor-history");
  }, []);

  return (
    <main>
      <h1 className="text-2xl font-bold">Competitor Analyzer</h1>
      <div className="card mt-4 space-y-3">
        <textarea className="textarea min-h-40" placeholder="Paste competitor LinkedIn post" value={sourcePost} onChange={(e) => setSourcePost(e.target.value)} />
        <button className="btn-primary" disabled={!sourcePost || loading} onClick={analyze}>{loading ? "Analyzing..." : "Analyze"}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
      </div>
      {analysis && (
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="card"><h3 className="font-semibold">Hook technique</h3><p className="text-sm">{analysis.hookTechnique}</p></div>
          <div className="card"><h3 className="font-semibold">Tone</h3><p className="text-sm">{analysis.tone}</p></div>
          <div className="card"><h3 className="font-semibold">Structure</h3><p className="text-sm">{analysis.structure}</p></div>
          <div className="card"><h3 className="font-semibold">What works</h3><p className="text-sm">{analysis.whatWorks}</p></div>
          <div className="card"><h3 className="font-semibold">What does not work</h3><p className="text-sm">{analysis.whatDoesNotWork}</p></div>
          <div className="card"><h3 className="font-semibold">Lessons to apply</h3><p className="text-sm">{analysis.lessonsToApply}</p></div>
        </div>
      )}
    </main>
  );
}
