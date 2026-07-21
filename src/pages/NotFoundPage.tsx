import { Link } from "react-router-dom";

/**
 * Standalone 404 — outside AdminDemoLayout, so it owns its own document region.
 */
export default function NotFoundPage() {
  return (
    <main className="ops-shell flex min-h-svh flex-col items-center justify-center gap-6 px-4 text-center text-[var(--gray-900)]">
      <section
        className="ops-panel max-w-md space-y-3 rounded-2xl p-8"
        aria-labelledby="not-found-heading"
      >
        <p className="ops-gold-text text-6xl font-bold leading-none" aria-hidden="true">
          404
        </p>
        <h1 id="not-found-heading" className="text-xl font-semibold text-[var(--fg)]">
          Page not found
        </h1>
        <p className="text-sm text-[var(--gray-800)]">
          This showcase exposes the admin demo shell, interactive workflows, and
          honest stub routes under /app.
        </p>
        <nav
          className="flex flex-wrap justify-center gap-3 pt-2"
          aria-label="Available pages"
        >
          <Link to="/app/overview" className="ops-btn ops-btn-primary px-4 py-2 text-sm">
            Overview
          </Link>
          <Link to="/app/operations" className="ops-btn px-4 py-2 text-sm">
            Operations Board
          </Link>
        </nav>
      </section>
    </main>
  );
}
