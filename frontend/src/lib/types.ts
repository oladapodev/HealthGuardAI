// TypeScript types derived from openapi.json — single source of truth for frontend.

// ─── Shared ────────────────────────────────────────────────────────────────────

export type ErrorResponse = {
  success: false
  message?: string
  error?: string
  errors?: { field: string; message: string; value?: unknown }[]
}

// ─── Profile / User ────────────────────────────────────────────────────────────

export type MenstrualCycle = {
  lastPeriod?: string   // ISO date e.g. "2026-05-01"
  cycleLength?: number
  symptoms?: string[]
}

export type Profile = {
  firstName?: string
  lastName?: string
  age?: number
  gender?: 'male' | 'female' | 'other' | 'prefer_not_to_say'
  bloodGroup?: string
  height?: number
  weight?: number
  location?: string
  conditions?: string[]
  allergies?: string[]
  medications?: string[]
  menstrualCycle?: MenstrualCycle
  [key: string]: unknown   // additionalProperties:true
}

export type User = {
  id: string
  email: string
  profile: Profile
  createdAt?: string
  updatedAt?: string
}

// ─── Auth ──────────────────────────────────────────────────────────────────────

export type RegisterRequest = {
  email: string
  password: string
  profile?: Profile
}

export type LoginRequest = {
  email: string
  password: string
}

export type AuthResponse = {
  success: boolean
  token: string
  user: User
}

export type ProfileRequest = { profile: Profile }

export type ProfileResponse = { success: boolean; user: User }

// ─── Check-in ─────────────────────────────────────────────────────────────────

export type CheckinLog = {
  mood?: string
  notes?: string
  symptoms?: string[]
  foodTags?: string[]
  sleep?: { hours?: number; [k: string]: unknown }
  exercise?: { minutes?: number; [k: string]: unknown }
  source?: string
  voiceText?: string | null
}

export type CheckinRequest = { log: CheckinLog }

export type Checkin = CheckinLog & {
  id: string
  userId: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export type CheckinListResponse = {
  success: boolean
  data: Checkin[]
  total?: number
}

// ─── Labs ──────────────────────────────────────────────────────────────────────

export type LabValue = {
  value: number
  unit: string
  sourceLine?: string
}

export type LabResults = Record<string, LabValue>

export type LabUpload = {
  id: string
  fileName: string
  mimeType: string
  size: number
  parsedResults?: LabResults
  extractedTextPreview?: string
}

export type LabUploadResponse = { success: boolean; labUpload: LabUpload }

export type LabListResponse = { success: boolean; data: LabUpload[] }

// ─── Analysis ─────────────────────────────────────────────────────────────────

export type AnalysisRequest = {
  location?: string
  text?: string
  message?: string
  symptoms?: string | string[]
  age?: number
  gender?: string
  labResults?: LabResults
  manualLabResults?: LabResults
  menstrualCycle?: MenstrualCycle
}

export type Context = {
  temperature?: number | null
  humidity?: number | null
  condition?: string
  aqi?: number | null
  pm2_5?: number | null
  pm10?: number | null
  no2?: number | null
  o3?: number | null
  location?: string
}

export type ClinicianSummary = {
  SBAR_Situation?: string
  SBAR_Background?: string
  SBAR_Assessment?: string
  SBAR_Recommendation?: string
  priorityFlags?: ('normal' | 'monitor' | 'urgent')[]
}

export type AnalysisResponse = {
  success: boolean
  id: string
  structured?: AnalysisRequest
  context?: Context
  insight?: string
  patientSummary?: string
  clinicianSummary?: ClinicianSummary
  colorCodedLabs?: Record<string, unknown>
  safetyAlerts?: Record<string, unknown>
  riskFactors?: string[]
  nextQuestions?: string[]
  agentTrace?: Record<string, unknown>[]
  labUpload?: LabUpload
  createdAt?: string
}

export type AnalysisListResponse = { success: boolean; data: AnalysisResponse[] }

// ─── Chat ──────────────────────────────────────────────────────────────────────

export type ChatRequest = {
  conversationId?: string
  title?: string
  text?: string
  message?: string
  symptoms?: string | string[]
  location?: string
  intent?: 'chat' | 'full_analysis' | 'doctor_note'
  runAnalysis?: boolean
  labResults?: LabResults
  manualLabResults?: LabResults
  menstrualCycle?: MenstrualCycle
}

export type ChatMessage = {
  id: string
  role: 'user' | 'assistant'
  content: string
  metadata?: Record<string, unknown>
  createdAt: string
}

export type Conversation = {
  id: string
  userId: string
  title?: string
  status?: string
  messages?: ChatMessage[]
  state?: Record<string, unknown>
  createdAt: string
  updatedAt: string
}

export type ChatResponse = {
  success: boolean
  conversationId: string
  message: string
  nextQuestions?: string[]
  readyForAnalysis?: boolean
  suggestedActions?: string[]
  capturedContext?: Record<string, unknown>
  analysis?: AnalysisResponse
  disclaimer?: string
}

export type SessionListResponse = { success: boolean; data: Conversation[] }

export type SessionResponse = { success: boolean; conversation: Conversation }

export type CreateSessionRequest = { title?: string }
