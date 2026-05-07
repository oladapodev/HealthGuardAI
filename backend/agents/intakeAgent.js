import { runAI } from "../utils/aiClient.js";

export async function intakeAgent(input) {
  const prompt = `
You are the Intake & Triage Agent for HealthGuard AI.
Your job is to gather accurate clinical data from the user and determine the context.

CURRENT KNOWLEDGE:
${JSON.stringify(input)}

TASKS:
1. Extract variables from user text or pre-parsed lab data.
2. If important data is missing (age, gender, specific level of severity for symptoms), provide a specialized "next_questions" field.
3. Be clinical but empathetic.

Return STRICT JSON ONLY.

Output format:
{
  "extracted_data": {
    "age": number,
    "gender": string,
    "symptoms": [],
    "labResults": {
      "marker_name": { "value": number, "unit": "str" }
    },
    "lifestyleNotes": string
  },
  "analysis_summary": "Short 1 sentence summary of what we know.",
  "next_questions": [
     "Specific question prompt 1",
     "Specific question prompt 2"
  ],
  "is_complete": boolean (true if we have enough to give a full diagnosis/insight)
}

Input:
${JSON.stringify(input)}
`;

  const result = await runAI(prompt);

  // 🧼 CLEAN AI OUTPUT
  const cleaned = result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  // Find valid JSON part
  const firstBrace = cleaned.indexOf("{");
  const lastBrace = cleaned.lastIndexOf("}");
  if (firstBrace === -1) return cleaned;
  
  return cleaned.slice(firstBrace, lastBrace + 1);
}