"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Card, EmptyState, SectionHeading, StatusMessage } from "./ui-kit";
import { CopyButton } from "./copy-button";

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
    if (data.ok) setPosts(data.data);
  };

  useEffect(() => {
    void load();
  }, []);

  const filtered = useMemo(
    () => posts.filter((p) => (!favoritesOnly || p.is_favorite) && `${p.topic} ${p.content}`.toLowerCase().includes(query.toLowerCase())),
    [posts, query, favoritesOnly]
  );

  const toggleFavorite = async (id: string, is_favorite: boolean) => {
    await fetch("/api/history", { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id, is_favorite: !is_favorite }) });
    setMessage(!is_favorite ? "Added to favorites" : "Removed from favorites");
    void load();
  };

  const removePost = async (id: string) => {
    await fetch("/api/history", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    setMessage("Post deleted");
    void load();
  };

  return (
    <main>
      <h1 className="text-2xl font-bold tracking-tight">History</h1>
      <p className="mt-1 text-sm text-slate-600">Browse, search, and reuse your saved LinkedIn drafts.</p>

      <Card className="mt-4">
        <SectionHeading title="Saved posts" />
        <div className="flex flex-wrap items-center gap-3">
          <input
            className="input max-w-md border-slate-200 bg-slate-50"
            placeholder="Search by topic or content"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <label className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
            <input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} /> Favorites only
          </label>
        </div>
      </Card>

      {message ? (
        <div className="mt-3">
          <StatusMessage message={message} tone="success" />
        </div>
      ) : null}

      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <EmptyState title="No saved posts yet. Generate your first LinkedIn post." />
        ) : (
          filtered.map((post) => (
            <Card key={post.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-slate-900">{post.topic}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {post.tone} · {post.format} · {post.length} · Score {post.engagement_score ?? "N/A"}
                  </p>
                </div>
                <p className="text-xs text-slate-400">{new Date(post.created_at).toLocaleDateString()}</p>
              </div>

              <p className="mt-3 line-clamp-3 whitespace-pre-wrap text-sm leading-relaxed text-slate-700">{post.content}</p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link className="btn-secondary" href={`/generator?postId=${post.id}`}>
                  Open
                </Link>
                <CopyButton value={post.content} />
                <button className="btn-secondary" onClick={() => removePost(post.id)}>
                  Delete
                </button>
                <button className="btn-secondary" onClick={() => toggleFavorite(post.id, post.is_favorite)}>
                  {post.is_favorite ? "Unfavorite" : "Favorite"}
                </button>
              </div>
            </Card>
          ))
        )}
      </div>
    </main>
  );
}
