# Architecture decision

Status: the React/TypeScript/Vite shell, theme persistence, and O-03b Figma equipment demo are implemented. App.tsx owns transient filter/sort/selection state and native dialogs; Workspace.tsx composes the character context, filter controls, and scanner guide; Equipment.tsx renders cards/details/image fallbacks and theme-specific Figma icons. demo.ts contains eight synthetic fixtures; it is not the future inventory domain model. Assets/fonts are local with provenance in ASSETS.md. O-04a inventory import/domain and IndexedDB inventory persistence are implemented as described below; catalogue enrichment, optimization workers and other persisted features remain planned. See [README.md](../README.md) for the current source tree and local run instructions.

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

O-04a implementation: `src/domain/inventory.ts` validates scanner/backup JSON and normalizes relics; `src/storage/inventory.ts` reads/writes one versioned backup in an IndexedDB transaction; `src/features/inventory/InventoryWorkspace.tsx` owns file preview, replacement, source precision, filters, pagination, backup download, and imported-item details. The synthetic demo remains separate in `src/app/`. Only 48 imported cards are mounted per page. O-04b adds pinned local relic metadata/main-affix tables in src/data, pure catalogue calculation in domain/catalogue.ts, imported reference metadata and richer inventory filters; workers and saved builds remain planned.

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
