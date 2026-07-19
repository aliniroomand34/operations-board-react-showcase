/**
 * Behavior tests for ErrorBoundary fallback + retry recovery.
 */
import { useState } from "react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ErrorBoundary from "./ErrorBoundary";

interface BoomProps {
  shouldThrow: boolean;
}

function Boom({ shouldThrow }: BoomProps) {
  if (shouldThrow) {
    throw new Error("Synthetic render failure");
  }
  return <p>Board content recovered</p>;
}

describe("ErrorBoundary", () => {
  beforeEach(() => {
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("shows the fallback alert when a child throws", () => {
    render(
      <ErrorBoundary showDetails={false}>
        <Boom shouldThrow />
      </ErrorBoundary>,
    );

    expect(screen.getByRole("alert")).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Something went wrong/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByText("Synthetic render failure", { selector: "p" }),
    ).toBeInTheDocument();
  });

  it("recovers children after Retry when onRetry updates parent state", () => {
    function Harness() {
      const [shouldThrow, setShouldThrow] = useState(true);
      return (
        <ErrorBoundary
          showDetails={false}
          onRetry={() => setShouldThrow(false)}
        >
          <Boom shouldThrow={shouldThrow} />
        </ErrorBoundary>
      );
    }

    render(<Harness />);

    expect(screen.getByRole("alert")).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: /Reload/i }));

    expect(screen.getByText(/Board content recovered/i)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
