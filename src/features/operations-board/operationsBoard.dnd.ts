/**
 * Pure DnD id helpers for queued-client drop targets (@dnd-kit).
 */
import type {
  InventoryBatch,
  OperationRequest,
  PendingDragAssign,
} from "./operationsBoard.types";

/** Prefix for droppable ids on queued client cards. */
export const QUEUE_CLIENT_DROP_PREFIX = "queue-client-drop:";

export function queueClientDropId(clientOrRequestId: string): string {
  return `${QUEUE_CLIENT_DROP_PREFIX}${clientOrRequestId}`;
}

export function parseQueueClientDropId(
  droppableId: string | null | undefined,
): string | null {
  const id = String(droppableId || "");
  if (!id.startsWith(QUEUE_CLIENT_DROP_PREFIX)) return null;
  return id.slice(QUEUE_CLIENT_DROP_PREFIX.length) || null;
}

/**
 * Resolve a batch → queued-request drop into a pending assign payload.
 * Returns null when the drop is not a valid ready-batch → queued-client assign.
 */
export function resolvePendingDragAssign(input: {
  dragType: unknown;
  overId: string;
  batchId: string;
  availableBatches: InventoryBatch[];
  queued: OperationRequest[];
}): PendingDragAssign | null {
  const { dragType, overId, batchId, availableBatches, queued } = input;
  if (dragType !== "batch" || !overId) return null;

  const requestId = parseQueueClientDropId(overId);
  if (!requestId) return null;

  const batch = availableBatches.find((b) => b.id === batchId);
  const request = queued.find((r) => r.id === requestId);
  if (!batch || batch.status !== "ready" || !request) return null;

  return { batch, request };
}
