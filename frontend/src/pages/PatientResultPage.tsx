import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import {
  FileTextIcon, ChatTeardropTextIcon, DownloadSimpleIcon,
  WarningCircleIcon, ArrowLeftIcon,
} from "@phosphor-icons/react"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { statusColor, formatDate } from "@/lib/ui-helpers"
import { labStatusBucket, normalizeLabDisplay, type LabDisplay } from "@/lib/labs"

export default function PatientResultPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isPending } = tsr.analyses.getById.useQuery({
    queryKey: ["analyses", "detail", id],
    queryData: { params: { id: id! } },
    enabled: !!id,
  })

  const analysis = data?.body

  if (isPending) return <LoadingSkeleton />

  if (!analysis?.success) {
    return (
      <div className="pt-8 text-center space-y-3">
        <p className="text-muted-foreground">Result not found.</p>
        <Button variant="outline" onClick={() => navigate("/reports")}>Back to reports</Button>
      </div>
    )
  }

  const labs = analysis.colorCodedLabs as Record<string, unknown> | undefined
  const alerts = Object.keys(analysis.safetyAlerts ?? {})
  const grouped = groupByStatus(labs)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 pt-2"
    >
      {/* Back + date */}
      <div className="flex items-center gap-2">
        <button onClick={() => navigate("/reports")} className="text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon size={18} />
        </button>
        <span className="text-xs text-muted-foreground">{formatDate(analysis.createdAt)}</span>
      </div>

      {/* Safety disclaimer */}
      <div className="rounded-xl bg-accent border border-border px-4 py-2.5">
        <p className="text-xs text-muted-foreground">Educational only. For clinician review. Seek urgent care if symptoms are severe.</p>
      </div>

      {/* Urgent alerts */}
      {alerts.length > 0 && alerts.map(k => (
        <div key={k} className="rounded-xl border-2 border-red-400 bg-red-50 dark:bg-red-900/20 p-4 space-y-2">
          <div className="flex items-center gap-2">
            <WarningCircleIcon size={20} className="text-red-600 shrink-0" weight="fill" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-400">Urgent — seek care today</p>
          </div>
          <p className="text-xs text-red-600 dark:text-red-400">{k}</p>
          <Button size="sm" variant="outline" className="text-xs border-red-300 text-red-600"
            onClick={() => navigate(`/results/${id}/note`)}>
            Add to doctor note
          </Button>
        </div>
      ))}

      {/* Patient summary */}
      {analysis.patientSummary && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-1.5">
          <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Summary</p>
          <p className="text-sm leading-relaxed">{analysis.patientSummary}</p>
        </div>
      )}

      {/* Lab markers by status */}
      {(["red","yellow","green"] as const).map(status => {
        const items = grouped[status]
        if (!items?.length) return null
        return (
          <div key={status} className="space-y-2">
            <p className={`text-xs font-semibold uppercase tracking-wider ${
              status === "red" ? "text-red-600" : status === "yellow" ? "text-amber-600" : "text-green-600"
            }`}>
              {status === "red" ? "Needs attention" : status === "yellow" ? "Monitor" : "Normal range"}
            </p>
            {items.map(([name, lab]) => (
              <button key={name} onClick={() => navigate(`/results/${id}/marker/${encodeURIComponent(name)}`)}
                className="w-full rounded-xl border border-border bg-card p-4 text-left hover:bg-accent transition-colors space-y-1">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-medium capitalize">{name}</p>
                  <Badge variant="outline" className={`text-xs ${statusColor(status)}`}>
                    {status === "red" ? "High" : status === "yellow" ? "Monitor" : "Normal"}
                  </Badge>
                </div>
                {lab.valueText && (
                  <p className="text-xs text-muted-foreground">
                    {lab.valueText}
                  </p>
                )}
                {(lab.insight || lab.message) && (
                  <p className="text-xs text-muted-foreground line-clamp-1">{lab.insight || lab.message}</p>
                )}
              </button>
            ))}
          </div>
        )
      })}

      {/* Context chips */}
      {analysis.context && (
        <div className="flex flex-wrap gap-2">
          {analysis.context.location && (
            <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full border border-border">
              📍 {analysis.context.location}
            </span>
          )}
          {analysis.context.aqi != null && (
            <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full border border-border">
              🌬 AQI {analysis.context.aqi}
            </span>
          )}
          {analysis.context.condition && (
            <span className="text-xs bg-accent text-accent-foreground px-2.5 py-1 rounded-full border border-border">
              ☁ {analysis.context.condition}
            </span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="grid grid-cols-3 gap-2 pb-4">
        <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => navigate(`/results/${id}/note`)}>
          <FileTextIcon size={18} weight="duotone" />
          <span className="text-xs">Doctor note</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => navigate("/chat")}>
          <ChatTeardropTextIcon size={18} weight="duotone" />
          <span className="text-xs">Chat</span>
        </Button>
        <Button variant="outline" className="flex-col h-auto py-3 gap-1" onClick={() => navigate(`/results/${id}/export`)}>
          <DownloadSimpleIcon size={18} weight="duotone" />
          <span className="text-xs">Export</span>
        </Button>
      </div>
    </motion.div>
  )
}

function groupByStatus(
  labs: Record<string, unknown> | undefined,
) {
  const grouped: Record<"red" | "yellow" | "green", [string, LabDisplay][]> = {
    red: [], yellow: [], green: [],
  }
  if (!labs) return grouped
  for (const [name, rawLab] of Object.entries(labs)) {
    const lab = normalizeLabDisplay(rawLab)
    grouped[labStatusBucket(lab.status)].push([name, lab])
  }
  return grouped
}

function LoadingSkeleton() {
  return (
    <div className="space-y-4 pt-2">
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-10 rounded-xl" />
      <Skeleton className="h-20 rounded-xl" />
      {[0,1,2,3].map(i => <Skeleton key={i} className="h-16 rounded-xl" />)}
    </div>
  )
}
