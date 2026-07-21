import { useEffect, useState } from "react";
import {
  getDemoFinanceSnapshot,
  subscribeDemoStore,
} from "@/mocks/demoStore";
import type { FinanceSummarySnapshot } from "./finance.types";

/** Live Finance Summary snapshot from the shared demo store. */
export function useDemoFinance(): FinanceSummarySnapshot {
  const [snapshot, setSnapshot] = useState(getDemoFinanceSnapshot);

  useEffect(() => {
    return subscribeDemoStore(() => {
      setSnapshot(getDemoFinanceSnapshot());
    });
  }, []);

  return snapshot;
}
