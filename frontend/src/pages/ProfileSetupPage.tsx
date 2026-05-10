import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { useAuth } from "@/context/AuthContext"
import { auth as authLog } from "@/lib/logger"
import type { Profile } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const STEPS = ["Personal", "Health", "Done"] as const
type Step = 0 | 1 | 2

const BLOOD_GROUPS = ["A+","A−","B+","B−","AB+","AB−","O+","O−","Unknown"]
const GENDERS = [
  { value: "male",              label: "Male" },
  { value: "female",            label: "Female" },
  { value: "other",             label: "Other" },
  { value: "prefer_not_to_say", label: "Prefer not to say" },
] as const

export default function ProfileSetupPage() {
  const navigate = useNavigate()
  const { patchUser } = useAuth()
  const [step, setStep] = React.useState<Step>(0)

  const [form, setForm] = React.useState<Profile>({
    firstName: "", lastName: "", age: undefined, gender: undefined,
    bloodGroup: "", height: undefined, weight: undefined, location: "",
    conditions: [], allergies: [], medications: [],
  })

  const set = <K extends keyof Profile>(k: K, v: Profile[K]) =>
    setForm(prev => ({ ...prev, [k]: v }))

  const updateMut = tsr.profile.update.useMutation({
    onSuccess: ({ body }: { body: { user?: import("@/lib/types").User } }) => {
      if (body.user) {
        patchUser(body.user)
        authLog.profileSaved(Object.keys(form).filter(k => form[k as keyof Profile]))
        navigate("/dashboard", { replace: true })
      }
    },
    onError: () => toast.error("Failed to save profile"),
  })

  const handleSave = () => {
    const cleaned: Profile = Object.fromEntries(
      Object.entries(form).filter(([, v]) => v !== "" && v !== undefined && !(Array.isArray(v) && v.length === 0))
    )
    updateMut.mutate({ body: { profile: cleaned } })
  }

  return (
    <div className="min-h-svh bg-background flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-sm space-y-8">
        {/* Step indicator */}
        <div className="space-y-2">
          <div className="flex gap-1.5">
            {STEPS.map((s, i) => (
              <div key={s} className={`h-1 rounded-full flex-1 transition-colors duration-200 ${i <= step ? "bg-primary" : "bg-border"}`} />
            ))}
          </div>
          <p className="text-xs text-muted-foreground">Step {step + 1} of {STEPS.length}</p>
        </div>

        <AnimatePresence mode="wait">
          {step === 0 && (
            <motion.div key="step0" {...slide} className="space-y-5">
              <div>
                <h2 className="font-heading text-xl font-bold">Personal info</h2>
                <p className="text-sm text-muted-foreground">Used to personalise your results.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="First name" value={form.firstName ?? ""} onChange={v => set("firstName", v)} />
                <Field label="Last name"  value={form.lastName ?? ""}  onChange={v => set("lastName", v)} />
              </div>
              <Field label="Age" type="number" value={String(form.age ?? "")} onChange={v => set("age", v ? Number(v) : undefined)} />
              <div className="space-y-1.5">
                <Label>Gender</Label>
                <div className="grid grid-cols-2 gap-2">
                  {GENDERS.map(g => (
                    <button key={g.value} type="button"
                      onClick={() => set("gender", g.value)}
                      className={`border rounded-lg py-2 text-sm font-medium transition-colors ${form.gender === g.value ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {g.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Blood group</Label>
                <div className="flex flex-wrap gap-2">
                  {BLOOD_GROUPS.map(bg => (
                    <button key={bg} type="button"
                      onClick={() => set("bloodGroup", bg)}
                      className={`border rounded-md px-3 py-1 text-xs font-medium transition-colors ${form.bloodGroup === bg ? "border-primary bg-primary/10 text-primary" : "border-border text-muted-foreground hover:border-primary/50"}`}>
                      {bg}
                    </button>
                  ))}
                </div>
              </div>
              <Button className="w-full" onClick={() => setStep(1)}>Next</Button>
              <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("/dashboard")}>
                Skip for now
              </Button>
            </motion.div>
          )}

          {step === 1 && (
            <motion.div key="step1" {...slide} className="space-y-5">
              <div>
                <h2 className="font-heading text-xl font-bold">Health context</h2>
                <p className="text-sm text-muted-foreground">Optional — improves analysis accuracy.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Height (cm)" type="number" value={String(form.height ?? "")} onChange={v => set("height", v ? Number(v) : undefined)} />
                <Field label="Weight (kg)" type="number" value={String(form.weight ?? "")} onChange={v => set("weight", v ? Number(v) : undefined)} />
              </div>
              <Field label="Location" value={form.location ?? ""} onChange={v => set("location", v)} placeholder="City or region" />
              <TagField label="Known conditions" values={form.conditions ?? []}
                onChange={v => set("conditions", v)} placeholder="e.g. asthma" />
              <TagField label="Allergies" values={form.allergies ?? []}
                onChange={v => set("allergies", v)} placeholder="e.g. pollen" />
              <TagField label="Medications" values={form.medications ?? []}
                onChange={v => set("medications", v)} placeholder="e.g. metformin" />
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1" onClick={() => setStep(0)}>Back</Button>
                <Button className="flex-1" onClick={handleSave} disabled={updateMut.isPending}>
                  {updateMut.isPending ? "Saving…" : "Save & continue"}
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

const slide = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit:    { opacity: 0, x: -20 },
  transition: { duration: 0.2 },
}

function Field({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string; onChange: (v: string) => void
  type?: string; placeholder?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <Input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} />
    </div>
  )
}

function TagField({ label, values, onChange, placeholder }: {
  label: string; values: string[]; onChange: (v: string[]) => void; placeholder: string
}) {
  const [input, setInput] = React.useState("")
  const add = () => {
    const v = input.trim()
    if (v && !values.includes(v)) onChange([...values, v])
    setInput("")
  }
  return (
    <div className="space-y-1.5">
      <Label>{label}</Label>
      <div className="flex gap-2">
        <Input value={input} onChange={e => setInput(e.target.value)}
          placeholder={placeholder}
          onKeyDown={e => { if (e.key === "Enter") { e.preventDefault(); add() } }} />
        <Button type="button" variant="outline" size="sm" onClick={add} className="shrink-0">Add</Button>
      </div>
      {values.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-1">
          {values.map(v => (
            <span key={v} className="inline-flex items-center gap-1 bg-accent text-accent-foreground text-xs rounded-full px-2.5 py-1">
              {v}
              <button type="button" onClick={() => onChange(values.filter(x => x !== v))} className="text-muted-foreground hover:text-foreground">×</button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
