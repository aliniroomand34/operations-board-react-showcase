/**
 * Pure capacity / inventory helpers — indexing, assignment validation, remaining amount.
 */
import type {
  BatchAssignmentValidation,
  InventoryBatch,
  OperationRequest,
} from "./operationsBoard.types";

export function indexBatchesById(
  batches: InventoryBatch[] | null | undefined,
): Map<string, InventoryBatch> {
  const map = new Map<string, InventoryBatch>();
  for (const batch of batches || []) {
    if (batch?.id != null) map.set(String(batch.id), batch);
  }
  return map;
}

export function resolveBatchesForRequest(
  request: OperationRequest | null | undefined,
  batches: Map<string, InventoryBatch> | InventoryBatch[],
): InventoryBatch[] {
  const byId = batches instanceof Map ? batches : indexBatchesById(batches);
  const ids = request?.batchIds || [];
  return ids
    .map((id) => byId.get(String(id)))
    .filter((batch): batch is InventoryBatch => batch != null);
}

export function sumAssignedCapacity(
  request: OperationRequest | null | undefined,
  batches: Map<string, InventoryBatch> | InventoryBatch[],
): number {
  return resolveBatchesForRequest(request, batches).reduce(
    (total, batch) => total + (Number(batch.capacity) || 0),
    0,
  );
}

/**
 * Remaining assignable amount for a request (requested − already assigned capacity).
 */
export function computeRemainingAssignable(
  request: OperationRequest | null | undefined,
  batches: Map<string, InventoryBatch> | InventoryBatch[],
): number {
  const requested = Math.max(0, Number(request?.amount) || 0);
  return Math.max(0, requested - sumAssignedCapacity(request, batches));
}

export function getReadyBatches(
  batches: InventoryBatch[] | null | undefined,
): InventoryBatch[] {
  return (batches || []).filter((b) => b?.status === "ready");
}

/**
 * Validate that selected batch ids are ready and exist.
 */
export function validateBatchAssignment(
  batchIds: string[] | null | undefined,
  availableBatches: InventoryBatch[],
): BatchAssignmentValidation {
  const ids = (Array.isArray(batchIds) ? batchIds : []).map(String);
  if (ids.length === 0) {
    return { ok: false, reason: "Select at least one ready batch." };
  }
  const byId = indexBatchesById(availableBatches);
  for (const id of ids) {
    const batch = byId.get(id);
    if (!batch) return { ok: false, reason: `Unknown batch: ${id}` };
    if (batch.status !== "ready") {
      return { ok: false, reason: `Batch ${id} is not ready for assignment.` };
    }
  }
  return { ok: true };
}
