export async function sarvamJSON<T>(instruction: string): Promise<T> {
  const apiKey = process.env.SARVAM_API_KEY;
  if (!apiKey) {
    throw new Error("SARVAM_API_KEY is not configured");
  }

  const response = await fetch("https://api.sarvam.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "sarvam-m",
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

  if (!response.ok) {
    throw new Error(`Sarvam error: ${response.status}`);
  }

  const data = await response.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content || typeof content !== "string") {
    throw new Error("Invalid Sarvam response shape");
  }

  try {
    return JSON.parse(content) as T;
  } catch {
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]) as T;
    }
    throw new Error("Sarvam did not return valid JSON");
  }
}
