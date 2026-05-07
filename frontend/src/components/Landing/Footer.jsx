import { ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        paddingTop: 64,
        paddingBottom: 40,
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 mb-14">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4 group">
              <div
                className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors"
                style={{ background: "var(--color-primary)", color: "#fff" }}
              >
                <ShieldCheck size={16} strokeWidth={2} />
              </div>
              <span className="text-base font-semibold" style={{ color: "var(--text-primary)" }}>
                HealthGuard<span style={{ color: "var(--color-primary)" }}>AI</span>
              </span>
            </Link>
            <p className="text-sm leading-relaxed mb-5" style={{ color: "var(--text-secondary)", maxWidth: 260 }}>
              Empowering healthcare providers with intuitive, secure, and accurate artificial intelligence.
            </p>
            {/* HIPAA Badge */}
            <div
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg"
              style={{
                background: "var(--color-primary-light)",
                border: "1px solid rgba(29, 78, 216, 0.12)",
              }}
            >
              <ShieldCheck size={13} strokeWidth={2} style={{ color: "var(--color-primary)" }} />
              <span className="section-label" style={{ fontSize: "0.6rem", color: "var(--color-primary)" }}>
                HIPAA Compliant Platform
              </span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Product</h4>
            <ul className="space-y-3">
              {["Features", "Security", "Pricing", "Changelog"].map((item) => (
                <li key={item}>
                  <a
                    href={item === "Features" ? "#features" : item === "Pricing" ? "#pricing" : "#"}
                    className="text-sm transition-colors hover:opacity-70"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Company</h4>
            <ul className="space-y-3">
              {["About Us", "Careers", "Blog", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--text-primary)" }}>Legal</h4>
            <ul className="space-y-3">
              {["Privacy Policy", "Terms of Service", "HIPAA Compliance", "Cookie Policy"].map((item) => (
                <li key={item}>
                  <a href="#" className="text-sm transition-colors hover:opacity-70" style={{ color: "var(--text-secondary)" }}>
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div
          className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8"
          style={{ borderTop: "1px solid var(--border-color)" }}
        >
          <p className="text-sm" style={{ color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} HealthGuard AI, Inc. All rights reserved.
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Built for clinicians · Trusted by hospitals · HIPAA · SOC 2 Type II
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
