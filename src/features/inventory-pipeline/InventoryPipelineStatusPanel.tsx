interface InventoryPipelineStatusPanelProps {
  loading: boolean;
  error: string;
  isPipelineEmpty: boolean;
  onRetry: () => void;
  onResetDemo: () => void;
}

export function InventoryPipelineStatusPanel({
  loading,
  error,
  isPipelineEmpty,
  onRetry,
  onResetDemo,
}: InventoryPipelineStatusPanelProps) {
  if (loading) {
    return (
      <p className="ops-empty" role="status">
        Loading inventory pipeline…
      </p>
    );
  }

  if (error) {
    return (
      <div
        className="admin-page-panel rounded-2xl border border-[var(--border-error)]/50 p-5"
        role="alert"
      >
        <p className="text-sm text-[var(--fg-error)]">{error}</p>
        <div className="ops-action-bar mt-4">
          <button type="button" onClick={onRetry} className="ops-btn ops-btn-primary">
            Retry
          </button>
          <button type="button" onClick={onResetDemo} className="ops-btn">
            Reset demo data
          </button>
        </div>
      </div>
    );
  }

  if (isPipelineEmpty) {
    return (
      <div className="admin-page-panel rounded-2xl p-6" role="status">
        <p className="text-sm text-[var(--gray-800)]">
          Pipeline is empty — add catalog items and submit a batch request to
          start the workflow.
        </p>
      </div>
    );
  }

  return null;
}
