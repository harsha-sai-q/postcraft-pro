import { NextResponse } from "next/server";
import { createServerSupabase } from "@/lib/supabase-server";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = await createServerSupabase();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { error } = await supabase.from("posts").insert({ ...payload, user_id: user.id });
    if (error) throw error;
    await supabase.from("ai_generations").insert({ user_id: user.id, feature: "generate-post", input: { topic: payload.topic, tone: payload.tone, format: payload.format, length: payload.length }, output: payload });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Save failed" }, { status: 500 });
  }
}
