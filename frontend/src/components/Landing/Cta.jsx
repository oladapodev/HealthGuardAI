import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const Cta = () => {
  return (
    <section
      style={{
        padding: "100px 0",
        background: "var(--bg-primary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 700, margin: "0 auto", padding: "0 24px", textAlign: "center" }}>
        <p className="section-label mb-3" style={{ color: "var(--color-primary)", fontSize: "0.7rem" }}>
          Get Started Today
        </p>
        <h2
          className="font-semibold mb-5"
          style={{
            fontSize: "clamp(1.875rem, 4vw, 2.75rem)",
            lineHeight: 1.2,
            letterSpacing: "-0.03em",
            color: "var(--text-primary)",
          }}
        >
          Ready to transform your clinical workflow?
        </h2>
        <p
          className="text-base md:text-lg mb-10 mx-auto leading-relaxed"
          style={{ color: "var(--text-secondary)", maxWidth: 480 }}
        >
          Join thousands of forward-thinking medical professionals using HealthGuard AI to deliver better patient outcomes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold px-6 py-3 rounded-xl transition-all hover:opacity-90 hover:-translate-y-0.5"
            style={{ background: "var(--color-primary)", color: "#fff" }}
          >
            Get Started for Free
            <ArrowRight size={16} strokeWidth={2} />
          </Link>
          <button
            className="inline-flex items-center gap-2 text-sm font-medium px-6 py-3 rounded-xl transition-all hover:opacity-80"
            style={{
              background: "var(--bg-card)",
              border: "1px solid var(--border-color)",
              color: "var(--text-primary)",
            }}
          >
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
};

export default Cta;
