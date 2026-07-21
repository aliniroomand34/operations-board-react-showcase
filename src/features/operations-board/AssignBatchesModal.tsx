import { useState } from "react";
import { formatAmount } from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";
import { OperationsBoardModalShell } from "./OperationsBoardModalShell";

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

function batchSelectClass(isSelected: boolean): string {
  const base =
    "flex w-full flex-col rounded-lg border px-2 py-2 text-left text-xs transition disabled:opacity-50";
  if (isSelected) {
    return `${base} border-[var(--border-success)] bg-[var(--bg-success)]/35 text-[var(--fg-success)] shadow-[0_0_12px_rgba(30,90,42,0.35)]`;
  }
  return `${base} border-[var(--border-muted)]/45 bg-black/45 text-[var(--gray-800)] hover:border-[var(--border)]`;
}

function AssignBatchesActions({
  isSubmitting,
  selectedCount,
  onClose,
  onAssign,
}: {
  isSubmitting: boolean;
  selectedCount: number;
  onClose: () => void;
  onAssign: () => void;
}) {
  return (
    <>
      <button
        type="button"
        disabled={isSubmitting}
        onClick={onClose}
        className="ops-btn"
      >
        Cancel
      </button>
      <button
        type="button"
        disabled={isSubmitting || selectedCount === 0}
        onClick={onAssign}
        className="ops-btn ops-btn-primary"
      >
        {isSubmitting ? "Assigning…" : `Assign (${selectedCount})`}
      </button>
    </>
  );
}

function ReadyBatchPicker({
  batches,
  selected,
  isSubmitting,
  onToggle,
}: {
  batches: InventoryBatch[];
  selected: Set<string>;
  isSubmitting: boolean;
  onToggle: (id: string) => void;
}) {
  if (batches.length === 0) {
    return <p className="ops-empty">No ready batches available.</p>;
  }

  return (
    <ul className="grid max-h-64 grid-cols-2 gap-2 overflow-y-auto sm:grid-cols-3">
      {batches.map((batch) => {
        const isSelected = selected.has(batch.id);
        return (
          <li key={batch.id}>
            <button
              type="button"
              aria-pressed={isSelected}
              disabled={isSubmitting}
              onClick={() => onToggle(batch.id)}
              className={batchSelectClass(isSelected)}
            >
              <span className="font-semibold">{batch.label}</span>
              <span className="mt-1">{formatAmount(batch.capacity)}</span>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/**
 * Selection state stays inside this modal — parent only gets assign callbacks.
 */
export function AssignBatchesModal({
  open,
  request,
  readyBatches,
  isSubmitting,
  onClose,
  onAssignSelected,
}: AssignBatchesModalProps) {
  const [selected, setSelected] = useState<Set<string>>(() => new Set());

  if (!request) return null;

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
    <OperationsBoardModalShell
      open={open}
      title={`Assign batches · ${request.clientLabel}`}
      onClose={isSubmitting ? undefined : handleClose}
      footer={
        <AssignBatchesActions
          isSubmitting={isSubmitting}
          selectedCount={selected.size}
          onClose={handleClose}
          onAssign={() => void handleAssign()}
        />
      }
    >
      <p className="mb-3 text-xs">
        Request amount {formatAmount(request.amount)}. Select one or more ready
        batches.
      </p>
      <ReadyBatchPicker
        batches={readyBatches}
        selected={selected}
        isSubmitting={isSubmitting}
        onToggle={toggle}
      />
    </OperationsBoardModalShell>
  );
}
