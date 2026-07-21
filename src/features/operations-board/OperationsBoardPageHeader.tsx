import { OperationsBoardDemoControls } from "./OperationsBoardDemoControls";

interface OperationsBoardPageHeaderProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onShowErrorPreset: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

/**
 * Feature header — admin shell page chrome, workflow strip, and demo controls.
 */
export function OperationsBoardPageHeader({
  loading,
  onReload,
  onShowEmpty,
  onShowErrorPreset,
  onSimulateError,
  onResetDemo,
}: OperationsBoardPageHeaderProps) {
  return (
    <header className="admin-page-header">
      <div className="min-w-0 flex-1 space-y-2.5">
        <p className="admin-page-kicker">Operations workflow</p>
        <h1 id="operations-board-heading" className="admin-page-title">
          Operations Board
        </h1>
        <p
          id="operations-board-description"
          className="admin-page-subtitle"
        >
          Assign ready inventory batches to queued client operations, track
          in-progress work, and complete requests — all on an in-memory mock
          API with synthetic data. Drag a ready batch onto a queued client, or
          open a client card for keyboard-friendly assignment.
        </p>
        <div className="ops-workflow-strip pt-0.5">
          <span className="ops-status-badge ops-status-badge--queued">Queued</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--ready">Ready</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--progress">
            In progress
          </span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--done">Completed</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-3">
        <span className="ops-status-badge ops-status-badge--ready">Interactive mock</span>
        <OperationsBoardDemoControls
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
