import * as React from "react"
import { useNavigate } from "react-router-dom"
import { motion, AnimatePresence } from "motion/react"
import { SunIcon, MoonIcon, MonitorIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/components/theme-provider"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { ProfileResponse } from "@/lib/types"

export default function SettingsPage() {
  const navigate = useNavigate()
  const { user, patchUser, logout } = useAuth()
  const [location, setLocation] = React.useState(user?.profile?.location ?? "")
  const [menstrualEnabled, setMenstrualEnabled] = React.useState(
    !!(user?.profile?.menstrualCycle),
  )

  const updateMut = tsr.profile.update.useMutation({
    onSuccess: ({ body }: { body: ProfileResponse }) => {
      if (body.user) { patchUser(body.user); toast.success("Saved.") }
    },
    onError: () => toast.error("Failed to save."),
  })

  const saveLocation = () => {
    updateMut.mutate({
      body: { profile: { ...user?.profile, location } },
    })
  }

  const toggleMenstrual = (v: boolean) => {
    setMenstrualEnabled(v)
    const profile = { ...user?.profile }
    if (!v) delete profile.menstrualCycle
    updateMut.mutate({ body: { profile } })
  }

  const handleLogout = () => {
    logout()
    navigate("/", { replace: true })
  }

  const SECTION = "space-y-4"
  const ITEM = "flex items-center justify-between gap-4"

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-6 pt-2"
    >
      <h1 className="font-heading text-xl font-bold">Settings</h1>

      {/* Profile */}
      <div className={SECTION}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profile</p>
        <div className={ITEM}>
          <div>
            <p className="text-sm font-medium">Account</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate("/setup")}>Edit</Button>
        </div>
      </div>

      <Separator />

      {/* Appearance */}
      <AppearanceSection />

      <Separator />

      {/* Location */}
      <div className={SECTION}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Location</p>
        <p className="text-xs text-muted-foreground">Used for environmental health context.</p>
        <div className="flex gap-2">
          <Input value={location} onChange={e => setLocation(e.target.value)}
            placeholder="City or region" className="flex-1" />
          <Button variant="outline" size="sm" onClick={saveLocation} disabled={updateMut.isPending}>Save</Button>
        </div>
      </div>

      <Separator />

      {/* Sensitive health context */}
      <div className={SECTION}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Health context</p>
        {user?.profile?.gender === "female" && (
          <div className={ITEM}>
            <div>
              <p className="text-sm font-medium">Menstrual cycle context</p>
              <p className="text-xs text-muted-foreground">Used to contextualise iron and hormone markers.</p>
            </div>
            <Switch checked={menstrualEnabled} onCheckedChange={toggleMenstrual} />
          </div>
        )}
        <div className={ITEM}>
          <div>
            <p className="text-sm font-medium">Export preferences</p>
            <p className="text-xs text-muted-foreground">Manage what appears in PDF exports.</p>
          </div>
          <Button variant="outline" size="sm" disabled>Configure</Button>
        </div>
      </div>

      <Separator />

      {/* Account */}
      <div className={SECTION}>
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Account</p>
        <Button variant="outline" className="w-full justify-start text-muted-foreground" onClick={handleLogout}>
          Sign out
        </Button>
        <Button variant="outline" className="w-full justify-start text-destructive hover:text-destructive" disabled>
          Delete all data
        </Button>
      </div>

      <p className="text-[10px] text-muted-foreground text-center pb-4">
        HealthGuard AI — educational only. Not a substitute for professional medical care.
      </p>
    </motion.div>
  )
}

const THEME_OPTIONS = [
  { value: "light", label: "Light", Icon: SunIcon },
  { value: "dark",  label: "Dark",  Icon: MoonIcon },
  { value: "system", label: "System", Icon: MonitorIcon },
] as const

function AppearanceSection() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="space-y-4">
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Appearance</p>
      <p className="text-xs text-muted-foreground">Choose your preferred color scheme.</p>
      <div className="grid grid-cols-3 gap-2">
        {THEME_OPTIONS.map(({ value, label, Icon }) => {
          const active = theme === value
          return (
            <motion.button
              key={value}
              onClick={() => setTheme(value)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "flex flex-col items-center gap-2 py-4 rounded-xl border transition-all duration-150 text-xs font-medium",
                active
                  ? "border-primary bg-primary/10 text-primary shadow-sm"
                  : "border-border bg-card text-muted-foreground hover:bg-accent hover:text-foreground",
              )}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.span
                  key={value + String(active)}
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.7, opacity: 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <Icon size={20} weight={active ? "fill" : "regular"} />
                </motion.span>
              </AnimatePresence>
              {label}
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
