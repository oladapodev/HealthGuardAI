/**
 * Custom ts-rest fetcher for HealthGuard AI.
 * - Attaches JWT from localStorage automatically
 * - Routes all requests and responses through the dev logger
 * - Handles JSON, multipart/form-data, and PDF blob responses
 */

import type { ApiFetcherArgs } from "@ts-rest/core"
import {
  apiRequestStart,
  apiResponseOk,
  apiResponseErr,
  apiNetworkError,
  store,
} from "./logger"

const BASE_URL = import.meta.env.VITE_API_URL ?? ""

function apiUrl(path: string): string {
  return /^https?:\/\//i.test(path) ? path : `${BASE_URL}${path}`
}

export async function healthGuardFetcher(
  args: ApiFetcherArgs,
): Promise<{ status: number; body: unknown; headers: Headers }> {
  const { path, method, headers: routeHeaders, body, contentType } = args

  // ── JWT attachment ─────────────────────────────────────────────────────────
  const token = localStorage.getItem("token")
  store.get("token", !!token)

  const authHeader: Record<string, string> = token
    ? { Authorization: `Bearer ${token}` }
    : {}

  // ── Decide how to serialise the body ───────────────────────────────────────
  const isMultipart =
    contentType === "multipart/form-data" || body instanceof FormData

  const reqHeaders: Record<string, string> = {
    ...authHeader,
    ...(routeHeaders as Record<string, string>),
  }
  if (!isMultipart) {
    reqHeaders["Content-Type"] = "application/json"
  }

  let fetchBody: BodyInit | undefined
  if (body instanceof FormData) {
    fetchBody = body
  } else if (typeof body === "string") {
    fetchBody = body
  } else if (body !== undefined && body !== null) {
    fetchBody = JSON.stringify(body)
  }

  // ── Logger: outgoing ───────────────────────────────────────────────────────
  const logBody = isMultipart ? "(FormData — not logged)" : body
  const url = apiUrl(path)
  const reqId = apiRequestStart(method, url, logBody, !!token)

  // ── Fetch ──────────────────────────────────────────────────────────────────
  let response: Response
  try {
    response = await fetch(url, {
      method,
      headers: reqHeaders,
      body: fetchBody,
    })
  } catch (err) {
    // Network failure (backend down, CORS, DNS, etc.)
    apiNetworkError(reqId, err instanceof Error ? err.message : String(err))
    throw err
  }

  // ── Parse response ─────────────────────────────────────────────────────────
  const respContentType = response.headers.get("content-type") ?? ""
  let responseBody: unknown

  if (respContentType.includes("application/pdf")) {
    responseBody = await response.blob()
  } else if (respContentType.includes("application/json")) {
    responseBody = await response.json()
  } else {
    // Fallback: try JSON, then text
    const text = await response.text()
    try {
      responseBody = JSON.parse(text)
    } catch {
      responseBody = text
    }
  }

  // ── Logger: response ───────────────────────────────────────────────────────
  if (response.ok) {
    apiResponseOk(reqId, response.status, responseBody)
  } else {
    apiResponseErr(reqId, response.status, responseBody)
  }

  return {
    status: response.status,
    body: responseBody,
    headers: response.headers,
  }
}

/**
 * Download the PDF report for an analysis.
 * Outside ts-rest because the response is a binary blob, not JSON.
 */
export async function downloadAnalysisReport(id: string): Promise<Blob> {
  const token = localStorage.getItem("token")
  store.get("token", !!token)

  const url = `${BASE_URL}/api/v1/analyses/${id}/report`
  const reqId = apiRequestStart("POST", url, undefined, !!token)

  const response = await fetch(url, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!response.ok) {
    let errBody: unknown
    try {
      errBody = await response.json()
    } catch {
      errBody = { message: "Failed to generate report" }
    }
    apiResponseErr(reqId, response.status, errBody)
    const msg =
      (errBody as { message?: string })?.message ?? "Report generation failed"
    throw new Error(msg)
  }

  const blob = await response.blob()
  apiResponseOk(reqId, response.status, {
    type: blob.type,
    sizeBytes: blob.size,
  })
  return blob
}
