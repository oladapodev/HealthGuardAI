import { useNavigate } from "react-router-dom"
import { motion } from "motion/react"
import { WindIcon, ThermometerIcon, DropIcon, ArrowLeftIcon } from "@phosphor-icons/react"
import { tsr } from "@/lib/query"
import { Skeleton } from "@/components/ui/skeleton"
import { aqiLabel, aqiColor } from "@/lib/ui-helpers"

export default function EnvironmentPage() {
  const navigate = useNavigate()
  const { data, isPending } = tsr.analyses.list.useQuery({
    queryKey: ["analyses", "list", { limit: 1 }],
    queryData: { query: { limit: 1 } },
  })
  const latest = data?.body?.data?.[0]
  const ctx = latest?.context

  const POLLUTANTS = [
    { key: "pm2_5", label: "PM2.5" },
    { key: "pm10",  label: "PM10"  },
    { key: "no2",   label: "NO₂"   },
    { key: "o3",    label: "O₃"    },
  ] as const

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="space-y-5 pt-2"
    >
      <div className="flex items-center gap-2">
        <button onClick={() => navigate(-1)} className="text-muted-foreground hover:text-foreground">
          <ArrowLeftIcon size={18} />
        </button>
        <h1 className="font-heading text-xl font-bold">Environment</h1>
      </div>

      {isPending && [0,1,2].map(i => <Skeleton key={i} className="h-20 rounded-xl" />)}

      {!isPending && !ctx && (
        <div className="rounded-xl border border-dashed border-border p-10 text-center space-y-2">
          <p className="text-sm text-muted-foreground">No environment data yet.</p>
          <p className="text-xs text-muted-foreground">Run an analysis with your location to see local context.</p>
        </div>
      )}

      {!isPending && ctx && (
        <>
          {/* Location */}
          {ctx.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>📍</span>
              <span>{ctx.location}</span>
            </div>
          )}

          {/* AQI card */}
          {ctx.aqi != null && (
            <div className="rounded-xl border border-border bg-card p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <WindIcon size={20} className="text-primary" weight="duotone" />
                  <span className="text-sm font-semibold">Air quality</span>
                </div>
                <span className={`text-2xl font-bold tabular-nums ${aqiColor(ctx.aqi)}`}>{ctx.aqi}</span>
              </div>
              <p className={`text-sm font-medium ${aqiColor(ctx.aqi)}`}>{aqiLabel(ctx.aqi)}</p>
              <p className="text-xs text-muted-foreground">
                High AQI can affect respiratory and cardiovascular health, particularly for those with asthma or allergies.
              </p>
            </div>
          )}

          {/* Weather card */}
          {(ctx.temperature != null || ctx.humidity != null) && (
            <div className="rounded-xl border border-border bg-card p-4">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Weather</p>
              <div className="grid grid-cols-2 gap-3">
                {ctx.temperature != null && (
                  <div className="flex items-center gap-2">
                    <ThermometerIcon size={18} className="text-primary" weight="duotone" />
                    <div>
                      <p className="text-sm font-semibold">{ctx.temperature}°C</p>
                      <p className="text-xs text-muted-foreground">Temperature</p>
                    </div>
                  </div>
                )}
                {ctx.humidity != null && (
                  <div className="flex items-center gap-2">
                    <DropIcon size={18} className="text-primary" weight="duotone" />
                    <div>
                      <p className="text-sm font-semibold">{ctx.humidity}%</p>
                      <p className="text-xs text-muted-foreground">Humidity</p>
                    </div>
                  </div>
                )}
              </div>
              {ctx.condition && <p className="text-xs text-muted-foreground mt-2 capitalize">{ctx.condition}</p>}
            </div>
          )}

          {/* Pollutant chips */}
          <div className="space-y-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pollutants</p>
            <div className="flex flex-wrap gap-2">
              {POLLUTANTS.map(({ key, label }) => {
                const val = ctx[key]
                if (val == null) return null
                return (
                  <div key={key} className="flex items-center gap-1.5 bg-accent border border-border rounded-full px-3 py-1.5">
                    <span className="text-xs font-medium">{label}</span>
                    <span className="text-xs text-muted-foreground">{val} µg/m³</span>
                  </div>
                )
              })}
            </div>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed bg-accent/50 rounded-xl border border-border p-3">
            Environmental data is used to contextualise your lab results. High pollution levels may affect respiratory
            markers and allergy-related readings. Source: OpenWeatherMap.
          </p>
        </>
      )}
    </motion.div>
  )
}
