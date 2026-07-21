import type { AcquisitionItemProgress, AcquisitionStep } from "@/mocks/demoStore.types";
import { stepStatusLabel } from "./extensionAcquisitionSim.presentation";

interface ExtensionAcquisitionSimTimelineProps {
  steps: AcquisitionStep[];
  itemProgress: AcquisitionItemProgress[];
}

function stepBadgeClass(status: AcquisitionStep["status"]): string {
  switch (status) {
    case "running":
      return "ops-status-badge ops-status-badge--progress";
    case "success":
      return "ops-status-badge ops-status-badge--done";
    case "failed":
      return "ops-status-badge ops-status-badge--queued";
    case "paused":
      return "ops-status-badge";
    default:
      return "ops-status-badge";
  }
}

function itemBadgeClass(status: AcquisitionItemProgress["status"]): string {
  switch (status) {
    case "running":
      return "ops-status-badge ops-status-badge--progress";
    case "success":
      return "ops-status-badge ops-status-badge--done";
    case "failed":
      return "ops-status-badge ops-status-badge--queued";
    default:
      return "ops-status-badge";
  }
}

/**
 * Simulated step timeline with per-SKU acquire progress.
 */
export function ExtensionAcquisitionSimTimeline({
  steps,
  itemProgress,
}: ExtensionAcquisitionSimTimelineProps) {
  return (
    <section
      className="admin-page-panel rounded-2xl p-5 sm:p-6"
      aria-labelledby="sim-timeline-heading"
    >
      <h2
        id="sim-timeline-heading"
        className="text-lg font-semibold text-[var(--fg)]"
      >
        Simulated acquisition timeline
      </h2>

      <ol className="mt-4 space-y-3" aria-label="Acquisition steps">
        {steps.map((step, index) => (
          <li
            key={step.id}
            className="rounded-xl border border-[var(--gray-400)] bg-[var(--bg-subtle)] p-4"
          >
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-xs text-[var(--gray-500)]">Step {index + 1}</p>
                <p className="font-medium text-[var(--gray-900)]">{step.label}</p>
                {step.detail ? (
                  <p className="mt-1 text-sm text-[var(--gray-800)]">{step.detail}</p>
                ) : null}
              </div>
              <span className={stepBadgeClass(step.status)}>
                {stepStatusLabel(step.status)}
              </span>
            </div>

            {step.id === "acquire-items" && itemProgress.length > 0 ? (
              <ul
                className="mt-3 space-y-2 border-t border-[var(--gray-400)] pt-3"
                aria-label="Catalog item acquire progress"
              >
                {itemProgress.map((item) => (
                  <li
                    key={item.skuId}
                    className="flex flex-wrap items-center justify-between gap-2 text-sm"
                  >
                    <span className="text-[var(--gray-900)]">
                      {item.skuLabel}{" "}
                      <span className="font-mono text-[var(--gray-500)]">
                        ({item.skuId})
                      </span>
                    </span>
                    <span className="flex items-center gap-2">
                      <span className="text-[var(--gray-800)]">
                        {item.acquired}/{item.quantity}
                      </span>
                      <span className={itemBadgeClass(item.status)}>
                        {stepStatusLabel(item.status)}
                      </span>
                    </span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
