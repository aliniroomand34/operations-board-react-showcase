import type { CSSProperties, ReactNode } from "react";
import { useDraggable, useDroppable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { FaUserCircle } from "react-icons/fa";
import {
  buildProgressRingBackground,
  formatAmount,
  formatRequestedAt,
  queueClientDropId,
} from "./operationsBoard.helpers";
import type { InventoryBatch, OperationRequest } from "./operationsBoard.types";

interface CardShellProps {
  children: ReactNode;
  className?: string;
}

function CardShell({ children, className = "" }: CardShellProps) {
  return (
    <article
      className={`flex w-full max-w-[9rem] flex-col items-stretch gap-1 justify-self-center ${className}`}
    >
      {children}
    </article>
  );
}

interface QueueClientCardProps {
  request: OperationRequest;
  onOpenDetails: (request: OperationRequest) => void;
  isAssigning: boolean;
}

function QueueClientCard({
  request,
  onOpenDetails,
  isAssigning,
}: QueueClientCardProps) {
  const dropId = queueClientDropId(request.id);
  const { setNodeRef, isOver } = useDroppable({
    id: dropId,
    data: { dropType: "queue-client", request },
  });

  return (
    <CardShell>
      <div
        ref={setNodeRef}
        className={`relative rounded-full ${isOver ? "ring-2 ring-[var(--color-gold)] ring-offset-2 ring-offset-[var(--color-dark)]" : ""}`}
      >
        <button
          type="button"
          onClick={() => onOpenDetails(request)}
          className="relative flex aspect-square w-full cursor-pointer flex-col overflow-hidden rounded-full border border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark)] text-center"
          aria-label={`Queued client ${request.clientLabel}`}
        >
          <FaUserCircle
            className="pointer-events-none absolute inset-0 m-auto h-full w-full text-white/10"
            aria-hidden
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 to-transparent" />
          <div className="relative z-10 flex h-full flex-col items-center justify-center px-2 pb-4">
            <p className="truncate text-sm font-semibold text-[var(--color-text-primary)]">
              {request.clientLabel}
            </p>
            <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">
              {formatRequestedAt(request.requestedAt)}
            </p>
            <p className="mt-1 rounded bg-[var(--color-gold)] px-1.5 text-[10px] font-semibold text-[var(--color-dark)]">
              {formatAmount(request.amount)}
            </p>
          </div>
          {isAssigning ? (
            <span
              className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-[10px] font-semibold text-amber-100"
              role="status"
            >
              Assigning…
            </span>
          ) : null}
        </button>
      </div>
    </CardShell>
  );
}

interface ReadyBatchCardProps {
  batch: InventoryBatch;
}

function ReadyBatchCard({ batch }: ReadyBatchCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: batch.id,
    data: { dragType: "batch", batch },
  });
  const style: CSSProperties = { transform: CSS.Translate.toString(transform) };

  return (
    <CardShell>
      <article
        ref={setNodeRef}
        style={style}
        className={`flex aspect-square w-full cursor-grab flex-col justify-between overflow-hidden rounded-2xl border border-emerald-500/40 bg-emerald-950/30 p-3 active:cursor-grabbing ${
          isDragging ? "opacity-60 ring-2 ring-emerald-400" : ""
        }`}
        aria-label={`Ready batch ${batch.label}. Drag onto a queued client, or assign via client details.`}
        {...attributes}
        {...listeners}
      >
        <p className="text-xs font-semibold text-emerald-200">{batch.label}</p>
        <p className="text-lg font-bold text-emerald-100">
          {formatAmount(batch.capacity)}
        </p>
        <p className="text-[10px] uppercase tracking-wide text-emerald-300/80">
          Ready
        </p>
      </article>
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

function InProgressCard({
  request,
  assignedBatches,
  onOpenDetails,
  onAssignMore,
  isAssigning,
}: InProgressCardProps) {
  const ring = buildProgressRingBackground(request.amount, assignedBatches);

  return (
    <CardShell>
      <div className="rounded-full p-0.5 shadow-lg" style={{ background: ring }}>
        <button
          type="button"
          onClick={() => onOpenDetails(request)}
          className="relative flex aspect-square w-full cursor-pointer flex-col overflow-hidden rounded-full border border-amber-400/35 bg-gradient-to-b from-amber-950/45 to-black/85 text-center"
          aria-label={`In-progress operation ${request.clientLabel}`}
        >
          <FaUserCircle
            className="pointer-events-none absolute inset-0 m-auto h-full w-full text-white/8"
            aria-hidden
          />
          <div className="relative z-10 flex h-full flex-col items-center justify-end px-2 pb-5">
            <p className="w-full truncate text-xs font-bold text-white">
              {request.clientLabel}
            </p>
            <p className="mt-0.5 text-[10px] text-amber-100">
              {formatAmount(request.amount)}
            </p>
            <p className="text-[9px] text-gray-400">
              {request.batchIds.length} batch(es)
            </p>
          </div>
          {isAssigning ? (
            <span
              className="absolute inset-x-0 bottom-0 bg-black/80 py-1 text-[10px] font-semibold text-amber-100"
              role="status"
            >
              Assigning…
            </span>
          ) : null}
        </button>
      </div>
      {onAssignMore ? (
        <button
          type="button"
          onClick={() => onAssignMore(request)}
          className="rounded-lg border border-amber-400/50 bg-amber-500/15 px-2 py-1 text-[10px] font-semibold text-amber-200 hover:bg-amber-500/25"
          aria-label={`Assign more batches to ${request.clientLabel}`}
        >
          Assign more
        </button>
      ) : null}
    </CardShell>
  );
}

interface ColumnFrameProps {
  title: string;
  count: number;
  toneClass: string;
  children: ReactNode;
}

function ColumnFrame({ title, count, toneClass, children }: ColumnFrameProps) {
  const headingId = `${title.toLowerCase().replace(/\s+/g, "-")}-column-heading`;

  return (
    <section
      className={`flex min-h-64 flex-col rounded-2xl border border-[var(--color-gold-shadow)]/40 p-3 ${toneClass}`}
      aria-labelledby={headingId}
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2
          id={headingId}
          className="text-sm font-semibold text-[var(--color-text-primary)]"
        >
          {title}
        </h2>
        <span className="text-xs text-[var(--color-text-secondary)]" aria-label={`${count} items`}>
          {count}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-3">
          {children}
        </div>
      </div>
    </section>
  );
}

export interface QueuedColumnProps {
  requests: OperationRequest[];
  assigningToRequestId: string | null;
  onOpenDetails: (request: OperationRequest) => void;
}

export function QueuedColumn({
  requests,
  assigningToRequestId,
  onOpenDetails,
}: QueuedColumnProps) {
  return (
    <ColumnFrame title="Queued" count={requests.length} toneClass="bg-rose-950/20">
      {requests.length === 0 ? (
        <p
          className="col-span-full rounded-xl border border-dashed border-white/20 p-3 text-xs text-[var(--color-text-secondary)]"
          role="status"
        >
          No queued operation requests.
        </p>
      ) : (
        requests.map((request) => (
          <QueueClientCard
            key={request.id}
            request={request}
            onOpenDetails={onOpenDetails}
            isAssigning={assigningToRequestId === request.id}
          />
        ))
      )}
    </ColumnFrame>
  );
}

export interface ReadyBatchesColumnProps {
  batches: InventoryBatch[];
}

export function ReadyBatchesColumn({ batches }: ReadyBatchesColumnProps) {
  const { setNodeRef, isOver } = useDroppable({ id: "ready-batch-drop-zone" });
  return (
    <section
      ref={setNodeRef}
      className={`flex min-h-64 flex-col rounded-2xl border-2 border-dashed border-emerald-500/45 bg-emerald-950/15 p-3 ${
        isOver ? "border-emerald-400" : ""
      }`}
      aria-labelledby="ready-batches-column-heading"
    >
      <div className="mb-2 flex items-center justify-between gap-2">
        <h2
          id="ready-batches-column-heading"
          className="text-sm font-semibold text-emerald-200"
        >
          Ready batches
        </h2>
        <span
          className="text-xs text-emerald-200/70"
          aria-label={`${batches.length} items`}
        >
          {batches.length}
        </span>
      </div>
      <div className="min-h-0 flex-1 overflow-y-auto">
        <div className="grid grid-cols-2 justify-items-center gap-2 sm:grid-cols-3">
          {batches.length === 0 ? (
            <p
              className="col-span-full rounded-xl border border-dashed border-white/20 p-3 text-xs text-[var(--color-text-secondary)]"
              role="status"
            >
              No ready batches in inventory.
            </p>
          ) : (
            batches.map((batch) => (
              <ReadyBatchCard key={batch.id} batch={batch} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export interface InProgressColumnProps {
  requests: OperationRequest[];
  batchesForRequest: (request: OperationRequest) => InventoryBatch[];
  assigningToRequestId: string | null;
  onOpenDetails: (request: OperationRequest) => void;
  onAssignMore: (request: OperationRequest) => void;
}

export function InProgressColumn({
  requests,
  batchesForRequest,
  assigningToRequestId,
  onOpenDetails,
  onAssignMore,
}: InProgressColumnProps) {
  return (
    <ColumnFrame
      title="In progress"
      count={requests.length}
      toneClass="bg-amber-950/20"
    >
      {requests.length === 0 ? (
        <p
          className="col-span-full rounded-xl border border-dashed border-white/20 p-3 text-xs text-[var(--color-text-secondary)]"
          role="status"
        >
          No in-progress operations.
        </p>
      ) : (
        requests.map((request) => (
          <InProgressCard
            key={request.id}
            request={request}
            assignedBatches={batchesForRequest(request)}
            onOpenDetails={onOpenDetails}
            onAssignMore={onAssignMore}
            isAssigning={assigningToRequestId === request.id}
          />
        ))
      )}
    </ColumnFrame>
  );
}

export interface CompletedColumnProps {
  requests: OperationRequest[];
  onOpenDetails: (request: OperationRequest) => void;
}

export function CompletedColumn({
  requests,
  onOpenDetails,
}: CompletedColumnProps) {
  return (
    <ColumnFrame
      title="Completed"
      count={requests.length}
      toneClass="bg-violet-950/20"
    >
      {requests.length === 0 ? (
        <p
          className="col-span-full rounded-xl border border-dashed border-white/20 p-3 text-xs text-[var(--color-text-secondary)]"
          role="status"
        >
          No completed operations yet.
        </p>
      ) : (
        requests.map((request) => (
          <CardShell key={request.id}>
            <button
              type="button"
              onClick={() => onOpenDetails(request)}
              className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center rounded-2xl border border-violet-400/35 bg-violet-950/30 px-2 text-center"
              aria-label={`Completed operation ${request.clientLabel}`}
            >
              <p className="truncate text-sm font-semibold text-violet-100">
                {request.clientLabel}
              </p>
              <p className="mt-1 text-xs text-violet-200/80">
                {formatAmount(request.amount)}
              </p>
              <p className="mt-1 text-[10px] text-[var(--color-text-secondary)]">
                {request.batchIds.length} batch(es)
              </p>
            </button>
          </CardShell>
        ))
      )}
    </ColumnFrame>
  );
}
