import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { formatDate } from "@/lib/ui-helpers"
import type { AnalysisResponse } from "@/lib/types"
import { normalizeLabDisplay } from "@/lib/labs"

export default function TrendsPage() {
  const navigate = useNavigate()
  const { data, isPending } = tsr.analyses.list.useQuery({
    queryKey: ["analyses", "list", { limit: 20 }],
    queryData: { query: { limit: 20 } },
  })
  const analyses: AnalysisResponse[] = data?.body?.data ?? []

  // Build trend series: collect all marker names across analyses
  const allMarkers = new Set<string>()
  for (const a of analyses) {
    const labs = a.colorCodedLabs as Record<string, unknown> | undefined
    if (labs) Object.keys(labs).forEach(k => allMarkers.add(k))
  }

  // Build chart data per marker
  const markerTrends = Array.from(allMarkers).slice(0, 6).map(marker => ({
    name: marker,
    points: analyses
      .filter((a: AnalysisResponse) => {
        const labs = a.colorCodedLabs as Record<string, unknown> | undefined
        return normalizeLabDisplay(labs?.[marker]).numericValue !== undefined
      })
      .map((a: AnalysisResponse) => ({
        date: formatDate(a.createdAt),
        value: normalizeLabDisplay((a.colorCodedLabs as Record<string, unknown> | undefined)?.[marker]).numericValue,
      }))
      .reverse(),
  })).filter(m => m.points.length >= 2)

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pt-2"
    >
      <div>
        <h1 className="font-heading text-xl font-bold">Trends</h1>
        <p className="text-xs text-muted-foreground">Marker values over time across reports.</p>
      </div>

      {isPending && [0,1,2].map(i => <Skeleton key={i} className="h-40 rounded-xl" />)}

      {!isPending && !markerTrends.length && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-2">
          <p className="text-sm text-muted-foreground">Need at least 2 reports to show trends.</p>
          <button onClick={() => navigate("/upload")} className="text-sm text-primary">Upload a lab result</button>
        </div>
      )}

      {markerTrends.map(({ name, points }) => (
        <div key={name} className="rounded-xl border border-border bg-card p-4 space-y-3">
          <p className="text-sm font-semibold capitalize">{name}</p>
          <ResponsiveContainer width="100%" height={120}>
            <LineChart data={points} margin={{ top: 4, right: 4, bottom: 0, left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="date" tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <YAxis tick={{ fontSize: 10, fill: "var(--muted-foreground)" }} />
              <Tooltip
                contentStyle={{ fontSize: 12, borderRadius: 8, border: "1px solid var(--border)", background: "var(--card)" }}
                labelStyle={{ color: "var(--muted-foreground)" }}
              />
              <Line type="monotone" dataKey="value" stroke="var(--primary)" strokeWidth={2} dot={{ r: 4, fill: "var(--primary)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ))}
    </motion.div>
  )
}
