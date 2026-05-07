import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Brain, Activity, Zap, FileText, Users, TrendingUp, Lock } from "lucide-react";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className="relative overflow-hidden"
      style={{ paddingTop: "130px", paddingBottom: "80px", background: "var(--bg-primary)" }}
    >
      {/* Soft gradient orbs */}
      <div aria-hidden="true" className="absolute inset-0 pointer-events-none overflow-hidden">
        <div style={{
          position: "absolute", top: "-10%", right: "-5%",
          width: 600, height: 600, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,78,216,0.07) 0%, transparent 70%)",
        }} />
        <div style={{
          position: "absolute", bottom: "-10%", left: "-5%",
          width: 500, height: 500, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(29,78,216,0.05) 0%, transparent 70%)",
        }} />
      </div>

      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px", position: "relative", zIndex: 1 }}>
        {/* Top label */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}
        >
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "6px 14px", borderRadius: 99,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            boxShadow: "var(--shadow-card)",
          }}>
            <span style={{ width: 7, height: 7, borderRadius: "50%", background: "var(--success)", display: "inline-block", animation: "pulse 2s infinite" }} />
            <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>
              HealthGuard AI 2.0 — Now live for clinicians worldwide
            </span>
          </div>
        </motion.div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.08 }}
          style={{ textAlign: "center", marginBottom: 24 }}
        >
          <h1 style={{
            fontSize: "clamp(2.5rem, 5.5vw, 4rem)",
            fontWeight: 600,
            lineHeight: 1.13,
            letterSpacing: "-0.035em",
            color: "var(--text-primary)",
            margin: 0,
          }}>
            The operating system<br />
            <span style={{
              background: "linear-gradient(135deg, #1D4ED8 0%, #0369a1 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}>
              for modern clinical AI
            </span>
          </h1>
        </motion.div>

        {/* Sub */}
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.15 }}
          style={{
            textAlign: "center",
            fontSize: "1.125rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            maxWidth: 560,
            margin: "0 auto 40px",
          }}
        >
          Streamline clinical workflows, surface AI-powered insights, and secure patient data — all in one platform built for medical professionals.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.22 }}
          style={{ display: "flex", flexWrap: "wrap", justifyContent: "center", gap: 12, marginBottom: 64 }}
        >
          <Link to="/dashboard" style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 12,
            background: "var(--color-primary)", color: "#fff",
            fontWeight: 600, fontSize: "0.9375rem",
            textDecoration: "none",
            transition: "opacity 0.15s, transform 0.15s",
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = "0.9"}
            onMouseLeave={e => e.currentTarget.style.opacity = "1"}
          >
            Start Free Trial <ArrowRight size={17} strokeWidth={2} />
          </Link>
          <button style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            padding: "12px 24px", borderRadius: 12,
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            color: "var(--text-primary)",
            fontWeight: 500, fontSize: "0.9375rem",
            cursor: "pointer",
          }}>
            Book a Demo
          </button>
        </motion.div>

        {/* Dashboard Preview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          style={{ position: "relative" }}
        >
          {/* Glow behind preview */}
          <div aria-hidden="true" style={{
            position: "absolute", inset: 0,
            background: "radial-gradient(ellipse at 50% 100%, rgba(29,78,216,0.12) 0%, transparent 65%)",
            pointerEvents: "none",
          }} />

          {/* Preview Card */}
          <div style={{
            background: "var(--bg-card)",
            border: "1px solid var(--border-color)",
            borderRadius: 20,
            overflow: "hidden",
            boxShadow: "0 4px 6px -1px rgba(15,23,42,0.05), 0 24px 80px -12px rgba(15,23,42,0.12)",
            maxWidth: 900,
            margin: "0 auto",
          }}>
            {/* Browser bar */}
            <div style={{
              display: "flex", alignItems: "center", gap: 6,
              padding: "12px 16px",
              background: "var(--bg-secondary)",
              borderBottom: "1px solid var(--border-color)",
            }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#FBBF24" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#34D399" }} />
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: "#F87171" }} />
              <div style={{
                flex: 1, margin: "0 12px",
                background: "var(--bg-card)", border: "1px solid var(--border-color)",
                borderRadius: 6, padding: "3px 10px",
                fontSize: "0.6875rem", color: "var(--text-muted)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
                <Lock size={10} strokeWidth={2} />
                app.healthguard.ai/dashboard
              </div>
            </div>

            {/* Mock Dashboard */}
            <div style={{ display: "flex", minHeight: 420 }}>
              {/* Sidebar */}
              <div style={{
                width: 180, flexShrink: 0,
                background: "var(--bg-card)",
                borderRight: "1px solid var(--border-color)",
                padding: "20px 12px",
              }}>
                {/* Logo */}
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, paddingLeft: 4 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--color-primary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Brain size={14} color="#fff" strokeWidth={1.8} />
                  </div>
                  <span style={{ fontSize: "0.8125rem", fontWeight: 600, color: "var(--text-primary)" }}>HealthGuard</span>
                </div>
                {/* Nav Items */}
                {[
                  { icon: <Activity size={13} strokeWidth={1.8} />, label: "Overview", active: true },
                  { icon: <FileText size={13} strokeWidth={1.8} />, label: "Archive", active: false },
                  { icon: <Brain size={13} strokeWidth={1.8} />, label: "AI Chat", active: false },
                  { icon: <TrendingUp size={13} strokeWidth={1.8} />, label: "Timeline", active: false },
                  { icon: <Users size={13} strokeWidth={1.8} />, label: "Settings", active: false },
                ].map((item, i) => (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "7px 10px", borderRadius: 8, marginBottom: 2,
                    background: item.active ? "var(--color-primary-light)" : "transparent",
                    color: item.active ? "var(--color-primary)" : "var(--text-muted)",
                    fontSize: "0.75rem", fontWeight: item.active ? 600 : 400,
                    position: "relative",
                  }}>
                    {item.active && (
                      <span style={{
                        position: "absolute", left: 0, top: "50%", transform: "translateY(-50%)",
                        width: 2, height: 16, background: "var(--color-primary)", borderRadius: "0 2px 2px 0",
                      }} />
                    )}
                    {item.icon}
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div style={{ flex: 1, padding: 20, background: "var(--bg-primary)", overflowY: "auto" }}>
                {/* Stats row */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 16 }}>
                  {[
                    { label: "AQI Index", value: "42", tag: "Good", tagColor: "var(--success)", tagBg: "var(--success-light)" },
                    { label: "BMI Score", value: "22.5", tag: "Healthy", tagColor: "var(--success)", tagBg: "var(--success-light)" },
                    { label: "Pollen", value: "Low", tag: "Safe", tagColor: "var(--success)", tagBg: "var(--success-light)" },
                    { label: "AI Insights", value: "3", tag: "New", tagColor: "var(--color-primary)", tagBg: "var(--color-primary-light)" },
                  ].map((card, i) => (
                    <div key={i} style={{
                      background: "var(--bg-card)", border: "1px solid var(--border-color)",
                      borderRadius: 12, padding: "12px 14px",
                    }}>
                      <p style={{ fontSize: "0.6rem", fontWeight: 600, letterSpacing: "0.07em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: 6 }}>{card.label}</p>
                      <p style={{ fontSize: "1.25rem", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em", marginBottom: 4 }}>{card.value}</p>
                      <span style={{ fontSize: "0.6rem", fontWeight: 500, padding: "2px 7px", borderRadius: 99, background: card.tagBg, color: card.tagColor }}>{card.tag}</span>
                    </div>
                  ))}
                </div>

                {/* Chart area */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  {/* Area chart mock */}
                  <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border-color)",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Health Signal Trends</p>
                    <svg width="100%" height="80" viewBox="0 0 200 80" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="heroChartGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#1D4ED8" stopOpacity="0.15" />
                          <stop offset="100%" stopColor="#1D4ED8" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      <path d="M0 55 C20 50 35 30 60 32 S90 50 110 40 S150 20 180 28 L200 25 L200 80 L0 80 Z" fill="url(#heroChartGrad)" />
                      <path d="M0 55 C20 50 35 30 60 32 S90 50 110 40 S150 20 180 28 L200 25" fill="none" stroke="#1D4ED8" strokeWidth="1.5" />
                      {[[0,55],[60,32],[110,40],[180,28],[200,25]].map(([x,y],i) => (
                        <circle key={i} cx={x} cy={y} r="2.5" fill="#1D4ED8" />
                      ))}
                    </svg>
                    <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
                      {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map(d => (
                        <span key={d} style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>{d}</span>
                      ))}
                    </div>
                  </div>

                  {/* Risk distribution mock */}
                  <div style={{
                    background: "var(--bg-card)", border: "1px solid var(--border-color)",
                    borderRadius: 12, padding: "14px 16px",
                  }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 12 }}>Risk Distribution</p>
                    <div style={{ display: "flex", alignItems: "flex-end", gap: 8, height: 60 }}>
                      {[
                        { label: "Normal", pct: 65, color: "#059669" },
                        { label: "Monitor", pct: 25, color: "#D97706" },
                        { label: "Action", pct: 10, color: "#DC2626" },
                      ].map(bar => (
                        <div key={bar.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                          <div style={{ width: "100%", height: `${bar.pct * 0.85}%`, background: bar.color, borderRadius: "4px 4px 0 0", opacity: 0.85 }} />
                          <span style={{ fontSize: "0.55rem", color: "var(--text-muted)" }}>{bar.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent reports row */}
                <div style={{ marginTop: 12, background: "var(--bg-card)", border: "1px solid var(--border-color)", borderRadius: 12, padding: "12px 14px" }}>
                  <p style={{ fontSize: "0.75rem", fontWeight: 600, color: "var(--text-primary)", marginBottom: 10 }}>Recent Reports</p>
                  {[
                    { name: "Comprehensive Metabolic Panel", date: "May 05", status: "Action", statusColor: "#D97706", statusBg: "#FFFBEB" },
                    { name: "Routine CBC", date: "Apr 15", status: "Stable", statusColor: "#059669", statusBg: "#ECFDF5" },
                  ].map((r, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 0", borderTop: i > 0 ? "1px solid var(--border-color)" : "none" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ width: 28, height: 28, borderRadius: 8, background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <FileText size={12} strokeWidth={1.8} color="var(--text-muted)" />
                        </div>
                        <div>
                          <p style={{ fontSize: "0.725rem", fontWeight: 500, color: "var(--text-primary)", margin: 0 }}>{r.name}</p>
                          <p style={{ fontSize: "0.6rem", color: "var(--text-muted)", margin: 0 }}>{r.date}</p>
                        </div>
                      </div>
                      <span style={{ fontSize: "0.6rem", fontWeight: 500, padding: "2px 8px", borderRadius: 99, background: r.statusBg, color: r.statusColor }}>{r.status}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Trust strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "center",
            gap: "20px 40px", marginTop: 44,
            paddingTop: 36, borderTop: "1px solid var(--border-color)",
          }}
        >
          {[
            { icon: <ShieldCheck size={14} strokeWidth={2} />, label: "HIPAA Compliant" },
            { icon: <Lock size={14} strokeWidth={2} />, label: "SOC 2 Type II" },
            { icon: <Activity size={14} strokeWidth={2} />, label: "99.9% Uptime" },
            { icon: <Users size={14} strokeWidth={2} />, label: "12,000+ Clinicians" },
            { icon: <Brain size={14} strokeWidth={2} />, label: "Multi-Agent AI" },
          ].map((b, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, color: "var(--text-muted)" }}>
              {b.icon}
              <span style={{ fontSize: "0.8125rem", color: "var(--text-secondary)", fontWeight: 500 }}>{b.label}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Hero;
