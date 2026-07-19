# ADR 003 — TypeScript migration strategy (Operations Board)

## Status

Accepted (2026-07-18)

## Context

The public Operations Board slice started as JavaScript (extract + mock API).
TypeScript is an active learning journey for this showcase — not a claim of
expert-level TS fluency. We needed a migration path that:

1. Types the domain contract first
2. Moves outward to helpers → API → hook → UI props
3. Avoids rewriting unrelated legacy JS still on disk

## Decision

- Canonical domain types live in `operationsBoard.types.ts`
  (`OperationRequest`, `InventoryBatch`, `BoardStatus`, `BoardColumn`,
  `OperationsBoardSnapshot`, validation and async-state helpers).
- Mock data, API, helpers, hook, page, columns, and modals are `.ts` / `.tsx`.
- `tsconfig.json` currently typechecks the showcase slice
  (`operations-board` + `mocks`) under `strict: true` with no intentional `any`.
- Invite demo pages remain outside this typecheck include until a later pass.
- Script: `npm run typecheck` (`tsc --noEmit`).

## Consequences

- Refactors of board status / batch assignment are safer and interview-defendable.
- Gradual expansion of `tsconfig` include is expected (not big-bang app-wide TS).
- Resume wording stays honest: TypeScript as learning track, not “expert TS”.
