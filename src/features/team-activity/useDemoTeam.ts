import { useEffect, useState } from "react";
import {
  getDemoTeamSnapshot,
  subscribeDemoStore,
} from "@/mocks/demoStore";
import type { TeamActivitySnapshot } from "./team.types";

/** Live Team Activity snapshot from the shared demo store. */
export function useDemoTeam(): TeamActivitySnapshot {
  const [snapshot, setSnapshot] = useState(getDemoTeamSnapshot);

  useEffect(() => {
    return subscribeDemoStore(() => {
      setSnapshot(getDemoTeamSnapshot());
    });
  }, []);

  return snapshot;
}
