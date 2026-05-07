import React, { useState } from "react";
import {
  FileText,
  Search,
  Download,
  ChevronRight,
  Calendar,
  User as UserIcon,
  Eye,
  MoreVertical,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Printer,
  Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ClinicalReportView from "../components/Dashboard/ClinicalReportView";

const Reports = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [showClinicianView, setShowClinicianView] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);

  const reports = [
    {
      id: "RPT-8832",
      patient: "Alex (You)",
      type: "Comprehensive Metabolic Panel",
      date: "May 05, 2026",
      status: "Action",
      doctor: "For Clinical Review",
      reasoning: "Glucose slightly elevated; correlated with reported high-stress morning and low sleep context.",
      clinicianSummary: "Patient presents with fasting glucose of 104 mg/dL. Multi-agent analysis integrates lifestyle data (4h sleep, reported anxiety) and environmental factors (AQI 110). Recommendation: Review metabolic markers in context of cortisol hygiene."
    },
    {
      id: "RPT-8831",
      patient: "Alex (You)",
      type: "Routine CBC",
      date: "April 15, 2026",
      status: "Stable",
      doctor: "Internal Reference",
      reasoning: "All parameters within normal age-adjusted ranges. Hemoglobin optimal.",
      clinicianSummary: "Hematological profile stable. WBC, RBC, and Platelets within reference intervals. No clinical action indicated."
    },
  ];

  if (selectedReport) {
    return <ClinicalReportView report={selectedReport} onBack={() => setSelectedReport(null)} />;
  }

  const getStatusConfig = (status) => {
    switch (status) {
      case "Critical": return { bg: "var(--danger-light)", color: "var(--danger-text)", icon: <AlertTriangle size={14} strokeWidth={2} /> };
      case "Stable": return { bg: "var(--success-light)", color: "var(--success-text)", icon: <CheckCircle2 size={14} strokeWidth={2} /> };
      case "Review": return { bg: "var(--warning-light)", color: "var(--warning-text)", icon: <Clock size={14} strokeWidth={2} /> };
      case "Action": return { bg: "var(--warning-light)", color: "var(--warning-text)", icon: <Tag size={14} strokeWidth={2} /> };
      default: return { bg: "var(--bg-secondary)", color: "var(--text-muted)", icon: <FileText size={14} strokeWidth={2} /> };
    }
  };

  const filteredReports = reports.filter(r =>
    r.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto" }} className="space-y-6 pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">Clinical Archive</p>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            Reports & Summaries
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
            Manage and export all AI-generated clinical bridge summaries.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            className="flex items-center justify-center rounded-xl transition-colors hover:opacity-80"
            style={{
              width: 38,
              height: 38,
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-secondary)",
            }}
          >
            <Printer size={16} strokeWidth={1.8} />
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all hover:opacity-90"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            <Download size={15} strokeWidth={2} />
            Bulk Export
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div
        className="medical-card p-4 flex flex-col lg:flex-row gap-3"
      >
        <div className="relative flex-grow">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2"
            size={15}
            style={{ color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search by report type or ID..."
            className="w-full text-sm"
            style={{
              background: "var(--bg-secondary)",
              border: "1px solid var(--border-color)",
              borderRadius: "10px",
              padding: "9px 14px 9px 36px",
              color: "var(--text-primary)",
              outline: "none",
            }}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* View Toggle */}
        <div
          className="flex items-center p-1 rounded-xl gap-1 flex-shrink-0"
          style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
        >
          {[
            { label: "Patient View", value: false },
            { label: "Clinician Bridge", value: true },
          ].map(({ label, value }) => (
            <button
              key={label}
              onClick={() => setShowClinicianView(value)}
              className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
              style={{
                background: showClinicianView === value ? "var(--bg-card)" : "transparent",
                color: showClinicianView === value ? "var(--color-primary)" : "var(--text-muted)",
                boxShadow: showClinicianView === value ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Reports List */}
      <div className="space-y-3">
        {filteredReports.length === 0 ? (
          <div className="medical-card p-12 text-center">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
              style={{ background: "var(--bg-secondary)", color: "var(--text-muted)" }}
            >
              <FileText size={24} strokeWidth={1.5} />
            </div>
            <p className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>No reports found</p>
            <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>Try adjusting your search term</p>
          </div>
        ) : (
          filteredReports.map((report) => {
            const statusConfig = getStatusConfig(report.status);
            return (
              <motion.div
                layout
                key={report.id}
                onClick={() => setSelectedReport(report)}
                className="medical-card p-5 cursor-pointer group transition-all"
                whileHover={{ y: -1 }}
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                  {/* Left: Report Info */}
                  <div className="flex items-start gap-4">
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105"
                      style={{ background: statusConfig.bg, color: statusConfig.color }}
                    >
                      {statusConfig.icon}
                    </div>
                    <div>
                      <div className="flex items-center gap-2.5 mb-1">
                        <h3
                          className="text-sm font-semibold transition-colors group-hover:text-blue-600"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {report.patient}
                        </h3>
                        <span
                          className="font-mono text-xs px-2 py-0.5 rounded-lg"
                          style={{
                            background: "var(--bg-secondary)",
                            color: "var(--text-muted)",
                            border: "1px solid var(--border-color)",
                            fontSize: "0.65rem",
                          }}
                        >
                          #{report.id}
                        </span>
                        <span
                          className="badge"
                          style={{ background: statusConfig.bg, color: statusConfig.color }}
                        >
                          {report.status}
                        </span>
                      </div>
                      <p className="text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                        {report.type}
                      </p>
                      <div className="flex flex-wrap items-center gap-4">
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <Calendar size={12} strokeWidth={1.8} />
                          {report.date}
                        </span>
                        <span className="flex items-center gap-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                          <UserIcon size={12} strokeWidth={1.8} />
                          {report.doctor}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Middle: AI Summary */}
                  <div
                    className="flex-grow lg:max-w-md px-4 py-3 rounded-xl"
                    style={{
                      background: "var(--bg-secondary)",
                      border: "1px dashed var(--border-color)",
                    }}
                  >
                    <p className="section-label mb-1.5 flex items-center gap-1.5" style={{ fontSize: "0.6rem" }}>
                      <Eye size={10} strokeWidth={2} />
                      {showClinicianView ? "Clinical Summary" : "AI Reasoning"}
                    </p>
                    <p className="text-xs leading-relaxed italic" style={{ color: "var(--text-secondary)" }}>
                      "{showClinicianView ? report.clinicianSummary : report.reasoning}"
                    </p>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={(e) => { e.stopPropagation(); setSelectedReport(report); }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold transition-all hover:opacity-90"
                      style={{ background: "var(--color-primary)", color: "#fff" }}
                    >
                      Review
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center rounded-xl transition-colors hover:opacity-80"
                      style={{
                        width: 34,
                        height: 34,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <Download size={14} strokeWidth={1.8} />
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center justify-center rounded-xl transition-colors hover:opacity-80"
                      style={{
                        width: 34,
                        height: 34,
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border-color)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <MoreVertical size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default Reports;
