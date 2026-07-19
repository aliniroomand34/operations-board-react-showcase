import { Link } from "react-router-dom";
import {
  IMPLEMENTATION,
  SCALE_SIGNALS,
  SYSTEM_CONTEXT,
} from "@/pages/homePage.content";
import HomeWorkflowCycles from "@/pages/HomeWorkflowCycles";

function HomeHero() {
  return (
    <section
      className="ops-panel ops-hero max-w-4xl rounded-2xl p-6 sm:p-8"
      aria-labelledby="home-hero-heading"
    >
      <div className="relative z-10">
        <div className="ops-workflow-strip" aria-label="Demo traits">
          <span className="ops-status-badge">Public portfolio demo</span>
          <span className="ops-status-badge ops-status-badge--progress">
            Desktop-first
          </span>
          <span className="ops-status-badge ops-status-badge--done">
            Mock API only
          </span>
        </div>
        <h1
          id="home-hero-heading"
          className="ops-gold-text mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Operations Board
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
          Anonymized operations workflow showcase
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--gray-800)]">
          Safe frontend projection of a larger private workflow system. Domain
          language and live APIs were removed; what remains is the operator board
          experience — modular architecture, typed domain contracts, a mock API
          boundary, and behavior tests under CI.
        </p>

        <div className="ops-action-bar mt-6">
          <Link
            to="/operations"
            className="ops-btn ops-btn-primary px-5 py-2.5 text-sm"
          >
            Open Operations Board
          </Link>
          <span className="text-xs text-[var(--gray-800)]">
            Queue → assign → progress → complete
          </span>
        </div>
      </div>
    </section>
  );
}

function SystemContextSection() {
  return (
    <section aria-labelledby="system-context-heading">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="ops-context-kicker">System context</p>
          <h2
            id="system-context-heading"
            className="text-lg font-semibold text-[var(--fg)]"
          >
            Larger private workflow (documented only)
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[var(--gray-800)]">
          These layers existed in the source system. This public repo does not
          run them — it projects the board UI over a mock boundary.
        </p>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {SYSTEM_CONTEXT.map((item) => (
          <li key={item.title} className="ops-context-card">
            <p className="ops-context-kicker">{item.kicker}</p>
            <h3 className="text-sm font-semibold text-[var(--fg)]">
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--gray-800)]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ScaleSignalsSection() {
  return (
    <section aria-labelledby="scale-signals-heading">
      <header className="mb-3 flex flex-wrap items-end justify-between gap-2">
        <div>
          <p className="ops-context-kicker">Scale signals</p>
          <h2
            id="scale-signals-heading"
            className="text-lg font-semibold text-[var(--fg)]"
          >
            Private system volume &amp; ops capabilities
          </h2>
        </div>
        <p className="max-w-md text-xs leading-relaxed text-[var(--gray-800)]">
          Why the board mattered: the private product was multi-operator,
          multi-source, and realtime. Numbers below are architecture context —
          this demo still runs a mock API only.
        </p>
      </header>
      <ul className="mb-3 flex flex-wrap gap-2" aria-label="Capacity highlights">
        <li className="ops-status-badge ops-status-badge--progress">
          ≤30 inventory sources
        </li>
        <li className="ops-status-badge ops-status-badge--progress">
          ~20 concurrent operators
        </li>
        <li className="ops-status-badge ops-status-badge--progress">
          ~50 concurrent clients
        </li>
        <li className="ops-status-badge ops-status-badge--done">
          WebSocket alerts + presence
        </li>
      </ul>
      <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {SCALE_SIGNALS.map((item) => (
          <li
            key={item.title}
            className="ops-context-card ops-context-card--scale"
          >
            <h3 className="text-sm font-semibold text-[var(--fg)]">
              {item.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--gray-800)]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function PublicDemoSection() {
  return (
    <section aria-labelledby="public-demo-heading">
      <header className="mb-3">
        <p className="ops-context-kicker">Public demo</p>
        <h2
          id="public-demo-heading"
          className="text-lg font-semibold text-[var(--fg)]"
        >
          What this repository actually implements
        </h2>
      </header>
      <ul className="grid gap-3 sm:grid-cols-3">
        {IMPLEMENTATION.map((item) => (
          <li
            key={item.title}
            className="ops-context-card ops-context-card--impl"
          >
            <h3 className="text-sm font-semibold text-[var(--fg-info)]">
              {item.title}
            </h3>
            <p className="text-xs leading-relaxed text-[var(--gray-800)]">
              {item.body}
            </p>
          </li>
        ))}
      </ul>
    </section>
  );
}

function ScopeSection() {
  return (
    <section aria-label="Showcase scope">
      <ul className="grid gap-3 text-sm text-[var(--gray-800)] sm:grid-cols-2">
        <li className="ops-panel rounded-xl p-4">
          <div className="ops-workflow-strip mb-2">
            <span className="ops-status-badge ops-status-badge--ready">
              In scope
            </span>
          </div>
          <p className="leading-relaxed">
            Board UI, drag/drop assign, mock API boundary, testable domain
            helpers, desktop demo polish, CI quality gates.
          </p>
        </li>
        <li className="ops-panel rounded-xl p-4">
          <div className="ops-workflow-strip mb-2">
            <span className="ops-status-badge ops-status-badge--queued">
              Out of scope
            </span>
          </div>
          <p className="leading-relaxed">
            Real auth, private admin surfaces, live endpoints, production PII,
            live resource pools / RBAC / WebSocket servers, or claims that this
            demo runs Redis backends. Scale signals on Home are documented
            context only.
          </p>
        </li>
      </ul>
    </section>
  );
}

/**
 * Showcase landing — product-style case study for recruiters / reviewers.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-7">
      <HomeHero />
      <SystemContextSection />
      <HomeWorkflowCycles />
      <ScaleSignalsSection />
      <PublicDemoSection />
      <ScopeSection />
    </div>
  );
}
