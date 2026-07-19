/**
 * Route shell tests — Home, Operations Board, and unknown-path fallback.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { showcaseRoutes } from "@/routes/showcaseRoutes";
import {
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
} from "@/features/operations-board/operationsBoard.api";

function renderAt(path: string) {
  const router = createMemoryRouter(showcaseRoutes, {
    initialEntries: [path],
  });
  return render(<RouterProvider router={router} />);
}

describe("showcase routes", () => {
  beforeEach(() => {
    setOperationsBoardMockDelay(0);
    setOperationsBoardMockFailure(false);
    resetOperationsBoardMock("default");
  });

  it("renders the Home landing at /", () => {
    renderAt("/");

    expect(
      screen.getByRole("heading", { name: /^Operations Board$/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /Private system volume/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", {
        name: /How work moved through the system/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Open Operations Board/i }),
    ).toHaveAttribute("href", "/operations");
  });

  it("renders the Operations Board at /operations", async () => {
    renderAt("/operations");

    await waitFor(() => {
      expect(screen.getByLabelText("Board columns")).toBeInTheDocument();
    });
    expect(
      screen.getByRole("heading", { name: /^Operations Board$/i }),
    ).toBeInTheDocument();
  });

  it("renders the not-found page for unknown paths", () => {
    renderAt("/this-route-does-not-exist");

    expect(
      screen.getByRole("heading", { name: /Page not found/i }),
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /^Home$/i })).toHaveAttribute(
      "href",
      "/",
    );
  });
});
