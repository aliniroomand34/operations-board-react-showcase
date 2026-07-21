import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { OPERATIONS_BOARD_STRIP_CLASS } from "@/features/shared/boardChrome";
import {
  CompletedColumn,
  InProgressColumn,
  QueuedColumn,
  ReadyBatchesColumn,
} from "./OperationsBoardColumns";
import {
  AssignBatchesModal,
  DragAssignConfirmModal,
  RequestDetailsModal,
} from "./OperationsBoardModals";
import { OperationsBoardPageHeader } from "./OperationsBoardPageHeader";
import { OperationsBoardStatusPanel } from "./OperationsBoardStatusPanel";
import { useOperationsBoardLogic } from "./useOperationsBoardLogic";

/**
 * Operations Board page — feature-level orchestration only.
 * Header, status, columns, and modals are composed; logic lives in the hook.
 */
export default function OperationsBoardPage() {
  const {
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
    handleShowErrorPreset,
    handleResetDemo,
    handleSimulateError,
    onDragEnd,
    confirmPendingDragAssign,
    cancelPendingDragAssign,
    assignSelectedBatches,
    completeRequest,
    cancelQueued,
    batchesForRequest,
  } = useOperationsBoardLogic();

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const showBoard = !loading && !error && board && !isBoardEmpty;

  return (
    <section className="flex flex-col gap-5" aria-labelledby="operations-board-heading">
      <OperationsBoardPageHeader
        loading={loading}
        onReload={() => void loadBoard()}
        onShowEmpty={() => void handleShowEmpty()}
        onShowErrorPreset={() => void handleShowErrorPreset()}
        onSimulateError={() => void handleSimulateError()}
        onResetDemo={() => void handleResetDemo()}
      />

      <div aria-busy={loading} aria-describedby="operations-board-description">
        <OperationsBoardStatusPanel
          loading={loading}
          error={error}
          isBoardEmpty={isBoardEmpty}
          onRetry={handleRetry}
          onResetDemo={() => void handleResetDemo()}
        />

        {showBoard ? (
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div
              className={OPERATIONS_BOARD_STRIP_CLASS}
              role="region"
              aria-label="Board columns"
            >
              <QueuedColumn
                requests={board.queued}
                assigningToRequestId={assigningToRequestId}
                onOpenDetails={setDetailRequest}
              />
              <ReadyBatchesColumn batches={readyBatches} />
              <InProgressColumn
                requests={board.inProgress}
                batchesForRequest={batchesForRequest}
                assigningToRequestId={assigningToRequestId}
                onOpenDetails={setDetailRequest}
                onAssignMore={setAssignMoreRequest}
              />
              <CompletedColumn
                requests={board.completed}
                onOpenDetails={setDetailRequest}
              />
            </div>
          </DndContext>
        ) : null}
      </div>

      <DragAssignConfirmModal
        open={Boolean(pendingDragAssign)}
        batch={pendingDragAssign?.batch}
        request={pendingDragAssign?.request}
        isSubmitting={isSubmitting}
        onClose={cancelPendingDragAssign}
        onConfirm={confirmPendingDragAssign}
      />

      <RequestDetailsModal
        open={Boolean(detailRequest)}
        request={detailRequest}
        availableBatches={board?.availableBatches || []}
        assignedBatches={detailRequest ? batchesForRequest(detailRequest) : []}
        isSubmitting={isSubmitting}
        onClose={() => setDetailRequest(null)}
        onComplete={completeRequest}
        onCancelQueued={cancelQueued}
        onAssignMore={(request) => {
          setDetailRequest(null);
          setAssignMoreRequest(request);
        }}
      />

      <AssignBatchesModal
        open={Boolean(assignMoreRequest)}
        request={assignMoreRequest}
        readyBatches={readyBatches}
        isSubmitting={isSubmitting}
        onClose={() => setAssignMoreRequest(null)}
        onAssignSelected={assignSelectedBatches}
      />
    </section>
  );
}
