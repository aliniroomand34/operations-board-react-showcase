import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { ChartLegend } from "@/features/demo-charts/ChartLegend";
import {
  DEMO_CHART_TOOLTIP_STYLE,
  DEMO_SERIES_COLORS,
} from "@/features/demo-charts/demoCharts.theme";

export interface DemoPieSlice {
  name: string;
  value: number;
  /** Finance Summary uses `color`; Overview series use `fill`. */
  color?: string;
  fill?: string;
  id?: string;
  key?: string;
}

export interface DemoPieChartProps {
  data: DemoPieSlice[];
  height?: number;
  heightClassName?: string;
  showLegend?: boolean;
  legendAriaLabel?: string;
}

function sliceFill(row: DemoPieSlice, index: number): string {
  return (
    row.color ??
    row.fill ??
    DEMO_SERIES_COLORS[index % DEMO_SERIES_COLORS.length]!
  );
}

function sliceId(row: DemoPieSlice, index: number): string {
  return row.id ?? row.key ?? `${row.name}-${index}`;
}

/** Donut pie — accepts Finance `{ color }` and Overview `{ fill }` slices. */
export function DemoPieChart({
  data,
  height = 200,
  heightClassName,
  showLegend = false,
  legendAriaLabel,
}: DemoPieChartProps) {
  const active = data.filter((row) => row.value > 0);
  const legendRows = data.map((row, index) => ({
    id: sliceId(row, index),
    name: row.name,
    shortName: row.name,
    value: row.value,
    fill: sliceFill(row, index),
  }));

  const chart = (
    <div
      className={
        heightClassName
          ? `mx-auto w-full max-w-xs min-w-0 ${heightClassName}`
          : "mx-auto w-full max-w-xs min-w-0"
      }
      style={heightClassName ? undefined : { height }}
    >
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={active}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            innerRadius="46%"
            outerRadius="76%"
            paddingAngle={2}
          >
            {active.map((row, index) => (
              <Cell
                key={sliceId(row, index)}
                fill={sliceFill(row, index)}
                stroke="rgba(0, 0, 0, 0.45)"
              />
            ))}
          </Pie>
          <Tooltip
            contentStyle={DEMO_CHART_TOOLTIP_STYLE}
            formatter={(value) => [String(value ?? 0), "Count"]}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );

  if (!showLegend) {
    return chart;
  }

  return (
    <div className="grid min-w-0 gap-4 lg:grid-cols-[minmax(0,1fr)_11rem] xl:grid-cols-[minmax(0,1fr)_12.5rem]">
      {chart}
      <ChartLegend rows={legendRows} aria-label={legendAriaLabel} />
    </div>
  );
}
