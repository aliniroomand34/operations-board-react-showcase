/**
 * Mock API boundary for Extension Acquisition Simulator.
 */
import {
  createAcquisitionJob,
  getAcquisitionJob,
  listAcquisitionJobs,
  resetDemoStore,
  saveAcquisitionJob,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
  updatePipelineBatchColumn,
} from "@/mocks/demoStore";
import {
  advanceAcquisitionJob,
  pauseAcquisitionJob,
  resumeAcquisitionJob,
  retryFailedAcquireItem,
  setForceErrorOnJob,
  startAcquisitionJob,
} from "./extensionAcquisitionSim.helpers";
import type { AcquisitionJob } from "@/mocks/demoStore.types";

export {
  createAcquisitionJob,
  listAcquisitionJobs,
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
};

export async function loadAcquisitionJob(jobId: string): Promise<AcquisitionJob> {
  return getAcquisitionJob(jobId);
}

export async function persistJob(job: AcquisitionJob): Promise<AcquisitionJob> {
  return saveAcquisitionJob(job);
}

async function persistAdvance(job: AcquisitionJob): Promise<AcquisitionJob> {
  const result = advanceAcquisitionJob(job);
  const saved = await saveAcquisitionJob(result.job);
  if (result.batchColumn) {
    await updatePipelineBatchColumn(saved.batchId, result.batchColumn);
  }
  return saved;
}

export async function startJob(jobId: string): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  const started = startAcquisitionJob(current);
  return saveAcquisitionJob(started);
}

export async function pauseJob(jobId: string): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  const paused = pauseAcquisitionJob(current);
  return saveAcquisitionJob(paused);
}

export async function resumeJob(jobId: string): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  const resumed = resumeAcquisitionJob(current);
  return saveAcquisitionJob(resumed);
}

export async function tickJob(jobId: string): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  if (current.status !== "running") return current;
  return persistAdvance(current);
}

export async function forceErrorOnJob(jobId: string): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  const updated = setForceErrorOnJob(current);
  return saveAcquisitionJob(updated);
}

export async function retryFailedItem(
  jobId: string,
  skuId?: string,
): Promise<AcquisitionJob> {
  const current = await getAcquisitionJob(jobId);
  const updated = retryFailedAcquireItem(current, skuId);
  return saveAcquisitionJob(updated);
}
