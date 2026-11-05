# Architecture decision

Status: the React/TypeScript/Vite shell, theme persistence, and O-03b Figma equipment demo are implemented. App.tsx owns transient filter/sort/selection state and native dialogs; Workspace.tsx composes the character context, filter controls, and scanner guide; Equipment.tsx renders cards/details/image fallbacks and theme-specific Figma icons. demo.ts contains eight synthetic fixtures; it is not the future inventory domain model. Assets/fonts are local with provenance in ASSETS.md. O-04a inventory import/domain and IndexedDB inventory persistence are implemented as described below; catalogue enrichment and O-05 comparison snapshots are implemented; O-06 optimization workers are implemented; team persistence remains planned. See [README.md](../README.md) for the current source tree and local run instructions.

Use React and strict TypeScript with Vite for a client-side local application. The project does not need server rendering, authentication, a database server, or a cloud service. React owns interface state; pure domain modules own parsing, calculations, and search. Heavy optimization runs in a module Web Worker. Vitest covers deterministic domain behavior and selected component flows.

## Proposed structure

```text
src/
  app/                 shell, theme, workspace state
  components/          shared form/status/table primitives used by multiple views
  domain/              inventory types, validation, stat math, search, AV model
  features/
    inventory/         import, filters, item detail
    comparison/        profile and six-slot A/B editor
    optimizer/         worker controls and results
    speed/             member configuration and timeline
  storage/             versioned IndexedDB persistence and backups
  workers/             optimizer message boundary
  data/                small versioned constants with source notices
tests/                 fixtures or integration tests when shared
docs/                  decisions and verified continuation state
```

Avoid a general component framework, global state library, or chart package until a concrete need justifies it. Use native controls where possible. Derive filtered rows, build stats, and timeline events from current inputs; do not mirror them into effect-driven state.

## Data flow

O-04a implementation: `src/domain/inventory.ts` validates scanner/backup JSON and normalizes relics; `src/storage/inventory.ts` reads/writes one versioned backup in an IndexedDB transaction; `src/features/inventory/InventoryWorkspace.tsx` owns file preview, replacement, source precision, filters, pagination, backup download, and imported-item details. The synthetic demo remains separate in `src/app/`. Only 48 imported cards are mounted per page. O-04b adds pinned local relic metadata/main-affix tables in src/data, pure catalogue calculation in domain/catalogue.ts, imported reference metadata and richer inventory filters; O-05 saved comparisons and O-06 workers are implemented.

File selection -> parse unknown JSON -> validate complete export -> normalize required fields -> atomically persist workspace -> render inventory. Errors before persistence keep the old workspace. A storage failure must be visible and must not claim durable success.

The normalized model separates item identities, active stats, preview stats, character references, source precision, and import metadata. Saved builds are item snapshots or use a documented reconciliation policy, never fragile array indices across imports.

## Worker contract

A search request includes a run ID, inventory revision, profile, candidate groups, objective, constraints, and bounded search settings. Progress and results echo the run ID. The UI rejects stale messages. Cancellation terminates the worker, preventing a long synchronous loop from blocking cancellation. A new import invalidates outstanding work.

Return search mode, candidate counts, combination count, evaluated count, and whether the result is exhaustive. Limit retained results and intermediate search states; do not store every possible build.

## Persistence

Use versioned IndexedDB records for inventory, profiles, saved loadouts, and team configuration. Theme uses a small versioned localStorage key with failure handling. Backups contain an application schema version and required normalized data, with no credentials or unrelated scanner fields.

## Game constants

Keep catalogue sources/version/date visible in documentation. Constants are separate from imported personal data. Do not copy the previous prototype's data or algorithms without checking provenance and correctness. Missing records require manual input and an explanation; game updates must not make valid inventory imports disappear.

## Local execution

Vite dev/preview binds to `127.0.0.1`; keep a consistent port for browser storage. Production build outputs `dist/`. The exact package versions and run commands come from the O-03 lockfile and verified commands, not assumptions in this document.

## O-05 comparison implementation

`domain/comparison.ts` owns manual profile validation, equipped-loadout initialization, pure build totals and static set properties. `features/comparison/ComparisonWorkspace.tsx` owns A/B draft state and UI. It stays mounted across view switches so unsaved edits survive navigation; hash navigation restores the destination on reload, while loading a named snapshot restores saved values. Candidate pages mount at most 24 buttons. The shared profile applies to both loadouts; changing profile inputs intentionally changes both results.

`storage/comparison.ts` uses the existing version-1 workspace store under key `comparisons`, independently of the inventory key. Schema-1 records contain up to 20 named shared profiles, validated relic snapshots for A and B, source precision and the catalogue pin. JSON input is treated as unknown and decoded before storage replacement. Same-name saves replace that entry. Failed reads disable ordinary save to prevent overwriting an unread saved list; explicit validated backup restore remains available. Failed writes do not report success. No saved snapshot points to active-inventory array indices. No deletion UI is implemented; users can manage the saved list through backup restore.
## O-06 optimizer implementation

`domain/optimizer.ts` is a pure generator over bounded six-slot combinations. `workers/optimizer.worker.ts` runs it off the UI thread and emits typed progress/terminal messages defined in `optimizer.protocol.ts`. `features/optimizer/runner.ts` owns Worker termination, monotonic run IDs, revision matching and stale callback suppression. `OptimizerWorkspace.tsx` invalidates the runner in a layout effect when profile, inventory, options or active view changes; unmount terminates it. Each run gets a cloned profile/options snapshot and a new Worker. No persistent search queue or search-result database exists.

The existing comparison component owns the shared manual profile and A/B drafts. The optimizer destination presents that profile and search UI. Apply clones a result into B and navigates to Comparison without changing A; mixed snapshot/current-inventory provenance becomes unknown conservatively. Saving the comparison remains explicit. Progress is emitted every 1,000 evaluations. Reports include exact BigInt product counts serialized as strings, candidate counts, coverage, invalid example reasons and at most ten results. Worker and UI bundles are separate production assets.