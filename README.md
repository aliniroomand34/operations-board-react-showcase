# Operations Board — Public Architecture Showcase

Anonymized React case study extracted from a private SaaS operations workflow.
Product-specific language, live APIs, and real auth were removed. What remains is
a **Strong Mid+ → Senior-ready** learning track focused on modular frontend
architecture — not a claim of Senior expert status.

## Live demo

Desktop-focused static site (mock API only — no secrets, no server).

After the first free deploy, paste the URL here:

**Live demo:** _Add your Vercel or Netlify URL after first deploy_

## Problem

Private admin tools often mix strong frontend craft (boards, workflows, domain
rules) with sensitive product language and real backends. That mix is hard to show
in a public portfolio without leaking business detail or overselling skills.

This repo answers: **can I demonstrate architecture ownership on a real-shaped
board workflow, safely and honestly?**

## Scope

**In scope**

- Desktop-focused Operations Board demo (`/operations`)
- Public routes only: `/`, `/operations`, `*`
- UI / Logic / API / helpers separation
- Drag/drop assignment plus keyboard-friendly **Assign batches** path
- In-memory mock API + synthetic data (`client-001`, `batch-001`, …)
- Visible loading / error / empty states with recovery actions
- TypeScript on the Operations Board slice (learning journey)
- Vitest + RTL tests on the showcase slice
- GitHub Actions CI + Vercel / Netlify static deploy configs
- Short ADRs and resume-aligned wording

**Out of scope**

- Private SaaS surfaces (`god`, financial report, shop, EA accounts, real admin)
- Real backends, tokens, production domains, or auth claims
- Production-grade responsive design (this demo is desktop-first)
- Full WCAG certification (semantic HTML + keyboard basics only)
- Claims of “expert TypeScript” or “senior testing expert”

## Architecture

```
App shell → public routes → OperationsBoardPage
  → useOperationsBoardLogic (orchestration)
  → OperationsBoardColumns + Modals (UI)
  → operationsBoard.helpers (pure domain rules)
  → operationsBoard.api (mock boundary)
  → mocks/operationsBoard.data (synthetic seed)
```

| Layer | Responsibility |
| --- | --- |
| Page / columns / modals | Presentation, interaction, a11y labels |
| `useOperationsBoardLogic` | Orchestration: load board, open modals, call API |
| `operationsBoard.helpers` | Pure rules (validation, capacity, drop ids) |
| `operationsBoard.api` | Async boundary (delay, failure, transitions) |
| `operationsBoard.types` | Domain contract shared across layers |

Domain language is public: operation request, client, inventory batch. Drag a ready
batch onto a queued client, confirm assignment, then complete the in-progress
operation — or use the keyboard assign path for the same outcome.

Decision records:

- [001 — Extract portfolio slice](docs/adr/001-extract-portfolio-slice.md)
- [002 — Mock API boundary](docs/adr/002-mock-api-boundary.md)
- [003 — TypeScript migration strategy](docs/adr/003-typescript-migration-strategy.md)
- [004 — Testing strategy](docs/adr/004-testing-strategy.md)

Resume-ready bullets (honest Mid+ wording): [docs/RESUME_BULLETS.md](docs/RESUME_BULLETS.md)

## Tradeoffs

| Choice | Why | Cost |
| --- | --- | --- |
| Showcase one board, not the full product | Clear recruiter signal + safer public surface | Legacy folders may still exist on disk but are not the claim |
| Mock API instead of real HTTP | Zero secrets; static deploy; demoable async states | Not a production API / realtime story |
| Gradual TypeScript on the slice only | Refactor safety where it matters for the case study | Rest of this workspace copy may still be JS |
| Test helpers + modal assign, not DnD pointers | Stable, behavior-focused tests | Drag choreography is manual demo only |
| Desktop-first polish | Matches the real private product posture | No responsive portfolio claim |

## Testing strategy

Meaningful coverage on the showcase slice (behavior over implementation):

- **Unit** — domain helpers and mock API status transitions
- **RTL** — loading, error + retry, empty, assign via modal, complete
- **Intentionally skipped** — CSS layout, pointer physics for drag/drop

```bash
npm run test:showcase
```

See [ADR 004](docs/adr/004-testing-strategy.md) for what is and is not tested.

## Privacy / anonymization

This repository is sanitized for public review:

- Synthetic ids and amounts only
- No real customer PII, private endpoints, or production credentials
- Domain renamed away from private product terms

Do not add live API URLs, tokens, or realistic personal data to this copy.

## AI-assisted engineering note

Built with AI assistance under **architecture ownership and review discipline**:
boundaries, naming, scope cuts, and honesty of claims stay human decisions. AI
sped up drafting; it did not replace defending tradeoffs in interview.

## What I would improve next

- Optional Phase 6 maintainability pass (shorter hook, clearer transitions)
- Broader `tsconfig` include once invite/demo pages are cleaned
- Paste live demo URL after first public deploy
- Thin real HTTP adapter behind the same API boundary (still optional for a static demo)

## Stack

- React 19 + Vite
- TypeScript (strict) on the Operations Board slice — learning journey
- React Router
- Tailwind CSS
- `@dnd-kit` for board drag/drop
- Vitest + React Testing Library

## Run locally

```bash
cd frontend
npm install
npm run dev
```

No `.env` or API URL is required. The Operations Board loads from
`src/mocks/operationsBoard.data.ts` via `operationsBoard.api.ts`.

```bash
npm run typecheck
npm run test:showcase
npm run build
npm run preview
```

Full CI-equivalent check (no secrets):

```bash
npm run ci
```

## Deploy (free tier)

Static hosting only — the mock API runs in the browser.

### Vercel

1. Import this repository in [Vercel](https://vercel.com).
2. Root directory can stay the repo root (`vercel.json` already points at `frontend`).
3. Deploy. No environment variables are required.
4. Paste the production URL into **Live demo** above.

### Netlify

1. Import this repository in [Netlify](https://www.netlify.com).
2. `netlify.toml` sets `base = frontend`, build `npm run build`, publish `dist`.
3. Deploy. No environment variables are required.
4. Paste the production URL into **Live demo** above.

SPA routes (`/operations`, unknown paths) are rewritten to `index.html` in both configs.

## CI

GitHub Actions workflow [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) runs on push/PR:

1. `npm ci`
2. `npm run typecheck` — Operations Board TypeScript slice
3. `npm run lint:showcase` — public shell JS
4. `npm run test:showcase` — Operations Board Vitest suite
5. `npm run build`

Legacy product tests outside the showcase slice are intentionally not part of CI.

## Accessibility (demo basics)

- Skip link to main content
- Semantic headings, buttons, and column regions
- Loading / error / empty states with `role="status"` / `role="alert"`
- Modals: `aria-modal`, labelled title, Escape to close, restore focus
- Visible `:focus-visible` outlines
- Honest scope: desktop demo polish, not a full accessibility certification

## Honest positioning

| Claim level | Meaning here |
| --- | --- |
| Strong Mid+ → Senior-ready | Can explain architecture, tests, and tradeoffs; still growing |
| TypeScript / testing journey | Practiced on this slice with ADRs and CI — not “expert” |
| AI-assisted | Ownership + review, not keyword stuffing or dependency denial |

See [docs/RESUME_BULLETS.md](docs/RESUME_BULLETS.md) for copy-paste resume lines.
