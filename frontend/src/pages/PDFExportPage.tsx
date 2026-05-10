import * as React from "react"
import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeftIcon, DownloadSimpleIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { downloadAnalysisReport } from "@/lib/fetcher"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Spinner } from "@/components/ui/spinner"
import { Skeleton } from "@/components/ui/skeleton"

const SECTIONS = [
  { key: "patientSummary",    label: "Patient summary" },
  { key: "clinicianSummary",  label: "Clinician summary" },
  { key: "labValues",         label: "Lab values" },
  { key: "checkIns",          label: "Check-ins" },
  { key: "environment",       label: "Environment" },
  { key: "disclaimer",        label: "Disclaimer" },
] as const

type SectionKey = (typeof SECTIONS)[number]["key"]

export default function PDFExportPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [enabled, setEnabled] = React.useState<Record<SectionKey, boolean>>({
    patientSummary: true, clinicianSummary: true, labValues: true,
    checkIns: false, environment: true, disclaimer: true,
  })
  const [downloading, setDownloading] = React.useState(false)

  const { data, isPending } = tsr.analyses.getById.useQuery({
    queryKey: ["analyses", "detail", id],
    queryData: { params: { id: id! } },
    enabled: !!id,
  })

  const handleDownload = async () => {
    if (!id) return
    setDownloading(true)
    try {
      const blob = await downloadAnalysisReport(id)
      const url  = URL.createObjectURL(blob)
      const a    = document.createElement("a")
      a.href     = url
      a.download = `healthguard-report-${id.slice(0,8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      toast.success("Report downloaded.")
    } catch {
      toast.error("Failed to generate PDF. Try again.")
    } finally {
      setDownloading(false)
    }
  }

  if (isPending) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-5 w-24" />
        {[0,1,2,3,4,5].map(i => <Skeleton key={i} className="h-10 rounded-xl" />)}
      </div>
    )
  }

  const a = data?.body

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pt-2"
    >
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon size={18} />
        </button>
        <h1 className="font-heading text-xl font-bold">Export report</h1>
      </div>

      {/* Preview info */}
      {a && (
        <div className="rounded-xl border border-border bg-card p-4 space-y-1">
          <p className="text-sm font-medium">{a.labUpload?.fileName ?? "Manual entry"}</p>
          <p className="text-xs text-muted-foreground">
            {new Date(a.createdAt ?? "").toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
          </p>
        </div>
      )}

      {/* Section toggles */}
      <div className="rounded-xl border border-border bg-card divide-y divide-border">
        {SECTIONS.map(({ key, label }) => (
          <div key={key} className="flex items-center justify-between px-4 py-3">
            <span className="text-sm">{label}</span>
            <Switch
              checked={enabled[key]}
              onCheckedChange={v => setEnabled(prev => ({ ...prev, [key]: v }))}
            />
          </div>
        ))}
      </div>

      <Button className="w-full gap-2" onClick={handleDownload} disabled={downloading}>
        {downloading
          ? <><Spinner className="size-4" /> Generating…</>
          : <><DownloadSimpleIcon size={18} /> Download PDF</>
        }
      </Button>

      <p className="text-[10px] text-muted-foreground text-center">
        PDF includes a disclaimer that this is educational only and not a substitute for professional medical care.
      </p>
    </motion.div>
  )
}
