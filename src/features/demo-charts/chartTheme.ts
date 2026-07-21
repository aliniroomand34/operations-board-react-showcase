/**
 * Shared Recharts theme tokens for Ops Console Demo charts.
 * Presentational only — no data fetching.
 *
 * Colors follow the dark-gold ops palette in `index.css` (`--fg`, semantic `--fg-*`).
 */

export const DEMO_CHART_COLORS = {
  amount: "var(--fg)",
  success: "var(--fg-success)",
  failed: "var(--fg-error)",
  settled: "var(--fg-info)",
  unsettled: "var(--fg-warning)",
  muted: "var(--gray-800)",
} as const;

/**
 * Fallback multi-series palette — project tokens only (no generic marketing rainbow).
 * Prefer explicit `DEMO_CHART_COLORS` / board chrome fills when series meaning is known.
 */
export const DEMO_SERIES_COLORS = [
  "var(--fg)",
  "var(--fg-subtle)",
  "var(--fg-muted)",
  "var(--fg-success)",
  "var(--fg-warning)",
  "var(--fg-info)",
  "var(--fg-error)",
  "var(--gray-800)",
] as const;

export const DEMO_CHART_TOOLTIP_STYLE = {
  background: "var(--bg-muted)",
  border: "1px solid var(--border-muted)",
  borderRadius: "8px",
  color: "var(--fg)",
} as const;

export const DEMO_CHART_TICK = {
  fill: "var(--gray-800)",
  fontSize: 11,
} as const;
