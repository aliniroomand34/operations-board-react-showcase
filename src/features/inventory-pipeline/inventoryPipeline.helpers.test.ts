/**
 * Unit tests for Inventory Pipeline pure helpers.
 */
import { describe, expect, it } from "vitest";
import {
  computeBatchCapacity,
  groupBatchesByColumn,
  nextHandoffBoardBatchId,
  validateBatchRequest,
} from "./inventoryPipeline.helpers";
import type { PipelineBatch } from "./inventoryPipeline.types";
import { INITIAL_DEMO_STORE } from "@/mocks/demoStore.data";

describe("inventoryPipeline.helpers", () => {
  it("computes batch capacity from line items", () => {
    expect(
      computeBatchCapacity([
        { skuId: "sku-001", skuLabel: "A", quantity: 2 },
        { skuId: "sku-002", skuLabel: "B", quantity: 3 },
      ]),
    ).toBe(5);
  });

  it("groups pipeline batches by column", () => {
    const batches: PipelineBatch[] = [
      {
        id: "batch-pipe-001",
        label: "Batch pipe-001",
        column: "acquiring",
        requestPayload: INITIAL_DEMO_STORE.pipelineBatches[0]!.requestPayload,
        acquisitionJobId: "job-001",
        capacity: 3,
        createdAt: "2026-07-20T10:00:00.000Z",
      },
      {
        id: "batch-pipe-002",
        label: "Batch pipe-002",
        column: "ready",
        requestPayload: INITIAL_DEMO_STORE.pipelineBatches[0]!.requestPayload,
        acquisitionJobId: "job-002",
        capacity: 2,
        createdAt: "2026-07-20T11:00:00.000Z",
      },
    ];

    const grouped = groupBatchesByColumn(batches);
    expect(grouped.acquiring).toHaveLength(1);
    expect(grouped.ready).toHaveLength(1);
    expect(grouped.packaging).toHaveLength(0);
  });

  it("validates batch request payload against catalog and accounts", () => {
    const payload = INITIAL_DEMO_STORE.pipelineBatches[0]!.requestPayload;

    expect(
      validateBatchRequest(
        payload,
        INITIAL_DEMO_STORE.catalog,
        INITIAL_DEMO_STORE.linkedAccounts,
      ).ok,
    ).toBe(true);

    expect(
      validateBatchRequest(
        { ...payload, linkedAccountIds: [] },
        INITIAL_DEMO_STORE.catalog,
        INITIAL_DEMO_STORE.linkedAccounts,
      ),
    ).toEqual({ ok: false, reason: "Select at least one linked account." });
  });

  it("generates the next board batch id for handoff", () => {
    expect(nextHandoffBoardBatchId(["batch-001", "batch-020"])).toBe("batch-021");
    expect(nextHandoffBoardBatchId([])).toBe("batch-001");
  });
});
