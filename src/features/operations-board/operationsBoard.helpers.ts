/**
 * Domain helpers for the Operations Board showcase.
 * Pure functions — no React, no network. Safe to unit-test in isolation.
 */
import type {
  BatchAssignmentValidation,
  InventoryBatch,
  OperationRequest,
  RequestDetailTile,
} from "./operationsBoard.types";

/** Prefix for @dnd-kit droppable ids on queued client cards. */
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

export function formatAmount(
  value: number | string | null | undefined,
): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return Math.trunc(n).toLocaleString("en-US");
}

export function formatRequestedAt(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}

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

/**
 * Progress ring: full circle = requested amount; arcs = assigned batch capacities.
 */
export function buildProgressRingBackground(
  requestedAmount: number,
  assignedBatches: InventoryBatch[] | null | undefined,
): string {
  const req = Math.max(0, Number(requestedAmount) || 0);
  const list = Array.isArray(assignedBatches) ? assignedBatches : [];
  const neutral = "rgb(148 163 184 / 0.45)";
  const assignedTone = "rgb(234 179 8 / 0.85)";

  if (req <= 0 || list.length === 0) {
    return `conic-gradient(from -90deg, ${neutral} 0deg 360deg)`;
  }

  let totalCap = 0;
  for (const p of list) totalCap += Number(p.capacity) || 0;
  if (totalCap <= 0) {
    return `conic-gradient(from -90deg, ${neutral} 0deg 360deg)`;
  }

  let deg = 0;
  const stops: string[] = [];
  const denom = totalCap <= req ? req : totalCap;

  for (const batch of list) {
    const cap = Number(batch.capacity) || 0;
    const span = (cap / denom) * 360;
    const next = deg + span;
    stops.push(`${assignedTone} ${deg}deg ${next}deg`);
    deg = next;
  }
  if (totalCap <= req && deg < 359.95) {
    stops.push(`${neutral} ${deg}deg 360deg`);
  }

  return `conic-gradient(from -90deg, ${stops.join(", ")})`;
}

/**
 * Summary tiles for a queued / active operation request detail panel.
 */
export function buildRequestDetailTiles(
  request: OperationRequest,
  availableBatches: InventoryBatch[],
): RequestDetailTile[] {
  const assigned = sumAssignedCapacity(request, availableBatches);
  const remaining = computeRemainingAssignable(request, availableBatches);
  return [
    { label: "Request id", value: request?.id || "—" },
    { label: "Client", value: request?.clientLabel || request?.clientId || "—" },
    { label: "Amount", value: formatAmount(request?.amount) },
    { label: "Assigned capacity", value: formatAmount(assigned) },
    { label: "Remaining", value: formatAmount(remaining) },
    { label: "Batches", value: String(request?.batchIds?.length || 0) },
    { label: "Requested at", value: formatRequestedAt(request?.requestedAt) },
  ];
}
