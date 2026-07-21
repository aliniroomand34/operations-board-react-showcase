import type { DemoChartDatum } from "@/features/demo-charts/demoCharts.types";

export interface ChartLegendProps {
  rows: DemoChartDatum[];
  valueFormatter?: (value: number) => string;
  "aria-label"?: string;
}

function defaultFormat(value: number): string {
  return String(value);
}

/** Color key + label list beside pie/bar charts. */
export function ChartLegend({
  rows,
  valueFormatter = defaultFormat,
  "aria-label": ariaLabel = "Chart legend",
}: ChartLegendProps) {
  if (!rows.length) return null;

  return (
    <ul
      className="flex min-w-0 flex-col gap-2 text-xs sm:text-[0.8rem]"
      aria-label={ariaLabel}
    >
      {rows.map((row) => (
        <li key={row.id} className="flex items-start gap-2 leading-snug">
          <span
            className="mt-1 h-3 w-3 shrink-0 rounded-sm ring-1 ring-white/20"
            style={{ backgroundColor: row.fill }}
            aria-hidden
          />
          <span className="min-w-0 flex-1 text-[var(--gray-900)]">
            <span className="block text-pretty">{row.name}</span>
            <span className="font-bold text-[var(--fg-subtle)]">
              {valueFormatter(row.value)}
            </span>
          </span>
        </li>
      ))}
    </ul>
  );
}
