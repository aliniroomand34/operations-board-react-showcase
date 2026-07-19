# ADR 003 — TypeScript migration strategy (Operations Board)

## Status

Accepted (2026-07-18) · Updated (2026-07-19)

## Context

The public Operations Board slice started as JavaScript (extract + mock API).
TypeScript on this showcase is an incremental migration with CI gates — typed
where reviewers browse first. We needed a migration path that:

1. Types the domain contract first
2. Moves outward to helpers → API → hook → UI props
3. Then expands to the public shell (routes, layout, pages, App, ErrorBoundary)

## Decision

- Canonical domain types live in `operationsBoard.types.ts`
  (`OperationRequest`, `InventoryBatch`, `BoardStatus`, `BoardColumn`,
  `OperationsBoardSnapshot`, validation and async-state helpers).
- Mock data, API, helpers, hook, page, columns, and modals are `.ts` / `.tsx`.
- Public shell (`routes`, `layouts`, `pages`, `App`, `main`, `ErrorBoundary`)
  is also `.ts` / `.tsx`.
- `tsconfig.json` typechecks the entire `src` tree under `strict: true` with no
  intentional `any`.
- TypeScript is pinned to 5.8.x so `typescript-eslint` can lint TS/TSX in CI
  (TypeScript 7’s programmatic API is not yet compatible with that toolchain).
- Script: `npm run typecheck` (`tsc --noEmit`).

## Consequences

- Refactors of board status / batch assignment are safer and interview-defendable.
- CI typecheck covers the same surface recruiters browse — not only the board slice.
- Resume wording can point at typed contracts and CI typecheck on the public demo.
