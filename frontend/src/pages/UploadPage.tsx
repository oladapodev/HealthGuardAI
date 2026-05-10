import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { UploadSimpleIcon, FilePdfIcon, XIcon, PlusIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Spinner } from "@/components/ui/spinner"
import { ai, errorMessage } from "@/lib/logger"
import type { AnalysisResponse, LabResults } from "@/lib/types"

export default function UploadPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  // ── File upload ────────────────────────────────────────────────────────────
  const [file, setFile] = React.useState<File | null>(null)
  const inputRef = React.useRef<HTMLInputElement>(null)

  const runWithFile = tsr.analyses.runWithFile.useMutation({
    onSuccess: ({ body }: { body: AnalysisResponse }) => {
      ai.analysisOk(summariseAnalysis(body))
      if (body.success) navigate(`/results/${body.id}`)
    },
    onError: (err: unknown) => {
      ai.analysisFail(err)
      toast.error(errorMessage(err))
    },
  })

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const f = e.dataTransfer.files[0]
    if (f) setFile(f)
  }

  const analyzeFile = () => {
    if (!file) return
    const fd = new FormData()
    fd.append("file", file)
    if (user?.profile?.location) fd.append("location", user.profile.location)
    ai.analysisStart({
      mode: "file",
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      hasLocation: Boolean(user?.profile?.location),
    })
    runWithFile.mutate({ body: fd as unknown as { file: File } })
  }

  // ── Manual entry ───────────────────────────────────────────────────────────
  const [markers, setMarkers] = React.useState<{ name: string; value: string; unit: string }[]>([
    { name: "", value: "", unit: "" },
  ])

  const runManual = tsr.analyses.run.useMutation({
    onSuccess: ({ body }: { body: AnalysisResponse }) => {
      ai.analysisOk(summariseAnalysis(body))
      if (body.success) navigate(`/results/${body.id}`)
    },
    onError: (err: unknown) => {
      ai.analysisFail(err)
      toast.error(errorMessage(err))
    },
  })

  const analyzeManual = () => {
    const labResults: LabResults = {}
    for (const m of markers) {
      if (m.name && m.value) {
        labResults[m.name] = { value: Number(m.value), unit: m.unit }
      }
    }
    if (!Object.keys(labResults).length) {
      toast.error("Add at least one marker.")
      ai.analysisFail("No manual markers entered.")
      return
    }
    ai.analysisStart({
      mode: "manual",
      markers: Object.keys(labResults),
      markerCount: Object.keys(labResults).length,
      hasLocation: Boolean(user?.profile?.location),
    })
    runManual.mutate({ body: { manualLabResults: labResults, location: user?.profile?.location } })
  }

  const isPending = runWithFile.isPending || runManual.isPending

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pt-2"
    >
      <div>
        <h1 className="font-heading text-xl font-bold">Upload lab result</h1>
        <p className="text-xs text-muted-foreground">Your data is processed privately. Educational only.</p>
      </div>

      {isPending && (
        <div className="flex flex-col items-center justify-center gap-3 py-16 rounded-xl border border-border bg-card">
          <Spinner className="size-8 text-primary" />
          <p className="text-sm text-muted-foreground">Analyzing…</p>
          <p className="text-[11px] text-muted-foreground">Check console namespace AI for agent trace.</p>
        </div>
      )}

      {!isPending && (
        <Tabs defaultValue="file">
          <TabsList className="w-full">
            <TabsTrigger value="file"   className="flex-1">Upload file</TabsTrigger>
            <TabsTrigger value="manual" className="flex-1">Enter manually</TabsTrigger>
          </TabsList>

          {/* File upload */}
          <TabsContent value="file" className="mt-4 space-y-4">
            <div
              onClick={() => inputRef.current?.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleFileDrop}
              className="border-2 border-dashed border-border rounded-xl p-10 flex flex-col items-center gap-3 cursor-pointer hover:border-primary/50 hover:bg-accent/30 transition-colors"
            >
              {file
                ? <>
                    <FilePdfIcon size={32} className="text-primary" weight="duotone" />
                    <p className="text-sm font-medium truncate max-w-[200px]">{file.name}</p>
                    <button type="button" className="text-xs text-muted-foreground flex items-center gap-1"
                      onClick={e => { e.stopPropagation(); setFile(null) }}>
                      <XIcon size={12} /> Remove
                    </button>
                  </>
                : <>
                    <UploadSimpleIcon size={32} className="text-muted-foreground" weight="duotone" />
                    <p className="text-sm text-muted-foreground text-center">
                      Drop a PDF or image here, or tap to browse
                    </p>
                  </>
              }
            </div>
            <input ref={inputRef} type="file" accept=".pdf,image/*" className="hidden"
              onChange={e => setFile(e.target.files?.[0] ?? null)} />
            <Button className="w-full" onClick={analyzeFile} disabled={!file}>
              Analyze
            </Button>
          </TabsContent>

          {/* Manual entry */}
          <TabsContent value="manual" className="mt-4 space-y-4">
            <div className="space-y-3">
              {markers.map((m, i) => (
                <div key={i} className="flex gap-2 items-end">
                  <div className="flex-1 space-y-1">
                    <Label className="text-xs">Marker</Label>
                    <Input value={m.name} placeholder="Hemoglobin"
                      onChange={e => setMarkers(ms => ms.map((x, j) => j === i ? { ...x, name: e.target.value } : x))} />
                  </div>
                  <div className="w-20 space-y-1">
                    <Label className="text-xs">Value</Label>
                    <Input value={m.value} type="number" placeholder="11.2"
                      onChange={e => setMarkers(ms => ms.map((x, j) => j === i ? { ...x, value: e.target.value } : x))} />
                  </div>
                  <div className="w-16 space-y-1">
                    <Label className="text-xs">Unit</Label>
                    <Input value={m.unit} placeholder="g/dL"
                      onChange={e => setMarkers(ms => ms.map((x, j) => j === i ? { ...x, unit: e.target.value } : x))} />
                  </div>
                  {markers.length > 1 && (
                    <button type="button" onClick={() => setMarkers(ms => ms.filter((_, j) => j !== i))}
                      className="mb-1 text-muted-foreground hover:text-destructive">
                      <XIcon size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
            <button type="button" onClick={() => setMarkers(ms => [...ms, { name: "", value: "", unit: "" }])}
              className="flex items-center gap-1.5 text-sm text-primary">
              <PlusIcon size={16} /> Add marker
            </button>
            <Button className="w-full" onClick={analyzeManual}>
              Analyze
            </Button>
          </TabsContent>
        </Tabs>
      )}
    </motion.div>
  )
}

function summariseAnalysis(body: AnalysisResponse) {
  return {
    id: body.id,
    agentTrace: body.agentTrace,
    hasLabs: Boolean(body.colorCodedLabs && Object.keys(body.colorCodedLabs).length),
    context: body.context,
    safetyAlerts: body.safetyAlerts,
    nextQuestions: body.nextQuestions,
  }
}
