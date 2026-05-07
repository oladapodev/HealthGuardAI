import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Activity,
  Wind,
  Thermometer,
  Calendar,
  Brain,
  FileText,
  ChevronRight,
  Plus,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowUpRight
} from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from "recharts";
import api from "../../api/axios";

const healthData = [
  { name: 'Mon', value: 72 },
  { name: 'Tue', value: 75 },
  { name: 'Wed', value: 68 },
  { name: 'Thu', value: 82 },
  { name: 'Fri', value: 78 },
  { name: 'Sat', value: 85 },
  { name: 'Sun', value: 80 },
];

const riskData = [
  { name: 'Normal', value: 65, color: '#059669' },
  { name: 'Monitor', value: 25, color: '#D97706' },
  { name: 'Action', value: 10, color: '#DC2626' },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="medical-card px-3 py-2 text-sm" style={{ minWidth: 90 }}>
        <p className="section-label mb-0.5" style={{ fontSize: "0.6rem" }}>{label}</p>
        <p style={{ color: "var(--color-primary)", fontWeight: 600 }}>{payload[0].value}</p>
      </div>
    );
  }
  return null;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState(() => {
    const token = localStorage.getItem("token");
    if (token?.startsWith("mock-session-token")) {
      return { firstName: "Demo User", location: "New York" };
    }
    return null;
  });
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  });

  const [mood, setMood] = useState(null);
  const [stats, setStats] = useState({
    aqi: 42,
    humidity: 48,
    bmi: "22.5",
    pollen: "Low",
    insights: 0
  });
  const [detailInput, setDetailInput] = useState("");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) { navigate("/auth"); return; }
        if (token.startsWith("mock-session-token")) return;

        const response = await api.get("/users/profile");
        const user = response.data?.profile || response.data;
        if (user && user.firstName) {
          setUserProfile(user);
          let bmiValue = "22.5";
          if (user.height && user.weight) {
            const h = user.height / 100;
            bmiValue = (user.weight / (h * h)).toFixed(1);
          }
          setStats(prev => ({
            ...prev,
            insights: response.data.dailyLogs?.length || 0,
            bmi: bmiValue,
            aqi: user.location === "New York" ? 42 : 55,
            humidity: 48,
            pollen: "Low"
          }));
        }
      } catch (err) {
        console.error("Failed to fetch profile", err);
      }
    };
    fetchProfile();
  }, [navigate]);

  const moods = [
    { emoji: "😊", label: "Great" },
    { emoji: "😐", label: "Okay" },
    { emoji: "😔", label: "Tired" },
    { emoji: "🤒", label: "Unwell" },
    { emoji: "😰", label: "Anxious" },
  ];

  const handleMoodSelect = (m) => {
    setMood(m.label);
    if (m.label === "Tired" || m.label === "Unwell") {
      setStats(prev => ({ ...prev, insights: prev.insights + 1 }));
    }
  };

  const handleSaveCheckin = async () => {
    try {
      const logData = { mood: mood || "Neutral", notes: detailInput, date: new Date() };
      await api.post("/users/checkin", { log: logData });
      const numInput = parseInt(detailInput);
      if (!isNaN(numInput)) setStats(prev => ({ ...prev, aqi: numInput }));
      navigate(`/dashboard/chat?mood=${mood || 'Check-in'}`);
    } catch (err) {
      navigate(`/dashboard/chat?mood=${mood || 'Check-in'}`);
    }
  };

  const today = new Date().toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto" }} className="space-y-6 pb-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
        <div>
          <p className="section-label mb-1">{today}</p>
          <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {greeting},{" "}
            <span style={{ color: "var(--color-primary)" }}>{userProfile?.firstName || "there"}</span>
          </h1>
          <p className="mt-1 text-sm" style={{ color: "var(--text-secondary)" }}>
            Your health context is stable. Here's your clinical summary for today.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/dashboard/upload")}
            className="flex items-center gap-2 text-sm font-medium px-4 py-2 rounded-xl transition-all"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
            }}
          >
            <Plus size={15} strokeWidth={2} />
            Upload Lab Report
          </button>
        </div>
      </div>

      {/* Daily Check-in */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, #1D4ED8 0%, #1e40af 60%, #1e3a8a 100%)",
          padding: "28px 32px",
        }}
        aria-labelledby="checkin-title"
      >
        <div className="flex flex-col lg:flex-row lg:items-center gap-6">
          <div className="flex-shrink-0">
            <p className="text-xs font-medium mb-1" style={{ color: "rgba(255,255,255,0.6)", letterSpacing: "0.06em", textTransform: "uppercase" }}>
              Daily Check-in
            </p>
            <h2 id="checkin-title" className="text-lg font-semibold text-white">
              How are you feeling today?
            </h2>
          </div>

          <div className="flex flex-wrap items-center gap-2 flex-1">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => handleMoodSelect(m)}
                aria-pressed={mood === m.label}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all text-sm focus:outline-none"
                style={{
                  background: mood === m.label ? "#fff" : "rgba(255,255,255,0.12)",
                  color: mood === m.label ? "var(--color-primary)" : "rgba(255,255,255,0.85)",
                  fontWeight: mood === m.label ? 600 : 400,
                  border: mood === m.label ? "none" : "1px solid rgba(255,255,255,0.1)",
                }}
              >
                <span role="img" aria-label={m.label} style={{ fontSize: "1rem" }}>{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            <div
              className="flex items-center gap-2 rounded-xl px-3 py-2 flex-1"
              style={{ background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.1)", minWidth: 180 }}
            >
              <Plus size={14} style={{ color: "rgba(255,255,255,0.5)" }} />
              <input
                type="text"
                value={detailInput}
                onChange={(e) => setDetailInput(e.target.value)}
                placeholder="Add notes..."
                aria-label="Daily details input"
                className="bg-transparent border-none outline-none text-sm text-white placeholder:text-white/40 w-full"
              />
            </div>
            <button
              onClick={handleSaveCheckin}
              className="px-5 py-2 rounded-xl text-sm font-semibold transition-all flex-shrink-0 hover:opacity-90"
              style={{ background: "#fff", color: "var(--color-primary)" }}
            >
              Save & Chat
            </button>
          </div>
        </div>
      </motion.section>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<Wind size={17} strokeWidth={1.8} />}
          iconColor="#0369A1"
          iconBg="var(--info-light)"
          label="Air Quality (AQI)"
          value={stats.aqi}
          status={stats.aqi < 50 ? "Good" : "Moderate"}
          statusType={stats.aqi < 50 ? "success" : "warning"}
          desc="Localized atmospheric index"
          trend={stats.aqi < 50 ? "up" : "down"}
          trendValue="+2%"
        />
        <StatCard
          icon={<Activity size={17} strokeWidth={1.8} />}
          iconColor="var(--color-primary)"
          iconBg="var(--color-primary-light)"
          label="Body Mass Index"
          value={stats.bmi}
          status={parseFloat(stats.bmi) < 25 ? "Healthy" : "Monitor"}
          statusType={parseFloat(stats.bmi) < 25 ? "success" : "warning"}
          desc="Calculated from your profile"
          trend="neutral"
        />
        <StatCard
          icon={<Thermometer size={17} strokeWidth={1.8} />}
          iconColor="#059669"
          iconBg="var(--success-light)"
          label="Pollen Level"
          value={stats.pollen}
          status="Safe"
          statusType="success"
          desc="AI-analyzed local allergens"
          trend="up"
          trendValue="Low"
        />
        <StatCard
          icon={<Brain size={17} strokeWidth={1.8} />}
          iconColor="#7C3AED"
          iconBg="#F5F3FF"
          label="AI Insights"
          value={stats.insights}
          status="Ready"
          statusType="blue"
          desc="Pending clinical review"
          trend="up"
          trendValue="New"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Health Trend */}
        <div className="lg:col-span-2 medical-card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Health Signal Trends
              </h3>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Lab trends vs. environmental factors — weekly view
              </p>
            </div>
            <button
              onClick={() => navigate("/dashboard/reports")}
              className="flex items-center gap-1 text-xs font-medium transition-colors hover:opacity-80"
              style={{ color: "var(--color-primary)" }}
            >
              View all <ArrowUpRight size={13} />
            </button>
          </div>
          <div style={{ height: 220 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={healthData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="healthGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.12} />
                    <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter" }}
                />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border-color)", strokeWidth: 1 }} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#healthGrad)"
                  dot={false}
                  activeDot={{ r: 4, fill: "var(--color-primary)", stroke: "#fff", strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Risk Overview */}
        <div className="medical-card p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                Risk Distribution
              </h3>
              <p className="text-sm mt-0.5" style={{ color: "var(--text-secondary)" }}>
                Current clinical risk levels
              </p>
            </div>
          </div>
          <div style={{ height: 160 }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={riskData} margin={{ top: 0, right: 4, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-color)" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "var(--text-muted)", fontSize: 11, fontFamily: "Inter" }}
                />
                <YAxis hide />
                <Tooltip
                  cursor={{ fill: "var(--bg-secondary)", radius: 6 }}
                  contentStyle={{
                    borderRadius: "12px",
                    border: "1px solid var(--border-color)",
                    boxShadow: "var(--shadow-dropdown)",
                    fontFamily: "Inter",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[5, 5, 0, 0]} maxBarSize={48}>
                  {riskData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} opacity={0.85} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="mt-4 space-y-2">
            {riskData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs" style={{ color: "var(--text-secondary)" }}>{item.name}</span>
                </div>
                <span className="text-xs font-semibold" style={{ color: "var(--text-primary)" }}>{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Reports Quick Access */}
      <div className="medical-card p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
            Recent Reports
          </h3>
          <button
            onClick={() => navigate("/dashboard/reports")}
            className="text-xs font-medium flex items-center gap-1 transition-colors hover:opacity-80"
            style={{ color: "var(--color-primary)" }}
          >
            View archive <ChevronRight size={13} />
          </button>
        </div>
        <div className="space-y-2">
          {[
            { id: "RPT-8832", name: "Comprehensive Metabolic Panel", date: "May 05, 2026", status: "Action", statusType: "warning" },
            { id: "RPT-8831", name: "Routine CBC", date: "Apr 15, 2026", status: "Stable", statusType: "success" },
          ].map((report) => (
            <button
              key={report.id}
              onClick={() => navigate("/dashboard/reports")}
              className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left hover:bg-slate-50 dark:hover:bg-white/5 group"
              style={{ border: "1px solid var(--border-color)" }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: "var(--bg-secondary)" }}
                >
                  <FileText size={16} strokeWidth={1.8} style={{ color: "var(--text-muted)" }} />
                </div>
                <div>
                  <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{report.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{report.date} · #{report.id}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`badge badge-${report.statusType}`}>{report.status}</span>
                <ChevronRight size={15} className="opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: "var(--text-muted)" }} />
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, iconColor, iconBg, label, value, status, statusType, desc, trend, trendValue }) => {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;

  return (
    <div className="medical-card p-5 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: iconBg, color: iconColor }}
        >
          {icon}
        </div>
        {trendValue && (
          <div
            className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-medium"
            style={{
              background: statusType === "success" ? "var(--success-light)" : statusType === "blue" ? "var(--color-primary-light)" : "var(--bg-secondary)",
              color: statusType === "success" ? "var(--success-text)" : statusType === "blue" ? "var(--color-primary)" : "var(--text-secondary)"
            }}
          >
            <TrendIcon size={11} strokeWidth={2} />
            {trendValue}
          </div>
        )}
      </div>
      <div>
        <p className="section-label mb-1.5" style={{ fontSize: "0.65rem" }}>{label}</p>
        <div className="flex items-baseline gap-2">
          <span className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
            {value}
          </span>
          <span className={`badge badge-${statusType}`} style={{ fontSize: "0.6rem" }}>
            {status}
          </span>
        </div>
        <p className="text-xs mt-1.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
      </div>
    </div>
  );
};

export default Dashboard;
