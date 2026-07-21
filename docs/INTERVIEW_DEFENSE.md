# Architecture FAQ — Operations Board showcase

Answers for follow-up questions after the
[2-minute demo script](./RECRUITER_DEMO_SCRIPT.md). Scope stays clear: what this
repo **implements** vs what is **private-system context only**.

Glossary and claim boundaries: [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md).

## Topics covered

- Why this slice?
- Why remove the real backend?
- Role of automation intake / operator extensions
- Redis / WebSocket in the private architecture
- Capacity signals
- Why mock + document instead of shipping live infrastructure
- Preserving UI/UX while renaming the domain
- What this repo proves — and what it does not
- Context vs implemented labeling
- Production follow-on boundaries

---

## Q&A

### Why did you choose this slice?

> The highest-signal public slice is a multi-route Ops Console Demo: Overview KPIs,
> Inventory Pipeline, Extension Acquisition Simulator, and Operations Board — all over
> a shared mock store — plus Finance Summary and Team Activity as synthetic demo
> pages, with honest stubs for remaining secondary IA. Each feature keeps a clean
> UI / Logic / API / helpers split. That proves scale without shipping the full private
> product or live backends.

### Why remove the real backend?

> Privacy and deployability. A public portfolio cannot ship production endpoints,
> tokens, or realistic client data. Keeping an API-shaped boundary
> (`operationsBoard.api`) means the UI still thinks in async load / mutate /
> failure / retry — but the implementation is an in-memory mock with synthetic ids.
> Reviewers get architecture without an NDA.

### What role did the automation intake bot and operator extensions play in the private system?

> **Automation intake** brought work into the workflow without operators manually
> creating every request. **Browser-based operator extensions** reduced friction for
> operators and connected their actions into the same backend workflow. Neither runs
> in this public repo — they explain why the board has a queue and operator actions
> at all. The **Extension Acquisition Simulator** is an in-app stand-in, not
> a real Chrome extension or provider site.

### What problem did Redis / WebSocket solve privately?

> In production architecture context, **Redis-backed patterns** supported transient
> workflow state, locks, rate limiting, or queue-like coordination. A **WebSocket /
> realtime channel** pushed live operational updates to surfaces operators watched.
> This demo does not run those systems; mock delays and confirmed transitions stand
> in so the board can deploy as a static site.

### How large was the private system — what scale signals matter?

> Category-level signals only: a managed **inventory-source pool (≤30)** with
> per-source daily capacity and usage-aware rotation; **~20 concurrent primary
> operators** and **~50 concurrent clients**; owner-level operators plus an
> **audit/oversight** role; settlement / finance summaries; client + transaction
> registry; bulk work handed to an **extension queue** with paced sequential
> execution; post-operation verification; and **live presence** for sources and
> extensions. Those explain why the console existed. This public repo ships the
> anonymized multi-surface mock console — scale tables on Case Study are **`context`**,
> not live pool / RBAC UI.

### Why document Redis / WebSocket / bots instead of implementing them live here?

> Implementing them in a public static showcase would either fake a backend poorly
> or recreate private infrastructure outside the portfolio goal. The clearer move is:
> document the larger system so reviewers understand the board’s place in it, and
> implement only the anonymized frontend projection under CI.

### How did you preserve UI/UX while removing sensitive domain language?

> The operational feel stayed: dark shell, dense columns, status badges, action-first
> controls, loading / error / empty recovery, accessible modals. Domain terms were
> renamed per the public glossary (operation request, client, inventory batch, allowed
> catalog, linked accounts) and CSS chrome uses `ops-*` naming. What left was sensitive
> product language — not polish, density, or workflow clarity.

### What does this repository prove? What does it not prove?

| Proves | Does not prove |
| --- | --- |
| Multi-surface admin orchestration (Pipeline → Ext Sim → Board) | Live Redis / WebSocket engineering in this repo |
| Shared mock store cohesion (Overview KPIs move after actions) | Ownership of the full private backend |
| Typed contracts across UI, hook, API, mocks on the showcase slice | Exhaustive TypeScript mastery across every codebase |
| Mock API boundary fit for static deploy | Production auth / API design |
| Accessibility basics + behavior tests under CI | Full WCAG or exhaustive E2E / DnD pointer coverage |
| Safe anonymization for a public portfolio | That the demo is the entire private product |
| Honest **demo** / **context** / **stub** labeling | Expert-level testing or responsive production UI |

### How do you label context vs implemented in the UI?

> Interactive routes (Overview, Pipeline, Extension Simulator, Board) are **`demo`**.
> Case Study workflow cycles use `tone: "demo" \| "context"` — only the **board
> lifecycle** is **`demo`**; pool, bulk-extension, settlement, and realtime cycles are
> **`context`** (behind Production context). Stub nav items stay **`stub`** with an
> explicit unavailable panel — never a broken API spinner.

### If you built a production version next, what boundaries would you add?

> Keep the same feature boundary and typed contracts. Behind `operationsBoard.api`,
> swap the mock for a thin HTTP adapter. Reintroduce realtime as a separate channel
> (subscribe → invalidate or patch board state), not mixed into presentational
> components. Put validation that must be authoritative on the server; keep pure
> helpers for optimistic client checks. Split the orchestration hook when load /
> mutation / modal / drag concerns grow. Auth and private admin surfaces stay
> outside this board’s public claim.

## Context vs implementation (quick reference)

| Phrase that overstates | Accurate phrase |
| --- | --- |
| “This demo implements Redis and WebSockets.” | “The private system used Redis / realtime; this demo mocks those integrations.” |
| “This demo runs a 30-source pool and live team RBAC.” | “Those were private capacity signals; the public demo documents them and ships a multi-surface mock console.” |
| “This is the full private product.” | “This is a safe frontend projection — multi-route mock console with honest stubs.” |
| “Production-grade responsive design.” | “Desktop-first, matching the private operator posture.” |
| “Expert TypeScript / senior testing expert.” | “Strict TS and behavior tests on the showcase slice — active learning journey.” |
| “Real browser extension acquires on provider site.” | “Extension Acquisition Simulator is an in-app mock; no live extension or scraping.” |

## Related docs

- [PHASE5_SCORE.md](./PHASE5_SCORE.md) — TA/CTO re-score vs Phase 5 fix list
- [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md) — timed walkthrough
- [RESUME_BULLETS.md](./RESUME_BULLETS.md) — resume wording
- [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md) — glossary, stack, publishable paths
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) — CI and privacy gate
