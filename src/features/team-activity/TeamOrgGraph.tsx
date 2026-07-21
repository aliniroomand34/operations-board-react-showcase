import { TeamGraphNodeCard } from "./TeamGraphNodeCard";
import type { TeamGraphModel } from "./team.types";

export interface TeamOrgGraphProps {
  graph: TeamGraphModel;
}

/**
 * Custom CSS/DOM org tree — owner root with operator branches.
 * Presentational only; no RBAC mutations.
 */
export function TeamOrgGraph({ graph }: TeamOrgGraphProps) {
  const { owner, operators, memberCount } = graph;
  const branchCount = operators.length;

  return (
    <section
      className="admin-page-panel rounded-2xl p-5 sm:p-6"
      aria-labelledby="team-operators-heading"
    >
      <header className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h2
            id="team-operators-heading"
            className="text-sm font-semibold uppercase tracking-wide text-[var(--fg)]"
          >
            Team graph
          </h2>
          <p className="mt-2 text-sm text-[var(--gray-800)]">
            Synthetic operators for the demo org tree — no real access control.
          </p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">
          {memberCount} members
        </span>
      </header>

      {memberCount === 0 ? (
        <p className="mt-6 text-sm text-[var(--gray-800)]">
          No team members in this demo preset.
        </p>
      ) : (
        <div className="team-graph mt-6" role="img" aria-label="Team organization graph">
          {owner ? <TeamGraphNodeCard node={owner} isRoot /> : null}

          {branchCount > 0 ? (
            <div className="team-graph__branches">
              <div className="team-graph__spine" aria-hidden="true" />
              {branchCount > 1 ? (
                <div
                  className="team-graph__rail"
                  style={{
                    width: `${Math.min(branchCount * 7.5, 28)}rem`,
                  }}
                  aria-hidden="true"
                />
              ) : null}
              <ul className="team-graph__list">
                {operators.map((node) => (
                  <li key={node.id} className="team-graph__branch">
                    <div className="team-graph__twig" aria-hidden="true" />
                    <TeamGraphNodeCard node={node} />
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </section>
  );
}
