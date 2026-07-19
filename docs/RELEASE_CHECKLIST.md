# Release checklist — public showcase

Final gate before publishing or after a major merge. Last run: **2026-07-19**.

## 1. CI quality gates

From `frontend/` (or repo root when this folder is the Git root):

```bash
npm run ci
```

| Gate | Command | Result (2026-07-19) |
| --- | --- | --- |
| Typecheck | `npm run typecheck` | Pass |
| Lint | `npm run lint` | Pass — 0 errors |
| Tests | `npm run test` | Pass — 31 tests / 5 files |
| Build | `npm run build` | Pass |

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

## 3. Keyword / privacy scan (publishable paths)

Scanned: `src/`, `docs/`, `README.md`, `.env.example`, deploy configs under this package.

| Pattern class | Expectation | Result |
| --- | --- | --- |
| Private feature / product names | Zero hits | Clean |
| Messaging / commerce / game slang from private domain | Zero hits | Clean |
| Real API hosts, secret env keys, auth header literals | Zero hits | Clean |
| Realistic PII in mocks | Synthetic ids only (`client-001`, `batch-001`, …) | Clean |
| Category language (private admin surfaces, automation intake, …) | Allowed | Present in README / Home / ADRs as categories |

**Out of scan:** local-only paths listed in [PUBLIC_SURFACE.md](./PUBLIC_SURFACE.md)
(`.cursor/`, progress notes, real `.env`).

Re-run before every public push from this package root. Keep private-term lists
outside the repo (for example `.local/private-terms.txt`).

```powershell
# Example: search your own private-term list held outside the repo
# rg -i -f ../.local/private-terms.txt src docs README.md .env.example
```

## 4. Reviewer-facing docs

- [ ] [RECRUITER_DEMO_SCRIPT.md](./RECRUITER_DEMO_SCRIPT.md)
- [ ] [INTERVIEW_DEFENSE.md](./INTERVIEW_DEFENSE.md)
- [ ] [RESUME_BULLETS.md](./RESUME_BULLETS.md)
- [ ] README live demo URL matches the hosted site

## 5. Scope sanity

| Statement | Expected |
| --- | --- |
| Redis / WebSocket / bots / extensions | Context only |
| Expert TypeScript / senior testing expert | Not claimed |
| Production-grade responsive design | Not claimed — desktop-first |
| This repo is the full private product | Not claimed |

## Done when

1. `npm run ci` is green.
2. Keyword scan on publishable paths is clean.
3. README **Live demo** points at the hosted URL.
4. Architecture FAQ answers stay aligned with implemented scope.
