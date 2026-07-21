/**
 * Team selectors — org graph and activity feed from the demo store.
 */
import { beforeEach, describe, expect, it } from "vitest";
import { INITIAL_DEMO_STORE } from "@/mocks/demoStore.data";
import { resetDemoStore } from "@/mocks/demoStore";
import {
  selectTeamActivitySnapshot,
  selectTeamFeed,
  selectTeamGraph,
} from "./team.selectors";

describe("team.selectors", () => {
  beforeEach(() => {
    resetDemoStore("default");
  });

  it("builds an owner root with operator branches", () => {
    expect(selectTeamGraph(INITIAL_DEMO_STORE)).toEqual({
      owner: {
        id: "op-001",
        label: "Operator 001",
        role: "owner",
        active: true,
      },
      operators: [
        {
          id: "op-002",
          label: "Operator 002",
          role: "operator",
          active: true,
        },
        {
          id: "op-003",
          label: "Operator 003",
          role: "operator",
          active: true,
        },
        {
          id: "op-004",
          label: "Operator 004",
          role: "operator",
          active: false,
        },
      ],
      memberCount: 4,
    });
  });

  it("prepends live pipeline and board rows before seeded feed events", () => {
    const feed = selectTeamFeed(INITIAL_DEMO_STORE);

    expect(feed[0]).toMatchObject({
      id: "live-batch-pipe-001",
      actorLabel: "System",
      action: "Acquisition in progress",
    });
    expect(feed[1]).toMatchObject({
      id: "live-req-010",
      actorLabel: "System",
      action: "Operation in progress",
    });
    expect(feed.some((item) => item.id === "evt-001")).toBe(true);
    expect(feed.length).toBeLessThanOrEqual(8);
  });

  it("assembles a full team activity snapshot", () => {
    const snapshot = selectTeamActivitySnapshot(INITIAL_DEMO_STORE);

    expect(snapshot.graph.memberCount).toBe(4);
    expect(snapshot.graph.owner?.id).toBe("op-001");
    expect(snapshot.feed.length).toBeGreaterThan(0);
  });

  it("handles empty team presets without inventing an owner", () => {
    const empty = structuredClone(INITIAL_DEMO_STORE);
    empty.team = [];
    empty.teamActivity = [];
    empty.pipelineBatches = [];
    empty.board.inProgress = [];

    expect(selectTeamGraph(empty)).toEqual({
      owner: null,
      operators: [],
      memberCount: 0,
    });
    expect(selectTeamFeed(empty)).toEqual([]);
  });
});
