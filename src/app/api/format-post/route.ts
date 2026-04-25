import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const ai = await sarvamJSON<{ content?: string }>(
      `Rewrite this post with short lines, blank lines, and restrained emoji bullets. Return JSON {"content": string}. Post: ${content}`
    );

    const formatted = typeof ai.content === "string" ? ai.content.trim() : "";
    if (!formatted) {
      throw new Error("Formatted content is empty.");
    }

    return NextResponse.json({ ok: true, data: { content: formatted } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to format" }, { status: 500 });
  }
}
