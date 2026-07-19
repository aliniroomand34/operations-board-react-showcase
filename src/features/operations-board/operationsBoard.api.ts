/**
 * Mock API boundary for the Operations Board showcase.
 * Async functions + artificial delay simulate network loading without a backend.
 * Mutations update an in-memory snapshot only (safe for Vercel/Netlify static deploys).
 */
import {
  EMPTY_OPERATIONS_BOARD,
  INITIAL_OPERATIONS_BOARD,
  cloneOperationsBoard,
} from "@/mocks/operationsBoard.data";
import type {
  InventoryBatch,
  MockApiFailure,
  OperationsBoardMockPreset,
  OperationsBoardSnapshot,
} from "@/features/operations-board/operationsBoard.types";

/** Default artificial latency (ms) so loading UI is visible in the demo. */
export const MOCK_API_DELAY_MS = 450;

let boardState: OperationsBoardSnapshot = cloneOperationsBoard(
  INITIAL_OPERATIONS_BOARD,
);

/** When true, the next read/write rejects (demo + tests). */
let forceFailure = false;

/** Mutable delay so Vitest can set `0` without fake timers. */
let delayMs = MOCK_API_DELAY_MS;

function createMockApiError(message: string, code: string): MockApiFailure {
  const error = new Error(message) as MockApiFailure;
  error.code = code;
  return error;
}

function delay(ms: number = delayMs): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function assertNotFailing(): void {
  if (forceFailure) {
    throw createMockApiError(
      "Mock API failure (demo). Retry or reset the failure flag.",
      "MOCK_API_FAILURE",
    );
  }
}

/**
 * Enable/disable simulated network failure for demo or tests.
 */
export function setOperationsBoardMockFailure(shouldFail: boolean): void {
  forceFailure = Boolean(shouldFail);
}

/**
 * Override artificial latency (tests typically use `0`).
 */
export function setOperationsBoardMockDelay(ms: number): void {
  delayMs = Number.isFinite(ms) ? Math.max(0, Number(ms)) : MOCK_API_DELAY_MS;
}

/**
 * Reset in-memory board to a known preset.
 * Does not change delay — call `setOperationsBoardMockDelay` separately in tests.
 */
export function resetOperationsBoardMock(
  preset: OperationsBoardMockPreset = "default",
): void {
  boardState = cloneOperationsBoard(
    preset === "empty" ? EMPTY_OPERATIONS_BOARD : INITIAL_OPERATIONS_BOARD,
  );
  forceFailure = false;
}

/**
 * Fetch the full board snapshot (queued / in progress / completed + available batches).
 */
export async function getOperationsBoard(): Promise<OperationsBoardSnapshot> {
  await delay();
  assertNotFailing();
  return cloneOperationsBoard(boardState);
}

/**
 * Fetch a single inventory batch by id.
 */
export async function getBatchDetail(batchId: string): Promise<InventoryBatch> {
  await delay();
  assertNotFailing();
  const batch = boardState.availableBatches.find((b) => b.id === String(batchId));
  if (!batch) {
    throw createMockApiError(`Batch not found: ${batchId}`, "BATCH_NOT_FOUND");
  }
  return structuredClone(batch);
}

/**
 * Assign ready batches to a queued operation request → moves it to inProgress.
 */
export async function assignBatchesToRequest(
  requestId: string,
  batchIds: string[],
): Promise<OperationsBoardSnapshot> {
  await delay();
  assertNotFailing();

  const ids = (Array.isArray(batchIds) ? batchIds : []).map(String);
  if (ids.length === 0) {
    throw createMockApiError(
      "At least one batch id is required.",
      "VALIDATION",
    );
  }

  const queuedIndex = boardState.queued.findIndex(
    (r) => r.id === String(requestId),
  );
  if (queuedIndex < 0) {
    throw createMockApiError(
      `Queued request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  for (const id of ids) {
    const batch = boardState.availableBatches.find((b) => b.id === id);
    if (!batch || batch.status !== "ready") {
      throw createMockApiError(
        `Batch is not available for assignment: ${id}`,
        "BATCH_UNAVAILABLE",
      );
    }
  }

  const [request] = boardState.queued.splice(queuedIndex, 1);
  request.status = "inProgress";
  request.batchIds = [...ids];

  for (const id of ids) {
    const batch = boardState.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "assigned";
  }

  boardState.inProgress = [request, ...boardState.inProgress];
  return cloneOperationsBoard(boardState);
}

/**
 * Mark an in-progress request as completed and finalize its batches.
 */
export async function completeOperationRequest(
  requestId: string,
): Promise<OperationsBoardSnapshot> {
  await delay();
  assertNotFailing();

  const index = boardState.inProgress.findIndex(
    (r) => r.id === String(requestId),
  );
  if (index < 0) {
    throw createMockApiError(
      `In-progress request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  const [request] = boardState.inProgress.splice(index, 1);
  request.status = "completed";

  for (const id of request.batchIds) {
    const batch = boardState.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "completed";
  }

  boardState.completed = [request, ...boardState.completed];
  return cloneOperationsBoard(boardState);
}

/**
 * Assign additional ready batches onto an already in-progress request.
 */
export async function assignBatchesToInProgressRequest(
  requestId: string,
  batchIds: string[],
): Promise<OperationsBoardSnapshot> {
  await delay();
  assertNotFailing();

  const ids = (Array.isArray(batchIds) ? batchIds : []).map(String);
  if (ids.length === 0) {
    throw createMockApiError(
      "At least one batch id is required.",
      "VALIDATION",
    );
  }

  const request = boardState.inProgress.find((r) => r.id === String(requestId));
  if (!request) {
    throw createMockApiError(
      `In-progress request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  for (const id of ids) {
    const batch = boardState.availableBatches.find((b) => b.id === id);
    if (!batch || batch.status !== "ready") {
      throw createMockApiError(
        `Batch is not available for assignment: ${id}`,
        "BATCH_UNAVAILABLE",
      );
    }
  }

  request.batchIds = [...new Set([...(request.batchIds || []), ...ids])];
  for (const id of ids) {
    const batch = boardState.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "assigned";
  }

  return cloneOperationsBoard(boardState);
}

/**
 * Remove a queued operation request before any batches are assigned.
 */
export async function cancelQueuedRequest(
  requestId: string,
): Promise<OperationsBoardSnapshot> {
  await delay();
  assertNotFailing();

  const index = boardState.queued.findIndex((r) => r.id === String(requestId));
  if (index < 0) {
    throw createMockApiError(
      `Queued request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  boardState.queued.splice(index, 1);
  return cloneOperationsBoard(boardState);
}
