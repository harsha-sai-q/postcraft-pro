import { NextResponse } from "next/server";
import type { PostgrestError } from "@supabase/supabase-js";
import { createServerSupabase } from "@/lib/supabase-server";
import {
  inputLimits,
  optionalTrimmedString,
  parseJsonBody,
  requiredString,
  validateFormat,
  validateLength,
  validateTone
} from "@/lib/api-input";

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
    const parsed = await parseJsonBody(req);
    if (!parsed.ok) {
      return NextResponse.json({ ok: false, error: parsed.error }, { status: 400 });
    }

    const topicResult = requiredString(parsed.data, "topic", "Topic", inputLimits.topic);
    if (!topicResult.ok) {
      return NextResponse.json({ ok: false, error: topicResult.error }, { status: 400 });
    }

    const toneInput = requiredString(parsed.data, "tone", "Tone", 40);
    if (!toneInput.ok) {
      return NextResponse.json({ ok: false, error: toneInput.error }, { status: 400 });
    }

    const formatInput = requiredString(parsed.data, "format", "Format", 40);
    if (!formatInput.ok) {
      return NextResponse.json({ ok: false, error: formatInput.error }, { status: 400 });
    }

    const lengthInput = requiredString(parsed.data, "length", "Length", 20);
    if (!lengthInput.ok) {
      return NextResponse.json({ ok: false, error: lengthInput.error }, { status: 400 });
    }

    const contentResult = requiredString(parsed.data, "content", "Post content", inputLimits.content);
    if (!contentResult.ok) {
      return NextResponse.json({ ok: false, error: contentResult.error }, { status: 400 });
    }

    const formattedResult = optionalTrimmedString(parsed.data, "formatted_content", "Formatted content", inputLimits.content);
    if (!formattedResult.ok) {
      return NextResponse.json({ ok: false, error: formattedResult.error }, { status: 400 });
    }

    const imagePromptResult = optionalTrimmedString(parsed.data, "image_prompt", "Image prompt", inputLimits.imagePrompt);
    if (!imagePromptResult.ok) {
      return NextResponse.json({ ok: false, error: imagePromptResult.error }, { status: 400 });
    }

    const tone = validateTone(toneInput.value);
    if (!tone.ok) {
      return NextResponse.json({ ok: false, error: tone.error }, { status: 400 });
    }

    const format = validateFormat(formatInput.value);
    if (!format.ok) {
      return NextResponse.json({ ok: false, error: format.error }, { status: 400 });
    }

    const length = validateLength(lengthInput.value);
    if (!length.ok) {
      return NextResponse.json({ ok: false, error: length.error }, { status: 400 });
    }

    const engagementScoreRaw = parsed.data.engagement_score;
    if (engagementScoreRaw !== null && engagementScoreRaw !== undefined && typeof engagementScoreRaw !== "number") {
      return NextResponse.json({ ok: false, error: "Engagement score must be a number." }, { status: 400 });
    }

    const scoreBreakdown = parsed.data.score_breakdown;
    if (
      scoreBreakdown !== null &&
      scoreBreakdown !== undefined &&
      (typeof scoreBreakdown !== "object" || Array.isArray(scoreBreakdown))
    ) {
      return NextResponse.json({ ok: false, error: "Score breakdown must be a JSON object." }, { status: 400 });
    }

    const payload = {
      topic: topicResult.value,
      tone: tone.value,
      format: format.value,
      length: length.value,
      content: contentResult.value,
      formatted_content: formattedResult.value,
      image_prompt: imagePromptResult.value,
      engagement_score: engagementScoreRaw ?? null,
      score_breakdown: scoreBreakdown ?? null
    };

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
