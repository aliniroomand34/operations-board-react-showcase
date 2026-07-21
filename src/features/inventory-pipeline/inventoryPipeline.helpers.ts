/**
 * Pure helpers for the Inventory Pipeline — validation, column metadata, grouping.
 */
import type {
  AcquisitionJob,
  BatchRequestLineItem,
  BatchRequestPayload,
  CatalogItem,
  LinkedAccount,
  PipelineBatch,
  PipelineColumn,
} from "./inventoryPipeline.types";

export const PIPELINE_COLUMNS: PipelineColumn[] = [
  "acquiring",
  "packaging",
  "ready",
  "assigned",
  "hold",
  "problem",
  "review",
];

export interface PipelineColumnMeta {
  key: PipelineColumn;
  title: string;
  emptyHint: string;
}

export const PIPELINE_COLUMN_META: Record<PipelineColumn, PipelineColumnMeta> = {
  acquiring: {
    key: "acquiring",
    title: "Acquiring",
    emptyHint: "No batches awaiting acquisition.",
  },
  packaging: {
    key: "packaging",
    title: "Packaging",
    emptyHint: "Nothing in packaging.",
  },
  ready: {
    key: "ready",
    title: "Ready",
    emptyHint: "No batches ready for board handoff.",
  },
  assigned: {
    key: "assigned",
    title: "Assigned",
    emptyHint: "No batches handed off to the board yet.",
  },
  hold: {
    key: "hold",
    title: "Hold",
    emptyHint: "No batches on hold.",
  },
  problem: {
    key: "problem",
    title: "Problem",
    emptyHint: "No problem batches.",
  },
  review: {
    key: "review",
    title: "Review",
    emptyHint: "Nothing in review.",
  },
};

export type BatchRequestValidation =
  | { ok: true }
  | { ok: false; reason: string };

export function computeBatchCapacity(lineItems: BatchRequestLineItem[]): number {
  return lineItems.reduce((sum, item) => sum + item.quantity, 0);
}

export function getEnabledCatalogItems(catalog: CatalogItem[]): CatalogItem[] {
  return catalog.filter((item) => item.status === "enabled");
}

export function groupBatchesByColumn(
  batches: PipelineBatch[],
): Record<PipelineColumn, PipelineBatch[]> {
  const grouped = Object.fromEntries(
    PIPELINE_COLUMNS.map((col) => [col, [] as PipelineBatch[]]),
  ) as Record<PipelineColumn, PipelineBatch[]>;

  for (const batch of batches) {
    grouped[batch.column].push(batch);
  }

  return grouped;
}

export function validateBatchRequest(
  payload: BatchRequestPayload,
  catalog: CatalogItem[],
  linkedAccounts: LinkedAccount[],
): BatchRequestValidation {
  if (!payload.linkedAccountIds.length) {
    return { ok: false, reason: "Select at least one linked account." };
  }

  for (const accountId of payload.linkedAccountIds) {
    const account = linkedAccounts.find((a) => a.id === accountId);
    if (!account) {
      return { ok: false, reason: `Linked account not found: ${accountId}` };
    }
  }

  if (!payload.lineItems.length) {
    return { ok: false, reason: "Add at least one catalog SKU." };
  }

  for (const item of payload.lineItems) {
    const sku = catalog.find((c) => c.id === item.skuId);
    if (!sku || sku.status !== "enabled") {
      return {
        ok: false,
        reason: `Catalog item is not enabled: ${item.skuLabel}`,
      };
    }
    if (item.quantity < 1) {
      return { ok: false, reason: "Each SKU quantity must be at least 1." };
    }
  }

  if (!Number.isFinite(payload.targetPrice) || payload.targetPrice <= 0) {
    return { ok: false, reason: "Target price must be a positive number." };
  }

  if (
    !Number.isFinite(payload.publishWindowHours) ||
    payload.publishWindowHours <= 0
  ) {
    return { ok: false, reason: "Publish window must be a positive number." };
  }

  return { ok: true };
}

export function buildAcquisitionJob(
  jobId: string,
  batchId: string,
  payload: BatchRequestPayload,
): AcquisitionJob {
  return {
    id: jobId,
    batchId,
    status: "pending",
    payload,
    steps: [
      { id: "connect-session", label: "Connect session", status: "pending" },
      {
        id: "sync-capacity",
        label: "Sync capacity / balance",
        status: "pending",
      },
      {
        id: "acquire-items",
        label: "Acquire catalog items",
        status: "pending",
      },
      {
        id: "queue-packaging",
        label: "Queue packaging / publish window",
        status: "pending",
      },
      { id: "complete", label: "Complete acquisition", status: "pending" },
    ],
    itemProgress: payload.lineItems.map((item) => ({
      skuId: item.skuId,
      skuLabel: item.skuLabel,
      quantity: item.quantity,
      acquired: 0,
      status: "pending" as const,
    })),
    createdAt: new Date().toISOString(),
    forceErrorNext: false,
  };
}

export function formatPipelineBatchLabel(batchId: string): string {
  return `Batch ${batchId.replace(/^batch-pipe-/, "pipe-")}`;
}

export function nextHandoffBoardBatchId(existingIds: string[]): string {
  const nums = existingIds
    .map((id) => /^batch-(\d+)$/.exec(id)?.[1])
    .filter(Boolean)
    .map(Number);
  const next = nums.length ? Math.max(...nums) + 1 : 1;
  return `batch-${String(next).padStart(3, "0")}`;
}
