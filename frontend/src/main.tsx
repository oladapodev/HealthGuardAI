import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { QueryClientProvider } from "@tanstack/react-query"

import "./index.css"
import App from "./App.tsx"
import { ThemeProvider } from "@/components/theme-provider.tsx"
import { TooltipProvider } from "@/components/ui/tooltip"
import { boot, mountDevTools } from "@/lib/logger"
import { queryClient } from "@/lib/query"

// ── Dev bootstrap ─────────────────────────────────────────────────────────────
mountDevTools()
boot.step("main.tsx mounting", {
  mode:    import.meta.env.MODE,
  apiBase: import.meta.env.VITE_API_URL || "/api via Vite proxy",
})

const rootEl = document.getElementById("root")
if (!rootEl) {
  boot.fail("root element #root not found in DOM")
  throw new Error("#root not found")
}
boot.step("root element found")

createRoot(rootEl).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <TooltipProvider>
          <App />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>
)

boot.ok("React tree mounted")
