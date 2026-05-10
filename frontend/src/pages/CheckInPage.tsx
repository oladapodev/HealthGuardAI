import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { errorMessage, feature } from "@/lib/logger"

const MOODS = ["😔", "😕", "😐", "🙂", "😄"] as const
const SLEEP_OPTS  = [4, 5, 6, 7, 8, 9] as const
const EX_OPTS     = [0, 15, 30, 45, 60] as const

const SYMPTOM_CHIPS = [
  "Headache", "Fatigue", "Nausea", "Dizziness", "Chest pain",
  "Shortness of breath", "Joint pain", "Skin rash", "Fever",
]

export default function CheckInPage() {
  const navigate = useNavigate()
  const [mood,     setMood]     = React.useState<number | null>(null)
  const [symptoms, setSymptoms] = React.useState<string[]>([])
  const [sleep,    setSleep]    = React.useState<number>(7)
  const [exercise, setExercise] = React.useState<number>(0)
  const [notes,    setNotes]    = React.useState("")

  const checkinMut = tsr.checkins.create.useMutation({
    onSuccess: (result: unknown) => {
      feature.ok("check-in", result)
      toast.success("Check-in saved.")
      navigate("/dashboard")
    },
    onError: (err: unknown) => {
      feature.fail("check-in", err)
      toast.error(errorMessage(err))
    },
  })

  const save = () => {
    const body = {
      log: {
        mood:     mood !== null ? MOODS[mood] : undefined,
        symptoms,
        sleep:    { hours: sleep },
        exercise: { minutes: exercise },
        notes:    notes || undefined,
        source:   "manual",
      },
    }
    feature.start("check-in", body)
    checkinMut.mutate({ body })
  }

  const toggleSymptom = (s: string) =>
    setSymptoms(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-7 pt-2"
    >
      <div>
        <h1 className="font-heading text-xl font-bold">Daily check-in</h1>
        <p className="text-xs text-muted-foreground">Takes under 20 seconds.</p>
      </div>

      {/* Mood */}
      <div className="space-y-3">
        <Label className="text-sm font-semibold">How are you feeling?</Label>
        <div className="flex justify-between">
          {MOODS.map((m, i) => (
            <button key={i} type="button" onClick={() => setMood(i)}
              className={`text-3xl transition-transform ${mood === i ? "scale-125" : "opacity-50 hover:opacity-80"}`}>
              {m}
            </button>
          ))}
        </div>
      </div>

      {/* Symptoms */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Symptoms today</Label>
        <div className="flex flex-wrap gap-2">
          {SYMPTOM_CHIPS.map(s => (
            <button key={s} type="button" onClick={() => toggleSymptom(s)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-colors ${
                symptoms.includes(s)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-border text-muted-foreground hover:border-primary/50"
              }`}>
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Sleep */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Sleep last night</Label>
        <div className="flex gap-2 flex-wrap">
          {SLEEP_OPTS.map(h => (
            <button key={h} type="button" onClick={() => setSleep(h)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                sleep === h ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}>
              {h}h
            </button>
          ))}
        </div>
      </div>

      {/* Exercise */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Exercise today</Label>
        <div className="flex gap-2 flex-wrap">
          {EX_OPTS.map(m => (
            <button key={m} type="button" onClick={() => setExercise(m)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${
                exercise === m ? "bg-primary text-primary-foreground border-primary" : "border-border text-muted-foreground"
              }`}>
              {m === 0 ? "None" : `${m}m`}
            </button>
          ))}
        </div>
      </div>

      {/* Notes */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold">Optional note</Label>
        <Textarea value={notes} onChange={e => setNotes(e.target.value)}
          placeholder="Anything else worth noting…" className="resize-none" rows={2} />
      </div>

      <Button className="w-full" onClick={save} disabled={checkinMut.isPending}>
        {checkinMut.isPending ? "Saving…" : "Save check-in"}
      </Button>
    </motion.div>
  )
}
