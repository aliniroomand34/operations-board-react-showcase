import { Link } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";

interface DemoSurfacePlaceholderPageProps {
  title: string;
  description: string;
}

/**
 * Page chrome for demo routes whose interactive workflow ships in a later phase.
 * Distinct from DemoUnavailablePanel — these routes are marked "Demo" in nav.
 */
export default function DemoSurfacePlaceholderPage({
  title,
  description,
}: DemoSurfacePlaceholderPageProps) {
  return (
    <section className="flex flex-col gap-5" aria-labelledby="demo-surface-heading">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Interactive demo</p>
          <h1 id="demo-surface-heading" className="admin-page-title">
            {title}
          </h1>
          <p className="admin-page-subtitle">{description}</p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">Demo</span>
      </header>

      <div className="admin-page-panel rounded-2xl p-6 sm:p-8">
        <p className="text-sm leading-relaxed text-[var(--gray-800)]">
          Shell and navigation are live. Workflow mutations, mock store wiring, and
          tests for this surface ship in the next implementation phase.
        </p>
        <nav className="mt-5 flex flex-wrap gap-3" aria-label="Related demo routes">
          <Link
            to={`${ADMIN_DEMO_BASE}/operations`}
            className="ops-btn ops-btn-primary px-4 py-2 text-sm"
          >
            Operations Board
          </Link>
          <Link
            to={`${ADMIN_DEMO_BASE}/overview`}
            className="ops-btn px-4 py-2 text-sm"
          >
            Overview
          </Link>
        </nav>
      </div>
    </section>
  );
}
