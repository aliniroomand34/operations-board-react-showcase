/**
 * Shared demo store preset controls — default / empty / error + mock API failure.
 * Used by Overview, Operations Board, Inventory Pipeline, and Extension Sim surfaces.
 */
import { useCallback } from "react";
import {
  resetDemoStore,
  setDemoStoreMockFailure,
  type DemoStorePreset,
} from "@/mocks/demoStore";

export interface UseDemoStoreControlsArgs {
  /** Called after a preset or failure flag change (e.g. reload feature data). */
  onAfterChange?: () => void | Promise<void>;
  /** Clears feature-local error UI when applying a preset. */
  onClearError?: () => void;
}

export interface UseDemoStoreControlsResult {
  handleShowEmpty: () => Promise<void>;
  handleShowErrorPreset: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
  handleRetry: () => Promise<void>;
}

export function useDemoStoreControls({
  onAfterChange,
  onClearError,
}: UseDemoStoreControlsArgs = {}): UseDemoStoreControlsResult {
  const applyPreset = useCallback(
    async (preset: DemoStorePreset) => {
      setDemoStoreMockFailure(false);
      resetDemoStore(preset);
      onClearError?.();
      await onAfterChange?.();
    },
    [onAfterChange, onClearError],
  );

  const handleShowEmpty = useCallback(
    () => applyPreset("empty"),
    [applyPreset],
  );

  const handleShowErrorPreset = useCallback(
    () => applyPreset("error"),
    [applyPreset],
  );

  const handleResetDemo = useCallback(
    () => applyPreset("default"),
    [applyPreset],
  );

  const handleSimulateError = useCallback(async () => {
    setDemoStoreMockFailure(true);
    onClearError?.();
    await onAfterChange?.();
  }, [onAfterChange, onClearError]);

  const handleRetry = useCallback(async () => {
    setDemoStoreMockFailure(false);
    onClearError?.();
    await onAfterChange?.();
  }, [onAfterChange, onClearError]);

  return {
    handleShowEmpty,
    handleShowErrorPreset,
    handleResetDemo,
    handleSimulateError,
    handleRetry,
  };
}
