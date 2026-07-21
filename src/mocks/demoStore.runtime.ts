/**
 * In-memory demo store runtime — mutable unified state, delay, and failure flag.
 */
import { createMockApiError } from "@/features/operations-board/operationsBoard.errors";
import type { OperationsBoardMockPreset } from "@/features/operations-board/operationsBoard.types";
import { cloneDemoStore, resolveDemoStoreByPreset } from "./demoStore.data";
import { createDemoStoreError } from "./demoStore.errors";
import {
  EMPTY_OPERATIONS_BOARD,
  INITIAL_OPERATIONS_BOARD,
  cloneOperationsBoard,
} from "./operationsBoard.data";
import type { DemoStorePreset, DemoStoreSnapshot } from "./demoStore.types";

/** Default artificial latency (ms) so loading UI is visible in the demo. */
export const MOCK_API_DELAY_MS = 450;

export const DEMO_STORE_DELAY_MS = MOCK_API_DELAY_MS;

let storeState: DemoStoreSnapshot = resolveDemoStoreByPreset("default");

/** When true, the next read/write rejects (demo + tests). */
let forceFailure = false;

/** Mutable delay so Vitest can set `0` without fake timers. */
let delayMs = MOCK_API_DELAY_MS;

let jobCounter = 2;
let batchCounter = 2;
let catalogCounter = 4;
let storeRevision = 0;

const listeners = new Set<() => void>();

function delay(ms: number = delayMs): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function notifyDemoStoreChanged(): void {
  storeRevision += 1;
  listeners.forEach((listener) => {
    listener();
  });
}

/** Monotonic revision for useSyncExternalStore selectors (stable getSnapshot). */
export function getDemoStoreRevision(): number {
  return storeRevision;
}

/**
 * Subscribe to store mutations (Overview KPIs, cross-surface UI).
 * Returns an unsubscribe function.
 */
export function subscribeDemoStore(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

/** Alias for pipeline-specific subscribers — same listener set. */
export function subscribeDemoStorePipeline(listener: () => void): () => void {
  return subscribeDemoStore(listener);
}

/** Live mutable board slice (mutations only). Callers must not leak this reference. */
export function getMutableDemoBoard(): DemoStoreSnapshot["board"] {
  return storeState.board;
}

/** Alias retained for the board API layer. */
export function getMutableBoardState(): DemoStoreSnapshot["board"] {
  return getMutableDemoBoard();
}

/** Deep-cloned board snapshot safe for UI / API return values. */
export function cloneDemoBoard(): DemoStoreSnapshot["board"] {
  return cloneOperationsBoard(storeState.board);
}

/** Alias retained for the board API layer. */
export function cloneCurrentBoard(): DemoStoreSnapshot["board"] {
  return cloneDemoBoard();
}

/** Live mutable full demo store (mutations only). */
export function getMutableDemoStore(): DemoStoreSnapshot {
  return storeState;
}

/** Deep-cloned full store snapshot. */
export function cloneCurrentDemoStore(): DemoStoreSnapshot {
  return cloneDemoStore(storeState);
}

export function nextAcquisitionJobId(): string {
  const id = `job-${String(jobCounter).padStart(3, "0")}`;
  jobCounter += 1;
  return id;
}

export function nextPipelineBatchId(): string {
  const id = `batch-pipe-${String(batchCounter).padStart(3, "0")}`;
  batchCounter += 1;
  return id;
}

export function nextCatalogSkuId(): string {
  const id = `sku-${String(catalogCounter).padStart(3, "0")}`;
  catalogCounter += 1;
  return id;
}

export function setDemoStoreMockFailure(shouldFail: boolean): void {
  forceFailure = Boolean(shouldFail);
}

/** Alias retained for the board API layer. */
export function setOperationsBoardMockFailure(shouldFail: boolean): void {
  setDemoStoreMockFailure(shouldFail);
}

export function setDemoStoreMockDelay(ms: number): void {
  delayMs = Number.isFinite(ms) ? Math.max(0, Number(ms)) : MOCK_API_DELAY_MS;
}

/** Alias retained for the board API layer. */
export function setOperationsBoardMockDelay(ms: number): void {
  setDemoStoreMockDelay(ms);
}

export function resetDemoStore(preset: DemoStorePreset = "default"): void {
  storeState = resolveDemoStoreByPreset(preset);
  forceFailure = false;
  jobCounter = preset === "error" ? 902 : 2;
  batchCounter = preset === "error" ? 902 : 2;
  catalogCounter = 4;
  notifyDemoStoreChanged();
}

/** Reset only the board slice — keeps pipeline/catalog intact for board-only tests. */
export function resetOperationsBoardMock(
  preset: OperationsBoardMockPreset = "default",
): void {
  storeState.board = cloneOperationsBoard(
    preset === "empty" ? EMPTY_OPERATIONS_BOARD : INITIAL_OPERATIONS_BOARD,
  );
  forceFailure = false;
  notifyDemoStoreChanged();
}

export function commitDemoBoardMutation(): void {
  notifyDemoStoreChanged();
}

export function commitDemoStoreMutation(): void {
  notifyDemoStoreChanged();
}

export async function beginDemoMockApiCall(): Promise<void> {
  await delay();
  if (forceFailure) {
    throw createMockApiError(
      "Mock API failure (demo). Retry or reset the failure flag.",
      "MOCK_API_FAILURE",
    );
  }
}

/** Alias retained for the board API layer. */
export async function beginMockApiCall(): Promise<void> {
  await beginDemoMockApiCall();
}

/** Pipeline / extension sim async boundary. */
export async function beginDemoStoreCall(): Promise<void> {
  await beginDemoMockApiCall();
}

export { createMockApiError, createDemoStoreError };
