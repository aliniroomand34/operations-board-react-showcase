import { Link } from "react-router-dom";
import {
  IMPLEMENTATION,
  SCALE_SIGNALS,
  SHIPPED_SURFACES,
  SYSTEM_CONTEXT,
} from "@/pages/homePage.content";
import HomeWorkflowCycles from "@/pages/HomeWorkflowCycles";
import { ADMIN_DEMO_BASE } from "@/layouts/adminDemoNav";

function CaseStudyHero() {
  return (
    <section
      className="ops-panel ops-hero max-w-4xl rounded-2xl p-6 sm:p-8"
      aria-labelledby="case-study-heading"
    >
      <div className="relative z-10">
        <div className="ops-workflow-strip" aria-label="Demo traits">
          <span className="ops-status-badge">Case study</span>
          <span className="ops-status-badge ops-status-badge--progress">
            Architecture honesty
          </span>
          <span className="ops-status-badge ops-status-badge--done">
            Mock API only
          </span>
        </div>
        <h1
          id="case-study-heading"
          className="ops-gold-text mt-3 text-4xl font-semibold tracking-tight sm:text-5xl"
        >
          Ops Console Demo
        </h1>
        <p className="mt-2 text-sm font-semibold uppercase tracking-[0.16em] text-[var(--fg-muted)]">
          Anonymized operations admin — architecture notes
        </p>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--gray-800)]">
          The interactive product lives on Overview, Inventory Pipeline, Extension
          Simulator, and Operations Board. This page documents boundaries, private
          production context, and what the public repo actually ships.
        </p>

        <div className="ops-action-bar mt-6">
          <Link
            to={`${ADMIN_DEMO_BASE}/overview`}
            className="ops-btn ops-btn-primary px-5 py-2.5 text-sm"
          >
            Open Overview
          </Link>
          <span className="text-xs text-[var(--gray-800)]">
            Start the live demo — not this essay
          </span>
        </div>
      </div>
    </section>
  );
}

function ShippedSurfacesSection() {
  return (
    <section aria-labelledby="shipped-surfaces-heading">
      <header className="mb-3">
        <p className="ops-context-kicker">Interactive mocks</p>
        <h2
          id="shipped-surfaces-heading"
          className="text-lg font-semibold text-[var(--fg)]"
        >
          What runs in this repository
        </h2>
      </header>
      <ul className="grid gap-3 sm:grid-cols-2">
        {SHIPPED_SURFACES.map((surface) => (
          <li key={surface.route} className="ops-context-card ops-context-card--impl">
            <div className="ops-workflow-strip mb-2">
              <span className="ops-status-badge ops-status-badge--done">Demo</span>
            </div>
            <h3 className="text-sm font-semibold text-[var(--fg-info)]">
              {surface.title}
            </h3>
            <p className="mt-1 text-xs leading-relaxed text-[var(--gray-800)]">
              {surface.body}
            </p>
            <Link
              to={surface.route}
              className="ops-btn ops-btn-secondary mt-3 inline-flex px-3 py-1.5 text-xs"
            >
              Open {surface.title}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SystemContextSection() {
  return (
    <section aria-labelledby="system-context-heading">
      <header className="mb-3">
        <h2
          id="system-context-heading"
          className="text-lg font-semibold text-[var(--fg)]"
        >
          Private workflow layers
        </h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-[var(--gray-800)]">
          Category-level context from the source system — not implemented live in
          this static demo.
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
      <header className="mb-3">
        <h2
          id="scale-signals-heading"
          className="text-lg font-semibold text-[var(--fg)]"
        >
          Private system volume &amp; ops capabilities
        </h2>
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
        <p className="ops-context-kicker">Engineering proof</p>
        <h2
          id="public-demo-heading"
          className="text-lg font-semibold text-[var(--fg)]"
        >
          Architecture boundaries under CI
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
            Admin shell, shared mock store, interactive workflows (Overview,
            Pipeline, Extension Simulator, Board, Finance, Team), honest stub
            routes, modular UI / Logic / API / helpers, behavior tests, desktop
            demo polish.
          </p>
        </li>
        <li className="ops-panel rounded-xl p-4">
          <div className="ops-workflow-strip mb-2">
            <span className="ops-status-badge ops-status-badge--queued">
              Out of scope
            </span>
          </div>
          <p className="leading-relaxed">
            Real auth, live endpoints, production PII, Redis / WebSocket servers,
            real browser extensions, or claims that private pool / settlement UI
            runs here. Production context below is documented only.
          </p>
        </li>
      </ul>
    </section>
  );
}

/**
 * Slim case study route — architecture honesty, not the first recruiter impression.
 */
export default function HomePage() {
  return (
    <div className="flex flex-col gap-7">
      <CaseStudyHero />
      <ShippedSurfacesSection />
      <HomeWorkflowCycles tone="demo" />
      <PublicDemoSection />
      <ScopeSection />

      <details className="ops-panel rounded-2xl p-5 sm:p-6">
        <summary className="cursor-pointer text-sm font-semibold text-[var(--fg)]">
          Production context (private system — not live in this demo)
        </summary>
        <div className="mt-5 flex flex-col gap-7">
          <SystemContextSection />
          <HomeWorkflowCycles tone="context" />
          <ScaleSignalsSection />
        </div>
      </details>
    </div>
  );
}
