import { describe, it, expect } from "vitest";
import {
  BOARD_COLUMN_META,
  QUEUE_CLIENT_DROP_PREFIX,
  queueClientDropId,
  parseQueueClientDropId,
  resolvePendingDragAssign,
  formatAmount,
  indexBatchesById,
  resolveBatchesForRequest,
  sumAssignedCapacity,
  computeRemainingAssignable,
  getReadyBatches,
  validateBatchAssignment,
  buildProgressRingBackground,
  buildRequestDetailTiles,
} from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";

const batches: InventoryBatch[] = [
  { id: "batch-001", label: "Batch 001", capacity: 500, status: "ready" },
  { id: "batch-002", label: "Batch 002", capacity: 700, status: "ready" },
  { id: "batch-010", label: "Batch 010", capacity: 900, status: "assigned" },
];

describe("operationsBoard.helpers", () => {
  it("exposes stable board column metadata for lifecycle columns", () => {
    expect(BOARD_COLUMN_META.queued.title).toBe("Queued");
    expect(BOARD_COLUMN_META.inProgress.emptyHint).toMatch(/in-progress/i);
    expect(BOARD_COLUMN_META.completed.key).toBe("completed");
  });

  it("builds and parses queue droppable ids", () => {
    expect(queueClientDropId("req-001")).toBe(`${QUEUE_CLIENT_DROP_PREFIX}req-001`);
    expect(parseQueueClientDropId(queueClientDropId("req-001"))).toBe("req-001");
    expect(parseQueueClientDropId("other-drop")).toBeNull();
  });

  it("resolves a valid ready-batch drop onto a queued request", () => {
    const queued: OperationRequest = {
      id: "req-001",
      clientId: "client-001",
      clientLabel: "Client 001",
      amount: 1200,
      status: "queued",
      requestedAt: "2026-07-18T09:10:00.000Z",
      batchIds: [],
    };
    const pending = resolvePendingDragAssign({
      dragType: "batch",
      overId: queueClientDropId("req-001"),
      batchId: "batch-001",
      availableBatches: batches,
      queued: [queued],
    });
    expect(pending?.batch.id).toBe("batch-001");
    expect(pending?.request.id).toBe("req-001");
    expect(
      resolvePendingDragAssign({
        dragType: "batch",
        overId: queueClientDropId("req-001"),
        batchId: "batch-010",
        availableBatches: batches,
        queued: [queued],
      }),
    ).toBeNull();
  });

  it("formats amounts safely", () => {
    expect(formatAmount(1200)).toBe("1,200");
    expect(formatAmount("800")).toBe("800");
    expect(formatAmount(null)).toBe("0");
  });

  it("indexes and resolves batches for a request", () => {
    const request: OperationRequest = {
      id: "req-010",
      clientId: "client-010",
      clientLabel: "Client 010",
      amount: 1500,
      status: "inProgress",
      requestedAt: "2026-07-18T08:40:00.000Z",
      batchIds: ["batch-010", "missing"],
    };
    const resolved = resolveBatchesForRequest(request, batches);
    expect(resolved).toHaveLength(1);
    expect(resolved[0].id).toBe("batch-010");
    expect(sumAssignedCapacity(request, batches)).toBe(900);
    expect(computeRemainingAssignable(request, batches)).toBe(600);
  });

  it("filters ready batches and validates assignment", () => {
    expect(getReadyBatches(batches).map((b) => b.id)).toEqual([
      "batch-001",
      "batch-002",
    ]);
    expect(validateBatchAssignment([], batches)).toEqual({
      ok: false,
      reason: "Select at least one ready batch.",
    });
    expect(validateBatchAssignment(["batch-010"], batches).ok).toBe(false);
    expect(validateBatchAssignment(["batch-001"], batches)).toEqual({ ok: true });
  });

  it("builds a progress ring with assigned arcs and neutral remainder", () => {
    const g = buildProgressRingBackground(1500, [
      { id: "batch-010", label: "Batch 010", capacity: 900, status: "assigned" },
    ]);
    expect(g).toContain("conic-gradient");
    expect(g).toContain("68 68 68");
    expect(g).toContain("255 215 0");
  });

  it("builds request detail tiles for the detail modal", () => {
    const request: OperationRequest = {
      id: "req-001",
      clientId: "client-001",
      clientLabel: "Client 001",
      amount: 1200,
      status: "queued",
      requestedAt: "2026-07-18T09:10:00.000Z",
      batchIds: [],
    };
    const tiles = buildRequestDetailTiles(request, batches);
    expect(tiles.find((t) => t.label === "Client")?.value).toBe("Client 001");
    expect(tiles.find((t) => t.label === "Amount")?.value).toBe("1,200");
    expect(indexBatchesById(batches).get("batch-001")?.capacity).toBe(500);
  });
});
