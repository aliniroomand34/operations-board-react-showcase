import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
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
import { useOperationsBoardLogic } from "./useOperationsBoardLogic";

interface DemoControlsProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

function DemoControls({
  loading,
  onReload,
  onShowEmpty,
  onSimulateError,
  onResetDemo,
}: DemoControlsProps) {
  return (
    <div className="flex flex-wrap gap-2" role="group" aria-label="Demo controls">
      <button
        type="button"
        onClick={onReload}
        disabled={loading}
        className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-dark-1)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reload
      </button>
      <button
        type="button"
        onClick={onShowEmpty}
        disabled={loading}
        className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-dark-1)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Show empty
      </button>
      <button
        type="button"
        onClick={onSimulateError}
        disabled={loading}
        className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] hover:bg-[var(--color-dark-1)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Simulate error
      </button>
      <button
        type="button"
        onClick={onResetDemo}
        disabled={loading}
        className="rounded-md bg-[var(--color-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark)] hover:bg-[var(--color-gold-light)] disabled:cursor-not-allowed disabled:opacity-50"
      >
        Reset demo data
      </button>
    </div>
  );
}

interface BoardStatusPanelProps {
  loading: boolean;
  error: string;
  isBoardEmpty: boolean;
  onRetry: () => void;
  onResetDemo: () => void;
}

function BoardStatusPanel({
  loading,
  error,
  isBoardEmpty,
  onRetry,
  onResetDemo,
}: BoardStatusPanelProps) {
  if (loading) {
    return (
      <div
        className="flex items-center gap-3 rounded-md border border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark-1)] px-4 py-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          className="inline-block h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-[var(--color-gold)] border-t-transparent"
          aria-hidden
        />
        <div>
          <p className="text-sm font-medium text-[var(--color-text-primary)]">
            Loading operations board…
          </p>
          <p className="mt-0.5 text-xs text-[var(--color-text-secondary)]">
            Fetching synthetic data from the mock API.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="rounded-md border border-red-500/40 bg-red-950/30 px-4 py-4 text-sm"
        role="alert"
        aria-live="assertive"
      >
        <p className="font-medium text-red-200">Could not load the board</p>
        <p className="mt-1 text-red-200/80">{error}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={onRetry}
            className="rounded-md bg-[var(--color-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark)]"
          >
            Retry
          </button>
          <button
            type="button"
            onClick={onResetDemo}
            className="rounded-md border border-red-400/40 px-3 py-1.5 text-xs font-medium text-red-100"
          >
            Reset demo data
          </button>
        </div>
      </div>
    );
  }

  if (isBoardEmpty) {
    return (
      <div
        className="rounded-md border border-dashed border-[var(--color-gold-shadow)]/50 bg-[var(--color-dark-1)] px-4 py-8 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-medium text-[var(--color-text-primary)]">
          Board is empty
        </p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--color-text-secondary)]">
          There are no queued, in-progress, or completed operations, and no ready
          batches. Restore the synthetic dataset to continue the demo.
        </p>
        <button
          type="button"
          onClick={onResetDemo}
          className="mt-4 rounded-md bg-[var(--color-gold)] px-4 py-2 text-xs font-semibold text-[var(--color-dark)] hover:bg-[var(--color-gold-light)]"
        >
          Reset demo data
        </button>
      </div>
    );
  }

  return null;
}

/**
 * Operations Board page — typed UI over mock API + domain helpers.
 * Demonstrates loading / error / empty / success and drag-assign workflows.
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
    <section className="flex flex-col gap-6" aria-labelledby="operations-board-heading">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div className="space-y-2">
          <h1
            id="operations-board-heading"
            className="text-2xl font-semibold text-[var(--color-gold)]"
          >
            Operations Board
          </h1>
          <p
            id="operations-board-description"
            className="max-w-2xl text-sm leading-relaxed text-[var(--color-text-secondary)]"
          >
            Public demo of the operations workflow board. Data comes from an in-memory
            mock API with synthetic clients and batches — no real auth or backend.
            Drag a ready batch onto a queued client to assign, or open a client and use
            Assign batches for a keyboard-friendly path.
          </p>
        </div>

        <DemoControls
          loading={loading}
          onReload={() => void loadBoard()}
          onShowEmpty={() => void handleShowEmpty()}
          onSimulateError={() => void handleSimulateError()}
          onResetDemo={() => void handleResetDemo()}
        />
      </div>

      <div
        aria-busy={loading}
        aria-describedby="operations-board-description"
      >
        <BoardStatusPanel
          loading={loading}
          error={error}
          isBoardEmpty={isBoardEmpty}
          onRetry={handleRetry}
          onResetDemo={() => void handleResetDemo()}
        />

        {showBoard ? (
          <DndContext sensors={sensors} onDragEnd={onDragEnd}>
            <div
              className="grid gap-4 lg:grid-cols-2 xl:grid-cols-4"
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
