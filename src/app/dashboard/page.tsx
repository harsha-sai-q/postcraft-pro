import Link from "next/link";
import { ProtectedPage } from "@/components/protected-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const [{ data: posts }, { count: analysesCount }, { count: totalCount }, { count: favoritesCount }] = await Promise.all([
    supabase
      .from("posts")
      .select("id,topic,engagement_score,is_favorite,created_at")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase.from("competitor_analyses").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_favorite", true)
  ]);

  const totalPosts = totalCount ?? 0;
  const avgScore = totalPosts ? Math.round((posts?.reduce((acc, p) => acc + (p.engagement_score ?? 0), 0) ?? 0) / totalPosts) : 0;
  const favorites = favoritesCount ?? 0;

  return (
    <ProtectedPage>
      <h1 className="text-2xl font-bold">Welcome to PostCraft Pro</h1>
      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <div className="card"><p className="text-sm text-slate-500">Total posts</p><p className="text-2xl font-bold">{totalPosts}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Avg engagement</p><p className="text-2xl font-bold">{avgScore}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Favorites</p><p className="text-2xl font-bold">{favorites}</p></div>
        <div className="card"><p className="text-sm text-slate-500">Analyses</p><p className="text-2xl font-bold">{analysesCount ?? 0}</p></div>
      </div>
      <div className="mt-6 flex gap-2">
        <Link href="/generator" className="btn-primary">Go to Generator</Link>
        <Link href="/history" className="btn-secondary">Post History</Link>
        <Link href="/analyzer" className="btn-secondary">Competitor Analyzer</Link>
      </div>
      <h2 className="mt-8 text-xl font-semibold">Recent posts</h2>
      <div className="mt-3 space-y-3">
        {(posts?.length ?? 0) === 0 ? <div className="card text-sm text-slate-600">No posts yet.</div> : posts?.map((p) => <div key={p.id} className="card"><p className="font-medium">{p.topic}</p><p className="text-xs text-slate-500">Score: {p.engagement_score ?? "N/A"}</p></div>)}
      </div>
    </ProtectedPage>
  );
}
