"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav: ReadonlyArray<{ label: string; href: Route }> = [
  { label: "Dashboard", href: "/dashboard" },
  { label: "Generator", href: "/generator" },
  { label: "History", href: "/history" },
  { label: "Analyzer", href: "/analyzer" },
  { label: "Settings", href: "/settings" }
];

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 md:flex">
      <aside className="hidden w-72 border-r border-slate-200 bg-white/95 p-6 md:block">
        <Link href="/dashboard" className="text-xl font-bold tracking-tight text-slate-900">
          PostCraft Pro
        </Link>
        <p className="mt-2 text-xs text-slate-400">{email}</p>
        <nav className="mt-6 space-y-1">
          {nav.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-xl px-3 py-2 text-sm font-medium transition ${pathname === href ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/95 p-4 backdrop-blur md:hidden">
          <div className="flex items-center justify-between">
            <p className="font-semibold tracking-tight">PostCraft Pro</p>
            <button className="btn-secondary" onClick={() => setOpen((v) => !v)}>
              {open ? "Close" : "Menu"}
            </button>
          </div>
          <p className="mt-2 text-xs text-slate-400">{email}</p>
          {open ? (
            <nav className="mt-3 grid grid-cols-2 gap-2">
              {nav.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className={`rounded-lg border p-2 text-sm ${pathname === href ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white text-slate-700"}`}
                  onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          ) : null}
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
