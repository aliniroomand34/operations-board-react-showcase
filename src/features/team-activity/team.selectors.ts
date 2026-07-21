/**
 * Pure selectors — Team Activity org graph and feed from the demo store.
 * Seeded team nodes plus optional live workflow feed rows for cohesion.
 */
import type { DemoStoreSnapshot } from "@/mocks/demoStore.types";
import type {
  TeamActivitySnapshot,
  TeamFeedItem,
  TeamGraphModel,
  TeamGraphNode,
} from "./team.types";

function toGraphNode(
  member: DemoStoreSnapshot["team"][number],
): TeamGraphNode {
  return {
    id: member.id,
    label: member.label,
    role: member.role,
    active: member.active,
  };
}

/** Owner root + operator branches for the CSS org tree. */
export function selectTeamGraph(store: DemoStoreSnapshot): TeamGraphModel {
  const owner =
    store.team.find((member) => member.role === "owner") ?? store.team[0] ?? null;
  const ownerId = owner?.id ?? null;
  const operators = store.team.filter(
    (member) => member.id !== ownerId && member.role === "operator",
  );

  return {
    owner: owner ? toGraphNode(owner) : null,
    operators: operators.map(toGraphNode),
    memberCount: store.team.length,
  };
}

/**
 * Activity feed — seeded events first, then short live-derived rows from
 * pipeline / board so the page reflects shared-store cohesion.
 */
export function selectTeamFeed(store: DemoStoreSnapshot): TeamFeedItem[] {
  const seeded: TeamFeedItem[] = store.teamActivity.map((event) => ({
    id: event.id,
    actorLabel: event.actorLabel,
    action: event.action,
    detail: event.detail,
    at: event.at,
  }));

  const live: TeamFeedItem[] = [];

  for (const batch of store.pipelineBatches) {
    if (batch.column === "acquiring" || batch.column === "problem") {
      live.push({
        id: `live-${batch.id}`,
        actorLabel: "System",
        action:
          batch.column === "problem"
            ? "Batch flagged"
            : "Acquisition in progress",
        detail: `${batch.label} · column ${batch.column}`,
        at: batch.createdAt,
      });
    }
  }

  for (const request of store.board.inProgress.slice(0, 2)) {
    live.push({
      id: `live-${request.id}`,
      actorLabel: "System",
      action: "Operation in progress",
      detail: `${request.clientLabel} · ${request.id}`,
      at: request.requestedAt,
    });
  }

  return [...live, ...seeded].slice(0, 8);
}

export function selectTeamActivitySnapshot(
  store: DemoStoreSnapshot,
): TeamActivitySnapshot {
  return {
    graph: selectTeamGraph(store),
    feed: selectTeamFeed(store),
  };
}
