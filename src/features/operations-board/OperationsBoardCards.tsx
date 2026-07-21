import { useDroppable } from "@dnd-kit/core";
import { FaUserCircle } from "react-icons/fa";
import {
  AssigningOverlay,
  CardShell,
} from "./OperationsBoardCardShell";
import {
  buildProgressRingBackground,
  formatAmount,
  formatRequestedAt,
  queueClientDropId,
} from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";

interface QueueClientCardProps {
  request: OperationRequest;
  onOpenDetails: (request: OperationRequest) => void;
  isAssigning: boolean;
}

export function QueueClientCard({
  request,
  onOpenDetails,
  isAssigning,
}: QueueClientCardProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: queueClientDropId(request.id),
    data: { dropType: "queue-client", request },
  });

  return (
    <CardShell>
      <button
        ref={setNodeRef}
        type="button"
        onClick={() => onOpenDetails(request)}
        className={`ops-client-card ${
          isOver
            ? "ring-2 ring-[var(--fg)] ring-offset-2 ring-offset-black"
            : ""
        }`}
        aria-label={`Queued client ${request.clientLabel}`}
      >
        <FaUserCircle
          className="pointer-events-none absolute inset-0 m-auto h-full w-full text-white/12"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"
          aria-hidden
        />
        <div className="relative z-10 flex h-full flex-col items-center justify-center gap-px px-1 py-1">
          <p className="max-w-full truncate text-[10px] font-bold leading-tight text-[var(--fg)]">
            {request.clientLabel}
          </p>
          <p className="text-[7px] leading-tight text-[var(--gray-800)]">
            {formatRequestedAt(request.requestedAt)}
          </p>
          <p className="rounded bg-[var(--fg)] px-1 py-px text-[7px] font-bold leading-tight text-[var(--fg-inverted)]">
            {formatAmount(request.amount)}
          </p>
          <span className="ops-status-badge ops-status-badge--queued ops-status-badge--compact">
            Queued
          </span>
        </div>
        {isAssigning ? <AssigningOverlay /> : null}
      </button>
    </CardShell>
  );
}

interface InProgressCardProps {
  request: OperationRequest;
  assignedBatches: InventoryBatch[];
  onOpenDetails: (request: OperationRequest) => void;
  onAssignMore?: (request: OperationRequest) => void;
  isAssigning: boolean;
}

export function InProgressCard({
  request,
  assignedBatches,
  onOpenDetails,
  onAssignMore,
  isAssigning,
}: InProgressCardProps) {
  const ring = buildProgressRingBackground(request.amount, assignedBatches);

  return (
    <CardShell>
      <div
        className="rounded-full p-[3px] shadow-[0_0_18px_rgba(255,215,0,0.18)]"
        style={{ background: ring }}
      >
        <button
          type="button"
          onClick={() => onOpenDetails(request)}
          className="ops-client-card border-[var(--border-muted)]/70 bg-gradient-to-b from-[#2a2208]/70 to-black/90"
          aria-label={`In-progress operation ${request.clientLabel}`}
        >
          <FaUserCircle
            className="pointer-events-none absolute inset-0 m-auto h-full w-full text-white/10"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-center gap-px px-1 py-1">
            <p className="max-w-full truncate text-[10px] font-bold leading-tight text-white">
              {request.clientLabel}
            </p>
            <p className="text-[7px] font-semibold leading-tight text-[var(--fg-subtle)]">
              {formatAmount(request.amount)}
            </p>
            <p className="text-[7px] leading-tight text-[var(--gray-800)]">
              {request.batchIds.length} batch(es)
            </p>
            <span className="ops-status-badge ops-status-badge--progress ops-status-badge--compact">
              Progress
            </span>
          </div>
          {isAssigning ? <AssigningOverlay /> : null}
        </button>
      </div>
      {onAssignMore ? (
        <button
          type="button"
          onClick={() => onAssignMore(request)}
          className="ops-btn w-full py-1 text-[10px]"
          aria-label={`Assign more batches to ${request.clientLabel}`}
        >
          Assign more
        </button>
      ) : null}
    </CardShell>
  );
}

interface CompletedCardProps {
  request: OperationRequest;
  onOpenDetails: (request: OperationRequest) => void;
}

export function CompletedCard({
  request,
  onOpenDetails,
}: CompletedCardProps) {
  return (
    <CardShell>
      <button
        type="button"
        onClick={() => onOpenDetails(request)}
        className="ops-completed-card"
        aria-label={`Completed operation ${request.clientLabel}`}
      >
        <p className="truncate text-[10px] font-bold leading-tight text-[var(--fg-info)]">
          {request.clientLabel}
        </p>
        <p className="mt-px text-[8px] leading-tight text-white/85">
          {formatAmount(request.amount)}
        </p>
        <p className="mt-px text-[7px] leading-tight text-[var(--gray-800)]">
          {request.batchIds.length} batch(es)
        </p>
        <span className="ops-status-badge ops-status-badge--done ops-status-badge--compact mt-0.5">
          Done
        </span>
      </button>
    </CardShell>
  );
}
