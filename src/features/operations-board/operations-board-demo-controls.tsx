interface OperationsBoardDemoControlsProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

/**
 * Demo action bar — reload / empty / error / reset presets for the showcase.
 */
export function OperationsBoardDemoControls({
  loading,
  onReload,
  onShowEmpty,
  onSimulateError,
  onResetDemo,
}: OperationsBoardDemoControlsProps) {
  return (
    <div className="ops-action-bar" role="group" aria-label="Demo controls">
      <button type="button" onClick={onReload} disabled={loading} className="ops-btn">
        Reload
      </button>
      <button type="button" onClick={onShowEmpty} disabled={loading} className="ops-btn">
        Show empty
      </button>
      <button
        type="button"
        onClick={onSimulateError}
        disabled={loading}
        className="ops-btn"
      >
        Simulate error
      </button>
      <button
        type="button"
        onClick={onResetDemo}
        disabled={loading}
        className="ops-btn ops-btn-primary"
      >
        Reset demo data
      </button>
    </div>
  );
}
