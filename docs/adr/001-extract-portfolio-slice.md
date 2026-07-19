# ADR 001 — Extract portfolio slice (Operations Board)

## Status

Accepted (2026-07-19)

## Context

The private SaaS product contains many admin surfaces (god, financial report, shop,
EA accounts, auth-gated layouts). A public GitHub showcase cannot ship that surface
area safely or usefully: recruiters need one clear signal in ~30 seconds, and
private domain language / real endpoints must not leak.

We needed a single feature slice that still shows real frontend craft:

- Board UI with multi-column workflow
- Drag/drop plus an accessible assign path
- Separated UI / Logic / API / helpers
- Room for TypeScript and tests as a learning track

## Decision

1. **Primary showcase feature:** anonymized Operations Board (from private
   `AdminMarket`), not TransferPackManagement or invite demos.
2. **Public routes only:** `/`, `/operations`, `*` under a layout without real auth.
3. **Rename domain language** for public safety:
   - AdminMarket → Operations Board
   - transfer / pack / customer → operation request / inventory batch / client
   - Strip telegram, EA, FUT, coin, god/admin product terms from the showcase path
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
