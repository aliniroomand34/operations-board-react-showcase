/**
 * Overview dashboard — live KPI + store-derived charts/tables.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { act, fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import OverviewPage from "./OverviewPage";
import { advancePipelineBatch } from "@/features/inventory-pipeline/inventoryPipeline.api";
import {
  resetDemoStore,
  setDemoStoreMockDelay,
} from "@/mocks/demoStore";

function renderOverview() {
  return render(
    <MemoryRouter>
      <OverviewPage />
    </MemoryRouter>,
  );
}

function tableValue(sectionTitle: string, rowLabel: string): string {
  const heading = screen.getByRole("heading", { name: sectionTitle });
  const section = heading.closest("section");
  if (!section) return "";
  const row = within(section).getByText(rowLabel).closest("tr");
  if (!row) return "";
  const cells = row.querySelectorAll("td");
  return cells[cells.length - 1]?.textContent?.trim() ?? "";
}

describe("OverviewPage", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    resetDemoStore("default");
  });

  it("shows live KPI values from the shared demo store", () => {
    renderOverview();

    expect(screen.getByLabelText("Queued operations")).toHaveTextContent("2");
    expect(screen.getByLabelText("Ready batches")).toHaveTextContent("2");
    expect(screen.getByLabelText("In progress")).toHaveTextContent("1");
    expect(screen.getByLabelText("Linked accounts online")).toHaveTextContent("2");
  });

  it("updates KPIs when the error preset is applied from demo controls", () => {
    renderOverview();

    fireEvent.click(screen.getByRole("button", { name: /Error preset/i }));

    expect(screen.getByLabelText("Queued operations")).toHaveTextContent("3");
    expect(screen.getByLabelText("Ready batches")).toHaveTextContent("0");
    expect(screen.getByLabelText("Linked accounts online")).toHaveTextContent("1");
  });

  it("renders Recharts panel titles and summary tables from the store", () => {
    renderOverview();

    expect(screen.getByRole("heading", { name: /Client mix/i })).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Batches by column/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Linked account capacity/i }),
    ).toBeInTheDocument();

    expect(tableValue("Client status", "Queued")).toBe("2");
    expect(tableValue("Pipeline columns", "Acquiring")).toBe("1");
    expect(tableValue("Linked accounts", "Linked Account 001")).toBe("1200");
  });

  it("links to Operations Board and Inventory Pipeline", () => {
    renderOverview();

    expect(
      screen.getByRole("link", { name: /Operations Board/i }),
    ).toHaveAttribute("href", "/app/operations");
    expect(
      screen.getByRole("link", { name: /Inventory Pipeline/i }),
    ).toHaveAttribute("href", "/app/inventory");
  });

  it("updates pipeline table counts after pipeline mutations", async () => {
    renderOverview();

    expect(tableValue("Pipeline columns", "Acquiring")).toBe("1");

    await act(async () => {
      await advancePipelineBatch("batch-pipe-001");
    });

    await waitFor(() => {
      expect(tableValue("Pipeline columns", "Packaging")).toBe("1");
      expect(tableValue("Pipeline columns", "Acquiring")).toBe("0");
    });
  });
});
