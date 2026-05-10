import * as React from "react"
import type { User } from "@/lib/types"
import { store, auth as authLog } from "@/lib/logger"

type AuthCtx = {
  user: User | null
  token: string | null
  setAuth: (token: string, user: User) => void
  patchUser: (user: User) => void
  logout: () => void
}

const AuthContext = React.createContext<AuthCtx | undefined>(undefined)

function readStorage(): { token: string | null; user: User | null } {
  const token = localStorage.getItem("token")
  const raw = localStorage.getItem("user")
  store.get("token", !!token)
  store.get("user", !!raw)

  let user: User | null = null
  if (raw) {
    try {
      user = JSON.parse(raw) as User
    } catch {
      localStorage.removeItem("user")
    }
  }

  if (token && user) {
    authLog.tokenFound(user.id)
  } else {
    authLog.tokenMissing()
  }

  return { token, user }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state] = React.useState(readStorage)
  const [token, setToken] = React.useState(state.token)
  const [user, setUser] = React.useState(state.user)

  const setAuth = React.useCallback((newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken)
    localStorage.setItem("user", JSON.stringify(newUser))
    store.set("token", "jwt saved")
    store.set("user", newUser.email)
    setToken(newToken)
    setUser(newUser)
  }, [])

  const patchUser = React.useCallback((updated: User) => {
    localStorage.setItem("user", JSON.stringify(updated))
    store.set("user", "profile updated")
    setUser(updated)
  }, [])

  const logout = React.useCallback(() => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    store.clear("token")
    store.clear("user")
    authLog.logout()
    setToken(null)
    setUser(null)
  }, [])

  const value = React.useMemo(
    () => ({ user, token, setAuth, patchUser, logout }),
    [user, token, setAuth, patchUser, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const ctx = React.useContext(AuthContext)
  if (!ctx) throw new Error("useAuth must be inside AuthProvider")
  return ctx
}
