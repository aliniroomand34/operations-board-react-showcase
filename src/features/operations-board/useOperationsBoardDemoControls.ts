/**
 * Demo-only board controls (empty / reset / simulate error / retry).
 * Kept out of the main orchestration hook so production-shaped load logic stays clear.
 */
import { useCallback } from "react";
import {
  resetOperationsBoardMock,
  setOperationsBoardMockFailure,
} from "./operationsBoard.api";

export interface UseOperationsBoardDemoControlsArgs {
  loadBoard: () => Promise<void>;
}

export interface UseOperationsBoardDemoControlsResult {
  handleRetry: () => void;
  handleShowEmpty: () => Promise<void>;
  handleResetDemo: () => Promise<void>;
  handleSimulateError: () => Promise<void>;
}

export function useOperationsBoardDemoControls({
  loadBoard,
}: UseOperationsBoardDemoControlsArgs): UseOperationsBoardDemoControlsResult {
  const handleRetry = useCallback(() => {
    setOperationsBoardMockFailure(false);
    void loadBoard();
  }, [loadBoard]);

  const handleShowEmpty = useCallback(async () => {
    resetOperationsBoardMock("empty");
    await loadBoard();
  }, [loadBoard]);

  const handleResetDemo = useCallback(async () => {
    resetOperationsBoardMock("default");
    await loadBoard();
  }, [loadBoard]);

  const handleSimulateError = useCallback(async () => {
    setOperationsBoardMockFailure(true);
    await loadBoard();
  }, [loadBoard]);

  return {
    handleRetry,
    handleShowEmpty,
    handleResetDemo,
    handleSimulateError,
  };
}
