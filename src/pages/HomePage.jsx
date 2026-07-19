import { Link } from "react-router-dom";

/**
 * Showcase landing — explains scope honestly for recruiters / reviewers.
 */
export default function HomePage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="max-w-2xl space-y-3">
        <h1 className="text-3xl font-semibold tracking-tight text-[var(--color-gold)]">
          Operations Board
        </h1>
        <p className="text-base leading-relaxed text-[var(--color-text-secondary)]">
          An anonymized React architecture showcase extracted from a private SaaS
          operations workflow. Domain language and live APIs were removed; the
          focus is modular UI / Logic / API / helpers boundaries, board workflows,
          and a Senior-ready learning track (TypeScript + testing in progress).
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          to="/operations"
          className="inline-flex items-center justify-center rounded-md bg-[var(--color-gold)] px-4 py-2 text-sm font-semibold text-[var(--color-dark)] transition-colors hover:bg-[var(--color-gold-light)]"
        >
          Open Operations Board
        </Link>
      </div>

      <ul className="grid gap-3 text-sm text-[var(--color-text-secondary)] sm:grid-cols-2">
        <li className="rounded-md border border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark-1)] p-4">
          <p className="font-medium text-[var(--color-text-primary)]">In scope</p>
          <p className="mt-1">
            Board UI, drag/drop assign, mock API boundary, testable domain helpers,
            desktop demo.
          </p>
        </li>
        <li className="rounded-md border border-[var(--color-gold-shadow)]/40 bg-[var(--color-dark-1)] p-4">
          <p className="font-medium text-[var(--color-text-primary)]">Out of scope</p>
          <p className="mt-1">
            Real auth, private admin surfaces, live endpoints, production PII.
          </p>
        </li>
      </ul>
    </section>
  );
}
