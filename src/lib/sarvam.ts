import "server-only";

const SARVAM_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_DEFAULT_MODEL = "sarvam-30b";
// Can be changed to "sarvam-105b" later via environment configuration.
const SARVAM_MODEL = process.env.SARVAM_MODEL ?? SARVAM_DEFAULT_MODEL;

type SarvamResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
    code?: string | number;
  };
  message?: string;
};

function buildSarvamHeaders(apiKey: string): HeadersInit {
  return {
    "Content-Type": "application/json",
    "API-Subscription-Key": apiKey
  };
}

function getSarvamErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "Unknown Sarvam error";

  const maybe = body as SarvamResponse;
  if (maybe.error?.message) return maybe.error.message;
  if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;

  return "Unknown Sarvam error";
}

export async function sarvamJSON<T>(instruction: string): Promise<T> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("Sarvam API key is missing: set SARVAM_API_KEY on the server environment.");
  }

  const response = await fetch(SARVAM_ENDPOINT, {
    method: "POST",
    headers: buildSarvamHeaders(apiKey),
    body: JSON.stringify({
      model: SARVAM_MODEL,
      messages: [
        {
          role: "system",
          content: "You are a LinkedIn content assistant. Return strict JSON only."
        },
        { role: "user", content: instruction }
      ],
      temperature: 0.7
    })
  });

  let data: SarvamResponse | null = null;
  try {
    data = (await response.json()) as SarvamResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    const message = getSarvamErrorMessage(data);
    throw new Error(`Sarvam request failed (${response.status}): ${message}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Invalid Sarvam response shape: missing choices[0].message.content");
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("Sarvam did not return valid JSON content");
  }
}
