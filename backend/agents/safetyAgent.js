import { runAI } from "../utils/aiClient.js";

/**
 * Safety Agent - Audits AI responses for hallucinations, diagnostic language, 
 * and sensitive medical claims.
 */
export async function safetyAgent(analysis, rawPrompt) {
    // 🛑 HARDCODED SAFETY BUFFER
    const dangerWords = [/suicide/i, /kill myself/i, /illegal drug/i, /overdose/i];
    const triggerString = JSON.stringify(analysis) + rawPrompt;
    
    if (dangerWords.some(regex => regex.test(triggerString))) {
        return JSON.stringify({
            safe: false,
            shouldRefuse: true,
            issues: ["High-risk content detected"],
            correctedInsight: "Please contact emergency services or a crisis hotline immediately."
        });
    }

    const auditPrompt = `
You are a Medical Safety Audit Agent. Your job is to verify that the AI analysis follows strict safety protocols.

ANALYSIS TO AUDIT:
${JSON.stringify(analysis)}

ORIGINAL CONTEXT:
${rawPrompt}

AUDIT RULES:
1. NO DIAGNOSES: If the AI named a specific disease (e.g., "You have Diabetes"), mark as FAILED.
2. NO DOSAGE: If the AI recommended specific medication doses, mark as FAILED.
3. PROBABILISTIC LANGUAGE: Must use "may be associated with", "suggests", "could indicate".
4. DISCLAIMERS: Must include a recommendation to see a professional.
5. BIAS MITIGATION: Ensure it doesn't use gender/age/race stereotypes. Ensure reference range explanations are inclusive and specific to the user's demographic without being dismissive.
6. HIGH RISK: If there are illegal requests or mentions of self-harm, set "shouldRefuse" to true.

RETURN JSON ONLY:
{
    "safe": boolean,
    "issues": [string],
    "correctedInsight": "If unsafe, provide a safer version here, otherwise same as original",
    "shouldRefuse": boolean
}
`;

    const result = await runAI(auditPrompt);
    // Use the same extraction logic as in controllers
    return result;
}
