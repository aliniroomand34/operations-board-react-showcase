/**
 * Team Activity view models — org graph + activity feed.
 */

export type TeamGraphRole = "owner" | "operator";

export interface TeamGraphNode {
  id: string;
  label: string;
  role: TeamGraphRole;
  active: boolean;
}

export interface TeamGraphModel {
  owner: TeamGraphNode | null;
  operators: TeamGraphNode[];
  memberCount: number;
}

export interface TeamFeedItem {
  id: string;
  actorLabel: string;
  action: string;
  detail: string;
  at: string;
}

export interface TeamActivitySnapshot {
  graph: TeamGraphModel;
  feed: TeamFeedItem[];
}
