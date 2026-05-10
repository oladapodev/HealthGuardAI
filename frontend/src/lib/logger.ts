/**
 * Dev-only logger for HealthGuard AI.
 * Covers: boot, auth, api req/res/err, routing, localStorage, AI, feature flows.
 * Silent in production. Call logger.copy() to get a pasteable blob.
 */

const IS_DEV = import.meta.env.DEV

// ─── Types ────────────────────────────────────────────────────────────────────

type Level = 'info' | 'ok' | 'warn' | 'error'

interface Entry {
  seq: number
  ts: string
  ns: string     // namespace: BOOT | AUTH | API | ROUTE | STORE | HEALTH | AI | FEATURE
  level: Level
  msg: string
  data?: unknown
}

// ─── Internal state ───────────────────────────────────────────────────────────

let _seq = 0
const _log: Entry[] = []

// ─── Colours (console only) ───────────────────────────────────────────────────

const NS_STYLE: Record<string, string> = {
  BOOT:   'background:#0f766e;color:#fff;padding:1px 5px;border-radius:3px',
  AUTH:   'background:#7c3aed;color:#fff;padding:1px 5px;border-radius:3px',
  API:    'background:#1d4ed8;color:#fff;padding:1px 5px;border-radius:3px',
  ROUTE:  'background:#0369a1;color:#fff;padding:1px 5px;border-radius:3px',
  STORE:  'background:#374151;color:#fff;padding:1px 5px;border-radius:3px',
  HEALTH: 'background:#15803d;color:#fff;padding:1px 5px;border-radius:3px',
  AI:     'background:#9333ea;color:#fff;padding:1px 5px;border-radius:3px',
  FEATURE:'background:#0891b2;color:#fff;padding:1px 5px;border-radius:3px',
}

const LEVEL_STYLE: Record<Level, string> = {
  info:  'color:#94a3b8',
  ok:    'color:#22c55e',
  warn:  'color:#f59e0b',
  error: 'color:#ef4444;font-weight:bold',
}

const LEVEL_ICON: Record<Level, string> = {
  info:  'ℹ',
  ok:    '✓',
  warn:  '⚠',
  error: '✗',
}

// ─── Core emit ────────────────────────────────────────────────────────────────

function emit(ns: string, level: Level, msg: string, data?: unknown) {
  if (!IS_DEV) return

  const entry: Entry = {
    seq:   ++_seq,
    ts:    new Date().toISOString(),
    ns,
    level,
    msg,
    data,
  }
  _log.push(entry)

  const nsStyle  = NS_STYLE[ns]  ?? 'background:#475569;color:#fff;padding:1px 5px;border-radius:3px'
  const lvlStyle = LEVEL_STYLE[level]
  const icon     = LEVEL_ICON[level]

  if (data !== undefined) {
    console.groupCollapsed(
      `%c ${ns} %c ${icon} ${msg}`,
      nsStyle, lvlStyle
    )
    console.log('%c data', 'color:#94a3b8', data)
    console.groupEnd()
  } else {
    console.log(`%c ${ns} %c ${icon} ${msg}`, nsStyle, lvlStyle)
  }
}

// ─── Public API ───────────────────────────────────────────────────────────────

/** App startup sequence — call once per major init step */
export const boot = {
  step:  (msg: string, data?: unknown) => emit('BOOT', 'info',  msg, data),
  ok:    (msg: string, data?: unknown) => emit('BOOT', 'ok',    msg, data),
  warn:  (msg: string, data?: unknown) => emit('BOOT', 'warn',  msg, data),
  fail:  (msg: string, data?: unknown) => emit('BOOT', 'error', msg, data),
}

/** Auth state events */
export const auth = {
  tokenFound:    (userId: string)       => emit('AUTH', 'ok',    `token found → userId=${userId}`),
  tokenMissing:  ()                     => emit('AUTH', 'info',  'no token in localStorage'),
  tokenExpired:  ()                     => emit('AUTH', 'warn',  'token expired / rejected by server'),
  loginStart:    (email: string)        => emit('AUTH', 'info',  `login attempt → ${email}`),
  loginOk:       (email: string)        => emit('AUTH', 'ok',    `login success → ${email}`),
  loginFail:     (err: string)          => emit('AUTH', 'error', `login failed: ${err}`),
  registerStart: (email: string)        => emit('AUTH', 'info',  `register attempt → ${email}`),
  registerOk:    (email: string)        => emit('AUTH', 'ok',    `register success → ${email}`),
  registerFail:  (err: string)          => emit('AUTH', 'error', `register failed: ${err}`),
  logout:        ()                     => emit('AUTH', 'info',  'user logged out'),
  profileSaved:  (fields: string[])     => emit('AUTH', 'ok',    `profile saved → fields: ${fields.join(', ')}`),
}

/** Route navigation */
export const route = {
  push:     (to: string)             => emit('ROUTE', 'info', `→ ${to}`),
  redirect: (from: string, to: string) => emit('ROUTE', 'warn', `redirect ${from} → ${to}`),
  guard:    (path: string, reason: string) => emit('ROUTE', 'warn', `guarded ${path}: ${reason}`),
}

/** localStorage read/write/clear */
export const store = {
  set:   (key: string, summary?: string) => emit('STORE', 'info',  `set   ${key}${summary ? ` → ${summary}` : ''}`),
  get:   (key: string, found: boolean)   => emit('STORE', found ? 'ok' : 'warn', `get   ${key} → ${found ? 'found' : 'MISSING'}`),
  clear: (key: string)                   => emit('STORE', 'info',  `clear ${key}`),
}

/** Backend connectivity check */
export const health = {
  checking:    (url: string)       => emit('HEALTH', 'info',  `checking → ${url}`),
  ok:          (ms: number)        => emit('HEALTH', 'ok',    `backend reachable (${ms}ms)`),
  unreachable: (url: string, err?: string) =>
    emit('HEALTH', 'error', `backend UNREACHABLE @ ${url}${err ? `: ${err}` : ''}`),
}

/** AI/chat/agent flow events */
export const ai = {
  chatSend: (data: unknown) => emit('AI', 'info', 'chat send', data),
  chatOk: (data: unknown) => emit('AI', 'ok', 'chat response', data),
  chatFail: (err: unknown) => emit('AI', 'error', `chat failed: ${errorMessage(err)}`, err),
  analysisStart: (data: unknown) => emit('AI', 'info', 'analysis start', data),
  analysisOk: (data: unknown) => emit('AI', 'ok', 'analysis complete', data),
  analysisFail: (err: unknown) => emit('AI', 'error', `analysis failed: ${errorMessage(err)}`, err),
}

/** Feature-level UI events */
export const feature = {
  start: (name: string, data?: unknown) => emit('FEATURE', 'info', `${name} start`, data),
  ok: (name: string, data?: unknown) => emit('FEATURE', 'ok', `${name} ok`, data),
  warn: (name: string, data?: unknown) => emit('FEATURE', 'warn', `${name} warning`, data),
  fail: (name: string, err?: unknown) => emit('FEATURE', 'error', `${name} failed: ${errorMessage(err)}`, err),
}

// ─── API interceptor helpers (called from api.ts) ────────────────────────────

/** Maps in-flight requests: requestId → { method, url, startMs } */
const _pending = new Map<string, { method: string; url: string; startMs: number }>()

let _reqCounter = 0

/** Call from axios request interceptor. Returns a requestId to pass in metadata. */
export function apiRequestStart(
  method: string,
  url: string,
  body?: unknown,
  hasAuth?: boolean,
): string {
  const id = `req_${++_reqCounter}`
  _pending.set(id, { method: method.toUpperCase(), url, startMs: Date.now() })

  const authTag = hasAuth ? '[auth]' : '[no-auth]'
  const bodySummary = body ? sanitiseBody(body) : undefined

  emit(
    'API',
    'info',
    `→ ${method.toUpperCase()} ${url} ${authTag}`,
    bodySummary,
  )

  return id
}

/** Call from axios response interceptor */
export function apiResponseOk(requestId: string, status: number, data?: unknown) {
  const req = _pending.get(requestId)
  const ms  = req ? Date.now() - req.startMs : '?'
  _pending.delete(requestId)

  emit(
    'API',
    'ok',
    `← ${status} ${req?.method ?? ''} ${req?.url ?? ''} (${ms}ms)`,
    summariseResponse(data),
  )
}

/** Call from axios error interceptor */
export function apiResponseErr(requestId: string, status: number | string, errBody?: unknown) {
  const req = _pending.get(requestId)
  const ms  = req ? Date.now() - req.startMs : '?'
  _pending.delete(requestId)

  emit(
    'API',
    'error',
    `✗ ${status} ${req?.method ?? ''} ${req?.url ?? ''} (${ms}ms)`,
    errBody,
  )
}

/** Call when network error (no status) */
export function apiNetworkError(requestId: string, message: string) {
  const req = _pending.get(requestId)
  _pending.delete(requestId)
  emit(
    'API',
    'error',
    `✗ NETWORK ERROR ${req?.method ?? ''} ${req?.url ?? ''}: ${message}`,
  )
}

// ─── Copy / dump helpers ──────────────────────────────────────────────────────

/** Copy the full log as plain text. Paste into GitHub issue / DM. */
export function copyLog(): void {
  if (!IS_DEV) return
  const lines = _log.map(e =>
    `[${e.ts}] [${e.ns.padEnd(6)}] [${e.level.toUpperCase().padEnd(5)}] ${e.msg}` +
    (e.data !== undefined ? `\n  data: ${JSON.stringify(e.data, null, 2)}` : ''),
  )
  const text = `=== HealthGuard AI Dev Log (${lines.length} entries) ===\n\n` + lines.join('\n')
  navigator.clipboard.writeText(text).then(
    ()  => console.log('%c 📋 Log copied to clipboard', 'color:#22c55e'),
    (e) => console.error('clipboard write failed', e),
  )
}

/** console.table the full log history */
export function dumpLog(): void {
  if (!IS_DEV) return
  console.table(
    _log.map(e => ({
      '#':     e.seq,
      time:    e.ts.slice(11, 23),
      ns:      e.ns,
      level:   e.level,
      message: e.msg,
    })),
  )
}

/** Expose on window for console access: window.__hg.copy() / window.__hg.dump() */
export function mountDevTools(): void {
  if (!IS_DEV) return
  // @ts-expect-error dev-only global
  window.__hg = { copy: copyLog, dump: dumpLog, log: _log }
  console.log(
    '%c HealthGuard AI DevTools ready%c  →  window.__hg.copy() / window.__hg.dump()',
    'background:#0f766e;color:#fff;padding:2px 8px;border-radius:4px;font-weight:bold',
    'color:#94a3b8',
  )
}

// ─── Sanitisers ───────────────────────────────────────────────────────────────

const MASKED = ['password', 'token', 'secret', 'authorization']

function sanitiseBody(body: unknown): unknown {
  if (typeof body !== 'object' || body === null) return body
  const out: Record<string, unknown> = {}
  for (const [k, v] of Object.entries(body as Record<string, unknown>)) {
    out[k] = MASKED.some(m => k.toLowerCase().includes(m)) ? '***' : v
  }
  return out
}

function summariseResponse(data: unknown): unknown {
  if (data === undefined || data === null) return data
  if (typeof data !== 'object') return data
  const keys = Object.keys(data as object)
  // For analysis responses, summarise the big fields
  const summary: Record<string, unknown> = {}
  for (const k of keys) {
    const v = (data as Record<string, unknown>)[k]
    if (typeof v === 'string' && v.length > 120) {
      summary[k] = v.slice(0, 80) + `... [+${v.length - 80}]`
    } else if (Array.isArray(v)) {
      summary[k] = `Array(${v.length})`
    } else {
      summary[k] = v
    }
  }
  return summary
}

export function errorMessage(err: unknown): string {
  if (!err) return 'Something went wrong'
  if (err instanceof Error) return err.message
  if (typeof err === 'string') return err
  if (typeof err === 'object') {
    const obj = err as Record<string, unknown>
    const body = obj.body as Record<string, unknown> | undefined
    const message = obj.message ?? body?.message ?? body?.error ?? obj.error
    if (typeof message === 'string') return message
  }
  return 'Something went wrong'
}
