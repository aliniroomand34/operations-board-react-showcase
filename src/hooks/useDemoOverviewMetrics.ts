import { useEffect, useState } from "react";
import {
  getDemoOverviewSnapshot,
  subscribeDemoStore,
  type DemoOverviewSnapshot,
} from "@/mocks/demoStore";

/**
 * Live Overview KPIs and chart segments from the shared demo store.
 * Updates when board, pipeline, or extension-sim mutations change the snapshot.
 */
export function useDemoOverviewMetrics(): DemoOverviewSnapshot {
  const [snapshot, setSnapshot] = useState(getDemoOverviewSnapshot);

  useEffect(() => {
    return subscribeDemoStore(() => {
      setSnapshot(getDemoOverviewSnapshot());
    });
  }, []);

  return snapshot;
}
