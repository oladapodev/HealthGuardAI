import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  UploadIcon, ClipboardTextIcon, ChatTeardropTextIcon, ChartBarIcon,
  WindIcon, ArrowRightIcon,
} from "@phosphor-icons/react"
import { tsr } from "@/lib/query"
import { useAuth } from "@/context/AuthContext"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { formatDate, riskBadge } from "@/lib/ui-helpers"

export default function DashboardPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const analyses = tsr.analyses.list.useQuery({
    queryKey: ["analyses", "list", { limit: 5 }],
    queryData: { query: { limit: 5 } },
  })
  const checkins  = tsr.checkins.list.useQuery({
    queryKey: ["checkins", "list", { limit: 1 }],
    queryData: { query: { limit: 1 } },
  })

  const analysisRows: AnalysisResponse[] = analyses.data?.body?.data ?? []
  const latest    = analysisRows[0]
  const lastCheck = checkins.data?.body?.data?.[0]
  const firstName = user?.profile?.firstName ?? user?.email?.split("@")[0] ?? "there"

  const QUICK = [
    { label: "Upload lab",   Icon: UploadIcon,             to: "/upload",   color: "bg-primary/10 text-primary" },
    { label: "Check-in",     Icon: ClipboardTextIcon,      to: "/checkin",  color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" },
    { label: "Chat",         Icon: ChatTeardropTextIcon,   to: "/chat",     color: "bg-violet-100 text-violet-700 dark:bg-violet-900/30 dark:text-violet-400" },
    { label: "Trends",       Icon: ChartBarIcon,           to: "/trends",   color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pt-2"
    >
      {/* Greeting */}
      <div>
        <h1 className="font-heading text-xl font-bold">Hi, {firstName}</h1>
        <p className="text-sm text-muted-foreground">Educational only. For clinician review.</p>
      </div>

      {/* Health summary card */}
      <div className="rounded-xl border border-border bg-card p-4 space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Health summary</span>
          {analyses.isPending
            ? <Skeleton className="h-5 w-16 rounded-full" />
            : latest
              ? <Badge variant="outline" className={riskBadge(latest)}>
                  {overallStatus(latest)}
                </Badge>
              : <span className="text-xs text-muted-foreground">No data yet</span>
          }
        </div>
        <div className="flex flex-wrap gap-2">
          <StatusChip label="Labs"     value={latest ? overallStatus(latest) : "—"} isPending={analyses.isPending} />
          <StatusChip label="Check-in" value={lastCheck ? lastCheck.mood ?? "Done" : "—"} isPending={checkins.isPending} />
          <StatusChip label="Location" value={latest?.context?.location ?? user?.profile?.location ?? "—"} isPending={false} />
        </div>
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-4 gap-3">
        {QUICK.map(({ label, Icon, to, color }) => (
          <button key={to} onClick={() => navigate(to)}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors active:scale-95">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${color}`}>
              <Icon size={20} weight="duotone" />
            </div>
            <span className="text-[10px] font-medium text-center leading-tight">{label}</span>
          </button>
        ))}
      </div>

      {/* Recent reports */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Recent reports</span>
          <button onClick={() => navigate("/reports")} className="text-xs text-primary flex items-center gap-1">
            All <ArrowRightIcon size={12} />
          </button>
        </div>

        {analyses.isPending
          ? [0,1,2].map(i => <Skeleton key={i} className="h-14 rounded-xl" />)
          : analysisRows.length
            ? analysisRows.map((a: AnalysisResponse) => (
                <button key={a.id} onClick={() => navigate(`/results/${a.id}`)}
                  className="w-full flex items-center gap-3 p-3 rounded-xl border border-border bg-card hover:bg-accent transition-colors text-left">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor(a)}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {a.labUpload?.fileName ?? "Manual entry"}
                    </p>
                    <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
                  </div>
                  <Badge variant="outline" className={`text-xs shrink-0 ${riskBadge(a)}`}>
                    {overallStatus(a)}
                  </Badge>
                </button>
              ))
            : (
              <div className="rounded-xl border border-dashed border-border p-8 text-center">
                <p className="text-sm text-muted-foreground">No reports yet.</p>
                <button onClick={() => navigate("/upload")} className="text-sm text-primary mt-1">
                  Upload a lab result
                </button>
              </div>
            )
        }
      </div>

      {/* Environment mini card */}
      {latest?.context?.aqi != null && (
        <div className="rounded-xl border border-border bg-card p-4 flex items-center gap-3">
          <WindIcon size={20} className="text-primary shrink-0" weight="duotone" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium">{latest.context.location ?? "Environment"}</p>
            <p className="text-xs text-muted-foreground">AQI {latest.context.aqi} · {latest.context.condition ?? ""}</p>
          </div>
          <button onClick={() => navigate("/environment")} className="text-xs text-primary">View</button>
        </div>
      )}
    </motion.div>
  )
}

// ── helpers ───────────────────────────────────────────────────────────────────

import type { AnalysisResponse } from "@/lib/types"

function overallStatus(a: AnalysisResponse): string {
  const alerts = Object.keys(a.safetyAlerts ?? {})
  if (alerts.length) return "Urgent"
  const labs = a.colorCodedLabs as Record<string, { status?: string }> | undefined
  if (!labs) return "Normal"
  const vals = Object.values(labs)
  if (vals.some(v => v.status === "red" || v.status === "urgent")) return "Urgent"
  if (vals.some(v => v.status === "yellow" || v.status === "amber" || v.status === "monitor")) return "Monitor"
  return "Normal"
}

function dotColor(a: AnalysisResponse): string {
  const s = overallStatus(a)
  if (s === "Urgent")  return "bg-red-500"
  if (s === "Monitor") return "bg-amber-500"
  return "bg-green-500"
}

function StatusChip({ label, value, isPending }: { label: string; value: string; isPending: boolean }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] text-muted-foreground">{label}</span>
      {isPending
        ? <Skeleton className="h-4 w-12" />
        : <span className="text-xs font-medium">{value}</span>
      }
    </div>
  )
}
