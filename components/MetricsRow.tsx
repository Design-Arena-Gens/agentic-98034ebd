"use client";

interface MetricsRowProps {
  metrics: {
    label: string;
    value: string;
    description: string;
  }[];
}

export function MetricsRow({ metrics }: MetricsRowProps) {
  return (
    <section className="card">
      <div className="metrics-grid">
        {metrics.map((metric) => (
          <article key={metric.label} className="metric-card">
            <div className="metric-label">{metric.label}</div>
            <div className="metric-value">{metric.value}</div>
            <p className="small-muted">{metric.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
