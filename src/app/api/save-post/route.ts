import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase-server";

type SafeSupabaseError = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

function serializeSupabaseError(error: PostgrestError): SafeSupabaseError {
  return {
    message: error.message,
    code: error.code,
    details: error.details,
    hint: error.hint
  };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = await createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });

    const { data: insertedPost, error: saveError } = await supabase
      .from("posts")
      .insert({ ...payload, user_id: user.id })
      .select("id")
      .single();

    if (saveError) {
      const safeError = serializeSupabaseError(saveError);
      return NextResponse.json({ ok: false, error: safeError.message, supabaseError: safeError }, { status: 500 });
    }

    const { error: generationError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      feature: "generate-post",
      input: { topic: payload.topic, tone: payload.tone, format: payload.format, length: payload.length },
      output: payload
    });

    if (generationError) {
      const safeError = serializeSupabaseError(generationError);
      return NextResponse.json({ ok: false, error: safeError.message, supabaseError: safeError }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: insertedPost.id });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Save failed" }, { status: 500 });
  }
}
