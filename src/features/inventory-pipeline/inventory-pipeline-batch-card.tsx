import { Link } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";
import type { PipelineBatch, PipelineColumn } from "./inventoryPipeline.types";

interface InventoryPipelineBatchCardProps {
  batch: PipelineBatch;
  column: PipelineColumn;
  isActive: boolean;
  isSubmitting: boolean;
  onAdvance: (batchId: string) => void;
  onRetry: (batchId: string) => void;
  onArchive: (batchId: string) => void;
  onMarkProblem: (batchId: string) => void;
  onHandoff: (batchId: string) => void;
}

export function InventoryPipelineBatchCard({
  batch,
  column,
  isActive,
  isSubmitting,
  onAdvance,
  onRetry,
  onArchive,
  onMarkProblem,
  onHandoff,
}: InventoryPipelineBatchCardProps) {
  const skuSummary = batch.requestPayload.lineItems
    .map((item) => `${item.skuLabel} ×${item.quantity}`)
    .join(", ");

  return (
    <article
      className="ops-card w-full max-w-[220px] p-3"
      aria-label={`Pipeline batch ${batch.label}`}
    >
      <header className="space-y-1">
        <h3 className="text-sm font-semibold text-[var(--fg)]">{batch.label}</h3>
        <p className="font-mono text-[10px] text-[var(--fg-muted)]">{batch.id}</p>
      </header>

      <dl className="mt-2 space-y-1 text-xs text-[var(--gray-800)]">
        <div className="flex justify-between gap-2">
          <dt>Capacity</dt>
          <dd>{batch.capacity}</dd>
        </div>
        <div>
          <dt className="mb-0.5">SKUs</dt>
          <dd className="text-[var(--gray-900)]">{skuSummary}</dd>
        </div>
        <div className="flex justify-between gap-2">
          <dt>Mode</dt>
          <dd className="capitalize">{batch.requestPayload.mode}</dd>
        </div>
      </dl>

      <div className="mt-3 flex flex-col gap-1.5">
        {column === "acquiring" ? (
          <>
            <Link
              to={`${ADMIN_DEMO_BASE}/extension-sim?job=${batch.acquisitionJobId}`}
              className="ops-btn ops-btn-primary px-2 py-1 text-center text-xs"
            >
              Open simulator
            </Link>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onAdvance(batch.id)}
              className="ops-btn px-2 py-1 text-xs"
            >
              {isActive && isSubmitting ? "Advancing…" : "Advance (demo)"}
            </button>
          </>
        ) : null}

        {column === "packaging" ? (
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onAdvance(batch.id)}
              className="ops-btn ops-btn-primary px-2 py-1 text-xs"
            >
              {isActive && isSubmitting ? "Advancing…" : "Mark ready"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onMarkProblem(batch.id)}
              className="ops-btn px-2 py-1 text-xs"
            >
              Mark problem
            </button>
          </>
        ) : null}

        {column === "ready" ? (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => onHandoff(batch.id)}
            className="ops-btn ops-btn-primary px-2 py-1 text-xs"
          >
            {isActive && isSubmitting
              ? "Handing off…"
              : "Hand off to Operations Board"}
          </button>
        ) : null}

        {column === "problem" ? (
          <>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onRetry(batch.id)}
              className="ops-btn ops-btn-primary px-2 py-1 text-xs"
            >
              {isActive && isSubmitting ? "Retrying…" : "Retry"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={() => onArchive(batch.id)}
              className="ops-btn px-2 py-1 text-xs"
            >
              Archive to review
            </button>
          </>
        ) : null}
      </div>
    </article>
  );
}
