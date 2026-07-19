import { useCallback, useEffect, useMemo, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  assignBatchesToInProgressRequest,
  assignBatchesToRequest,
  cancelQueuedRequest,
  completeOperationRequest,
  getOperationsBoard,
  resetOperationsBoardMock,
  setOperationsBoardMockFailure,
} from "./operationsBoard.api";
import {
  getReadyBatches,
  indexBatchesById,
  parseQueueClientDropId,
  resolveBatchesForRequest,
  validateBatchAssignment,
} from "./operationsBoard.helpers";
import type {
  InventoryBatch,
  OperationRequest,
  OperationsBoardSnapshot,
  PendingDragAssign,
} from "./operationsBoard.types";
import { getErrorMessage } from "./operationsBoard.types";

export interface UseOperationsBoardLogicResult {
  board: OperationsBoardSnapshot | null;
  loading: boolean;
  error: string;
  isSubmitting: boolean;
  assigningToRequestId: string | null;
  pendingDragAssign: PendingDragAssign | null;
  detailRequest: OperationRequest | null;
  assignMoreRequest: OperationRequest | null;
  readyBatches: InventoryBatch[];
  isBoardEmpty: boolean;
  setDetailRequest: (request: OperationRequest | null) => void;
  setAssignMoreRequest: (request: OperationRequest | null) => void;
  loadBoard: () => Promise<void>;
  handleRetry: () => void;
  handleShowEmpty: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
  onDragEnd: (event: DragEndEvent) => void;
  confirmPendingDragAssign: () => Promise<boolean>;
  cancelPendingDragAssign: () => void;
  assignSelectedBatches: (
    request: OperationRequest,
    batchIds: string[],
  ) => Promise<boolean>;
  completeRequest: (requestId: string) => Promise<boolean>;
  cancelQueued: (requestId: string) => Promise<boolean>;
  batchesForRequest: (request: OperationRequest | null | undefined) => InventoryBatch[];
}

/**
 * Board orchestration hook — owns loading/error/board state and mutation actions.
 * UI components stay presentational; domain rules stay in helpers + this hook.
 */
export function useOperationsBoardLogic(): UseOperationsBoardLogicResult {
  const [board, setBoard] = useState<OperationsBoardSnapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigningToRequestId, setAssigningToRequestId] = useState<string | null>(
    null,
  );
  const [pendingDragAssign, setPendingDragAssign] =
    useState<PendingDragAssign | null>(null);
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

  const runMutation = useCallback(
    async (
      requestId: string | null | undefined,
      fn: () => Promise<OperationsBoardSnapshot>,
    ): Promise<boolean> => {
      setIsSubmitting(true);
      if (requestId) setAssigningToRequestId(String(requestId));
      try {
        const next = await fn();
        applyBoard(next);
        setError("");
        return true;
      } catch (e: unknown) {
        setError(getErrorMessage(e, "Operation failed."));
        return false;
      } finally {
        setIsSubmitting(false);
        setAssigningToRequestId(null);
      }
    },
    [applyBoard],
  );

  const confirmPendingDragAssign = useCallback(async () => {
    if (!pendingDragAssign) return false;
    const { batch, request } = pendingDragAssign;
    const ok = await runMutation(request.id, () =>
      assignBatchesToRequest(request.id, [batch.id]),
    );
    if (ok) setPendingDragAssign(null);
    return ok;
  }, [pendingDragAssign, runMutation]);

  const cancelPendingDragAssign = useCallback(() => {
    setPendingDragAssign(null);
  }, []);

  const assignSelectedBatches = useCallback(
    async (request: OperationRequest, batchIds: string[]) => {
      const validation = validateBatchAssignment(
        batchIds,
        board?.availableBatches || [],
      );
      if (!validation.ok) {
        setError(validation.reason);
        return false;
      }

      const isQueued = (board?.queued || []).some((r) => r.id === request.id);
      const ok = await runMutation(request.id, () =>
        isQueued
          ? assignBatchesToRequest(request.id, batchIds)
          : assignBatchesToInProgressRequest(request.id, batchIds),
      );
      if (ok) setAssignMoreRequest(null);
      return ok;
    },
    [board?.availableBatches, board?.queued, runMutation],
  );

  const completeRequest = useCallback(
    async (requestId: string) => {
      const ok = await runMutation(requestId, () =>
        completeOperationRequest(requestId),
      );
      if (ok) setDetailRequest(null);
      return ok;
    },
    [runMutation],
  );

  const cancelQueued = useCallback(
    async (requestId: string) => {
      const ok = await runMutation(requestId, () => cancelQueuedRequest(requestId));
      if (ok) setDetailRequest(null);
      return ok;
    },
    [runMutation],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const dragType = event.active?.data?.current?.dragType;
      const overId = event.over?.id != null ? String(event.over.id) : "";
      if (dragType !== "batch" || !overId) return;

      const requestId = parseQueueClientDropId(overId);
      if (!requestId) return;

      const batchId = String(event.active.id);
      const batch = (board?.availableBatches || []).find((b) => b.id === batchId);
      const request = (board?.queued || []).find((r) => r.id === requestId);
      if (!batch || batch.status !== "ready" || !request) return;

      setPendingDragAssign({ batch, request });
    },
    [board?.availableBatches, board?.queued],
  );

  const batchesForRequest = useCallback(
    (request: OperationRequest | null | undefined) =>
      resolveBatchesForRequest(request, batchesById),
    [batchesById],
  );

  const handleRetry = useCallback(() => {
    setOperationsBoardMockFailure(false);
    void loadBoard();
  }, [loadBoard]);

  const handleShowEmpty = useCallback(async () => {
    resetOperationsBoardMock("empty");
    await loadBoard();
  }, [loadBoard]);

  const handleResetDemo = useCallback(async () => {
    resetOperationsBoardMock("default");
    await loadBoard();
  }, [loadBoard]);

  const handleSimulateError = useCallback(async () => {
    setOperationsBoardMockFailure(true);
    await loadBoard();
  }, [loadBoard]);

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
    isSubmitting,
    assigningToRequestId,
    pendingDragAssign,
    detailRequest,
    assignMoreRequest,
    readyBatches,
    isBoardEmpty,
    setDetailRequest,
    setAssignMoreRequest,
    loadBoard,
    handleRetry,
    handleShowEmpty,
    handleResetDemo,
    handleSimulateError,
    onDragEnd,
    confirmPendingDragAssign,
    cancelPendingDragAssign,
    assignSelectedBatches,
    completeRequest,
    cancelQueued,
    batchesForRequest,
  };
}
