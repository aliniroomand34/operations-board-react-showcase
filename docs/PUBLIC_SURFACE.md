# Public surface (what may ship on GitHub)

Defines the publishable path boundary for this showcase.

## In scope (publishable)

| Path | Why |
| --- | --- |
| `frontend/src/` | Showcase app: shell, routes, Operations Board, mocks |
| `frontend/docs/adr/` | Architecture decision records (anonymized) |
| `frontend/docs/RESUME_BULLETS.md` | Resume wording |
| `frontend/docs/RECRUITER_DEMO_SCRIPT.md` | 60-second live demo talking points |
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

These paths are listed in the repo `.gitignore` so a fresh `git init` + push does not leak them by default.

## Allowed public wording

Use **category** language, not private product names:

- private admin surfaces / operator tooling
- automation intake
- browser-based operator extensions
- backend workflow services
- mock API / synthetic data

Public domain language for the board: **operation request**, **client**, **inventory batch**.

## Forbidden in publishable docs and source

Do not leave private product names, messaging platforms used as intake, game/commerce slang from the private domain, real endpoint paths, production tokens, or realistic PII-like mocks in files listed under **In scope**.

Even “out of scope” lists must use categories — not private surface names.

## Quick verify before publish

From the package root, search **publishable paths only** for:

- Private feature / product names from the source system
- Messaging-platform or commerce slang from the private domain
- Real API path fragments, hostnames, ports, or secret env keys
- Realistic personal names, phones, or emails in mocks

Expect zero hits under `frontend/src`, `frontend/docs`, `frontend/README.md`,
`.github`, `vercel.json`, and `netlify.toml`.
