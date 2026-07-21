import { Link } from "react-router-dom";
import { DemoStoreControls } from "@/components/DemoStoreControls";
import { useDemoStoreControls } from "@/hooks/useDemoStoreControls";
import { OverviewChartsPanel } from "./OverviewChartsPanel";
import { OverviewSummaryTables } from "./OverviewSummaryTables";
import { useDemoOverviewMetrics } from "./useDemoOverviewMetrics";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";

/**
 * Overview dashboard — KPI cards, Recharts, and summary tables from demoStore.
 * Mounted inside AdminDemoLayout at /app/overview.
 */
export default function OverviewPage() {
  const snapshot = useDemoOverviewMetrics();
  const { metrics } = snapshot;
  const demoControls = useDemoStoreControls();

  const kpiCards = [
    {
      label: "Queued operations",
      value: String(metrics.queuedOperations),
      hint: "Operations Board queue — updates on assign or cancel",
    },
    {
      label: "Ready batches",
      value: String(metrics.readyBatches),
      hint: "Board-ready inventory plus pipeline batches in Ready",
    },
    {
      label: "In progress",
      value: String(metrics.inProgress),
      hint: "Active operations with assigned batches",
    },
    {
      label: "Linked accounts online",
      value: String(metrics.linkedAccountsOnline),
      hint: "Provider sessions marked online in mock data",
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Dashboard</p>
          <h1 className="admin-page-title">Overview</h1>
          <p className="admin-page-subtitle">
            Operator KPI snapshot wired to the shared mock store — counts move
            when you work the Operations Board or Inventory Pipeline.
          </p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">Demo</span>
      </header>

      <DemoStoreControls
        onShowEmpty={demoControls.handleShowEmpty}
        onShowErrorPreset={demoControls.handleShowErrorPreset}
        onSimulateError={demoControls.handleSimulateError}
        onResetDemo={demoControls.handleResetDemo}
      />

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((metric) => (
          <li key={metric.label} className="admin-kpi-card">
            <p className="admin-kpi-label">{metric.label}</p>
            <p className="admin-kpi-value" aria-label={metric.label}>
              {metric.value}
            </p>
            <p className="admin-kpi-hint">{metric.hint}</p>
          </li>
        ))}
      </ul>

      <section
        className="flex flex-wrap items-start justify-between gap-3"
        aria-label="Overview workflow links"
      >
        <p className="max-w-xl text-sm text-[var(--gray-800)]">
          Charts and tables below read the same in-memory store as Inventory
          Pipeline and Operations Board — not a separate hardcoded dashboard.
        </p>
        <div className="flex flex-wrap gap-2">
          <Link
            to={`${ADMIN_DEMO_BASE}/inventory`}
            className="ops-btn px-4 py-2 text-sm"
          >
            Inventory Pipeline
          </Link>
          <Link
            to={`${ADMIN_DEMO_BASE}/operations`}
            className="ops-btn ops-btn-primary px-4 py-2 text-sm"
          >
            Operations Board
          </Link>
        </div>
      </section>

      <OverviewChartsPanel snapshot={snapshot} />

      <OverviewSummaryTables
        clientStatusTable={snapshot.clientStatusTable}
        batchColumnTable={snapshot.batchColumnTable}
        linkedAccountTable={snapshot.linkedAccountTable}
      />
    </div>
  );
}
