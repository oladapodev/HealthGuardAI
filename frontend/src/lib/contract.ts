import { initContract } from "@ts-rest/core"
import type {
  RegisterRequest,
  LoginRequest,
  AuthResponse,
  ErrorResponse,
  ProfileRequest,
  ProfileResponse,
  CheckinRequest,
  CheckinListResponse,
  Checkin,
  LabUploadResponse,
  LabListResponse,
  AnalysisRequest,
  AnalysisResponse,
  AnalysisListResponse,
  ChatRequest,
  ChatResponse,
  SessionListResponse,
  SessionResponse,
  CreateSessionRequest,
} from "./types"

const c = initContract()

export const contract = c.router(
  {
    // ── Auth ───────────────────────────────────────────────────────────────────
    auth: c.router({
      register: {
        method: "POST",
        path: "/api/v1/auth/register",
        body: c.type<RegisterRequest>(),
        responses: {
          201: c.type<AuthResponse>(),
          400: c.type<ErrorResponse>(),
        },
        summary: "Register a new user",
      },
      login: {
        method: "POST",
        path: "/api/v1/auth/login",
        body: c.type<LoginRequest>(),
        responses: {
          200: c.type<AuthResponse>(),
          400: c.type<ErrorResponse>(),
        },
        summary: "Login user",
      },
    }),

    // ── Profile ────────────────────────────────────────────────────────────────
    profile: c.router({
      get: {
        method: "GET",
        path: "/api/v1/profile",
        responses: {
          200: c.type<ProfileResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Get current user profile",
      },
      update: {
        method: "PUT",
        path: "/api/v1/profile",
        body: c.type<ProfileRequest>(),
        responses: {
          200: c.type<ProfileResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Update current user profile",
      },
    }),

    // ── Check-ins ─────────────────────────────────────────────────────────────
    checkins: c.router({
      list: {
        method: "GET",
        path: "/api/v1/checkins",
        query: c.type<{ limit?: number }>(),
        responses: {
          200: c.type<CheckinListResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "List daily check-ins",
      },
      create: {
        method: "POST",
        path: "/api/v1/checkins",
        body: c.type<CheckinRequest>(),
        responses: {
          201: c.type<{ success: boolean; checkin: Checkin }>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Create a daily check-in",
      },
    }),

    // ── Labs ───────────────────────────────────────────────────────────────────
    labs: c.router({
      list: {
        method: "GET",
        path: "/api/v1/labs",
        query: c.type<{ limit?: number }>(),
        responses: {
          200: c.type<LabListResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "List lab uploads",
      },
      upload: {
        method: "POST",
        path: "/api/v1/labs/upload",
        contentType: "multipart/form-data",
        body: c.type<{ file: File; metadata?: string }>(),
        responses: {
          201: c.type<LabUploadResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Upload and parse a lab PDF/image",
      },
    }),

    // ── Analyses ──────────────────────────────────────────────────────────────
    analyses: c.router({
      list: {
        method: "GET",
        path: "/api/v1/analyses",
        query: c.type<{ limit?: number }>(),
        responses: {
          200: c.type<AnalysisListResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "List analyses",
      },
      run: {
        method: "POST",
        path: "/api/v1/analyses",
        body: c.type<AnalysisRequest>(),
        responses: {
          201: c.type<AnalysisResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
          403: c.type<ErrorResponse>(),
        },
        summary: "Run full multi-agent analysis (JSON / manual entry)",
      },
      runWithFile: {
        method: "POST",
        path: "/api/v1/analyses",
        contentType: "multipart/form-data",
        body: c.type<{
          file: File
          text?: string
          location?: string
          labResults?: string // JSON string when multipart
        }>(),
        responses: {
          201: c.type<AnalysisResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
          403: c.type<ErrorResponse>(),
        },
        summary: "Run full multi-agent analysis (file upload)",
      },
      getById: {
        method: "GET",
        path: "/api/v1/analyses/:id",
        pathParams: c.type<{ id: string }>(),
        responses: {
          200: c.type<AnalysisResponse>(),
          401: c.type<ErrorResponse>(),
          404: c.type<ErrorResponse>(),
        },
        summary: "Get one analysis by id",
      },
    }),

    // ── Chat ──────────────────────────────────────────────────────────────────
    chat: c.router({
      send: {
        method: "POST",
        path: "/api/v1/chat",
        body: c.type<ChatRequest>(),
        responses: {
          201: c.type<ChatResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Conversational health entry point",
      },
      listSessions: {
        method: "GET",
        path: "/api/v1/chat/sessions",
        query: c.type<{ limit?: number }>(),
        responses: {
          200: c.type<SessionListResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "List chat sessions",
      },
      createSession: {
        method: "POST",
        path: "/api/v1/chat/sessions",
        body: c.type<CreateSessionRequest>(),
        responses: {
          201: c.type<SessionResponse>(),
          401: c.type<ErrorResponse>(),
        },
        summary: "Create a chat session",
      },
      getSession: {
        method: "GET",
        path: "/api/v1/chat/sessions/:id",
        pathParams: c.type<{ id: string }>(),
        responses: {
          200: c.type<SessionResponse>(),
          401: c.type<ErrorResponse>(),
          404: c.type<ErrorResponse>(),
        },
        summary: "Get a chat session",
      },
      sendMessage: {
        method: "POST",
        path: "/api/v1/chat/sessions/:id/messages",
        pathParams: c.type<{ id: string }>(),
        body: c.type<ChatRequest>(),
        responses: {
          201: c.type<ChatResponse>(),
          400: c.type<ErrorResponse>(),
          401: c.type<ErrorResponse>(),
          404: c.type<ErrorResponse>(),
        },
        summary: "Continue a chat session",
      },
    }),
  },
  { strictStatusCodes: true },
)

export type Contract = typeof contract
