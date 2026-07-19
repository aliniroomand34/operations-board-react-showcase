import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-6 bg-[var(--color-dark)] px-4 text-center text-[var(--color-text-primary)]">
      <div className="space-y-2">
        <p className="text-6xl font-bold text-[var(--color-gold)]">404</p>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-[var(--color-text-secondary)]">
          This showcase only exposes Home and the Operations Board.
        </p>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <Link
          to="/"
          className="rounded-md bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-dark)] hover:bg-[var(--color-gold-light)]"
        >
          Home
        </Link>
        <Link
          to="/operations"
          className="rounded-md border border-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-gold)] hover:bg-[var(--color-dark-1)]"
        >
          Operations Board
        </Link>
      </div>
    </div>
  );
}
