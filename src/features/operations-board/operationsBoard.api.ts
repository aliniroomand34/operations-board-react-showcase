/**
 * Mock API boundary for the Operations Board showcase.
 * Async functions + artificial delay simulate network loading without a backend.
 * Mutations update an in-memory snapshot only (safe for Vercel/Netlify static deploys).
 *
 * Public surface: prefer importing from this module (not `.runtime` / `.mutations`).
 */
import {
  MOCK_API_DELAY_MS,
  beginMockApiCall,
  cloneCurrentBoard,
  createMockApiError,
  getMutableBoardState,
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
} from "./operationsBoard.api.runtime";
import type { InventoryBatch, OperationsBoardSnapshot } from "./operationsBoard.types";

export { MOCK_API_DELAY_MS };
export {
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
};

export {
  assignBatchesToInProgressRequest,
  assignBatchesToRequest,
  cancelQueuedRequest,
  completeOperationRequest,
} from "./operationsBoard.api.mutations";

/**
 * Fetch the full board snapshot (queued / in progress / completed + available batches).
 */
export async function getOperationsBoard(): Promise<OperationsBoardSnapshot> {
  await beginMockApiCall();
  return cloneCurrentBoard();
}

/**
 * Fetch a single inventory batch by id.
 */
export async function getBatchDetail(batchId: string): Promise<InventoryBatch> {
  await beginMockApiCall();
  const batch = getMutableBoardState().availableBatches.find(
    (b) => b.id === String(batchId),
  );
  if (!batch) {
    throw createMockApiError(`Batch not found: ${batchId}`, "BATCH_NOT_FOUND");
  }
  return structuredClone(batch);
}
