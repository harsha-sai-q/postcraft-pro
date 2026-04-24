import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    const data = await sarvamJSON<{ content: string }>(`Rewrite this post with short lines, blank lines, and restrained emoji bullets. Return JSON {"content": string}. Post: ${content}`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to format" }, { status: 500 });
  }
}
