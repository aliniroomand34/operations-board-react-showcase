# ADR 005 — Showcase dependency audit & typed surface hygiene

## Status

Accepted (2026-07-19)

## Context

A recruiter or CTO scanning `package.json` and unused exports can mistake leftover
private-product tooling for intentional showcase architecture. The public demo
must only ship dependencies and typed surfaces that the Operations Board path
actually uses — or document why a typed contract is kept without UI wiring yet.

## Decision

### Dependencies kept (runtime)

- `@dnd-kit/core` / `@dnd-kit/utilities` — board drag/drop
- `react` / `react-dom` / `react-router-dom` — app shell
- `react-icons` — icons (single icon library for ErrorBoundary + board)
- `tailwindcss` / `@tailwindcss/vite` — styling

### Dependencies removed (unused by public demo)

- `axios`, `dayjs`, `jalaliday`, `jwt-decode` — private HTTP/auth/date stack residue
- `gsap`, `motion`, `recharts` — unused animation/chart libs
- `lucide-react` — replaced by `react-icons` to avoid two icon packages
- `react-hot-toast` — Toaster was mounted but never called
- `path` (npm package) — Vite uses Node’s `node:path`
- `@tailwindcss/cli` — Vite plugin covers CSS; CLI unused in scripts

### Typed / API surfaces

| Export | Decision |
| --- | --- |
| `BoardColumnMeta` + `BOARD_COLUMN_META` | **Used** — column title/empty copy owned by helpers, consumed by column UI |
| `getBatchDetail` | **Kept + tested** — mock boundary supports batch lookup even though the UI currently resolves batches from the board snapshot |
| `BoardAsyncState` | **Kept as typed contract** — documents the preferred load/error/success union; hook still uses separate `loading` / `error` / `board` fields until a later maintainability pass consolidates them (avoid premature hook rewrite in this CTO-fix pass) |

## Consequences

- First-pass CTO review is less likely to flag dead deps or silent `ErrorBoundary` bugs.
- Interview story stays honest: mock API can expose detail reads; UI may still use snapshot helpers.
- Consolidating `useOperationsBoardLogic` onto `BoardAsyncState` remains an optional follow-up, not a claim that the hook is already a single discriminated union.

## Supersession note (Phase 6)

Removing unused `recharts` was correct for the board-only surface at acceptance
time. **[ADR 006](./006-visual-parity-shared-chrome.md)** locks a later, intentional
re-add of `recharts` for Overview + Finance mock charts only — not a reversal of
the “no dead deps” rule.
