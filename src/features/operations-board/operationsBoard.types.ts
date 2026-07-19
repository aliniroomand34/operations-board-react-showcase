/**
 * Domain types for the Operations Board showcase.
 * These shapes are the contract between mock data, API, helpers, hook, and UI.
 */

/** Column / request lifecycle on the board. */
export type BoardStatus = "queued" | "inProgress" | "completed";

/** Inventory batch lifecycle in the demo inventory pool. */
export type BatchStatus = "ready" | "assigned" | "completed";

/**
 * Board column identity — mirrors `BoardStatus` for UI column metadata.
 * Kept as an alias so column config and status stay aligned.
 */
export type BoardColumn = BoardStatus;

/** A unit of assignable inventory (anonymized "batch"). */
export interface InventoryBatch {
  id: string;
  label: string;
  capacity: number;
  status: BatchStatus;
}

/** A client operation request moving across board columns. */
export interface OperationRequest {
  id: string;
  clientId: string;
  clientLabel: string;
  amount: number;
  status: BoardStatus;
  requestedAt: string;
  batchIds: string[];
}

/** Full board snapshot returned by the mock API. */
export interface OperationsBoardSnapshot {
  queued: OperationRequest[];
  inProgress: OperationRequest[];
  completed: OperationRequest[];
  availableBatches: InventoryBatch[];
}

/** Mock reset presets. */
export type OperationsBoardMockPreset = "default" | "empty";

/** Result of validating a batch assignment before calling the API. */
export type BatchAssignmentValidation =
  | { ok: true }
  | { ok: false; reason: string };

/** Label/value tile for request detail panels. */
export interface RequestDetailTile {
  label: string;
  value: string;
}

/** Pending drag-and-drop assignment awaiting user confirmation. */
export interface PendingDragAssign {
  batch: InventoryBatch;
  request: OperationRequest;
}

/**
 * Discriminated union for async board load UI.
 * Prefer narrowing on `status` instead of checking loading/error/board separately.
 * Hook consolidation onto this shape is deferred — see ADR 005.
 */
export type BoardAsyncState =
  | { status: "loading" }
  | { status: "error"; message: string }
  | { status: "success"; board: OperationsBoardSnapshot; isEmpty: boolean };

/** Stable column metadata for the board UI. */
export interface BoardColumnMeta {
  key: BoardColumn;
  title: string;
  emptyHint: string;
}

/** Typed error from the mock API boundary (includes machine-readable code). */
export interface MockApiFailure extends Error {
  code: string;
}
