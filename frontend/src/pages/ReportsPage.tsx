import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDate, riskBadge } from "@/lib/ui-helpers"
import type { AnalysisResponse } from "@/lib/types"

export default function ReportsPage() {
  const navigate = useNavigate()
  const { data, isPending } = tsr.analyses.list.useQuery({
    queryKey: ["analyses", "list", { limit: 20 }],
    queryData: { query: { limit: 20 } },
  })
  const analyses: AnalysisResponse[] = data?.body?.data ?? []

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 pt-2"
    >
      <h1 className="font-heading text-xl font-bold">Reports</h1>

      {isPending && [0,1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}

      {!isPending && !analyses.length && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-2">
          <p className="text-sm text-muted-foreground">No reports yet.</p>
          <button onClick={() => navigate("/upload")} className="text-sm text-primary">Upload a lab result</button>
        </div>
      )}

      {!isPending && analyses.map((a: AnalysisResponse) => (
        <button key={a.id} onClick={() => navigate(`/results/${a.id}`)}
          className="w-full rounded-xl border border-border bg-card p-4 text-left hover:bg-accent transition-colors space-y-2">
          <div className="flex items-start justify-between gap-2">
            <p className="text-sm font-medium truncate flex-1">
              {a.labUpload?.fileName ?? "Manual entry"}
            </p>
            <Badge variant="outline" className={`text-xs shrink-0 ${riskBadge(a)}`}>
              {overallStatus(a)}
            </Badge>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {topFlags(a).map(f => (
              <span key={f.name} className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${flagColor(f.status)}`}>
                {f.name}
              </span>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
        </button>
      ))}
    </motion.div>
  )
}

function overallStatus(a: AnalysisResponse) {
  const alerts = Object.keys(a.safetyAlerts ?? {})
  if (alerts.length) return "Urgent"
  const labs = a.colorCodedLabs as Record<string, { status?: string }> | undefined
  if (!labs) return "Normal"
  const vals = Object.values(labs)
  if (vals.some(v => v.status === "red" || v.status === "urgent")) return "Urgent"
  if (vals.some(v => ["yellow","amber","monitor"].includes(v.status ?? ""))) return "Monitor"
  return "Normal"
}

function topFlags(a: AnalysisResponse) {
  const labs = a.colorCodedLabs as Record<string, { status?: string }> | undefined
  if (!labs) return []
  return Object.entries(labs)
    .filter(([, v]) => v.status && v.status !== "green" && v.status !== "normal")
    .slice(0, 4)
    .map(([name, v]) => ({ name, status: v.status }))
}

function flagColor(status?: string): string {
  if (status === "red" || status === "urgent")
    return "border-red-200 text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400"
  return "border-amber-200 text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400"
}
