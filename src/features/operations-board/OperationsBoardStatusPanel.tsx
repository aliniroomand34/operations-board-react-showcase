interface OperationsBoardStatusPanelProps {
  loading: boolean;
  error: string;
  isBoardEmpty: boolean;
  onRetry: () => void;
  onResetDemo: () => void;
}

/**
 * Loading / error / empty presentation for the board — hidden from page orchestration.
 */
export function OperationsBoardStatusPanel({
  loading,
  error,
  isBoardEmpty,
  onRetry,
  onResetDemo,
}: OperationsBoardStatusPanelProps) {
  if (loading) {
    return (
      <div
        className="ops-panel flex items-center gap-3 rounded-xl px-4 py-4"
        role="status"
        aria-live="polite"
        aria-busy="true"
      >
        <span
          className="inline-block h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-[var(--fg)] border-t-transparent"
          aria-hidden
        />
        <div>
          <p className="text-sm font-semibold text-[var(--fg)]">
            Loading operations board…
          </p>
          <p className="mt-0.5 text-xs text-[var(--gray-800)]">
            Fetching synthetic data from the mock API.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div
        className="ops-panel rounded-xl border-[var(--border-error)]/45 px-4 py-4 text-sm"
        role="alert"
        aria-live="assertive"
      >
        <p className="font-semibold text-[var(--fg-error)]">Could not load the board</p>
        <p className="mt-1 text-[var(--gray-800)]">{error}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={onRetry} className="ops-btn ops-btn-primary">
            Retry
          </button>
          <button type="button" onClick={onResetDemo} className="ops-btn ops-btn-danger">
            Reset demo data
          </button>
        </div>
      </div>
    );
  }

  if (isBoardEmpty) {
    return (
      <div
        className="ops-panel rounded-xl px-4 py-10 text-center"
        role="status"
        aria-live="polite"
      >
        <p className="text-sm font-semibold text-[var(--fg)]">Board is empty</p>
        <p className="mx-auto mt-2 max-w-md text-sm text-[var(--gray-800)]">
          There are no queued, in-progress, or completed operations, and no ready
          batches. Restore the synthetic dataset to continue the demo.
        </p>
        <button
          type="button"
          onClick={onResetDemo}
          className="ops-btn ops-btn-primary mt-4 px-4 py-2"
        >
          Reset demo data
        </button>
      </div>
    );
  }

  return null;
}
