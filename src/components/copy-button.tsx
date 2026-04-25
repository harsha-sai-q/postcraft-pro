"use client";

import { useEffect, useState } from "react";

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <button
      className={`btn-secondary ${className}`}
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}>
      {copied ? "Copied!" : "Copy"}
    </button>
  );
}
