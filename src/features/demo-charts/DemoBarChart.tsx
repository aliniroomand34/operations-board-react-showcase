import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEMO_CHART_TICK,
  DEMO_CHART_TOOLTIP_STYLE,
  DEMO_SERIES_COLORS,
} from "@/features/demo-charts/chartTheme";
import type { DemoChartDatum } from "@/features/demo-charts/demoCharts.types";

export interface DemoBarChartProps {
  data: DemoChartDatum[];
  height?: number;
  heightClassName?: string;
  valueLabel?: string;
}

const BAR_CURSOR = {
  fill: "rgba(0, 0, 0, 0.35)",
  stroke: "color-mix(in srgb, var(--fg) 15%, transparent)",
};

const BAR_ACTIVE = {
  fillOpacity: 0.92,
  stroke: "color-mix(in srgb, var(--fg) 45%, transparent)",
  strokeWidth: 1,
};

/** Category bar chart for Overview (single series, per-bar fills). */
export function DemoBarChart({
  data,
  height = 220,
  heightClassName,
  valueLabel = "Count",
}: DemoBarChartProps) {
  return (
    <div
      className={heightClassName ? `w-full min-w-0 ${heightClassName}` : "w-full min-w-0"}
      style={heightClassName ? undefined : { height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{ top: 8, right: 8, left: 0, bottom: 4 }}
          barCategoryGap="18%"
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.08)" />
          <XAxis
            dataKey="shortName"
            tick={DEMO_CHART_TICK}
            interval={0}
            angle={-28}
            textAnchor="end"
            height={56}
          />
          <YAxis tick={DEMO_CHART_TICK} allowDecimals={false} width={36} />
          <Tooltip
            cursor={BAR_CURSOR}
            contentStyle={DEMO_CHART_TOOLTIP_STYLE}
            formatter={(value) => [String(value ?? 0), valueLabel]}
            labelFormatter={(label) => String(label)}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            maxBarSize={42}
            activeBar={BAR_ACTIVE}
          >
            {data.map((row, index) => (
              <Cell
                key={row.id}
                fill={
                  row.fill ||
                  DEMO_SERIES_COLORS[index % DEMO_SERIES_COLORS.length]!
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
