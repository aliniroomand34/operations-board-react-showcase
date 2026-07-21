# Recruiter demo script

Use while sharing the live demo (or `npm run dev`). This is a **frontend
projection** of a larger private workflow — Redis, WebSocket, bots, and real
extensions are **documented context**, not live in this repository.

**Current build:** Ops Console Demo admin shell under `/app/*` — Overview,
Inventory Pipeline, Extension Acquisition Simulator, Operations Board, Finance
Summary, Team Activity, honest stubs for remaining secondary IA, and a slim
Case Study route. Entry: `/` → `/app/overview`.

---

## Script (~2 minutes)

**0–15s — Overview (`/app/overview`)**

> First impression is an ops admin console: sidebar, dark-gold chrome, KPI cards,
> Recharts pie/bar panels, and compact summary tables from the shared mock store.
> These numbers come from a **shared mock store** — they will move after we touch
> Pipeline and Board. No live backend; synthetic data only.

**15–45s — Inventory Pipeline → Extension Simulator**

> On Inventory Pipeline I’ll open **New batch request**, pick linked accounts and
> catalog SKUs, then **Submit & open simulator**. That creates an acquisition job
> and navigates to the Extension Acquisition Simulator — an **in-app** stand-in for
> a browser extension on a provider site. Honesty banner first; then paced steps
> driven by the form payload we just submitted.

**45–75s — Complete acquire → Operations Board**

> After the simulator finishes, batches move toward Ready. On Operations Board I
> assign a ready batch to a queued client (drag/drop or Assign batches modal), then
> complete it. Domain rules live in pure helpers; hooks orchestrate; the mock API
> owns the async boundary.

**75–95s — Stub + Finance/Team skim + shared state proof**

> One secondary nav item (e.g. Settings) shows **“Not available in this demo
> version”** — IA breadth without fake claims. Optionally open Finance Summary or
> Team Activity — mock charts / org graph labeled **Demo — synthetic**. Back on
> Overview, KPIs reflect the work we just did.

**95–120s — Case Study one-liner**

> Case Study is architecture honesty — modular UI / Logic / API / helpers, mock
> boundary, CI tests. Redis / WebSocket / pool scale stay behind **Production
> context**. Claim level: Strong Mid+ → Senior-ready learning track — not expert TS.

---

## Optional follow-ups

Full architecture FAQ: [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md).

| Question | Short answer |
| --- | --- |
| Why not ship the real backend? | Privacy + static deploy; same API-shaped boundary, synthetic transitions. |
| What did Redis / WebSocket do privately? | Transient workflow state / coordination and live operational updates — **context only** here. |
| How big was the private system? | Multi-source pool (≤30), ~20 operators / ~50 clients, settlement, extension queues, presence — **context**; this demo is the multi-surface mock console. |
| Why this slice? | Highest-signal admin workflows with clear UI / Logic / API / helpers boundaries. |
| AI involvement? | Assisted drafting; architecture ownership and scope cuts stay with the author. |
| Expert TypeScript / testing? | **Not claimed** — strict TS and behavior tests on the showcase slice, framed as learning + review discipline. |

## Silent click path

1. `/` lands on Overview — note KPI cards + admin shell
2. Inventory Pipeline — New batch request → Submit & open simulator
3. Extension Simulator — Start (or watch auto steps) → batch advances
4. Operations Board — Assign → Complete
5. Finance Summary or Team Activity — synthetic charts / org graph (Demo badge)
6. One stub (Settings / Clients) — honest unavailable panel
7. Case Study — skim hero + shipped surfaces; expand Production context only if asked
8. Optional: Overview again to show live counts
