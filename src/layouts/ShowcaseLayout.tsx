import { NavLink, Outlet, type NavLinkRenderProps } from "react-router-dom";

const navLinkClass = ({ isActive }: NavLinkRenderProps) =>
  [
    "rounded-md px-3 py-2 text-sm font-semibold tracking-wide transition-colors",
    isActive
      ? "border border-[var(--border-muted)] bg-black/50 text-[var(--fg)] shadow-[inset_0_0_12px_rgba(255,215,0,0.12)]"
      : "border border-transparent text-[var(--gray-800)] hover:border-[var(--border-muted)]/40 hover:bg-black/30 hover:text-[var(--fg-subtle)]",
  ].join(" ");

/**
 * Public demo shell: navigation only — no auth, no role gates, no backend session.
 * Layout owns document landmarks; pages render inside `main`.
 */
export default function ShowcaseLayout() {
  return (
    <div className="ops-shell flex min-h-svh flex-col text-[var(--gray-900)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="ops-header sticky top-0 z-40">
        <div className="mx-auto flex max-w-[90rem] items-center justify-between gap-4 px-4 py-3 lg:px-6">
          <div className="min-w-0">
            <p className="ops-brand truncate">Operations Board</p>
            <p className="mt-0.5 truncate text-xs text-[var(--gray-800)]">
              Anonymized operator workflow showcase
            </p>
          </div>
          <nav className="flex shrink-0 items-center gap-1" aria-label="Primary">
            <NavLink to="/" end className={navLinkClass}>
              Home
            </NavLink>
            <NavLink to="/operations" className={navLinkClass}>
              Board
            </NavLink>
          </nav>
        </div>
      </header>

      <main
        id="main-content"
        className="mx-auto w-full max-w-[90rem] flex-1 px-4 py-6 lg:px-6"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <footer className="border-t border-[var(--border-muted)]/35 bg-black/40 px-4 py-3 text-center text-xs text-[var(--gray-800)]">
        Desktop-focused demo · Synthetic data only · No live backend
      </footer>
    </div>
  );
}
