import { formatAmount } from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";
import { OperationsBoardModalShell } from "./operations-board-modal-shell";

export interface DragAssignConfirmModalProps {
  open: boolean;
  batch: InventoryBatch | null | undefined;
  request: OperationRequest | null | undefined;
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void | boolean | Promise<void | boolean>;
}

function DragAssignConfirmActions({
  isSubmitting,
  onClose,
  onConfirm,
}: {
  isSubmitting: boolean;
  onClose: () => void;
  onConfirm: () => void | boolean | Promise<void | boolean>;
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
        disabled={isSubmitting}
        onClick={() => void onConfirm()}
        className="ops-btn ops-btn-primary"
      >
        {isSubmitting ? "Assigning…" : "Assign batch"}
      </button>
    </>
  );
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
    <OperationsBoardModalShell
      open={open}
      title="Confirm batch assignment"
      onClose={isSubmitting ? undefined : onClose}
      footer={
        <DragAssignConfirmActions
          isSubmitting={isSubmitting}
          onClose={onClose}
          onConfirm={onConfirm}
        />
      }
    >
      <p>
        Assign{" "}
        <span className="font-semibold text-[var(--fg)]">{batch?.label}</span>{" "}
        (capacity {formatAmount(batch?.capacity)}) to{" "}
        <span className="font-semibold text-[var(--fg)]">
          {request?.clientLabel}
        </span>
        ?
      </p>
      <p className="mt-2 text-xs text-[var(--gray-800)]">
        Request {request?.id} · amount {formatAmount(request?.amount)}
      </p>
    </OperationsBoardModalShell>
  );
}
