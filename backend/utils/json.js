export function extractJSON(text) {
  if (!text || typeof text !== "string") {
    throw new Error("Invalid AI response");
  }

  const cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");

  if (firstBrace === -1 || lastBrace === -1 || lastBrace < firstBrace) {
    throw new Error(`No JSON object found in AI response: ${cleaned.slice(0, 120)}`);
  }

  return cleaned.slice(firstBrace, lastBrace + 1);
}

export function safeParseJSON(text, fallback = null) {
  try {
    return JSON.parse(extractJSON(text));
  } catch (error) {
    if (fallback !== null) return fallback;
    throw error;
  }
}
