import { hasGroqConfig } from "../config/ai.js";
import { randomUUID } from "crypto";
import { runAI } from "../utils/aiClient.js";
import { safeParseJSON } from "../utils/json.js";
import { Conversation, User } from "../models/index.js";
import { createAnalysis, getRecentCheckinContext, normalizeBody, normalizeList } from "./analysisService.js";
import { debug } from "../utils/debug.js";

const CHAT_DISCLAIMER =
  "I can help you organize symptoms, labs, lifestyle context, and questions for a clinician. I cannot diagnose, prescribe, or replace medical care.";

function nowIso() {
  return new Date().toISOString();
}

function toMessage(role, content, metadata = {}) {
  return { id: randomUUID(), role, content, metadata, createdAt: nowIso() };
}

function mergeState(previous = {}, body = {}) {
  const symptoms = normalizeList(body.symptoms || body.text || body.message);
  return {
    ...previous,
    location: body.location || previous.location,
    symptoms: [...new Set([...(previous.symptoms || []), ...symptoms])],
    labResults: { ...(previous.labResults || {}), ...(body.labResults || body.manualLabResults || {}) },
    lifestyleNotes: [previous.lifestyleNotes, body.lifestyleNotes, body.text, body.message]
      .filter(Boolean)
      .join("\n")
      .slice(-4000),
    menstrualCycle: body.menstrualCycle || previous.menstrualCycle,
    requestedAnalysis: Boolean(body.runAnalysis || body.intent === "full_analysis" || body.intent === "doctor_note"),
  };
}

function hasEnoughForAnalysis(state = {}) {
  return Boolean(
    state.requestedAnalysis ||
    (state.symptoms?.length >= 1 && state.location) ||
    Object.keys(state.labResults || {}).length > 0
  );
}

function fallbackConversationReply({ state, profile, recentCheckins }) {
  const missing = [];
  if (!profile.age) missing.push("your age");
  if (!profile.gender) missing.push("your gender or preference not to say");
  if (!state.location && !profile.location) missing.push("your location for weather and air quality context");
  if (!state.symptoms?.length && !Object.keys(state.labResults || {}).length) {
    missing.push("what you are feeling or the lab values you want to understand");
  }

  const readyForAnalysis = hasEnoughForAnalysis({ ...state, location: state.location || profile.location });
  const response = missing.length
    ? `To give a safer, more useful explanation, tell me ${missing.slice(0, 2).join(" and ")}. ${CHAT_DISCLAIMER}`
    : `I have enough context to prepare a patient-friendly explanation and clinician bridge note. Say "run analysis" when you want the full multi-agent pass. ${CHAT_DISCLAIMER}`;

  return {
    response,
    nextQuestions: missing.slice(0, 3).map((item) => `Can you share ${item}?`),
    readyForAnalysis,
    suggestedActions: readyForAnalysis ? ["run_analysis", "add_more_context"] : ["answer_next_question", "upload_lab"],
    capturedContext: {
      symptoms: state.symptoms || [],
      hasLabs: Object.keys(state.labResults || {}).length > 0,
      recentCheckins: recentCheckins.length,
    },
  };
}

async function aiConversationReply({ profile, state, messages, recentCheckins }) {
  if (!hasGroqConfig()) {
    debug.ai("chat fallback: missing GROQ_API_KEY", {
      readyForAnalysis: hasEnoughForAnalysis(state),
      symptomCount: state.symptoms?.length || 0,
      labCount: Object.keys(state.labResults || {}).length,
    });
    return fallbackConversationReply({ profile, state, recentCheckins });
  }

  const prompt = `
You are HealthGuard AI's conversational intake agent.
Keep the chat friendly, simple, inclusive, and safe for everyday users.
Do not diagnose, prescribe, or give medication dosing.
Your job is to keep a conversation going, gather missing context gently, and offer to run the full multi-agent analysis or doctor note only when useful.

PROFILE:
${JSON.stringify(profile)}

RECENT CHECK-INS:
${JSON.stringify(recentCheckins)}

CONVERSATION STATE:
${JSON.stringify(state)}

RECENT MESSAGES:
${JSON.stringify(messages.slice(-8))}

Return STRICT JSON ONLY:
{
  "response": "short conversational reply",
  "nextQuestions": ["0-3 gentle follow-up questions"],
  "readyForAnalysis": boolean,
  "suggestedActions": ["answer_next_question" | "upload_lab" | "run_analysis" | "generate_doctor_note" | "seek_urgent_care"],
  "capturedContext": {
    "symptoms": [],
    "lifestyleSignals": [],
    "profileGaps": [],
    "environmentNeeded": boolean,
    "labDataNeeded": boolean
  }
}
`;

  debug.ai("chat ai call start", {
    messageCount: messages.length,
    symptomCount: state.symptoms?.length || 0,
    labCount: Object.keys(state.labResults || {}).length,
    recentCheckins: recentCheckins.length,
  });
  const raw = await runAI(prompt);
  const fallback = fallbackConversationReply({ profile, state, recentCheckins });
  const parsed = safeParseJSON(raw, fallback);
  debug.ai("chat ai call complete", {
    usedFallback: parsed === fallback,
    readyForAnalysis: parsed.readyForAnalysis,
    suggestedActions: parsed.suggestedActions,
  });
  return parsed;
}

export async function createConversation({ userId, title = "Health chat" }) {
  const opening = toMessage(
    "assistant",
    `Hi. I can help you understand symptoms, lab results, lifestyle context, and what to ask a doctor. ${CHAT_DISCLAIMER}`,
    { suggestedActions: ["answer_next_question", "upload_lab"] }
  );

  const conversation = await Conversation.create({
    userId,
    title,
    messages: [opening],
    state: { symptoms: [], labResults: {}, lifestyleNotes: "" },
  });

  return conversation;
}

export async function continueConversation({ userId, conversationId, body = {} }) {
  body = normalizeBody(body);

  const user = await User.findByPk(userId);
  if (!user) {
    const error = new Error("User not found");
    error.status = 404;
    throw error;
  }

  let conversation = conversationId
    ? await Conversation.findOne({ where: { id: conversationId, userId } })
    : null;

  if (!conversation) {
    conversation = await createConversation({ userId, title: body.title || "Health chat" });
  }

  const userText = body.text || body.message || normalizeList(body.symptoms).join(", ");
  const userMessage = toMessage("user", userText, {
    location: body.location,
    intent: body.intent,
    hasLabResults: Boolean(body.labResults || body.manualLabResults),
  });

  const state = mergeState(conversation.state || {}, body);
  const profile = user.profile || {};
  const recentCheckins = await getRecentCheckinContext(userId);
  const reply = await aiConversationReply({
    profile,
    state: { ...state, location: state.location || profile.location },
    messages: [...(conversation.messages || []), userMessage],
    recentCheckins,
  });

  let analysis = null;
  const shouldRunAnalysis = Boolean(body.runAnalysis || body.intent === "full_analysis" || body.intent === "doctor_note");
  debug.ai("chat analysis decision", {
    shouldRunAnalysis,
    hasEnoughForAnalysis: hasEnoughForAnalysis({ ...state, location: state.location || profile.location }),
    labCount: Object.keys(state.labResults || {}).length,
    symptomCount: state.symptoms?.length || 0,
    location: state.location || profile.location,
  });
  if (shouldRunAnalysis && hasEnoughForAnalysis({ ...state, location: state.location || profile.location })) {
    analysis = await createAnalysis({
      userId,
      body: {
        ...state,
        location: state.location || profile.location,
        symptoms: state.symptoms,
        labResults: state.labResults,
        lifestyleNotes: state.lifestyleNotes,
        menstrualCycle: state.menstrualCycle,
      },
    });
  }

  const assistantMessage = toMessage("assistant", reply.response, {
    nextQuestions: reply.nextQuestions || [],
    suggestedActions: reply.suggestedActions || [],
    readyForAnalysis: reply.readyForAnalysis,
    analysisId: analysis?.id,
  });

  await conversation.update({
    messages: [...(conversation.messages || []), userMessage, assistantMessage],
    state: {
      ...state,
      readyForAnalysis: reply.readyForAnalysis,
      capturedContext: reply.capturedContext,
      lastAnalysisId: analysis?.id || state.lastAnalysisId,
    },
    status: analysis ? "analysis_created" : "active",
  });

  return {
    success: true,
    conversationId: conversation.id,
    message: assistantMessage.content,
    nextQuestions: reply.nextQuestions || [],
    readyForAnalysis: reply.readyForAnalysis,
    suggestedActions: reply.suggestedActions || [],
    capturedContext: reply.capturedContext,
    analysis,
    disclaimer: CHAT_DISCLAIMER,
  };
}
