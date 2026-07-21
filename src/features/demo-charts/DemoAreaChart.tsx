import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEMO_CHART_COLORS,
  DEMO_CHART_TICK,
  DEMO_CHART_TOOLTIP_STYLE,
} from "./chartTheme";

export interface DemoAreaPoint {
  label: string;
  amount: number;
}

export interface DemoAreaChartProps {
  data: DemoAreaPoint[];
  height?: number;
}

export function DemoAreaChart({ data, height = 180 }: DemoAreaChartProps) {
  return (
    <div className="w-full min-w-0" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <XAxis dataKey="label" tick={DEMO_CHART_TICK} />
          <YAxis
            tick={DEMO_CHART_TICK}
            width={56}
            tickFormatter={(value: number) => String(value)}
          />
          <Tooltip
            contentStyle={DEMO_CHART_TOOLTIP_STYLE}
            formatter={(value) => [String(value ?? 0), "Amount"]}
          />
          <Area
            type="monotone"
            dataKey="amount"
            stroke={DEMO_CHART_COLORS.amount}
            fill={DEMO_CHART_COLORS.amount}
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
