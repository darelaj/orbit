# Verification and remaining acceptance

This is a concise evidence index, not a fresh test run. Historical reports remain in Git. Add a scoped current result when behavior changes; do not append every old checkpoint or label historical results as current indefinitely. Test requirements live in [TECHNICAL](TECHNICAL.md#verification-policy).

## O-11b character data, 2026-11-08

Implemented data retention only; automatic stat profiles and new character-first UI remain O-11c/f work. Local final-code verification: 55 Vitest tests in 17 files, 18 Node backend tests, strict typecheck and production build passed. Focused import/storage checks passed before the full suite. No dependency, asset, native pin/helper or UI changes; no browser walkthrough or real capture/UAC was run for this data-boundary change.

Synthetic shared schema-derived fixture covers equipped and unequipped roster entries, unresolved form/level placeholders, skill/Trace/memosprite/ability-version retention, equipped/unequipped Light Cones, decimal relic SPD and privacy projection. Checks cover both supported sources/InitialScan, absent versus empty roster, incomplete/legacy status, schema-1 load and explicit schema-2 migration, backup round-trip, invalid nested types/ranges/duplicates/provenance, and aborted or invalid writes preserving old data. Node projection checks strip nested unrelated fields and preserve missing reference sections; browser validation remains authoritative for numeric ranges. Existing comparison/team and cross-workflow tests still pass.

Raw progression presence is not verified mapping or account completeness. Actual roster completeness, stat matching and native capture cleanup remain owner-driven acceptance; no personal scan result was read. Exact-head CI remains an integration check when this branch is published, not a claimed local result.

## Verified baseline (before O-11b)

- O-04–O-08 used schema-derived synthetic fixtures for inventory, manual-profile math, bounded search, AV boundaries, independent backups and failed-write rollback. Production-browser walkthroughs exercised actual controls, Worker output, theme/layout and keyboard behavior. These are scoped observations, not real-account matching or full accessibility certification.
- O-09 setup downloaded and verified the pinned reader; production startup reached idle ready. Browser scan/discard/review flows used the non-capture synthetic harness. Real personal inventory was not substituted for test fixtures.
- Final pre-consolidation local runtime evidence: 50 Vitest tests, production build/strict typecheck and 17 backend tests passed. Windows fixtures parsed helpers and exercised harmless child processes with isolated mutexes; no test requested UAC or native capture.
- The Windows detached-launch regression was reproduced with a harmless marker script: detached PowerShell could exit 0 without running it. Hidden, non-detached launch plus explicit child/native waits fixed that path. After owner restart/retry, read-only runtime status reached **ready / Scan received**. The agent did not read the personal result or operate elevation prompts.
- PRs #16–#18 were merged before this task. PR #18's exact-head Windows/Linux CI run was `42282057786`; main merge baseline `96a74e8`. These runs cover prior runtime changes, not a new execution during document consolidation.

## Remaining acceptance

- Real inventory count/completeness, fractional stat precision and in-game stat matching are unverified.
- Actual browser replacement of the owner's scan was not observed by the agent.
- Real normal/timeout/cancel/shutdown Packet Monitor cleanup, native panic and broad game-version compatibility remain owner-driven checks. A result reaching the complete-output boundary does not establish them.
- Prior solid-background contrast/target/overflow audits exclude image/pseudo-element compositing, disabled controls, every browser and assistive-technology certification. No broad accessibility claim follows.
- The owner requested a simpler Comparison/Optimizer/Speed workflow; prior technical UI checks do not establish owner acceptance. O-11 is planning only. O-10 hosted Companion also remains unimplemented.

## Historical reports

Commit `3633aca` is the immutable pre-consolidation documentation snapshot. Git retains all source documents, detailed control walkthroughs, antislop gates, pins, numerical evidence, old branch ledgers and checkpoints. Inspect only the report needed:

```powershell
git show 3633aca:docs/VERIFICATION.md
git show 3633aca:docs/FIGMA_VERIFICATION.md
git show 3633aca:docs/IMPLEMENTATION_PLAN.md
git show 3633aca:docs/archive/SESSION_HISTORY_2026-11-07.md
```

For an old technical guide or other removed document use `git show 3633aca:docs/<original-name>.md`; this is a historical Git path, not a current filesystem link. The active documentation map is in [README](../README.md#documentation-and-contributing). Never treat a historical report as proof that a later modified head passed.

## Documentation consolidation, 2026-11-07

Scope: merge overlapping documentation, preserve O-10/O-11 plans and source/license records, replace historical report accumulation with Git references, and update navigation. Runtime changes are limited to the footer credit URL; the local HSR skill changes only its contract-document path. Upstream skill files and license payloads remain unchanged.

Completed: 38 local link/heading-anchor checks; all O-10a–h and O-11a–h entries; catalogue, font, skill and engine pins; historical Git lookup; obsolete-reference scan; contract-coverage review; staged whitespace; unchanged README setup code blocks; exact URL-only App diff; and no upstream skill/license/native/dependency changes. Project-owned tracked Markdown files decreased from 22 to 8, excluding skills. Removed-path mentions remain only in the intentional historical Git commands above. No application tests, build, browser, service or personal capture ran for this documentation/URL-only task.

The standard skill validator was attempted but could not import PyYAML in the available Python environment. An exact comparison against `3633aca` instead confirms unchanged frontmatter and instructions, with only the expected contract-path replacement. No validator pass or new skill behavior is claimed; no dependency was installed for this routing edit.
