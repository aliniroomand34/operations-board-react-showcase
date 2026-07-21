import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import DemoUnavailablePanel from "@/components/DemoUnavailablePanel";

describe("DemoUnavailablePanel", () => {
  it("explains the portfolio boundary and links to interactive demos", () => {
    render(
      <MemoryRouter>
        <DemoUnavailablePanel title="Clients" />
      </MemoryRouter>,
    );

    expect(screen.getByRole("heading", { name: /^Clients$/i })).toBeInTheDocument();
    expect(
      screen.getByText(/Not available in this demo version/i),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /Operations Board/i })).toHaveAttribute(
      "href",
      "/app/operations",
    );
    expect(screen.getByRole("link", { name: /Inventory Pipeline/i })).toHaveAttribute(
      "href",
      "/app/inventory",
    );
  });
});
