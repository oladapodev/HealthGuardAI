/**
 * TanStack Query client + ts-rest typed hook client.
 *
 * Usage in components:
 *   import { tsr } from "@/lib/query"
 *
 *   // GET (query)
 *   const { data } = tsr.profile.get.useQuery()
 *   data?.body?.user   // fully typed
 *
 *   // POST (mutation)
 *   const loginMut = tsr.auth.login.useMutation()
 *   loginMut.mutate({ body: { email, password } })
 *
 *   // GET with path params
 *   const { data } = tsr.analyses.getById.useQuery({ params: { id } })
 *
 *   // GET with query params
 *   const { data } = tsr.checkins.list.useQuery({ query: { limit: 10 } })
 */

import { QueryClient } from "@tanstack/react-query"
import { initTsrReactQuery } from "@ts-rest/react-query/v5"
import { contract } from "./contract"
import { healthGuardFetcher } from "./fetcher"
import { boot } from "./logger"

// ─── TanStack QueryClient ──────────────────────────────────────────────────────

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 2,       // 2 min — lab data doesn't change mid-session
      retry: (failureCount, error) => {
        // Don't retry on 401 (auth) or 403 (forbidden) — these aren't transient
        const status = (error as { status?: number })?.status
        if (status === 401 || status === 403) return false
        return failureCount < 2
      },
    },
    mutations: {
      retry: false,
    },
  },
})

boot.step("QueryClient created")

// ─── ts-rest + TanStack Query typed client ────────────────────────────────────

export const tsr = initTsrReactQuery(contract, {
  baseUrl: import.meta.env.VITE_API_URL ?? "",
  api: healthGuardFetcher,
})

boot.step("ts-rest query client initialised", {
  baseUrl: import.meta.env.VITE_API_URL ?? "",
})
