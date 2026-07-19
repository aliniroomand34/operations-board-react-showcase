import { WORKFLOW_CYCLES } from "@/pages/homePage.content";

function CycleGraph({
  nodes,
  loopHint,
}: {
  nodes: ReadonlyArray<{ label: string }>;
  loopHint: string;
}) {
  return (
    <div className="ops-cycle-graph" role="list" aria-label="Cycle steps">
      {nodes.map((node, index) => (
        <div key={node.label} className="ops-cycle-step-wrap" role="listitem">
          {index > 0 ? (
            <span className="ops-cycle-arrow" aria-hidden="true">
              →
            </span>
          ) : null}
          <div className="ops-cycle-node">
            <span className="ops-cycle-node-label">{node.label}</span>
          </div>
        </div>
      ))}
      <div className="ops-cycle-loop" title={loopHint}>
        <span aria-hidden="true">↻</span>
        <span className="ops-cycle-loop-text">{loopHint}</span>
      </div>
    </div>
  );
}

/**
 * Visual workflow cycles — board (demo) + private-system context graphs.
 */
export default function HomeWorkflowCycles() {
  return (
    <section aria-labelledby="workflow-cycles-heading">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="ops-context-kicker">Workflow cycles</p>
          <h2
            id="workflow-cycles-heading"
            className="text-lg font-semibold text-[var(--fg)]"
          >
            How work moved through the system
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[var(--gray-800)]">
          One cycle runs in this demo; the rest are private production context
          only.
        </p>
      </header>

      <ul className="grid gap-3 lg:grid-cols-2">
        {WORKFLOW_CYCLES.map((cycle) => (
          <li
            key={cycle.id}
            className={
              cycle.tone === "demo"
                ? "ops-context-card ops-context-card--impl"
                : "ops-context-card ops-context-card--scale"
            }
          >
            <div className="ops-workflow-strip mb-2">
              <span
                className={
                  cycle.tone === "demo"
                    ? "ops-status-badge ops-status-badge--done"
                    : "ops-status-badge ops-status-badge--queued"
                }
              >
                {cycle.tone === "demo" ? "In this demo" : "Context only"}
              </span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--fg)]">
              {cycle.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--gray-800)]">
              {cycle.blurb}
            </p>
            <CycleGraph nodes={cycle.nodes} loopHint={cycle.loopHint} />
          </li>
        ))}
      </ul>
    </section>
  );
}
