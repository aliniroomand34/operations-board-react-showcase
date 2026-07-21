/**
 * Pipeline orchestration hook — loading, snapshot state, and composed mutations.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { getInventoryPipeline } from "./inventoryPipeline.api";
import { getErrorMessage } from "./inventoryPipeline.errors";
import { groupBatchesByColumn } from "./inventoryPipeline.helpers";
import type { InventoryPipelineSnapshot } from "./inventoryPipeline.types";
import { useInventoryPipelineDemoControls } from "./useInventoryPipelineDemoControls";
import {
  useInventoryPipelineMutations,
  type UseInventoryPipelineMutationsResult,
} from "./useInventoryPipelineMutations";

export interface UseInventoryPipelineLogicResult
  extends UseInventoryPipelineMutationsResult {
  snapshot: InventoryPipelineSnapshot | null;
  loading: boolean;
  error: string;
  batchesByColumn: ReturnType<typeof groupBatchesByColumn>;
  isPipelineEmpty: boolean;
  showBatchForm: boolean;
  setShowBatchForm: (open: boolean) => void;
  loadPipeline: () => Promise<void>;
  handleRetry: () => void;
  handleShowEmpty: () => Promise<void>;
  handleShowErrorPreset: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
}

export function useInventoryPipelineLogic(): UseInventoryPipelineLogicResult {
  const [snapshot, setSnapshot] = useState<InventoryPipelineSnapshot | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showBatchForm, setShowBatchForm] = useState(false);

  const applySnapshot = useCallback((next: InventoryPipelineSnapshot) => {
    setSnapshot(next);
  }, []);

  const loadPipeline = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await getInventoryPipeline();
      applySnapshot(next);
    } catch (e: unknown) {
      setSnapshot(null);
      setError(getErrorMessage(e, "Failed to load inventory pipeline."));
    } finally {
      setLoading(false);
    }
  }, [applySnapshot]);

  useEffect(() => {
    void loadPipeline();
  }, [loadPipeline]);

  const mutations = useInventoryPipelineMutations({
    applySnapshot,
    setError,
  });

  const demoControls = useInventoryPipelineDemoControls({
    reload: loadPipeline,
    setError,
  });

  const batchesByColumn = useMemo(
    () => groupBatchesByColumn(snapshot?.pipelineBatches ?? []),
    [snapshot?.pipelineBatches],
  );

  const isPipelineEmpty =
    !loading &&
    !error &&
    Boolean(snapshot) &&
    snapshot!.pipelineBatches.length === 0 &&
    snapshot!.catalog.length === 0;

  const handleRetry = useCallback(() => {
    void loadPipeline();
  }, [loadPipeline]);

  return {
    snapshot,
    loading,
    error,
    batchesByColumn,
    isPipelineEmpty,
    showBatchForm,
    setShowBatchForm,
    loadPipeline,
    handleRetry,
    ...mutations,
    ...demoControls,
  };
}
