/**
 * Pure selectors — derive Overview KPIs, chart series, and tables from a store snapshot.
 */
import { demoChartFill } from "@/features/demo-charts/demoCharts.theme";
import type { DemoChartDatum } from "@/features/demo-charts/demoCharts.types";
import {
  PIPELINE_COLUMN_META,
  PIPELINE_COLUMNS,
} from "@/features/inventory-pipeline/inventoryPipeline.helpers";
import {
  OPERATIONS_BOARD_CHART_FILL,
  PIPELINE_COLUMN_CHART_FILL,
} from "@/features/shared/boardChrome";
import type { DemoStoreSnapshot } from "@/mocks/demoStore.types";
import type {
  DemoOverviewChartSegment,
  DemoOverviewMetrics,
  DemoOverviewSnapshot,
  DemoOverviewTableRow,
} from "./overview.types";

function countBoardReadyBatches(board: DemoStoreSnapshot["board"]): number {
  return board.availableBatches.filter((batch) => batch.status === "ready").length;
}

function countPipelineInColumn(
  batches: DemoStoreSnapshot["pipelineBatches"],
  column: DemoStoreSnapshot["pipelineBatches"][number]["column"],
): number {
  return batches.filter((batch) => batch.column === column).length;
}

function toTableRows(series: DemoChartDatum[]): DemoOverviewTableRow[] {
  return series.map((row) => ({
    id: row.id,
    label: row.name,
    value: row.value,
  }));
}

/** Derive the four KPI card values from the current store snapshot. */
export function selectOverviewMetrics(store: DemoStoreSnapshot): DemoOverviewMetrics {
  const { board, linkedAccounts, pipelineBatches } = store;

  return {
    queuedOperations: board.queued.length,
    readyBatches:
      countBoardReadyBatches(board) + countPipelineInColumn(pipelineBatches, "ready"),
    inProgress: board.inProgress.length,
    linkedAccountsOnline: linkedAccounts.filter((account) => account.online).length,
  };
}

/** Labeled chart segments — board + pipeline counts for compact workflow summary. */
export function selectOverviewChartSegments(
  store: DemoStoreSnapshot,
): DemoOverviewChartSegment[] {
  const { board, pipelineBatches } = store;

  return [
    { id: "queued", label: "Queued", value: board.queued.length },
    {
      id: "board-ready",
      label: "Board ready",
      value: countBoardReadyBatches(board),
    },
    {
      id: "pipe-ready",
      label: "Pipe ready",
      value: countPipelineInColumn(pipelineBatches, "ready"),
    },
    { id: "in-progress", label: "In progress", value: board.inProgress.length },
    {
      id: "acquiring",
      label: "Acquiring",
      value: countPipelineInColumn(pipelineBatches, "acquiring"),
    },
    {
      id: "packaging",
      label: "Packaging",
      value: countPipelineInColumn(pipelineBatches, "packaging"),
    },
  ];
}

/** Client operation mix by board column — feeds Overview pie chart. */
export function selectOverviewClientMix(store: DemoStoreSnapshot): DemoChartDatum[] {
  const { board } = store;
  const rows: Array<{
    id: string;
    name: string;
    shortName: string;
    value: number;
    fill: string;
  }> = [
    {
      id: "queued",
      name: "Queued",
      shortName: "Queued",
      value: board.queued.length,
      fill: OPERATIONS_BOARD_CHART_FILL.queued,
    },
    {
      id: "in-progress",
      name: "In progress",
      shortName: "Active",
      value: board.inProgress.length,
      fill: OPERATIONS_BOARD_CHART_FILL.inProgress,
    },
    {
      id: "completed",
      name: "Completed",
      shortName: "Done",
      value: board.completed.length,
      fill: OPERATIONS_BOARD_CHART_FILL.completed,
    },
  ];

  return rows;
}

/** Pipeline batch counts by column — feeds Overview bar chart. */
export function selectOverviewBatchByColumn(
  store: DemoStoreSnapshot,
): DemoChartDatum[] {
  return PIPELINE_COLUMNS.map((column) => {
    const meta = PIPELINE_COLUMN_META[column];
    return {
      id: column,
      name: meta.title,
      shortName: meta.title,
      value: countPipelineInColumn(store.pipelineBatches, column),
      fill: PIPELINE_COLUMN_CHART_FILL[column],
    };
  });
}

/**
 * Linked-account capacity bars.
 * Uses seed capacity; online accounts keep full capacity, offline show 0 so
 * the series still reacts to store presets / account online flags.
 */
export function selectOverviewLinkedAccountCapacity(
  store: DemoStoreSnapshot,
): DemoChartDatum[] {
  return store.linkedAccounts.map((account, index) => {
    const shortName = account.id.replace(/^acct-/, "A");
    return {
      id: account.id,
      name: account.label,
      shortName,
      value: account.online ? account.capacity : 0,
      fill: demoChartFill(index),
    };
  });
}

/** Full Overview snapshot for hooks and tests. */
export function selectOverviewSnapshot(store: DemoStoreSnapshot): DemoOverviewSnapshot {
  const clientMix = selectOverviewClientMix(store);
  const batchByColumn = selectOverviewBatchByColumn(store);
  const linkedAccountCapacity = selectOverviewLinkedAccountCapacity(store);

  const linkedAccountTable: DemoOverviewTableRow[] = store.linkedAccounts.map(
    (account) => ({
      id: account.id,
      label: account.label,
      value: account.online ? account.capacity : 0,
      detail: account.online ? "Online" : "Offline",
    }),
  );

  return {
    metrics: selectOverviewMetrics(store),
    chartSegments: selectOverviewChartSegments(store),
    clientMix,
    batchByColumn,
    linkedAccountCapacity,
    clientStatusTable: toTableRows(clientMix),
    batchColumnTable: toTableRows(batchByColumn),
    linkedAccountTable,
  };
}
