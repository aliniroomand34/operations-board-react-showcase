/**
 * Error utilities for the Inventory Pipeline mock API / hook boundary.
 */
import {
  createDemoStoreError,
  isDemoStoreFailure,
} from "@/mocks/demoStore.errors";

export { createDemoStoreError, isDemoStoreFailure };

export function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message;
  return fallback;
}
