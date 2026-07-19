/**
 * Mutation + drag-assign actions for the Operations Board.
 * Encapsulates submitting/assigning state and API mutation orchestration.
 */
import { useCallback, useState } from "react";
import type { DragEndEvent } from "@dnd-kit/core";
import {
  assignBatchesToInProgressRequest,
  assignBatchesToRequest,
  cancelQueuedRequest,
  completeOperationRequest,
} from "./operationsBoard.api";
import { getErrorMessage } from "./operationsBoard.errors";
import { resolvePendingDragAssign } from "./operationsBoard.dnd";
import { validateBatchAssignment } from "./operationsBoard.helpers";
import type {
  OperationRequest,
  OperationsBoardSnapshot,
  PendingDragAssign,
} from "./operationsBoard.types";

export interface UseOperationsBoardMutationsArgs {
  board: OperationsBoardSnapshot | null;
  applyBoard: (next: OperationsBoardSnapshot) => void;
  setError: (message: string) => void;
  setDetailRequest: (request: OperationRequest | null) => void;
  setAssignMoreRequest: (request: OperationRequest | null) => void;
}

export interface UseOperationsBoardMutationsResult {
  isSubmitting: boolean;
  assigningToRequestId: string | null;
  pendingDragAssign: PendingDragAssign | null;
  onDragEnd: (event: DragEndEvent) => void;
  confirmPendingDragAssign: () => Promise<boolean>;
  cancelPendingDragAssign: () => void;
  assignSelectedBatches: (
    request: OperationRequest,
    batchIds: string[],
  ) => Promise<boolean>;
  completeRequest: (requestId: string) => Promise<boolean>;
  cancelQueued: (requestId: string) => Promise<boolean>;
}

export function useOperationsBoardMutations({
  board,
  applyBoard,
  setError,
  setDetailRequest,
  setAssignMoreRequest,
}: UseOperationsBoardMutationsArgs): UseOperationsBoardMutationsResult {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [assigningToRequestId, setAssigningToRequestId] = useState<string | null>(
    null,
  );
  const [pendingDragAssign, setPendingDragAssign] =
    useState<PendingDragAssign | null>(null);

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
    [applyBoard, setError],
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
    [board?.availableBatches, board?.queued, runMutation, setAssignMoreRequest, setError],
  );

  const completeRequest = useCallback(
    async (requestId: string) => {
      const ok = await runMutation(requestId, () =>
        completeOperationRequest(requestId),
      );
      if (ok) setDetailRequest(null);
      return ok;
    },
    [runMutation, setDetailRequest],
  );

  const cancelQueued = useCallback(
    async (requestId: string) => {
      const ok = await runMutation(requestId, () => cancelQueuedRequest(requestId));
      if (ok) setDetailRequest(null);
      return ok;
    },
    [runMutation, setDetailRequest],
  );

  const onDragEnd = useCallback(
    (event: DragEndEvent) => {
      const pending = resolvePendingDragAssign({
        dragType: event.active?.data?.current?.dragType,
        overId: event.over?.id != null ? String(event.over.id) : "",
        batchId: String(event.active.id),
        availableBatches: board?.availableBatches || [],
        queued: board?.queued || [],
      });
      if (pending) setPendingDragAssign(pending);
    },
    [board?.availableBatches, board?.queued],
  );

  return {
    isSubmitting,
    assigningToRequestId,
    pendingDragAssign,
    onDragEnd,
    confirmPendingDragAssign,
    cancelPendingDragAssign,
    assignSelectedBatches,
    completeRequest,
    cancelQueued,
  };
}
