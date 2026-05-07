import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, Heart, Activity, ShieldCheck, ChevronRight, ChevronLeft, Check } from "lucide-react";
import api from "../../api/axios";

const Onboarding = ({ onComplete }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    age: "",
    gender: "female",
    bloodGroup: "O+",
    conditions: "",
    allergies: "",
    medications: "",
    height: "",
    weight: "",
    activityLevel: "moderate",
    lastPeriodDate: "",
    cycleLength: "28",
    trackMenstrualCycle: false
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = () => setStep(step + 1);
  const handleBack = () => setStep(step - 1);

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("token");
      const profileData = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        height: formData.height ? parseFloat(formData.height) : null,
        weight: formData.weight ? parseFloat(formData.weight) : null,
        conditions: formData.conditions ? formData.conditions.split(",").map(s => s.trim()).filter(s => s) : [],
        allergies: formData.allergies ? formData.allergies.split(",").map(s => s.trim()).filter(s => s) : [],
        medications: formData.medications ? formData.medications.split(",").map(s => s.trim()).filter(s => s) : [],
        menstrualCycle: formData.trackMenstrualCycle
          ? { lastPeriodDate: formData.lastPeriodDate, cycleLength: parseInt(formData.cycleLength), active: true }
          : { active: false }
      };

      if (token?.startsWith("mock-session-token")) {
        console.log("Mock session — skipping API call.");
      } else {
        await api.put("/users/profile", { profile: profileData });
      }

      localStorage.setItem("onboarding_complete", "true");
      onComplete();
      window.location.href = "/dashboard";
    } catch (err) {
      console.error("Failed to update profile", err);
      localStorage.setItem("onboarding_complete", "true");
      onComplete();
      window.location.href = "/dashboard";
    }
  };

  const steps = [
    { title: "Basic Info", subtitle: "Tell us about yourself", icon: <User size={20} strokeWidth={1.8} /> },
    { title: "Physical Metrics", subtitle: "Body measurements & activity", icon: <Activity size={20} strokeWidth={1.8} /> },
    { title: "Medical Details", subtitle: "Health history & medications", icon: <Heart size={20} strokeWidth={1.8} /> },
  ];

  const inputStyle = {
    width: "100%",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 10,
    padding: "10px 14px",
    fontSize: "0.9375rem",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 6,
    fontSize: "0.6875rem",
    fontWeight: 500,
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    color: "var(--text-muted)",
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      style={{ background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(8px)" }}
    >
      <div
        className="w-full overflow-hidden"
        style={{
          maxWidth: 520,
          background: "var(--bg-card)",
          borderRadius: 24,
          border: "1px solid var(--border-color)",
          boxShadow: "0 20px 60px rgba(15, 23, 42, 0.15)",
        }}
      >
        {/* Step Progress Bar */}
        <div className="flex" style={{ height: 3 }}>
          {steps.map((_, i) => (
            <div
              key={i}
              className="flex-1 transition-all duration-500"
              style={{
                background: i < step ? "var(--color-primary)" : "var(--border-color)",
                marginRight: i < steps.length - 1 ? 2 : 0,
              }}
            />
          ))}
        </div>

        <div className="p-8 md:p-10">
          {/* Step Indicators */}
          <div className="flex items-center gap-2 mb-8">
            {steps.map((s, i) => (
              <React.Fragment key={i}>
                <div className="flex items-center gap-2">
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 text-xs font-semibold transition-all"
                    style={{
                      background: i + 1 < step
                        ? "var(--color-primary)"
                        : i + 1 === step
                          ? "var(--color-primary)"
                          : "var(--bg-secondary)",
                      color: i + 1 <= step ? "#fff" : "var(--text-muted)",
                      border: `1.5px solid ${i + 1 <= step ? "var(--color-primary)" : "var(--border-color)"}`,
                    }}
                  >
                    {i + 1 < step ? <Check size={13} strokeWidth={2.5} /> : i + 1}
                  </div>
                  {i + 1 === step && (
                    <span className="text-xs font-medium hidden sm:block" style={{ color: "var(--text-primary)" }}>
                      {s.title}
                    </span>
                  )}
                </div>
                {i < steps.length - 1 && (
                  <div className="flex-1 h-px" style={{ background: i + 1 < step ? "var(--color-primary)" : "var(--border-color)" }} />
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Header */}
          <header className="mb-7">
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4"
              style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
            >
              {steps[step - 1].icon}
            </div>
            <h1 className="text-xl font-semibold" style={{ color: "var(--text-primary)" }}>
              {steps[step - 1].title}
            </h1>
            <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
              {steps[step - 1].subtitle}
            </p>
          </header>

          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[["firstName", "First Name", "text"], ["lastName", "Last Name", "text"]].map(([name, label]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input
                        name={name}
                        value={formData[name]}
                        onChange={handleChange}
                        style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label style={labelStyle}>Age</label>
                    <input type="number" name="age" value={formData.age} onChange={handleChange} style={inputStyle}
                      onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>Gender</label>
                    <select name="gender" value={formData.gender} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other / Prefer not to say</option>
                    </select>
                  </div>
                </div>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                <div className="grid grid-cols-2 gap-4">
                  {[["height", "Height (cm)", "175"], ["weight", "Weight (kg)", "70"]].map(([name, label, ph]) => (
                    <div key={name}>
                      <label style={labelStyle}>{label}</label>
                      <input type="number" name={name} placeholder={ph} value={formData[name]} onChange={handleChange} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label style={labelStyle}>Activity Level</label>
                  <select name="activityLevel" value={formData.activityLevel} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                    <option value="sedentary">Sedentary (Little to no exercise)</option>
                    <option value="light">Light (1–3 days/week)</option>
                    <option value="moderate">Moderate (3–5 days/week)</option>
                    <option value="active">Active (6–7 days/week)</option>
                    <option value="very_active">Very Active (Twice daily / Physical job)</option>
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Blood Group</label>
                  <select name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} style={{ ...inputStyle, cursor: "pointer" }}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(g => <option key={g}>{g}</option>)}
                  </select>
                </div>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 12 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -12 }}
                transition={{ duration: 0.22 }}
                className="space-y-4"
              >
                {[
                  ["conditions", "Known Conditions", "e.g. Asthma, Hypertension (comma-separated)", true],
                  ["medications", "Current Medications", "e.g. Metformin, Albuterol", true],
                  ["allergies", "Allergies", "e.g. Penicillin, Pollen", false],
                ].map(([name, label, ph, isTextarea]) => (
                  <div key={name}>
                    <label style={labelStyle}>{label}</label>
                    {isTextarea ? (
                      <textarea name={name} placeholder={ph} value={formData[name]} onChange={handleChange} rows={2}
                        style={{ ...inputStyle, resize: "none" }}
                        onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                      />
                    ) : (
                      <input name={name} placeholder={ph} value={formData[name]} onChange={handleChange} style={inputStyle}
                        onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                        onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                      />
                    )}
                  </div>
                ))}

                {formData.gender === "female" && (
                  <div
                    className="rounded-2xl p-5 space-y-4"
                    style={{
                      background: "#FAF5FF",
                      border: "1px solid rgba(124, 58, 237, 0.12)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium" style={{ color: "#5B21B6" }}>Menstrual Cycle Tracking</p>
                        <p className="text-xs mt-0.5" style={{ color: "#7C3AED", opacity: 0.7 }}>Optional gender-specific insights</p>
                      </div>
                      <button
                        onClick={() => setFormData(f => ({ ...f, trackMenstrualCycle: !f.trackMenstrualCycle }))}
                        className="relative transition-colors"
                        style={{
                          width: 42, height: 24, borderRadius: 99,
                          background: formData.trackMenstrualCycle ? "#7C3AED" : "var(--border-strong)",
                        }}
                      >
                        <div className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
                          style={{ left: formData.trackMenstrualCycle ? "calc(100% - 20px)" : "4px" }} />
                      </button>
                    </div>
                    {formData.trackMenstrualCycle && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                        className="grid grid-cols-2 gap-3"
                      >
                        {[["lastPeriodDate", "Last Period Start", "date"], ["cycleLength", "Cycle Length (Days)", "number"]].map(([name, label, type]) => (
                          <div key={name}>
                            <label style={{ ...labelStyle, color: "#7C3AED" }}>{label}</label>
                            <input type={type} name={name} value={formData[name]} onChange={handleChange}
                              style={{ ...inputStyle, borderColor: "rgba(124, 58, 237, 0.2)" }}
                            />
                          </div>
                        ))}
                      </motion.div>
                    )}
                  </div>
                )}

                <div
                  className="flex items-start gap-3 p-4 rounded-xl"
                  style={{ background: "var(--color-primary-light)", border: "1px solid rgba(29,78,216,0.1)" }}
                >
                  <ShieldCheck size={15} strokeWidth={1.8} style={{ color: "var(--color-primary)", marginTop: 1, flexShrink: 0 }} />
                  <p className="text-xs leading-relaxed" style={{ color: "var(--color-primary)" }}>
                    Your health data is encrypted end-to-end and only used by the AI reasoning engine for personalized insights. Never shared with third parties.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation */}
          <footer className="mt-8 flex items-center justify-between">
            {step > 1 ? (
              <button onClick={handleBack}
                className="flex items-center gap-1.5 text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: "var(--text-secondary)" }}
              >
                <ChevronLeft size={16} strokeWidth={1.8} /> Back
              </button>
            ) : (
              <button
                onClick={() => { localStorage.setItem("onboarding_complete", "true"); onComplete(); window.location.href = "/dashboard"; }}
                className="text-sm font-medium transition-colors hover:opacity-70"
                style={{ color: "var(--text-muted)" }}
              >
                Skip for now
              </button>
            )}

            <div className="flex items-center gap-3">
              {step === 3 && (
                <button onClick={handleSubmit}
                  className="text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  No medical issues
                </button>
              )}
              {step < 3 ? (
                <button onClick={handleNext}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Continue <ChevronRight size={15} strokeWidth={2} />
                </button>
              ) : (
                <button onClick={handleSubmit}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "var(--text-primary)", color: "var(--bg-card)" }}
                >
                  Complete Profile <ChevronRight size={15} strokeWidth={2} />
                </button>
              )}
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;