import type { ReactNode } from "react";

interface ColumnFrameProps {
  title: string;
  count: number;
  toneClass: string;
  children: ReactNode;
  headingId?: string;
  titleClassName?: string;
  countClassName?: string;
  /** Droppable / measurement ref for the column section (e.g. ready-batch zone). */
  sectionRef?: (node: HTMLElement | null) => void;
  sectionClassName?: string;
}

/**
 * Shared column chrome: labelled section, count, scroll region.
 * Card grids / empty states stay in the caller so DnD lists stay flexible.
 */
export function ColumnFrame({
  title,
  count,
  toneClass,
  children,
  headingId,
  titleClassName = "",
  countClassName = "",
  sectionRef,
  sectionClassName = "",
}: ColumnFrameProps) {
  const resolvedHeadingId =
    headingId ?? `${title.toLowerCase().replace(/\s+/g, "-")}-column-heading`;

  return (
    <section
      ref={sectionRef}
      className={`ops-column ${toneClass} ${sectionClassName}`.trim()}
      aria-labelledby={resolvedHeadingId}
    >
      <header className="ops-column-head">
        <h2
          id={resolvedHeadingId}
          className={`ops-column-title ${titleClassName}`.trim()}
        >
          {title}
        </h2>
        <span
          className={`ops-column-count ${countClassName}`.trim()}
          aria-label={`${count} items`}
        >
          {count}
        </span>
      </header>
      <div className="min-h-0 flex-1 overflow-y-auto pr-0.5">{children}</div>
    </section>
  );
}

/** Semantic list wrapper for board cards (design-system grid). */
export function BoardCardList({ children }: { children: ReactNode }) {
  return <ul className="ops-card-grid m-0 list-none p-0">{children}</ul>;
}

export function BoardCardListItem({ children }: { children: ReactNode }) {
  return <li className="w-fit justify-self-start">{children}</li>;
}
