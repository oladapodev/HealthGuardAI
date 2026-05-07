import React, { useState, useEffect } from "react";
import {
  User,
  Bell,
  Shield,
  Moon,
  Lock,
  Eye,
  Database,
  ExternalLink,
  ChevronRight,
  LogOut,
  Sun,
  Check
} from "lucide-react";
import { motion } from "framer-motion";
import useTheme from "../hooks/UseThemes";
import api from "../api/axios";

const Settings = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    labAlerts: true,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Settings profile fetch error", err);
      }
    };
    fetchUser();
  }, []);

  const sections = [
    {
      id: "account",
      title: "Account Security",
      icon: <Shield size={15} strokeWidth={1.8} />,
      iconColor: "var(--color-primary)",
      iconBg: "var(--color-primary-light)",
      items: [
        { label: "Change Password", value: "Last changed 3 months ago", icon: <Lock size={14} strokeWidth={1.8} /> },
        { label: "Two-Factor Authentication", value: "Enabled — SMS verification", icon: <Shield size={14} strokeWidth={1.8} />, badge: { text: "Active", type: "success" } },
        { label: "Login Activity", value: "Review recent sessions", icon: <Eye size={14} strokeWidth={1.8} /> },
      ]
    },
    {
      id: "data",
      title: "Data & Privacy",
      icon: <Database size={15} strokeWidth={1.8} />,
      iconColor: "var(--success)",
      iconBg: "var(--success-light)",
      items: [
        { label: "Health Data Sharing", value: "Clinical summary sharing is enabled", icon: <ExternalLink size={14} strokeWidth={1.8} /> },
        { label: "Download My Data", value: "Export full lab history (PDF / JSON)", icon: <Database size={14} strokeWidth={1.8} /> },
      ]
    }
  ];

  const ToggleSwitch = ({ value, onChange }) => (
    <button
      onClick={onChange}
      className="relative transition-colors flex-shrink-0"
      style={{
        width: 42,
        height: 24,
        borderRadius: 99,
        background: value ? "var(--color-primary)" : "var(--border-strong)",
      }}
      role="switch"
      aria-checked={value}
    >
      <div
        className="absolute top-1 w-4 h-4 rounded-full bg-white transition-transform"
        style={{
          left: value ? "calc(100% - 20px)" : "4px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }}
      />
    </button>
  );

  return (
    <div style={{ maxWidth: 1000, margin: "0 auto" }} className="space-y-6 pb-20">
      <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <p className="section-label mb-1">Preferences</p>
        <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
          System Settings
        </h1>
        <p className="text-sm mt-1" style={{ color: "var(--text-secondary)" }}>
          Configure your security, notifications, and clinical preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Profile Card */}
        <div className="space-y-4">
          {/* Profile */}
          <div className="medical-card p-7 text-center">
            <div className="relative inline-block mb-4">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto text-white"
                style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #1e3a8a 100%)" }}
              >
                <User size={34} strokeWidth={1.5} />
              </div>
              {/* Online indicator */}
              <div
                className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--success)",
                  border: "2px solid var(--bg-card)",
                }}
              >
                <Check size={10} strokeWidth={3} color="#fff" />
              </div>
            </div>

            <h3 className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              {user?.profile?.firstName
                ? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
                : "Guest User"}
            </h3>
            <p className="section-label mt-1" style={{ fontSize: "0.65rem" }}>
              {user?.role === "admin" ? "Admin Clinical Account" : "Premium Clinical Account"}
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
              ID #{user?._id?.slice(-6).toUpperCase() || "------"}
            </p>

            <button
              className="mt-6 w-full py-2.5 rounded-xl text-sm font-medium transition-all hover:opacity-80"
              style={{
                background: "var(--bg-secondary)",
                border: "1px solid var(--border-color)",
                color: "var(--text-secondary)",
              }}
            >
              Update Profile
            </button>
          </div>

          {/* Danger Zone */}
          <div
            className="rounded-2xl p-5"
            style={{
              background: "var(--danger-light)",
              border: "1px solid rgba(220, 38, 38, 0.12)",
            }}
          >
            <div className="flex items-center gap-2 mb-3">
              <LogOut size={14} strokeWidth={1.8} style={{ color: "var(--danger)" }} />
              <span className="section-label" style={{ fontSize: "0.6rem", color: "var(--danger-text)" }}>
                Danger Zone
              </span>
            </div>
            <button
              className="text-sm font-medium transition-colors hover:opacity-70"
              style={{ color: "var(--danger-text)" }}
            >
              Sign out of all devices
            </button>
          </div>
        </div>

        {/* Right: Settings */}
        <div className="lg:col-span-2 space-y-5">
          {/* Appearance */}
          <div className="medical-card p-7 space-y-6">
            {/* Section Header */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: "#EEF2FF", color: "#4338CA" }}
                >
                  {isDarkMode ? <Moon size={15} strokeWidth={1.8} /> : <Sun size={15} strokeWidth={1.8} />}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>Visual Preferences</p>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>Control the platform's appearance</p>
                </div>
              </div>
              {/* Theme Toggle Segmented */}
              <div
                className="flex items-center p-1 rounded-xl gap-1"
                style={{ background: "var(--bg-secondary)", border: "1px solid var(--border-color)" }}
              >
                {[
                  { label: "Light", active: !isDarkMode, onClick: () => isDarkMode && toggleTheme() },
                  { label: "Dark", active: isDarkMode, onClick: () => !isDarkMode && toggleTheme() },
                ].map(({ label, active, onClick }) => (
                  <button
                    key={label}
                    onClick={onClick}
                    className="px-3.5 py-2 rounded-lg text-xs font-medium transition-all"
                    style={{
                      background: active ? "var(--bg-card)" : "transparent",
                      color: active ? "var(--color-primary)" : "var(--text-muted)",
                      boxShadow: active ? "0 1px 3px rgba(0,0,0,0.06)" : "none",
                    }}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            <div className="h-px" style={{ background: "var(--border-color)" }} />

            {/* Notifications */}
            {[
              { key: "email", label: "Clinical Notifications", desc: "Lab result availability & agent alerts" },
              { key: "push", label: "Push Notifications", desc: "Real-time updates on your device" },
              { key: "labAlerts", label: "Critical Lab Alerts", desc: "Immediate notifications for urgent findings" },
            ].map(({ key, label, desc }) => (
              <div key={key} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{ background: "var(--info-light)", color: "var(--info)" }}
                  >
                    <Bell size={14} strokeWidth={1.8} />
                  </div>
                  <div>
                    <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{label}</p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{desc}</p>
                  </div>
                </div>
                <ToggleSwitch
                  value={notifications[key]}
                  onChange={() => setNotifications(n => ({ ...n, [key]: !n[key] }))}
                />
              </div>
            ))}
          </div>

          {/* Dynamic Sections */}
          {sections.map(section => (
            <div key={section.id} className="medical-card p-7">
              <div className="flex items-center gap-3 mb-5">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{ background: section.iconBg, color: section.iconColor }}
                >
                  {section.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>{section.title}</p>
                </div>
              </div>

              <div className="space-y-1">
                {section.items.map((item, i) => (
                  <button
                    key={i}
                    className="w-full flex items-center justify-between p-3.5 rounded-xl transition-all text-left group"
                    style={{ ":hover": { background: "var(--bg-secondary)" } }}
                    onMouseEnter={e => e.currentTarget.style.background = "var(--bg-secondary)"}
                    onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                  >
                    <div className="flex items-center gap-3.5">
                      <div style={{ color: "var(--text-muted)" }}>{item.icon}</div>
                      <div>
                        <p className="text-sm font-medium" style={{ color: "var(--text-primary)" }}>{item.label}</p>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>{item.value}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <span className={`badge badge-${item.badge.type}`} style={{ fontSize: "0.6rem" }}>
                          {item.badge.text}
                        </span>
                      )}
                      <ChevronRight size={15} strokeWidth={1.8} style={{ color: "var(--text-muted)" }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Settings;
