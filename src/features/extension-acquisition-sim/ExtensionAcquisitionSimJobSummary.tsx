import type { AcquisitionJob } from "@/mocks/demoStore.types";

interface ExtensionAcquisitionSimJobSummaryProps {
  job: AcquisitionJob;
}

/**
 * Echoes the batch request payload bound to this acquisition job.
 */
export function ExtensionAcquisitionSimJobSummary({
  job,
}: ExtensionAcquisitionSimJobSummaryProps) {
  const { payload } = job;

  return (
    <section
      className="admin-page-panel rounded-2xl p-5 sm:p-6"
      aria-labelledby="job-summary-heading"
    >
      <h2
        id="job-summary-heading"
        className="text-lg font-semibold text-[var(--fg)]"
      >
        Job summary
      </h2>
      <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
        <div>
          <dt className="text-[var(--gray-500)]">Job ID</dt>
          <dd className="font-mono text-[var(--gray-900)]">{job.id}</dd>
        </div>
        <div>
          <dt className="text-[var(--gray-500)]">Batch ID</dt>
          <dd className="font-mono text-[var(--gray-900)]">{job.batchId}</dd>
        </div>
        <div>
          <dt className="text-[var(--gray-500)]">Linked accounts</dt>
          <dd className="text-[var(--gray-900)]">
            {payload.linkedAccountIds.join(", ")}
          </dd>
        </div>
        <div>
          <dt className="text-[var(--gray-500)]">Mode</dt>
          <dd className="capitalize text-[var(--gray-900)]">{payload.mode}</dd>
        </div>
        <div>
          <dt className="text-[var(--gray-500)]">Target price</dt>
          <dd className="text-[var(--gray-900)]">{payload.targetPrice}</dd>
        </div>
        <div>
          <dt className="text-[var(--gray-500)]">Publish window</dt>
          <dd className="text-[var(--gray-900)]">
            {payload.publishWindowHours}h
          </dd>
        </div>
      </dl>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-[var(--fg-muted)]">
          Catalog line items
        </h3>
        <ul className="mt-2 space-y-2">
          {payload.lineItems.map((line) => (
            <li
              key={line.skuId}
              className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-[var(--gray-400)] bg-[var(--bg-subtle)] px-3 py-2 text-sm"
            >
              <span className="font-mono text-[var(--gray-900)]">{line.skuId}</span>
              <span className="text-[var(--gray-800)]">{line.skuLabel}</span>
              <span className="ops-status-badge">Qty {line.quantity}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
