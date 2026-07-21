import { Link } from "react-router-dom";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";

export interface DemoUnavailablePanelProps {
  title: string;
  /** Override default portfolio-boundary copy */
  description?: string;
}

/**
 * Honest empty state for sidebar routes outside the public demo scope.
 * Never mimics a broken API — explains the static portfolio boundary instead.
 */
export default function DemoUnavailablePanel({
  title,
  description = "This surface exists in the full operations console but is outside the scope of this static portfolio demo.",
}: DemoUnavailablePanelProps) {
  return (
    <section
      className="admin-page-panel mx-auto flex max-w-2xl flex-col gap-5 rounded-2xl p-6 sm:p-8"
      aria-labelledby="demo-unavailable-heading"
    >
      <div>
        <p className="admin-page-kicker">Portfolio boundary</p>
        <h1
          id="demo-unavailable-heading"
          className="text-xl font-semibold text-[var(--fg)] sm:text-2xl"
        >
          {title}
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-[var(--gray-800)]">
          {description}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-[var(--gray-800)]">
          Not available in this demo version. Explore the interactive workflows
          below to see architecture and operator UX in action.
        </p>
      </div>

      <nav
        className="flex flex-wrap gap-3"
        aria-label="Available demo workflows"
      >
        <Link
          to={`${ADMIN_DEMO_BASE}/operations`}
          className="ops-btn ops-btn-primary px-4 py-2 text-sm"
        >
          Operations Board
        </Link>
        <Link
          to={`${ADMIN_DEMO_BASE}/inventory`}
          className="ops-btn px-4 py-2 text-sm"
        >
          Inventory Pipeline
        </Link>
        <Link
          to={`${ADMIN_DEMO_BASE}/overview`}
          className="ops-btn px-4 py-2 text-sm"
        >
          Overview
        </Link>
      </nav>
    </section>
  );
}
