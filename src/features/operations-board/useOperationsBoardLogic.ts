/**
 * Board orchestration hook — owns loading/error/board state and composes
 * mutation + demo-control hooks. UI stays presentational; domain rules stay in helpers.
 */
import { useCallback, useEffect, useMemo, useState } from "react";
import { getOperationsBoard } from "./operationsBoard.api";
import { getErrorMessage } from "./operationsBoard.errors";
import {
  getReadyBatches,
  indexBatchesById,
  resolveBatchesForRequest,
} from "./operationsBoard.helpers";
import type {
  InventoryBatch,
  OperationRequest,
  OperationsBoardSnapshot,
} from "./operationsBoard.types";
import { useOperationsBoardDemoControls } from "./useOperationsBoardDemoControls";
import {
  useOperationsBoardMutations,
  type UseOperationsBoardMutationsResult,
} from "./useOperationsBoardMutations";

export interface UseOperationsBoardLogicResult
  extends UseOperationsBoardMutationsResult {
  board: OperationsBoardSnapshot | null;
  loading: boolean;
  error: string;
  detailRequest: OperationRequest | null;
  assignMoreRequest: OperationRequest | null;
  readyBatches: InventoryBatch[];
  isBoardEmpty: boolean;
  setDetailRequest: (request: OperationRequest | null) => void;
  setAssignMoreRequest: (request: OperationRequest | null) => void;
  loadBoard: () => Promise<void>;
  handleRetry: () => void;
  handleShowEmpty: () => Promise<void>;
  handleShowErrorPreset: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
  batchesForRequest: (request: OperationRequest | null | undefined) => InventoryBatch[];
}

export function useOperationsBoardLogic(): UseOperationsBoardLogicResult {
  const [board, setBoard] = useState<OperationsBoardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [detailRequest, setDetailRequest] = useState<OperationRequest | null>(
    null,
  );
  const [assignMoreRequest, setAssignMoreRequest] =
    useState<OperationRequest | null>(null);

  const applyBoard = useCallback((next: OperationsBoardSnapshot) => {
    setBoard(next);
    setDetailRequest((prev) => {
      if (!prev) return prev;
      const live =
        next.queued.find((r) => r.id === prev.id) ||
        next.inProgress.find((r) => r.id === prev.id) ||
        next.completed.find((r) => r.id === prev.id);
      return live || null;
    });
  }, []);

  const loadBoard = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const next = await getOperationsBoard();
      applyBoard(next);
    } catch (e: unknown) {
      setBoard(null);
      setError(getErrorMessage(e, "Failed to load operations board."));
    } finally {
      setLoading(false);
    }
  }, [applyBoard]);

  useEffect(() => {
    void loadBoard();
  }, [loadBoard]);

  const batchesById = useMemo(
    () => indexBatchesById(board?.availableBatches || []),
    [board?.availableBatches],
  );

  const readyBatches = useMemo(
    () => getReadyBatches(board?.availableBatches || []),
    [board?.availableBatches],
  );

  const batchesForRequest = useCallback(
    (request: OperationRequest | null | undefined) =>
      resolveBatchesForRequest(request, batchesById),
    [batchesById],
  );

  const mutations = useOperationsBoardMutations({
    board,
    applyBoard,
    setError,
    setDetailRequest,
    setAssignMoreRequest,
  });

  const demo = useOperationsBoardDemoControls({ loadBoard });

  const isBoardEmpty =
    board != null &&
    board.queued.length === 0 &&
    board.inProgress.length === 0 &&
    board.completed.length === 0 &&
    board.availableBatches.length === 0;

  return {
    board,
    loading,
    error,
    detailRequest,
    assignMoreRequest,
    readyBatches,
    isBoardEmpty,
    setDetailRequest,
    setAssignMoreRequest,
    loadBoard,
    batchesForRequest,
    ...mutations,
    ...demo,
  };
}
