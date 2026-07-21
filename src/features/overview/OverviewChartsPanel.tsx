import { ChartCard, DemoPieChart, DemoBarChart } from "@/features/demo-charts";
import type {
  DemoOverviewSnapshot,
} from "@/features/overview/overview.types";

export interface OverviewChartsPanelProps {
  snapshot: Pick<
    DemoOverviewSnapshot,
    "clientMix" | "batchByColumn" | "linkedAccountCapacity"
  >;
}

/**
 * Overview Recharts grid — client mix pie + pipeline / capacity bars from demoStore.
 */
export function OverviewChartsPanel({ snapshot }: OverviewChartsPanelProps) {
  const { clientMix, batchByColumn, linkedAccountCapacity } = snapshot;
  const clientMixTotal = clientMix.reduce((sum, row) => sum + row.value, 0);
  const batchTotal = batchByColumn.reduce((sum, row) => sum + row.value, 0);
  const capacityTotal = linkedAccountCapacity.reduce(
    (sum, row) => sum + row.value,
    0,
  );

  return (
    <div className="grid gap-4 xl:grid-cols-2">
      <ChartCard
        title="Client mix"
        subtitle="Operation requests by board status"
        isEmpty={clientMixTotal === 0}
        emptyMessage="No client operations in the current demo store."
      >
        <DemoPieChart
          data={clientMix}
          showLegend
          legendAriaLabel="Client mix by board status"
        />
      </ChartCard>

      <ChartCard
        title="Batches by column"
        subtitle={`Pipeline columns · ${batchTotal} batch${batchTotal === 1 ? "" : "es"}`}
        isEmpty={batchTotal === 0}
        emptyMessage="No pipeline batches in the current demo store."
      >
        <DemoBarChart data={batchByColumn} valueLabel="Batches" />
      </ChartCard>

      <ChartCard
        title="Linked account capacity"
        subtitle="Synthetic session capacity for online accounts (offline = 0)"
        isEmpty={capacityTotal === 0 && linkedAccountCapacity.length === 0}
        emptyMessage="No linked accounts in the current demo store."
        footer={
          linkedAccountCapacity.length > 0 && capacityTotal === 0 ? (
            <p className="mt-2 text-xs text-[var(--gray-800)]">
              All linked accounts are offline in this snapshot.
            </p>
          ) : null
        }
      >
        <DemoBarChart
          data={linkedAccountCapacity}
          valueLabel="Capacity"
        />
      </ChartCard>
    </div>
  );
}
