/**
 * Pure helpers for Extension Acquisition Simulator step progression.
 */
import type {
  AcquisitionItemProgress,
  AcquisitionJob,
  AcquisitionJobStatus,
  AcquisitionStep,
  AcquisitionStepId,
  BatchRequestPayload,
  PipelineColumn,
  StepStatus,
} from "@/mocks/demoStore.types";

const STEP_ORDER: AcquisitionStepId[] = [
  "connect-session",
  "sync-capacity",
  "acquire-items",
  "queue-packaging",
  "complete",
];

const STEP_LABELS: Record<AcquisitionStepId, string> = {
  "connect-session": "Connect session",
  "sync-capacity": "Sync capacity / balance",
  "acquire-items": "Acquire catalog items",
  "queue-packaging": "Queue packaging / publish window",
  complete: "Complete acquisition",
};

export const SIM_STEP_DELAY_MS = 700;

let simStepDelayMs = SIM_STEP_DELAY_MS;

/** Tests may set `0` to advance ticks without waiting on real timers. */
export function setSimStepDelayForTests(ms: number): void {
  simStepDelayMs = Number.isFinite(ms) ? Math.max(0, Number(ms)) : SIM_STEP_DELAY_MS;
}

export function getSimStepDelayMs(): number {
  return simStepDelayMs;
}

export function buildInitialSteps(): AcquisitionStep[] {
  return STEP_ORDER.map((id) => ({
    id,
    label: STEP_LABELS[id],
    status: "pending" as StepStatus,
  }));
}

export function buildItemProgressFromPayload(
  payload: BatchRequestPayload,
): AcquisitionItemProgress[] {
  return payload.lineItems.map((line) => ({
    skuId: line.skuId,
    skuLabel: line.skuLabel,
    quantity: line.quantity,
    acquired: 0,
    status: "pending",
  }));
}

export function computeBatchCapacity(payload: BatchRequestPayload): number {
  return payload.lineItems.reduce((sum, line) => sum + line.quantity, 0);
}

interface BuildJobInput {
  id: string;
  batchId: string;
  payload: BatchRequestPayload;
  createdAt: string;
}

export function buildInitialAcquisitionJob(input: BuildJobInput): AcquisitionJob {
  return {
    id: input.id,
    batchId: input.batchId,
    status: "pending",
    payload: structuredClone(input.payload),
    steps: buildInitialSteps(),
    itemProgress: buildItemProgressFromPayload(input.payload),
    createdAt: input.createdAt,
    forceErrorNext: false,
  };
}

function cloneJob(job: AcquisitionJob): AcquisitionJob {
  return structuredClone(job);
}

function findActiveStepIndex(steps: AcquisitionStep[]): number {
  const runningIndex = steps.findIndex((step) => step.status === "running");
  if (runningIndex !== -1) return runningIndex;
  return steps.findIndex((step) => step.status === "pending");
}

function markStep(
  steps: AcquisitionStep[],
  stepId: AcquisitionStepId,
  status: StepStatus,
  detail?: string,
): AcquisitionStep[] {
  return steps.map((step) =>
    step.id === stepId ? { ...step, status, detail } : step,
  );
}

function allItemsAcquired(items: AcquisitionItemProgress[]): boolean {
  return items.every(
    (item) => item.status === "success" && item.acquired >= item.quantity,
  );
}

function nextPendingItem(items: AcquisitionItemProgress[]): AcquisitionItemProgress | null {
  return (
    items.find(
      (item) =>
        item.status === "pending" ||
        item.status === "running" ||
        (item.status === "failed" && item.acquired < item.quantity),
    ) ?? null
  );
}

function pipelineColumnForStep(stepId: AcquisitionStepId): PipelineColumn | null {
  if (stepId === "queue-packaging") return "packaging";
  if (stepId === "complete") return "ready";
  return null;
}

export function pipelineColumnOnFailure(): PipelineColumn {
  return "problem";
}

export interface AdvanceJobResult {
  job: AcquisitionJob;
  batchColumn: PipelineColumn | null;
  finished: boolean;
}

/**
 * Advance the simulator by one tick while the job is running.
 */
export function advanceAcquisitionJob(job: AcquisitionJob): AdvanceJobResult {
  const next = cloneJob(job);
  if (next.status !== "running") {
    return { job: next, batchColumn: null, finished: false };
  }

  const activeIndex = findActiveStepIndex(next.steps);
  if (activeIndex === -1) {
    next.status = "completed";
    return {
      job: next,
      batchColumn: "ready",
      finished: true,
    };
  }

  const activeStep = next.steps[activeIndex];
  if (activeStep.status === "pending") {
    next.steps = markStep(next.steps, activeStep.id, "running");
    return { job: next, batchColumn: null, finished: false };
  }

  if (activeStep.id === "acquire-items") {
    const item = nextPendingItem(next.itemProgress);
    if (!item) {
      next.steps = markStep(
        next.steps,
        activeStep.id,
        "success",
        "All catalog items acquired",
      );
      return { job: next, batchColumn: null, finished: false };
    }

    if (next.forceErrorNext) {
      next.forceErrorNext = false;
      next.itemProgress = next.itemProgress.map((entry) =>
        entry.skuId === item.skuId
          ? { ...entry, status: "failed" }
          : entry,
      );
      next.steps = markStep(
        next.steps,
        activeStep.id,
        "failed",
        `Failed to acquire ${item.skuLabel}`,
      );
      next.status = "failed";
      return {
        job: next,
        batchColumn: pipelineColumnOnFailure(),
        finished: true,
      };
    }

    const nextAcquired = item.acquired + 1;
    const itemComplete = nextAcquired >= item.quantity;
    next.itemProgress = next.itemProgress.map((entry) =>
      entry.skuId === item.skuId
        ? {
            ...entry,
            acquired: nextAcquired,
            status: itemComplete ? "success" : "running",
          }
        : entry,
    );

    if (allItemsAcquired(next.itemProgress)) {
      next.steps = markStep(
        next.steps,
        activeStep.id,
        "success",
        "All catalog items acquired",
      );
    }

    return { job: next, batchColumn: null, finished: false };
  }

  next.steps = markStep(
    next.steps,
    activeStep.id,
    "success",
    stepSuccessDetail(activeStep.id, next),
  );

  const nextIndex = activeIndex + 1;
  if (nextIndex >= next.steps.length) {
    next.status = "completed";
    return {
      job: next,
      batchColumn: "ready",
      finished: true,
    };
  }

  const batchColumn = pipelineColumnForStep(activeStep.id);

  return {
    job: next,
    batchColumn,
    finished: false,
  };
}

function stepSuccessDetail(
  stepId: AcquisitionStepId,
  job: AcquisitionJob,
): string {
  switch (stepId) {
    case "connect-session":
      return `Linked accounts online: ${job.payload.linkedAccountIds.join(", ")}`;
    case "sync-capacity":
      return `Mode ${job.payload.mode} · target ${job.payload.targetPrice}`;
    case "queue-packaging":
      return `Publish window ${job.payload.publishWindowHours}h queued`;
    case "complete":
      return "Acquisition complete — batch ready for pipeline";
    default:
      return "Step complete";
  }
}

export function startAcquisitionJob(job: AcquisitionJob): AcquisitionJob {
  const next = cloneJob(job);
  next.status = "running";
  next.steps = next.steps.map((step, index) =>
    index === 0 ? { ...step, status: "running" } : step,
  );
  return next;
}

export function pauseAcquisitionJob(job: AcquisitionJob): AcquisitionJob {
  const next = cloneJob(job);
  next.status = "paused";
  next.steps = next.steps.map((step) =>
    step.status === "running" ? { ...step, status: "paused" } : step,
  );
  next.itemProgress = next.itemProgress.map((item) =>
    item.status === "running" ? { ...item, status: "pending" } : item,
  );
  return next;
}

export function resumeAcquisitionJob(job: AcquisitionJob): AcquisitionJob {
  const next = cloneJob(job);
  next.status = "running";
  next.steps = next.steps.map((step) =>
    step.status === "paused" ? { ...step, status: "running" } : step,
  );
  return next;
}

export function setForceErrorOnJob(job: AcquisitionJob): AcquisitionJob {
  const next = cloneJob(job);
  next.forceErrorNext = true;
  return next;
}

export function retryFailedAcquireItem(
  job: AcquisitionJob,
  skuId?: string,
): AcquisitionJob {
  const next = cloneJob(job);
  const targetSku =
    skuId ??
    next.itemProgress.find((item) => item.status === "failed")?.skuId;

  if (!targetSku) return next;

  next.status = "running";
  next.steps = markStep(next.steps, "acquire-items", "running");
  next.itemProgress = next.itemProgress.map((item) =>
    item.skuId === targetSku
      ? {
          ...item,
          status: "pending",
          acquired: Math.max(0, item.acquired - 1),
        }
      : item,
  );
  return next;
}

export function isJobTerminal(status: AcquisitionJobStatus): boolean {
  return status === "completed" || status === "failed";
}
