/**
 * Shared demo store types — pipeline batches, acquisition jobs, catalog, accounts, board.
 * Single in-memory source for Overview, Pipeline, Extension Sim, and Operations Board.
 */
import type { OperationsBoardSnapshot } from "@/features/operations-board/operationsBoard.types";

export type MockApiFailure = Error & { code: string };

export type DemoStorePreset = "default" | "empty" | "error";

export type CatalogItemStatus = "enabled" | "disabled";

export interface CatalogItem {
  id: string;
  label: string;
  status: CatalogItemStatus;
}

export interface LinkedAccount {
  id: string;
  label: string;
  online: boolean;
  /** Synthetic session capacity for Overview charts (mock only). */
  capacity: number;
}

export type BatchRequestMode = "unit" | "bulk";

export interface BatchRequestLineItem {
  skuId: string;
  skuLabel: string;
  quantity: number;
}

/** Payload collected by the Inventory Pipeline batch request form. */
export interface BatchRequestPayload {
  linkedAccountIds: string[];
  mode: BatchRequestMode;
  targetPrice: number;
  publishWindowHours: number;
  lineItems: BatchRequestLineItem[];
}

export type PipelineColumn =
  | "acquiring"
  | "packaging"
  | "ready"
  | "assigned"
  | "hold"
  | "problem"
  | "review";

export interface PipelineBatch {
  id: string;
  label: string;
  column: PipelineColumn;
  requestPayload: BatchRequestPayload;
  acquisitionJobId: string;
  capacity: number;
  createdAt: string;
}

export type AcquisitionStepId =
  | "connect-session"
  | "sync-capacity"
  | "acquire-items"
  | "queue-packaging"
  | "complete";

export type StepStatus = "pending" | "running" | "success" | "failed" | "paused";

export interface AcquisitionStep {
  id: AcquisitionStepId;
  label: string;
  status: StepStatus;
  detail?: string;
}

export type AcquisitionItemStatus = "pending" | "running" | "success" | "failed";

export interface AcquisitionItemProgress {
  skuId: string;
  skuLabel: string;
  quantity: number;
  acquired: number;
  status: AcquisitionItemStatus;
}

export type AcquisitionJobStatus =
  | "pending"
  | "running"
  | "paused"
  | "completed"
  | "failed";

export interface AcquisitionJob {
  id: string;
  batchId: string;
  status: AcquisitionJobStatus;
  payload: BatchRequestPayload;
  steps: AcquisitionStep[];
  itemProgress: AcquisitionItemProgress[];
  createdAt: string;
  /** When true, the next acquire tick fails (demo control). */
  forceErrorNext: boolean;
}

/** Org-tree role for the Team Activity mock graph. */
export type TeamMemberRole = "owner" | "operator";

export interface TeamMember {
  id: string;
  label: string;
  role: TeamMemberRole;
  active: boolean;
}

export interface TeamActivityEvent {
  id: string;
  actorId: string;
  actorLabel: string;
  action: string;
  detail: string;
  at: string;
}

export interface FinanceVolumePoint {
  label: string;
  amount: number;
  count: number;
}

export interface FinanceAccountVolume {
  accountId: string;
  accountLabel: string;
  amount: number;
  count: number;
}

/** Synthetic finance series seeded in the demo store (safe amounts only). */
export interface FinanceSnapshot {
  volumeTrend: FinanceVolumePoint[];
  accountVolumes: FinanceAccountVolume[];
  settledCount: number;
  unsettledCount: number;
  successfulCount: number;
  failedCount: number;
  totalAmount: number;
}

export interface DemoStoreSnapshot {
  catalog: CatalogItem[];
  linkedAccounts: LinkedAccount[];
  pipelineBatches: PipelineBatch[];
  acquisitionJobs: AcquisitionJob[];
  board: OperationsBoardSnapshot;
  team: TeamMember[];
  teamActivity: TeamActivityEvent[];
  finance: FinanceSnapshot;
}
