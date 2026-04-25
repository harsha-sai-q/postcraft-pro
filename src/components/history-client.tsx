"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { CopyButton } from "./copy-button";
import { AppCard, Badge, Button, EmptyState, PageHeader, SectionHeading, StatusMessage } from "./ui-kit";

type Post = {
  id: string;
  topic: string;
  tone: string;
  format: string;
  length: string;
  content: string;
  engagement_score: number | null;
  is_favorite: boolean;
  created_at: string;
};

export function HistoryClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    const data = await fetch("/api/history").then((r) => r.json());
    if (data.ok) {
      setPosts(data.data);
    }
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () =>
      posts.filter(
        (post) =>
          (!favoritesOnly || post.is_favorite) && `${post.topic} ${post.content}`.toLowerCase().includes(query.toLowerCase())
      ),
    [posts, query, favoritesOnly]
  );

  const toggleFavorite = async (id: string, isFavorite: boolean) => {
    await fetch("/api/history", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, is_favorite: !isFavorite })
    });
    setMessage(!isFavorite ? "Added to favorites." : "Removed from favorites.");
    void load();
  };

  const removePost = async (id: string) => {
    await fetch("/api/history", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id })
    });
    setMessage("Post deleted.");
    void load();
  };

  return (
    <main className="mx-auto max-w-7xl">
      <PageHeader title="History" subtitle="Open, copy, and organize your saved LinkedIn drafts." />

      <AppCard>
        <SectionHeading title="Saved posts" />
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input max-w-lg"
            placeholder="Search by topic or content"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-2 rounded-xl border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700">
            <input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} />
            Favorites only
          </label>
        </div>
      </AppCard>

      {message ? (
        <div className="mt-3">
          <StatusMessage message={message} tone="success" />
        </div>
      ) : null}

      <section className="mt-5 grid gap-4">
        {filtered.length === 0 ? (
          <EmptyState title="No saved posts yet. Generate your first LinkedIn post." />
        ) : (
          filtered.map((post) => (
            <AppCard key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-lg font-semibold text-slate-900">{post.topic}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.tone} · {post.format} · {post.length} · {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge tone={post.engagement_score && post.engagement_score >= 70 ? "success" : "neutral"}>
                  Score {post.engagement_score ?? "N/A"}
                </Badge>
              </div>

              <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{post.content}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="btn-secondary" href={`/generator?postId=${post.id}`}>
                  Open
                </Link>
                <CopyButton value={post.content} />
                <Button variant="secondary" onClick={() => toggleFavorite(post.id, post.is_favorite)}>
                  {post.is_favorite ? "Unfavorite" : "Favorite"}
                </Button>
                <Button variant="secondary" onClick={() => removePost(post.id)}>
                  Delete
                </Button>
              </div>
            </AppCard>
          ))
        )}
      </section>
    </main>
  );
}
