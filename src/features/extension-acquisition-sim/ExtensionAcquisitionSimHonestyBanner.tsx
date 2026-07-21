/**
 * Honesty banner — production extension boundary vs static demo simulation.
 */
export function ExtensionAcquisitionSimHonestyBanner() {
  return (
    <aside
      className="rounded-xl border border-[var(--border-muted)] bg-[var(--bg-panel)] p-4 sm:p-5"
      role="note"
      aria-label="Production context"
    >
      <p className="text-sm leading-relaxed text-[var(--gray-800)]">
        In production, a browser-based operator extension performed acquisition on
        an external provider surface. This page is a{" "}
        <strong className="font-semibold text-[var(--fg-subtle)]">
          static demo simulation
        </strong>{" "}
        — no real extension, no live provider, and no scraping of third-party sites.
      </p>
    </aside>
  );
}
