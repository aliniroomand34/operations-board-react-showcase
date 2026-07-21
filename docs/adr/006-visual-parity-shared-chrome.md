# ADR 006 — Visual parity via shared chrome + mock selectors

## Status

Accepted (2026-07-21) — **Phase 6 approach lock**; Team / Finance mock pages shipped
(partial Phase 6). Board chrome + Overview Recharts upgrade remain optional follow-ups.

## Context

Phases 0–5 shipped an Ops Console Demo with admin shell, four interactive mock
flows, stubs, and a shared `demoStore`. Recruiter skim still reads “thin” vs a
dense private admin: Overview is KPI + CSS bars; Team / Finance remain stubs;
Pipeline / Board column shells are simpler than production.

The risk is “fixing” density by **copying private feature folders**
(dashboard charts, financial reports, inventory-board layout modules) into this
public repo. That would:

- Leak private slang, RTL/JS patterns, and production coupling
- Regress working assign / acquire / mutation flows
- Break the modular UI / Logic / API / helpers boundary already proven here

We need a locked approach so later Phase 6 todos only add a **thin visual layer**.

## Decision

**One sentence:** Do **not** copy production feature folders; add a thin visual
layer (shared chrome tokens + Recharts / presentational components) fed only by
`demoStore` selectors, and promote Team / Finance from stub → mock-only pages —
leave existing Logic / API / mutations / tests untouched except style class wiring.

### Do

| Approach | Meaning in this repo |
| --- | --- |
| **Skin, don’t fork** | Change classNames / wrappers / CSS tokens on existing `ColumnFrame`, Pipeline columns, Board section shells |
| **Selectors over new backends** | Extend / add `*.selectors` that derive chart series and table rows from `demoStore` |
| **Presentational chart kit** | Small `features/demo-charts/` (ChartCard + Bar / Pie / Area wrappers) reused by Overview + Finance |
| **Shared board chrome** | Public-safe tokens in e.g. `features/shared/boardChrome.ts` + `.ops-column*` in `index.css` |
| **Promote two stubs only** | `/app/team` and `/app/finance` become `mode: "demo"` with honesty badges; other stubs stay stubs |
| **Recharts only where needed** | Add `recharts` for Overview + Finance only (amends ADR 005’s earlier removal of unused `recharts`). Team graph stays custom CSS/DOM |

### Do not

| Forbidden | Why |
| --- | --- |
| Copy private `AdminDashboard-*`, `AdminFinancialReport-*`, `TransferPackManagement-*`, or similar folders | Private slang, architecture mismatch, coupling to private paths |
| Rewrite Pipeline / Board Logic or `*.api.mutations.ts` to “match styles” | High regression risk on working flows |
| Hardcoded chart numbers disconnected from `demoStore` | Breaks “shared state proves cohesion” |
| Second chart stack (Chart.js, etc.) | Keep one chart family |
| Live money / billing / RBAC / Chrome extension APIs | Out of showcase scope |
| Wholesale file copy from the private product repo | Security + honesty gate |

### Implementation order (when coding starts)

1. `boardChrome` tokens + Pipeline / Board style wiring
2. `demo-charts` kit + Overview upgrade (charts + optional compact tables)
3. Seed mock finance + team nodes in `demoStore.data`; selectors
4. Finance page + Team page; flip nav stub → demo in `adminDemoNav.ts`
5. Tests + slang grep + short docs / demo-script tweak

### Guardrails during implementation

- Touch **presentation + selectors + seed data** first
- English LTR only; glossary in [PUBLIC_SURFACE.md](../PUBLIC_SURFACE.md)
- Honesty badge on Finance / Team: synthetic series
- Selector unit tests + smoke render for Overview / Finance / Team; existing board / pipeline tests stay green (className-only changes)
- Docs: Team + Finance become **demo**, not stub; remaining stubs unchanged

## Consequences

- Later Phase 6 work has an explicit “never copy production features” gate.
- Visual density can rise without inventing new workflows or forking Logic.
- ADR 005’s “remove unused `recharts`” stands for the pre–Phase 6 state; **Phase 6 intentionally re-adds `recharts`** as a justified Overview / Finance dependency only.
- Interview story: “I matched admin chrome with shared tokens and store-derived charts — I did not paste private feature trees into the public repo.”
- Recruiter impact: denser Overview + Team graph + Finance charts + board chrome parity without diluting Mid+ honesty.
