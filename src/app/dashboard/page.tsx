import type { Route } from "next";
import Link from "next/link";
import { AppCard, Badge, EmptyState, PageHeader, SectionHeading } from "@/components/ui-kit";
import { ProtectedPage } from "@/components/protected-page";
import { createServerSupabase } from "@/lib/supabase-server";

const quickActions: Array<{ href: Route; label: string; description: string }> = [
  { href: "/generator", label: "Generate a post", description: "Open the writing workspace." },
  { href: "/history", label: "View history", description: "Browse and reuse saved drafts." },
  { href: "/analyzer", label: "Analyze competitor post", description: "Extract lessons from high-performing posts." }
];

export default async function DashboardPage() {
  const supabase = await createServerSupabase();

  const [{ data: posts }, { count: analysesCount }, { count: totalCount }, { count: favoritesCount }, { data: scoreRows }] =
    await Promise.all([
      supabase
        .from("posts")
        .select("id,topic,engagement_score,is_favorite,created_at,tone,format")
        .order("created_at", { ascending: false })
        .limit(5),
      supabase.from("competitor_analyses").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }),
      supabase.from("posts").select("id", { count: "exact", head: true }).eq("is_favorite", true),
      supabase.from("posts").select("engagement_score").not("engagement_score", "is", null)
    ]);

  const totalPosts = totalCount ?? 0;
  const avgScore =
    scoreRows?.length ? Math.round(scoreRows.reduce((acc, post) => acc + (post.engagement_score ?? 0), 0) / scoreRows.length) : 0;
  const favorites = favoritesCount ?? 0;

  return (
    <ProtectedPage>
      <main className="mx-auto max-w-7xl">
        <PageHeader title="Welcome back" subtitle="Track your writing performance and jump into your next draft." />

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AppCard>
            <p className="text-xs uppercase tracking-wide text-slate-500">Total posts</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{totalPosts}</p>
          </AppCard>
          <AppCard>
            <p className="text-xs uppercase tracking-wide text-slate-500">Average score</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{avgScore}</p>
          </AppCard>
          <AppCard>
            <p className="text-xs uppercase tracking-wide text-slate-500">Favorite posts</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{favorites}</p>
          </AppCard>
          <AppCard>
            <p className="text-xs uppercase tracking-wide text-slate-500">Analyses</p>
            <p className="mt-2 text-3xl font-semibold text-slate-900">{analysesCount ?? 0}</p>
          </AppCard>
        </section>

        <section className="mt-6 grid gap-4 md:grid-cols-3">
          {quickActions.map((action) => (
            <Link key={action.href} href={action.href} className="card transition hover:-translate-y-0.5 hover:shadow-md">
              <p className="text-sm font-semibold text-slate-900">{action.label}</p>
              <p className="mt-1 text-sm text-slate-600">{action.description}</p>
            </Link>
          ))}
        </section>

        <AppCard className="mt-8">
          <SectionHeading title="Recent posts" subtitle="Your most recently saved drafts." />
          <div className="space-y-3">
            {(posts?.length ?? 0) === 0 ? (
              <EmptyState title="No saved posts yet. Generate your first LinkedIn post." />
            ) : (
              posts?.map((post) => (
                <div key={post.id} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <p className="font-medium text-slate-900">{post.topic}</p>
                    <div className="flex items-center gap-2">
                      {post.engagement_score ? <Badge tone="success">Score {post.engagement_score}</Badge> : <Badge>Unscored</Badge>}
                      {post.is_favorite ? <Badge tone="warning">Favorite</Badge> : null}
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    {post.tone} · {post.format} · {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              ))
            )}
          </div>
        </AppCard>
      </main>
    </ProtectedPage>
  );
}
