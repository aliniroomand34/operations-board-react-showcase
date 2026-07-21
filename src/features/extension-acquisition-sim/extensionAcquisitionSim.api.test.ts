/**
 * Unit tests for Extension Acquisition Simulator mock API mutations.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { SAMPLE_BATCH_REQUEST } from "@/mocks/demoStore.data";
import { getDemoStoreSnapshot } from "@/mocks/demoStore";
import {
  createAcquisitionJob,
  forceErrorOnJob,
  loadAcquisitionJob,
  pauseJob,
  resetDemoStore,
  resumeJob,
  retryFailedItem,
  setDemoStoreMockDelay,
  startJob,
  tickJob,
} from "./extensionAcquisitionSim.api";

async function runJobToTerminal(jobId: string) {
  let current = await loadAcquisitionJob(jobId);
  let guard = 0;
  while (current.status === "running" && guard < 50) {
    current = await tickJob(jobId);
    guard += 1;
  }
  return current;
}

describe("extensionAcquisitionSim.api", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    resetDemoStore("default");
  });

  it("starts a pending job as running", async () => {
    const started = await startJob("job-001");
    expect(started.status).toBe("running");
    expect(started.steps[0]?.status).toBe("running");
  });

  it("pauses and resumes a running job", async () => {
    await startJob("job-001");

    const paused = await pauseJob("job-001");
    expect(paused.status).toBe("paused");

    const resumed = await resumeJob("job-001");
    expect(resumed.status).toBe("running");
  });

  it("ticks a running job to completion and moves the batch to ready", async () => {
    const job = await createAcquisitionJob({
      ...SAMPLE_BATCH_REQUEST,
      lineItems: [{ skuId: "sku-001", skuLabel: "Catalog Item A", quantity: 1 }],
    });

    await startJob(job.id);
    const finished = await runJobToTerminal(job.id);

    expect(finished.status).toBe("completed");
    const store = await getDemoStoreSnapshot();
    expect(
      store.pipelineBatches.find((entry) => entry.id === job.batchId)?.column,
    ).toBe("ready");
  });

  it("moves the batch to problem when force error is active", async () => {
    await forceErrorOnJob("job-001");
    await startJob("job-001");

    const finished = await runJobToTerminal("job-001");
    expect(finished.status).toBe("failed");

    const store = await getDemoStoreSnapshot();
    expect(
      store.pipelineBatches.find((entry) => entry.acquisitionJobId === "job-001")
        ?.column,
    ).toBe("problem");
  });

  it("retries a failed acquire item and resumes running", async () => {
    await forceErrorOnJob("job-001");
    await startJob("job-001");
    const failed = await runJobToTerminal("job-001");
    expect(failed.status).toBe("failed");

    const retried = await retryFailedItem("job-001", "sku-001");
    expect(retried.status).toBe("running");
    expect(
      retried.itemProgress.find((item) => item.skuId === "sku-001")?.status,
    ).toBe("pending");
  });
});
