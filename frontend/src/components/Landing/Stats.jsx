const stats = [
  { value: "40%", label: "Reduction in admin time", desc: "vs. traditional workflows" },
  { value: "99.9%", label: "Platform uptime SLA", desc: "Enterprise-grade reliability" },
  { value: "12k+", label: "Medical professionals", desc: "Across 40+ countries" },
  { value: "2M+", label: "Patient records secured", desc: "AES-256 encrypted" },
];

const Stats = () => {
  return (
    <section
      style={{
        padding: "72px 0",
        background: "var(--bg-secondary)",
        borderTop: "1px solid var(--border-color)",
        borderBottom: "1px solid var(--border-color)",
      }}
    >
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px" }}>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 0,
        }}
          className="grid-cols-2 md:grid-cols-4"
        >
          {stats.map((stat, index) => (
            <div
              key={index}
              style={{
                padding: "0 32px",
                borderRight: index < stats.length - 1 ? "1px solid var(--border-color)" : "none",
                textAlign: "center",
              }}
              className={index > 0 ? "border-l-0 md:border-l" : ""}
            >
              <div style={{
                fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                fontWeight: 600,
                letterSpacing: "-0.04em",
                color: "var(--text-primary)",
                lineHeight: 1,
                marginBottom: 8,
              }}>
                {stat.value}
              </div>
              <div style={{
                fontSize: "0.9375rem",
                fontWeight: 500,
                color: "var(--text-primary)",
                marginBottom: 4,
              }}>
                {stat.label}
              </div>
              <div style={{
                fontSize: "0.8125rem",
                color: "var(--text-muted)",
              }}>
                {stat.desc}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Stats;
