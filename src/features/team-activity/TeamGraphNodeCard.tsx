import type { TeamGraphNode } from "./team.types";

export interface TeamGraphNodeCardProps {
  node: TeamGraphNode;
  isRoot?: boolean;
}

export function TeamGraphNodeCard({
  node,
  isRoot = false,
}: TeamGraphNodeCardProps) {
  const initials = node.label
    .split(/\s+/)
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article
      className={`team-graph-node ${isRoot ? "team-graph-node--root" : ""} ${
        node.active ? "" : "team-graph-node--inactive"
      }`}
    >
      <div
        className={`team-graph-avatar ${isRoot ? "team-graph-avatar--root" : ""}`}
        aria-hidden="true"
      >
        {initials}
      </div>
      <p className="team-graph-node__label">{node.label}</p>
      <span className="team-graph-node__role">
        {node.role === "owner" ? "Owner" : "Operator"}
      </span>
      {!node.active ? (
        <span className="team-graph-node__status">Inactive</span>
      ) : null}
    </article>
  );
}
