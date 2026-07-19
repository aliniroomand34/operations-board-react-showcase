import { describe, it, expect } from "vitest";
import {
  QUEUE_CLIENT_DROP_PREFIX,
  queueClientDropId,
  parseQueueClientDropId,
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
  it("builds and parses queue droppable ids", () => {
    expect(queueClientDropId("req-001")).toBe(`${QUEUE_CLIENT_DROP_PREFIX}req-001`);
    expect(parseQueueClientDropId(queueClientDropId("req-001"))).toBe("req-001");
    expect(parseQueueClientDropId("other-drop")).toBeNull();
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
    expect(validateBatchAssignment([], batches).ok).toBe(false);
    expect(validateBatchAssignment(["batch-010"], batches).ok).toBe(false);
    expect(validateBatchAssignment(["batch-001"], batches)).toEqual({ ok: true });
  });

  it("builds a progress ring with assigned arcs and neutral remainder", () => {
    const g = buildProgressRingBackground(1500, [
      { id: "batch-010", label: "Batch 010", capacity: 900, status: "assigned" },
    ]);
    expect(g).toContain("conic-gradient");
    expect(g).toContain("148 163 184");
    expect(g).toContain("234 179 8");
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
