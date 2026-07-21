/**
 * Team Activity — smoke render + honesty badge from shared store selectors.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import TeamActivityPage from "./TeamActivityPage";
import { resetDemoStore, setDemoStoreMockDelay } from "@/mocks/demoStore";

function renderTeam() {
  return render(
    <MemoryRouter>
      <TeamActivityPage />
    </MemoryRouter>,
  );
}

describe("TeamActivityPage", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    resetDemoStore("default");
  });

  it("shows the synthetic team honesty badge and org graph", () => {
    renderTeam();

    expect(
      screen.getByRole("heading", { name: /^Team Activity$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByText(/Demo — synthetic team/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByText("4 members")).toBeInTheDocument();
    expect(screen.getAllByText("Operator 001").length).toBeGreaterThan(0);
    expect(screen.getByText("Owner")).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: /Team organization graph/i }),
    ).toBeInTheDocument();
  });

  it("renders recent activity including live store-derived rows", () => {
    renderTeam();

    expect(
      screen.getByRole("heading", { name: /Recent activity/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Acquisition in progress")).toBeInTheDocument();
    expect(screen.getByText("Assigned batch")).toBeInTheDocument();
  });
});
