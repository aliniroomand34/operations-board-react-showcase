/**
 * Pure presentation helpers for board columns, progress ring, and detail tiles.
 * Framework-independent — safe to unit-test without React.
 */
import {
  computeRemainingAssignable,
  sumAssignedCapacity,
} from "./operationsBoard.capacity";
import { formatAmount, formatRequestedAt } from "./operationsBoard.format";
import type {
  BoardColumn,
  BoardColumnMeta,
  InventoryBatch,
  OperationRequest,
  RequestDetailTile,
} from "./operationsBoard.types";

/**
 * Stable column copy for the request lifecycle columns.
 * Ready-batches is inventory UI, not a `BoardColumn`, so it stays local to that component.
 */
export const BOARD_COLUMN_META: Record<BoardColumn, BoardColumnMeta> = {
  queued: {
    key: "queued",
    title: "Queued",
    emptyHint: "No queued operation requests.",
  },
  inProgress: {
    key: "inProgress",
    title: "In progress",
    emptyHint: "No in-progress operations.",
  },
  completed: {
    key: "completed",
    title: "Completed",
    emptyHint: "No completed operations yet.",
  },
};

/**
 * Progress ring: full circle = requested amount; arcs = assigned batch capacities.
 */
export function buildProgressRingBackground(
  requestedAmount: number,
  assignedBatches: InventoryBatch[] | null | undefined,
): string {
  const req = Math.max(0, Number(requestedAmount) || 0);
  const list = Array.isArray(assignedBatches) ? assignedBatches : [];
  const neutral = "rgb(68 68 68 / 0.75)";
  const assignedTone = "rgb(255 215 0 / 0.92)";

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
