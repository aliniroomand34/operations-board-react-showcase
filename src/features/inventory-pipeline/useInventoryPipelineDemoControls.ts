/**
 * Demo action presets for the Inventory Pipeline mock API.
 * Resets the full shared store so board, overview, and extension sim stay aligned.
 */
import { useDemoStoreControls } from "@/hooks/useDemoStoreControls";

export interface UseInventoryPipelineDemoControlsArgs {
  reload: () => Promise<void>;
  setError: (message: string) => void;
}

export interface UseInventoryPipelineDemoControlsResult {
  handleShowEmpty: () => Promise<void>;
  handleShowErrorPreset: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
}

export function useInventoryPipelineDemoControls({
  reload,
  setError,
}: UseInventoryPipelineDemoControlsArgs): UseInventoryPipelineDemoControlsResult {
  return useDemoStoreControls({
    onAfterChange: reload,
    onClearError: () => setError(""),
  });
}
