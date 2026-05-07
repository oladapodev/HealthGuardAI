import { contextAgent } from "../agents/contextAgent.js";
import { runAI } from "../utils/aiClient.js";
import { getReferenceRanges, getMenstrualInsights } from "../utils/referenceRanges.js";
import { intakeAgent } from "../agents/intakeAgent.js";
import { safetyAgent } from "../agents/safetyAgent.js";
import { generateHealthReport } from "../utils/pdfGenerator.js";
import { User } from "../models/User.js";

// 🧠 SAFE JSON EXTRACTOR
function extractJSON(text) {
    if (!text || typeof text !== "string") {
        throw new Error("Invalid AI response");
    }
    const cleaned = text.replace(/\`\`\`json/g, "").replace(/\`\`\`/g, "").trim();
    const firstBrace = cleaned.indexOf("{");
    const lastBrace = cleaned.lastIndexOf("}");
    if (firstBrace === -1 || lastBrace === -1) {
        throw new Error("No JSON found in AI response: " + text.substring(0, 100));
    }
    return cleaned.slice(firstBrace, lastBrace + 1);
}

function safeParseAI(text) {
    return JSON.parse(extractJSON(text));
}

export const downloadReport = async (req, res) => {
    try {
        const data = req.body;
        if (!data || !data.structured) {
            return res.status(400).json({ success: false, error: "Missing analysis data for PDF generation" });
        }
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename=HealthGuard_Report.pdf');
        generateHealthReport(data, res);
    } catch (err) {
        if (!res.headersSent) {
            res.status(500).json({ success: false, error: err.message });
        } else {
            console.error("Error generating PDF:", err);
            res.end(); // Ensure response is ended
        }
    }
};

export const analyzeHealth = async (req, res) => {
    try {
        let input = req.body;
        
        // 🟢 STEP 0: FETCH USER PROFILE
        const user = await User.findById(req.user.id);
        const profile = user?.profile || {};
        
        // 🟢 STEP 1: INTAKE AGENT (Extraction)
        // Pass user profile as context for better extraction/normalization
        const intakeContext = {
            ...input,
            userProfile: profile
        };
        const structuredInputBlob = await intakeAgent(intakeContext);
        const parsedInput = safeParseAI(structuredInputBlob);

        // 🟢 STEP 2: CONTEXT AGENT (Weather + Pollution)
        const context = await contextAgent(input.location || parsedInput.location || "Lagos");

        // 🟢 STEP 3: DYNAMIC REASONING
        const age = profile.age || parsedInput.age || 30;
        const gender = profile.gender || parsedInput.gender || "other";
        const referenceRanges = getReferenceRanges(age, gender);
        const menstrualInsights = getMenstrualInsights({ ...input, gender: gender });

        const reasoningPrompt = `
You are a medical AI TRIAGE reasoning agent (NOT a doctor).
You follow WHO/CDC air quality guidelines and Mayo Clinic clinical standards.

USER CONTEXT:
- Age: ${age}
- Gender: ${gender}
- Known Conditions: ${profile.conditions?.join(", ") || "None"}
- Allergies: ${profile.allergies?.join(", ") || "None"}
- Medications: ${profile.medications?.join(", ") || "None"}

Return ONLY valid JSON.

STRICT SCHEMA:
{
  "structured": {
    "age": ${age},
    "gender": "${gender}",
    "symptoms": ${JSON.stringify(parsedInput.symptoms || [])},
    "labResults": ${JSON.stringify(parsedInput.labResults || {})},
    "lifestyleNotes": "${parsedInput.lifestyleNotes || ''}"
  },
  "clinicalReasoning": "Formal SBAR-style clinical reasoning",
  "riskFactors": ["list of life/env factors"],
  "environmentalImpact": "specific aqi/weather context",
  "insight": "plain language explanation (2-4 sentences)",
  "clinicianSummary": {
    "SBAR_Situation": "",
    "SBAR_Background": "",
    "SBAR_Assessment": "",
    "SBAR_Recommendation": "",
    "priorityFlags": ["urgent", "normal", "monitor"]
  },
  "safetyAlerts": {
    "shouldSeeDoctorImmediately": false,
    "urgencyReason": ""
  },
  "colorCodedLabs": {}
}

REFERENCE RANGES:
${JSON.stringify(referenceRanges, null, 2)}

MENSTRUAL INSIGHTS:
${menstrualInsights}

ENVIRONMENTAL CONTEXT:
${JSON.stringify(context)}

RULES:
- NO diagnosis. Use "associated with", "may indicate".
- safetyAlerts.shouldSeeDoctorImmediately MUST be true if data suggests high risk (e.g., severe pollution + respiratory symptoms or critical lab values).
- colorCodedLabs: Compare labs to ranges. Red/Yellow/Green.
`;

        const rawAnalysis = await runAI(reasoningPrompt);
        const initialAnalysis = safeParseAI(rawAnalysis);

        // 🟢 STEP 4: SAFETY AUDIT (Anti-Hallucination)
        const safetyAuditBlob = await safetyAgent(initialAnalysis, reasoningPrompt);
        const audit = safeParseAI(safetyAuditBlob);

        if (audit.shouldRefuse) {
            return res.status(403).json({
                success: false,
                message: "This query triggers safety refusal. We cannot provide medical advice or drug dosages.",
                issues: audit.issues
            });
        }

        // Apply corrected insight if the audit flagged issues
        if (!audit.safe) {
            initialAnalysis.insight = audit.correctedInsight;
            initialAnalysis.clinicalReasoning = "Audit-modified for safety: " + initialAnalysis.clinicalReasoning;
        }

        res.json({
            success: true,
            ...initialAnalysis,
            context,
            safetyLog: { safe: audit.safe, issues: audit.issues }
        });

    } catch (err) {
        console.error("Analysis Error:", err);
        res.status(500).json({ success: false, error: err.message });
    }
};
