/**
 * Mutation actions for the Inventory Pipeline.
 */
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";
import {
  addCatalogItem,
  advancePipelineBatch,
  archivePipelineBatch,
  handoffBatchToBoard,
  markPipelineBatchProblem,
  retryPipelineBatch,
  setCatalogItemStatus,
  submitBatchRequest,
} from "./inventoryPipeline.api";
import { getErrorMessage } from "./inventoryPipeline.errors";
import type {
  BatchRequestPayload,
  InventoryPipelineSnapshot,
} from "./inventoryPipeline.types";

export interface UseInventoryPipelineMutationsArgs {
  applySnapshot: (next: InventoryPipelineSnapshot) => void;
  setError: (message: string) => void;
}

export interface UseInventoryPipelineMutationsResult {
  isSubmitting: boolean;
  activeBatchId: string | null;
  addCatalog: (label: string) => Promise<boolean>;
  toggleCatalog: (skuId: string, enabled: boolean) => Promise<boolean>;
  submitBatch: (payload: BatchRequestPayload) => Promise<boolean>;
  advanceBatch: (batchId: string) => Promise<boolean>;
  retryBatch: (batchId: string) => Promise<boolean>;
  archiveBatch: (batchId: string) => Promise<boolean>;
  markProblem: (batchId: string) => Promise<boolean>;
  handoffToBoard: (batchId: string) => Promise<boolean>;
}

export function useInventoryPipelineMutations({
  applySnapshot,
  setError,
}: UseInventoryPipelineMutationsArgs): UseInventoryPipelineMutationsResult {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeBatchId, setActiveBatchId] = useState<string | null>(null);

  const runMutation = useCallback(
    async (
      batchId: string | null,
      fn: () => Promise<InventoryPipelineSnapshot>,
    ): Promise<boolean> => {
      setIsSubmitting(true);
      if (batchId) setActiveBatchId(batchId);
      try {
        const next = await fn();
        applySnapshot(next);
        setError("");
        return true;
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Operation failed."));
        return false;
      } finally {
        setIsSubmitting(false);
        setActiveBatchId(null);
      }
    },
    [applySnapshot, setError],
  );

  const addCatalog = useCallback(
    async (label: string) =>
      runMutation(null, async () => addCatalogItem(label)),
    [runMutation],
  );

  const toggleCatalog = useCallback(
    async (skuId: string, enabled: boolean) =>
      runMutation(null, async () =>
        setCatalogItemStatus(skuId, enabled ? "enabled" : "disabled"),
      ),
    [runMutation],
  );

  const submitBatch = useCallback(
    async (payload: BatchRequestPayload) => {
      setIsSubmitting(true);
      try {
        const result = await submitBatchRequest(payload);
        applySnapshot(result.snapshot);
        setError("");
        navigate(`${ADMIN_DEMO_BASE}/extension-sim?job=${result.jobId}`);
        return true;
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Failed to submit batch request."));
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [applySnapshot, navigate, setError],
  );

  const advanceBatch = useCallback(
    async (batchId: string) =>
      runMutation(batchId, async () => advancePipelineBatch(batchId)),
    [runMutation],
  );

  const retryBatch = useCallback(
    async (batchId: string) =>
      runMutation(batchId, async () => retryPipelineBatch(batchId)),
    [runMutation],
  );

  const archiveBatch = useCallback(
    async (batchId: string) =>
      runMutation(batchId, async () => archivePipelineBatch(batchId)),
    [runMutation],
  );

  const markProblem = useCallback(
    async (batchId: string) =>
      runMutation(batchId, async () => markPipelineBatchProblem(batchId)),
    [runMutation],
  );

  const handoffToBoard = useCallback(
    async (batchId: string) => {
      setIsSubmitting(true);
      setActiveBatchId(batchId);
      try {
        const result = await handoffBatchToBoard(batchId);
        applySnapshot(result.snapshot);
        setError("");
        return true;
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Handoff to Operations Board failed."));
        return false;
      } finally {
        setIsSubmitting(false);
        setActiveBatchId(null);
      }
    },
    [applySnapshot, setError],
  );

  return {
    isSubmitting,
    activeBatchId,
    addCatalog,
    toggleCatalog,
    submitBatch,
    advanceBatch,
    retryBatch,
    archiveBatch,
    markProblem,
    handoffToBoard,
  };
}
