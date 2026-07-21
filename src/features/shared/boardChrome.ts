/**
 * Shared board chrome tokens — presentation only.
 *
 * Public-safe skin aligned with production ops density:
 * dashed column shells, semantic tone colors, fixed pipeline column widths.
 * Wire into ColumnFrame / column wrappers; do not couple to mutations or APIs.
 */

/** Horizontal strip for multi-column boards (Pipeline). */
export const BOARD_STRIP_CLASS =
  "flex h-full min-h-0 w-full gap-2 overflow-x-auto overflow-y-hidden pb-1 sm:gap-3";

/**
 * Fixed-width pipeline column shell — scroll strip, not fluid shrink.
 * Narrower than production inventory-board columns (demo card density).
 */
export const PIPELINE_COLUMN_SHELL_CLASS =
  "flex h-full min-h-0 w-[16rem] min-w-[16rem] shrink-0 flex-col overflow-hidden sm:w-[18rem] sm:min-w-[18rem]";

/** Grid panel wrapping Operations Board columns. */
export const OPERATIONS_BOARD_STRIP_CLASS =
  "admin-page-panel grid min-h-[26rem] gap-3 rounded-2xl p-3 sm:p-4 lg:grid-cols-2 xl:grid-cols-4";

/**
 * Semantic shell tones — border-2 / dashed come from `.ops-column` in CSS;
 * these tokens only set border-color, border-style overrides, and fill.
 */
export const BOARD_CHROME_TONE = {
  /** Queued / intake — rose wash (market queue shell). */
  queue:
    "border-solid border-rose-500/35 bg-rose-950/25",
  /** Ready inventory — emerald dashed (ready-batch shell). */
  ready:
    "border-dashed border-emerald-500/50 bg-emerald-500/10",
  /** Active work — stone wash (in-progress shell). */
  inProgress:
    "border-solid border-white/15 bg-stone-900/50",
  /** Completed / calm close-out. */
  completed:
    "border-solid border-sky-500/35 bg-sky-500/10",
  /** Pipeline: acquiring. */
  cyan: "border-dashed border-cyan-500/50 bg-cyan-500/10",
  /** Pipeline: packaging. */
  amber: "border-dashed border-amber-500/50 bg-amber-500/10",
  /** Pipeline: assigned. */
  violet: "border-dashed border-violet-500/50 bg-violet-500/10",
  /** Pipeline: hold. */
  orangeRed: "border-dashed border-orange-600/50 bg-orange-600/10",
  /** Pipeline: problem. */
  red: "border-dashed border-red-500/50 bg-red-500/10",
  /** Pipeline: review. */
  slate: "border-dashed border-slate-400/45 bg-slate-500/15",
} as const;

export type BoardChromeTone = keyof typeof BOARD_CHROME_TONE;

/** Operations Board column → chrome tone. */
export const OPERATIONS_BOARD_COLUMN_TONE = {
  queued: BOARD_CHROME_TONE.queue,
  ready: BOARD_CHROME_TONE.ready,
  inProgress: BOARD_CHROME_TONE.inProgress,
  completed: BOARD_CHROME_TONE.completed,
} as const;

/** Inventory Pipeline column → chrome tone. */
export const PIPELINE_COLUMN_TONE = {
  acquiring: BOARD_CHROME_TONE.cyan,
  packaging: BOARD_CHROME_TONE.amber,
  ready: BOARD_CHROME_TONE.ready,
  assigned: BOARD_CHROME_TONE.violet,
  hold: BOARD_CHROME_TONE.orangeRed,
  problem: BOARD_CHROME_TONE.red,
  review: BOARD_CHROME_TONE.slate,
} as const;

/** Ready-column title accent (emerald). */
export const BOARD_CHROME_READY_TITLE_CLASS = "text-emerald-300";

/** Ready-column count chip accent. */
export const BOARD_CHROME_READY_COUNT_CLASS =
  "border-emerald-500/40 text-emerald-300";

/** Drop-target highlight when dragging over ready batches. */
export const BOARD_CHROME_READY_DROP_OVER_CLASS =
  "border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.35)]";

/**
 * SVG-safe hex fills mirroring `BOARD_CHROME_TONE` (Recharts cannot use Tailwind classes).
 * Keep these in lockstep with the shell tones above so Overview charts match board chrome.
 */
export const BOARD_CHART_FILL = {
  queue: "#f43f5e",
  ready: "#34d399",
  inProgress: "#a8a29e",
  completed: "#38bdf8",
  cyan: "#22d3ee",
  amber: "#fbbf24",
  violet: "#a78bfa",
  orangeRed: "#fb923c",
  red: "#f87171",
  slate: "#94a3b8",
} as const;

/** Operations Board column id → chart fill (Overview client-mix pie). */
export const OPERATIONS_BOARD_CHART_FILL = {
  queued: BOARD_CHART_FILL.queue,
  ready: BOARD_CHART_FILL.ready,
  inProgress: BOARD_CHART_FILL.inProgress,
  completed: BOARD_CHART_FILL.completed,
} as const;

/** Inventory Pipeline column id → chart fill (Overview batch bars). */
export const PIPELINE_COLUMN_CHART_FILL = {
  acquiring: BOARD_CHART_FILL.cyan,
  packaging: BOARD_CHART_FILL.amber,
  ready: BOARD_CHART_FILL.ready,
  assigned: BOARD_CHART_FILL.violet,
  hold: BOARD_CHART_FILL.orangeRed,
  problem: BOARD_CHART_FILL.red,
  review: BOARD_CHART_FILL.slate,
} as const;
