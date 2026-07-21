/**
 * Route shell tests — admin layout, overview, board, stubs, redirects, 404.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { showcaseRoutes } from "@/routes/showcaseRoutes";
import {
  resetDemoStore,
  setDemoStoreMockDelay,
  setDemoStoreMockFailure,
} from "@/mocks/demoStore";

function renderAt(path: string) {
  const router = createMemoryRouter(showcaseRoutes, {
    initialEntries: [path],
  });
  return render(<RouterProvider router={router} />);
}

describe("showcase routes", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    setDemoStoreMockFailure(false);
    resetDemoStore("default");
  });

  it("redirects / to the Overview dashboard in the admin shell", async () => {
    renderAt("/");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^Overview$/i }),
      ).toBeInTheDocument();
    });
    expect(screen.getByLabelText("Queued operations")).toHaveTextContent("2");
    expect(screen.getAllByText(/Ops Console Demo/i).length).toBeGreaterThan(0);
    expect(
      screen.getByRole("complementary", { name: /Admin demo navigation/i }),
    ).toBeInTheDocument();
  });

  it("redirects legacy /operations to /app/operations", async () => {
    renderAt("/operations");

    await waitFor(() => {
      expect(screen.getByLabelText("Board columns")).toBeInTheDocument();
    });
  });

  it("renders the Operations Board at /app/operations", async () => {
    renderAt("/app/operations");

    await waitFor(() => {
      expect(screen.getByLabelText("Board columns")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /^Operations Board$/i }),
    ).toBeInTheDocument();
  });

  it("renders Inventory Pipeline at /app/inventory", async () => {
    renderAt("/app/inventory");

    await waitFor(() => {
      expect(screen.getByLabelText("Pipeline columns")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /^Inventory Pipeline$/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("Allowed catalog")).toBeInTheDocument();
  });

  it("renders Extension Simulator at /app/extension-sim", async () => {
    renderAt("/app/extension-sim?job=job-001");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", {
          name: /Extension Acquisition Simulator/i,
        }),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/static demo simulation/i)).toBeInTheDocument();
    expect(screen.getByText("job-001")).toBeInTheDocument();
  });

  it("navigates from Inventory Pipeline form submit to Extension Simulator", async () => {
    renderAt("/app/inventory");

    await waitFor(() => {
      expect(screen.getByLabelText("Pipeline columns")).toBeInTheDocument();
    });

    fireEvent.click(
      screen.getByRole("button", { name: /New batch request/i }),
    );

    await waitFor(() => {
      expect(screen.getByRole("dialog")).toBeInTheDocument();
    });

    const submitButton = screen.getByRole("button", {
      name: /Submit & open simulator/i,
    });
    await waitFor(() => {
      expect(submitButton).toBeEnabled();
    });

    fireEvent.click(submitButton);

    await waitFor(
      () => {
        expect(
          screen.getByRole("heading", {
            name: /Extension Acquisition Simulator/i,
          }),
        ).toBeInTheDocument();
      },
      { timeout: 5000 },
    );
    expect(screen.getByText(/static demo simulation/i)).toBeInTheDocument();
    await waitFor(() => {
      expect(screen.getByText(/^job-/)).toBeInTheDocument();
    });
  });

  it("renders Case Study content at /app/case-study", () => {
    renderAt("/app/case-study");

    expect(
      screen.getByRole("heading", { name: /^Ops Console Demo$/i, level: 1 }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /What runs in this repository/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getAllByRole("link", { name: /Open Overview/i })[0],
    ).toHaveAttribute("href", "/app/overview");
    expect(
      screen.getByRole("link", { name: /Open Operations Board/i }),
    ).toHaveAttribute("href", "/app/operations");
  });

  it("renders Finance Summary at /app/finance (demo, not stub)", async () => {
    renderAt("/app/finance");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^Finance Summary$/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getAllByText(/Demo — synthetic finance/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getByLabelText("Total amount")).toHaveTextContent("37,200");
    expect(
      screen.queryByText(/Not available in this demo version/i),
    ).not.toBeInTheDocument();
  });

  it("renders Team Activity at /app/team (demo, not stub)", async () => {
    renderAt("/app/team");

    await waitFor(() => {
      expect(
        screen.getByRole("heading", { name: /^Team Activity$/i }),
      ).toBeInTheDocument();
    });
    expect(
      screen.getAllByText(/Demo — synthetic team/i).length,
    ).toBeGreaterThan(0);
    expect(screen.getAllByText("Operator 001").length).toBeGreaterThan(0);
    expect(
      screen.queryByText(/Not available in this demo version/i),
    ).not.toBeInTheDocument();
  });

  it("renders an honest stub panel for unavailable admin routes", () => {
    renderAt("/app/settings");

    expect(
      screen.getByRole("heading", { name: /^Settings$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText(/Not available in this demo version/i),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("navigation", { name: /Available demo workflows/i })
        .querySelector('a[href="/app/operations"]'),
    ).not.toBeNull();
  });

  it("renders the not-found page for unknown paths", () => {
    renderAt("/this-route-does-not-exist");

    expect(
      screen.getByRole("heading", { name: /Page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Overview$/i })).toHaveAttribute(
      "href",
      "/app/overview",
    );
  });
});
