# Public surface (what may ship on GitHub)

Defines the publishable path boundary, anonymization glossary, and honest claim
level for this showcase.

**Last rules audit:** 2026-07-21 (Phase 0 — admin demo plan)

---

## Positioning (claim level)

| Allowed | Forbidden |
| --- | --- |
| **Strong Mid+ → Senior-ready learning track** | “Senior expert,” “Expert TypeScript,” “Senior-level testing expert” |
| Modular React architecture (UI / Logic / API / helpers) | Production-grade responsive design for this demo |
| Mock API boundary, board / pipeline workflows, behavior tests under CI | Keyword stuffing or skills not demonstrated in this repo |
| TypeScript and testing as an **active learning journey** on this showcase | Claiming full independence from AI if that overstates reality |
| Private-system scale (Redis, WebSocket, pool, settlement) as **documented context only** | Implying Redis / WebSocket / bots / extensions **run live** in this repo |
| Desktop-first operator UI | That this repo is the entire private product |
| AI-assisted drafting framed as architecture ownership + review discipline | Private product, game, messaging, or commerce brand names |

Aligns with [.cursor/rules/portfolio-showcase.mdc](../../.cursor/rules/portfolio-showcase.mdc).

---

## In scope (publishable)

| Path | Why |
| --- | --- |
| `frontend/src/` | Showcase app: shell, routes, interactive mocks, stubs |
| `frontend/docs/adr/` | Architecture decision records (anonymized) |
| `frontend/docs/RESUME_BULLETS.md` | Resume wording |
| `frontend/docs/RECRUITER_DEMO_SCRIPT.md` | Live demo talking points |
| `frontend/docs/INTERVIEW_DEFENSE.md` | Architecture FAQ |
| `frontend/docs/RELEASE_CHECKLIST.md` | CI / privacy / deploy gate |
| `frontend/docs/PUBLIC_SURFACE.md` | This boundary checklist |
| `frontend/README.md` | Case study entry point |
| `frontend/package.json`, lockfile, Vite/ESLint/TS/Vitest configs | Reproducible demo |
| `frontend/public/` | Static assets used by the demo |
| `frontend/index.html` | App shell HTML |
| `frontend/.env.example` | Notes only — no secrets |
| `.github/workflows/ci.yml` | typecheck / lint / test / build |
| `vercel.json`, `netlify.toml` | Static deploy configs (package and/or monorepo root) |
| Root `README.md` (if present) | Points reviewers at `frontend/` |

## Out of public display

| Path / pattern | Why |
| --- | --- |
| `.cursor/` (plans, rules, local agent notes) | Local tooling; may contain historical private product names |
| `frontend/MENTOR_PROGRESS.md` | Local progress notes — excluded from publish |
| Root `docs/` private product notes | Contracts, QA, stack plans for the private system |
| `frontend/.env` and any real secrets | Local only |
| Private SaaS feature folders, real API clients, production domains | Not part of this showcase |

These paths are listed in the repo `.gitignore` so a fresh `git init` + push does not
leak them by default.

---

## English anonymization glossary

Use **public showcase terms** in all publishable UI, docs, mocks, and comments.
Never use private product, game, messaging, or commerce slang.

| Private / production concept | Public showcase term | Notes |
| --- | --- | --- |
| Private admin product name | **Ops Console Demo** (or neutral “operations console”) | No brand strings from the private repo |
| `/admin/market` (private route) | **Operations Board** — `/app/operations` (legacy `/operations` redirects) | Board slice in admin shell |
| Transfer request / deal | **Operation request** / **operation** | |
| Pack | **Inventory batch** / **batch** | Never “pack” in public copy |
| Transfer Pack Management | **Inventory Pipeline** | Interactive mock at `/app/inventory` |
| Allowed players / card list | **Allowed catalog** | SKU allowlist — never “player” or “card” as domain nouns |
| EA / provider accounts | **Linked accounts** / **provider sessions** | Never name the provider brand |
| Buy cards / scrape on provider site | **Acquire catalog items** (simulated) | In-app simulation only |
| Browser extension buy / list jobs | **Extension Acquisition Simulator** / **operator extension simulation** | In-app page — not a real Chrome extension |
| Customer | **Client** | |
| Telegram / shop / god admin | Omit, or **category only** (“automation intake”, “privileged admin surfaces”) | Never name platforms |
| Settlement / finance (private) | **Settlement summaries** / **Finance Summary** (`/app/finance`) | **Demo** — synthetic charts; no live billing |
| Team / operators (private) | **Team Activity** (`/app/team`) | **Demo** — synthetic org graph; no real RBAC |
| Realistic PII | Synthetic ids only | `client-001`, `batch-001`, `req-001`, `acct-001`, `sku-001` |

### Category language (allowed when specifics are stripped)

- private admin surfaces / operator tooling
- automation intake
- browser-based operator extensions (as **context** — simulator replaces live extension in demo)
- backend workflow services
- mock API / synthetic data

### Forbidden in publishable docs and source

Do not leave in files listed under **In scope**:

- Private feature / product names from the source system
- Game / commerce slang (coins, cards-as-SKUs, players, packs as inventory units)
- Messaging-platform names used as intake channels
- Real endpoint paths, hostnames, ports, production tokens, or auth claims
- Realistic personal names, phones, or emails in mocks
- UI that mimics a real third-party marketplace login or branded provider console

Even “out of scope” lists must use **categories** — not private surface names.

---

## Context vs implemented labeling

Every surface that describes private-system behavior must distinguish what **runs in
this repo** from what is **documented context only**.

| Label | Meaning | Where used |
| --- | --- | --- |
| **`demo`** / **Implemented** | Code and mocks in this repository | Overview, Inventory Pipeline, Extension Acquisition Simulator, Operations Board, Finance Summary, Team Activity |
| **`context`** / **Production context** | Private-system behavior described honestly, not live here | Case Study scale cards, Redis/WebSocket narrative, pool/settlement cycles |
| **`stub`** | Admin IA present; page shows “Not available in this demo version” | Secondary nav routes (Clients, Settings, Alerts, Resources, AI Assistant, Linked Accounts) |

**UI pattern (Home / Overview / Case Study):** use `tone: "demo" \| "context"` (or
equivalent badges: “Demo”, “Context”, “Stub”) so skim readers do not confuse
architecture essays with shipped features.

**Docs pattern:** Technology tables and “What this proves” matrices must keep a
**Private context** column separate from **This public demo**.

---

## Stack (what this repo runs)

Document only what is installed and gated in CI — not private infrastructure.

| Layer | This repository |
| --- | --- |
| UI | React 19, Vite 7, React Router 7 |
| Language | TypeScript (strict) on the public demo surface |
| Styling | Tailwind CSS 4 (`@tailwindcss/vite`) |
| Board DnD | `@dnd-kit/core`, `@dnd-kit/utilities` |
| Charts | `recharts` (Overview + Finance Summary mock charts); Team graph = custom CSS/DOM |
| Tests | Vitest, React Testing Library, jsdom |
| CI | `npm run ci` → typecheck, lint, test, build, check:slang |

**Not live in this repo (context only in docs):** Redis, WebSocket servers, real HTTP
APIs, auth/RBAC, browser extension bridge, provider scraping, live pool orchestration.

---

## Showcase scope — current vs planned

Honesty gate: describe what is **shipped today** separately from the **admin demo
target** in the portfolio plan.

| Status | Scope |
| --- | --- |
| **Shipped now** | Ops Console Demo admin shell (`/app/*`): Overview, Inventory Pipeline, Extension Acquisition Simulator, Operations Board, Finance Summary, Team Activity, remaining stub secondary nav, Case Study; shared mock store; board chrome tokens; presentational chart kit; CI + slang gate |
| **Legacy redirects** | `/` → `/app/overview`; `/operations` → `/app/operations` |
| **Phase 6** | **Shipped** — visual density via shared chrome + store selectors + Finance/Team demo pages + Overview Recharts/tables. See [ADR 006](./adr/006-visual-parity-shared-chrome.md) |

Do not claim planned routes or multi-surface workflows until their code is in
`frontend/src/` and covered by the release checklist.

### Phase 6 visual parity — locked approach

**Decision (accepted):** visual parity via **shared chrome tokens + mock selectors +
presentational chart kit** — **never** copy production feature files into this repo.

| Locked | Meaning |
| --- | --- |
| Skin, don’t fork | ClassNames / CSS tokens / wrappers on existing Board + Pipeline shells |
| Selectors over backends | Chart / table series derived from `demoStore` only |
| Promote two stubs | `/app/team` and `/app/finance` → **demo** (shipped); other stubs stay stubs |
| Recharts | Finance Summary uses `recharts`; Team graph = custom CSS/DOM; Overview Recharts upgrade optional |
| Leave Logic alone | No rewrite of mutations, DnD, or extension-sim job flow for “style match” |

Full decision record: [ADR 006 — Visual parity via shared chrome + mock selectors](./adr/006-visual-parity-shared-chrome.md).

---

## Quick verify before publish

From the package root, search **publishable paths only** for:

1. Private feature / product names from the source system
2. Game / commerce / messaging slang (see glossary **Forbidden** row)
3. Real API path fragments, hostnames, ports, or secret env keys
4. Domain misuse: `player`, `pack` (as inventory unit), `customer`, provider brands

Expect zero hits under `frontend/src`, `frontend/docs`, `frontend/README.md`,
`.github`, `vercel.json`, and `netlify.toml`.

```powershell
# Automated gate (excludes glossary meta-docs PUBLIC_SURFACE + RELEASE_CHECKLIST)
npm run check:slang
```

### Phase 5 re-score audit (2026-07-21)

| Check | Result |
| --- | --- |
| Forbidden game/commerce/messaging slang in publishable paths | **Clean** (`npm run check:slang`) |
| Redis / WebSocket mentions | Present only as **documented context** — acceptable |
| Synthetic mock ids | `client-001`, `batch-001`, `sku-001`, `acct-001` — acceptable |
| `tone: "demo" \| "context"` on Case Study cycles | **Present**; long context behind `<details>` |
| Default entry | `/` → `/app/overview` (not essay-first) |
| Brand / fonts | Ops Console Demo; EN system fonts (no Arabic font load) |
| Stack docs match `package.json` | React 19, Vite, TS strict, Tailwind 4, dnd-kit, Vitest — **aligned** |
| TA/CTO score vs Phase 5 fix list | **8.7 / 10** — see [PHASE5_SCORE.md](./PHASE5_SCORE.md) |

Re-run this table before every public push; update the date and rows in
[RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md).

---

## Related docs

- [PHASE5_SCORE.md](./PHASE5_SCORE.md) — TA/CTO re-score vs fix list
- [ADR 006](./adr/006-visual-parity-shared-chrome.md) — Phase 6 visual parity approach lock
- [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md) — context vs implementation FAQ
- [RESUME_BULLETS.md](./RESUME_BULLETS.md) — honest resume phrasing
- [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md) — timed walkthrough
- [RELEASE_CHECKLIST.md](./RELEASE_CHECKLIST.md) — CI and privacy gate
