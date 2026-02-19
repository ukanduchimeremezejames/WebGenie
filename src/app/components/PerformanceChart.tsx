import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type PerformanceChartProps = {
  metrics: {
    auroc?: number;
    auprc?: number;
    f1?: number;
  };
};

export function PerformanceChart({ metrics }: PerformanceChartProps) {
  if (!metrics) return null;

  const data = [
    { name: "AUROC", value: metrics.auroc ?? 0 },
    { name: "AUPRC", value: metrics.auprc ?? 0 },
    { name: "F1", value: metrics.f1 ?? 0 },
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h3 className="text-card-foreground font-semibold mb-1">
        Performance Metrics
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Summary benchmark scores
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis dataKey="name" tick={{ fill: "var(--muted-foreground)" }} />
          <YAxis domain={[0, 1]} tick={{ fill: "var(--muted-foreground)" }} />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Bar
            dataKey="value"
            fill="var(--color-primary)"
            radius={[6, 6, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
