import type { TeamFeedItem } from "./team.types";

export interface TeamActivityFeedProps {
  feed: TeamFeedItem[];
}

function formatFeedTime(iso: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}

export function TeamActivityFeed({ feed }: TeamActivityFeedProps) {
  return (
    <section
      className="admin-page-panel rounded-2xl p-5 sm:p-6"
      aria-labelledby="team-activity-feed-heading"
    >
      <h2
        id="team-activity-feed-heading"
        className="text-sm font-semibold uppercase tracking-wide text-[var(--fg)]"
      >
        Recent activity
      </h2>
      <p className="mt-2 text-sm text-[var(--gray-800)]">
        Seeded events plus short live rows derived from pipeline and board state.
      </p>

      {feed.length === 0 ? (
        <p className="mt-4 text-sm text-[var(--gray-800)]">
          No activity events in this demo preset.
        </p>
      ) : (
        <ul className="team-activity-feed mt-4">
          {feed.map((item) => (
            <li key={item.id} className="team-activity-feed__item">
              <div className="team-activity-feed__meta">
                <span className="team-activity-feed__actor">{item.actorLabel}</span>
                <time
                  className="team-activity-feed__time"
                  dateTime={item.at}
                >
                  {formatFeedTime(item.at)}
                </time>
              </div>
              <p className="team-activity-feed__action">{item.action}</p>
              <p className="team-activity-feed__detail">{item.detail}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
