/**
 * Shared in-memory demo store — public API for all interactive showcase features.
 * Operations Board, Overview, Inventory Pipeline, and Extension Sim read/write here.
 */
import {
  buildInitialAcquisitionJob,
  computeBatchCapacity,
} from "@/features/extension-acquisition-sim/extensionAcquisitionSim.helpers";
import { createMockApiError } from "@/features/operations-board/operationsBoard.errors";
import {
  beginDemoStoreCall,
  beginMockApiCall,
  cloneCurrentBoard,
  cloneCurrentDemoStore,
  commitDemoBoardMutation,
  DEMO_STORE_DELAY_MS,
  getMutableBoardState,
  getMutableDemoBoard,
  getMutableDemoStore,
  getDemoStoreRevision,
  MOCK_API_DELAY_MS,
  nextAcquisitionJobId,
  nextPipelineBatchId,
  resetDemoStore,
  resetOperationsBoardMock,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
  subscribeDemoStore,
} from "./demoStore.runtime";
import { createDemoStoreError } from "./demoStore.errors";
import {
  selectOverviewMetrics,
  selectOverviewSnapshot,
} from "@/features/overview/overview.selectors";
import { selectFinanceSummarySnapshot } from "@/features/finance-summary/finance.selectors";
import type { FinanceSummarySnapshot } from "@/features/finance-summary/finance.types";
import { selectTeamActivitySnapshot } from "@/features/team-activity/team.selectors";
import type { TeamActivitySnapshot } from "@/features/team-activity/team.types";
import type {
  DemoOverviewMetrics,
  DemoOverviewSnapshot,
} from "@/features/overview/overview.types";
import type {
  AcquisitionJob,
  BatchRequestPayload,
  DemoStoreSnapshot,
  PipelineBatch,
  PipelineColumn,
} from "./demoStore.types";

export type { DemoOverviewMetrics, DemoOverviewSnapshot };
export type { FinanceSummarySnapshot };
export type { TeamActivitySnapshot };

export type {
  AcquisitionJob,
  BatchRequestPayload,
  DemoStorePreset,
  DemoStoreSnapshot,
  PipelineBatch,
  PipelineColumn,
} from "./demoStore.types";

export {
  beginMockApiCall,
  cloneCurrentBoard,
  commitDemoBoardMutation,
  DEMO_STORE_DELAY_MS,
  getMutableBoardState,
  getMutableDemoBoard,
  getDemoStoreRevision,
  MOCK_API_DELAY_MS,
  resetDemoStore,
  resetOperationsBoardMock,
  setDemoStoreMockDelay,
  setDemoStoreMockDelay as setDemoStoreDelay,
  setDemoStoreMockFailure,
  setDemoStoreMockFailure as setDemoStoreFailure,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
  subscribeDemoStore,
};

export { createMockApiError, createDemoStoreError };

/** Derive Overview KPI cards from the current store snapshot. */
export function getDemoOverviewMetrics(): DemoOverviewMetrics {
  return selectOverviewMetrics(getMutableDemoStore());
}

/** KPI cards plus labeled chart segments for the Overview dashboard. */
export function getDemoOverviewSnapshot(): DemoOverviewSnapshot {
  return selectOverviewSnapshot(getMutableDemoStore());
}

/** Finance Summary KPIs and chart series (synthetic + live board blend). */
export function getDemoFinanceSnapshot(): FinanceSummarySnapshot {
  return selectFinanceSummarySnapshot(getMutableDemoStore());
}

/** Team Activity org graph and feed from the shared store. */
export function getDemoTeamSnapshot(): TeamActivitySnapshot {
  return selectTeamActivitySnapshot(getMutableDemoStore());
}

export async function getDemoStoreSnapshot(): Promise<DemoStoreSnapshot> {
  await beginDemoStoreCall();
  return cloneCurrentDemoStore();
}

export async function listAcquisitionJobs(): Promise<AcquisitionJob[]> {
  await beginDemoStoreCall();
  return structuredClone(getMutableDemoStore().acquisitionJobs);
}

export async function getAcquisitionJob(jobId: string): Promise<AcquisitionJob> {
  await beginDemoStoreCall();
  const job = getMutableDemoStore().acquisitionJobs.find(
    (entry) => entry.id === String(jobId),
  );
  if (!job) {
    throw createDemoStoreError(`Acquisition job not found: ${jobId}`, "JOB_NOT_FOUND");
  }
  return structuredClone(job);
}

export async function saveAcquisitionJob(job: AcquisitionJob): Promise<AcquisitionJob> {
  await beginDemoStoreCall();
  const store = getMutableDemoStore();
  const index = store.acquisitionJobs.findIndex((entry) => entry.id === job.id);
  if (index < 0) {
    throw createDemoStoreError(`Acquisition job not found: ${job.id}`, "JOB_NOT_FOUND");
  }
  store.acquisitionJobs[index] = structuredClone(job);
  notifyStoreChanged();
  return structuredClone(job);
}

export async function createAcquisitionJob(
  payload: BatchRequestPayload,
): Promise<AcquisitionJob> {
  await beginDemoStoreCall();

  const store = getMutableDemoStore();
  const jobId = nextAcquisitionJobId();
  const batchId = nextPipelineBatchId();
  const createdAt = new Date().toISOString();
  const job = buildInitialAcquisitionJob({
    id: jobId,
    batchId,
    payload,
    createdAt,
  });
  const batch: PipelineBatch = {
    id: batchId,
    label: `Batch ${batchId.replace("batch-pipe-", "pipe-")}`,
    column: "acquiring",
    requestPayload: structuredClone(payload),
    acquisitionJobId: jobId,
    capacity: computeBatchCapacity(payload),
    createdAt,
  };

  store.acquisitionJobs.push(job);
  store.pipelineBatches.unshift(batch);
  notifyStoreChanged();
  return structuredClone(job);
}

export async function updatePipelineBatchColumn(
  batchId: string,
  column: PipelineColumn,
): Promise<PipelineBatch> {
  await beginDemoStoreCall();
  const batch = getMutableDemoStore().pipelineBatches.find(
    (entry) => entry.id === String(batchId),
  );
  if (!batch) {
    throw createDemoStoreError(`Pipeline batch not found: ${batchId}`, "BATCH_NOT_FOUND");
  }
  batch.column = column;
  notifyStoreChanged();
  return structuredClone(batch);
}

function notifyStoreChanged(): void {
  commitDemoBoardMutation();
}
