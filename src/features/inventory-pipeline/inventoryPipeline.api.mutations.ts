/**
 * Mock API mutations — catalog, batch requests, column workflow, board handoff.
 */
import {
  commitDemoBoardMutation,
  getMutableBoardState,
} from "@/mocks/demoStore";
import type { InventoryBatch } from "@/features/operations-board/operationsBoard.types";
import {
  buildAcquisitionJob,
  computeBatchCapacity,
  formatPipelineBatchLabel,
  nextHandoffBoardBatchId,
  validateBatchRequest,
} from "./inventoryPipeline.helpers";
import {
  beginDemoStoreCall,
  cloneCurrentDemoStore,
  commitDemoStoreMutation,
  createDemoStoreError,
  getMutableDemoStore,
  nextAcquisitionJobId,
  nextCatalogSkuId,
  nextPipelineBatchId,
} from "./inventoryPipeline.api.runtime";
import type {
  BatchRequestPayload,
  HandoffToBoardResult,
  InventoryPipelineSnapshot,
  PipelineColumn,
  SubmitBatchRequestResult,
} from "./inventoryPipeline.types";

function findPipelineBatch(batchId: string) {
  const store = getMutableDemoStore();
  const batch = store.pipelineBatches.find((b) => b.id === String(batchId));
  if (!batch) {
    throw createDemoStoreError(
      `Pipeline batch not found: ${batchId}`,
      "BATCH_NOT_FOUND",
    );
  }
  return batch;
}

/**
 * Add a catalog item to the allowlist.
 */
export async function addCatalogItem(
  label: string,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const trimmed = String(label).trim();
  if (!trimmed) {
    throw createDemoStoreError("Catalog label is required.", "VALIDATION");
  }

  const store = getMutableDemoStore();
  const id = nextCatalogSkuId();
  store.catalog.push({ id, label: trimmed, status: "enabled" });
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Enable or disable a catalog item.
 */
export async function setCatalogItemStatus(
  skuId: string,
  status: "enabled" | "disabled",
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const store = getMutableDemoStore();
  const item = store.catalog.find((c) => c.id === String(skuId));
  if (!item) {
    throw createDemoStoreError(`Catalog item not found: ${skuId}`, "SKU_NOT_FOUND");
  }

  item.status = status;
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Submit a batch request — creates acquisition job + pipeline batch in Acquiring.
 */
export async function submitBatchRequest(
  payload: BatchRequestPayload,
): Promise<SubmitBatchRequestResult> {
  await beginDemoStoreCall();

  const store = getMutableDemoStore();
  const validation = validateBatchRequest(
    payload,
    store.catalog,
    store.linkedAccounts,
  );
  if (!validation.ok) {
    throw createDemoStoreError(validation.reason, "VALIDATION");
  }

  const batchId = nextPipelineBatchId();
  const jobId = nextAcquisitionJobId();
  const capacity = computeBatchCapacity(payload.lineItems);

  const batch = {
    id: batchId,
    label: formatPipelineBatchLabel(batchId),
    column: "acquiring" as const,
    requestPayload: structuredClone(payload),
    acquisitionJobId: jobId,
    capacity,
    createdAt: new Date().toISOString(),
  };

  const job = buildAcquisitionJob(jobId, batchId, payload);

  store.pipelineBatches.unshift(batch);
  store.acquisitionJobs.unshift(job);
  commitDemoStoreMutation();

  return {
    snapshot: cloneCurrentDemoStore(),
    jobId,
    batchId,
  };
}

/**
 * Move a pipeline batch to a target column.
 */
export async function movePipelineBatch(
  batchId: string,
  targetColumn: PipelineColumn,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const batch = findPipelineBatch(batchId);
  batch.column = targetColumn;
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Retry a problem batch — returns it to Acquiring.
 */
export async function retryPipelineBatch(
  batchId: string,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const batch = findPipelineBatch(batchId);
  if (batch.column !== "problem") {
    throw createDemoStoreError(
      "Only problem batches can be retried.",
      "INVALID_COLUMN",
    );
  }

  batch.column = "acquiring";
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Archive a problem batch into Review.
 */
export async function archivePipelineBatch(
  batchId: string,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const batch = findPipelineBatch(batchId);
  if (batch.column !== "problem") {
    throw createDemoStoreError(
      "Only problem batches can be archived.",
      "INVALID_COLUMN",
    );
  }

  batch.column = "review";
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Hand off a ready pipeline batch to the Operations Board inventory pool.
 */
export async function handoffBatchToBoard(
  batchId: string,
): Promise<HandoffToBoardResult> {
  await beginDemoStoreCall();

  const store = getMutableDemoStore();
  const batch = store.pipelineBatches.find((b) => b.id === String(batchId));
  if (!batch) {
    throw createDemoStoreError(
      `Pipeline batch not found: ${batchId}`,
      "BATCH_NOT_FOUND",
    );
  }

  if (batch.column !== "ready") {
    throw createDemoStoreError(
      "Only ready batches can be handed off to the Operations Board.",
      "INVALID_COLUMN",
    );
  }

  const board = getMutableBoardState();
  const boardBatchId = nextHandoffBoardBatchId(
    board.availableBatches.map((b) => b.id),
  );

  const boardBatch: InventoryBatch = {
    id: boardBatchId,
    label: batch.label,
    capacity: batch.capacity,
    status: "ready",
  };

  board.availableBatches.unshift(boardBatch);
  batch.column = "assigned";
  commitDemoBoardMutation();
  commitDemoStoreMutation();

  return {
    snapshot: cloneCurrentDemoStore(),
    boardBatchId,
  };
}

/**
 * Advance a batch one step through the pipeline (demo shortcut without Extension Sim).
 */
export async function advancePipelineBatch(
  batchId: string,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const batch = findPipelineBatch(batchId);
  const nextColumn: Partial<Record<PipelineColumn, PipelineColumn>> = {
    acquiring: "packaging",
    packaging: "ready",
  };

  const target = nextColumn[batch.column];
  if (!target) {
    throw createDemoStoreError(
      `Batch in ${batch.column} cannot be advanced manually.`,
      "INVALID_COLUMN",
    );
  }

  batch.column = target;
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}

/**
 * Move a batch to the problem column (demo control).
 */
export async function markPipelineBatchProblem(
  batchId: string,
): Promise<InventoryPipelineSnapshot> {
  await beginDemoStoreCall();

  const batch = findPipelineBatch(batchId);
  batch.column = "problem";
  commitDemoStoreMutation();
  return cloneCurrentDemoStore();
}
