# Release checklist — public showcase

Final gate before publishing or after a major merge.

## 1. CI quality gates

From `frontend/` (or repo root when this folder is the Git root):

```bash
npm run ci
```

| Gate | Command |
| --- | --- |
| Typecheck | `npm run typecheck` |
| Lint | `npm run lint` |
| Tests | `npm run test` |
| Build | `npm run build` |
| Publishable slang | `npm run check:slang` |

GitHub Actions: [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) when this
package is the Git repository root. In the workspace monorepo copy, the parent
workflow uses `working-directory: frontend` — same four steps.

## 2. Live demo

| Item | Value |
| --- | --- |
| Hosted URL | https://operations-board-react-showcase.vercel.app |
| Source | https://github.com/aliniroomand34/operations-board-react-showcase |
| Secrets / env | None required — mock API only |

After pushing newer commits, redeploy so the live site matches `main`.

## 3. Rules audit + keyword scan (publishable paths)

**Last audit:** 2026-07-21 (Phase 6 tests + honesty labels). Full glossary and claim
boundaries: [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md). Score record:
[PHASE5_SCORE.md](./PHASE5_SCORE.md).

Scanned: `src/`, `docs/`, `README.md`, `.env.example`, deploy configs under this package.

| Pattern class | Expectation | Result (2026-07-21 Phase 6) |
| --- | --- | --- |
| Private feature / product names | Zero hits | Clean |
| Game / commerce / messaging slang (player, pack, telegram, …) | Zero hits | Clean |
| Real API hosts, secret env keys, auth header literals | Zero hits | Clean |
| Realistic PII in mocks | Synthetic ids only (`client-001`, `batch-001`, …) | Clean |
| Redis / WebSocket in copy | Allowed as **documented context** only | OK in README / Case Study / FAQ |
| Category language (automation intake, operator extensions, …) | Allowed | Present as categories |
| `tone: "demo" \| "context"` on Case Study cycles | Required for honesty | Present (context behind details) |
| Finance Summary / Team Activity | **Demo** (synthetic) — not stub | Present with honesty badges |
| Remaining secondary nav (Clients, Settings, …) | **Stub** | Unchanged |
| Default entry Overview (not essay-first) | Required | `/` → `/app/overview` |
| Brand / EN fonts | Ops Console Demo; no unused Arabic font load | Done |
| Stack docs match `package.json` | React 19, Vite, TS strict, Tailwind 4, dnd-kit, Vitest, recharts | Aligned |
| Phase 5 fix list ≥8.5/10 | TA/CTO re-score | **8.7 / 10** |

**Out of scan:** local-only paths listed in [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md)
(`.cursor/`, progress notes, real `.env`).

Re-run before every public push. Keep private-term lists outside the repo (for example
`.local/private-terms.txt`).

```powershell
# Example: search your own private-term list held outside the repo
# rg -i -f ../.local/private-terms.txt src docs README.md .env.example

# Automated gate (same patterns; excludes glossary meta-docs)
npm run check:slang
```

## 4. Reviewer-facing docs

- [x] [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md) — glossary + claim boundaries current
- [x] [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md) — matches **shipped** routes
- [x] [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md)
- [x] [RESUME_BULLETS.md](./RESUME_BULLETS.md) — multi-surface admin demo claimed as shipped
- [x] [PHASE5_SCORE.md](./PHASE5_SCORE.md) — TA/CTO re-score vs fix list
- [x] README live demo URL matches the hosted site

## 5. Scope sanity

| Statement | Expected |
| --- | --- |
| Redis / WebSocket / bots / extensions | **Context only** — not live in repo |
| Expert TypeScript / senior testing expert | **Not claimed** |
| Production-grade responsive design | **Not claimed** — desktop-first |
| This repo is the full private product | **Not claimed** |
| Admin shell / Pipeline / Extension Sim / Finance / Team | **Shipped** under `/app/*` |
| Private product / game / messaging names | **Zero** in publishable paths |

## Done when

1. `npm run ci` is green.
2. Keyword scan on publishable paths is clean (`npm run check:slang`).
3. README **Live demo** points at the hosted URL.
4. Architecture FAQ, demo script, and resume bullets match **implemented** scope.
5. Glossary terms used consistently (operation request, client, inventory batch, …).
