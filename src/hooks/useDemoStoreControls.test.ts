/**
 * Shared demo store preset controls.
 */
import { beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useDemoStoreControls } from "@/hooks/useDemoStoreControls";
import {
  getDemoOverviewMetrics,
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
} from "@/mocks/demoStore";

describe("useDemoStoreControls", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    setDemoStoreMockFailure(false);
    resetDemoStore("default");
  });

  it("applies empty, error, and default presets through the shared store", async () => {
    const onAfterChange = vi.fn(async () => undefined);
    const { result } = renderHook(() =>
      useDemoStoreControls({ onAfterChange }),
    );

    await act(async () => {
      await result.current.handleShowEmpty();
    });
    expect(getDemoOverviewMetrics().queuedOperations).toBe(0);

    await act(async () => {
      await result.current.handleShowErrorPreset();
    });
    expect(getDemoOverviewMetrics()).toMatchObject({
      queuedOperations: 3,
      readyBatches: 0,
      linkedAccountsOnline: 1,
    });

    await act(async () => {
      await result.current.handleResetDemo();
    });
    expect(getDemoOverviewMetrics().queuedOperations).toBe(2);
    expect(onAfterChange).toHaveBeenCalledTimes(3);
  });

  it("toggles mock API failure independently from presets", async () => {
    const { result } = renderHook(() => useDemoStoreControls());

    await act(async () => {
      await result.current.handleSimulateError();
    });

    await expect(async () => {
      const { getDemoStoreSnapshot } = await import("@/mocks/demoStore");
      await getDemoStoreSnapshot();
    }).rejects.toMatchObject({ code: "MOCK_API_FAILURE" });

    await act(async () => {
      await result.current.handleRetry();
    });

    const { getDemoStoreSnapshot } = await import("@/mocks/demoStore");
    await expect(getDemoStoreSnapshot()).resolves.toBeDefined();
  });
});
