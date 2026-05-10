import * as React from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { motion } from "motion/react"
import { EyeIcon, EyeSlashIcon } from "@phosphor-icons/react"
import { toast } from "sonner"
import { tsr } from "@/lib/query"
import { useAuth } from "@/context/AuthContext"
import { auth as authLog } from "@/lib/logger"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { AuthResponse } from "@/lib/types"

export default function AuthPage() {
  const [searchParams] = useSearchParams()
  const defaultTab = searchParams.get("mode") === "register" ? "register" : "login"

  const [email, setEmail]   = React.useState("")
  const [pw, setPw]         = React.useState("")
  const [showPw, setShowPw] = React.useState(false)
  const { setAuth } = useAuth()
  const navigate = useNavigate()

  const loginMut = tsr.auth.login.useMutation({
    onMutate: () => authLog.loginStart(email),
    onSuccess: ({ body, status }: { body: AuthResponse; status: number }) => {
      if (status === 200) {
        authLog.loginOk(body.user.email)
        setAuth(body.token, body.user)
        const profileDone = body.user.profile?.age != null
        navigate(profileDone ? "/dashboard" : "/setup", { replace: true })
      }
    },
    onError: (err: unknown) => {
      const msg = extractMsg(err)
      authLog.loginFail(msg)
      toast.error(msg)
    },
  })

  const registerMut = tsr.auth.register.useMutation({
    onMutate: () => authLog.registerStart(email),
    onSuccess: ({ body, status }: { body: AuthResponse; status: number }) => {
      if (status === 201) {
        authLog.registerOk(body.user.email)
        setAuth(body.token, body.user)
        navigate("/setup", { replace: true })
      }
    },
    onError: (err: unknown) => {
      const msg = extractMsg(err)
      authLog.registerFail(msg)
      toast.error(msg)
    },
  })

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    loginMut.mutate({ body: { email: normalizeEmail(email), password: pw } })
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    registerMut.mutate({ body: { email: normalizeEmail(email), password: pw } })
  }

  const isPending = loginMut.isPending || registerMut.isPending

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="flex flex-col items-center justify-center min-h-svh px-6"
    >
      <div className="w-full max-w-sm space-y-6">
        <h1 className="font-heading text-2xl font-bold text-center">HealthGuard AI</h1>

        <Tabs defaultValue={defaultTab}>
          <TabsList className="w-full">
            <TabsTrigger value="login"    className="flex-1">Sign in</TabsTrigger>
            <TabsTrigger value="register" className="flex-1">Create account</TabsTrigger>
          </TabsList>

          {/* Sign in */}
          <TabsContent value="login" className="mt-4">
            <form onSubmit={handleLogin} className="space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <PwField value={pw} onChange={setPw} show={showPw} onToggle={() => setShowPw(p => !p)} />
              <Button type="submit" className="w-full" disabled={isPending}>
                {loginMut.isPending ? "Signing in…" : "Sign in"}
              </Button>
            </form>
          </TabsContent>

          {/* Register */}
          <TabsContent value="register" className="mt-4">
            <form onSubmit={handleRegister} className="space-y-4">
              <EmailField value={email} onChange={setEmail} />
              <PwField value={pw} onChange={setPw} show={showPw} onToggle={() => setShowPw(p => !p)} hint="Min. 8 characters" />
              <Button type="submit" className="w-full" disabled={isPending}>
                {registerMut.isPending ? "Creating…" : "Create account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  )
}

function EmailField({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="email">Email</Label>
      <Input id="email" type="email" value={value} onChange={e => onChange(e.target.value)}
        required placeholder="you@example.com" autoComplete="email" />
    </div>
  )
}

function PwField({ value, onChange, show, onToggle, hint }: {
  value: string; onChange: (v: string) => void
  show: boolean; onToggle: () => void; hint?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor="pw">Password</Label>
      <div className="relative">
        <Input id="pw" type={show ? "text" : "password"} value={value}
          onChange={e => onChange(e.target.value)} required
          minLength={8}
          placeholder={hint ?? "••••••••"} autoComplete="current-password"
          className="pr-10" />
        <button type="button" onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
          {show ? <EyeSlashIcon size={16} /> : <EyeIcon size={16} />}
        </button>
      </div>
    </div>
  )
}

function normalizeEmail(value: string): string {
  return value.trim().toLowerCase()
}

function extractMsg(err: unknown): string {
  if (!err || typeof err !== "object") return "Something went wrong"
  const e = err as {
    body?: {
      message?: string
      error?: string
      errors?: { field?: string; message?: string }[]
    }
    message?: string
  }
  const firstValidationError = e.body?.errors?.find(item => item.message)
  if (firstValidationError?.message) {
    return firstValidationError.field
      ? `${firstValidationError.field}: ${firstValidationError.message}`
      : firstValidationError.message
  }

  return e.body?.message ?? e.message ?? "Something went wrong"
}
