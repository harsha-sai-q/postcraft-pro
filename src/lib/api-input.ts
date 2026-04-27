import { formats, lengths, tones } from "@/lib/constants";

export type JsonBody = Record<string, unknown>;

type ParseBodyResult =
  | { ok: true; data: JsonBody }
  | { ok: false; error: string };

type StringValidationResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

type EnumValidationResult<T extends string> =
  | { ok: true; value: T }
  | { ok: false; error: string };

export const inputLimits = {
  topic: 280,
  content: 5000,
  imagePrompt: 1200,
  sourcePost: 5000
} as const;

function isJsonObject(value: unknown): value is JsonBody {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export async function parseJsonBody(req: Request): Promise<ParseBodyResult> {
  try {
    const parsed = await req.json();
    if (!isJsonObject(parsed)) {
      return { ok: false, error: "Invalid request body. Please send a JSON object." };
    }
    return { ok: true, data: parsed };
  } catch {
    return { ok: false, error: "Invalid JSON payload." };
  }
}

export function requiredString(
  body: JsonBody,
  field: string,
  label: string,
  maxLength: number
): StringValidationResult {
  const raw = body[field];
  if (typeof raw !== "string") {
    return { ok: false, error: `${label} is required.` };
  }

  const value = raw.trim();
  if (!value) {
    return { ok: false, error: `${label} is required.` };
  }

  if (value.length > maxLength) {
    return { ok: false, error: `${label} must be ${maxLength} characters or fewer.` };
  }

  return { ok: true, value };
}

export function optionalTrimmedString(
  body: JsonBody,
  field: string,
  label: string,
  maxLength: number
): StringValidationResult | { ok: true; value: null | undefined } {
  const raw = body[field];

  if (raw === undefined) {
    return { ok: true, value: undefined };
  }

  if (raw === null) {
    return { ok: true, value: null };
  }

  if (typeof raw !== "string") {
    return { ok: false, error: `${label} must be text.` };
  }

  const value = raw.trim();
  if (!value) {
    return { ok: true, value: null };
  }

  if (value.length > maxLength) {
    return { ok: false, error: `${label} must be ${maxLength} characters or fewer.` };
  }

  return { ok: true, value };
}

export function enumValue<T extends string>(
  value: string,
  allowed: readonly T[],
  label: string
): EnumValidationResult<T> {
  if (!allowed.includes(value as T)) {
    return { ok: false, error: `Invalid ${label}.` };
  }

  return { ok: true, value: value as T };
}

export function validateTone(value: string): EnumValidationResult<(typeof tones)[number]> {
  return enumValue(value, tones, "tone");
}

export function validateFormat(value: string): EnumValidationResult<(typeof formats)[number]> {
  return enumValue(value, formats, "format");
}

export function validateLength(value: string): EnumValidationResult<(typeof lengths)[number]> {
  return enumValue(value, lengths, "length");
}
