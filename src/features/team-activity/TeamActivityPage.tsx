import { TeamActivityFeed } from "./TeamActivityFeed";
import { TeamOrgGraph } from "./TeamOrgGraph";
import { useDemoTeam } from "./useDemoTeam";

/**
 * Team Activity — mock org graph + activity feed from the shared demo store.
 * No real RBAC or member management.
 */
export default function TeamActivityPage() {
  const { graph, feed } = useDemoTeam();

  return (
    <div className="flex flex-col gap-5">
      <header className="admin-page-header">
        <div>
          <p className="admin-page-kicker">Operators</p>
          <h1 className="admin-page-title">Team Activity</h1>
          <p className="admin-page-subtitle">
            Demo — synthetic team graph and activity feed. No live access control
            or member invites.
          </p>
        </div>
        <span className="ops-status-badge ops-status-badge--progress">
          Demo — synthetic team
        </span>
      </header>

      <TeamOrgGraph graph={graph} />
      <TeamActivityFeed feed={feed} />
    </div>
  );
}
