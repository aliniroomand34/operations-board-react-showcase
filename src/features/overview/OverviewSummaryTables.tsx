import type { DemoOverviewTableRow } from "@/features/overview/overview.types";

export interface OverviewSummaryTablesProps {
  clientStatusTable: DemoOverviewTableRow[];
  batchColumnTable: DemoOverviewTableRow[];
  linkedAccountTable: DemoOverviewTableRow[];
}

function SummaryTable({
  title,
  subtitle,
  rows,
  valueHeader,
}: {
  title: string;
  subtitle: string;
  rows: DemoOverviewTableRow[];
  valueHeader: string;
}) {
  const hasDetail = rows.some((row) => row.detail);

  return (
    <section className="demo-summary-table">
      <header className="mb-3">
        <h3 className="text-sm font-bold text-[var(--fg)] sm:text-base">{title}</h3>
        <p className="mt-0.5 text-xs text-[var(--gray-800)]">{subtitle}</p>
      </header>
      <div className="demo-summary-table__shell">
        <table className="w-full min-w-[14rem]">
          <thead>
            <tr>
              <th scope="col">Label</th>
              {hasDetail ? <th scope="col">Status</th> : null}
              <th scope="col" className="text-end">
                {valueHeader}
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.length === 0 ? (
              <tr>
                <td
                  colSpan={hasDetail ? 3 : 2}
                  className="py-6 text-center text-[var(--gray-800)]"
                >
                  No rows in this snapshot.
                </td>
              </tr>
            ) : (
              rows.map((row) => (
                <tr key={row.id}>
                  <td>{row.label}</td>
                  {hasDetail ? (
                    <td className="text-[var(--gray-800)]">{row.detail ?? "—"}</td>
                  ) : null}
                  <td className="text-end font-semibold text-[var(--fg-subtle)]">
                    {row.value}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

/**
 * Compact summary tables under Overview charts — same series as the charts.
 */
export function OverviewSummaryTables({
  clientStatusTable,
  batchColumnTable,
  linkedAccountTable,
}: OverviewSummaryTablesProps) {
  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <SummaryTable
        title="Client status"
        subtitle="Board request counts"
        rows={clientStatusTable}
        valueHeader="Count"
      />
      <SummaryTable
        title="Pipeline columns"
        subtitle="Batch counts by column"
        rows={batchColumnTable}
        valueHeader="Count"
      />
      <SummaryTable
        title="Linked accounts"
        subtitle="Capacity while online"
        rows={linkedAccountTable}
        valueHeader="Capacity"
      />
    </div>
  );
}
