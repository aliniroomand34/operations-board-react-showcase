import { OperationsBoardDemoControls } from "./operations-board-demo-controls";

interface OperationsBoardPageHeaderProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

/**
 * Feature header — title, context copy, workflow strip, and demo controls.
 */
export function OperationsBoardPageHeader({
  loading,
  onReload,
  onShowEmpty,
  onSimulateError,
  onResetDemo,
}: OperationsBoardPageHeaderProps) {
  return (
    <header className="ops-panel flex flex-wrap items-start justify-between gap-4 rounded-xl p-4 sm:p-5">
      <div className="min-w-0 flex-1 space-y-2.5">
        <div className="ops-workflow-strip">
          <span className="ops-status-badge">Frontend projection</span>
          <span className="ops-status-badge ops-status-badge--ready">Mock API</span>
          <span className="ops-status-badge ops-status-badge--done">Synthetic data</span>
        </div>
        <h1
          id="operations-board-heading"
          className="text-2xl font-bold tracking-wide text-[var(--fg)]"
        >
          Operations Board
        </h1>
        <p
          id="operations-board-description"
          className="max-w-2xl text-sm leading-relaxed text-[var(--gray-800)]"
        >
          Frontend projection of a larger private workflow — not the full system.
          Automation intake, operator extensions, backend services, and Redis /
          realtime coordination are documented production context; this page runs
          on an in-memory mock API with synthetic data. Drag a ready batch onto a
          queued client, or open a client and use Assign batches for a keyboard path.
        </p>
        <div className="ops-workflow-strip pt-0.5 text-[10px] text-[var(--gray-800)]">
          <span className="ops-status-badge ops-status-badge--queued">Queued</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--ready">Ready</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--progress">In progress</span>
          <span aria-hidden>→</span>
          <span className="ops-status-badge ops-status-badge--done">Completed</span>
        </div>
      </div>

      <OperationsBoardDemoControls
        loading={loading}
        onReload={onReload}
        onShowEmpty={onShowEmpty}
        onSimulateError={onSimulateError}
        onResetDemo={onResetDemo}
      />
    </header>
  );
}
