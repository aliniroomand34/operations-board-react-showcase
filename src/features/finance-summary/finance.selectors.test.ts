/**
 * Finance selectors — KPI and chart derivation from the demo store.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_DEMO_STORE } from "@/mocks/demoStore.data";
import { resetDemoStore } from "@/mocks/demoStore";
import {
  selectFinanceAccountBars,
  selectFinanceKpis,
  selectFinanceOutcomeMix,
  selectFinanceSettlementMix,
  selectFinanceSummarySnapshot,
  selectFinanceVolumeTrend,
} from "./finance.selectors";

describe("finance.selectors", () => {
  beforeEach(() => {
    resetDemoStore("default");
  });

  it("blends seeded finance KPIs with live board counts", () => {
    expect(selectFinanceKpis(INITIAL_DEMO_STORE)).toEqual({
      totalAmount: 37200,
      totalCount: 20,
      successfulCount: 15,
      settledCount: 13,
    });
  });

  it("returns a copy of the seeded volume trend", () => {
    const trend = selectFinanceVolumeTrend(INITIAL_DEMO_STORE);

    expect(trend).toHaveLength(7);
    expect(trend[0]).toEqual({ label: "Mon", amount: 4200, count: 4 });
    expect(trend).not.toBe(INITIAL_DEMO_STORE.finance.volumeTrend);
  });

  it("builds outcome and settlement pie slices from store + live work", () => {
    expect(selectFinanceOutcomeMix(INITIAL_DEMO_STORE)).toEqual([
      { name: "Successful", value: 15, key: "success" },
      { name: "Failed", value: 2, key: "failed" },
    ]);

    expect(selectFinanceSettlementMix(INITIAL_DEMO_STORE)).toEqual([
      { name: "Settled", value: 13, key: "settled" },
      { name: "Unsettled", value: 8, key: "unsettled" },
    ]);
  });

  it("maps linked-account volume bars from the finance snapshot", () => {
    expect(selectFinanceAccountBars(INITIAL_DEMO_STORE)).toEqual([
      {
        label: "Linked Account 001",
        amount: 9200,
        count: 9,
        accountId: "acct-001",
      },
      {
        label: "Linked Account 002",
        amount: 7100,
        count: 7,
        accountId: "acct-002",
      },
      {
        label: "Linked Account 003",
        amount: 2800,
        count: 3,
        accountId: "acct-003",
      },
    ]);
  });

  it("assembles a full finance summary snapshot", () => {
    const snapshot = selectFinanceSummarySnapshot(INITIAL_DEMO_STORE);

    expect(snapshot.kpis.successfulCount).toBe(15);
    expect(snapshot.volumeTrend).toHaveLength(7);
    expect(snapshot.outcomeMix).toHaveLength(2);
    expect(snapshot.settlementMix).toHaveLength(2);
    expect(snapshot.accountBars).toHaveLength(3);
  });

  it("drops empty pie slices when counts are zero", () => {
    const empty = structuredClone(INITIAL_DEMO_STORE);
    empty.finance.successfulCount = 0;
    empty.finance.failedCount = 0;
    empty.finance.settledCount = 0;
    empty.finance.unsettledCount = 0;
    empty.board.queued = [];
    empty.board.inProgress = [];
    empty.board.completed = [];
    empty.pipelineBatches = [];
    empty.acquisitionJobs = [];

    expect(selectFinanceOutcomeMix(empty)).toEqual([]);
    expect(selectFinanceSettlementMix(empty)).toEqual([]);
  });
});
