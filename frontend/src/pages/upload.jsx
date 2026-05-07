import React, { useState } from "react";
import {
  Upload,
  FileText,
  X,
  CheckCircle2,
  AlertCircle,
  Brain,
  ShieldCheck,
  Zap,
  Microscope,
  Stethoscope,
  AlertTriangle,
  CloudUpload
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import api from "../api/axios";
import { useNavigate } from "react-router-dom";

const LabUpload = () => {
  const navigate = useNavigate();
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState([]);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") setDragActive(true);
    else if (e.type === "dragleave") setDragActive(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFiles(e.dataTransfer.files);
  };

  const handleFiles = (newFiles) => {
    const valid = Array.from(newFiles).filter(f =>
      f.type === "application/pdf" || f.type.startsWith("image/")
    );
    setFiles(prev => [...prev, ...valid]);
  };

  const startAnalysis = async () => {
    if (files.length === 0) return;
    setIsAnalyzing(true);
    setProgress(10);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("picture", files[0]);

      const interval = setInterval(() => {
        setProgress(prev => (prev < 90 ? prev + 5 : prev));
      }, 500);

      const response = await api.post("/health", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      clearInterval(interval);
      setProgress(100);

      if (response.data.success) {
        localStorage.setItem("lastAnalysis", JSON.stringify(response.data));
        setTimeout(() => navigate("/dashboard/home", { state: { analysis: response.data } }), 1000);
      } else {
        setError(response.data.message || "Analysis failed");
        setIsAnalyzing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Error connecting to server");
      setIsAnalyzing(false);
    }
  };

  const analysisSteps = [
    { label: "Document extraction", done: progress > 20 },
    { label: "Marker identification", done: progress > 40 },
    { label: "Risk modelling", done: progress > 60 },
    { label: "Clinician summary", done: progress > 80 },
  ];

  return (
    <div style={{ maxWidth: 960, margin: "0 auto" }} className="space-y-6 pb-12">
      {/* Header */}
      <div>
        <p className="section-label mb-1">Lab Intake</p>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          Lab Results Intelligence
        </h1>
        <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
          Upload medical reports for multi-agent AI analysis. Supports PDF and image formats with high-accuracy extraction.
        </p>
      </div>

      {/* Error */}
      {error && (
        <div
          className="flex items-center gap-3 px-4 py-3 rounded-xl"
          style={{ background: "var(--danger-light)", border: "1px solid rgba(220, 38, 38, 0.15)" }}
        >
          <AlertCircle size={16} style={{ color: "var(--danger)", flexShrink: 0 }} />
          <p className="text-sm font-medium" style={{ color: "var(--danger-text)" }}>{error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-4">
          {/* Drop Zone */}
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className="relative rounded-2xl transition-all"
            style={{
              border: `2px dashed ${dragActive ? "var(--color-primary)" : "var(--border-color)"}`,
              background: dragActive ? "var(--color-primary-light)" : "var(--bg-card)",
              padding: "52px 32px",
              textAlign: "center",
            }}
          >
            <div
              className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-5 transition-transform"
              style={{
                background: dragActive ? "var(--color-primary-subtle)" : "var(--color-primary-light)",
                color: "var(--color-primary)",
                transform: dragActive ? "scale(1.05)" : "scale(1)",
              }}
            >
              <CloudUpload size={28} strokeWidth={1.5} />
            </div>

            <h3 className="text-base font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
              {dragActive ? "Drop to upload" : "Drag & drop your files"}
            </h3>
            <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
              PDF, JPG, PNG supported · Max 10 MB per file
            </p>

            <input
              type="file"
              id="fileInput"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
              accept="application/pdf,image/*"
            />
            <button
              onClick={() => document.getElementById("fileInput").click()}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-90"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              <Upload size={15} strokeWidth={2} />
              Browse Files
            </button>
          </div>

          {/* File List */}
          <AnimatePresence>
            {files.length > 0 && !isAnalyzing && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="medical-card p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    Upload Queue ({files.length})
                  </h4>
                  <button
                    onClick={() => setFiles([])}
                    className="text-xs font-medium transition-colors hover:opacity-70"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Clear all
                  </button>
                </div>
                <div className="space-y-2 mb-5">
                  {files.map((file, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
                        >
                          <FileText size={15} strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-sm font-medium truncate" style={{ color: "var(--text-primary)", maxWidth: 220 }}>{file.name}</p>
                          <p className="text-xs" style={{ color: "var(--text-muted)" }}>{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setFiles(files.filter((_, i) => i !== idx))}
                        className="p-1.5 rounded-lg transition-colors hover:bg-red-50 dark:hover:bg-red-950/20"
                        style={{ color: "var(--text-muted)" }}
                      >
                        <X size={15} strokeWidth={1.8} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  onClick={startAnalysis}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  <Brain size={16} strokeWidth={1.8} />
                  Start Multi-Agent Analysis
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Analysis Progress */}
          {isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="medical-card p-6"
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-full border-2 animate-spin" style={{ borderColor: "var(--color-primary-subtle)", borderTopColor: "var(--color-primary)" }} />
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                    AI Agent Analysis
                  </p>
                </div>
                <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--color-primary)" }}>
                  {progress}%
                </span>
              </div>

              {/* Progress Bar */}
              <div className="h-1.5 rounded-full overflow-hidden mb-5" style={{ background: "var(--bg-secondary)" }}>
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: "var(--color-primary)" }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                {analysisSteps.map((step, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl"
                    style={{
                      background: step.done ? "var(--success-light)" : "var(--bg-secondary)",
                      border: `1px solid ${step.done ? "rgba(5, 150, 105, 0.15)" : "var(--border-color)"}`,
                      transition: "all 0.3s ease",
                    }}
                  >
                    <CheckCircle2
                      size={15}
                      strokeWidth={2}
                      style={{ color: step.done ? "var(--success)" : "var(--text-muted)", flexShrink: 0 }}
                    />
                    <span
                      className="text-xs font-medium"
                      style={{ color: step.done ? "var(--success-text)" : "var(--text-muted)" }}
                    >
                      {step.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          {/* Privacy Card */}
          <div
            className="rounded-2xl p-6 relative overflow-hidden"
            style={{
              background: "var(--text-primary)",
              color: "#fff",
            }}
          >
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck size={16} style={{ color: "#93C5FD" }} />
                <h4 className="text-sm font-semibold">Privacy & Security</h4>
              </div>
              <p className="text-xs leading-relaxed mb-4" style={{ color: "rgba(255,255,255,0.6)" }}>
                All data is encrypted end-to-end using AES-256. HIPAA-compliant extraction engines. Your data is never retained beyond the analysis session.
              </p>
              <div className="space-y-2.5">
                {[
                  { icon: <Microscope size={13} />, text: "Precise marker mapping" },
                  { icon: <Zap size={13} />, text: "Instant result categorization" },
                  { icon: <Stethoscope size={13} />, text: "Clinician-ready formatting" },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div style={{ color: "#93C5FD" }}>{item.icon}</div>
                    <span className="text-xs" style={{ color: "rgba(255,255,255,0.7)" }}>{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Disclaimer */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--warning-light)",
              border: "1px solid rgba(217, 119, 6, 0.15)",
            }}
          >
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle size={14} style={{ color: "var(--warning)" }} />
              <h4 className="text-sm font-semibold" style={{ color: "var(--warning-text)" }}>Medical Disclaimer</h4>
            </div>
            <p className="text-xs leading-relaxed" style={{ color: "var(--warning-text)", opacity: 0.85 }}>
              HealthGuard AI provides educational analysis only. It is not a substitute for professional medical advice, diagnosis, or treatment from a licensed clinician.
            </p>
          </div>

          {/* Supported formats */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
            }}
          >
            <h4 className="section-label mb-3" style={{ fontSize: "0.65rem" }}>Supported Report Types</h4>
            <div className="space-y-2">
              {["Complete Blood Count (CBC)", "Comprehensive Metabolic Panel", "Lipid Panel", "Thyroid Function Tests", "Urinalysis", "Custom Lab PDFs"].map((t, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: "var(--color-primary)" }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabUpload;
