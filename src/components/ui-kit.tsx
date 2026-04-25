type Tone = "neutral" | "success" | "warning" | "error";

const toneClasses: Record<Tone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-700",
  warning: "border-amber-200 bg-amber-50 text-amber-700",
  error: "border-rose-200 bg-rose-50 text-rose-700"
};

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={`card ${className}`}>{children}</section>;
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <h2 className="text-base font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </header>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-xl border border-dashed border-slate-300 bg-slate-50 p-6 text-center">
      <p className="font-medium text-slate-700">{title}</p>
      {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function StatusMessage({ message, tone = "neutral" }: { message: string; tone?: Tone }) {
  return <p className={`rounded-lg border px-3 py-2 text-sm ${toneClasses[tone]}`}>{message}</p>;
}

export function ScoreCard({ title, score, tip }: { title: string; score: number; tip: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-medium text-slate-600">{title}</p>
      <p className="mt-1 text-2xl font-bold text-slate-900">{Math.round(score)}</p>
      <p className="mt-2 text-sm leading-relaxed text-slate-600">{tip}</p>
    </div>
  );
}
