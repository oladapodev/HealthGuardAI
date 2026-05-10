# HealthGuard AI Backend PRD Coverage

This document maps `PRD.md` requirements to backend behavior.

## Covered Backend Features

- User profile and onboarding: `/api/v1/auth/register`, `/api/v1/profile`; stores age, gender, blood group, height, weight, conditions, allergies, medications, location, and optional menstrual-cycle context in `User.profile`.
- Gender-specific and age-aware handling: `getReferenceRanges`, `getMenstrualInsights`, profile DTOs, and analysis orchestration apply age/gender/cycle context without requiring intimate-health fields unless provided.
- Lab analyzer: `/api/v1/labs/upload` extracts PDF/image text and parsed markers; `/api/v1/analyses` supports uploaded files and manual lab values; lab outputs include Green/Yellow/Red status.
- Daily quick check-in: `/api/v1/checkins` stores mood, notes, symptoms, food tags, sleep, exercise, voice text metadata, and timestamps in `DailyCheckin`.
- Environmental and pollution context: `ContextAgent` adds weather, humidity, AQI, PM2.5, PM10, NO2, O3, CO, and SO2 where OpenWeather provides them.
- Multi-agent reasoning: `createAnalysis` runs Intake, Context, Insight, Note, and Safety agents with explicit `agentTrace`; it degrades to deterministic fallback behavior if external AI is unavailable.
- Doctor note and clinical bridge: analyses persist patient summary, clinician SBAR, priority flags, risk factors, safety alerts, and PDF report generation through `/api/v1/analyses/:id/report`.
- Safety, ethics, and bias mitigation: prompts and fallback text avoid diagnosis/prescription language, include disclaimers, use demographic ranges, and flag urgent symptoms/lab patterns.
- Conversational chat mode: `/api/v1/chat/sessions` and `/api/v1/chat/sessions/:id/messages` persist conversation state, ask follow-up questions, and only run full analysis when requested through `runAnalysis` or `intent`.
- Swagger and DTOs: `/api/docs` documents all v1 endpoints; DTOs validate auth, profile, check-ins, chat, lab upload metadata, list query limits, UUID params, and analysis payloads.

## Backend Boundaries

- Clean inclusive UX, large buttons, and accessibility are frontend responsibilities.
- Pollen is not directly available from the current OpenWeather integration; the backend stores environmental metadata and can add a pollen provider later without changing the analysis contract.
- Clinical source citations are represented in prompt framing and disclaimers; a future source registry can make them fully machine-readable per insight.
