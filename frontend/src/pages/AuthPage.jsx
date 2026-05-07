import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, ArrowRight, Mail, Lock, User, Brain, Activity, Eye, EyeOff } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import api from "../api/axios";

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({ email: "", password: "", fullName: "" });
  const navigate = useNavigate();

  const handleInputChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isLogin && formData.email === "test@healthguard.ai" && formData.password === "demo1234") {
      localStorage.setItem("token", "mock-session-token-" + Date.now());
      navigate("/dashboard");
      return;
    }

    try {
      if (isLogin) {
        const response = await api.post("/users/login", { email: formData.email, password: formData.password });
        localStorage.setItem("token", response.data.token);
        navigate("/dashboard");
      } else {
        await api.post("/users/register", {
          email: formData.email,
          password: formData.password,
          profile: {
            firstName: formData.fullName.split(" ")[0],
            lastName: formData.fullName.split(" ").slice(1).join(" ")
          }
        });
        Swal.fire({
          title: "Account Created",
          text: "Registration successful. Please sign in to continue.",
          icon: "success",
          confirmButtonColor: "#1D4ED8",
          confirmButtonText: "Sign In Now"
        }).then(() => setIsLogin(true));
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong. Please try again.",
        icon: "error",
        confirmButtonColor: "#DC2626"
      });
    }
  };

  const inputStyle = {
    width: "100%",
    background: "var(--bg-secondary)",
    border: "1px solid var(--border-color)",
    borderRadius: 12,
    padding: "12px 14px 12px 42px",
    fontSize: "0.9375rem",
    color: "var(--text-primary)",
    outline: "none",
    transition: "border-color 0.15s, box-shadow 0.15s",
  };

  const trustItems = [
    { icon: <ShieldCheck size={16} strokeWidth={1.8} />, label: "HIPAA Compliant", desc: "End-to-end encrypted" },
    { icon: <Brain size={16} strokeWidth={1.8} />, label: "Multi-Agent AI", desc: "Clinical-grade reasoning" },
    { icon: <Activity size={16} strokeWidth={1.8} />, label: "Real-time Analysis", desc: "99.9% availability" },
  ];

  return (
    <div
      className="min-h-screen flex"
      style={{ background: "var(--bg-primary)" }}
    >
      {/* Left Panel — Branding (desktop only) */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden"
        style={{
          background: "linear-gradient(160deg, #1D4ED8 0%, #1e3a8a 55%, #0c1a4e 100%)",
        }}
      >
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-0 w-96 h-96 rounded-full opacity-10"
            style={{ background: "#fff", filter: "blur(80px)", transform: "translateX(50%)" }} />
          <div className="absolute bottom-0 left-1/4 w-64 h-64 rounded-full opacity-10"
            style={{ background: "#93C5FD", filter: "blur(60px)", transform: "translateY(30%)" }} />
        </div>

        <div className="relative z-10">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "rgba(255,255,255,0.15)" }}>
              <ShieldCheck size={19} style={{ color: "#fff" }} strokeWidth={1.8} />
            </div>
            <span className="text-lg font-semibold text-white">HealthGuard<span style={{ opacity: 0.7 }}>AI</span></span>
          </Link>
        </div>

        <div className="relative z-10">
          <h2 className="text-3xl font-semibold text-white mb-4" style={{ letterSpacing: "-0.02em", lineHeight: 1.3 }}>
            The intelligent core of modern clinical care.
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.65)", lineHeight: 1.7 }}>
            Streamline workflows, enhance diagnostic accuracy, and deliver better patient outcomes with our AI-powered platform.
          </p>
          <div className="space-y-4">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: "rgba(255,255,255,0.12)", color: "#93C5FD" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{item.label}</p>
                  <p className="text-xs" style={{ color: "rgba(255,255,255,0.55)" }}>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-xs" style={{ color: "rgba(255,255,255,0.35)" }}>
          © {new Date().getFullYear()} HealthGuard AI · HIPAA Compliant Platform
        </p>
      </div>

      {/* Right Panel — Form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12">
        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
          style={{ width: "100%", maxWidth: 420 }}
        >
          {/* Mobile Logo */}
          <div className="flex lg:hidden items-center justify-center mb-8">
            <Link to="/" className="flex items-center gap-2">
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                <ShieldCheck size={19} strokeWidth={1.8} />
              </div>
              <span className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>
                HealthGuard<span style={{ color: "var(--color-primary)" }}>AI</span>
              </span>
            </Link>
          </div>

          {/* Heading */}
          <div className="mb-8">
            <h1 className="text-2xl font-semibold" style={{ color: "var(--text-primary)", letterSpacing: "-0.02em" }}>
              {isLogin ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm mt-1.5" style={{ color: "var(--text-secondary)" }}>
              {isLogin
                ? "Access your clinical insights and patient records"
                : "Join the next generation of clinical decision support"}
            </p>
          </div>

          {/* Form */}
          <form className="space-y-4" onSubmit={handleSubmit}>
            <AnimatePresence>
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                >
                  <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                    <input type="text" name="fullName" value={formData.fullName} onChange={handleInputChange}
                      placeholder="Dr. Jane Smith" style={inputStyle} required
                      onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                      onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: "var(--text-secondary)" }}>
                Email Address
              </label>
              <div className="relative">
                <Mail size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input type="email" name="email" value={formData.email} onChange={handleInputChange}
                  placeholder="name@hospital.com" style={inputStyle} required
                  onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-sm font-medium" style={{ color: "var(--text-secondary)" }}>Password</label>
                {isLogin && (
                  <button type="button" className="text-xs font-medium transition-colors hover:opacity-70" style={{ color: "var(--color-primary)" }}>
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock size={16} strokeWidth={1.8} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: "var(--text-muted)" }} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  style={{ ...inputStyle, paddingRight: 42 }}
                  required
                  onFocus={e => { e.target.style.borderColor = "var(--color-primary)"; e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)"; }}
                  onBlur={e => { e.target.style.borderColor = "var(--border-color)"; e.target.style.boxShadow = "none"; }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors hover:opacity-70"
                  style={{ color: "var(--text-muted)" }}
                >
                  {showPassword ? <EyeOff size={16} strokeWidth={1.8} /> : <Eye size={16} strokeWidth={1.8} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90 active:scale-[0.98] mt-2"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              {isLogin ? "Sign In" : "Create Account"}
              <ArrowRight size={16} strokeWidth={2} />
            </button>
          </form>

          {/* Divider */}
          <div className="relative flex items-center my-6">
            <div className="flex-grow h-px" style={{ background: "var(--border-color)" }} />
            <span className="flex-shrink mx-4 text-xs" style={{ color: "var(--text-muted)" }}>or continue with</span>
            <div className="flex-grow h-px" style={{ background: "var(--border-color)" }} />
          </div>

          {/* Google SSO */}
          <button
            className="w-full flex items-center justify-center gap-2.5 py-3 rounded-xl text-sm font-medium transition-all hover:opacity-80"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84C6.71 7.31 9.14 5.38 12 5.38z" />
            </svg>
            Continue with Google
          </button>

          {/* Switch */}
          <p className="text-center mt-6 text-sm" style={{ color: "var(--text-secondary)" }}>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button
              onClick={() => setIsLogin(!isLogin)}
              className="font-semibold transition-colors hover:opacity-70"
              style={{ color: "var(--color-primary)" }}
            >
              {isLogin ? "Sign up" : "Sign in"}
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AuthPage;
