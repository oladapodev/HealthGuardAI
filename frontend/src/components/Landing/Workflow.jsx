import { motion } from "framer-motion";
import { PlugZap, Bot, CheckCircle2 } from "lucide-react";

const steps = [
  {
    num: "01",
    icon: <PlugZap size={20} strokeWidth={1.8} />,
    title: "Connect Your Systems",
    description: "Integrate HealthGuard AI with your existing EHR and scheduling platforms in minutes via our FHIR-compliant API — no custom dev work required.",
  },
  {
    num: "02",
    icon: <Bot size={20} strokeWidth={1.8} />,
    title: "AI Processes & Reasons",
    description: "Our multi-agent engine automatically extracts data, cross-references patient history, maps environmental context, and generates structured insights.",
  },
  {
    num: "03",
    icon: <CheckCircle2 size={20} strokeWidth={1.8} />,
    title: "Review, Approve & Sync",
    description: "Clinicians review AI-prepared summaries, make any final edits, and push structured data directly to patient records — in one click.",
  },
];

const Workflow = () => {
  return (
    <section
      id="how-it-works"
      style={{
        padding: "100px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", marginBottom: 72 }}>
          <span style={{
            display: "inline-block", padding: "4px 12px",
            background: "var(--color-primary-light)", color: "var(--color-primary)",
            borderRadius: 99, fontSize: "0.75rem", fontWeight: 600,
            letterSpacing: "0.06em", textTransform: "uppercase", marginBottom: 16,
          }}>
            How It Works
          </span>
          <h2 style={{
            fontSize: "clamp(1.875rem, 3.5vw, 2.5rem)",
            fontWeight: 600, letterSpacing: "-0.03em", lineHeight: 1.2,
            color: "var(--text-primary)", maxWidth: 500, marginBottom: 16,
          }}>
            Live in days, not months
          </h2>
          <p style={{
            fontSize: "1.0625rem", lineHeight: 1.75,
            color: "var(--text-secondary)", maxWidth: 480,
          }}>
            HealthGuard AI is built for fast deployment. No rip-and-replace — it works alongside your existing stack from day one.
          </p>
        </div>

        {/* Steps */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, position: "relative" }}
          className="grid-cols-1 md:grid-cols-3"
        >
          {/* Connecting line (desktop only) */}
          <div
            aria-hidden="true"
            className="hidden md:block"
            style={{
              position: "absolute",
              top: 36,
              left: "calc(16.5% + 24px)",
              right: "calc(16.5% + 24px)",
              height: 1,
              background: "linear-gradient(90deg, transparent, var(--color-primary-subtle) 20%, var(--color-primary-subtle) 80%, transparent)",
            }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.12 }}
              style={{
                display: "flex", flexDirection: "column", alignItems: "center",
                textAlign: "center", position: "relative",
              }}
            >
              {/* Step disc */}
              <div style={{
                width: 72, height: 72,
                borderRadius: "50%",
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                boxShadow: "var(--shadow-card)",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: 28, position: "relative", zIndex: 1,
                color: "var(--color-primary)",
              }}>
                {step.icon}
                {/* Step number badge */}
                <div style={{
                  position: "absolute", top: -8, right: -8,
                  width: 24, height: 24, borderRadius: "50%",
                  background: "var(--color-primary)", color: "#fff",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "0.6875rem", fontWeight: 700,
                  border: "2px solid var(--bg-secondary)",
                }}>
                  {i + 1}
                </div>
              </div>

              {/* Card */}
              <div style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: 16, padding: "28px 24px",
                boxShadow: "var(--shadow-card)", width: "100%",
              }}>
                <h3 style={{
                  fontSize: "1.0625rem", fontWeight: 600,
                  letterSpacing: "-0.02em", color: "var(--text-primary)",
                  marginBottom: 12,
                }}>
                  {step.title}
                </h3>
                <p style={{
                  fontSize: "0.9375rem", lineHeight: 1.7,
                  color: "var(--text-secondary)",
                }}>
                  {step.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Workflow;
