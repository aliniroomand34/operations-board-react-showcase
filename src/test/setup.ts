import "@testing-library/jest-dom/vitest";
import { createElement, type ReactNode } from "react";
import { afterEach, beforeEach, vi } from "vitest";
import {
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
} from "@/mocks/demoStore";

/** Recharts ResponsiveContainer needs ResizeObserver in jsdom. */
class ResizeObserverStub {
  observe(): void {}
  unobserve(): void {}
  disconnect(): void {}
}

if (typeof globalThis.ResizeObserver === "undefined") {
  globalThis.ResizeObserver = ResizeObserverStub;
}

/** Avoid zero-size ResponsiveContainer warnings under jsdom. */
vi.mock("recharts", async (importOriginal) => {
  const actual = await importOriginal<typeof import("recharts")>();
  return {
    ...actual,
    ResponsiveContainer: ({
      children,
      height = 200,
    }: {
      children?: ReactNode;
      height?: number | string;
    }) =>
      createElement(
        "div",
        {
          "data-testid": "recharts-responsive",
          style: {
            width: 320,
            height: typeof height === "number" ? height : 200,
          },
        },
        children,
      ),
  };
});

/** Shared in-memory store — reset between tests to avoid cross-file pollution. */
function resetSharedDemoRuntime(): void {
  setDemoStoreMockDelay(0);
  setDemoStoreMockFailure(false);
  resetDemoStore("default");
}

beforeEach(() => {
  resetSharedDemoRuntime();
});

afterEach(() => {
  resetSharedDemoRuntime();
});
