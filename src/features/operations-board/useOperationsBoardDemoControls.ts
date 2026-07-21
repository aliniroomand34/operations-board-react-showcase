/**
 * Demo-only board controls (empty / error preset / reset / simulate error / retry).
 * Uses the shared demo store so Overview and Pipeline stay in sync.
 */
import { useDemoStoreControls } from "@/hooks/useDemoStoreControls";

export interface UseOperationsBoardDemoControlsArgs {
  loadBoard: () => Promise<void>;
}

export interface UseOperationsBoardDemoControlsResult {
  handleRetry: () => void;
  handleShowEmpty: () => Promise<void>;
  handleShowErrorPreset: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
}

export function useOperationsBoardDemoControls({
  loadBoard,
}: UseOperationsBoardDemoControlsArgs): UseOperationsBoardDemoControlsResult {
  const controls = useDemoStoreControls({ onAfterChange: loadBoard });

  return {
    handleRetry: () => {
      void controls.handleRetry();
    },
    handleShowEmpty: controls.handleShowEmpty,
    handleShowErrorPreset: controls.handleShowErrorPreset,
    handleResetDemo: controls.handleResetDemo,
    handleSimulateError: controls.handleSimulateError,
  };
}
