# ADR 001 — Extract portfolio slice (Operations Board)

## Status

Accepted (2026-07-19)

## Context

The private SaaS product contains many operator surfaces beyond a single board
(reporting tooling, commerce-adjacent flows, account tooling, auth-gated layouts).
A public GitHub showcase cannot ship that surface area safely or usefully:
recruiters need one clear signal in ~30 seconds, and private domain language /
real endpoints must not leak.

We needed a single feature slice that still shows real frontend craft:

- Board UI with multi-column workflow
- Drag/drop plus an accessible assign path
- Separated UI / Logic / API / helpers
- Room for TypeScript and tests on the public demo surface

## Decision

1. **Primary showcase feature:** anonymized Operations Board extracted from a
   private operations workflow surface — not adjacent private operator tooling
   or secondary demos outside this board.
2. **Public routes only:** `/`, `/operations`, `*` under a layout without real auth.
3. **Rename domain language** for public safety (full glossary:
   [PUBLIC_SURFACE.md](../PUBLIC_SURFACE.md)):
   - Private board feature → Operations Board
   - Private request / inventory / buyer terms → operation request / inventory batch / client
   - Private allowlist → allowed catalog; provider accounts → linked accounts
   - Strip private product, messaging, and commerce slang from the showcase path
4. **Keep architecture, shrink product scope:** board columns, assignment,
   complete flow, essential modals — drop settings, automation, and private
   integrations from the public slice.
5. **Feature location:** `src/features/operations-board/` with mock data under
   `src/mocks/`.

## Consequences

- Recruiters see one coherent demo instead of a mini private product.
- Security posture is clearer: showcase code is explainable without NDAs.
- Legacy folders may still exist on disk in this workspace copy, but they are
  out of the public router and out of showcase CI; they are not the portfolio claim.
- Resume language must describe an **anonymized architecture showcase**, not the
  full private SaaS.
- Publishable paths are listed in [PUBLIC_SURFACE.md](../PUBLIC_SURFACE.md).
