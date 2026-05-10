import { hasGroqConfig } from "../config/ai.js";
import { contextAgent } from "../agents/contextAgent.js";
import { intakeAgent } from "../agents/intakeAgent.js";
import { insightAgent } from "../agents/insightAgent.js";
import { noteAgent } from "../agents/noteAgent.js";
import { safetyAgent } from "../agents/safetyAgent.js";
import { DailyCheckin, HealthAnalysis, LabUpload, User } from "../models/index.js";
import { extractTextFromFile, parseLabText } from "../utils/parser.js";
import { colorCodeLabs, getMenstrualInsights, getReferenceRanges } from "../utils/referenceRanges.js";
import { safeParseJSON } from "../utils/json.js";
import { debug } from "../utils/debug.js";

const DISCLAIMER =
  "HealthGuard AI is educational and does not diagnose, prescribe, or replace professional medical care. Review urgent or concerning symptoms with a licensed clinician.";

export function normalizeList(value) {
  if (!value) return [];
  if (Array.isArray(value)) return value.filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((item) => item.trim()).filter(Boolean);
  }
  return [];
}

export function parseMaybeJSON(value) {
  if (typeof value !== "string") return value;
  const trimmed = value.trim();
  if (!trimmed || (!trimmed.startsWith("{") && !trimmed.startsWith("["))) return value;
  try {
    return JSON.parse(trimmed);
  } catch {
    return value;
  }
}

export function normalizeBody(body = {}) {
  return Object.entries(body).reduce((acc, [key, value]) => {
    acc[key] = parseMaybeJSON(value);
    return acc;
  }, {});
}

function normalizeLabResults(...sources) {
  return sources.reduce((acc, source) => {
    if (!source || typeof source !== "object") return acc;
    for (const [key, result] of Object.entries(source)) {
      if (result && typeof result === "object" && "value" in result) {
        acc[key] = result;
      } else if (Number.isFinite(Number(result))) {
        acc[key] = { value: Number(result), unit: "" };
      }
    }
    return acc;
  }, {});
}

function fallbackIntake(input, profile, parsedLabResults) {
  const symptoms = normalizeList(input.symptoms || input.text);
  return {
    extracted_data: {
      age: Number(input.age || profile.age || 30),
      gender: input.gender || profile.gender || "other",
      location: input.location || profile.location || "Lagos",
      symptoms,
      labResults: normalizeLabResults(parsedLabResults, input.labResults, input.manualLabResults),
      lifestyleNotes: input.lifestyleNotes || input.text || "",
      menstrualCycle: input.menstrualCycle || profile.menstrualCycle || null,
    },
    analysis_summary: symptoms.length
      ? `User reported ${symptoms.slice(0, 3).join(", ")}.`
      : "User submitted health context for review.",
    next_questions: symptoms.length ? [] : ["What symptoms or concerns would you like to understand?"],
    is_complete: symptoms.length > 0 || Object.keys(parsedLabResults || {}).length > 0,
  };
}

function buildFallbackInsight({ structured, context, colorCodedLabs, menstrualInsights }) {
  const abnormalLabs = Object.entries(colorCodedLabs)
    .filter(([, value]) => value.status === "Yellow" || value.status === "Red")
    .map(([marker]) => marker);
  const respiratorySymptoms = structured.symptoms?.some((symptom) =>
    /cough|breath|wheez|chest|asthma/i.test(symptom)
  );
  const poorAir = Number(context?.aqi) >= 4 || Number(context?.pm2_5) > 35;

  return {
    patientSummary: abnormalLabs.length
      ? `Some submitted markers are outside typical reference ranges: ${abnormalLabs.join(", ")}. These findings may be associated with multiple causes and should be reviewed with a clinician. ${DISCLAIMER}`
      : `Your submitted information did not show a clear critical pattern from the available data. Continue monitoring symptoms and review persistent concerns with a clinician. ${DISCLAIMER}`,
    riskFactors: [
      ...(poorAir ? ["Reduced air quality may aggravate respiratory or cardiovascular symptoms."] : []),
      ...(menstrualInsights ? ["Optional menstrual-cycle context was considered for relevant markers."] : []),
    ],
    environmentalImpact: poorAir
      ? "Air quality is a relevant contextual stressor for respiratory symptoms."
      : "No major environmental risk signal was available from the current context.",
    keySignals: [
      ...(abnormalLabs.length ? abnormalLabs.map((marker) => `${marker} is outside the configured reference range`) : []),
      ...(respiratorySymptoms && poorAir ? ["Respiratory symptoms overlap with poorer air quality context"] : []),
    ],
    doctorQuestions: [
      "Do these lab values need repeat testing or follow-up?",
      "Are any symptoms urgent based on my medical history?",
    ],
  };
}

function buildFallbackNote({ structured, insight, context, colorCodedLabs }) {
  const abnormalLabs = Object.entries(colorCodedLabs)
    .filter(([, value]) => value.status === "Yellow" || value.status === "Red")
    .map(([marker]) => marker);

  return {
    SBAR_Situation: `Patient-facing review for ${structured.symptoms?.join(", ") || "submitted lab/context data"}.`,
    SBAR_Background: `Age ${structured.age || "unknown"}, gender ${structured.gender || "not specified"}. Environmental context: ${context?.condition || "unknown"}, AQI ${context?.aqi ?? "unavailable"}.`,
    SBAR_Assessment: abnormalLabs.length
      ? `Markers outside configured ranges: ${abnormalLabs.join(", ")}. ${insight.environmentalImpact || ""}`
      : "No abnormal lab marker was identified from parsed values; clinical correlation is still required.",
    SBAR_Recommendation: "For clinician review: correlate with history, exam, current medications, and consider repeat or confirmatory testing when appropriate.",
    priorityFlags: abnormalLabs.length ? ["monitor"] : ["normal"],
  };
}

function detectSafetyAlerts({ structured, context, colorCodedLabs }) {
  const symptomText = (structured.symptoms || []).join(" ");
  const criticalSymptom = /chest pain|shortness of breath|difficulty breathing|fainting|stroke|severe bleeding/i.test(symptomText);
  const redLabs = Object.values(colorCodedLabs).some((value) => value.status === "Red");
  const poorAirWithRespiratory =
    /cough|breath|wheez|asthma|chest/i.test(symptomText) && (Number(context?.aqi) >= 4 || Number(context?.pm2_5) > 35);

  return {
    shouldSeeDoctorImmediately: criticalSymptom || redLabs || poorAirWithRespiratory,
    urgencyReason: criticalSymptom
      ? "Potentially urgent symptom language was reported."
      : redLabs
        ? "One or more lab markers are substantially outside the configured range."
        : poorAirWithRespiratory
          ? "Respiratory symptoms overlap with poor air quality context."
          : "",
    disclaimer: DISCLAIMER,
  };
}

export async function parseAndStoreLabFile({ file, userId }) {
  if (!file) return null;

  debug.feature("lab parse start", {
    userId,
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
  });
  const extractedText = await extractTextFromFile(file.buffer, file.mimetype);
  const parsedResults = parseLabText(extractedText || "");
  debug.feature("lab parse complete", {
    userId,
    extractedChars: extractedText?.length || 0,
    parsedMarkers: Object.keys(parsedResults || {}),
  });

  return await LabUpload.create({
    userId,
    fileName: file.originalname,
    mimeType: file.mimetype,
    size: file.size,
    extractedText,
    parsedResults,
  });
}

export async function createAnalysis({ userId, body = {}, file = null }) {
  body = normalizeBody(body);

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  const profile = user.profile || {};
  const labUpload = await parseAndStoreLabFile({ file, userId });
  const parsedLabResults = labUpload?.parsedResults || {};
  const agentTrace = [];

  let intake = fallbackIntake(body, profile, parsedLabResults);
  debug.ai("analysis start", {
    userId,
    hasGroqConfig: hasGroqConfig(),
    bodyKeys: Object.keys(body || {}),
    parsedLabCount: Object.keys(parsedLabResults || {}).length,
  });
  if (hasGroqConfig()) {
    debug.ai("agent start", { agent: "IntakeAgent" });
    const intakeRaw = await intakeAgent({ ...body, parsedLabResults, userProfile: profile });
    intake = safeParseJSON(intakeRaw, intake);
    agentTrace.push({ agent: "IntakeAgent", status: "completed" });
    debug.ai("agent complete", { agent: "IntakeAgent" });
  } else {
    agentTrace.push({ agent: "IntakeAgent", status: "fallback" });
  }

  const extracted = intake.extracted_data || intake.structured || intake;
  const structured = {
    age: Number(extracted.age || body.age || profile.age || 30),
    gender: extracted.gender || body.gender || profile.gender || "other",
    location: extracted.location || body.location || profile.location || "Lagos",
    symptoms: normalizeList(extracted.symptoms || body.symptoms || body.text),
    labResults: normalizeLabResults(parsedLabResults, extracted.labResults, body.labResults, body.manualLabResults),
    lifestyleNotes: extracted.lifestyleNotes || body.lifestyleNotes || body.text || "",
    menstrualCycle: extracted.menstrualCycle || body.menstrualCycle || profile.menstrualCycle || null,
  };

  const context = await contextAgent(structured.location);
  agentTrace.push({ agent: "ContextAgent", status: context.error ? "degraded" : "completed" });
  debug.ai("agent complete", {
    agent: "ContextAgent",
    status: context.error ? "degraded" : "completed",
    location: structured.location,
    error: context.error,
  });

  const ranges = getReferenceRanges(structured.age, structured.gender);
  const menstrualInsights = getMenstrualInsights(structured);
  const colorCodedLabs = colorCodeLabs(structured.labResults, ranges);

  let insight = buildFallbackInsight({ structured, context, colorCodedLabs, menstrualInsights });
  if (hasGroqConfig()) {
    debug.ai("agent start", { agent: "InsightAgent" });
    const rawInsight = await insightAgent({ structured: { ...structured, referenceRanges: ranges, menstrualInsights }, context });
    insight = safeParseJSON(rawInsight, insight);
    agentTrace.push({ agent: "InsightAgent", status: "completed" });
    debug.ai("agent complete", { agent: "InsightAgent" });
  } else {
    agentTrace.push({ agent: "InsightAgent", status: "fallback" });
  }

  let clinicianSummary = buildFallbackNote({ structured, insight, context, colorCodedLabs });
  if (hasGroqConfig()) {
    debug.ai("agent start", { agent: "NoteAgent" });
    const rawNote = await noteAgent({ structured, insight: insight.patientSummary || insight.insight || JSON.stringify(insight), context });
    clinicianSummary = safeParseJSON(rawNote, clinicianSummary);
    agentTrace.push({ agent: "NoteAgent", status: "completed" });
    debug.ai("agent complete", { agent: "NoteAgent" });
  } else {
    agentTrace.push({ agent: "NoteAgent", status: "fallback" });
  }

  const safetyAlerts = detectSafetyAlerts({ structured, context, colorCodedLabs });
  let safetyLog = { safe: true, issues: [], correctedInsight: "", shouldRefuse: false };
  if (hasGroqConfig()) {
    debug.ai("agent start", { agent: "SafetyAgent" });
    const rawAudit = await safetyAgent({ insight, clinicianSummary, safetyAlerts }, JSON.stringify({ structured, context }));
    safetyLog = safeParseJSON(rawAudit, safetyLog);
    agentTrace.push({ agent: "SafetyAgent", status: "completed" });
    debug.ai("agent complete", { agent: "SafetyAgent", safe: safetyLog.safe, shouldRefuse: safetyLog.shouldRefuse });
  } else {
    agentTrace.push({ agent: "SafetyAgent", status: "fallback" });
  }

  if (safetyLog.shouldRefuse) {
    const error = new Error("This request cannot be safely answered by HealthGuard AI.");
    error.status = 403;
    error.details = safetyLog.issues;
    throw error;
  }

  const patientSummary = safetyLog.safe === false && safetyLog.correctedInsight
    ? safetyLog.correctedInsight
    : insight.patientSummary || insight.insight || "";

  const analysis = await HealthAnalysis.create({
    userId,
    labUploadId: labUpload?.id || null,
    input: body,
    structured,
    context,
    patientSummary,
    clinicianSummary,
    colorCodedLabs,
    safetyAlerts,
    riskFactors: insight.riskFactors || [],
    nextQuestions: intake.next_questions || insight.doctorQuestions || [],
    agentTrace,
    status: "completed",
  });
  debug.ai("analysis stored", {
    id: analysis.id,
    userId,
    agentTrace,
    labCount: Object.keys(colorCodedLabs || {}).length,
    safetyImmediate: safetyAlerts.shouldSeeDoctorImmediately,
  });

  return formatAnalysis(analysis, { labUpload, safetyLog });
}

export function formatAnalysis(analysis, extras = {}) {
  return {
    success: true,
    id: analysis.id,
    structured: analysis.structured,
    context: analysis.context,
    insight: analysis.patientSummary,
    patientSummary: analysis.patientSummary,
    clinicianSummary: analysis.clinicianSummary,
    colorCodedLabs: analysis.colorCodedLabs,
    safetyAlerts: analysis.safetyAlerts,
    riskFactors: analysis.riskFactors,
    nextQuestions: analysis.nextQuestions,
    agentTrace: analysis.agentTrace,
    labUpload: extras.labUpload
      ? {
          id: extras.labUpload.id,
          fileName: extras.labUpload.fileName,
          mimeType: extras.labUpload.mimeType,
          size: extras.labUpload.size,
          parsedResults: extras.labUpload.parsedResults,
          extractedTextPreview: extras.labUpload.extractedText?.slice(0, 500) || "",
        }
      : undefined,
    safetyLog: extras.safetyLog,
    createdAt: analysis.createdAt,
  };
}

export async function getRecentCheckinContext(userId) {
  return await DailyCheckin.findAll({
    where: { userId },
    order: [["createdAt", "DESC"]],
    limit: 5,
  });
}
