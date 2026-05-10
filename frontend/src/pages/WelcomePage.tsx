import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { ShieldCheckIcon } from "@phosphor-icons/react"
import { Button } from "@/components/ui/button"

export default function WelcomePage() {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-center justify-center min-h-svh px-6 text-center gap-10"
    >
      <div className="flex flex-col items-center gap-5">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
          <ShieldCheckIcon size={36} weight="duotone" className="text-primary" />
        </div>
        <div className="space-y-2">
          <h1 className="font-heading text-3xl font-bold tracking-tight">HealthGuard AI</h1>
          <p className="text-muted-foreground text-base max-w-[260px]">
            Understand your lab results in plain language.
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-xs">
        <Button size="lg" className="w-full" onClick={() => navigate("/auth?mode=register")}>
          Get started
        </Button>
        <Button size="lg" variant="outline" className="w-full" onClick={() => navigate("/auth?mode=login")}>
          Sign in
        </Button>
      </div>

      <p className="text-xs text-muted-foreground max-w-[240px] leading-relaxed">
        Educational only. Not a substitute for professional medical care.
      </p>
    </motion.div>
  )
}
