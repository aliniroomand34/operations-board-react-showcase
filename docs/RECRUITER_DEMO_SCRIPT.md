# 60-second recruiter demo script

Use while sharing the live demo (or `npm run dev`). This is a **frontend
projection** of a larger private workflow — Redis, WebSocket, bots, and
extensions are documented context, not live in this repository.

## Script (~60 seconds)

**0–10s — Home**

> This is an anonymized operations workflow showcase. The private source system
> included automation intake, browser-based operator extensions, backend workflow
> services, and Redis / realtime coordination — plus multi-source capacity
> (≤30 inventory sources), team concurrency (~20 operators / ~50 clients),
> settlement summaries, extension-queued bulk work, and live presence / alerts.
> This public repo ships the operator board UI over a mock API.

**10–20s — Open `/operations`**

> The board is a frontend projection of that larger system — not the full product.
> Queued requests, ready batches, in-progress work, and completed operations are
> synthetic. Domain language was renamed for public safety.

**20–45s — Core workflow**

> I’ll assign a ready batch to a queued client — drag/drop or the Assign batches
> modal for a keyboard path. That moves work to in progress. Then I’ll complete
> it. Domain rules live in pure helpers; the hook orchestrates; the mock API owns
> the async boundary.

**45–55s — Recovery states**

> Demo controls can simulate empty and error. Retry and reset show how loading,
> error, and empty states stay visible and recoverable — important for operator UX
> even when the backend is mocked.

**55–60s — Close**

> What this proves: modular React architecture, typed contracts, a mock API
> boundary, accessibility basics, and behavior tests under CI. The larger private
> workflow stays documented context around this board slice.

## Optional follow-ups

Full architecture FAQ: [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md).

| Question | Short answer |
| --- | --- |
| Why not ship the real backend? | Privacy + static deploy; same API-shaped boundary, synthetic transitions. |
| What did Redis / WebSocket do privately? | Transient workflow state / coordination and live operational updates — documented context only here. |
| How big was the private system? | Multi-source pool (≤30), ~20 concurrent operators / ~50 clients, settlement summaries, extension queues, presence — context only; this demo is the board slice. |
| Why this slice? | Highest signal board workflow with clear UI / Logic / API / helpers boundaries. |
| AI involvement? | Assisted drafting; architecture ownership and scope cuts stay with the author. |

## Silent click path

1. Home hero + context cards + scale-signal strip
2. Click **Open Operations Board**
3. Assign (modal or drag) → in progress
4. Complete one request
5. Simulate error → Retry (or Reset)
6. Stop — offer deeper dive on ADRs / tests / TypeScript
