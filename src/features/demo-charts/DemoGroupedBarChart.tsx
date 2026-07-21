import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  DEMO_CHART_TICK,
  DEMO_CHART_TOOLTIP_STYLE,
  DEMO_SERIES_COLORS,
} from "./chartTheme";

export interface DemoBarSeries {
  key: string;
  label: string;
  color?: string;
}

export interface DemoGroupedBarChartProps {
  /** Flat rows: { label, [seriesKey]: number } */
  data: Array<Record<string, string | number>>;
  series: DemoBarSeries[];
  height?: number;
}

export function DemoGroupedBarChart({
  data,
  series,
  height = 220,
}: DemoGroupedBarChartProps) {
  return (
    <div className="w-full min-w-0">
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 8, right: 8, left: 0, bottom: 8 }}
            barCategoryGap="18%"
            barGap={2}
          >
            <XAxis dataKey="label" tick={DEMO_CHART_TICK} />
            <YAxis tick={DEMO_CHART_TICK} width={40} allowDecimals={false} />
            <Tooltip
              contentStyle={DEMO_CHART_TOOLTIP_STYLE}
              formatter={(value, name) => {
                const match = series.find((entry) => entry.key === name);
                return [String(value ?? 0), match?.label ?? String(name)];
              }}
            />
            {series.map((entry, index) => (
              <Bar
                key={entry.key}
                dataKey={entry.key}
                name={entry.key}
                fill={
                  entry.color ??
                  DEMO_SERIES_COLORS[index % DEMO_SERIES_COLORS.length]
                }
                radius={[2, 2, 0, 0]}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
      <ul
        className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5"
        aria-label="Series legend"
      >
        {series.map((entry, index) => {
          const color =
            entry.color ?? DEMO_SERIES_COLORS[index % DEMO_SERIES_COLORS.length];
          return (
            <li key={entry.key} className="flex items-center gap-1.5 text-xs">
              <span
                className="inline-block h-2.5 w-2.5 shrink-0 rounded-sm"
                style={{ backgroundColor: color }}
                aria-hidden="true"
              />
              <span style={{ color }}>{entry.label}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
