import { useEffect, useId, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import {
  buildRequestDetailTiles,
  formatAmount,
} from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";

interface ModalShellProps {
  open: boolean;
  title: string;
  onClose?: () => void;
  children: ReactNode;
  footer?: ReactNode;
}

function ModalShell({ open, title, onClose, children, footer }: ModalShellProps) {
  const titleId = useId();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    dialogRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && onClose) {
        event.preventDefault();
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      previouslyFocused?.focus?.();
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
      role="presentation"
      onClick={() => onClose?.()}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        className="w-full max-w-lg rounded-xl border border-[var(--color-gold-shadow)]/50 bg-[var(--color-dark-1)] p-4 shadow-xl outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-gold)]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-start justify-between gap-3">
          <h3
            id={titleId}
            className="text-base font-semibold text-[var(--color-gold)]"
          >
            {title}
          </h3>
          {onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="rounded p-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-dark)] hover:text-[var(--color-text-primary)]"
              aria-label="Close dialog"
            >
              <X className="h-4 w-4" aria-hidden />
            </button>
          ) : null}
        </div>
        <div className="text-sm text-[var(--color-text-secondary)]">{children}</div>
        {footer ? (
          <div className="mt-4 flex flex-wrap justify-end gap-2">{footer}</div>
        ) : null}
      </div>
    </div>
  );
}

export interface DragAssignConfirmModalProps {
  open: boolean;
  batch: InventoryBatch | null | undefined;
  request: OperationRequest | null | undefined;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void | boolean | Promise<void | boolean>;
}

export function DragAssignConfirmModal({
  open,
  batch,
  request,
  isSubmitting,
  onClose,
  onConfirm,
}: DragAssignConfirmModalProps) {
  return (
    <ModalShell
      open={open}
      title="Confirm batch assignment"
      onClose={isSubmitting ? undefined : onClose}
      footer={
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void onConfirm()}
            className="rounded-md bg-[var(--color-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark)] disabled:opacity-50"
          >
            {isSubmitting ? "Assigning…" : "Assign batch"}
          </button>
        </>
      }
    >
      <p>
        Assign{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {batch?.label}
        </span>{" "}
        (capacity {formatAmount(batch?.capacity)}) to{" "}
        <span className="font-medium text-[var(--color-text-primary)]">
          {request?.clientLabel}
        </span>
        ?
      </p>
      <p className="mt-2 text-xs">
        Request {request?.id} · amount {formatAmount(request?.amount)}
      </p>
    </ModalShell>
  );
}

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
  const isQueued = request.status === "queued";
  const isInProgress = request.status === "inProgress";
  const isCompleted = request.status === "completed";

  return (
    <ModalShell
      open={open}
      title={isCompleted ? "Completed operation" : "Operation details"}
      onClose={isSubmitting ? undefined : onClose}
      footer={
        <>
          {isQueued ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void onCancelQueued?.(request.id)}
              className="rounded-md border border-red-400/40 px-3 py-1.5 text-xs font-medium text-red-200 disabled:opacity-50"
            >
              Remove from queue
            </button>
          ) : null}
          {isQueued || isInProgress ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onAssignMore?.(request)}
              className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] disabled:opacity-50"
            >
              Assign batches
            </button>
          ) : null}
          {isInProgress ? (
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => void onComplete?.(request.id)}
              className="rounded-md bg-[var(--color-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark)] disabled:opacity-50"
            >
              {isSubmitting ? "Completing…" : "Mark completed"}
            </button>
          ) : null}
          <button
            type="button"
            disabled={isSubmitting}
            onClick={onClose}
            className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] disabled:opacity-50"
          >
            Close
          </button>
        </>
      }
    >
      <dl className="grid gap-2 sm:grid-cols-2">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            className="rounded-md border border-[var(--color-gold-shadow)]/30 bg-[var(--color-dark)] px-3 py-2"
          >
            <dt className="text-[10px] uppercase tracking-wide text-[var(--color-text-secondary)]">
              {tile.label}
            </dt>
            <dd className="mt-0.5 text-sm text-[var(--color-text-primary)]">
              {tile.value}
            </dd>
          </div>
        ))}
      </dl>
      {assignedBatches.length > 0 ? (
        <div className="mt-3">
          <p className="mb-1 text-xs font-semibold text-[var(--color-text-primary)]">
            Assigned batches
          </p>
          <ul className="flex flex-wrap gap-2">
            {assignedBatches.map((batch) => (
              <li
                key={batch.id}
                className="rounded border border-[var(--color-gold-shadow)]/30 px-2 py-1 text-xs"
              >
                {batch.label} · {formatAmount(batch.capacity)}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </ModalShell>
  );
}

export interface AssignBatchesModalProps {
  open: boolean;
  request: OperationRequest | null;
  readyBatches: InventoryBatch[];
  isSubmitting: boolean;
  onClose: () => void;
  onAssignSelected: (
    request: OperationRequest,
    batchIds: string[],
  ) => Promise<boolean>;
}

export function AssignBatchesModal({
  open,
  request,
  readyBatches,
  isSubmitting,
  onClose,
  onAssignSelected,
}: AssignBatchesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  if (!open || !request) return null;

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleClose = () => {
    setSelected(new Set());
    onClose();
  };

  const handleAssign = async () => {
    const ok = await onAssignSelected(request, [...selected]);
    if (ok) setSelected(new Set());
  };

  return (
    <ModalShell
      open={open}
      title={`Assign batches · ${request.clientLabel}`}
      onClose={isSubmitting ? undefined : handleClose}
      footer={
        <>
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleClose}
            className="rounded-md border border-[var(--color-gold-shadow)]/50 px-3 py-1.5 text-xs font-medium text-[var(--color-text-primary)] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isSubmitting || selected.size === 0}
            onClick={() => void handleAssign()}
            className="rounded-md bg-[var(--color-gold)] px-3 py-1.5 text-xs font-semibold text-[var(--color-dark)] disabled:opacity-50"
          >
            {isSubmitting ? "Assigning…" : `Assign (${selected.size})`}
          </button>
        </>
      }
    >
      <p className="mb-3 text-xs">
        Request amount {formatAmount(request.amount)}. Select one or more ready
        batches.
      </p>
      {readyBatches.length === 0 ? (
        <p className="rounded-md border border-dashed border-white/20 p-3 text-xs">
          No ready batches available.
        </p>
      ) : (
        <ul className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
          {readyBatches.map((batch) => {
            const isSelected = selected.has(batch.id);
            return (
              <li key={batch.id}>
                <button
                  type="button"
                  aria-pressed={isSelected}
                  disabled={isSubmitting}
                  onClick={() => toggle(batch.id)}
                  className={`flex w-full flex-col rounded-lg border px-2 py-2 text-left text-xs transition ${
                    isSelected
                      ? "border-emerald-400 bg-emerald-500/20 text-emerald-100"
                      : "border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark)] text-[var(--color-text-secondary)]"
                  } disabled:opacity-50`}
                >
                  <span className="font-semibold">{batch.label}</span>
                  <span className="mt-1">{formatAmount(batch.capacity)}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </ModalShell>
  );
}
