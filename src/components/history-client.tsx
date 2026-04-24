"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

type Post = {
  id: string;
  topic: string;
  tone: string;
  format: string;
  content: string;
  engagement_score: number | null;
  is_favorite: boolean;
  created_at: string;
};

export function HistoryClient() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [query, setQuery] = useState("");
  const [favoritesOnly, setFavoritesOnly] = useState(false);

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
    void load();
  };

  const removePost = async (id: string) => {
    await fetch("/api/history", { method: "DELETE", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ id }) });
    void load();
  };

  return (
    <main>
      <h1 className="text-2xl font-bold">History</h1>
      <div className="mt-4 flex flex-wrap gap-3">
        <input className="input max-w-md" placeholder="Search posts" value={query} onChange={(e) => setQuery(e.target.value)} />
        <label className="flex items-center gap-2 text-sm"><input type="checkbox" checked={favoritesOnly} onChange={(e) => setFavoritesOnly(e.target.checked)} /> Favorites only</label>
      </div>
      <div className="mt-5 space-y-3">
        {filtered.length === 0 ? (
          <div className="card text-sm text-slate-600">No posts found.</div>
        ) : (
          filtered.map((post) => (
            <div key={post.id} className="card">
              <div className="flex flex-wrap items-center gap-2"><p className="font-semibold">{post.topic}</p><p className="text-xs text-slate-500">{post.tone} · {post.format} · Score {post.engagement_score ?? "N/A"}</p></div>
              <p className="mt-2 line-clamp-3 whitespace-pre-wrap text-sm">{post.content}</p>
              <p className="mt-2 text-xs text-slate-400">{new Date(post.created_at).toLocaleString()}</p>
              <div className="mt-3 flex flex-wrap gap-2"><Link className="btn-secondary" href={`/generator?postId=${post.id}`}>Open</Link><button className="btn-secondary" onClick={() => navigator.clipboard.writeText(post.content)}>Copy</button><button className="btn-secondary" onClick={() => toggleFavorite(post.id, post.is_favorite)}>{post.is_favorite ? "Unfavorite" : "Favorite"}</button><button className="btn-secondary" onClick={() => removePost(post.id)}>Delete</button></div>
            </div>
          ))
        )}
      </div>
    </main>
  );
}
