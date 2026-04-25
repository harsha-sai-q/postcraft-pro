import "server-only";

const SARVAM_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_DEFAULT_MODEL = "sarvam-30b";
const SARVAM_MODEL = process.env.SARVAM_MODEL ?? SARVAM_DEFAULT_MODEL;
const SARVAM_USE_BEARER_AUTH = process.env.SARVAM_USE_BEARER_AUTH === "true";

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
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "api-subscription-key": apiKey
  };

  if (SARVAM_USE_BEARER_AUTH) {
    headers.Authorization = `Bearer ${apiKey}`;
  }

  return headers;
}

function getSarvamErrorMessage(body: unknown): string {
  if (!body || typeof body !== "object") return "Unknown Sarvam error";

  const maybe = body as SarvamResponse;
  if (maybe.error?.message) return maybe.error.message;
  if (typeof maybe.message === "string" && maybe.message.trim()) return maybe.message;

  return "Unknown Sarvam error";
}

async function sarvamRequest(instruction: string, systemContent: string): Promise<string> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const response = await fetch(SARVAM_ENDPOINT, {
    method: "POST",
    headers: buildSarvamHeaders(apiKey),
    body: JSON.stringify({
      model: SARVAM_MODEL,
      messages: [
        {
          role: "system",
          content: systemContent
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

  return content;
}

export async function sarvamText(instruction: string): Promise<string> {
  return sarvamRequest(instruction, "You are a LinkedIn content assistant. Return only plain text output.");
}

export async function sarvamJSON<T>(instruction: string): Promise<T> {
  const content = await sarvamRequest(instruction, "You are a LinkedIn content assistant. Return strict JSON only.");

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
