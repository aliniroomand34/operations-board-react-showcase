import { Link } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";
import { ExtensionAcquisitionSimControls } from "./ExtensionAcquisitionSimControls";
import { ExtensionAcquisitionSimHonestyBanner } from "./ExtensionAcquisitionSimHonestyBanner";
import { ExtensionAcquisitionSimJobSummary } from "./ExtensionAcquisitionSimJobSummary";
import { ExtensionAcquisitionSimTimeline } from "./ExtensionAcquisitionSimTimeline";
import { useExtensionAcquisitionSimLogic } from "./useExtensionAcquisitionSimLogic";

/**
 * Extension Acquisition Simulator — in-app stand-in for production operator extension flow.
 */
export default function ExtensionAcquisitionSimPage() {
  const {
    jobId,
    job,
    loading,
    error,
    isBusy,
    handleStart,
    handlePause,
    handleResume,
    handleForceError,
    handleRetryFailed,
    handleRetryLoad,
  } = useExtensionAcquisitionSimLogic();

  const hasFailedItems =
    job?.itemProgress.some((item) => item.status === "failed") ?? false;

  return (
    <section
      className="flex flex-col gap-5"
      aria-labelledby="extension-sim-heading"
    >
      <header className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Interactive demo</p>
          <h1 id="extension-sim-heading" className="admin-page-title">
            Extension Acquisition Simulator
          </h1>
          <p className="admin-page-subtitle">
            Simulates operator extension acquisition from Inventory Pipeline batch
            requests — paced steps, synthetic success/fail, shared mock store.
          </p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">Demo</span>
      </header>

      <ExtensionAcquisitionSimHonestyBanner />

      {!jobId ? (
        <div className="admin-page-panel rounded-2xl p-6 sm:p-8">
          <p className="text-sm leading-relaxed text-[var(--gray-800)]">
            No acquisition job selected. Submit a batch request from the Inventory
            Pipeline to open this simulator with bound form data, or load the seed
            demo job.
          </p>
          <nav className="mt-5 flex flex-wrap gap-3" aria-label="Related routes">
            <Link
              to={`${ADMIN_DEMO_BASE}/inventory`}
              className="ops-btn ops-btn-primary px-4 py-2 text-sm"
            >
              Inventory Pipeline
            </Link>
            <Link
              to={`${ADMIN_DEMO_BASE}/extension-sim?job=job-001`}
              className="ops-btn px-4 py-2 text-sm"
            >
              Load seed job job-001
            </Link>
          </nav>
        </div>
      ) : null}

      {jobId && loading ? (
        <p role="status" className="text-sm text-[var(--gray-800)]">
          Loading acquisition job…
        </p>
      ) : null}

      {jobId && error ? (
        <div role="alert" className="admin-page-panel rounded-2xl p-5">
          <p className="text-sm text-[var(--fg-error)]">{error}</p>
          <button
            type="button"
            className="ops-btn mt-3 px-4 py-2 text-sm"
            onClick={handleRetryLoad}
          >
            Retry
          </button>
        </div>
      ) : null}

      {job ? (
        <>
          {job.status === "completed" ? (
            <p role="status" className="text-sm text-[var(--fg-success)]">
              Acquisition complete — batch moved to Ready in the pipeline store.
            </p>
          ) : null}
          {job.status === "failed" ? (
            <p role="status" className="text-sm text-[var(--fg-error)]">
              Acquisition failed — batch moved to Problem in the pipeline store.
            </p>
          ) : null}

          <ExtensionAcquisitionSimControls
            jobStatus={job.status}
            isBusy={isBusy}
            hasFailedItems={hasFailedItems}
            onStart={() => void handleStart()}
            onPause={() => void handlePause()}
            onResume={() => void handleResume()}
            onForceError={() => void handleForceError()}
            onRetryFailed={() => void handleRetryFailed()}
          />

          <ExtensionAcquisitionSimJobSummary job={job} />
          <ExtensionAcquisitionSimTimeline
            steps={job.steps}
            itemProgress={job.itemProgress}
          />
        </>
      ) : null}
    </section>
  );
}
