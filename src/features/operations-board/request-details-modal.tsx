import {
  buildRequestDetailTiles,
  formatAmount,
} from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";
import { OperationsBoardModalShell } from "./operations-board-modal-shell";

export interface RequestDetailsModalProps {
  open: boolean;
  request: OperationRequest | null;
  availableBatches: InventoryBatch[];
  assignedBatches: InventoryBatch[];
  isSubmitting: boolean;
  onClose: () => void;
  onComplete?: (requestId: string) => void | boolean | Promise<void | boolean>;
  onCancelQueued?: (requestId: string) => void | boolean | Promise<void | boolean>;
  onAssignMore?: (request: OperationRequest) => void;
}

function RequestStatusBadge({ status }: { status: OperationRequest["status"] }) {
  if (status === "queued") {
    return (
      <span className="ops-status-badge ops-status-badge--queued">Queued</span>
    );
  }
  if (status === "inProgress") {
    return (
      <span className="ops-status-badge ops-status-badge--progress">
        In progress
      </span>
    );
  }
  if (status === "completed") {
    return (
      <span className="ops-status-badge ops-status-badge--done">Completed</span>
    );
  }
  return null;
}

function RequestDetailsActions({
  request,
  isSubmitting,
  onClose,
  onComplete,
  onCancelQueued,
  onAssignMore,
}: {
  request: OperationRequest;
  isSubmitting: boolean;
  onClose: () => void;
  onComplete?: (requestId: string) => void | boolean | Promise<void | boolean>;
  onCancelQueued?: (requestId: string) => void | boolean | Promise<void | boolean>;
  onAssignMore?: (request: OperationRequest) => void;
}) {
  const isQueued = request.status === "queued";
  const isInProgress = request.status === "inProgress";

  return (
    <>
      {isQueued ? (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => void onCancelQueued?.(request.id)}
          className="ops-btn ops-btn-danger"
        >
          Remove from queue
        </button>
      ) : null}
      {isQueued || isInProgress ? (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => onAssignMore?.(request)}
          className="ops-btn"
        >
          Assign batches
        </button>
      ) : null}
      {isInProgress ? (
        <button
          type="button"
          disabled={isSubmitting}
          onClick={() => void onComplete?.(request.id)}
          className="ops-btn ops-btn-primary"
        >
          {isSubmitting ? "Completing…" : "Mark completed"}
        </button>
      ) : null}
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onClose}
        className="ops-btn"
      >
        Close
      </button>
    </>
  );
}

function AssignedBatchesList({ batches }: { batches: InventoryBatch[] }) {
  if (batches.length === 0) return null;

  return (
    <section className="mt-3" aria-label="Assigned batches">
      <h4 className="mb-1.5 text-xs font-semibold text-[var(--fg)]">
        Assigned batches
      </h4>
      <ul className="flex flex-wrap gap-2">
        {batches.map((batch) => (
          <li
            key={batch.id}
            className="rounded border border-[var(--border-muted)]/45 bg-black/40 px-2 py-1 text-xs text-[var(--gray-900)]"
          >
            {batch.label} · {formatAmount(batch.capacity)}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function RequestDetailsModal({
  open,
  request,
  availableBatches,
  assignedBatches,
  isSubmitting,
  onClose,
  onComplete,
  onCancelQueued,
  onAssignMore,
}: RequestDetailsModalProps) {
  if (!request) return null;

  const tiles = buildRequestDetailTiles(request, availableBatches);
  const isCompleted = request.status === "completed";

  return (
    <OperationsBoardModalShell
      open={open}
      title={isCompleted ? "Completed operation" : "Operation details"}
      onClose={isSubmitting ? undefined : onClose}
      footer={
        <RequestDetailsActions
          request={request}
          isSubmitting={isSubmitting}
          onClose={onClose}
          onComplete={onComplete}
          onCancelQueued={onCancelQueued}
          onAssignMore={onAssignMore}
        />
      }
    >
      <div className="ops-workflow-strip mb-3">
        <RequestStatusBadge status={request.status} />
      </div>
      <dl className="grid gap-2 sm:grid-cols-2">
        {tiles.map((tile) => (
          <div key={tile.label} className="ops-tile">
            <dt className="text-[10px] font-semibold uppercase tracking-wide text-[var(--gray-800)]">
              {tile.label}
            </dt>
            <dd className="mt-0.5 text-sm font-medium text-[var(--fg)]">
              {tile.value}
            </dd>
          </div>
        ))}
      </dl>
      <AssignedBatchesList batches={assignedBatches} />
    </OperationsBoardModalShell>
  );
}
