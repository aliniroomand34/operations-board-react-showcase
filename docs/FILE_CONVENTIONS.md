# File & folder conventions

House style for this Ops Console Demo. Naming is **feature-first + flat + role
suffixes** — sized for a mid showcase, not a monorepo micro-architecture.

**UI / Logic / API / helpers means responsibility separation, not folder names
like `-UI`, `ui/`, `logic/`, or `api/` inside each feature.**

## Locked rules

| Kind | Convention | Examples |
| --- | --- | --- |
| Feature folder | `kebab-case` | `operations-board/`, `inventory-pipeline/`, `demo-charts/` |
| React component file | `PascalCase.tsx` | `AssignBatchesModal.tsx`, `OperationsBoardCards.tsx` |
| Non-UI module | `featureStem.role.ts` | `operationsBoard.helpers.ts`, `finance.selectors.ts` |
| Hook | `useThing.ts` | `useOperationsBoardLogic.ts`, `useDemoOverviewMetrics.ts` |
| Layer boundary | Suffix on the file — **not** nested `ui/` / `logic/` / `api/` folders | `*.api.ts`, `*.helpers.ts`, `*.types.ts`, `use*Logic.ts` |

## Layer suffixes (responsibility)

| Suffix / pattern | Responsibility |
| --- | --- |
| Page / columns / modals / cards (`PascalCase.tsx`) | Presentation, interaction, a11y labels |
| `use*Logic.ts` | Orchestration: load, open modals, call API |
| `*.helpers.ts` | Pure domain rules (validation, capacity, ids) |
| `*.api.ts` | Async boundary (delay, failure, transitions) |
| `*.types.ts` | Domain contract shared across layers |
| `*.selectors.ts` | Derive view models from `demoStore` (charts, tables) |
| `*.theme.ts` | Presentational tokens (e.g. chart palette) |

## Feature stems

Full feature name in the stem when the surface is large (`operationsBoard.*`,
`inventoryPipeline.*`, `extensionAcquisitionSim.*`).

**Short stems are intentional** for selector-light demo surfaces — do **not**
rename for symmetry alone:

- `finance.*` (not `financeSummary.*`)
- `team.*` (not `teamActivity.*`)
- `overview.*`

## App shell vs features

| Location | Owns |
| --- | --- |
| `src/features/<feature>/` | Demo route features (board, pipeline, sim, overview, finance, team, charts, shared chrome) |
| `src/pages/` | Shell / stub / Case Study only — not feature demo pages |
| `src/hooks/` | Cross-feature hooks only (e.g. `useDemoStoreControls`) |
| `src/components/`, `src/layouts/`, `src/routes/` | Shared shell chrome and routing |
| `src/mocks/` | Shared `demoStore` + synthetic seed — do not split per feature |

## Explicit non-goals

- Nested `ui/` / `logic/` / `api/` folders per feature
- Renaming short stems (`finance` → `financeSummary`) for naming purity
- Subfolders inside a feature solely to group “related” files (only revisit if a
  feature grows far past ~30 files — not required today)
- Runtime / mutation / DnD behavior changes as part of rename work

## Related

- Architecture overview: [../README.md](../README.md#architecture)
- Publishable surface & glossary: [PUBLIC_SURFACE.md](PUBLIC_SURFACE.md)
- Visual layer (chrome / charts): [adr/006-visual-parity-shared-chrome.md](adr/006-visual-parity-shared-chrome.md)
