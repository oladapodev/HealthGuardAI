import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeftIcon } from "@phosphor-icons/react"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { statusColor } from "@/lib/ui-helpers"
import { normalizeLabDisplay } from "@/lib/labs"

export default function MarkerDetailPage() {
  const { id, marker } = useParams<{ id: string; marker: string }>()
  const navigate = useNavigate()
  const name = decodeURIComponent(marker ?? "")

  const { data, isPending } = tsr.analyses.getById.useQuery({
    queryKey: ["analyses", "detail", id],
    queryData: { params: { id: id! } },
    enabled: !!id,
  })

  const analysis = data?.body
  const labs = analysis?.colorCodedLabs as Record<string, unknown> | undefined

  const lab = labs?.[name] ? normalizeLabDisplay(labs[name]) : undefined

  if (isPending) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-32 rounded-xl" />
        <Skeleton className="h-32 rounded-xl" />
      </div>
    )
  }

  if (!lab) {
    return (
      <div className="pt-8 text-center space-y-3">
        <p className="text-muted-foreground text-sm">Marker not found.</p>
        <button onClick={() => navigate(-1)} className="text-primary text-sm">Go back</button>
      </div>
    )
  }

  const status = lab.status ?? "green"
  const sections = [
    { title: "Meaning",           text: lab.meaning  ?? lab.insight ?? lab.message },
    { title: "Context",           text: lab.context },
    { title: "Ask your doctor",   text: lab.questions },
  ]

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 pt-2"
    >
      <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground flex items-center gap-1.5 text-sm">
        <ArrowLeftIcon size={16} /> Back
      </button>

      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <h1 className="font-heading text-xl font-bold capitalize">{name}</h1>
          <Badge variant="outline" className={`text-xs ${statusColor(status)}`}>
            {status === "red" || status === "urgent" ? "High" : status === "yellow" || status === "amber" ? "Monitor" : "Normal"}
          </Badge>
        </div>
        {lab.valueText && (
          <p className="text-2xl font-bold tabular-nums">
            {lab.valueText}
          </p>
        )}
        {lab.range && (
          <p className="text-xs text-muted-foreground">
            Reference: {lab.range.min ?? "—"} – {lab.range.max ?? "—"} {lab.unit}
            {lab.range.label ? ` (${lab.range.label})` : ""}
          </p>
        )}
      </div>

      {/* Sections */}
      {sections.map(({ title, text }) =>
        text ? (
          <div key={title} className="rounded-xl border border-border bg-card p-4 space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-sm leading-relaxed">{text}</p>
          </div>
        ) : null,
      )}

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        Educational only. For clinician review.
      </p>
    </motion.div>
  )
}
