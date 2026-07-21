import {
  ChartCard,
  DemoAreaChart,
  DemoGroupedBarChart,
  DemoPieChart,
} from "@/features/demo-charts";
import { DEMO_CHART_COLORS } from "@/features/demo-charts/chartTheme";
import { useDemoFinance } from "./useDemoFinance";

function formatAmount(value: number): string {
  return value.toLocaleString("en-US");
}

/**
 * Finance Summary — mock KPIs + Recharts series from the shared demo store.
 * Synthetic finance labeled honestly; no live billing.
 */
export default function FinanceSummaryPage() {
  const { kpis, volumeTrend, outcomeMix, settlementMix, accountBars } =
    useDemoFinance();

  const kpiCards = [
    {
      label: "Total amount",
      value: formatAmount(kpis.totalAmount),
      hint: "Synthetic volume plus live board request amounts",
    },
    {
      label: "Transactions",
      value: formatAmount(kpis.totalCount),
      hint: "Seeded counts blended with open / completed board work",
    },
    {
      label: "Successful",
      value: formatAmount(kpis.successfulCount),
      hint: "Seeded successes plus completed operations",
    },
    {
      label: "Settled",
      value: formatAmount(kpis.settledCount),
      hint: "Seeded settled plus completed operations",
    },
  ];

  const outcomeSlices = outcomeMix.map((slice) => ({
    name: slice.name,
    value: slice.value,
    color:
      slice.key === "success"
        ? DEMO_CHART_COLORS.success
        : DEMO_CHART_COLORS.failed,
  }));

  const settlementSlices = settlementMix.map((slice) => ({
    name: slice.name,
    value: slice.value,
    color:
      slice.key === "settled"
        ? DEMO_CHART_COLORS.settled
        : DEMO_CHART_COLORS.unsettled,
  }));

  const accountBarData = accountBars.map((row) => ({
    label: row.label.replace("Linked Account ", "Acct "),
    count: row.count,
    amount: row.amount,
  }));

  return (
    <div className="flex flex-col gap-5">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Accounting</p>
          <h1 className="admin-page-title">Finance Summary</h1>
          <p className="admin-page-subtitle">
            Demo — synthetic finance series from the shared mock store. No live
            billing, filters, or payment rails.
          </p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">
          Demo — synthetic finance
        </span>
      </header>

      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {kpiCards.map((metric) => (
          <li key={metric.label} className="admin-kpi-card">
            <p className="admin-kpi-label">{metric.label}</p>
            <p className="admin-kpi-value" aria-label={metric.label}>
              {metric.value}
            </p>
            <p className="admin-kpi-hint">{metric.hint}</p>
          </li>
        ))}
      </ul>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <ChartCard
          title="Volume trend"
          summary={
            volumeTrend.length
              ? `${volumeTrend.length} synthetic day buckets`
              : undefined
          }
          empty={volumeTrend.length === 0}
        >
          <DemoAreaChart data={volumeTrend} />
        </ChartCard>

        <ChartCard
          title="Outcome mix"
          summary={`${kpis.successfulCount} successful · synthetic + live`}
          empty={outcomeSlices.length === 0}
        >
          <DemoPieChart data={outcomeSlices} />
        </ChartCard>

        <ChartCard
          title="Settlement mix"
          summary={`${kpis.settledCount} settled · open board work counts as unsettled`}
          empty={settlementSlices.length === 0}
        >
          <DemoPieChart data={settlementSlices} />
        </ChartCard>
      </div>

      <ChartCard
        title="Volume by linked account"
        summary={
          accountBars.length
            ? `${accountBars.length} linked accounts (synthetic counts)`
            : undefined
        }
        empty={accountBars.length === 0}
      >
        <DemoGroupedBarChart
          data={accountBarData}
          series={[
            { key: "count", label: "Count", color: DEMO_CHART_COLORS.amount },
          ]}
          height={240}
        />
      </ChartCard>
    </div>
  );
}
