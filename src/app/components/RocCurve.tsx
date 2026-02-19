import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type RocCurveProps = {
  data?: { fpr: number; tpr: number }[];
};

export function RocCurve({ data }: RocCurveProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h3 className="text-card-foreground font-semibold mb-1">
        ROC Curve
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        True Positive Rate vs False Positive Rate
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="fpr"
            type="number"
            domain={[0, 1]}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <YAxis
            dataKey="tpr"
            type="number"
            domain={[0, 1]}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <Tooltip
            contentStyle={{
              background: "var(--card)",
              border: "1px solid var(--border)",
              borderRadius: 8,
            }}
          />
          <Line
            type="monotone"
            dataKey="tpr"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
