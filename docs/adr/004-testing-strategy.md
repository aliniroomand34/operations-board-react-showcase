# ADR 004 — Testing strategy (Operations Board)

## Status

Accepted (2026-07-18)

## Context

This showcase treats testing as a **learning journey**, not an “expert testing”
claim. We needed a small, interview-defendable suite that:

1. Protects domain rules (helpers + mock API transitions)
2. Protects user-visible board behavior (loading / error / empty / assign / complete)
3. Avoids brittle tests tied to CSS classes, layout, or drag pointer physics

## Decision

### Layers

| Layer | Tool | What we test | What we intentionally skip |
| --- | --- | --- | --- |
| Pure domain | Vitest unit | helpers (validation, capacity, drop ids) | React lifecycle |
| Mock API | Vitest unit | queued → inProgress → completed, failure flags | HTTP / real network |
| UI behavior | Vitest + RTL | loading, error+retry, empty, assign modal, complete | pixel layout, DnD pointer paths |

### Vitest / RTL from zero (interview cheat-sheet)

- **Vitest** — Vite-native test runner. Familiar API: `describe` / `it` / `expect`.
- **jsdom** — fake browser DOM in Node so React can render without a real browser.
- **RTL (`@testing-library/react`)** — query by role/label/text the way a user (or assistive tech) would; prefer `getByRole` over CSS selectors.
- **Unit vs integration** — unit = one pure module; integration here = page + hook + mock API together.
- **Behavior over implementation** — assert “Client 001 is in progress”, not “`setBoard` was called with X”.

### Files

- `operationsBoard.helpers.test.ts` — pure helpers
- `operationsBoard.api.test.ts` — mock API state transitions
- `OperationsBoardPage.test.tsx` — RTL board workflows
- Demo helpers: `setOperationsBoardMockDelay(0)`, `setOperationsBoardMockFailure`, `resetOperationsBoardMock`

### Run

```bash
npm test
```

## Consequences

- Recruiter/CTO signal: meaningful coverage on the showcase slice without claiming a full QA org.
- Drag-and-drop pointer choreography is demoed manually; assignment is covered via the accessible modal path (same business outcome).
- Resume wording stays honest: testing as active learning track on this repo.
