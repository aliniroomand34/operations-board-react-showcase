import { Outlet } from "react-router-dom";
import AdminDemoSidebar from "@/layouts/AdminDemoSidebar";
import ErrorBoundary from "@/components/ErrorBoundary";

/**
 * Public admin demo shell — LTR English chrome with sidebar + top bar.
 * No auth, role gates, WebSocket providers, or live backend session.
 */
export default function AdminDemoLayout() {
  return (
    <div className="admin-shell flex min-h-svh flex-col text-[var(--gray-900)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="admin-topbar sticky top-0 z-40">
        <div className="admin-topbar-inner">
          <div className="min-w-0">
            <p className="admin-brand truncate">Ops Console Demo</p>
            <p className="admin-brand-sub truncate">
              Anonymized operations admin · Synthetic data only
            </p>
          </div>
          <div className="admin-topbar-meta hidden sm:flex" aria-label="Demo status">
            <span className="ops-status-badge">No live backend</span>
            <span className="ops-status-badge ops-status-badge--progress">
              Desktop-first
            </span>
          </div>
        </div>
      </header>

      <div className="admin-body">
        <AdminDemoSidebar />

        <div className="admin-main-wrap flex min-h-0 min-w-0 flex-1 flex-col">
          <main
            id="main-content"
            className="admin-main flex-1 overflow-x-hidden overflow-y-auto p-3 sm:p-4 md:p-5 lg:p-6"
            tabIndex={-1}
          >
            <ErrorBoundary
              variant="embedded"
              homeHref="/app/overview"
              homeLabel="Overview"
            >
              <Outlet />
            </ErrorBoundary>
          </main>

          <footer className="admin-demo-footer">
            Synthetic data · No live backend · Static portfolio showcase
          </footer>
        </div>
      </div>
    </div>
  );
}
