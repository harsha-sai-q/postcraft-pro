import "server-only";

const SARVAM_ENDPOINT = "https://api.sarvam.ai/v1/chat/completions";
const SARVAM_DEFAULT_MODEL = "sarvam-30b";
const SARVAM_MODEL = process.env.SARVAM_MODEL ?? SARVAM_DEFAULT_MODEL;
const SARVAM_DEFAULT_TEMPERATURE = 0.2;

type SarvamResponse = {
  choices?: Array<{
    message?: {
      content?: string;
    };
  }>;
  error?: {
    message?: string;
  };
};

type SarvamOptions = {
  temperature?: number;
};

function stripMarkdownFences(text: string): string {
  const fenced = text.match(/^```(?:json)?\s*([\s\S]*?)\s*```$/i);
  return fenced ? fenced[1].trim() : text.trim();
}

function extractFirstJsonObject(text: string): string | null {
  let depth = 0;
  let start = -1;
  let inString = false;
  let escaped = false;

  for (let i = 0; i < text.length; i += 1) {
    const ch = text[i];

    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (ch === "\\") {
        escaped = true;
      } else if (ch === '"') {
        inString = false;
      }
      continue;
    }

    if (ch === '"') {
      inString = true;
      continue;
    }

    if (ch === "{") {
      if (depth === 0) {
        start = i;
      }
      depth += 1;
      continue;
    }

    if (ch === "}" && depth > 0) {
      depth -= 1;
      if (depth === 0 && start !== -1) {
        return text.slice(start, i + 1);
      }
    }
  }

  return null;
}

function parseSarvamJson<T>(rawContent: string): T {
  const cleaned = stripMarkdownFences(rawContent);

  try {
    return JSON.parse(cleaned) as T;
  } catch {
    const extracted = extractFirstJsonObject(cleaned);
    if (!extracted) {
      throw new Error("Sarvam returned invalid JSON: expected a JSON object in the response.");
    }

    try {
      return JSON.parse(extracted) as T;
    } catch {
      throw new Error("Sarvam returned invalid JSON: unable to parse the extracted JSON object.");
    }
  }
}

export async function sarvamJSON<T>(instruction: string, options: SarvamOptions = {}): Promise<T> {
  const apiKey = process.env.SARVAM_API_KEY?.trim();
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const response = await fetch(SARVAM_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: SARVAM_MODEL,
      messages: [
        {
          role: "system",
          content:
            "Return valid minified JSON only. Do not include markdown, explanations, reasoning, comments, or extra text."
        },
        { role: "user", content: instruction }
      ],
      temperature: options.temperature ?? SARVAM_DEFAULT_TEMPERATURE
    })
  });

  let data: SarvamResponse | null = null;
  try {
    data = (await response.json()) as SarvamResponse;
  } catch {
    data = null;
  }

  if (!response.ok) {
    throw new Error(`Sarvam request failed (${response.status}): ${data?.error?.message ?? "Unknown error"}`);
  }

  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Sarvam returned an empty or invalid response shape.");
  }

  return parseSarvamJson<T>(content);
}
