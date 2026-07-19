/**
 * In-memory mock API runtime — shared delay, failure flag, and board state.
 * Encapsulates mutable demo state; mutation modules call through these helpers.
 */
import {
  EMPTY_OPERATIONS_BOARD,
  INITIAL_OPERATIONS_BOARD,
  cloneOperationsBoard,
} from "@/mocks/operationsBoard.data";
import { createMockApiError } from "./operationsBoard.errors";
import type {
  OperationsBoardMockPreset,
  OperationsBoardSnapshot,
} from "./operationsBoard.types";

/** Default artificial latency (ms) so loading UI is visible in the demo. */
export const MOCK_API_DELAY_MS = 450;

let boardState: OperationsBoardSnapshot = cloneOperationsBoard(
  INITIAL_OPERATIONS_BOARD,
);

/** When true, the next read/write rejects (demo + tests). */
let forceFailure = false;

/** Mutable delay so Vitest can set `0` without fake timers. */
let delayMs = MOCK_API_DELAY_MS;

function delay(ms: number = delayMs): Promise<void> {
  if (ms <= 0) return Promise.resolve();
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

/**
 * Enable/disable simulated network failure for demo or tests.
 */
export function setOperationsBoardMockFailure(shouldFail: boolean): void {
  forceFailure = Boolean(shouldFail);
}

/**
 * Override artificial latency (tests typically use `0`).
 */
export function setOperationsBoardMockDelay(ms: number): void {
  delayMs = Number.isFinite(ms) ? Math.max(0, Number(ms)) : MOCK_API_DELAY_MS;
}

/**
 * Reset in-memory board to a known preset.
 * Does not change delay — call `setOperationsBoardMockDelay` separately in tests.
 */
export function resetOperationsBoardMock(
  preset: OperationsBoardMockPreset = "default",
): void {
  boardState = cloneOperationsBoard(
    preset === "empty" ? EMPTY_OPERATIONS_BOARD : INITIAL_OPERATIONS_BOARD,
  );
  forceFailure = false;
}

/** Await artificial latency then throw if the demo failure flag is set. */
export async function beginMockApiCall(): Promise<void> {
  await delay();
  if (forceFailure) {
    throw createMockApiError(
      "Mock API failure (demo). Retry or reset the failure flag.",
      "MOCK_API_FAILURE",
    );
  }
}

/** Live mutable board (mutations only). Callers must not leak this reference. */
export function getMutableBoardState(): OperationsBoardSnapshot {
  return boardState;
}

/** Deep-cloned snapshot safe for UI / API return values. */
export function cloneCurrentBoard(): OperationsBoardSnapshot {
  return cloneOperationsBoard(boardState);
}

export { createMockApiError };
