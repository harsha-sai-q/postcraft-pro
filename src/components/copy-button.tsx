"use client";

import { useEffect, useState } from "react";
import { Button } from "./ui-kit";

export function CopyButton({ value, className = "" }: { value: string; className?: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const id = window.setTimeout(() => setCopied(false), 2000);
    return () => window.clearTimeout(id);
  }, [copied]);

  return (
    <Button
      variant="secondary"
      className={className}
      aria-live="polite"
      onClick={async () => {
        if (!value) return;
        await navigator.clipboard.writeText(value);
        setCopied(true);
      }}
    >
      {copied ? "Copied!" : "Copy"}
    </Button>
  );
}
