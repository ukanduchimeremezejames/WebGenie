import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

type PrCurveProps = {
  data?: { recall: number; precision: number }[];
};

export function PrCurve({ data }: PrCurveProps) {
  if (!data || data.length === 0) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-6 mb-6">
      <h3 className="text-card-foreground font-semibold mb-1">
        Precision–Recall Curve
      </h3>
      <p className="text-sm text-muted-foreground mb-4">
        Precision vs Recall tradeoff
      </p>

      <ResponsiveContainer width="100%" height={260}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="recall"
            type="number"
            domain={[0, 1]}
            tick={{ fill: "var(--muted-foreground)" }}
          />
          <YAxis
            dataKey="precision"
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
            dataKey="precision"
            stroke="var(--color-primary)"
            strokeWidth={3}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
