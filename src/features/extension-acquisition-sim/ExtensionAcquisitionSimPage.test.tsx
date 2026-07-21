/**
 * Integration tests — job load, simulation flow, honesty banner, force-error path.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { createMemoryRouter, RouterProvider } from "react-router-dom";
import { showcaseRoutes } from "@/routes/showcaseRoutes";
import {
  createAcquisitionJob,
  resetDemoStore,
  setDemoStoreMockDelay,
  startJob,
  tickJob,
  forceErrorOnJob,
} from "@/features/extension-acquisition-sim/extensionAcquisitionSim.api";
import { getAcquisitionJob, getDemoStoreSnapshot } from "@/mocks/demoStore";

function renderSimAt(path: string) {
  const router = createMemoryRouter(showcaseRoutes, { initialEntries: [path] });
  return render(<RouterProvider router={router} />);
}

async function runJobToCompletionViaApi(jobId: string) {
  await startJob(jobId);
  let current = await getAcquisitionJob(jobId);
  let guard = 0;
  while (current.status === "running" && guard < 50) {
    current = await tickJob(jobId);
    guard += 1;
  }
  return current;
}

describe("ExtensionAcquisitionSimPage", () => {
  beforeEach(() => {
    setDemoStoreMockDelay(0);
    resetDemoStore("default");
  });

  it("shows the honesty banner about static demo simulation", async () => {
    renderSimAt("/app/extension-sim?job=job-001");

    await waitFor(() => {
      expect(screen.getByText(/static demo simulation/i)).toBeInTheDocument();
    });
    expect(
      screen.getByText(/no real extension, no live provider/i),
    ).toBeInTheDocument();
  });

  it("renders job summary bound to submitted form data", async () => {
    renderSimAt("/app/extension-sim?job=job-001");

    await waitFor(() => {
      expect(screen.getByText("job-001")).toBeInTheDocument();
    });
    expect(screen.getByText("sku-001")).toBeInTheDocument();
    expect(screen.getByText("sku-002")).toBeInTheDocument();
    expect(screen.getByText(/acct-001, acct-002/)).toBeInTheDocument();
  });

  it("creates a job, navigates, runs steps, and moves batch to ready", async () => {
    const job = await createAcquisitionJob({
      linkedAccountIds: ["acct-001"],
      mode: "unit",
      targetPrice: 10,
      publishWindowHours: 4,
      lineItems: [{ skuId: "sku-001", skuLabel: "Catalog Item A", quantity: 1 }],
    });

    renderSimAt(`/app/extension-sim?job=${job.id}`);
    await waitFor(() => {
      expect(screen.getByText(job.id)).toBeInTheDocument();
    });

    const finished = await runJobToCompletionViaApi(job.id);
    expect(finished.status).toBe("completed");

    const store = await getDemoStoreSnapshot();
    const batch = store.pipelineBatches.find(
      (entry) => entry.id === job.batchId,
    );
    expect(batch?.column).toBe("ready");
  });

  it("moves batch to problem when force error is triggered", async () => {
    await forceErrorOnJob("job-001");
    const finished = await runJobToCompletionViaApi("job-001");
    expect(finished.status).toBe("failed");

    const store = await getDemoStoreSnapshot();
    const batch = store.pipelineBatches.find(
      (entry) => entry.acquisitionJobId === "job-001",
    );
    expect(batch?.column).toBe("problem");

    renderSimAt("/app/extension-sim?job=job-001");
    await waitFor(() => {
      expect(screen.getByText(/Acquisition failed/i)).toBeInTheDocument();
    });
  });

  it("starts simulation from the UI control", async () => {
    renderSimAt("/app/extension-sim?job=job-001");

    await waitFor(() => {
      expect(
        screen.getByRole("button", { name: /Start simulation/i }),
      ).toBeInTheDocument();
    });

    fireEvent.click(screen.getByRole("button", { name: /Start simulation/i }));

    await waitFor(() => {
      expect(screen.getAllByText("Running").length).toBeGreaterThan(0);
    });
  });

  it("prompts for a job when opened without query param", () => {
    renderSimAt("/app/extension-sim");

    expect(screen.getByText(/No acquisition job selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /Load seed job job-001/i }),
    ).toHaveAttribute("href", "/app/extension-sim?job=job-001");
  });
});
