# Resume bullets — Operations Board showcase

## Primary project bullets (pick 2–3)

- Extracted and anonymized a multi-column operations board from a private SaaS
  workflow into a public React showcase, preserving modular architecture
  (UI / Logic / API / helpers) while documenting automation intake, operator
  extensions, backend orchestration, and capacity signals (multi-source pool,
  team concurrency, realtime presence) as production context only.
- Designed a mock API boundary and synthetic dataset so the board demo deploys as
  a static site with loading, error, empty, and recovery states — no secrets or
  live backends.
- Migrated the public demo surface to TypeScript (strict domain contracts,
  helpers, orchestration hook, and UI props) with CI typecheck.
- Added Vitest coverage for pure domain helpers and mock transitions, plus React
  Testing Library behavior tests for board workflows (assign, assign-more, cancel,
  complete, route shell, ErrorBoundary) gated in CI.
- Wrote ADRs that separate private system context (Redis / realtime / workflow
  services) from what this repository implements.

## One-liner summary (About / LinkedIn)

Anonymized operations board from private SaaS work — modular React architecture,
mock API boundary, TypeScript + tests under CI; larger workflow (intake,
extensions, backend, realtime) documented as context only.

## Skills phrasing

| Prefer | Scope note |
| --- | --- |
| React 19, Vite, modular feature architecture | Board slice, not a full platform rewrite |
| TypeScript on a production-shaped slice | Strict contracts + CI typecheck on the public demo |
| Vitest + RTL for helpers and board behavior | Behavior coverage; DnD pointer physics is manual demo |
| Desktop-focused operations UI (drag/drop + keyboard assign) | Matches private operator posture |
| Clear ownership of architecture boundaries under AI-assisted drafting | Boundaries and scope cuts stay human decisions |
| Redis / realtime / backend as documented private context | Not claimed as live in this static demo |

## Interview anchor (30 seconds)

> I extracted one high-signal board workflow from a private product, renamed the
> domain for public safety, and kept the separation of UI, orchestration, pure
> helpers, and an API boundary. The private system also had automation intake,
> operator extensions, and Redis / realtime coordination — those stay documented
> context. The public demo uses a mock API so it deploys statically. TypeScript
> and tests cover the slice reviewers browse, and every boundary is defendable.

## Full walkthrough

- Timed live demo: [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md)
- Architecture FAQ: [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md)
