# Resume bullets — Ops Console Demo showcase

**Claim level:** Strong Mid+ → Senior-ready learning track — not “Senior expert” or
“Expert TypeScript.” See [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md) for glossary and
boundaries.

## Primary project bullets (pick 2–3)

- Built a multi-route **Ops Console Demo** admin shell (LTR English) with a shared
  in-memory mock store — Overview KPIs, Inventory Pipeline (allowed catalog + batch
  request), in-app Extension Acquisition Simulator, Operations Board assign
  lifecycle, Finance Summary charts, and Team Activity org graph — plus honest
  stub routes for remaining secondary IA.
- Extracted and anonymized operator workflows from a private SaaS product into a
  public React showcase, preserving modular architecture (UI / Logic / API /
  helpers) while documenting automation intake, operator extensions, backend
  orchestration, and capacity signals as **production context only** — not live in
  this static demo.
- Designed a mock API / shared-store boundary and synthetic dataset so the console
  deploys as a static site with loading, error, empty, and recovery states — no
  secrets or live backends.
- Migrated the public demo surface to TypeScript (strict domain contracts,
  helpers, orchestration hooks, and UI props) with CI typecheck on the showcase
  slice — framed as an active learning journey, not exhaustive TS mastery.
- Added Vitest coverage for pure domain helpers and store mutations, plus React
  Testing Library behavior tests for Pipeline, Extension Simulator, Board
  workflows, Overview KPIs, Finance/Team selectors and pages, and route shell —
  gated in CI (`npm run ci`). DnD pointer physics stays manual demo scope.
- Wrote ADRs and a publishable glossary that separate private system context
  (Redis / realtime / workflow services) from what this repository implements.

## One-liner summary (About / LinkedIn)

Anonymized Ops Console Demo from private SaaS work — multi-surface admin shell,
shared mock store, modular React architecture, TypeScript + behavior tests under
CI; larger workflow (intake, extensions, backend, realtime) documented as
**context only**.

## Skills phrasing

| Prefer | Scope note |
| --- | --- |
| React 19, Vite, Tailwind 4, modular feature architecture | Multi-route admin demo + board/pipeline workflows |
| TypeScript on a production-shaped slice | Strict contracts + CI typecheck — learning journey, not expert claim |
| Vitest + RTL for helpers, store, and operator workflows | Behavior coverage; DnD pointer physics is manual demo |
| Desktop-focused operations UI (drag/drop + keyboard assign) | Desktop-first only — no responsive portfolio claim |
| Clear ownership of architecture boundaries under AI-assisted drafting | Boundaries and scope cuts stay human decisions |
| Redis / realtime / backend as documented private context | **Not** claimed as live in this static demo |

## Interview anchor (30 seconds)

> I built a public Ops Console Demo from private operator workflows: admin shell,
> shared mock store, Inventory Pipeline into an Extension Acquisition Simulator,
> then Operations Board assign/complete. Domain language follows a public glossary
> (operation request, client, inventory batch). UI, orchestration, pure helpers,
> and an API-shaped mock boundary stay separated. Redis / realtime / live
> extensions are **documented context**. TypeScript and tests cover the surfaces
> reviewers browse, and every claim is defendable as Mid+ → Senior-ready — not
> expert.

## Full walkthrough

- Timed live demo: [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md)
- Architecture FAQ: [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md)
- Anonymization glossary: [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md)
