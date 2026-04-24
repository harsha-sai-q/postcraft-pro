import Link from "next/link";

export default function LandingPage() {
  return (
    <main className="mx-auto max-w-5xl p-6 md:p-12">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">PostCraft Pro</h1>
        <div className="space-x-2">
          <Link href="/login" className="btn-secondary">
            Login
          </Link>
          <Link href="/signup" className="btn-primary">
            Get Started
          </Link>
        </div>
      </header>
      <section className="mt-16 grid gap-6 md:grid-cols-2">
        <div>
          <h2 className="text-4xl font-bold leading-tight">Write better LinkedIn posts in minutes.</h2>
          <p className="mt-4 text-slate-600">Generate, score, format, and analyze posts with AI—then save everything in your workspace.</p>
          <Link href="/signup" className="btn-primary mt-6">
            Create Account
          </Link>
        </div>
        <div className="card space-y-2">
          <p>✅ Post generation</p>
          <p>✅ Engagement scoring</p>
          <p>✅ Image prompt creation</p>
          <p>✅ Competitor analysis</p>
          <p>✅ Saved post history</p>
        </div>
      </section>
    </main>
  );
}
