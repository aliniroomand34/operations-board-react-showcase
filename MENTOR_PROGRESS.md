# Frontend Mentor Progress Log

> این فایل بعد از هر جلسه منتور به‌روز می‌شود.

## Portfolio Phase 10 — README, ADRs, Resume (2026-07-19)

### Completed
- [x] README expanded to case study: Problem, Scope, Architecture, Tradeoffs, Testing, Privacy, AI note, Next improvements
- [x] ADR 001: extract portfolio slice
- [x] ADR 002: mock API boundary
- [x] ADR 003 / 004 already present (TS migration + testing) — linked from README
- [x] `docs/RESUME_BULLETS.md` — honest Mid+ bullets, safe skills phrasing, 30s interview anchor
- [x] To-do `docs-resume` delivered without editing the plan file

### Pending
- [ ] Paste live demo URL after first Vercel/Netlify deploy
- [ ] Phase 6 maintainability refactor (optional)
- [ ] Final senior review rehearsal (answer interview questions in your own words)

### Architecture Decisions
- README is the recruiter entry point; ADRs hold decision rationale; resume bullets stay Mid+ honest
- Forbidden claims reinforced in docs: expert TS, senior testing expert, production responsive

### Learned Concepts
- Case study README vs install-only README
- Honest positioning vs keyword stuffing
- How to explain AI-assisted work without overselling or underselling ownership

### Mistakes / Notes
- Live demo URL still a placeholder until public remote + host are connected

### Next Step
- Connect GitHub + deploy, or optional Phase 6 maintainability + interview rehearsal

### Interview rehearsal (answer in your own words)
1. Why extract one board instead of publishing the whole private app?
2. Why put mocks behind an API boundary instead of hardcoding in the page?
3. How do you explain TypeScript/testing level without keyword stuffing?
4. What would you improve next, and why isn’t that a failure of the showcase?

---

## Portfolio Phase 8–9 — A11y, States, CI, Deploy (2026-07-18)

### Completed
- [x] Accessibility basics: skip link, focus-visible, modal Escape + labelled dialog, column regions, keyboard assign path documented
- [x] Loading / error / empty polish on Operations Board (status/alert roles, spinner, Retry + Reset CTAs)
- [x] Showcase-scoped scripts: `lint:showcase`, `test:showcase`, `ci`
- [x] GitHub Actions: `.github/workflows/ci.yml` (typecheck → lint → test → build)
- [x] Free static deploy configs: `vercel.json`, `netlify.toml` (SPA rewrite, no secrets)
- [x] README: Live demo placeholder, Deploy, CI, Accessibility sections (desktop-focused honesty)

### Pending
- [x] Phase 10: full case-study README polish + remaining ADRs + resume bullets
- [ ] Paste live demo URL after first Vercel/Netlify deploy
- [ ] Phase 6 maintainability refactor (optional)

### Architecture Decisions
- CI gates the **public showcase slice**, not legacy product tests still present in this copy
- Deploy is static-only; mock API needs no env vars
- A11y scope is demo basics, not a WCAG certification claim

### Learned Concepts
- Semantic HTML + keyboard first vs ARIA-only
- Why CI (typecheck/lint/test/build) beats manual “it worked on my machine”
- Empty/error states need recovery actions, not only messages

### Mistakes / Notes
- Live demo link stays placeholder until a public GitHub remote + host is connected (this workspace has no `.git` yet)

### Next Step
- Phase 10 README/ADR/resume alignment, or connect repo and deploy to fill Live demo URL

---

## Portfolio Phase 7 — Testing Track (2026-07-18)

### Completed
- [x] Vitest/RTL concepts documented in `docs/adr/004-testing-strategy.md`
- [x] Unit: `operationsBoard.helpers.test.ts` (existing) + `operationsBoard.api.test.ts` (transitions + failure)
- [x] RTL: `OperationsBoardPage.test.tsx` — loading, success columns, empty, error+retry, assign modal, complete
- [x] `setOperationsBoardMockDelay(0)` for fast, deterministic async tests
- [x] README + ADR هم‌تراز با honest testing journey
- [x] `npm test -- src/features/operations-board` → 17 passed

### Pending
- [x] Phase 8–9: a11y polish, CI/deploy configs
- [ ] Phase 6 maintainability refactor (optional polish)
- [ ] Phase 10: README case study / resume bullets + paste live demo URL

### Architecture Decisions
- Behavior over implementation: assert user-visible outcomes (roles/labels), not hook internals
- Assignment covered via accessible modal path; DnD pointer choreography left to manual demo
- Mock API delay configurable so tests don’t need fragile fake-timer gymnastics

### Learned Concepts
- Vitest: `describe` / `it` / `expect` + jsdom
- RTL: query by role/label; unit vs integration
- Why test behavior, not CSS class names or private state

### Mistakes / Notes
- Loading assertion needs a non-zero delay (or pending promise); delay `0` can skip the loading paint

### Next Step
- Phase 8+: a11y / CI / deploy، یا Phase 6 maintainability اگر اولویت با خوانایی hook باشد

### Interview rehearsal (answer in your own words)
1. تفاوت unit test و RTL integration در این board چیست؟
2. چرا drag-and-drop pointer را تست نکردیم ولی assign را پوشش دادیم؟
3. چه چیزی را عمداً تست نمی‌کنی و چرا؟
4. `setOperationsBoardMockDelay(0)` چه مشکلی را حل می‌کند؟
5. اگر interviewer بگوید «coverage عددت کمه»، چه جواب صادقی می‌دهی؟

---

## Portfolio Phase 5 — TypeScript Migration (2026-07-18)

### Completed
- [x] Domain types: `OperationRequest`, `InventoryBatch`, `BoardStatus`, `BoardColumn`, snapshot + validation unions
- [x] Helpers / mock data / mock API → `.ts`
- [x] Hook `useOperationsBoardLogic` → `.ts` با return type صریح
- [x] UI: `OperationsBoardPage` / Columns / Modals → `.tsx` با typed props
- [x] `tsconfig.json` + `npm run typecheck` (strict، بدون `any` عمدی در slice)
- [x] ADR: `docs/adr/003-typescript-migration-strategy.md`
- [x] Helper unit tests روی `.ts` پاس می‌شوند

### Pending
- [x] Phase 8–9: a11y basics، loading/error/empty polish، CI، deploy configs
- [ ] Phase 6+: maintainability refactor، broader RTL، ADRهای باقی‌مانده / resume
- [ ] Paste live demo URL after first deploy

### Architecture Decisions
- Types اول به‌عنوان contract؛ بعد helpers → API → hook → UI
- `tsconfig` فعلاً فقط `operations-board` + `mocks` را typecheck می‌کند (مهاجرت تدریجی)
- Discriminated unions برای validation (`BatchAssignmentValidation`) و `BoardAsyncState` آماده‌اند
- بدون ادعای expert TypeScript — learning journey

### Learned Concepts
- `type` vs `interface`؛ union / discriminated union
- چرا `any` خطرناک است و چطور `unknown` + narrowing امن‌تر است
- TypeScript به‌عنوان refactor safety در مصاحبه

### Mistakes / Notes
- Invite pages هنوز خارج از include typecheck هستند (pre-existing TS debt)
- فایل‌های `.js` موازی حذف شدند تا Vite فقط slice تایپ‌شده را resolve کند

### Next Step
- Phase 6 maintainability: extract normalization / transitions بدون abstraction زودهنگام

---

## Portfolio Phase 3 — Extract AdminMarket → Operations Board (2026-07-18)

### Completed
- [x] Feature slice در `features/operations-board/` با جداسازی UI / Logic / API / helpers
- [x] Rename عمومی: operation request / client / inventory batch (بدون pack/customer/telegram/EA/FUT/coin)
- [x] Board columns + drag/drop assign + confirm / details / assign-more modals
- [x] `useOperationsBoardLogic` روی mock API موجود
- [x] Domain helpers + Vitest unit tests
- [x] حذف کامل فولدر `AdminMarket` از این کپی showcase
- [x] README / HomePage هم‌تراز با extract واقعی

### Pending
- [ ] Phase 5+ polish: maintainability refactor، RTL tests، a11y، CI/deploy، ADR/resume

### Architecture Decisions
- Scope عمداً کوچک‌تر از AdminMarket محصول: بدون settings، auto-pilot، telegram windows، EA verify
- Mock API از Phase 4 حفظ شد و با `assignBatchesToInProgressRequest` / `cancelQueuedRequest` گسترش یافت
- Legacy AdminMarket از tree حذف شد تا نام‌ها و endpointهای حساس در public copy نمانند
- Domain types در `operationsBoard.types.ts`؛ slice اصلی (page/hook/helpers/api/columns/modals) روی TypeScript

### Learned Concepts
- چرا showcase باید UI/Logic/API/helpers را نگه دارد ولی business surface را slim کند
- Drag/drop به عنوان skill signal بدون وابستگی به backend خصوصی

### Mistakes / Notes
- Phase 4 قبل از Phase 3 انجام شده بود؛ extract روی همان mock shape سوار شد
- Featureهای orphan مثل AdminSettings / CustomerTransfer هنوز در tree هستند ولی از router عمومی import نمی‌شوند (imports به AdminMarket قطع شد)

### Next Step
- RTL behavior tests for assign / complete / loading-error flows

---

## Portfolio Phase 4 — Mock API And Synthetic Data (2026-07-18)

### Completed
- [x] `src/mocks/operationsBoard.data.js` — synthetic board seed + empty preset
- [x] `features/operations-board/operationsBoard.api.js` — async mock boundary (delay, get/assign/complete, failure + reset helpers)
- [x] `OperationsBoardPage` wired to mock API with loading / error / empty / success + demo controls
- [x] Real AdminMarket HTTP API removed from this showcase copy (folder deleted in Phase 3)
- [x] README updated: mock-only, static-deploy friendly

### Pending
- [x] Phase 3 extract: UI/Logic/helpers rename from AdminMarket into operations-board
- [x] Phase 5: TypeScript domain types + slice migration
- [ ] Phase 6+: maintainability refactor, tests suite, a11y, CI/deploy, ADR/resume

### Architecture Decisions
- API boundary lives next to the feature (`operationsBoard.api.js`); seed data lives in `src/mocks/` so UI never hardcodes network-shaped payloads
- In-memory mutations only — safe for Vercel/Netlify without a server

### Learned Concepts
- API boundary vs hardcoding data inside components
- Why mock async + delay makes loading/error states demoable
- Synthetic ids (`client-001`, `batch-001`) for public safety

### Mistakes / Notes
- Full drag/drop board extract completed in Phase 3 after mock boundary existed

### Next Step
- Phase 6 maintainability refactor (shared with Phase 5 next step)

---

## Portfolio Phase 2 — Public Showcase Shell (2026-07-18)

### Completed
- [x] Routes محدود به `/`, `/operations`, `*`
- [x] `ShowcaseLayout` بدون auth / role gate
- [x] `HomePage` + `OperationsBoardPage` shell + `NotFoundPage` عمومی
- [x] Vite بدون proxy به backend واقعی و بدون الزام `VITE_API_BASE_URL`
- [x] `ProtectedRoute` حذف شد از مسیر عمومی
- [x] README اولیه: anonymized architecture showcase + honest positioning

### Pending
- [x] Phase 3: extract/rename AdminMarket → operations-board
- [x] Phase 4: mock API + synthetic data
- [ ] Phase 5+: TS، maintainability refactor، tests، a11y، CI/deploy، ADR/resume

### Architecture Decisions
- App shell فقط showcase را mount می‌کند؛ surfaceهای `god` / `admin` / `shop` / auth از router خارج شدند
- Feature boundary: `frontend/src/features/operations-board/`
- Dev server دیگر به API خصوصی proxy نمی‌کند (mock-only path)

### Learned Concepts
- App shell vs routing layer vs feature page
- چرا showcase باید کوچک‌تر از محصول واقعی باشد (سیگنال واضح + امنیت)
- جداسازی layout عمومی از auth layoutهای محصول

### Mistakes / Notes
- ادعای responsive نکن؛ footer صریحاً desktop-focused است

### Next Step
- Phase 5: TypeScript domain types

---

## Portfolio Phase 1 — Scope And Rules (2026-07-18)

### Completed
- [x] معیارهای showcase در حافظه پروژه ثبت شد (`MENTOR_PROGRESS.md`)
- [x] قانون اختصاصی portfolio در `.cursor/rules/portfolio-showcase.mdc` اضافه شد
- [x] سطح ادعا تثبیت شد: **Strong Mid+ → Senior-ready** (نه Senior expert)
- [x] قوانین صداقت: TypeScript/Testing به‌عنوان learning journey؛ بدون ادعای responsive برای Admin-Mate/این demo
- [x] قوانین امنیت/ناشناس‌سازی: rename عمومی، mock-only API، حذف PII/endpoint/محصول حساس از این کپی

### Pending
- [x] Phase 2: Create public showcase shell
- [x] Phase 3: extract/rename AdminMarket
- [x] Phase 4: mock API، synthetic data
- [ ] Phase 5+: TS، tests، CI/deploy

### Architecture Decisions
- Showcase اصلی: **Operations Board** (از `AdminMarket`) — عمومی، غیرحساس، سیگنال معماری قوی
- استراتژی repo: همین کپی workspace را sanitize و GitHub-ready کردن (نه fork موازی از محصول اصلی)
- نام‌های پیشنهادی repo: `operations-board-react-showcase` یا `react-admin-operations-board`
- مسیر هدف feature: `frontend/src/features/operations-board/` + `frontend/src/mocks/` + `frontend/docs/adr/`

### Learned Concepts
- Honest positioning در رزومه/README vs keyword stuffing
- AI-assisted engineering قابل دفاع: ownership معماری + review، نه dependency کامل
- چرا showcase باید کوچک‌تر از محصول واقعی باشد (امنیت + سیگنال واضح برای recruiter)

### Mistakes / Notes
- هیچ ادعای responsive برای این showcase یا Admin-Mate ثبت نشود (desktop-first)
- ادعاهای اغراق‌شده TS/Testing ممنوع تا وقتی در همین repo قابل دفاع نباشند

### Portfolio Done Criteria (Phase 1 gate)
- ادعاها با تجربه واقعی سازگار: Strong Mid+ → Senior-ready
- TS و Testing به‌عنوان journey، نه مهارت اغراق‌شده
- بدون ادعای responsive نادرست
- بیان حرفه‌ای AI assistance (architecture ownership + review discipline)

### Next Step
- Phase 5: TypeScript domain types

---

## Session 0 — Setup (2025-06-22)

### Completed
- [x] قوانین Frontend Engineering Mentor System در `.cursor/rules/frontend-mentor-system.mdc` ثبت شد
- [x] فایل پیشرفت ایجاد شد
- [x] تحلیل اولیه لایه Application Root انجام شد

### Pending
- [ ] تحلیل و بهبود `main.jsx` و `App.jsx`
- [ ] تحلیل لایه Routing (`router.jsx`, `ProtectedRoute.jsx`)
- [ ] تحلیل Layout Layer (`MainLayout`, role layouts)
- [ ] مهاجرت تدریجی به TypeScript
- [ ] آپلود SRT دوره (هنوز ارسال نشده)

### Architecture Decisions
- (هنوز تصمیمی ثبت نشده — منتظر پیاده‌سازی تو)

### Learned Concepts
- (جلسه اول — مفاهیم آموزش داده شد، منتظر تمرین عملی)

### Mistakes / Notes
- پروژه ترکیبی از `pages/`, `features/`, `components/` است — باید مرزها روشن شوند

### Next Step
- Portfolio track: Phase 5 TypeScript on operations-board
