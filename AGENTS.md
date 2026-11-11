# Working on Orbit

## Scope

Orbit is a local HSR relic workspace built with React, strict TypeScript and Vite. Keep English UI copy, both themes and the accepted HSR/Figma equipment design; converse in the user's language.

Implement the current request only. Questions do not authorize code changes; planning does not authorize implementation. O-10 hosted website/Windows Companion stays planning-only and last priority until requested. Preserve `../relic-lab`.

Validation, calculations and durable personal data stay in the browser. Full inventory comes from scanner exports; Enka supplies public showcase data only. Never start personal capture or elevation for development; real scans require the owner's Scan action. Cloud sync, telemetry, login, game memory access, auto-salvage and unmodeled combat features remain outside scope.

## Context and skills

Check Git status first; read `docs/SESSION_STATE.md` when resuming. Use `rg` and bounded reads of relevant code. Reuse unchanged instructions already in context; narrow truncated output rather than repeating it.

Read only the relevant reference:
- `README.md` / `package.json`: setup, scripts, implemented availability and documentation map.
- `docs/PLAN.md`: current milestone and dependencies.
- `docs/TECHNICAL.md`: architecture, inventory/storage, calculations, search, speed, scanner and verification contracts.
- `DESIGN.md`: UI/Figma direction; `docs/SOURCES.md`: assets, skill pins and notices.
- `docs/VERIFICATION.md`: recorded evidence and pending acceptance; historical reports stay in Git.

Load applicable `.agents/skills/*/SKILL.md` only:
- Coding/review: `ponytail` (full default), `karpathy-guidelines` (community guidance).
- Inventory/math/search/timeline: `hsr-calculation-integrity`.
- UI: `antislop`, `antislop-ui`; React: relevant `react-best-practices` rules.
- Prose: `antislop-copywriting` plus core; comments: `antislop-code`.

Antislop DURING is this conversation's choice, not a global preference. New sessions resolve their mode. Preserve upstream skill files/notices; record skill changes, pins and validation in SOURCES. Examples do not authorize extra dependencies.

## Execution and verification

Use RTK for supported commands; inspect raw output when diagnosis or verification needs it. Batch independent reads, summarize successful logs and avoid redundant checks. Do not promise unmeasured savings.

Verify behavior proportionately:
- Docs: diff, links/commands and whitespace; no app tests/build/browser.
- Parser/storage: valid/invalid fixtures, precision/identity, atomic rollback and backups.
- Math/timeline: independent expectations and boundaries.
- Search: reference brute force, legality, bounded work, cancellation and stale results.
- Scanner/backend: synthetic process/API checks; helper parsing if changed; no real capture/UAC.
- UI: changed controls, both themes, wide/narrow, keyboard, contrast/overflow and applicable antislop gate. Record observed evidence; screenshots alone do not prove behavior.
- Skills: validator, provenance/notices and relevant behavior; document compatibility exceptions.

Run focused checks during development. Before feature integration, run the full suite and production build on final relevant code; build includes typechecking. After changes rerun affected checks; repeat broader checks only for unresolved risk. Inspect Windows/Linux CI for the exact PR head. Never claim stale checks, accuracy, performance or accessibility certification as fresh evidence. Avoid tests that merely mirror wording/source/CSS.

## Git, runtime and data

Create a branch per feature/docs task unless the user specifies otherwise. Preserve unrelated work and author history; commit focused milestones, staging explicit paths. Exclude personal exports, secrets, captures, caches, dependencies and build output. No force-push, destructive reset or forced branch deletion.

Use PR merge commits by default; integrate stacked dependencies first. Verify merged status and every task commit in synchronized main before deleting that PR's local/remote branch. Verify remote refs when pushing; local commits are not a push. Continue already-authorized work without repeat confirmation.

Use npm's lockfile and `npm.cmd` in PowerShell. Reinstall/upgrade only when needed; stop owned watchers before `npm ci`. Dev/preview/scanner share `127.0.0.1:4173`; preserve this origin, never bind publicly, kill unrelated processes or clear browser storage for tests. Track and stop owned services after checks unless needed.

Preserve item IDs/provenance, unsupported identities, unrounded values and separate active/preview/reroll stats. Validate before replacing data; retain independent backups and failed-write recovery. Use synthetic fixtures; disclose unknown mechanics instead of dropping data or inventing zero stats.

## Handoff

Update only affected contracts/docs; routine progress belongs in SESSION_STATE, plans in PLAN and evidence in VERIFICATION. Keep the checkpoint below about 400 words: branch/base/dependencies, changes, checks, limits, next task and services. Replace old state; avoid new guides or duplicated plans.

Before handoff review diff/status and focused commits. Report outcome, checks and remaining limits concisely. Do not start another milestone automatically.
