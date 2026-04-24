"use client";

import type { Route } from "next";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const nav = [
  ["Dashboard", "/dashboard"],
  ["Generator", "/generator"],
  ["History", "/history"],
  ["Analyzer", "/analyzer"],
  ["Settings", "/settings"]
] as const satisfies ReadonlyArray<readonly [label: string, href: Route]>;

export function AppShell({ children, email }: { children: React.ReactNode; email: string }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-64 border-r border-slate-200 bg-white p-5 md:block">
        <Link href="/dashboard" className="text-xl font-bold">
          PostCraft Pro
        </Link>
        <p className="mt-2 text-xs text-slate-500">{email}</p>
        <nav className="mt-6 space-y-2">
          {nav.map(([label, href]) => (
            <Link
              key={href}
              href={href}
              className={`block rounded-lg px-3 py-2 text-sm ${pathname === href ? "bg-slate-900 text-white" : "hover:bg-slate-100"}`}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>

      <main className="flex-1">
        <header className="border-b border-slate-200 bg-white p-4 md:hidden">
          <div className="flex items-center justify-between">
            <p className="font-semibold">PostCraft Pro</p>
            <button className="btn-secondary" onClick={() => setOpen((v) => !v)}>
              Menu
            </button>
          </div>
          {open && (
            <nav className="mt-3 grid grid-cols-2 gap-2">
              {nav.map(([label, href]) => (
                <Link key={href} href={href} className="rounded-md border border-slate-200 p-2 text-sm" onClick={() => setOpen(false)}>
                  {label}
                </Link>
              ))}
            </nav>
          )}
          <p className="mt-2 text-xs text-slate-500">{email}</p>
        </header>
        <div className="p-4 md:p-8">{children}</div>
      </main>
    </div>
  );
}
