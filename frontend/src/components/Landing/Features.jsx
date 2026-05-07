import { Brain, FileText, Lock, Clock, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const features = [
  {
    icon: <Brain size={22} strokeWidth={1.6} />,
    color: "#1D4ED8",
    bg: "#EFF6FF",
    badge: "Core Engine",
    title: "Multi-Agent AI Diagnostics",
    description: "A coordinated system of specialized AI agents — each handling intake, context, reasoning, and safety — to produce clinician-grade outputs that can't be replicated by single-model systems.",
    points: ["Context-aware analysis", "Correlated with environmental data", "Integrated safety guardrails"],
  },
  {
    icon: <FileText size={22} strokeWidth={1.6} />,
    color: "#059669",
    bg: "#ECFDF5",
    badge: "Documentation",
    title: "Ambient Clinical Documentation",
    description: "Convert patient consultations into fully-structured clinical notes instantly. Our ambient AI eliminates hours of manual data entry per clinician per day.",
    points: ["EHR-ready note formatting", "ICD-10 code suggestions", "Real-time transcription"],
  },
  {
    icon: <Lock size={22} strokeWidth={1.6} />,
    color: "#7C3AED",
    bg: "#F5F3FF",
    badge: "Security",
    title: "Enterprise-Grade Security",
    description: "End-to-end AES-256 encryption, zero-trust access controls, and automated audit trails ensure your patient data is always protected and fully compliant.",
    points: ["HIPAA & SOC 2 Type II", "Role-based access control", "Automatic audit trails"],
  },
  {
    icon: <Clock size={22} strokeWidth={1.6} />,
    color: "#D97706",
    bg: "#FFFBEB",
    badge: "Efficiency",
    title: "Intelligent Workflow Automation",
    description: "HealthGuard AI learns your practice patterns and automates repetitive clinical tasks, from appointment prep to follow-up documentation.",
    points: ["40% less administrative time", "Automated prior auth", "Smart scheduling integration"],
  },
];

const Features = () => {
  return (
    <section
      id="features"
      style={{
        padding: "100px 0",
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 64 }}>
          <span style={{
            display: "inline-block",
            padding: "4px 12px",
            background: "var(--color-primary-light)",
            color: "var(--color-primary)",
            borderRadius: 99,
            fontSize: "0.75rem",
            fontWeight: 600,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            marginBottom: 16,
          }}>
            Platform Capabilities
          </span>
          <h2 style={{
            fontSize: "clamp(1.875rem, 3.5vw, 2.5rem)",
            fontWeight: 600,
            letterSpacing: "-0.03em",
            lineHeight: 1.2,
            color: "var(--text-primary)",
            maxWidth: 560,
            marginBottom: 16,
          }}>
            Every tool a modern clinical team needs
          </h2>
          <p style={{
            fontSize: "1.0625rem",
            lineHeight: 1.75,
            color: "var(--text-secondary)",
            maxWidth: 520,
          }}>
            HealthGuard AI replaces fragmented point solutions with one unified platform that gets smarter over time.
          </p>
        </div>

        {/* Feature Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 20 }}
          className="grid-cols-1 md:grid-cols-2"
        >
          {features.map((feature, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: i * 0.07 }}
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: 20,
                padding: "36px 36px 32px",
                boxShadow: "var(--shadow-card)",
                transition: "box-shadow 0.2s, transform 0.2s",
                cursor: "default",
              }}
              whileHover={{ y: -2, boxShadow: "0 8px 32px rgba(15,23,42,0.09)" }}
            >
              {/* Icon + Badge row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
                <div style={{
                  width: 48, height: 48, borderRadius: 14,
                  background: feature.bg,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: feature.color,
                }}>
                  {feature.icon}
                </div>
                <span style={{
                  fontSize: "0.6875rem", fontWeight: 600,
                  letterSpacing: "0.06em", textTransform: "uppercase",
                  padding: "4px 10px", borderRadius: 99,
                  background: "var(--bg-secondary)",
                  color: "var(--text-muted)",
                  border: "1px solid var(--border-color)",
                }}>
                  {feature.badge}
                </span>
              </div>

              {/* Title */}
              <h3 style={{
                fontSize: "1.125rem",
                fontWeight: 600,
                letterSpacing: "-0.02em",
                color: "var(--text-primary)",
                marginBottom: 10,
              }}>
                {feature.title}
              </h3>

              {/* Desc */}
              <p style={{
                fontSize: "0.9375rem",
                lineHeight: 1.7,
                color: "var(--text-secondary)",
                marginBottom: 24,
              }}>
                {feature.description}
              </p>

              {/* Points */}
              <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "flex", flexDirection: "column", gap: 8 }}>
                {feature.points.map((pt, j) => (
                  <li key={j} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <CheckCircle size={14} strokeWidth={2} style={{ color: feature.color, flexShrink: 0 }} />
                    <span style={{ fontSize: "0.875rem", color: "var(--text-secondary)" }}>{pt}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div style={{ textAlign: "center", marginTop: 56 }}>
          <Link
            to="/auth"
            style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "12px 28px", borderRadius: 12,
              background: "var(--color-primary)", color: "#fff",
              fontWeight: 600, fontSize: "0.9375rem",
              textDecoration: "none",
            }}
          >
            Start using all features free <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <p style={{ marginTop: 12, fontSize: "0.8125rem", color: "var(--text-muted)" }}>
            No credit card required · 14-day free trial
          </p>
        </div>
      </div>
    </section>
  );
};

export default Features;
