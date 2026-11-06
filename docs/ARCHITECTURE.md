# Architecture decision

Status: the React/TypeScript/Vite shell, theme persistence, and O-03b Figma equipment demo are implemented. App.tsx owns transient filter/sort/selection state and native dialogs; Workspace.tsx composes the character context, filter controls, and scanner guide; Equipment.tsx renders cards/details/image fallbacks and theme-specific Figma icons. demo.ts contains eight synthetic fixtures; it is not the future inventory domain model. Assets/fonts are local with provenance in ASSETS.md. O-04a inventory import/domain and IndexedDB inventory persistence are implemented as described below; catalogue enrichment and O-05 comparison snapshots are implemented; O-06 optimization workers are implemented; O-07 speed-team persistence is implemented. See [README.md](../README.md) for the current source tree and local run instructions.

Use React and strict TypeScript with Vite for a client-side local application. The project does not need server rendering, account login, a database server, or a cloud service. React owns interface state; pure domain modules own parsing, calculations, and search. Heavy optimization runs in a module Web Worker. Vitest covers deterministic domain behavior and selected component flows. O-09 adds a dependency-free Node HTTP runtime and per-runtime scanner session token, not user accounts.

## O-09 native boundary

`server/engine.mjs` verifies/provisions a pinned native engine; `server/scanner.mjs` supervises a single one-shot job and projects exports to required fields; `server/http.mjs` serves only dist and same-origin authenticated scanner endpoints. `server/start.mjs` reserves 127.0.0.1:4173 before setup and drains a scan on shutdown. `launch-scan.ps1` requests elevation for `scan-worker.ps1`; neither elevates the Node web server. The worker rechecks the pin, uses a named Windows mutex, waits for the bounded CLI, and requires its initialization log marker before marking a complete result. Temporary info-level stdout/stderr and the raw export are removed after the job. No trace log or packet file is requested. See SCANNER.md for lifecycle, cancellation, expiry and pending real-game verification. Node built-in tests exercise synthetic process adapters and real loopback HTTP; they never launch the native worker.

## Proposed structure

O-09 adds `features/inventory/scanner-api.ts` for unknown-response validation and `ScannerPanel.tsx` for lazy connection, polling, start/discard/review/reconnect. It rejects stale poll responses across commands and aborts requests on unmount. Review validates scan JSON with the existing domain parser before supplying InventoryWorkspace's pending import. The same explicit replacement transaction remains authoritative; scan completion does not save automatically. The Node runtime/helper lives under `server/`, with engine-only setup under `scripts/`.

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
## O-07 speed tuning

`domain/speed.ts` owns validated four-member fixed-speed AV simulation, cycle classification, event limits and the unbuffed threshold helper. `features/speed/SpeedWorkspace.tsx` owns live draft inputs, comparison-B snapshot copying, the native SVG chart, cycle counts, paginated action ledger and persistence controls. Comparison owns the shared B calculation and only supplies a source when all six slots and the profile are valid. Copying captures values and resets additional buffs/advance; no live ID/index link exists. Editing copied base or panel speed changes its precision/source label to manual.

`storage/speed.ts` stores one validated schema-1 team under `speed-team` in the existing workspace store. Team backup is separate from inventory/comparison backup and contains four members, cycle count and precision/source metadata. A validated restore saves before replacing UI inputs; errors retain the previous team. Normal saves stay disabled after a failed initial read to protect unread data; explicit backup restore can recover. Draft reset does not overwrite storage. Hidden speed views skip simulation/rendering of action output; active simulations reject output beyond 2,000 events before allocation. No Worker is needed for this bounded calculation. Event ledger mounts at most 50 rows per page; chart markers are bounded by the same output cap.
