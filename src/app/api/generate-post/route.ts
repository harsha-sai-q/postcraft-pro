import { NextResponse } from "next/server";
import { sarvamJSON } from "@/lib/sarvam";
import { inputLimits, parseJsonBody, requiredString, validateFormat, validateLength, validateTone } from "@/lib/api-input";

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

    const data = await sarvamJSON<{ content: string; hashtags: string[] }>(`
Create a LinkedIn post as JSON: {"content": string, "hashtags": string[]}
Rules: strong first-line hook, short paragraphs, spacing, CTA at end, no markdown, no fake engagement claims, no pricing.
Inputs: topic=${topicResult.value}, tone=${tone.value}, format=${format.value}, length=${length.value}
`);
    return NextResponse.json({ ok: true, data });
  } catch (error) {
    return NextResponse.json({ ok: false, error: error instanceof Error ? error.message : "Failed to generate" }, { status: 500 });
  }
}
