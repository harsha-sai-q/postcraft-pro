import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";
import { sarvamJSON } from "@/lib/sarvam";

export async function POST(req: Request) {
  try {
    const { sourcePost } = await req.json();
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const analysis = await sarvamJSON<{ hookTechnique: string; tone: string; structure: string; whatWorks: string; whatDoesNotWork: string; lessonsToApply: string }>(`
Analyze this LinkedIn post and return JSON with keys: hookTechnique, tone, structure, whatWorks, whatDoesNotWork, lessonsToApply.
Post: ${sourcePost}
`);

    await supabase.from("competitor_analyses").insert({ user_id: user.id, source_post: sourcePost, analysis });
    await supabase.from("ai_generations").insert({ user_id: user.id, feature: "analyze-competitor", input: { sourcePost }, output: analysis });

    return NextResponse.json({ ok: true, data: { analysis } });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to analyze" }, { status: 500 });
  }
}
