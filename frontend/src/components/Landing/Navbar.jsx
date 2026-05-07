import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ShieldCheck, Moon, Sun, Menu, X, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import useTheme from "../../hooks/UseThemes";

const Navbar = () => {
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Features", href: "#features" },
    { name: "How it Works", href: "#how-it-works" },
    { name: "Pricing", href: "#pricing" },
  ];

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: isScrolled ? "rgba(var(--bg-card-rgb, 255,255,255), 0.95)" : "transparent",
        backdropFilter: isScrolled ? "blur(12px)" : "none",
        WebkitBackdropFilter: isScrolled ? "blur(12px)" : "none",
        borderBottom: isScrolled ? "1px solid var(--border-color)" : "1px solid transparent",
        boxShadow: isScrolled ? "0 1px 3px rgba(15,23,42,0.06)" : "none",
        padding: isScrolled ? "14px 0" : "20px 0",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div
              className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
              style={{ background: "var(--color-primary)", color: "#fff" }}
            >
              <ShieldCheck size={17} strokeWidth={2} />
            </div>
            <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
              HealthGuard<span style={{ color: "var(--color-primary)" }}>AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <div className="flex items-center gap-7">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-sm font-medium transition-colors hover:opacity-70"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {link.name}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3" style={{ borderLeft: "1px solid var(--border-color)", paddingLeft: 20 }}>
              <button
                onClick={toggleTheme}
                className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
                style={{ color: "var(--text-muted)" }}
                aria-label="Toggle theme"
              >
                {theme === "light" ? <Moon size={17} strokeWidth={1.8} /> : <Sun size={17} strokeWidth={1.8} />}
              </button>

              <Link
                to="/auth"
                className="flex items-center gap-1.5 text-sm font-semibold px-4 py-2 rounded-xl transition-all hover:opacity-90"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                Get Started
                <ArrowRight size={15} strokeWidth={2} />
              </Link>
            </div>
          </div>

          {/* Mobile Controls */}
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={toggleTheme} className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
              style={{ color: "var(--text-muted)" }} aria-label="Toggle theme">
              {theme === "light" ? <Moon size={18} strokeWidth={1.8} /> : <Sun size={18} strokeWidth={1.8} />}
            </button>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-white/5"
              style={{ color: "var(--text-muted)" }}
            >
              {isMobileMenuOpen ? <X size={20} strokeWidth={1.8} /> : <Menu size={20} strokeWidth={1.8} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden overflow-hidden"
            style={{ background: "var(--bg-card)", borderTop: "1px solid var(--border-color)" }}
          >
            <div className="px-6 py-5 space-y-3">
              {navLinks.map((link) => (
                <a key={link.name} href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block py-2 text-base font-medium transition-colors hover:opacity-70"
                  style={{ color: "var(--text-primary)" }}
                >
                  {link.name}
                </a>
              ))}
              <div className="pt-3" style={{ borderTop: "1px solid var(--border-color)" }}>
                <Link to="/auth" onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                  style={{ background: "var(--color-primary)", color: "#fff" }}
                >
                  Get Started <ArrowRight size={15} strokeWidth={2} />
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;