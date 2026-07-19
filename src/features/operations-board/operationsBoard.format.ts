/**
 * Pure display formatters for board amounts and timestamps.
 */

export function formatAmount(
  value: number | string | null | undefined,
): string {
  const n = Number(value);
  if (!Number.isFinite(n)) return "0";
  return Math.trunc(n).toLocaleString("en-US");
}

export function formatRequestedAt(iso: string | null | undefined): string {
  if (!iso) return "—";
  try {
    return new Date(iso).toLocaleString("en-GB", {
      day: "2-digit",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return String(iso);
  }
}
