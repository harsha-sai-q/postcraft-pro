import Link from "next/link";
import { Card, EmptyState, SectionHeading } from "@/components/ui-kit";
import { ProtectedPage } from "@/components/protected-page";
import { createServerSupabase } from "@/lib/supabase-server";

export default async function DashboardPage() {
  const supabase = await createServerSupabase();
  const [{ data: posts }, { count: analysesCount }, { count: totalCount }, { count: favoritesCount }, { data: scoreRows }] = await Promise.all([
    supabase.from("posts").select("id,topic,engagement_score,is_favorite,created_at,tone,format").order("created_at", { ascending: false }).limit(5),
    supabase.from("competitor_analyses").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }),
    supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_favorite", true),
    supabase.from("posts").select("engagement_score").not("engagement_score", "is", null)
  ]);

  const totalPosts = totalCount ?? 0;
  const avgScore = scoreRows?.length ? Math.round(scoreRows.reduce((acc, p) => acc + (p.engagement_score ?? 0), 0) / scoreRows.length) : 0;
  const favorites = favoritesCount ?? 0;

  return (
    <ProtectedPage>
      <main>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
        <p className="mt-1 text-sm text-slate-600">Your LinkedIn content workspace at a glance.</p>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <Card><p className="text-sm text-slate-500">Total posts</p><p className="mt-2 text-3xl font-bold text-slate-900">{totalPosts}</p></Card>
          <Card><p className="text-sm text-slate-500">Average score</p><p className="mt-2 text-3xl font-bold text-slate-900">{avgScore}</p></Card>
          <Card><p className="text-sm text-slate-500">Favorite posts</p><p className="mt-2 text-3xl font-bold text-slate-900">{favorites}</p></Card>
          <Card><p className="text-sm text-slate-500">Analyses</p><p className="mt-2 text-3xl font-bold text-slate-900">{analysesCount ?? 0}</p></Card>
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <Link href="/generator" className="card hover:border-slate-300">
            <p className="text-sm text-slate-500">Quick action</p>
            <p className="mt-1 font-semibold text-slate-900">Generate new post</p>
          </Link>
          <Link href="/history" className="card hover:border-slate-300">
            <p className="text-sm text-slate-500">Quick action</p>
            <p className="mt-1 font-semibold text-slate-900">View history</p>
          </Link>
          <Link href="/analyzer" className="card hover:border-slate-300">
            <p className="text-sm text-slate-500">Quick action</p>
            <p className="mt-1 font-semibold text-slate-900">Analyze competitor post</p>
          </Link>
        </div>

        <Card className="mt-8">
          <SectionHeading title="Recent posts" />
          <div className="space-y-3">
            {(posts?.length ?? 0) === 0 ? (
              <EmptyState title="No saved posts yet. Generate your first LinkedIn post." />
            ) : (
              posts?.map((post) => (
                <div key={post.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <p className="font-medium text-slate-900">{post.topic}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.tone} · {post.format} · Score {post.engagement_score ?? "N/A"}
                  </p>
                </div>
              ))
            )}
          </div>
        </Card>
      </main>
    </ProtectedPage>
  );
}
