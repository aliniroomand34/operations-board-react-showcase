/**
 * Unit tests for the shared demo store — board state, presets, and KPI selectors.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  assignBatchesToRequest,
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
} from "@/features/operations-board/operationsBoard.api";
import { getInventoryPipeline } from "@/features/inventory-pipeline/inventoryPipeline.api";
import { SAMPLE_BATCH_REQUEST } from "@/mocks/demoStore.data";
import {
  createAcquisitionJob,
  getAcquisitionJob,
  getDemoOverviewMetrics,
  getDemoStoreSnapshot,
  resetDemoStore,
  saveAcquisitionJob,
  subscribeDemoStore,
  updatePipelineBatchColumn,
} from "@/mocks/demoStore";

describe("demoStore", () => {
  beforeEach(() => {
    setOperationsBoardMockDelay(0);
    resetDemoStore("default");
  });

  it("returns default overview metrics from the seeded board", () => {
    expect(getDemoOverviewMetrics()).toEqual({
      queuedOperations: 2,
      readyBatches: 2,
      inProgress: 1,
      linkedAccountsOnline: 2,
    });
  });

  it("resets to an empty board and zeroes queue-related metrics", () => {
    resetDemoStore("empty");

    expect(getDemoOverviewMetrics()).toEqual({
      queuedOperations: 0,
      readyBatches: 0,
      inProgress: 0,
      linkedAccountsOnline: 0,
    });
  });

  it("loads the error preset with backlog, problem pipeline batch, and failed job", async () => {
    resetDemoStore("error");

    expect(getDemoOverviewMetrics()).toEqual({
      queuedOperations: 3,
      readyBatches: 0,
      inProgress: 1,
      linkedAccountsOnline: 1,
    });

    const snapshot = await getDemoStoreSnapshot();
    expect(snapshot.pipelineBatches.some((batch) => batch.column === "problem")).toBe(
      true,
    );
    expect(snapshot.acquisitionJobs.some((job) => job.status === "failed")).toBe(true);
  });

  it("notifies subscribers after board mutations", async () => {
    let notificationCount = 0;
    const unsubscribe = subscribeDemoStore(() => {
      notificationCount += 1;
    });

    await assignBatchesToRequest("req-001", ["batch-001"]);

    expect(notificationCount).toBeGreaterThanOrEqual(1);
    expect(getDemoOverviewMetrics()).toMatchObject({
      queuedOperations: 1,
      readyBatches: 1,
      inProgress: 2,
    });

    unsubscribe();
  });

  it("includes pipeline ready batches in readyBatches KPI", async () => {
    const { advancePipelineBatch } = await import(
      "@/features/inventory-pipeline/inventoryPipeline.api"
    );

    await advancePipelineBatch("batch-pipe-001");
    await advancePipelineBatch("batch-pipe-001");

    expect(getDemoOverviewMetrics().readyBatches).toBe(3);
  });

  it("keeps pipeline and board aligned when applying full-store presets", async () => {
    resetDemoStore("error");

    const snapshot = await getInventoryPipeline();
    expect(snapshot.pipelineBatches).toHaveLength(2);
    expect(snapshot.board.queued).toHaveLength(3);
    expect(snapshot.board.availableBatches.every((batch) => batch.status !== "ready")).toBe(
      true,
    );
  });

  it("resets only the board slice via resetOperationsBoardMock", () => {
    resetOperationsBoardMock("empty");
    expect(getDemoOverviewMetrics().queuedOperations).toBe(0);
    expect(getDemoOverviewMetrics().linkedAccountsOnline).toBe(2);

    resetOperationsBoardMock("default");
    expect(getDemoOverviewMetrics().queuedOperations).toBe(2);
  });

  describe("acquisition jobs and pipeline batches", () => {
    it("creates an acquisition job with an acquiring pipeline batch", async () => {
      const job = await createAcquisitionJob(SAMPLE_BATCH_REQUEST);

      expect(job.id).toMatch(/^job-/);
      expect(job.status).toBe("pending");

      const store = await getDemoStoreSnapshot();
      const batch = store.pipelineBatches.find((entry) => entry.id === job.batchId);
      expect(batch?.column).toBe("acquiring");
      expect(batch?.acquisitionJobId).toBe(job.id);
    });

    it("updates a pipeline batch column in the shared store", async () => {
      const updated = await updatePipelineBatchColumn("batch-pipe-001", "ready");
      expect(updated.column).toBe("ready");

      const store = await getDemoStoreSnapshot();
      expect(
        store.pipelineBatches.find((entry) => entry.id === "batch-pipe-001")
          ?.column,
      ).toBe("ready");
    });

    it("throws when an acquisition job is missing", async () => {
      await expect(getAcquisitionJob("job-missing")).rejects.toMatchObject({
        code: "JOB_NOT_FOUND",
      });
    });

    it("persists acquisition job changes via saveAcquisitionJob", async () => {
      const job = await getAcquisitionJob("job-001");
      const saved = await saveAcquisitionJob({ ...job, status: "running" });
      expect(saved.status).toBe("running");

      const reloaded = await getAcquisitionJob("job-001");
      expect(reloaded.status).toBe("running");
    });
  });
});
