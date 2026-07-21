/**
 * Overview selectors — KPI, chart series, and table derivation from the demo store.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_DEMO_STORE } from "@/mocks/demoStore.data";
import { resetDemoStore } from "@/mocks/demoStore";
import { setOperationsBoardMockDelay } from "@/features/operations-board/operationsBoard.api";
import { advancePipelineBatch } from "@/features/inventory-pipeline/inventoryPipeline.api";
import {
  OPERATIONS_BOARD_CHART_FILL,
  PIPELINE_COLUMN_CHART_FILL,
} from "@/features/shared/boardChrome";
import {
  selectOverviewBatchByColumn,
  selectOverviewChartSegments,
  selectOverviewClientMix,
  selectOverviewLinkedAccountCapacity,
  selectOverviewMetrics,
  selectOverviewSnapshot,
} from "./overview.selectors";

describe("overview.selectors", () => {
  beforeEach(() => {
    setOperationsBoardMockDelay(0);
    resetDemoStore("default");
  });

  it("derives default KPI metrics from the seeded store", () => {
    expect(selectOverviewMetrics(INITIAL_DEMO_STORE)).toEqual({
      queuedOperations: 2,
      readyBatches: 2,
      inProgress: 1,
      linkedAccountsOnline: 2,
    });
  });

  it("includes pipeline ready batches in the ready KPI", async () => {
    await advancePipelineBatch("batch-pipe-001");
    await advancePipelineBatch("batch-pipe-001");

    expect(selectOverviewMetrics(INITIAL_DEMO_STORE)).toMatchObject({
      readyBatches: 2,
    });

    const store = structuredClone(INITIAL_DEMO_STORE);
    store.pipelineBatches[0]!.column = "ready";

    expect(selectOverviewMetrics(store).readyBatches).toBe(3);
  });

  it("exposes board and pipeline segments for the activity chart", () => {
    const segments = selectOverviewChartSegments(INITIAL_DEMO_STORE);

    expect(segments).toEqual([
      { id: "queued", label: "Queued", value: 2 },
      { id: "board-ready", label: "Board ready", value: 2 },
      { id: "pipe-ready", label: "Pipe ready", value: 0 },
      { id: "in-progress", label: "In progress", value: 1 },
      { id: "acquiring", label: "Acquiring", value: 1 },
      { id: "packaging", label: "Packaging", value: 0 },
    ]);
  });

  it("builds client mix pie series from board columns", () => {
    const mix = selectOverviewClientMix(INITIAL_DEMO_STORE);

    expect(mix.map((row) => ({ id: row.id, value: row.value }))).toEqual([
      { id: "queued", value: 2 },
      { id: "in-progress", value: 1 },
      { id: "completed", value: 1 },
    ]);
    expect(mix.map((row) => row.fill)).toEqual([
      OPERATIONS_BOARD_CHART_FILL.queued,
      OPERATIONS_BOARD_CHART_FILL.inProgress,
      OPERATIONS_BOARD_CHART_FILL.completed,
    ]);
  });

  it("builds batch-by-column bar series for all pipeline columns", () => {
    const series = selectOverviewBatchByColumn(INITIAL_DEMO_STORE);
    const acquiring = series.find((row) => row.id === "acquiring");

    expect(series).toHaveLength(7);
    expect(acquiring?.value).toBe(1);
    expect(acquiring?.fill).toBe(PIPELINE_COLUMN_CHART_FILL.acquiring);
    expect(series.find((row) => row.id === "packaging")?.value).toBe(0);
    expect(series.find((row) => row.id === "ready")?.fill).toBe(
      PIPELINE_COLUMN_CHART_FILL.ready,
    );
  });

  it("builds linked-account capacity series from online seed capacity", () => {
    const series = selectOverviewLinkedAccountCapacity(INITIAL_DEMO_STORE);

    expect(series).toEqual([
      expect.objectContaining({ id: "acct-001", value: 1200 }),
      expect.objectContaining({ id: "acct-002", value: 850 }),
      expect.objectContaining({ id: "acct-003", value: 0 }),
    ]);
  });

  it("includes summary tables aligned with chart series", () => {
    const snapshot = selectOverviewSnapshot(INITIAL_DEMO_STORE);

    expect(snapshot.clientStatusTable.find((r) => r.id === "queued")?.value).toBe(2);
    expect(snapshot.batchColumnTable.find((r) => r.id === "acquiring")?.value).toBe(1);
    expect(
      snapshot.linkedAccountTable.find((r) => r.id === "acct-001"),
    ).toMatchObject({ value: 1200, detail: "Online" });
  });

  it("updates acquiring segment when pipeline batches advance", async () => {
    await advancePipelineBatch("batch-pipe-001");

    const store = structuredClone(INITIAL_DEMO_STORE);
    store.pipelineBatches[0]!.column = "packaging";

    const segments = selectOverviewChartSegments(store);
    const acquiring = segments.find((segment) => segment.id === "acquiring");
    const packaging = segments.find((segment) => segment.id === "packaging");

    expect(acquiring?.value).toBe(0);
    expect(packaging?.value).toBe(1);

    expect(
      selectOverviewBatchByColumn(store).find((row) => row.id === "packaging")?.value,
    ).toBe(1);
  });
});
