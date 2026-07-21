/**
 * Overview chart palette helpers — dark-gold ladder from project `:root` tokens.
 * Prefer board/pipeline semantic fills (`boardChrome`) when the series maps to a column.
 */

/** Gold / amber / muted ladder matching `--fg` / `--fg-subtle` / `--fg-muted`. */
export const DEMO_CHART_PALETTE = [
  "#ffd700",
  "#e6c200",
  "#b38f00",
  "#9a7b0a",
  "#6b5a1e",
  "#8a8a6a",
  "#5c5c4a",
  "#bbbbbb",
] as const;

export function demoChartFill(index: number): string {
  return DEMO_CHART_PALETTE[index % DEMO_CHART_PALETTE.length]!;
}
