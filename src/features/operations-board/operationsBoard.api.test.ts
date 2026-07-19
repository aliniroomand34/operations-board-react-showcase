/**
 * Unit tests for mock API state transitions (queued → inProgress → completed).
 * These defend business rules at the API boundary — not React rendering.
 */
import { beforeEach, describe, expect, it } from "vitest";
import {
  assignBatchesToRequest,
  completeOperationRequest,
  getBatchDetail,
  getOperationsBoard,
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
} from "./operationsBoard.api";

describe("operationsBoard.api", () => {
  beforeEach(() => {
    setOperationsBoardMockDelay(0);
    resetOperationsBoardMock("default");
  });

  it("returns the synthetic board snapshot", async () => {
    const board = await getOperationsBoard();
    expect(board.queued.map((r) => r.id)).toContain("req-001");
    expect(board.inProgress.map((r) => r.id)).toContain("req-010");
    expect(board.completed.map((r) => r.id)).toContain("req-020");
    expect(board.availableBatches.some((b) => b.status === "ready")).toBe(true);
  });

  it("assigns ready batches: queued → inProgress and batch status → assigned", async () => {
    const next = await assignBatchesToRequest("req-001", ["batch-001"]);

    expect(next.queued.find((r) => r.id === "req-001")).toBeUndefined();
    const active = next.inProgress.find((r) => r.id === "req-001");
    expect(active?.status).toBe("inProgress");
    expect(active?.batchIds).toEqual(["batch-001"]);
    expect(
      next.availableBatches.find((b) => b.id === "batch-001")?.status,
    ).toBe("assigned");
  });

  it("completes an in-progress request and finalizes its batches", async () => {
    const next = await completeOperationRequest("req-010");

    expect(next.inProgress.find((r) => r.id === "req-010")).toBeUndefined();
    const done = next.completed.find((r) => r.id === "req-010");
    expect(done?.status).toBe("completed");
    expect(
      next.availableBatches.find((b) => b.id === "batch-010")?.status,
    ).toBe("completed");
  });

  it("rejects when mock failure flag is set", async () => {
    setOperationsBoardMockFailure(true);
    await expect(getOperationsBoard()).rejects.toMatchObject({
      code: "MOCK_API_FAILURE",
    });
  });

  it("rejects assignment when batch is not ready", async () => {
    await expect(
      assignBatchesToRequest("req-001", ["batch-010"]),
    ).rejects.toMatchObject({ code: "BATCH_UNAVAILABLE" });
  });

  it("returns a single ready batch by id via getBatchDetail", async () => {
    const batch = await getBatchDetail("batch-001");
    expect(batch).toMatchObject({
      id: "batch-001",
      status: "ready",
    });
  });

  it("rejects getBatchDetail for an unknown batch id", async () => {
    await expect(getBatchDetail("batch-missing")).rejects.toMatchObject({
      code: "BATCH_NOT_FOUND",
    });
  });
});
