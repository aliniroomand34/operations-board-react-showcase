/**
 * Finance Summary view models — KPIs and chart series for the mock finance page.
 */

export interface FinanceKpis {
  totalAmount: number;
  totalCount: number;
  successfulCount: number;
  settledCount: number;
}

export interface FinanceVolumeTrendPoint {
  label: string;
  amount: number;
  count: number;
}

export interface FinancePieSlice {
  name: string;
  value: number;
  key: "success" | "failed" | "settled" | "unsettled";
}

export interface FinanceAccountBarRow {
  label: string;
  amount: number;
  count: number;
  accountId: string;
}

export interface FinanceSummarySnapshot {
  kpis: FinanceKpis;
  volumeTrend: FinanceVolumeTrendPoint[];
  outcomeMix: FinancePieSlice[];
  settlementMix: FinancePieSlice[];
  accountBars: FinanceAccountBarRow[];
}
