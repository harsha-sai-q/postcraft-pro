import type React from "react";

type Tone = "neutral" | "success" | "warning" | "error";

type ButtonVariant = "primary" | "secondary" | "ghost";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidth?: boolean;
};

const toneClasses: Record<Tone, string> = {
  neutral: "border-slate-200 bg-slate-50 text-slate-700",
  success: "border-emerald-200 bg-emerald-50 text-emerald-800",
  warning: "border-amber-200 bg-amber-50 text-amber-800",
  error: "border-rose-200 bg-rose-50 text-rose-800"
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function AppCard({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <section className={cx("card", className)}>{children}</section>;
}

export function Button({ variant = "secondary", fullWidth = false, className = "", ...props }: ButtonProps) {
  const variantClass =
    variant === "primary" ? "btn-primary" : variant === "ghost" ? "btn-ghost" : "btn-secondary";

  return <button className={cx(variantClass, fullWidth && "w-full", className)} {...props} />;
}

export function Badge({ children, tone = "neutral" }: { children: React.ReactNode; tone?: Tone }) {
  return (
    <span className={cx("inline-flex rounded-full border px-2.5 py-1 text-xs font-semibold", toneClasses[tone])}>
      {children}
    </span>
  );
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div>
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-slate-600">{subtitle}</p> : null}
      </div>
      {actions ? <div>{actions}</div> : null}
    </header>
  );
}

export function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="mb-4">
      <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
      {subtitle ? <p className="mt-1 text-xs text-slate-500">{subtitle}</p> : null}
    </header>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50/70 p-8 text-center">
      <p className="font-medium text-slate-800">{title}</p>
      {description ? <p className="mt-2 text-sm text-slate-500">{description}</p> : null}
    </div>
  );
}

export function StatusMessage({ message, tone = "neutral" }: { message: string; tone?: Tone }) {
  return <p className={cx("rounded-xl border px-3 py-2 text-sm", toneClasses[tone])}>{message}</p>;
}

export function ScoreCard({ title, score, tip }: { title: string; score: number; tip: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
      <div className="flex items-end justify-between gap-2">
        <p className="text-sm font-medium text-slate-700">{title}</p>
        <p className="text-2xl font-semibold text-slate-900">{Math.round(score)}</p>
      </div>
      <p className="mt-2 text-xs leading-relaxed text-slate-600">{tip}</p>
    </div>
  );
}

// Backwards-compatible exports
export const Card = AppCard;
