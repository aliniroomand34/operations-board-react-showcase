/**
 * Pure selectors — Finance Summary KPIs and chart series from the demo store.
 * Blends seeded finance snapshot with live board / pipeline counts for cohesion.
 */
import type { DemoStoreSnapshot } from "@/mocks/demoStore.types";
import type {
  FinanceAccountBarRow,
  FinanceKpis,
  FinancePieSlice,
  FinanceSummarySnapshot,
  FinanceVolumeTrendPoint,
} from "./finance.types";

function countPipelineProblems(store: DemoStoreSnapshot): number {
  return store.pipelineBatches.filter((batch) => batch.column === "problem").length;
}

function countFailedJobs(store: DemoStoreSnapshot): number {
  return store.acquisitionJobs.filter((job) => job.status === "failed").length;
}

/** KPI row — synthetic totals plus live board/pipeline adjustments. */
export function selectFinanceKpis(store: DemoStoreSnapshot): FinanceKpis {
  const { finance, board } = store;
  const liveCompleted = board.completed.length;
  const liveOpen = board.queued.length + board.inProgress.length;
  const liveFailed = countPipelineProblems(store) + countFailedJobs(store);

  const successfulCount = finance.successfulCount + liveCompleted;
  const settledCount = finance.settledCount + liveCompleted;
  const totalCount =
    successfulCount + finance.failedCount + liveFailed + liveOpen;

  const liveAmount = [...board.queued, ...board.inProgress, ...board.completed].reduce(
    (sum, request) => sum + request.amount,
    0,
  );

  return {
    totalAmount: finance.totalAmount + liveAmount,
    totalCount,
    successfulCount,
    settledCount,
  };
}

export function selectFinanceVolumeTrend(
  store: DemoStoreSnapshot,
): FinanceVolumeTrendPoint[] {
  return store.finance.volumeTrend.map((point) => ({ ...point }));
}

export function selectFinanceOutcomeMix(store: DemoStoreSnapshot): FinancePieSlice[] {
  const kpis = selectFinanceKpis(store);
  const failed =
    store.finance.failedCount +
    countPipelineProblems(store) +
    countFailedJobs(store);

  const slices: FinancePieSlice[] = [
    { name: "Successful", value: kpis.successfulCount, key: "success" },
    { name: "Failed", value: failed, key: "failed" },
  ];
  return slices.filter((slice) => slice.value > 0);
}

export function selectFinanceSettlementMix(
  store: DemoStoreSnapshot,
): FinancePieSlice[] {
  const kpis = selectFinanceKpis(store);
  const liveOpen = store.board.queued.length + store.board.inProgress.length;
  const unsettled = store.finance.unsettledCount + liveOpen;

  const slices: FinancePieSlice[] = [
    { name: "Settled", value: kpis.settledCount, key: "settled" },
    { name: "Unsettled", value: unsettled, key: "unsettled" },
  ];
  return slices.filter((slice) => slice.value > 0);
}

export function selectFinanceAccountBars(
  store: DemoStoreSnapshot,
): FinanceAccountBarRow[] {
  return store.finance.accountVolumes.map((entry) => ({
    label: entry.accountLabel,
    amount: entry.amount,
    count: entry.count,
    accountId: entry.accountId,
  }));
}

export function selectFinanceSummarySnapshot(
  store: DemoStoreSnapshot,
): FinanceSummarySnapshot {
  return {
    kpis: selectFinanceKpis(store),
    volumeTrend: selectFinanceVolumeTrend(store),
    outcomeMix: selectFinanceOutcomeMix(store),
    settlementMix: selectFinanceSettlementMix(store),
    accountBars: selectFinanceAccountBars(store),
  };
}
