import type { ReactNode } from "react";

/** Shared article chrome for board cards — presentation only. */
export function CardShell({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`flex w-fit flex-col items-stretch gap-1.5 ${className}`}
    >
      {children}
    </article>
  );
}

export function AssigningOverlay() {
  return (
    <span
      className="absolute inset-x-0 bottom-0 bg-black/85 py-1 text-[10px] font-semibold text-[var(--fg-subtle)]"
      role="status"
    >
      Assigning…
    </span>
  );
}
