import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase-server";

type SafeErrorPayload = {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
};

function toSafeError(error: unknown, supabaseError?: PostgrestError | null): SafeErrorPayload {
  if (supabaseError) {
    return {
      message: supabaseError.message,
      code: supabaseError.code,
      details: supabaseError.details,
      hint: supabaseError.hint
    };
  }

  if (error instanceof Error) {
    return { message: error.message };
  }

  return { message: "Save failed" };
}

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const supabase = await createServerSupabase();
    const {
      data: { user }
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const { data: insertedPost, error: saveError } = await supabase
      .from("posts")
      .insert({ ...payload, user_id: user.id })
      .select("id")
      .single();

    if (saveError) {
      const safeError = toSafeError(null, saveError);
      return NextResponse.json({ ok: false, error: safeError.message, supabaseError: safeError }, { status: 500 });
    }

    const { error: generationError } = await supabase.from("ai_generations").insert({
      user_id: user.id,
      feature: "generate-post",
      input: { topic: payload.topic, tone: payload.tone, format: payload.format, length: payload.length },
      output: payload
    });

    if (generationError) {
      const safeError = toSafeError(null, generationError);
      return NextResponse.json({ ok: false, error: safeError.message, supabaseError: safeError }, { status: 500 });
    }

    return NextResponse.json({ ok: true, id: insertedPost.id });
  } catch (error) {
    const safeError = toSafeError(error);
    return NextResponse.json({ ok: false, error: safeError.message, details: safeError }, { status: 500 });
  }
}
