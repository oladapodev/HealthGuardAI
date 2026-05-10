type LabValueObject = {
  value?: unknown
  unit?: unknown
}

export type LabDisplay = {
  status?: string
  valueText: string
  numericValue?: number
  unit?: string
  insight?: string
  message?: string
  meaning?: string
  context?: string
  questions?: string
  range?: { min?: number; max?: number; label?: string }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null
}

function nestedValue(value: unknown): LabValueObject {
  if (isRecord(value) && ("value" in value || "unit" in value)) return value
  return { value }
}

export function normalizeLabDisplay(raw: unknown): LabDisplay {
  const lab = isRecord(raw) ? raw : { value: raw }
  const valueObj = nestedValue(lab.value)
  const rawValue = valueObj.value ?? lab.value
  const numericValue = Number(rawValue)
  const unit = String(valueObj.unit ?? lab.unit ?? "").trim()
  const valueText = rawValue === undefined || rawValue === null || rawValue === ""
    ? ""
    : `${String(rawValue)}${unit ? ` ${unit}` : ""}`

  return {
    status: typeof lab.status === "string" ? lab.status : undefined,
    valueText,
    numericValue: Number.isFinite(numericValue) ? numericValue : undefined,
    unit,
    insight: typeof lab.insight === "string" ? lab.insight : undefined,
    message: typeof lab.message === "string" ? lab.message : undefined,
    meaning: typeof lab.meaning === "string" ? lab.meaning : undefined,
    context: typeof lab.context === "string" ? lab.context : undefined,
    questions: typeof lab.questions === "string" ? lab.questions : undefined,
    range: isRecord(lab.range) ? lab.range as LabDisplay["range"] : undefined,
  }
}

export function labStatusBucket(status?: string): "red" | "yellow" | "green" {
  const value = status?.toLowerCase()
  if (value === "red" || value === "urgent") return "red"
  if (value === "yellow" || value === "amber" || value === "monitor") return "yellow"
  return "green"
}
