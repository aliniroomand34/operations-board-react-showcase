/**
 * Unit tests for Extension Acquisition Simulator pure helpers.
 */
import { describe, expect, it } from "vitest";
import { SAMPLE_BATCH_REQUEST } from "@/mocks/demoStore.data";
import {
  advanceAcquisitionJob,
  buildInitialAcquisitionJob,
  pipelineColumnOnFailure,
  retryFailedAcquireItem,
  setForceErrorOnJob,
  startAcquisitionJob,
} from "./extensionAcquisitionSim.helpers";

function createTestJob() {
  return buildInitialAcquisitionJob({
    id: "job-test",
    batchId: "batch-pipe-test",
    payload: SAMPLE_BATCH_REQUEST,
    createdAt: "2026-07-20T12:00:00.000Z",
  });
}

describe("extensionAcquisitionSim.helpers", () => {
  it("builds item progress from the submitted payload line items", () => {
    const job = createTestJob();
    expect(job.itemProgress).toHaveLength(2);
    expect(job.itemProgress[0]).toMatchObject({
      skuId: "sku-001",
      skuLabel: "Catalog Item A",
      quantity: 2,
      acquired: 0,
    });
  });

  it("advances connect then sync when running", () => {
    const started = startAcquisitionJob(createTestJob());

    const first = advanceAcquisitionJob(started);
    expect(first.job.steps[0].status).toBe("success");

    const second = advanceAcquisitionJob(first.job);
    expect(second.job.steps[1].status).toBe("running");
  });

  it("acquires catalog items one unit at a time", () => {
    const started = startAcquisitionJob(createTestJob());
    const job = {
      ...started,
      steps: started.steps.map((step, index) =>
        index <= 1 ? { ...step, status: "success" as const } : step,
      ),
    };
    job.steps[2] = { ...job.steps[2], status: "running" };

    const tick = advanceAcquisitionJob(job);
    expect(tick.job.itemProgress[0].acquired).toBe(1);
    expect(tick.job.itemProgress[0].status).toBe("running");
  });

  it("marks job failed and problem column when force error is set", () => {
    const started = setForceErrorOnJob(startAcquisitionJob(createTestJob()));
    const job = {
      ...started,
      steps: started.steps.map((step, index) =>
        index < 2
          ? { ...step, status: "success" as const }
          : index === 2
            ? { ...step, status: "running" as const }
            : step,
      ),
    };

    const failed = advanceAcquisitionJob(job);
    expect(failed.job.status).toBe("failed");
    expect(failed.batchColumn).toBe(pipelineColumnOnFailure());
    expect(failed.job.itemProgress.some((item) => item.status === "failed")).toBe(
      true,
    );
  });

  it("retries a failed acquire item", () => {
    const base = createTestJob();
    const job = {
      ...base,
      status: "failed" as const,
      itemProgress: base.itemProgress.map((item, index) =>
        index === 0 ? { ...item, status: "failed" as const, acquired: 1 } : item,
      ),
      steps: base.steps.map((step) =>
        step.id === "acquire-items"
          ? { ...step, status: "failed" as const }
          : step,
      ),
    };

    const retried = retryFailedAcquireItem(job, "sku-001");
    expect(retried.status).toBe("running");
    expect(retried.steps.find((s) => s.id === "acquire-items")?.status).toBe(
      "running",
    );
    expect(retried.itemProgress[0].status).toBe("pending");
  });
});
