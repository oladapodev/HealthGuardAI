import React, { useState, useEffect } from "react";
import {
  Send,
  Bot,
  User as UserIcon,
  Plus,
  ShieldCheck,
  Brain,
  Activity,
  AlertTriangle
} from "lucide-react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../../api/axios";

const ChatMode = () => {
  const location = useLocation();
  const [messages, setMessages] = useState([]);
  const [showMoodSelector, setShowMoodSelector] = useState(true);
  const [user, setUser] = useState(null);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await api.get("/users/profile");
        setUser(res.data);
      } catch (err) {
        console.error("Chat profile fetch error", err);
      }
    };
    fetchUser();
  }, []);

  const moods = [
    { emoji: "😊", label: "Great", color: "var(--success-light)", textColor: "var(--success-text)" },
    { emoji: "😐", label: "Okay", color: "var(--color-primary-light)", textColor: "var(--color-primary)" },
    { emoji: "😔", label: "Tired", color: "var(--warning-light)", textColor: "var(--warning-text)" },
    { emoji: "🤒", label: "Unwell", color: "var(--danger-light)", textColor: "var(--danger-text)" },
    { emoji: "😰", label: "Anxious", color: "#F5F3FF", textColor: "#5B21B6" },
  ];

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const moodParam = params.get("mood");
    if (moodParam) handleMoodSelect(moodParam);
  }, [location]);

  const handleMoodSelect = (moodLabel) => {
    setShowMoodSelector(false);
    const userName = user?.profile?.firstName || "there";
    const initialText = `Hello ${userName}. I've noted that you're feeling "${moodLabel}" today — that's been added to your clinical context. How can I help you understand your symptoms or health data?`;
    setMessages([{
      id: 1,
      type: "bot",
      text: initialText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      agents: ["Intake"]
    }]);
  };

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMsg = {
      id: Date.now(),
      type: "user",
      text: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    const currentInput = input;
    setInput("");
    setIsTyping(true);

    try {
      const res = await api.post("/health", { text: currentInput });
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        text: res.data.analysis || "I'm processing your clinical data. Could you tell me more about any symptoms?",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agents: ["Context", "Insights", "Safety"],
        nextQuestions: res.data.nextQuestions || []
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      const botMsg = {
        id: Date.now() + 1,
        type: "bot",
        text: "I'm having trouble reaching the intelligence engine. Please try again shortly.",
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        agents: ["System"]
      };
      setMessages(prev => [...prev, botMsg]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="flex flex-col" style={{ height: "calc(100vh - 64px)", maxWidth: 900, margin: "0 auto" }}>
      {/* Chat Header */}
      <div
        className="flex items-center justify-between py-4 flex-shrink-0"
        style={{ borderBottom: "1px solid var(--border-color)" }}
      >
        <div>
          <h2 className="text-lg font-semibold" style={{ color: "var(--text-primary)" }}>Intelligence Chat</h2>
          <p className="text-sm" style={{ color: "var(--text-secondary)" }}>Multi-agent clinical reasoning · Context-aware</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1.5">
            {[Brain, ShieldCheck, Activity].map((Icon, i) => (
              <div
                key={i}
                className="w-7 h-7 rounded-full flex items-center justify-center"
                style={{
                  background: "var(--color-primary-light)",
                  border: "2px solid var(--bg-card)",
                  color: "var(--color-primary)"
                }}
              >
                <Icon size={13} strokeWidth={1.8} />
              </div>
            ))}
          </div>
          <div
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "var(--success-light)", border: "1px solid rgba(5, 150, 105, 0.15)" }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: "var(--success)" }} />
            <span className="section-label" style={{ fontSize: "0.6rem", color: "var(--success-text)" }}>System Active</span>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <div
        className="flex items-start gap-2.5 px-4 py-2.5 mt-3 rounded-xl flex-shrink-0"
        style={{
          background: "var(--warning-light)",
          border: "1px solid rgba(217, 119, 6, 0.15)",
        }}
      >
        <AlertTriangle size={14} style={{ color: "var(--warning)", marginTop: 1, flexShrink: 0 }} />
        <p className="text-xs" style={{ color: "var(--warning-text)" }}>
          <span className="font-semibold">Educational purpose only.</span> HealthGuard AI does not provide diagnoses, treatment advice, or prescriptions. Always consult a licensed healthcare professional.
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto py-6 space-y-5 scrollbar-hide">
        {showMoodSelector && messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50%] text-center px-4">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="max-w-lg w-full"
            >
              <div
                className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-5"
                style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}
              >
                <Brain size={24} strokeWidth={1.8} />
              </div>
              <h1 className="text-xl font-semibold mb-1.5" style={{ color: "var(--text-primary)" }}>
                How are you feeling today?
              </h1>
              <p className="text-sm mb-6" style={{ color: "var(--text-secondary)" }}>
                Select your current mood to begin your clinical check-in.
              </p>
              <div className="flex flex-wrap justify-center gap-2.5">
                {moods.map((m, idx) => (
                  <motion.button
                    key={m.label}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.06 }}
                    onClick={() => handleMoodSelect(m.label)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all text-sm font-medium hover:scale-105"
                    style={{
                      background: m.color,
                      color: m.textColor,
                      border: `1px solid ${m.textColor}20`,
                    }}
                  >
                    <span role="img" aria-label={m.label}>{m.emoji}</span>
                    {m.label}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </div>
        ) : (
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[78%] ${msg.type === "user" ? "flex-row-reverse" : ""}`}>
                  {/* Avatar */}
                  <div
                    className="w-8 h-8 rounded-xl flex-shrink-0 flex items-center justify-center"
                    style={{
                      background: msg.type === "user" ? "var(--bg-secondary)" : "var(--color-primary)",
                      color: msg.type === "user" ? "var(--text-secondary)" : "#fff",
                    }}
                  >
                    {msg.type === "user"
                      ? <UserIcon size={15} strokeWidth={1.8} />
                      : <Bot size={15} strokeWidth={1.8} />
                    }
                  </div>

                  {/* Bubble */}
                  <div className={`space-y-1.5 ${msg.type === "user" ? "items-end text-right" : "items-start text-left"} flex flex-col`}>
                    <div
                      className="px-4 py-3 text-sm leading-relaxed"
                      style={{
                        borderRadius: msg.type === "user" ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
                        background: msg.type === "user" ? "var(--text-primary)" : "var(--bg-card)",
                        color: msg.type === "user" ? "#fff" : "var(--text-primary)",
                        border: msg.type === "bot" ? "1px solid var(--border-color)" : "none",
                      }}
                    >
                      {msg.text}

                      {msg.nextQuestions?.length > 0 && (
                        <div className="mt-3 space-y-1.5">
                          <p className="section-label mb-1.5" style={{ fontSize: "0.6rem", color: "var(--text-muted)" }}>Suggested questions:</p>
                          {msg.nextQuestions.map((q, i) => (
                            <button
                              key={i}
                              onClick={() => setInput(q)}
                              className="block w-full text-left px-3 py-2 rounded-lg text-xs transition-colors hover:opacity-80"
                              style={{
                                background: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                              }}
                            >
                              {q}
                            </button>
                          ))}
                        </div>
                      )}

                      {msg.agents && (
                        <div className="mt-3 pt-3 flex flex-wrap gap-1.5" style={{ borderTop: "1px solid var(--border-color)" }}>
                          {msg.agents.map(agent => (
                            <span
                              key={agent}
                              className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                              style={{
                                background: "var(--color-primary-light)",
                                color: "var(--color-primary)",
                                fontSize: "0.6rem",
                                fontWeight: 500,
                                letterSpacing: "0.04em",
                              }}
                            >
                              <ShieldCheck size={9} strokeWidth={2} />
                              {agent}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    <span className="section-label px-1" style={{ fontSize: "0.6rem" }}>{msg.timestamp}</span>
                  </div>
                </div>
              </motion.div>
            ))}

            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex gap-3">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    <Bot size={15} strokeWidth={1.8} />
                  </div>
                  <div
                    className="px-4 py-3 rounded-2xl flex items-center gap-1.5"
                    style={{ background: "var(--bg-card)", border: "1px solid var(--border-color)" }}
                  >
                    {[0, 150, 300].map((delay, i) => (
                      <span
                        key={i}
                        className="w-1.5 h-1.5 rounded-full animate-bounce"
                        style={{ background: "var(--color-primary)", animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        )}
      </div>

      {/* Input Area */}
      <div className="pt-4 mt-auto flex-shrink-0">
        <form onSubmit={handleSend} className="flex items-center gap-2">
          <div className="flex-1 relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask HealthGuard AI about your health..."
              className="w-full text-sm"
              style={{
                background: "var(--bg-card)",
                border: "1px solid var(--border-color)",
                borderRadius: "14px",
                padding: "13px 16px 13px 42px",
                color: "var(--text-primary)",
                outline: "none",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
              onFocus={e => {
                e.target.style.borderColor = "var(--color-primary)";
                e.target.style.boxShadow = "0 0 0 3px rgba(29,78,216,0.1)";
              }}
              onBlur={e => {
                e.target.style.borderColor = "var(--border-color)";
                e.target.style.boxShadow = "none";
              }}
            />
            <button
              type="button"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-lg transition-colors hover:opacity-70"
              style={{ color: "var(--text-muted)" }}
            >
              <Plus size={16} strokeWidth={1.8} />
            </button>
          </div>
          <button
            type="submit"
            disabled={!input.trim()}
            className="flex items-center justify-center rounded-xl transition-all active:scale-95 disabled:opacity-40"
            style={{
              background: "var(--color-primary)",
              color: "#fff",
              width: "46px",
              height: "46px",
              flexShrink: 0,
            }}
          >
            <Send size={17} strokeWidth={1.8} />
          </button>
        </form>
        <div className="flex items-center justify-center gap-3 mt-2.5">
          <span className="section-label" style={{ fontSize: "0.6rem" }}>End-to-end encrypted</span>
          <span className="w-1 h-1 rounded-full" style={{ background: "var(--border-strong)" }} />
          <span className="section-label" style={{ fontSize: "0.6rem" }}>HIPAA compliant</span>
        </div>
      </div>
    </div>
  );
};

export default ChatMode;
