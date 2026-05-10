import type { AnalysisResponse } from "./types"

export function formatDate(iso?: string): string {
  if (!iso) return ""
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export function riskBadge(a: AnalysisResponse): string {
  const labs = a.colorCodedLabs as Record<string, { status?: string }> | undefined
  const alerts = Object.keys(a.safetyAlerts ?? {})
  if (alerts.length) return "border-red-300 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  if (!labs) return "border-green-300 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
  const vals = Object.values(labs)
  if (vals.some(v => v.status === "red" || v.status === "urgent"))
    return "border-red-300 text-red-700 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  if (vals.some(v => v.status === "yellow" || v.status === "amber" || v.status === "monitor"))
    return "border-amber-300 text-amber-700 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
  return "border-green-300 text-green-700 bg-green-50 dark:bg-green-900/20 dark:text-green-400"
}

export function statusColor(status?: string): string {
  if (status === "red" || status === "urgent")    return "text-red-600 bg-red-50 border-red-200 dark:bg-red-900/20 dark:text-red-400"
  if (status === "yellow" || status === "amber" || status === "monitor")
    return "text-amber-600 bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:text-amber-400"
  return "text-green-600 bg-green-50 border-green-200 dark:bg-green-900/20 dark:text-green-400"
}

export function aqiLabel(aqi?: number | null): string {
  if (!aqi) return "Unknown"
  if (aqi <= 50)  return "Good"
  if (aqi <= 100) return "Moderate"
  if (aqi <= 150) return "Unhealthy for sensitive"
  if (aqi <= 200) return "Unhealthy"
  if (aqi <= 300) return "Very unhealthy"
  return "Hazardous"
}

export function aqiColor(aqi?: number | null): string {
  if (!aqi) return "text-muted-foreground"
  if (aqi <= 50)  return "text-green-600"
  if (aqi <= 100) return "text-yellow-600"
  if (aqi <= 150) return "text-orange-600"
  return "text-red-600"
}
