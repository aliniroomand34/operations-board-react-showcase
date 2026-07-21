import { Link } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";
import type { AcquisitionJobStatus } from "@/mocks/demoStore.types";

interface ExtensionAcquisitionSimControlsProps {
  jobStatus: AcquisitionJobStatus;
  isBusy: boolean;
  hasFailedItems: boolean;
  onStart: () => void;
  onPause: () => void;
  onResume: () => void;
  onForceError: () => void;
  onRetryFailed: () => void;
}

/**
 * Start / pause / retry / force-error demo controls.
 */
export function ExtensionAcquisitionSimControls({
  jobStatus,
  isBusy,
  hasFailedItems,
  onStart,
  onPause,
  onResume,
  onForceError,
  onRetryFailed,
}: ExtensionAcquisitionSimControlsProps) {
  const isTerminal = jobStatus === "completed" || jobStatus === "failed";
  const canStart = jobStatus === "pending";
  const canPause = jobStatus === "running";
  const canResume = jobStatus === "paused";
  const canForceError =
    jobStatus === "running" || jobStatus === "paused" || jobStatus === "pending";

  return (
    <div
      className="flex flex-wrap items-center gap-3"
      role="toolbar"
      aria-label="Simulator controls"
    >
      {canStart ? (
        <button
          type="button"
          className="ops-btn ops-btn-primary px-4 py-2 text-sm"
          disabled={isBusy}
          onClick={onStart}
        >
          Start simulation
        </button>
      ) : null}

      {canPause ? (
        <button
          type="button"
          className="ops-btn px-4 py-2 text-sm"
          disabled={isBusy}
          onClick={onPause}
        >
          Pause
        </button>
      ) : null}

      {canResume ? (
        <button
          type="button"
          className="ops-btn ops-btn-primary px-4 py-2 text-sm"
          disabled={isBusy}
          onClick={onResume}
        >
          Resume
        </button>
      ) : null}

      {hasFailedItems ? (
        <button
          type="button"
          className="ops-btn px-4 py-2 text-sm"
          disabled={isBusy}
          onClick={onRetryFailed}
        >
          Retry failed item
        </button>
      ) : null}

      {canForceError && !isTerminal ? (
        <button
          type="button"
          className="ops-btn ops-btn-danger px-4 py-2 text-sm"
          disabled={isBusy}
          onClick={onForceError}
        >
          Force error
        </button>
      ) : null}

      <Link
        to={`${ADMIN_DEMO_BASE}/inventory`}
        className="ops-btn px-4 py-2 text-sm"
      >
        Back to Inventory Pipeline
      </Link>
    </div>
  );
}
