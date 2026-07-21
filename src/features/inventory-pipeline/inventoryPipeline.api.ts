/**
 * Mock API boundary for the Inventory Pipeline showcase.
 * Async functions + artificial delay simulate network loading without a backend.
 */
import { DEMO_STORE_DELAY_MS } from "./inventoryPipeline.api.runtime";
import {
  addCatalogItem,
  advancePipelineBatch,
  archivePipelineBatch,
  handoffBatchToBoard,
  markPipelineBatchProblem,
  movePipelineBatch,
  retryPipelineBatch,
  setCatalogItemStatus,
  submitBatchRequest,
} from "./inventoryPipeline.api.mutations";
import {
  beginDemoStoreCall,
  cloneCurrentDemoStore,
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
} from "./inventoryPipeline.api.runtime";
import type { InventoryPipelineSnapshot } from "./inventoryPipeline.types";

export { DEMO_STORE_DELAY_MS };
export {
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
};

export {
  addCatalogItem,
  advancePipelineBatch,
  archivePipelineBatch,
  handoffBatchToBoard,
  markPipelineBatchProblem,
  movePipelineBatch,
  retryPipelineBatch,
  setCatalogItemStatus,
  submitBatchRequest,
};

/**
 * Fetch the full pipeline snapshot (catalog, accounts, batches, jobs).
 */
export async function getInventoryPipeline(): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();
  return cloneCurrentDemoStore();
}
