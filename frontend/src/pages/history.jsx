import React, { useState } from "react";
import {
  MapPin,
  Wind,
  Sun,
  Activity,
  Brain,
  Zap
} from "lucide-react";
import { motion } from "framer-motion";

const History = () => {
  const [selectedDay, setSelectedDay] = useState(null);

  const entries = [
    {
      date: "Oct 24, 2024",
      time: "08:30 AM",
      location: "San Francisco, CA",
      events: [
        { type: "Lab Upload", title: "Metabolic Panel Analysis", status: "Critical" },
        { type: "Environment", title: "AQI: 84 (Moderate)", icon: <Wind size={13} strokeWidth={1.8} /> },
        { type: "Lifestyle", title: "6.5h Sleep · High Activity", icon: <Zap size={13} strokeWidth={1.8} /> },
      ],
      aiConclusion: "Increased pollution levels correlated with slight elevation in inflammatory markers."
    },
    {
      date: "Oct 22, 2024",
      time: "10:15 AM",
      location: "San Francisco, CA",
      events: [
        { type: "Check-in", title: "Slight Fatigue · Allergies active", status: "Monitor" },
        { type: "Environment", title: "Pollen: Extreme (Oak)", icon: <Activity size={13} strokeWidth={1.8} /> },
      ],
      aiConclusion: "High oak pollen density matches patient's current symptomatic report."
    },
    {
      date: "Oct 20, 2024",
      time: "09:00 AM",
      location: "Oakland, CA",
      events: [
        { type: "Lab Upload", title: "CBC Panel Review", status: "Stable" },
        { type: "Environment", title: "AQI: 32 (Good)", icon: <Sun size={13} strokeWidth={1.8} /> },
      ],
      aiConclusion: "Baseline steady. Environmental factors optimal for recovery."
    }
  ];

  const getStatusColor = (status) => {
    if (status === "Critical") return "var(--danger)";
    if (status === "Monitor") return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div style={{ maxWidth: 860, margin: "0 auto" }} className="space-y-6 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">Patient Record</p>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Health Timeline
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Correlating biological data with environmental and lifestyle history.
          </p>
        </div>
        <div
          className="flex items-center p-1 rounded-xl gap-1 self-start"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
        >
          {["Timeline", "Calendar"].map((view) => (
            <button
              key={view}
              className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: view === "Timeline" ? "var(--bg-card)" : "transparent",
                color: view === "Timeline" ? "var(--color-primary)" : "var(--text-muted)",
                boxShadow: view === "Timeline" ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Continuous Line */}
        <div
          className="absolute left-[5px] top-4 bottom-0 w-px"
          style={{ background: "var(--border-color)" }}
        />

        <div className="space-y-10">
          {entries.map((entry, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.35, delay: idx * 0.08 }}
              className="relative pl-10"
            >
              {/* Timeline Dot */}
              <div
                className="absolute left-0 top-4 w-2.5 h-2.5 rounded-full"
                style={{
                  background: "var(--bg-card)",
                  border: `2px solid var(--color-primary)`,
                  zIndex: 1,
                }}
              />

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mb-3">
                <span className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                  {entry.date}
                </span>
                <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {entry.time}
                </span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "var(--text-muted)" }}>
                  <MapPin size={11} strokeWidth={1.8} />
                  {entry.location}
                </span>
              </div>

              {/* Entry Card */}
              <div
                className="medical-card p-5 transition-all"
                style={{ marginLeft: 0 }}
              >
                {/* Events Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
                  {entry.events.map((event, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 rounded-xl"
                      style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                      }}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="section-label" style={{ fontSize: "0.6rem" }}>
                          {event.type}
                        </span>
                        <div style={{ color: "var(--color-primary)" }}>
                          {event.icon}
                        </div>
                        {event.status && (
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{
                              background: getStatusColor(event.status),
                              ...(event.status === "Critical" ? { animation: "pulse 2s infinite" } : {}),
                            }}
                          />
                        )}
                      </div>
                      <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>
                        {event.title}
                      </p>
                    </div>
                  ))}
                </div>

                {/* AI Conclusion */}
                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: "var(--color-primary-light)",
                    border: "1px solid rgba(29, 78, 216, 0.1)",
                  }}
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    <Brain size={14} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="section-label mb-1" style={{ fontSize: "0.6rem", color: "var(--color-primary)" }}>
                      AI Contextual Conclusion
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                      {entry.aiConclusion}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default History;
