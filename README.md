# Ops Console Demo — Public Architecture Showcase

Anonymized React case study extracted from a private SaaS operations workflow.
Product-specific language, live APIs, and real auth were removed. What ships is a
multi-route **Ops Console Demo** admin shell with modular frontend architecture, typed
contracts, shared mock store, and CI gates (including a publishable slang check).

**Claim level:** Strong Mid+ → Senior-ready learning track — not “Senior expert” or
“Expert TypeScript.” **Glossary and boundaries:**
[docs/PUBLIC_SURFACE.md](docs/PUBLIC_SURFACE.md).

**Shipped today:** Admin shell at `/app/*` — Overview, Inventory Pipeline, Extension
Acquisition Simulator, Operations Board, Finance Summary, Team Activity, remaining
honest stub routes, slim Case Study — over a shared in-memory mock store. `/`
redirects to `/app/overview`; `/operations` redirects to `/app/operations`.

## Live demo

Desktop-focused static site (mock API only — no secrets, no server).

**Open the panel:** `/app/overview` (default entry after `/`)

**Live demo:** https://operations-board-react-showcase.vercel.app

Source: https://github.com/aliniroomand34/operations-board-react-showcase

Architecture FAQ: [docs/INTERVIEW_DEFENSE.md](docs/INTERVIEW_DEFENSE.md) ·
Demo script (~2 min): [docs/RECRUITER_DEMO_SCRIPT.md](docs/RECRUITER_DEMO_SCRIPT.md)

## Problem

Private operations systems often mix strong frontend craft (boards, workflows,
domain rules) with sensitive product language and real backends. That mix is hard
to show in a public portfolio without leaking business detail.

This repo answers: **can architecture ownership on a real-shaped board workflow
be demonstrated safely — while still explaining the larger system that board
belonged to?**

## System Context

The private source system was larger than a single board. At a category level it
included:

- **Automation intake** — bots / automated channels that brought work into the
  workflow without operators typing every request by hand
- **Browser-based operator extensions** — tools that reduced friction for
  operators and connected their actions into the same workflow
- **Backend workflow services** — orchestration for validation, state transitions,
  auditability, and integration boundaries
- **Redis-backed transient state / queue coordination** — short-lived workflow
  state, locks, rate limiting, or queue-like coordination in production (**context
  only — not live in this repo**)
- **WebSocket / realtime channel** — live operational updates to surfaces that
  operators watched (**context only**)
- **Operations board (frontend)** — the human-facing projection for queue, assign,
  in-progress, and completion (**implemented** in this demo)

This repository shows only a **safe frontend projection** of that board.
Private integrations are replaced by a mock API and synthetic transitions. The
demo does **not** run Redis, WebSockets, bots, or extensions ΓÇö it documents that
production architecture context and implements the anonymized board slice.

### Private system scale signals (context only)

| Capability | What it meant in production |
| --- | --- |
| Settlement & finance summaries | Settled vs unsettled work and related financial-ops summaries for operators |
| Resource pool Γëñ30 sources | Unnamed inventory sources; per-source daily capacity; usage-aware rotation; parallel lanes; load-based failover |
| Bulk intake ΓåÆ extension queue | High-volume requests composed across the pool, executed sequentially by a browser extension with paced delays, rate limits, retry/backoff |
| Client fulfillment | Client-requested fulfillment via manual operator steps or automated handoffs |
| Clients & transactions registry | Persistent client records and transaction history for auditability |
| Post-operation verification | Extension re-check after client completion before trusting the outcome |
| Realtime alerts & errors | WebSocket push of live warnings / failures to operator surfaces |
| Team concurrency & roles | ~20 concurrent primary operators, ~50 concurrent clients, owner-level operators, plus audit/oversight |
| Live presence / connection health | Realtime online status for inventory sources and operator extensions |
| Ops resilience patterns | Bounded queues / backpressure, idempotent transitions, reconnect backoff, Redis-backed locks or rate coordination |

**Capacity snapshot (private context):** Γëñ30 inventory sources ┬╖ ~20 concurrent
operators ┬╖ ~50 concurrent clients ┬╖ WebSocket alerts + presence

```mermaid
flowchart TD
  automationBot["Automation Intake Bot"] -->|"sanitized event context"| backendWorkflow["Backend Workflow Services"]
  operatorExtensions["Browser Operator Extensions"] -->|"operator actions"| backendWorkflow
  backendWorkflow --> redisState["Redis / Workflow State"]
  redisState --> realtimeChannel["WebSocket / Realtime Channel"]
  realtimeChannel -->|"private source events"| operationsSurface["Operations Surface"]
  operationsSurface --> publicBoard["Public Operations Board Demo"]
  publicBoard --> mockApi["Mock API Boundary"]
  mockApi --> syntheticData["Synthetic Data"]
```

### Workflow cycles (graphs)

Same cycles appear as interactive-style graphs on the Home landing. Below is the
README / GitHub-rendered form. Only the **board lifecycle** is implemented in
this demo; the others are private-system context.

#### 1) Board lifecycle ΓÇö **in this demo**

```mermaid
flowchart LR
  queue["≡ƒôÑ Queue"] --> assign["≡ƒöù Assign"]
  assign --> progress["ΓÅ│ In progress"]
  progress --> complete["Γ£à Complete"]
  complete -.->|"next request"| queue
```

#### 2) Resource pool cycle ΓÇö context only

```mermaid
flowchart LR
  pick["≡ƒöÄ Pick source"] --> cap["≡ƒôÅ Capacity OK?"]
  cap -->|"yes"| use["Γû╢∩╕Å Use / parallel lanes"]
  cap -->|"exhausted"| rotate["≡ƒöü Rotate by same-day usage"]
  use --> rotate
  rotate -->|"load high"| failover["≡ƒöÇ Fail over to freer operator system"]
  failover --> pick
  rotate --> pick
```

#### 3) Bulk ΓåÆ extension queue ΓÇö context only

```mermaid
flowchart LR
  bulk["≡ƒô¥ Bulk request"] --> extQ["≡ƒô¼ Extension queue"]
  extQ --> paced["≡ƒÉó Paced sequential exec"]
  paced --> verify["≡ƒ¢í∩╕Å Post-op verify"]
  verify -->|"risk / retry"| extQ
  verify --> registry["≡ƒôÆ Registry"]
```

#### 4) Client fulfillment ΓÇö context only

```mermaid
flowchart LR
  ask["≡ƒæñ Client ask"] --> path{"ΓÜÖ∩╕Å Manual or auto?"}
  path --> fulfill["≡ƒôñ Fulfill"]
  fulfill --> registry2["≡ƒôÆ Client / txn registry"]
  registry2 --> settleFeed["≡ƒÆ░ Settlement feed"]
```

#### 5) Settlement cycle ΓÇö context only

```mermaid
flowchart LR
  done["Γ£à Completed ops"] --> classify["ΓÜû∩╕Å Classify"]
  classify --> settled["≡ƒÆÜ Settled"]
  classify --> unsettled["≡ƒºí Unsettled"]
  settled --> summary["≡ƒôè Finance summary"]
  unsettled --> summary
```

#### 6) Realtime presence & alerts ΓÇö context only

```mermaid
flowchart LR
  beat["≡ƒÆô Heartbeat / presence"] --> redis["≡ƒùä∩╕Å Redis state"]
  redis --> ws["ΓÜí WebSocket push"]
  ws --> alert["≡ƒÜ¿ Alert / operator UI"]
  alert -.->|"reconnect backoff"| beat
```

## Scope

**In scope (shipped now)**

- Ops Console Demo admin shell (`/app/*`) — sidebar, top bar, demo footer strip
- **Overview** — KPI cards + Recharts (pie/bar) + summary tables from shared mock store
- **Inventory Pipeline** — allowed catalog, batch request form, column workflow
- **Extension Acquisition Simulator** — paced in-app acquisition simulation
- **Operations Board** — assign, in-progress, complete (drag/drop + keyboard path)
- **Finance Summary** — synthetic KPIs + Recharts series from the shared mock store
- **Team Activity** — synthetic org graph + activity feed (no real RBAC)
- Honest **stub** routes for remaining secondary IA — “Not available in this demo version”
- **Case Study** — slim architecture page at `/app/case-study`
- Legacy redirects: `/` → `/app/overview`, `/operations` → `/app/operations`
- UI / Logic / API / helpers separation per feature
- Shared in-memory mock store + synthetic data (`client-001`, `batch-001`, …)
- Visible loading / error / empty states with recovery actions
- TypeScript (strict) on the public demo surface
- Vitest + RTL tests on the showcase slice
- GitHub Actions CI + publishable slang gate + Vercel / Netlify static deploy configs
- Short ADRs, anonymization glossary, and resume-aligned wording
- Documented private workflow context (categories only)

**Out of scope**

- Live Redis, WebSocket servers, automation bots, or real browser extensions
- Real backends, tokens, production domains, or auth claims
- Production-grade responsive design (desktop-first)
- Full WCAG certification (semantic HTML + keyboard basics only)
- Private product / game / messaging brand names in publishable paths

Privacy boundary checklist: [docs/PUBLIC_SURFACE.md](docs/PUBLIC_SURFACE.md)

## Architecture

File and folder naming (PascalCase UI, `*.helpers` / `*.api` suffixes, no
`ui/`/`logic/` folders): [docs/FILE_CONVENTIONS.md](docs/FILE_CONVENTIONS.md).

### Private source system context

In the private product, the board was one surface among several. Automation intake
and operator extensions fed backend workflow services; those services coordinated
transient state (including Redis-backed patterns) and pushed updates over a
realtime channel. Operators used the board to see queued work, assign inventory
batches, track in-progress operations, and record completion.

That context explains **why** the public board has queue ΓåÆ assign ΓåÆ in-progress ΓåÆ
complete semantics. It is not implemented here as live infrastructure.

### Public demo implementation

What this repository actually ships:

```
/ → /app/overview
AdminDemoLayout (shell)
  ├── OverviewPage (shared store KPIs)
  ├── InventoryPipelinePage → ExtensionAcquisitionSimPage (job query)
  ├── OperationsBoardPage
  ├── DemoStubPage (secondary nav)
  └── HomePage (Case Study at /app/case-study)
Features → use*Logic hooks → *.helpers → *.api → mocks/demoStore
```

| Layer | Responsibility |
| --- | --- |
| Page / columns / modals | Presentation, interaction, a11y labels |
| `useOperationsBoardLogic` | Orchestration: load board, open modals, call API |
| `operationsBoard.helpers` | Pure rules (validation, capacity, drop ids) |
| `operationsBoard.api` | Async boundary (delay, failure, transitions) |
| `operationsBoard.types` | Domain contract shared across layers |

Domain language is public (see glossary): operation request, client, inventory batch,
allowed catalog, linked accounts. Drag a ready batch onto a queued client, confirm
assignment, then complete the in-progress operation — or use the keyboard assign path
for the same outcome.

Decision records:

- [001 ΓÇö Extract portfolio slice](docs/adr/001-extract-portfolio-slice.md)
- [002 ΓÇö Mock API boundary](docs/adr/002-mock-api-boundary.md)
- [003 ΓÇö TypeScript migration strategy](docs/adr/003-typescript-migration-strategy.md)
- [004 ΓÇö Testing strategy](docs/adr/004-testing-strategy.md)
- [005 ΓÇö Showcase deps & typed surface hygiene](docs/adr/005-showcase-deps-and-typed-surface.md)

Resume bullets: [docs/RESUME_BULLETS.md](docs/RESUME_BULLETS.md)

## Technology Context

| Concern | Private source system (context) | This public demo |
| --- | --- | --- |
| Redis | Transient workflow state, rate limiting, locks, or queue-like coordination | Documented only |
| WebSocket / realtime | Live operational updates to operator surfaces | Mock API delays and confirmed transitions |
| Backend orchestration | Validation, state transitions, auditability, integration boundary | Simulated inside `operationsBoard.api` + pure helpers |
| Automation intake | Brought work into the workflow without manual entry for every case | Synthetic queued requests in seed data |
| Operator extensions | Reduced operator friction; connected actions into the workflow | **Extension Acquisition Simulator** — in-app mock only |
| Capacity / team scale | ≤30 inventory sources, ~20 operators / ~50 clients, settlement, presence | Documented on Case Study + README — not live RBAC / pool UI |
| Frontend console | Typed domain contracts, operator workflows, accessible modals, DnD + keyboard | **Implemented** — multi-route Ops Console Demo |

## Demo Walkthrough

A short path a reviewer can follow in ~2 minutes. Spoken lines:
[docs/RECRUITER_DEMO_SCRIPT.md](docs/RECRUITER_DEMO_SCRIPT.md).

1. **`/app/overview`** — KPI baseline from shared mock store
2. **Inventory Pipeline** — catalog + batch request → acquisition job
3. **Extension Simulator** — honesty banner; paced steps from form payload
4. **Operations Board** — assign ready batch → in progress → complete
5. **Finance Summary or Team Activity** — synthetic charts / org graph (Demo badge)
6. **One stub route** — honest unavailable panel (e.g. Clients)
7. **Case Study** (optional) — architecture depth, not the first impression
8. **Overview again** (optional) — confirm KPI numbers moved

Recovery: demo controls on board/pipeline for empty, error + retry, and force-fail paths.

## What this proves

| Proves | Does not prove |
| --- | --- |
| Frontend state orchestration for an operations board | Live Redis / WebSocket engineering in this repo |
| Domain rule extraction into pure, testable helpers | Ownership of the full private backend |
| Typed contracts across UI, hook, API, and mocks | Exhaustive TypeScript mastery across every codebase |
| Mock API boundary suitable for static deploy | Production API or auth design |
| Accessibility basics (semantics, modal focus, status regions) | Full WCAG certification |
| Behavior-focused Vitest + RTL coverage | Exhaustive E2E / DnD pointer coverage |
| Safe anonymization for a public portfolio | That the demo is the entire private product |

## Tradeoffs

| Choice | Why | Cost |
| --- | --- | --- |
| Showcase four interactive mocks + stubs, not the full product | Clear reviewer signal + safer public surface | Broader private surfaces stay category-only in docs |
| Document bot / extensions / Redis / realtime as context | Shows the boardΓÇÖs place in a real workflow system | Reviewers must read ΓÇ£contextΓÇ¥ vs ΓÇ£implementedΓÇ¥ carefully |
| Mock API instead of real HTTP | Zero secrets; static deploy; demoable async states | Not a live backend / realtime story |
| TypeScript + CI on the public demo | Refactor safety on the surface reviewers browse | Incremental migration, not a greenfield TS rewrite of a full product |
| Test helpers + modal assign, not DnD pointers | Stable, behavior-focused tests | Drag choreography is manual demo only |
| Desktop-first polish | Matches the real private product posture | No responsive portfolio claim |

## Testing strategy

- **Unit** ΓÇö domain helpers and mock API status transitions
- **RTL** ΓÇö loading, error + retry, empty, assign / assign-more, cancel queued,
  complete, modal Escape/close/focus restore, route shell, ErrorBoundary
- **Intentionally skipped** ΓÇö CSS layout, pointer physics for drag/drop

```bash
npm run test
```

See [ADR 004](docs/adr/004-testing-strategy.md) for what is and is not tested.

## Privacy / anonymization

- Synthetic ids and amounts only
- No real client PII, private endpoints, or production credentials
- Domain language uses public glossary terms only (operation request, client,
  inventory batch, allowed catalog, linked accounts)
- Larger system pieces are described by **category** — never by private product names
- Home workflow cycles label **`demo`** (board lifecycle) vs **`context`** (private
  system only)

## Engineering notes

Architecture boundaries, naming, and scope cuts are intentional decisions owned in
review. AI tools may accelerate drafting; tradeoffs remain interview-defendable by
the author.

## Next improvements

- Shorter orchestration hook and clearer transition helpers
- Thin real HTTP adapter behind the same API boundary (optional for a static demo)
- Keep the live deploy aligned with `main` after merges

## Stack (this repository)

What runs in CI and ships in the static demo — not private infrastructure.

- React 19 + Vite 7
- TypeScript (strict) on the public demo surface
- React Router 7
- Tailwind CSS 4 (`@tailwindcss/vite`)
- `@dnd-kit` for board drag/drop
- Vitest + React Testing Library

Redis, WebSocket, and live HTTP APIs are **documented context only** — see
[PUBLIC_SURFACE.md](docs/PUBLIC_SURFACE.md).

## Run locally

```bash
cd frontend
npm install
npm run dev
```

No `.env` or API URL is required. Interactive features read and write through the
shared mock store and feature API modules under `src/mocks/` and `src/features/*/`.

```bash
npm run typecheck
npm run lint
npm run test
npm run build
npm run check:slang
npm run preview
npm run ci
```

## Deploy (free tier)

Static hosting only ΓÇö the mock API runs in the browser.

### Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. If the Git root is this package: `vercel.json` builds with `npm run build` and
   publishes `dist`. If the Git root is a monorepo parent: use the parent
   `vercel.json` that points at `frontend`.
3. Deploy. No environment variables are required.

### Netlify

1. Import this repository in [Netlify](https://www.netlify.com).
2. If the Git root is this package: `netlify.toml` runs `npm run build` and publishes `dist`.
   If the Git root is a monorepo parent: use the parent `netlify.toml` with `base = frontend`.
3. Deploy. No environment variables are required.

SPA routes (`/app/*`, legacy `/operations`, unknown paths) are rewritten to `index.html` in both configs.

## CI

GitHub Actions runs on push/PR (same gates as `npm run ci`):

- Package-as-repo-root: [`.github/workflows/ci.yml`](.github/workflows/ci.yml)
- Monorepo parent (workspace copy): [`.github/workflows/ci.yml`](../.github/workflows/ci.yml)

1. `npm ci`
2. `npm run typecheck`
3. `npm run lint`
4. `npm run test`
5. `npm run build`
6. `npm run check:slang`

## Accessibility (demo basics)

- Skip link to main content
- Semantic headings, buttons, and column regions
- Loading / error / empty states with `role="status"` / `role="alert"`
- Modals: `aria-modal`, labelled title, Escape to close, restore focus
- Visible `:focus-visible` outlines
- Scope: desktop demo polish, not a full accessibility certification
