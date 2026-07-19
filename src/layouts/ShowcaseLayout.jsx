import { NavLink, Outlet } from "react-router-dom";

const navLinkClass = ({ isActive }) =>
  [
    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
    isActive
      ? "bg-[var(--color-dark-1)] text-[var(--color-gold)]"
      : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)]",
  ].join(" ");

/**
 * Public demo shell: navigation only — no auth, no role gates, no backend session.
 */
export default function ShowcaseLayout() {
  return (
    <div className="flex min-h-svh flex-col bg-[var(--color-dark)] text-[var(--color-text-primary)]">
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      <header className="border-b border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark-1)]">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold tracking-wide text-[var(--color-gold)]">
              Operations Board
            </p>
            <p className="truncate text-xs text-[var(--color-text-secondary)]">
              Anonymized architecture showcase
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
        className="mx-auto w-full max-w-7xl flex-1 px-4 py-6"
        tabIndex={-1}
      >
        <Outlet />
      </main>

      <footer className="border-t border-[var(--color-gold-shadow)]/30 px-4 py-3 text-center text-xs text-[var(--color-text-secondary)]">
        Desktop-focused demo · Synthetic data only · No live backend
      </footer>
    </div>
  );
}
