/**
 * Synthetic Operations Board dataset for the public showcase.
 * No real clients, production amounts, or private product language.
 */
import type { OperationsBoardSnapshot } from "@/features/operations-board/operationsBoard.types";

export type {
  BatchStatus,
  BoardStatus,
  InventoryBatch,
  OperationRequest,
  OperationsBoardSnapshot,
} from "@/features/operations-board/operationsBoard.types";

export const INITIAL_OPERATIONS_BOARD: OperationsBoardSnapshot = {
  queued: [
    {
      id: "req-001",
      clientId: "client-001",
      clientLabel: "Client 001",
      amount: 1200,
      status: "queued",
      requestedAt: "2026-07-18T09:10:00.000Z",
      batchIds: [],
    },
    {
      id: "req-002",
      clientId: "client-002",
      clientLabel: "Client 002",
      amount: 800,
      status: "queued",
      requestedAt: "2026-07-18T09:25:00.000Z",
      batchIds: [],
    },
  ],
  inProgress: [
    {
      id: "req-010",
      clientId: "client-010",
      clientLabel: "Client 010",
      amount: 1500,
      status: "inProgress",
      requestedAt: "2026-07-18T08:40:00.000Z",
      batchIds: ["batch-010", "batch-011"],
    },
  ],
  completed: [
    {
      id: "req-020",
      clientId: "client-020",
      clientLabel: "Client 020",
      amount: 600,
      status: "completed",
      requestedAt: "2026-07-17T16:05:00.000Z",
      batchIds: ["batch-020"],
    },
  ],
  availableBatches: [
    {
      id: "batch-001",
      label: "Batch 001",
      capacity: 500,
      status: "ready",
    },
    {
      id: "batch-002",
      label: "Batch 002",
      capacity: 700,
      status: "ready",
    },
    {
      id: "batch-010",
      label: "Batch 010",
      capacity: 900,
      status: "assigned",
    },
    {
      id: "batch-011",
      label: "Batch 011",
      capacity: 600,
      status: "assigned",
    },
    {
      id: "batch-020",
      label: "Batch 020",
      capacity: 600,
      status: "completed",
    },
  ],
};

/** Empty board for demo / empty-state screenshots. */
export const EMPTY_OPERATIONS_BOARD: OperationsBoardSnapshot = {
  queued: [],
  inProgress: [],
  completed: [],
  availableBatches: [],
};

/** Board stress preset — backlog without ready inventory (error demo). */
export const ERROR_OPERATIONS_BOARD: OperationsBoardSnapshot = {
  queued: [
    {
      id: "req-001",
      clientId: "client-001",
      clientLabel: "Client 001",
      amount: 1200,
      status: "queued",
      requestedAt: "2026-07-18T09:10:00.000Z",
      batchIds: [],
    },
    {
      id: "req-002",
      clientId: "client-002",
      clientLabel: "Client 002",
      amount: 800,
      status: "queued",
      requestedAt: "2026-07-18T09:25:00.000Z",
      batchIds: [],
    },
    {
      id: "req-003",
      clientId: "client-003",
      clientLabel: "Client 003",
      amount: 950,
      status: "queued",
      requestedAt: "2026-07-18T09:40:00.000Z",
      batchIds: [],
    },
  ],
  inProgress: [
    {
      id: "req-010",
      clientId: "client-010",
      clientLabel: "Client 010",
      amount: 1500,
      status: "inProgress",
      requestedAt: "2026-07-18T08:40:00.000Z",
      batchIds: ["batch-010", "batch-011"],
    },
  ],
  completed: [],
  availableBatches: [
    {
      id: "batch-010",
      label: "Batch 010",
      capacity: 900,
      status: "assigned",
    },
    {
      id: "batch-011",
      label: "Batch 011",
      capacity: 600,
      status: "assigned",
    },
  ],
};

/**
 * Deep-clone a board snapshot so callers cannot mutate the seed data.
 */
export function cloneOperationsBoard(
  board: OperationsBoardSnapshot,
): OperationsBoardSnapshot {
  return structuredClone(board);
}
