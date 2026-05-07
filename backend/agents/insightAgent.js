import { runAI } from "../utils/aiClient.js";

export async function insightAgent({ structured, context }) {
  const prompt = `
You are a medical reasoning assistant.

Patient Data:
${JSON.stringify(structured)}

Environmental Context:
${JSON.stringify(context)}

Provide:
- Simple explanation (plain language).
- Correlations between health + environment.
- Abnormal values & their clinical significance.
- Gender-specific insights (e.g., iron/hemoglobin context for menstrual cycle).
- Age-specific adjustments (e.g., pediatric vs geriatric considerations).
- ANCESTRY & DEMOGRAPHIC BIAS MITIGATION: 
  - Consider ancestry-specific reference range variations where clinically relevant (e.g., bone density, GFR, or hematological differences).
  - Acknowledge socioeconomic factors that may impact health outcomes.
  - Avoid language that perpetuates racial, gender, or age-based medical biases.
- BIAS MITIGATION: Avoid stereotypes. Use evidence-based medical reasoning that respects the user's demographic context (ancestry, gender, age) without bias.
- No diagnosis.
`;,oldString:,oldString:

  return await runAI(prompt);
}