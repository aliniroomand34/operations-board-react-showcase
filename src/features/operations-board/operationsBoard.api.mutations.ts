/**
 * Mock API mutations — in-memory state transitions for the Operations Board demo.
 */
import { commitDemoBoardMutation } from "@/mocks/demoStore";
import {
  beginMockApiCall,
  cloneCurrentBoard,
  createMockApiError,
  getMutableBoardState,
} from "./operationsBoard.api.runtime";
import type { OperationsBoardSnapshot } from "./operationsBoard.types";

/**
 * Assign ready batches to a queued operation request → moves it to inProgress.
 */
export async function assignBatchesToRequest(
  requestId: string,
  batchIds: string[],
): Promise<OperationsBoardSnapshot> {
  await beginMockApiCall();

  const ids = (Array.isArray(batchIds) ? batchIds : []).map(String);
  if (ids.length === 0) {
    throw createMockApiError(
      "At least one batch id is required.",
      "VALIDATION",
    );
  }

  const board = getMutableBoardState();
  const queuedIndex = board.queued.findIndex((r) => r.id === String(requestId));
  if (queuedIndex < 0) {
    throw createMockApiError(
      `Queued request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  for (const id of ids) {
    const batch = board.availableBatches.find((b) => b.id === id);
    if (!batch || batch.status !== "ready") {
      throw createMockApiError(
        `Batch is not available for assignment: ${id}`,
        "BATCH_UNAVAILABLE",
      );
    }
  }

  const [request] = board.queued.splice(queuedIndex, 1);
  request.status = "inProgress";
  request.batchIds = [...ids];

  for (const id of ids) {
    const batch = board.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "assigned";
  }

  board.inProgress = [request, ...board.inProgress];
  commitDemoBoardMutation();
  return cloneCurrentBoard();
}

/**
 * Mark an in-progress request as completed and finalize its batches.
 */
export async function completeOperationRequest(
  requestId: string,
): Promise<OperationsBoardSnapshot> {
  await beginMockApiCall();

  const board = getMutableBoardState();
  const index = board.inProgress.findIndex((r) => r.id === String(requestId));
  if (index < 0) {
    throw createMockApiError(
      `In-progress request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  const [request] = board.inProgress.splice(index, 1);
  request.status = "completed";

  for (const id of request.batchIds) {
    const batch = board.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "completed";
  }

  board.completed = [request, ...board.completed];
  commitDemoBoardMutation();
  return cloneCurrentBoard();
}

/**
 * Assign additional ready batches onto an already in-progress request.
 */
export async function assignBatchesToInProgressRequest(
  requestId: string,
  batchIds: string[],
): Promise<OperationsBoardSnapshot> {
  await beginMockApiCall();

  const ids = (Array.isArray(batchIds) ? batchIds : []).map(String);
  if (ids.length === 0) {
    throw createMockApiError(
      "At least one batch id is required.",
      "VALIDATION",
    );
  }

  const board = getMutableBoardState();
  const request = board.inProgress.find((r) => r.id === String(requestId));
  if (!request) {
    throw createMockApiError(
      `In-progress request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  for (const id of ids) {
    const batch = board.availableBatches.find((b) => b.id === id);
    if (!batch || batch.status !== "ready") {
      throw createMockApiError(
        `Batch is not available for assignment: ${id}`,
        "BATCH_UNAVAILABLE",
      );
    }
  }

  request.batchIds = [...new Set([...(request.batchIds || []), ...ids])];
  for (const id of ids) {
    const batch = board.availableBatches.find((b) => b.id === id);
    if (batch) batch.status = "assigned";
  }

  commitDemoBoardMutation();
  return cloneCurrentBoard();
}

/**
 * Remove a queued operation request before any batches are assigned.
 */
export async function cancelQueuedRequest(
  requestId: string,
): Promise<OperationsBoardSnapshot> {
  await beginMockApiCall();

  const board = getMutableBoardState();
  const index = board.queued.findIndex((r) => r.id === String(requestId));
  if (index < 0) {
    throw createMockApiError(
      `Queued request not found: ${requestId}`,
      "REQUEST_NOT_FOUND",
    );
  }

  board.queued.splice(index, 1);
  commitDemoBoardMutation();
  return cloneCurrentBoard();
}
