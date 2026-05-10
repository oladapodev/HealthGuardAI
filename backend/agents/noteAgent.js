import { runAI } from "../utils/aiClient.js";

export async function noteAgent({ structured, insight, context }) {
  const prompt = `
You are a clinical documentation assistant.

Patient Data:
${JSON.stringify(structured)}

AI Insight:
${insight}

Environmental Context:
${JSON.stringify(context)}

Create a professional SBAR (Situation, Background, Assessment, Recommendation) clinician report.

CLINICAL GUIDELINES:
- Use professional medical terminology (e.g., "hematoma" vs "bruise", "tachycardia" vs "fast heart rate").
- Reference specific lab values and units.
- Focus on clinical reasoning and risk stratification.
- Integrate environmental factors (AQI, pollutants) as clinical stressors.

STRUCTURE:
1. SITUATION: Concise statement of current clinical concern.
2. BACKGROUND: Relevant patient history, meds, and environmental context.
3. ASSESSMENT: Data-driven analysis of lab results and symptomatic correlations.
4. RECOMMENDATION: Specific items for clinical review (e.g., "Consider follow-up CMP", "Screen for respiratory triggers").

Return STRICT JSON ONLY:
{
  "SBAR_Situation": "",
  "SBAR_Background": "",
  "SBAR_Assessment": "",
  "SBAR_Recommendation": "",
  "priorityFlags": ["normal" | "monitor" | "urgent"]
}
`;

  return await runAI(prompt);
}
