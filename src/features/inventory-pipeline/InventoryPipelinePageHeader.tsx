import { InventoryPipelineDemoControls } from "./InventoryPipelineDemoControls";

interface InventoryPipelinePageHeaderProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onShowErrorPreset: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
  onOpenBatchForm: () => void;
}

export function InventoryPipelinePageHeader({
  loading,
  onReload,
  onShowEmpty,
  onShowErrorPreset,
  onSimulateError,
  onResetDemo,
  onOpenBatchForm,
}: InventoryPipelinePageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="admin-page-kicker">Inventory intake</p>
        <h1 id="inventory-pipeline-heading" className="admin-page-title">
          Inventory Pipeline
        </h1>
        <p id="inventory-pipeline-description" className="admin-page-subtitle">
          Manage the allowed catalog, submit batch requests against linked
          accounts, and track batches through acquisition and packaging before
          handoff to the Operations Board — all on an in-memory mock API.
        </p>
        <div className="ops-workflow-strip pt-0.5">
          <span className="ops-status-badge ops-status-badge--queued">Acquiring</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--progress">Packaging</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--ready">Ready</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--done">Board handoff</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span className="ops-status-badge ops-status-badge--ready">Interactive mock</span>
        <button
          type="button"
          onClick={onOpenBatchForm}
          disabled={loading}
          className="ops-btn ops-btn-primary"
        >
          New batch request
        </button>
        <InventoryPipelineDemoControls
          loading={loading}
          onReload={onReload}
          onShowEmpty={onShowEmpty}
          onShowErrorPreset={onShowErrorPreset}
          onSimulateError={onSimulateError}
          onResetDemo={onResetDemo}
        />
      </div>
    </header>
  );
}
