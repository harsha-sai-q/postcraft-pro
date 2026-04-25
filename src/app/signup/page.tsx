"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { createClient } from "@/lib/supabase";

function SignupPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const supabase = createClient();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(() => searchParams.get("error"));

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    setLoading(false);
    if (error) return setError(error.message);
    router.push("/dashboard");
  };

  const onGoogleSignIn = async () => {
    setOauthLoading(true);
    setError(null);

    const redirectTo = `${window.location.origin}/auth/callback`;
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo }
    });

    if (error) {
      setError("Google sign-in could not be started. Please try again.");
      setOauthLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-md p-6">
      <h1 className="text-2xl font-bold">Create account</h1>

      <div className="card mt-6 space-y-4">
        <button type="button" className="btn-secondary w-full gap-2" onClick={onGoogleSignIn} disabled={oauthLoading || loading}>
          <span aria-hidden="true" className="text-base font-bold text-[#4285F4]">G</span>
          {oauthLoading ? "Redirecting to Google..." : "Continue with Google"}
        </button>

        <div className="flex items-center gap-3">
          <div className="h-px flex-1 bg-slate-200" />
          <span className="text-xs font-medium uppercase tracking-wide text-slate-500">or continue with email</span>
          <div className="h-px flex-1 bg-slate-200" />
        </div>

        <form onSubmit={onSubmit} className="space-y-3">
          <input className="input" placeholder="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          <input className="input" placeholder="Password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button className="btn-primary w-full" disabled={loading || oauthLoading}>{loading ? "Creating..." : "Sign up"}</button>
        </form>
      </div>

      <p className="mt-3 text-sm">Already have an account? <Link href="/login" className="underline">Login</Link></p>
    </main>
  );
}

export default function SignupPage() {
  return (
    <Suspense fallback={null}>
      <SignupPageContent />
    </Suspense>
  );
}
