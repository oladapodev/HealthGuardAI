import React, { useState } from "react";
import {
  FileText,
  Download,
  Printer,
  ArrowLeft,
  ShieldCheck,
  Brain,
  AlertCircle,
  Clock,
  ExternalLink,
  Bot,
  ChevronRight
} from "lucide-react";
import { motion } from "framer-motion";

const ClinicalReportView = ({ report, onBack }) => {
  const [viewMode, setViewMode] = useState("doctor");

  if (!report) return null;

  const markers = [
    { label: "Fasting Glucose", value: "104 mg/dL", reference: "65–99 mg/dL", status: "Elevated", statusType: "warning", pct: 72 },
    { label: "Hemoglobin A1c", value: "5.4%", reference: "4.0–5.6%", status: "Optimal", statusType: "success", pct: 52 },
    { label: "CRP (Inflammatory)", value: "2.1 mg/L", reference: "0.0–1.0 mg/L", status: "Elevated", statusType: "warning", pct: 68 },
  ];

  const agentSteps = [
    { agent: "Intake", icon: <FileText size={14} strokeWidth={1.8} />, status: "Verified", desc: "Extracted 42 markers from PDF" },
    { agent: "Context", icon: <Clock size={14} strokeWidth={1.8} />, status: "Applied", desc: "Age/Gender ranges adjusted" },
    { agent: "Insights", icon: <Bot size={14} strokeWidth={1.8} />, status: "Correlated", desc: "Environment & mood mapped" },
    { agent: "Safety", icon: <ShieldCheck size={14} strokeWidth={1.8} />, status: "Passed", desc: "No critical life-risks found" },
  ];

  const getStatusStyle = (type) => {
    if (type === "success") return { bg: "var(--success-light)", color: "var(--success-text)" };
    if (type === "warning") return { bg: "var(--warning-light)", color: "var(--warning-text)" };
    return { bg: "var(--danger-light)", color: "var(--danger-text)" };
  };

  return (
    <div style={{ maxWidth: 1060, margin: "0 auto" }} className="space-y-5 pb-20">
      {/* Sticky Nav */}
      <div
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 sticky top-0 z-20 py-3.5 px-1"
        style={{
          background: "rgba(var(--bg-primary-rgb, 248, 250, 252), 0.92)",
          backdropFilter: "blur(10px)",
          WebkitBackdropFilter: "blur(10px)",
          borderBottom: "1px solid var(--border-color)",
        }}
      >
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-medium transition-colors hover:opacity-70"
          style={{ color: "var(--text-secondary)" }}
        >
          <ArrowLeft size={16} strokeWidth={1.8} />
          Back to Archive
        </button>

        <div className="flex items-center gap-2.5">
          {/* View Mode Toggle */}
          <div
            className="flex items-center p-1 rounded-xl gap-1"
            style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
          >
            {[{ label: "Patient View", value: "patient" }, { label: "Clinician Bridge", value: "doctor" }].map(({ label, value }) => (
              <button
                key={value}
                onClick={() => setViewMode(value)}
                className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
                style={{
                  background: viewMode === value ? "var(--bg-card)" : "transparent",
                  color: viewMode === value ? "var(--color-primary)" : "var(--text-muted)",
                  boxShadow: viewMode === value ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                }}
              >
                {label}
              </button>
            ))}
          </div>

          <button
            className="flex items-center justify-center rounded-xl transition-colors hover:opacity-80"
            style={{
              width: 36,
              height: 36,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-muted)",
            }}
          >
            <Printer size={15} strokeWidth={1.8} />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            <Download size={14} strokeWidth={2} />
            PDF Export
          </button>
        </div>
      </div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="medical-card overflow-hidden"
      >
        {/* Report Header */}
        <div
          className="p-8"
          style={{
            background: viewMode === "doctor"
              ? "linear-gradient(135deg, var(--color-primary-light) 0%, var(--bg-card) 100%)"
              : "var(--bg-secondary)",
            borderBottom: "1px solid var(--border-color)",
          }}
        >
          <div className="flex flex-col md:flex-row justify-between gap-6">
            <div>
              <div className="flex items-center gap-2.5 mb-3">
                <span
                  className="badge"
                  style={
                    report.status === "Action"
                      ? { background: "var(--warning-light)", color: "var(--warning-text)" }
                      : { background: "var(--success-light)", color: "var(--success-text)" }
                  }
                >
                  {report.status}
                </span>
                <span
                  className="font-mono text-xs"
                  style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}
                >
                  ID: {report.id}
                </span>
              </div>
              <h1 className="text-2xl font-semibold mb-1.5" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
                {viewMode === "doctor" ? "Clinical Reasoning Summary" : "Understanding Your Results"}
              </h1>
              <p className="text-sm" style={{ color: "var(--text-secondary)" }}>
                {report.type} · Processed May 07, 2026
              </p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{
                  background: "var(--bg-card)",
                  border: "1px solid var(--border-color)",
                  color: "var(--color-primary)",
                }}
              >
                <ShieldCheck size={28} strokeWidth={1.5} />
              </div>
              <p className="section-label" style={{ fontSize: "0.6rem" }}>HealthGuard Verified</p>
            </div>
          </div>
        </div>

        {/* Multi-Agent Steps */}
        <div className="p-8" style={{ borderBottom: "1px solid var(--border-color)" }}>
          <div className="flex items-center gap-2 mb-5">
            <Brain size={16} strokeWidth={1.8} style={{ color: "var(--color-primary)" }} />
            <h2 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
              Multi-Agent Thinking Path
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {agentSteps.map((step, i) => (
              <div
                key={i}
                className="relative px-4 py-4 rounded-xl"
                style={{
                  background: "var(--bg-secondary)",
                  border: "1px solid var(--border-color)",
                }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
                  >
                    {step.icon}
                  </div>
                  <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>
                    {step.agent}
                  </span>
                </div>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {step.desc}
                </p>
                <div
                  className="absolute top-3.5 right-3.5 flex items-center gap-1"
                >
                  <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--success)" }} />
                  <span className="section-label" style={{ fontSize: "0.55rem", color: "var(--success-text)" }}>
                    {step.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3">
          {/* Main */}
          <div
            className="lg:col-span-2 p-8 space-y-8"
            style={{ borderRight: "1px solid var(--border-color)" }}
          >
            {/* Clinical Rationale */}
            <section>
              <h3 className="section-label mb-4">
                {viewMode === "doctor" ? "Clinical Rationale" : "What This Means"}
              </h3>
              <p
                className="leading-relaxed"
                style={{ color: "var(--text-primary)", fontSize: "0.9375rem" }}
              >
                {viewMode === "doctor" ? (
                  "Patient displays localized elevation in serum glucose (104 mg/dL) which, when mapped against subjective anxiety reports and a local pollen spike (High Oak), suggests a systemic inflammatory response rather than isolated metabolic dysfunction."
                ) : (
                  "Your blood sugar is slightly elevated today. We believe this is connected to reported stress levels and elevated outdoor pollen, which can affect your body's systems — rather than a direct metabolic issue."
                )}
              </p>
            </section>

            {/* Markers */}
            <section>
              <h3 className="section-label mb-4">Key Biomarkers</h3>
              <div className="space-y-3">
                {markers.map((m, i) => {
                  const style = getStatusStyle(m.statusType);
                  return (
                    <div
                      key={i}
                      className="p-4 rounded-xl"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{m.label}</p>
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            Reference: {m.reference}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{m.value}</p>
                          <span className="badge mt-1" style={{ background: style.bg, color: style.color, fontSize: "0.6rem" }}>
                            {m.status}
                          </span>
                        </div>
                      </div>
                      {/* Range indicator */}
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: "var(--border-color)" }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{
                            width: `${m.pct}%`,
                            background: m.statusType === "success" ? "var(--success)" : "var(--warning)",
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="p-8 space-y-5" style={{ background: "var(--bg-secondary)" }}>
            {/* Visit Prep */}
            <div className="medical-card p-5">
              <div className="flex items-center gap-2 mb-3">
                <Bot size={14} strokeWidth={1.8} style={{ color: "var(--color-primary)" }} />
                <h3 className="text-xs font-semibold" style={{ color: "var(--color-primary)" }}>
                  Visit Preparation
                </h3>
              </div>
              <p className="text-xs font-medium mb-3" style={{ color: "var(--text-primary)" }}>
                Questions to ask your doctor:
              </p>
              <div className="space-y-2.5">
                {[
                  "How do current pollen levels impact my glucose results?",
                  "Is my CRP level consistent with my stress symptoms?",
                  "Do my age-adjusted ranges show long-term stability?",
                ].map((q, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <ChevronRight size={12} style={{ color: "var(--color-primary)", marginTop: 2, flexShrink: 0 }} />
                    <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>{q}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Disclaimer */}
            <div
              className="p-4 rounded-xl"
              style={{
                background: "var(--warning-light)",
                border: "1px solid rgba(217, 119, 6, 0.15)",
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle size={13} style={{ color: "var(--warning)" }} />
                <p className="section-label" style={{ fontSize: "0.6rem", color: "var(--warning-text)" }}>Safety Notice</p>
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--warning-text)", opacity: 0.9 }}>
                This report was generated for patient preparedness. It is not a medical diagnosis. HealthGuard AI is an assistant, not a clinician.
              </p>
            </div>

            {/* Source */}
            <button className="w-full flex items-center justify-center gap-1.5 text-xs font-medium transition-colors hover:opacity-70" style={{ color: "var(--text-muted)" }}>
              <ExternalLink size={12} strokeWidth={1.8} />
              View Reference Guidelines (WHO/CDC)
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClinicalReportView;