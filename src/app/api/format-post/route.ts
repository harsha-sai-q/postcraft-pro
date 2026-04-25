import { NextResponse } from "next/server";
import { sarvamText } from "@/lib/sarvam";

function extractFormattedContent(raw: string): string {
  const cleaned = raw.trim();
  if (!cleaned) return "";

  const unwrapped = cleaned
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/, "")
    .trim();

  try {
    const parsed = JSON.parse(unwrapped) as { content?: unknown } | string;
    if (typeof parsed === "string") return parsed.trim();
    if (parsed && typeof parsed === "object" && typeof parsed.content === "string") {
      return parsed.content.trim();
    }
  } catch {
    return cleaned;
  }

  return cleaned;
}

function localFormatPost(content: string): string {
  const cleaned = content.replace(/\r/g, "").trim();
  if (!cleaned) return "";

  const paragraphs = cleaned.split(/\n{2,}/).flatMap((block) => {
    const paragraph = block.trim();
    if (!paragraph) return [];

    if (paragraph.includes("\n")) {
      return [paragraph];
    }

    const sentenceLines = paragraph
      .split(/(?<=[.!?])\s+/)
      .map((line) => line.trim())
      .filter(Boolean);

    if (sentenceLines.length >= 2) {
      return [sentenceLines.join("\n")];
    }

    return [paragraph];
  });

  return paragraphs.join("\n\n");
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();

    if (typeof content !== "string" || !content.trim()) {
      return NextResponse.json({ ok: false, error: "Post content is required" }, { status: 400 });
    }

    try {
      const raw = await sarvamText(`
Rewrite this LinkedIn post for readability.
Use short lines and clear paragraph spacing.
Return only the final formatted LinkedIn post text with no JSON, markdown fences, or commentary.

Post:\n${content}
`);

      const extracted = extractFormattedContent(raw);
      if (extracted) {
        return NextResponse.json({ ok: true, data: { content: extracted } });
      }
    } catch {
      // Fall through to local formatter.
    }

    return NextResponse.json({ ok: true, data: { content: localFormatPost(content) } });
  } catch {
    return NextResponse.json({ ok: false, error: "Unable to format post right now" }, { status: 500 });
  }
}
