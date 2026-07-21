/**
 * Error utilities for the shared demo store mock API.
 */
import type { MockApiFailure } from "./demoStore.types";

export function createDemoStoreError(message: string, code: string): MockApiFailure {
  const error = new Error(message) as MockApiFailure;
  error.code = code;
  return error;
}

export function isDemoStoreFailure(error: unknown): error is MockApiFailure {
  return (
    error instanceof Error &&
    typeof (error as MockApiFailure).code === "string"
  );
}
