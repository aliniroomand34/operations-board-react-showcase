/**
 * Error utilities for the Operations Board mock API / hook boundary.
 */
import type { MockApiFailure } from "./operationsBoard.types";

export function isMockApiFailure(error: unknown): error is MockApiFailure {
  return (
    error instanceof Error &&
    typeof (error as MockApiFailure).code === "string"
  );
}

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}

export function createMockApiError(message: string, code: string): MockApiFailure {
  const error = new Error(message) as MockApiFailure;
  error.code = code;
  return error;
}
