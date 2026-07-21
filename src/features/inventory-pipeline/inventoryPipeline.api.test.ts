/**
 * Unit tests for Inventory Pipeline mock API mutations.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { getOperationsBoard } from "@/features/operations-board/operationsBoard.api";
import { SAMPLE_BATCH_REQUEST } from "@/mocks/demoStore.data";
import {
  addCatalogItem,
  advancePipelineBatch,
  getInventoryPipeline,
  handoffBatchToBoard,
  resetDemoStore,
  markPipelineBatchProblem,
  retryPipelineBatch,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
  submitBatchRequest,
} from "./inventoryPipeline.api";

describe("inventoryPipeline.api", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    setDemoStoreMockFailure(false);
    resetDemoStore("default");
  });

  it("returns the synthetic pipeline snapshot", async () => {
    const snapshot = await getInventoryPipeline();
    expect(snapshot.catalog.some((c) => c.id === "sku-001")).toBe(true);
    expect(snapshot.pipelineBatches.some((b) => b.id === "batch-pipe-001")).toBe(
      true,
    );
  });

  it("adds a catalog item", async () => {
    const next = await addCatalogItem("Catalog Item D");
    expect(next.catalog.some((c) => c.label === "Catalog Item D")).toBe(true);
  });

  it("submits a batch request and creates acquiring batch + job", async () => {
    const result = await submitBatchRequest(SAMPLE_BATCH_REQUEST);

    expect(result.jobId).toMatch(/^job-/);
    expect(result.batchId).toMatch(/^batch-pipe-/);
    expect(
      result.snapshot.pipelineBatches.find((b) => b.id === result.batchId)?.column,
    ).toBe("acquiring");
    expect(
      result.snapshot.acquisitionJobs.find((j) => j.id === result.jobId)?.batchId,
    ).toBe(result.batchId);
  });

  it("advances a batch through packaging to ready", async () => {
    const afterPackaging = await advancePipelineBatch("batch-pipe-001");
    expect(
      afterPackaging.pipelineBatches.find((b) => b.id === "batch-pipe-001")
        ?.column,
    ).toBe("packaging");

    const afterReady = await advancePipelineBatch("batch-pipe-001");
    expect(
      afterReady.pipelineBatches.find((b) => b.id === "batch-pipe-001")?.column,
    ).toBe("ready");
  });

  it("hands off a ready batch to the Operations Board", async () => {
    await advancePipelineBatch("batch-pipe-001");
    await advancePipelineBatch("batch-pipe-001");

    const result = await handoffBatchToBoard("batch-pipe-001");
    expect(result.boardBatchId).toMatch(/^batch-/);

    const board = await getOperationsBoard();
    expect(
      board.availableBatches.some(
        (b) => b.id === result.boardBatchId && b.status === "ready",
      ),
    ).toBe(true);

    expect(
      result.snapshot.pipelineBatches.find((b) => b.id === "batch-pipe-001")
        ?.column,
    ).toBe("assigned");
  });

  it("retries a problem batch back to acquiring", async () => {
    await markPipelineBatchProblem("batch-pipe-001");

    const next = await retryPipelineBatch("batch-pipe-001");
    expect(
      next.pipelineBatches.find((b) => b.id === "batch-pipe-001")?.column,
    ).toBe("acquiring");
  });

  it("rejects when mock failure flag is set", async () => {
    setDemoStoreMockFailure(true);
    await expect(getInventoryPipeline()).rejects.toMatchObject({
      code: "MOCK_API_FAILURE",
    });
  });
});
