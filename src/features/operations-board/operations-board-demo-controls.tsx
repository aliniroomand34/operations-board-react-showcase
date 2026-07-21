import { DemoStoreControls } from "@/components/DemoStoreControls";

interface OperationsBoardDemoControlsProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onShowErrorPreset: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

/**
 * Demo action bar — reload / empty / error preset / mock failure / reset.
 */
export function OperationsBoardDemoControls({
  loading,
  onReload,
  onShowEmpty,
  onShowErrorPreset,
  onSimulateError,
  onResetDemo,
}: OperationsBoardDemoControlsProps) {
  return (
    <DemoStoreControls
      loading={loading}
      onReload={onReload}
      onShowEmpty={onShowEmpty}
      onShowErrorPreset={onShowErrorPreset}
      onSimulateError={onSimulateError}
      onResetDemo={onResetDemo}
    />
  );
}
