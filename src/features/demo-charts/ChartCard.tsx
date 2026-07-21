import type { ReactNode } from "react";

export interface ChartCardProps {
  title: string;
  /** Preferred subtitle copy (Overview). */
  subtitle?: string;
  /** Alias used by Finance Summary. */
  summary?: string;
  children: ReactNode;
  emptyMessage?: string;
  /** Preferred empty flag (Overview). */
  isEmpty?: boolean;
  /** Alias used by Finance Summary. */
  empty?: boolean;
  footer?: ReactNode;
}

/**
 * Shared chart shell for Overview / Finance — title, empty state, children.
 */
export function ChartCard({
  title,
  subtitle,
  summary,
  children,
  emptyMessage = "No data in the current demo store snapshot.",
  isEmpty = false,
  empty = false,
  footer,
}: ChartCardProps) {
  const description = subtitle ?? summary;
  const showEmpty = isEmpty || empty;

  return (
    <article className="demo-chart-card" aria-label={title}>
      <header className="mb-3">
        <h3 className="text-sm font-bold text-[var(--fg)] sm:text-base">{title}</h3>
        {description ? (
          <p className="mt-0.5 text-xs text-[var(--gray-800)]">{description}</p>
        ) : null}
      </header>
      {showEmpty ? (
        <p className="py-10 text-center text-sm text-[var(--gray-800)]">{emptyMessage}</p>
      ) : (
        children
      )}
      {!showEmpty && footer ? footer : null}
    </article>
  );
}
