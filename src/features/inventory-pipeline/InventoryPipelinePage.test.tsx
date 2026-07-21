/**
 * Integration (RTL) tests for Inventory Pipeline user-visible behavior.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import InventoryPipelinePage from "./InventoryPipelinePage";
import {
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
} from "./inventoryPipeline.api";

function renderPipeline() {
  return render(
    <MemoryRouter initialEntries={["/app/inventory"]}>
      <InventoryPipelinePage />
    </MemoryRouter>,
  );
}

function resetPipelineMock() {
  setDemoStoreMockDelay(0);
  setDemoStoreMockFailure(false);
  resetDemoStore("default");
}

describe("InventoryPipelinePage — load and catalog", () => {
  beforeEach(resetPipelineMock);

  it("renders catalog and pipeline columns after load", async () => {
    renderPipeline();

    await waitFor(() => {
      expect(screen.getByLabelText("Pipeline columns")).toBeInTheDocument();
    });

    expect(screen.getByText("Allowed catalog")).toBeInTheDocument();
    expect(screen.getByText("Catalog Item A")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Acquiring" })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Ready" })).toBeInTheDocument();
  });

  it("shows loading status while fetching", async () => {
    setDemoStoreMockDelay(80);
    renderPipeline();

    expect(screen.getByRole("status")).toHaveTextContent(
      /Loading inventory pipeline/i,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Pipeline columns")).toBeInTheDocument();
    });
  });

  it("shows an error alert and recovers after Retry", async () => {
    setDemoStoreMockFailure(true);
    renderPipeline();

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(/Mock API failure/i);

    setDemoStoreMockFailure(false);
    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));

    await waitFor(() => {
      expect(screen.getByLabelText("Pipeline columns")).toBeInTheDocument();
    });
  });

  it("shows an empty pipeline status when the empty preset is loaded", async () => {
    resetDemoStore("empty");
    renderPipeline();

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Pipeline is empty/i);
    });
    expect(screen.queryByLabelText("Pipeline columns")).not.toBeInTheDocument();
  });
});
