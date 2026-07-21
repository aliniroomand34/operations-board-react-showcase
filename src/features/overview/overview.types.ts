/**
 * Overview dashboard types — KPI cards, chart series, and summary tables from the demo store.
 */
import type { DemoChartDatum } from "@/features/demo-charts/demoCharts.types";

export interface DemoOverviewMetrics {
  queuedOperations: number;
  /** Board-ready inventory plus pipeline batches in the Ready column. */
  readyBatches: number;
  inProgress: number;
  linkedAccountsOnline: number;
}

export interface DemoOverviewChartSegment {
  id: string;
  label: string;
  value: number;
}

export interface DemoOverviewTableRow {
  id: string;
  label: string;
  value: number;
  detail?: string;
}

export interface DemoOverviewSnapshot {
  metrics: DemoOverviewMetrics;
  /** Compact workflow segments (board + pipeline highlights). */
  chartSegments: DemoOverviewChartSegment[];
  /** Client operations by board status — pie series. */
  clientMix: DemoChartDatum[];
  /** Pipeline batches by column — bar series. */
  batchByColumn: DemoChartDatum[];
  /** Linked-account synthetic capacity — bar series. */
  linkedAccountCapacity: DemoChartDatum[];
  clientStatusTable: DemoOverviewTableRow[];
  batchColumnTable: DemoOverviewTableRow[];
  linkedAccountTable: DemoOverviewTableRow[];
}
