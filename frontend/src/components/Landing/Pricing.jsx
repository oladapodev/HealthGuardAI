import { Check } from "lucide-react";

const plans = [
  {
    name: "Professional",
    desc: "For independent practices and small clinics.",
    price: "$299",
    period: "/provider/mo",
    features: [
      "Unlimited ambient dictation",
      "Automated clinical notes formatting",
      "Integration with 1 EHR system",
      "Standard HIPAA compliance tools",
      "Email support (24h SLA)",
    ],
    cta: "Start 14-Day Free Trial",
    featured: false,
  },
  {
    name: "Enterprise",
    desc: "Custom solutions for hospitals and large networks.",
    price: "Custom",
    period: "",
    features: [
      "Everything in Professional",
      "Unlimited EHR integrations",
      "Custom AI model training",
      "Advanced analytics & reporting",
      "Dedicated technical account manager",
      "24/7 priority phone support",
    ],
    cta: "Contact Sales",
    badge: "Most Popular",
    featured: true,
  },
];

const Pricing = () => {
  return (
    <section
      id="pricing"
      style={{
        padding: "100px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 24px" }}>
        {/* Header */}
        <div className="text-center mx-auto mb-14" style={{ maxWidth: 520 }}>
          <p className="section-label mb-3" style={{ color: "var(--color-primary)", fontSize: "0.7rem" }}>
            Pricing
          </p>
          <h2
            className="font-semibold mb-4"
            style={{
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              lineHeight: 1.25,
              letterSpacing: "-0.02em",
              color: "var(--text-primary)",
            }}
          >
            Transparent plans for practices of all sizes
          </h2>
          <p className="text-base leading-relaxed" style={{ color: "var(--text-secondary)" }}>
            Whether you run a solo clinic or a multi-location health network, we have a plan tailored to your needs.
          </p>
        </div>

        {/* Plans */}
        <div className="grid md:grid-cols-2 gap-6" style={{ maxWidth: 900, margin: "0 auto" }}>
          {plans.map((plan) => (
            <div
              key={plan.name}
              className="flex flex-col relative"
              style={{
                background: plan.featured ? "var(--text-primary)" : "var(--bg-card)",
                border: `1px solid ${plan.featured ? "transparent" : "var(--border-color)"}`,
                borderRadius: 24,
                padding: "40px",
                boxShadow: plan.featured ? "0 8px 32px rgba(15, 23, 42, 0.2)" : "var(--shadow-card)",
              }}
            >
              {plan.badge && (
                <div className="absolute" style={{ top: -12, right: 28 }}>
                  <span
                    className="px-3.5 py-1 rounded-full text-xs font-semibold"
                    style={{ background: "var(--color-primary)", color: "#fff" }}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              <div className="mb-7">
                <h3
                  className="text-xl font-semibold mb-1.5"
                  style={{ color: plan.featured ? "#fff" : "var(--text-primary)" }}
                >
                  {plan.name}
                </h3>
                <p
                  className="text-sm"
                  style={{ color: plan.featured ? "rgba(255,255,255,0.6)" : "var(--text-secondary)" }}
                >
                  {plan.desc}
                </p>
              </div>

              <div className="mb-8">
                <span
                  className="font-semibold"
                  style={{
                    fontSize: "2.75rem",
                    letterSpacing: "-0.03em",
                    color: plan.featured ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {plan.price}
                </span>
                {plan.period && (
                  <span className="text-sm ml-1" style={{ color: plan.featured ? "rgba(255,255,255,0.5)" : "var(--text-muted)" }}>
                    {plan.period}
                  </span>
                )}
              </div>

              <ul className="space-y-3.5 mb-9 flex-1">
                {plan.features.map((feature, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{
                        background: plan.featured ? "rgba(255,255,255,0.15)" : "var(--success-light)",
                        color: plan.featured ? "#fff" : "var(--success)",
                      }}
                    >
                      <Check size={11} strokeWidth={2.5} />
                    </div>
                    <span
                      className="text-sm"
                      style={{ color: plan.featured ? "rgba(255,255,255,0.8)" : "var(--text-secondary)" }}
                    >
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>

              <button
                className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:opacity-90"
                style={{
                  background: plan.featured ? "#fff" : "var(--bg-secondary)",
                  color: plan.featured ? "var(--text-primary)" : "var(--text-primary)",
                  border: plan.featured ? "none" : "1px solid var(--border-color)",
                }}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Pricing;
