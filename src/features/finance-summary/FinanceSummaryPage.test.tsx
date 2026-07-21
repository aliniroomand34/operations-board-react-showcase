/**
 * Finance Summary — smoke render + honesty badge from shared store selectors.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import FinanceSummaryPage from "./FinanceSummaryPage";
import { resetDemoStore, setDemoStoreMockDelay } from "@/mocks/demoStore";

function renderFinance() {
  return render(
    <MemoryRouter>
      <FinanceSummaryPage />
    </MemoryRouter>,
  );
}

describe("FinanceSummaryPage", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    resetDemoStore("default");
  });

  it("shows the synthetic finance honesty badge and KPI values", () => {
    renderFinance();

    expect(
      screen.getByRole("heading", { name: /^Finance Summary$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Demo — synthetic finance/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText("Total amount")).toHaveTextContent("37,200");
    expect(screen.getByLabelText("Successful")).toHaveTextContent("15");
    expect(screen.getByLabelText("Settled")).toHaveTextContent("13");
  });

  it("renders chart section titles from the mock series", () => {
    renderFinance();

    expect(screen.getByText("Volume trend")).toBeInTheDocument();
    expect(screen.getByText("Outcome mix")).toBeInTheDocument();
    expect(screen.getByText("Settlement mix")).toBeInTheDocument();
    expect(screen.getByText("Volume by linked account")).toBeInTheDocument();
  });
});
