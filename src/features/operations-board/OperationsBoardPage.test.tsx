/**
 * Integration (RTL) tests for Operations Board user-visible behavior.
 * Assert outcomes users care about — not internal hook/state shapes.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor, within } from "@testing-library/react";
import OperationsBoardPage from "./OperationsBoardPage";
import {
  resetOperationsBoardMock,
  setOperationsBoardMockDelay,
  setOperationsBoardMockFailure,
} from "./operationsBoard.api";

async function waitForBoardReady() {
  await waitFor(() => {
    expect(screen.getByLabelText("Board columns")).toBeInTheDocument();
  });
}

function resetBoardMock() {
  setOperationsBoardMockDelay(0);
  setOperationsBoardMockFailure(false);
  resetOperationsBoardMock("default");
}

describe("OperationsBoardPage — load and status", () => {
  beforeEach(resetBoardMock);

  it("shows a loading status while the board is fetching", async () => {
    setOperationsBoardMockDelay(80);
    render(<OperationsBoardPage />);

    expect(screen.getByRole("status")).toHaveTextContent(
      /Loading operations board/i,
    );

    await waitForBoardReady();
  });

  it("renders queued, ready, in-progress, and completed columns after load", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    expect(
      screen.getByRole("button", { name: /Queued client Client 001/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Ready batch Batch 001/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /In-progress operation Client 010/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: /Completed operation Client 020/i,
      }),
    ).toBeInTheDocument();
  });

  it("shows an empty board status when the empty preset is loaded", async () => {
    resetOperationsBoardMock("empty");
    render(<OperationsBoardPage />);

    await waitFor(() => {
      expect(screen.getByRole("status")).toHaveTextContent(/Board is empty/i);
    });
    expect(screen.queryByLabelText("Board columns")).not.toBeInTheDocument();
  });

  it("shows an error alert and recovers after Retry", async () => {
    setOperationsBoardMockFailure(true);
    render(<OperationsBoardPage />);

    await waitFor(() => {
      expect(screen.getByRole("alert")).toBeInTheDocument();
    });
    expect(screen.getByRole("alert")).toHaveTextContent(
      /Could not load the board/i,
    );

    fireEvent.click(screen.getByRole("button", { name: /Retry/i }));

    await waitForBoardReady();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});

describe("OperationsBoardPage — assign workflows", () => {
  beforeEach(resetBoardMock);

  it("assigns a ready batch to a queued client via the assign modal", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", { name: /Queued client Client 001/i }),
    );

    const details = await screen.findByRole("dialog");
    expect(details).toHaveTextContent(/Operation details/i);
    fireEvent.click(
      within(details).getByRole("button", { name: /Assign batches/i }),
    );

    const assignDialog = await screen.findByRole("dialog");
    expect(assignDialog).toHaveTextContent(/Assign batches · Client 001/i);

    fireEvent.click(
      within(assignDialog).getByRole("button", { name: /Batch 001/i }),
    );
    fireEvent.click(
      within(assignDialog).getByRole("button", { name: /Assign \(1\)/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /In-progress operation Client 001/i,
        }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", { name: /Queued client Client 001/i }),
    ).not.toBeInTheDocument();
  });

  it("assigns additional ready batches to an in-progress operation", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", {
        name: /In-progress operation Client 010/i,
      }),
    );

    const details = await screen.findByRole("dialog");
    fireEvent.click(
      within(details).getByRole("button", { name: /Assign batches/i }),
    );

    const assignDialog = await screen.findByRole("dialog");
    expect(assignDialog).toHaveTextContent(/Assign batches · Client 010/i);

    fireEvent.click(
      within(assignDialog).getByRole("button", { name: /Batch 001/i }),
    );
    fireEvent.click(
      within(assignDialog).getByRole("button", { name: /Assign \(1\)/i }),
    );

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(
      screen.getByRole("button", {
        name: /In-progress operation Client 010/i,
      }),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: /Ready batch Batch 001/i }),
    ).not.toBeInTheDocument();
  });

  it("keeps Assign disabled until a ready batch is selected", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", { name: /Queued client Client 001/i }),
    );

    const details = await screen.findByRole("dialog");
    fireEvent.click(
      within(details).getByRole("button", { name: /Assign batches/i }),
    );

    const assignDialog = await screen.findByRole("dialog");
    expect(
      within(assignDialog).getByRole("button", { name: /Assign \(0\)/i }),
    ).toBeDisabled();
  });
});

describe("OperationsBoardPage — complete and cancel", () => {
  beforeEach(resetBoardMock);

  it("marks an in-progress operation as completed from details", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", {
        name: /In-progress operation Client 010/i,
      }),
    );

    const details = await screen.findByRole("dialog");
    fireEvent.click(
      within(details).getByRole("button", { name: /Mark completed/i }),
    );

    await waitFor(() => {
      expect(
        screen.getByRole("button", {
          name: /Completed operation Client 010/i,
        }),
      ).toBeInTheDocument();
    });
    expect(
      screen.queryByRole("button", {
        name: /In-progress operation Client 010/i,
      }),
    ).not.toBeInTheDocument();
  });

  it("removes a queued request when cancelled from details", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", { name: /Queued client Client 001/i }),
    );

    const details = await screen.findByRole("dialog");
    fireEvent.click(
      within(details).getByRole("button", { name: /Remove from queue/i }),
    );

    await waitFor(() => {
      expect(
        screen.queryByRole("button", { name: /Queued client Client 001/i }),
      ).not.toBeInTheDocument();
    });
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });
});

describe("OperationsBoardPage — modal chrome", () => {
  beforeEach(resetBoardMock);

  it("closes the details dialog on Escape and restores focus to the trigger", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    const trigger = screen.getByRole("button", {
      name: /Queued client Client 001/i,
    });
    trigger.focus();
    expect(trigger).toHaveFocus();

    fireEvent.click(trigger);

    const details = await screen.findByRole("dialog");
    expect(details).toHaveFocus();

    fireEvent.keyDown(document, { key: "Escape" });

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
    expect(trigger).toHaveFocus();
  });

  it("closes the details dialog via the Close control", async () => {
    render(<OperationsBoardPage />);
    await waitForBoardReady();

    fireEvent.click(
      screen.getByRole("button", { name: /Queued client Client 001/i }),
    );

    const details = await screen.findByRole("dialog");
    fireEvent.click(within(details).getByRole("button", { name: /^Close$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    });
  });
});
