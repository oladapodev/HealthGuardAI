import React from "react";
import {
  LayoutDashboard,
  Upload,
  MessageSquare,
  History,
  FileText,
  Settings,
  LogOut,
  Brain,
  Activity
} from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const menuItems = [
  {
    title: "Overview",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    title: "Intelligence Chat",
    icon: MessageSquare,
    path: "/dashboard/chat",
  },
  {
    title: "Lab Intake",
    icon: Upload,
    path: "/dashboard/upload",
  },
  {
    title: "Archive",
    icon: FileText,
    path: "/dashboard/reports",
  },
  {
    title: "Timeline",
    icon: History,
    path: "/dashboard/history",
  },
];

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    Swal.fire({
      title: "End Session?",
      text: "You will be signed out of HealthGuard AI.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4ED8",
      cancelButtonColor: "#64748B",
      confirmButtonText: "Sign Out",
      cancelButtonText: "Stay",
      customClass: {
        popup: "rounded-2xl shadow-xl",
      }
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        navigate("/login");
      }
    });
  };

  return (
    <aside
      style={{
        width: "260px",
        minWidth: "260px",
        background: "var(--bg-card)",
        borderRight: "1px solid var(--border-color)",
      }}
      className="hidden lg:flex h-screen flex-col justify-between sticky top-0 transition-colors duration-200 overflow-hidden"
    >
      {/* TOP */}
      <div className="flex flex-col flex-1 overflow-y-auto scrollbar-hide">
        {/* LOGO */}
        <div className="flex items-center gap-3 px-6 pt-7 pb-6">
          <div
            className="flex h-9 w-9 items-center justify-center rounded-xl text-white flex-shrink-0"
            style={{ background: "var(--color-primary)" }}
          >
            <Brain size={18} strokeWidth={1.8} />
          </div>
          <div>
            <h1
              className="text-sm font-semibold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              HealthGuard
            </h1>
            <p
              className="section-label mt-0.5"
              style={{ color: "var(--color-primary)", fontSize: "0.6rem" }}
            >
              Clinical AI Platform
            </p>
          </div>
        </div>

        {/* LABEL */}
        <div className="px-6 mb-2">
          <span className="section-label" style={{ color: "var(--text-muted)", fontSize: "0.65rem" }}>
            Navigation
          </span>
        </div>

        {/* NAVIGATION */}
        <nav className="px-3 space-y-0.5">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              className={({ isActive }) => `
                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 group relative
                ${isActive
                  ? "text-blue-700 dark:text-blue-400 font-medium"
                  : "hover:bg-slate-50 dark:hover:bg-white/5"
                }
              `}
              style={({ isActive }) =>
                isActive
                  ? {
                      background: "var(--color-primary-light)",
                      color: "var(--color-primary)",
                    }
                  : { color: "var(--text-secondary)" }
              }
            >
              {({ isActive }) => (
                <>
                  {/* Active accent bar */}
                  {isActive && (
                    <span
                      className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r-full"
                      style={{ background: "var(--color-primary)" }}
                    />
                  )}
                  <item.icon
                    size={17}
                    strokeWidth={isActive ? 2 : 1.8}
                    className="shrink-0 transition-colors"
                    style={{ color: isActive ? "var(--color-primary)" : "var(--text-muted)" }}
                  />
                  <span className="text-sm" style={{ color: isActive ? "var(--color-primary)" : "var(--text-secondary)", fontWeight: isActive ? 600 : 400 }}>
                    {item.title}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* BOTTOM */}
      <div className="px-3 pb-5 space-y-0.5">
        {/* Divider */}
        <div className="mx-3 mb-3 h-px" style={{ background: "var(--border-color)" }} />

        <NavLink
          to="/dashboard/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150
            ${isActive ? "" : "hover:bg-slate-50 dark:hover:bg-white/5"}
          `}
          style={({ isActive }) =>
            isActive
              ? { background: "var(--color-primary-light)", color: "var(--color-primary)" }
              : { color: "var(--text-secondary)" }
          }
        >
          {({ isActive }) => (
            <>
              <Settings
                size={17}
                strokeWidth={1.8}
                style={{ color: isActive ? "var(--color-primary)" : "var(--text-muted)" }}
              />
              <span className="text-sm" style={{ fontWeight: isActive ? 600 : 400 }}>Settings</span>
            </>
          )}
        </NavLink>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-150 hover:bg-red-50 dark:hover:bg-red-950/20 group"
          style={{ color: "var(--text-secondary)" }}
        >
          <LogOut
            size={17}
            strokeWidth={1.8}
            className="group-hover:text-red-500 transition-colors"
            style={{ color: "var(--text-muted)" }}
          />
          <span className="text-sm group-hover:text-red-500 transition-colors">Sign Out</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
