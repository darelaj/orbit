# Verification and remaining acceptance

This is a concise evidence index, not a fresh test run. Historical reports remain in Git. Add a scoped current result when behavior changes; do not append every old checkpoint or label historical results as current indefinitely. Test requirements live in [TECHNICAL](TECHNICAL.md#verification-policy).

## O-11d target-stat engine, 2026-11-08

Domain milestone `8cedf28` adds CV/CRIT objectives, simultaneous hard minimum/maximum stat bounds, target-mode validation, legal Cavern/Planar requirements and deterministic per-slot ID ties. Integration adds a test of the actual Worker handler and documents the contract. Current UI choices remain unchanged; new controls await O-11f. No dependency, native reader, storage or asset changes.

Final code: 70 Vitest tests in 21 files and 18 Node backend tests passed; production build including strict TypeScript checking passed. Independent recursive brute force compares 192 combinations for CV, CRIT Rate, CRIT DMG, SPD and ATK under bounds/set constraints. Fixtures verify SPD 134 saturation, simultaneous infeasibility without relaxation, raw CV above 100% CRIT Rate, main-stat/static-set contributions, preview exclusion, invalid targets/set partitions, stable ties, invalid calculations and limited-search uncertainty. Existing runner cancellation/restart/revision/stale-result checks still pass.

The actual Worker handler receives structured-cloned synthetic input, evaluates 4,096 combinations, emits four progress messages and returns ten ranked results with expected objective/bound diagnostics and run/revision identity. A second request verifies validation error identity. This is work-count evidence, not a benchmark or personal scan. Missed-bound counters cover only evaluated, set-compatible, calculable builds and can overlap.

No UI/browser walkthrough, service, game capture or UAC was started for this domain-only task. Static-model exclusions remain; no DPS, percentile, universal optimum or owner UI acceptance is claimed. Ignored check logs: `.cache/o11d-tests.log` and `.cache/o11d-build.log`.

## Remote character artwork, 2026-11-08

Local catalogue/renderer milestone `61de83a` adds 98 pinned remote portrait mappings, image error fallback and narrow runtime img-src permission; integration preserves explicit manual profile character IDs, switches demo/profile banners to ID-based art and resolves public Trailblazer/Path labels. No new binary images, dependency or asset licenses are added. All 98 URL HEAD checks returned successful image responses and wildcard anonymous CORS; requests did not download/store image bodies. Browser rendering still transfers the displayed images normally, with ordinary browser caching.

Final local suite: 65 Vitest tests in 19 files and 18 Node backend tests passed; production build/strict typecheck passed. Tests cover exact-ID URL selection, prototype/unknown/arbitrary-URL rejection, no-referrer/anonymous attributes, named failure and recovery on character change, manual identity snapshot round-trip/validation, applied-profile artwork independent of editable labels, and actual HTTP CSP headers retaining self-only connect-src/scanner protection. Existing calculations/storage/worker tests still pass. Coverage is the pinned 98-entry artwork snapshot, not future characters/skins or expanded automatic stat support.

Browser fixture `tests/browser/artwork-preview.html` uses only public metadata and the actual renderer/banner CSS; no inventory, IndexedDB or scanner access. Acheron, Bronya and Trailblazer Remembrance were observed loaded with 2048px intrinsic width from remote URLs; the unknown fixture displayed Artwork unavailable. Generic non-Acheron art was changed to a contained frame after the original Acheron crop clipped Bronya. A public {NICKNAME} template was replaced with Trailblazer/Path metadata, not account nicknames.

Scoped audits: dark/light at 1440×1000, 390×844 and 320×800, plus unknown fallback in both themes at 320px, reported no overflow, small effective targets or scoped text-contrast failures; minimum 7.97 dark / 5.49 light. Initial live-edit QA emitted duplicate-createRoot warnings; the owned fixture now disposes its root on HMR, and a fresh final load rendered Bronya with no console errors. This is development-fixture browser evidence; production CSP was checked through the actual loopback HTTP tests, not a production-browser walkthrough. Solid-background contrast checks do not certify imagery or full accessibility. Temporary tabs closed, viewport reset, owned Vite stopped; no personal data/capture/UAC. Evidence remains ignored at `.cache/artwork-qa/bronya-desktop.jpg` and `audit-results.json`.

Scoped antislop gate: actual sourced artwork identifies the applied character; fixed-size named fallbacks preserve layout and calculations; the Acheron demo retains its accepted crop while other portraits avoid misleading fragments. Existing Figma palette/type, both themes and ENERGY/RHYTHM/MOTION remain unchanged; no invented art/logo/metrics or animation was added. Browser states and tests above establish the changed controls/data behavior only. Network availability/provider visibility remain disclosed in SOURCES, and owner approval of the broader UI is not claimed.

## O-11c baseline profiles, 2026-11-08

Local data/domain milestone `04517ff` adds reproducible pinned constants for three reviewed baseline characters and 170 Light Cone base progressions, source identity and snapshot validation. Later integration adds explicit baseline-kit/Light-Cone choices, roster initialization, draft replacement protection, edited-source labeling and manual fallback. Kit-version equivalence is unverified; baseline selection is explicit, not automatic enhanced-kit detection. Major effects, Eidolon/Light Cone passives and combat remain excluded. Real account/stat matching is pending.

Full local suite: 61 Vitest tests in 18 files and 18 Node backend tests passed; production build/strict typecheck passed. Independent expectations cover character base/ascension/Trace totals, cone bases/Path mismatch, missing/unknown/unresolved data and provenance snapshots. After the final inventory-refresh guard, the 9 affected domain/component/cross-workflow tests and production build passed again. The guard cancels pending initialization and resets model choices while retaining existing snapshots. No native reader, UAC, personal capture, dependency or asset update was used.

Browser controls exercised on the real ComparisonWorkspace with synthetic schema-derived input and an in-memory IndexedDB replacement: select roster/kit, initialize Acheron and equipped cone (base HP 1125.432, ATK 698.544, DEF 436.59, SPD 101); manually edit SPD to 105 and observe edited origin; keep drafts on reinitialize; save/load a snapshot; reject unsupported form 8007 without zero-filled stats; explicitly replace drafts; open source disclosure with Enter. This was a Vite development fixture, not a full production/scanner walkthrough. Its tracked equivalent is `tests/browser/profile-preview.html` (run dev, then visit that path); the executed copy was under ignored `.cache`. It imports no native scanner and replaces IndexedDB before mount; no actual browser inventory was read/overwritten. The temporary tab was closed, viewport reset and owned Vite session stopped.

Final visual scope: dark/light at 1440×1000, 390×844 and 320×800 with source details expanded. All six audits reported no document overflow, no effective active target below 44px and no scoped text-contrast failures (minimum 7.97 dark, 5.49 light). A 320px long-pin overflow found during review was fixed with local wrapping and rechecked; checkbox layout was adjusted locally. Console error query returned no entries. Ignored evidence: `.cache/profile-qa/dark-desktop.jpg`, `light-mobile.jpg`, `audit-results.json`. Solid-background audits exclude image/pseudo-element compositing, disabled controls and assistive-technology certification.

Scoped antislop gate: purpose is initializing the selected character model, without changing the accepted HSR identity or adding a dashboard; palette/type/art stay sourced and both themes work. Baseline/edited/manual labels, exclusions, placeholder fallbacks and named replacement actions reflect actual data/actions; numeric fixtures are explicitly synthetic. ENERGY 2 / RHYTHM 2 / MOTION 2 is retained, with no new animation. Native controls, keyboard disclosure/focus and responsive/target/contrast checks above establish the scoped craft evidence. Broader O-11f usability redesign, all-character kit mapping and owner approval are not claimed.

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
