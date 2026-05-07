import React, { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Moon,
  Sun,
  ChevronDown,
  User,
  ShieldCheck
} from "lucide-react";
import useTheme from "../../hooks/UseThemes";
import api from "../../api/axios";

const TopBar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("TopBar profile fetch error", err);
      }
    };
    fetchUser();
  }, []);

  const initials = user?.profile?.firstName
    ? `${user.profile.firstName[0]}${user.profile.lastName?.[0] || ""}`.toUpperCase()
    : null;

  return (
    <header
      className="flex items-center justify-between sticky top-0 z-30 transition-colors duration-200"
      style={{
        height: "64px",
        padding: "0 28px",
        background: "var(--bg-card)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      {/* Search Bar */}
      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search
            className="absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ width: 15, height: 15, color: "var(--text-muted)" }}
          />
          <input
            type="text"
            placeholder="Search records, reports, or ask AI..."
            className="input-field"
            style={{
              paddingLeft: "36px",
              paddingTop: "8px",
              paddingBottom: "8px",
              fontSize: "0.875rem",
              borderRadius: "10px",
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 ml-4">
        {/* HIPAA Badge */}
        <div
          className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
          style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
        >
          <ShieldCheck size={13} strokeWidth={2} />
          <span className="section-label" style={{ fontSize: "0.65rem", color: "var(--color-primary)" }}>
            HIPAA
          </span>
        </div>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: "var(--border-color)" }} />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="flex items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
          style={{
            width: "34px",
            height: "34px",
            color: "var(--text-secondary)",
          }}
          aria-label="Toggle theme"
        >
          {isDarkMode ? <Sun size={16} strokeWidth={1.8} /> : <Moon size={16} strokeWidth={1.8} />}
        </button>

        {/* Notifications */}
        <button
          className="relative flex items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
          style={{
            width: "34px",
            height: "34px",
            color: "var(--text-secondary)",
          }}
          aria-label="Notifications"
        >
          <Bell size={16} strokeWidth={1.8} />
          <span
            className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
            style={{ background: "var(--danger)" }}
          />
        </button>

        {/* Divider */}
        <div className="w-px h-5 mx-1" style={{ background: "var(--border-color)" }} />

        {/* Profile */}
        <button
          className="flex items-center gap-2.5 pl-1 pr-3 py-1.5 rounded-xl transition-colors hover:bg-slate-50 dark:hover:bg-white/5"
        >
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white flex-shrink-0 text-xs font-semibold"
            style={{ background: "linear-gradient(135deg, var(--color-primary) 0%, #1e40af 100%)" }}
          >
            {initials || <User size={15} />}
          </div>
          <div className="hidden md:block text-left">
            <p
              className="text-sm font-medium leading-none"
              style={{ color: "var(--text-primary)" }}
            >
              {user?.profile?.firstName
                ? `${user.profile.firstName} ${user.profile.lastName || ""}`.trim()
                : "Guest"}
            </p>
            <p
              className="section-label mt-1"
              style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}
            >
              Patient #{user?._id?.slice(-6).toUpperCase() || "------"}
            </p>
          </div>
          <ChevronDown
            size={14}
            strokeWidth={2}
            style={{ color: "var(--text-muted)" }}
          />
        </button>
      </div>
    </header>
  );
};

export default TopBar;