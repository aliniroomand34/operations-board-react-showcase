import { DemoStoreControls } from "@/components/DemoStoreControls";

interface InventoryPipelineDemoControlsProps {
  loading: boolean;
  onReload: () => void;
  onShowEmpty: () => void;
  onShowErrorPreset: () => void;
  onSimulateError: () => void;
  onResetDemo: () => void;
}

export function InventoryPipelineDemoControls({
  loading,
  onReload,
  onShowEmpty,
  onShowErrorPreset,
  onSimulateError,
  onResetDemo,
}: InventoryPipelineDemoControlsProps) {
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
