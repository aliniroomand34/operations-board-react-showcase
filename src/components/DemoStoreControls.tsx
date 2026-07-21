/**
 * Shared recruiter demo controls — presets and mock API failure across features.
 */
interface DemoStoreControlsProps {
  loading?: boolean;
  onReload?: () => void;
  onShowEmpty: () => void;
  onShowErrorPreset: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

export function DemoStoreControls({
  loading = false,
  onReload,
  onShowEmpty,
  onShowErrorPreset,
  onSimulateError,
  onResetDemo,
}: DemoStoreControlsProps) {
  return (
    <div className="ops-action-bar" role="group" aria-label="Demo store controls">
      {onReload ? (
        <button type="button" onClick={onReload} disabled={loading} className="ops-btn">
          Reload
        </button>
      ) : null}
      <button type="button" onClick={onShowEmpty} disabled={loading} className="ops-btn">
        Show empty
      </button>
      <button
        type="button"
        onClick={onShowErrorPreset}
        disabled={loading}
        className="ops-btn"
      >
        Error preset
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
