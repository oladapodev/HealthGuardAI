import { Outlet, NavLink, useLocation } from "react-router-dom"
import { AnimatePresence, motion } from "motion/react"
import {
  HouseIcon, UploadIcon, ClipboardTextIcon,
  ChatTeardropTextIcon, GearIcon,
  ChartBarIcon, TrendUpIcon,
  SunIcon, MoonIcon,
} from "@phosphor-icons/react"
import { cn } from "@/lib/utils"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/components/theme-provider"

// ── 4-item mobile nav (floating pill dock) ────────────────────────────────────
const MOBILE_NAV = [
  { to: "/dashboard", Icon: HouseIcon,            label: "Home"     },
  { to: "/upload",    Icon: UploadIcon,           label: "Upload"   },
  { to: "/chat",      Icon: ChatTeardropTextIcon, label: "Chat"     },
  { to: "/settings",  Icon: GearIcon,            label: "Settings" },
]

// ── Full desktop sidebar nav ──────────────────────────────────────────────────
const SIDEBAR_NAV = [
  { to: "/dashboard", Icon: HouseIcon,            label: "Dashboard" },
  { to: "/upload",    Icon: UploadIcon,            label: "Upload"    },
  { to: "/checkin",   Icon: ClipboardTextIcon,     label: "Check-in"  },
  { to: "/reports",   Icon: ChartBarIcon,          label: "Reports"   },
  { to: "/chat",      Icon: ChatTeardropTextIcon,  label: "Chat"      },
  { to: "/trends",    Icon: TrendUpIcon,           label: "Trends"    },
  { to: "/settings",  Icon: GearIcon,             label: "Settings"  },
]

function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)
  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="w-8 h-8 rounded-lg flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
      aria-label="Toggle theme"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark
          ? <motion.span key="sun" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <SunIcon size={18} weight="duotone" />
            </motion.span>
          : <motion.span key="moon" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.18 }}>
              <MoonIcon size={18} weight="duotone" />
            </motion.span>
        }
      </AnimatePresence>
    </button>
  )
}

export default function AppLayout() {
  const { user } = useAuth()
  const location = useLocation()
  const isChatPage = location.pathname === "/chat"

  return (
    <div className="flex h-svh overflow-hidden bg-background">

      {/* ── Desktop sidebar ──────────────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col w-56 shrink-0 h-full border-r border-border bg-sidebar">
        <div className="px-4 pt-5 pb-4 border-b border-border">
          <span className="font-heading font-bold text-primary text-sm tracking-tight">HealthGuard AI</span>
        </div>
        <nav className="flex flex-col gap-0.5 flex-1 overflow-y-auto px-2 py-3">
          {SIDEBAR_NAV.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-accent",
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} weight={isActive ? "fill" : "regular"} className="shrink-0" />
                  <span className="truncate">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
        <div className="px-4 py-3 border-t border-border flex items-center gap-2">
          <p className="text-xs text-muted-foreground flex-1 truncate">{user?.email}</p>
          <ThemeToggle />
        </div>
      </aside>

      {/* ── Main column ──────────────────────────────────────────────────── */}
      <div className="flex flex-col flex-1 min-w-0 h-full">

        {/* Top header */}
        <header className="shrink-0 h-14 bg-background/95 backdrop-blur border-b border-border flex items-center px-4 md:px-5 gap-2 z-40">
          <span className="font-heading font-bold text-primary text-sm md:hidden">HealthGuard AI</span>
          <div className="flex-1" />
          <span className="hidden md:block text-[11px] text-muted-foreground px-2 py-1 rounded-md border border-border">
            Educational only
          </span>
          <ThemeToggle />
        </header>

        {/* Page content area */}
        {isChatPage ? (
          // Chat: full remaining height, no scroll, embedded properly
          <div className="flex-1 min-h-0 overflow-hidden flex flex-col">
            <div className="flex-1 min-h-0 w-full max-w-2xl mx-auto px-4 md:px-6 pt-5 pb-[calc(3.5rem+1rem)] md:pb-5 flex flex-col min-h-0">
              <Outlet />
            </div>
          </div>
        ) : (
          // Normal pages: scrollable
          <main className="flex-1 overflow-y-auto min-h-0">
            <div className="w-full max-w-2xl mx-auto px-4 md:px-6 pt-5 pb-[calc(3.5rem+1.5rem)] md:pb-8">
              <Outlet />
            </div>
          </main>
        )}
      </div>

      {/* ── Mobile bottom nav ────────────────────────────────────────────── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden bg-background/95 backdrop-blur-md border-t border-border safe-area-inset-bottom">
        <div className="flex items-stretch max-w-md mx-auto">
          {MOBILE_NAV.map(({ to, Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  "flex-1 flex flex-col items-center justify-center gap-0.5 py-2 transition-colors relative",
                  isActive ? "text-primary" : "text-muted-foreground",
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="nav-pill"
                      className="absolute -top-px left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-primary"
                      transition={{ type: "spring", stiffness: 420, damping: 36 }}
                    />
                  )}
                  <motion.span
                    animate={{ scale: isActive ? 1.12 : 1, y: isActive ? -1 : 0 }}
                    transition={{ type: "spring", stiffness: 400, damping: 28 }}
                  >
                    <Icon size={21} weight={isActive ? "fill" : "regular"} />
                  </motion.span>
                  <span className="text-[9px] font-medium leading-none">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

    </div>
  )
}
