# ADR 002 — Mock API boundary

## Status

Accepted (2026-07-19)

## Context

The private product talks to real backends. A public static demo (Vercel/Netlify)
cannot depend on those endpoints, credentials, or environments. Hardcoding board
payloads inside React components would also blur responsibilities and make loading /
error / empty states awkward to demonstrate and test.

## Decision

1. **Synthetic seed data** lives in `src/mocks/operationsBoard.data.ts`
   (`client-001`, `batch-001`, safe amounts/statuses only).
2. **Async mock functions** live in `operationsBoard.api.ts` next to the feature:
   get snapshot, assign batches, complete request, cancel queued, plus demo helpers
   for delay, forced failure, and reset presets.
3. **UI and hook never invent network-shaped payloads.** They call the mock API
   boundary the same way they would call a thin real client later.
4. **Small artificial delay** so loading / error / empty states are demoable;
   tests can set delay to `0` for determinism.
5. **No production tokens, auth claims, or live URL paths** in the showcase path.

## Consequences

- Static hosting works with zero secrets and zero server.
- Swapping mock → real HTTP later is a boundary change, not a UI rewrite.
- Interview story is clear: “API boundary” means ownership of async state and
  domain transitions, not “I mocked axios everywhere inside JSX.”
- What we do *not* claim: production API design, backend ownership, or WebSocket
  reliability engineering on this public repo.
