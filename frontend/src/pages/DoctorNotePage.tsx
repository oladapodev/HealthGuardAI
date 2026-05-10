import { useParams, useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ArrowLeftIcon, DownloadSimpleIcon } from "@phosphor-icons/react"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { formatDate } from "@/lib/ui-helpers"

export default function DoctorNotePage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const { data, isPending } = tsr.analyses.getById.useQuery({
    queryKey: ["analyses", "detail", id],
    queryData: { params: { id: id! } },
    enabled: !!id,
  })

  const a = data?.body

  if (isPending) {
    return (
      <div className="space-y-4 pt-2">
        <Skeleton className="h-5 w-24" />
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-40 rounded-xl" />
        <Skeleton className="h-40 rounded-xl" />
      </div>
    )
  }

  if (!a?.success) {
    return (
      <div className="pt-8 text-center">
        <p className="text-muted-foreground text-sm">Note not found.</p>
      </div>
    )
  }

  const cs = a.clinicianSummary

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 pt-2"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
            <ArrowLeftIcon size={18} />
          </button>
          <div>
            <h1 className="font-heading text-xl font-bold">Doctor note</h1>
            <p className="text-xs text-muted-foreground">{formatDate(a.createdAt)}</p>
          </div>
        </div>
        <Button size="sm" variant="outline" className="gap-1.5 shrink-0"
          onClick={() => navigate(`/results/${id}/export`)}>
          <DownloadSimpleIcon size={14} /> Export
        </Button>
      </div>

      <Tabs defaultValue="patient">
        <TabsList className="w-full">
          <TabsTrigger value="patient"   className="flex-1">Patient</TabsTrigger>
          <TabsTrigger value="clinician" className="flex-1">Clinician</TabsTrigger>
        </TabsList>

        {/* Patient tab */}
        <TabsContent value="patient" className="mt-4 space-y-3">
          <div className="rounded-xl bg-accent/50 border border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">Educational only. Share this with your doctor.</p>
          </div>
          {a.patientSummary && <NoteCard title="Summary" text={a.patientSummary} />}
          {a.nextQuestions && a.nextQuestions.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Questions to ask your doctor</p>
              <ul className="space-y-1.5">
                {a.nextQuestions.map((q: string, i: number) => (
                  <li key={i} className="text-sm flex gap-2">
                    <span className="text-muted-foreground shrink-0">{i+1}.</span>
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {a.riskFactors && a.riskFactors.length > 0 && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Risk factors noted</p>
              <div className="flex flex-wrap gap-2">
                {a.riskFactors.map((r: string) => (
                  <span key={r} className="text-xs bg-accent border border-border rounded-full px-2.5 py-1">{r}</span>
                ))}
              </div>
            </div>
          )}
        </TabsContent>

        {/* Clinician tab */}
        <TabsContent value="clinician" className="mt-4 space-y-3">
          <div className="rounded-xl bg-accent/50 border border-border px-4 py-2.5">
            <p className="text-xs text-muted-foreground">For clinician review only. Not a diagnosis.</p>
          </div>
          {cs ? (
            <>
              {cs.SBAR_Situation     && <NoteCard title="Situation"     text={cs.SBAR_Situation} />}
              {cs.SBAR_Background    && <NoteCard title="Background"    text={cs.SBAR_Background} />}
              {cs.SBAR_Assessment    && <NoteCard title="Assessment"    text={cs.SBAR_Assessment} />}
              {cs.SBAR_Recommendation && <NoteCard title="Recommendation" text={cs.SBAR_Recommendation} />}
              {cs.priorityFlags && cs.priorityFlags.length > 0 && (
                <div className="rounded-xl border border-border bg-card p-4 space-y-2">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Priority flags</p>
                  <div className="flex gap-2">
                    {cs.priorityFlags.map((f: "normal" | "monitor" | "urgent") => (
                      <span key={f} className={`text-xs rounded-full px-2.5 py-1 border font-medium ${
                        f === "urgent" ? "border-red-300 text-red-600 bg-red-50 dark:bg-red-900/20"
                          : f === "monitor" ? "border-amber-300 text-amber-600 bg-amber-50 dark:bg-amber-900/20"
                          : "border-green-300 text-green-600 bg-green-50 dark:bg-green-900/20"
                      }`}>{f}</span>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-muted-foreground">No clinician summary available.</p>
          )}
          {a.insight && <NoteCard title="AI insight" text={a.insight} />}
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}

function NoteCard({ title, text }: { title: string; text: string }) {
  return (
    <div className="rounded-xl border border-border bg-card p-4 space-y-2">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</p>
      <p className="text-sm leading-relaxed">{text}</p>
    </div>
  )
}
