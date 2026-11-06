# Current O-09 checkpoint

2026-11-06. Owner selected an integrated local scanner controlled from Orbit. Branch `feat/integrated-scanner`, based on clean synchronized main `0f890adec144db5ca01a90bfe4d24125397b3beb`. PR #14 is merged; its final head 648f8b2 passed both CI matrix jobs in run 42177844143. Its source branch was deleted remotely/locally. The old O-08 next-action list below is historical.

O-09a records the new authorized scope and plan in SCANNER.md, AGENTS.md, PRODUCT.md and IMPLEMENTATION_PLAN.md. Reliquary v0.19.0 pktmon x64 release URL, 12,294,144-byte size and SHA-256 were read from official GitHub metadata. Pinned source confirms schema 4 and required Administrator privilege. Decision: ordinary-user Node server, elevated one-shot native helper only on Scan; browser validation/IndexedDB remain authoritative. No scanner has been installed or executed, no personal capture performed, no running service started.

Next: implement O-09b setup/runtime/helper and synthetic tests, commit independently, then O-09c UI/import integration and tests, then O-09d docs/browser/CI/PR. Read SCANNER.md before implementing. Do not mark capture/UAC/real inventory compatibility verified from mocks. Preserve incremental commits, feature branch and merge-commit PR cleanup workflow. No delegation requested. Skills: existing Karpathy, HSR integrity, antislop DURING, UI/copywriting/React; accepted design remains unchanged.

## Historical checkpoints below

# O-08 checkpoint (historical)

2026-11-06 (Asia/Jakarta). Branch `test/workspace-acceptance`, base `776929b41702ca95ebdcdbbca3b1033f2e6c5ea9` (PR #13 merged and source branch removed remotely/locally). [PR #14](https://github.com/darelaj/orbit/pull/14) is open. Commits: `1adcaa0` independent full-App persistence/abort/stale-terminal tests; `65c3c67` pinned Linux/Windows CI; `de8e9a9` skip-route/focus fix and 44px disclosure targets; then this verification/checkpoint and browser-audit helper. No delegation requested.

All core O-01–O-08 milestones are implemented and verified within the documented synthetic/manual model. O-08 local checks: typecheck, 43 tests / 15 files, production build passed. CI run 42176422051 succeeded for de8e9a9 on both Ubuntu and Windows, including npm ci, typecheck, tests and build. Final head must be checked again before merging PR #14. Workflow uses official v6 action SHAs verified by git ls-remote, Node 24 and contents:read only; no deployment/publishing is configured.

Production browser tested import/cancel/reselection/rollback, filters/dialog focus, manual profile, saved snapshots, actual Worker constraints/no-result/transfer, B-to-SPD, reload and wrong-format restore rejection. Worker cancel and input invalidation were also exercised with the 240-item synthetic pool. Two actual defects were fixed: 20px disclosure targets and Skip to content changing routes. Native keyboard focus now enters main without changing the calculation destination/hash. Matrix of four views × two themes × three widths (1440/390/320) passed scoped contrast/target/overflow checks; minima 5.03 light / 7.97 dark, console error query empty. Read VERIFICATION.md for exact outcomes and exclusions.

Before manual replacement, all three backup types were exported. After UI restore, newly exported inventory/comparisons/team matched the originals under canonical JSON comparison. Original light theme and viewport restored; owner reference tabs preserved. Only synthetic prior QA fixtures/profile were used. Production preview session 35373 stopped. Screenshots/raw audit JSON are under `.cache/acceptance/`; read-only helper now lives in tests/browser/audit-ui.js. Downloaded backup contents are not committed.

Next actions:
1. Finish existing PR #14 integration, not a duplicate. Push this final docs/helper commit, verify both CI matrix jobs for its exact head, merge with expected head SHA, sync main and verify all task commits before deleting the source branch remotely/locally. Keep incremental commits and merge history.
2. After successful integration, no original core implementation task remains. Await owner direction for real-account validation, visual revisions or a separately agreed extension. Real scanner export/stat/turn matching and owner visual approval are pending, not silently marked passed. Do not launch a scanner/capture or expand dynamic combat/profile scope without authorization.
3. Future work starts a fresh feature branch. Preserve snapshots, separate backups, source precision and fixed-model exclusions. Keep README/domain docs/checkpoint current only when their behavior or decisions change.

## Historical checkpoints below

# Current O-07 checkpoint

2026-11-06 (Asia/Jakarta). Branch `feat/speed-tuning`, base `78aa9f6f51f888d33279c5d96e15d5f2ede04623` (PR #12 merged, source branch removed remotely/locally). Incremental commits: `4527166` bounded AV math/tests, `e611a1a` independent team persistence/backup, `1feab4a` UI/B snapshots/navigation/edge tests, followed by this documentation checkpoint. Continue branch-per-feature, incremental commits, merge-commit PR integration and verified remote/local source-branch deletion. No delegation requested.

O-07 delivered: four-member manual fixed-speed AV model; base-SPD percentage buffs; additional flat buffs; initial-only advance; stable exact ties; inclusive ending-cycle policy with 1e-9 AV tolerance; fractional target helper; numbered SVG lanes, per-cycle counts and 50-row action pages; complete/valid B speed snapshot copying with source precision; explicit save/reload and separate team backup/restore. Bounds: 1–20 cycles, finite inputs within ±1,000,000, positive base/panel/effective SPD, 0–100 advance and at most 2,000 actions. Exactly 2,000 is accepted; larger output and nonfinite intervals fail without partial results. Defaults are illustrative 100-SPD members, not game stats. No repeated advance, changing buffs, delays, summons, ultimates or SP economy is modeled.

Final checks passed: typecheck, 39 tests / 14 files and production build. Tests cover base-versus-panel buff math, initial advance once, cycle-end classification, ties, fractional threshold, invalid input/output caps including exact 2,000 and numeric underflow, persistence/backup precision, invalid-write retention, B copy reset/provenance/no live relinking, failed-save feedback, reload state and event pagination.

Browser: created local IAB tab 5 without changing the owner's reference tabs. Used only prior synthetic inventory/comparison profile and illustrative/manual team inputs. Verified member-1 advance 50% actions at 50/150/250 AV (C0/C0/C1), copy B SPD 131.032 with OCR provenance and zeroed extra buffs/advance, edits to other members, save/reload, download, validated restore, invalid-file retention, 20-cycle ledger page 2/3, fractional C0 target, output-cap error with no chart, and reload of prior valid saved team. Dark 1440x1000, light 390x844 and 320x800 had no document overflow; speed navigation stayed visible and keyboard chart scrolling worked. Error-console query was empty. Screenshots `.cache/speed-qa/desktop-dark.jpg`, `mobile-light.jpg`. Owned Vite session `59668` stopped and viewport reset. Synthetic backup downloaded to `C:\Users\Chroma\Downloads\orbit-speed-team.json`. No real in-game profile/turn-order validation is claimed.

Next: resolve this branch's existing PR integration if needed, synchronize main and verify all commits before remote/local source deletion; do not create a duplicate PR. Next planned task is O-08 `test/workspace-acceptance`: cross-workflow synthetic acceptance, both themes/narrow/keyboard cases, invalid import/restore rollback, durable state and Worker lifecycle. All core milestones O-04–O-07 exist, but game-specific real-export accuracy and user visual approval remain pending. Keep performance/accessibility claims scoped to actual measurements; do not call synthetic tests real-account acceptance.

## Historical checkpoints below

# Current O-06 checkpoint

2026-11-06. Branch `feat/relic-optimizer`, base `d70fe2c78ff2bf086a5c6bb83060262432e8960e` (PR #11 merged and its source branch deleted remotely/locally). Incremental commits: `381d4ea` bounded search/constraints, `1285f11` Worker lifecycle/stale guards, `9ad74a2` optimizer UI/integration and invalid-calculation disclosure, then this docs checkpoint. Continue branch-per-feature, incremental commits, merge-commit PR integration and verified remote/local branch cleanup. No delegation requested.

O-06 delivered: exact filtered enumeration or explicit deterministic limited sampling, manual-profile objectives (including a not-DPS ATK/CRIT index), inclusive raw SPD bounds, minimum set counts, eligibility/ID/main-stat filters, BigInt counts, bounded top-ten results, invalid count/example reasons, module Worker progress/cancel, input/import/view invalidation and result-to-B snapshot transfer while preserving A. Search/settings are session-only; persist via Comparison explicitly. No conditional combat model or timeline exists. Runtime limits and sampling guarantees are in CALCULATIONS.md. Unavailable retained filters after import are explicitly labeled, not hidden by missing options.

Verification: full suite 31 tests across 11 files, typecheck and production build passed. A final test-only assertion for unavailable retained filters passed in the targeted optimizer component run plus typecheck. Exact mode matches independent small-space brute force; tests cover constraints, no result, limited coverage, huge integer counts, invalid calculations, Worker cancel/restart/import stale messages and UI transfer/invalidation. Build emits a separate optimizer worker asset (~49.35 kB at this checkpoint).

Browser used only synthetic fixtures/profile. Seven-relic exact run with 4-piece Musketeer and SPD 130–132 returned two feasible builds at SPD 131.032. Applying result 2 preserved A (Body compare_2) and changed B (compare_alt). A 240-relic fixture created 4,096,000,000 combinations: exact rejected its budget, one-million limited run emitted progress and was cancelled without application, then 1,000-sample run completed with ten retained results labeled non-exhaustive. Keyboard run completed. No overflow at 1440x1000 dark, 390x844 light or 320x800; optimizer navigation remained visible and error-console query was empty. Screenshots `.cache/optimizer-qa/desktop-dark.jpg`, `mobile-light.jpg`. Final retained-unavailable option labels were verified automatically after browser QA, not re-walked manually. Owned Vite session `47456` stopped, viewport reset. IAB still holds the 240 synthetic relics and saved manual QA comparison; it is not personal inventory. No real-account/quality/performance benchmark claim is made.

Next: resolve this branch's existing PR integration if needed, synchronize main, verify all commits then delete the source branch remotely/locally. Do not duplicate an existing PR. Next planned feature: O-07 `feat/speed-tuning`, four-member fixed-speed AV timeline, explicit base-SPD percentage buffs, initial-only advance, stable tie ordering and cycle-boundary tests. Use current comparison B as a precision-labeled source; do not treat manual/unknown/OCR values as exact in-game stats. Real export acceptance remains pending owner data. O-08 remains the final cross-workflow acceptance task.

## Historical checkpoints below

# Current O-05 checkpoint

2026-11-06. Branch `feat/build-comparison`, base `a540e61373cc03564dfcadc47cbc2b0fb0277bb7` (PR #10 merged and source branch deleted remotely/locally). Incremental commits: `275cf42` calculation/static set catalogue; `0c454ad` independent snapshot persistence; `9522c11` UI, candidate selection, navigation, backup and verification tests; followed by this documentation checkpoint. Owner requires branch-per-feature, incremental commits, PR merge commits and verified source-branch cleanup. No delegation requested.

O-05 implemented: shared explicit manual character/Light Cone profile, signed corrections, unrounded main/active-stat calculation, catalogue static set properties, visible exclusions and partial-slot warnings, stable reference A, editable B, 24-candidate pages, signed numeric ledger, equipped-character initialization, copy/reset reference controls, up to 20 named snapshot pairs, separate comparison backup/restore and persistence independent of inventory imports. Names never initialize numerical profiles. Baseline CRIT/ER and Trace/passive additions must be entered explicitly; zeros are contributions of zero. Acheron portrait is reused only for that declared manual profile. Saved snapshots use supported relic fields, not live scanner/index references. Inventory and comparison backups are separate. Unknown sets retain item stats with warnings; unsupported mechanics remain excluded. No optimizer or timeline exists yet.

Checks: final `npm.cmd run typecheck`, `npm.cmd test` (24 tests / 8 files) and `npm.cmd run build` passed. Tests cover numerical order and SPD base, static set thresholds/planar conditional exclusion, invalid input, snapshot survival across inventory replacement, storage failure, B edit without A mutation, reset/load and unsaved state across view switches. A TypeScript test-query option error was corrected before the final successful run.

Browser synthetic fixture: 7 relics, Acheron identity with deliberately manual test base stats (not an actual Acheron build). Exercised import/init, manual base fields, Body swap (CRIT delta +26.600), save, download, validated restore confirmation, reload/load, clear/reset, Enter candidate selection, inventory/comparison navigation, dark desktop 1440x1000 and light mobile 390x844. Both destinations visible on mobile; no document overflow and no observed error console entries. Screenshots `.cache/comparison-qa/desktop-dark.jpg`, `mobile-light.jpg`. Vite session `6584` stopped; viewport reset. Final Open/Exit demo routing adjustment and scanner-copy change were covered by the final automated run rather than separately repeated browser QA. Downloaded synthetic backup is `C:\Users\Chroma\Downloads\orbit-comparisons.json`. No personal export or real-profile validation is claimed.

Next: finish this branch's existing PR integration if needed; verify head and all task commits on synchronized main before remote/local deletion. Do not duplicate a PR. Then O-06 on `feat/relic-optimizer`: read calculation/search guarantees and worker contract, require complete legal six-slot candidates, use bounded memory/cancellation/stale-result protection and keep exact-vs-heuristic scope explicit. Build-comparison profile/snapshot inputs are the current math boundary; do not infer unsupported combat effects. O-07 remains after O-05 as planned. Real-account acceptance still awaits an export.

## Historical checkpoints below

# Current O-04b checkpoint

2026-11-06. Branch `feat/inventory-catalogue`, based on merged main `937dd6e03d7ba56976eb8db5366c6895c09de84c` (PR #9). PR #9 is merged and its source branch was deleted remotely/locally. Current task has incremental commits: `7983d86` pinned catalogue/icons + main-stat calculations; `38eb81b` reference metadata/validation; `9f23123` UI filters/details, large-data test and legacy timestamp compatibility; then this documentation checkpoint.

O-04b delivered: 192 local catalogue icons, English relic names, rarity/slot/level main-stat derivation, character-name lookup from export, validated Light Cone references, missing-owner warnings, persisted import timestamp, set/main/rarity/min-level/owner filters, unlocked/kept filters, unknown-artwork fallback, and active/main stat compatibility validation. Source pin and units are in ASSETS.md/CALCULATIONS.md. No character-build math is implemented. Only ID/name/location reference fields are retained; future profiles need scanner reimport or explicit manual data. Legacy schema-1 backups without a timestamp remain readable with null time, never a fabricated import date.

Checks: 17 tests in five files passed, typecheck and production build passed. A 10,000-item component test composes five filters, verifies count/page reset and at most 48 mounted cards. Browser verified actual local icons (48 loaded), catalogue main amount, rarity no-results/reset, desktop inspector, light mobile native dialog/Escape/focus return, no overflow at 1440x1000 dark and 390x844 light, and no observed error console entries. Timestamp-null follow-up is unit-tested/typechecked/built after browser QA; its legacy label was not separately walked through in the browser. Evidence: `.cache/catalogue-qa/desktop-dark.jpg`, `mobile-light.jpg`. Vite session `62981` stopped; viewport override reset. No personal-account export has been supplied; synthetic tests do not establish OCR accuracy or catalogue completeness for future game releases.

Next: finish this branch's existing PR integration if needed, synchronize main and verify all task commits before deleting the source branch. Do not duplicate an existing PR. O-04 is implemented with synthetic acceptance; real-account acceptance is pending owner data. Next planned feature is O-05 on `feat/build-comparison`: read CALCULATIONS.md and IMPORT_FORMAT.md, define explicit manual/known character profiles, and preserve unsupported mechanics disclosures. Continue incremental commits per owner instruction. Do not infer missing character/Light Cone stats from the minimal reference records.

## Historical checkpoints below

# Resume checkpoint

O-04a local scanner import, 2026-11-06. Current branch `feat/inventory-import`, base `b21b08c994f84606c287b7dd528c1b0637cf7617`. PR #8 (English UI) is merged and its branch deleted remotely/locally.

Owner now explicitly requires incremental commits, not one commit for an entire feature. This branch has parser/tests `461f1e5`, atomic storage `6de24c1`, and import UI/integration tests `dffa28e`, followed by a documentation checkpoint. No delegation requested.

Implemented: source/schema-4 validation, InitialScan and Orbit backup parsing, unrounded active/preview/reroll values, duplicate-ID rejection, confirmation/cancel, atomic IndexedDB save/restore, backup download, source precision, 48-card pages, search/slot/status filters, raw relic inspection, mobile native dialog. Demo remains separate. Limits: 20 MiB and 10,000 relics. Unknown set/owner IDs remain literal; no unrelated artwork is substituted. Character/Light Cone records and unrelated scanner metadata are not retained. Main-stat amounts, catalogue artwork, reference integrity and richer filters remain O-04b; O-04 overall is still in progress. Comparison/math/optimizer/timeline are not implemented.

Checks: typecheck, 12 tests (4 files), production build passed. Browser used 100 synthetic scanner items: confirmation, pagination, discard filter, mobile inspection/Escape/focus return, backup download, reload restoration, invalid JSON retention. No overflow at 390x844 light or 1440x1000 dark. Screenshots `.cache/import-qa/`; browser viewport reset. Vite session `27510` stopped. Downloaded synthetic backup is `C:\Users\Chroma\Downloads\orbit-inventory.json`; no personal export was used.

Next actions:
1. Check this branch's existing PR status; finish its integration rather than opening a duplicate. After verified merge, sync main, verify all task commits are ancestors and delete its remote/local source branch.
2. Continue O-04b on `feat/inventory-catalogue` when requested, before treating O-04 as complete or starting O-05. Read IMPORT_FORMAT.md, CALCULATIONS.md and source current game constants explicitly. Do not infer main-stat values from demo fixtures.
3. Real-account validation remains pending an export from the owner; synthetic coverage does not prove scanner OCR correctness. No current blocker prevents catalogue work.

# Prior checkpoint (historical)

English interface checkpoint, 2026-11-06 (Asia/Jakarta). PR #1 through #7 are merged and their source branches have been removed. O-03c implementation and checks are complete; verify its integration status before creating a branch or PR.

## Owner instructions

- Build Orbit as a local web application on the owner's Windows PC.
- Read the complete HSR relic inventory, including unequipped relics; support comparison, min-maxing, and speed tuning.
- Use a framework, not plain JS/HTML/CSS. React + TypeScript + Vite is the selected starting stack.
- Install antislop and Karpathy skills, use them to rebuild the project, add relevant skills, and create AGENTS.md, docs, and planning.
- Antislop mode for this session: DURING, explicitly selected by the owner.
- Ship both light and dark modes, explicitly requested by the owner.
- English is now the primary product language, including visible copy, accessible names, fallbacks/errors, scanner guidance, and document metadata. This supersedes earlier Indonesian UI instructions and Figma text. Conversation follows the user's language.
- The owner rejected earlier layouts, supplied the Orbit Figma reference, and authorized implementation with the review revisions. Keep HSR equipment inspiration, balanced density, real artwork, top navigation, side details, subtle transitions, and both themes. Figma palette/type now supersede earlier proposals; DESIGN.md and FIGMA_HANDOFF.md record the reference and revisions.
- Create a new branch per feature; commit per task; integrate through PRs. After successful merge and ancestry verification, delete the source branch remotely and locally. This supersedes the earlier branch-retention rule.
- Update AGENTS.md when working rules or project decisions change; routine progress belongs in this checkpoint.
- Maintain README.md when run instructions, requirements, supported workflows, architecture, storage, or implemented feature availability changes.
- Keep enough documentation to continue correctly after context/token exhaustion.

## Repository and files

- Checkout: `D:\Kuliah\Oprekan\Enka smth\orbit`.
- Remote: `origin = https://github.com/darelaj/orbit.git`.
- Initial clone was empty. Git author identity is already configured; do not replace it.
- Current task branch: `feat/english-ui`, based on synchronized main at `a55f5477ab1193c0d34311daeca487cc81d4cd6a`. Changes translate UI/accessibility/metadata, update existing interaction tests and language guidance, and keep the existing layout/assets. No Figma canvas edits are in scope.
- Main includes PR #1 through [PR #7](https://github.com/darelaj/orbit/pull/7). All nine earlier task branches were verified as ancestors of main and deleted remotely and locally. Do not try to restore them.
- O-03c checks passed: npm.cmd run typecheck, npm.cmd test (6 tests), npm.cmd run build, English desktop/mobile walkthrough, metadata check, source-copy scan, and scoped documentation/whitespace review. Evidence is in VERIFICATION.md. No new dependency or language switcher was added.
- O-03c verification server session `76529` was stopped after the walkthrough. Viewport overrides were reset to 703px. Screenshots are under .cache/english-ui/; the owner can run npm.cmd run dev from their terminal.
- Figma file: `pVMHEP3S3rp9vMRIlfoeUp`; desktop dark `2:2698`, desktop light `2:3063`, mobile `2:3428`, mobile detail `2:3743`. Figma session `c9720619-30e6-499c-9ca5-331d1310b3cd` was reused from the review. High-fidelity contexts and reference screenshots were read before editing; no Tailwind dependency was added.
- Owner authorized implementation with the review revisions: reduce context/card height, restore reset/exit controls, separate equipment selection from filters, simplify repeated notices, and make code components responsive rather than copying the malformed 1720px kit sizing.
- Final O-03b checks passed: npm.cmd run typecheck; npm.cmd test (6 component tests); npm.cmd run build. Browser checks exercised all card/equipment selections, composed filters, empty results, selected-hidden recovery, sort/reset states, native mobile close/Escape/focus return, source disclosure, and both theme reloads. Details/gate are in FIGMA_VERIFICATION.md.
- O-03b verification Vite session `75696` was stopped with Ctrl+C after browser checks; port 4173 was checked free. Do not reinstall dependencies while a dev/preview/watch process is active. Screenshots are ignored artifacts under .cache/figma-polish/; browser viewport overrides were reset.
- At 1440x1000, the first card starts around 526px; at 390x844 it starts around 589px and is 227px tall. The mobile page is about 2578px rather than the reference's 3933px. Eight tested widths had no document overflow or undersized visible controls. Final text-pair minima were about 4.54:1 light and 7.21:1 dark; these are scoped checks, not certification.
- Four upstream antislop skills have been installed under `.agents/skills` at commit `9504989f162a92b1996853eccbb3d8a86e73df68`.
- Karpathy and React skills are installed at pins in SKILLS.md. The local HSR integrity skill is present. All seven passed the official validator.
- `../relic-lab` contains the unfinished earlier plain JS prototype. Preserve it; do not ship it. It includes an untested engine and a game-data snapshot, but no app.js, no tests, and no completed UI.

## What is actually verified

- Repo metadata and empty clone verified.
- Node v24.16.0 and npm are installed.
- Git remote and local author identity verified.
- Python 3.12 was downloaded through uv into `.cache/python` to run the official skill installer. Cache is ignored by Git.
- All skill installations completed successfully. The official quick_validate.py reported `Skill is valid!` for each of seven folders using Python 3.12 and PyYAML through uv.
- The initial git whitespace check reported trailing whitespace in vendored React guidance. Upstream files were preserved intentionally; project-owned files are checked separately.
- React 19.3.1, TypeScript 7.0.2, Vite 8.3.6, and Vitest 5.1.0 are installed with exact versions and a lockfile.
- Historical O-03 baseline checks passed: typecheck, 1 theme persistence test, build, and a 703px browser smoke. That shell's visual direction was rejected and is superseded by O-03a below.
- O-01a documentation verification passed: all 11 referenced project documents, 7 skill entrypoints, and 6 documented npm scripts exist; `git diff --check -- AGENTS.md docs/SESSION_STATE.md docs/IMPLEMENTATION_PLAN.md` passed. No application tests/build were rerun because this task changes documentation only.
- Before the PR sequence, the combined framework was checked again: `npm.cmd run typecheck`, `npm.cmd test` (1 passing test), and `npm.cmd run build` all succeeded. PR #1's GitHub check/status lists were empty; no CI success was inferred from that absence.
- README task verification: relative documentation links, every documented npm script, runtime host/port/Node requirements, and the current source-tree entries were checked against local files. Scoped `git diff --check` passed. Application tests/build were not rerun for this documentation-only change.
- Windows recovery: the old Orbit Vite process was still listening on 127.0.0.1:4173 while npm ci failed to unlink the Rolldown native binding. The failed install also removed the local Vite launcher. Stopped the original exec session `90637` with Ctrl+C, then npm.cmd ci succeeded (88 packages added, audit reported 0 vulnerabilities). No package manifest or lockfile changes.
- Recovery checks passed: npm.cmd run build (includes TypeScript checking), npm.cmd test (1 test), and npm.cmd run dev. HTTP requests to /, /src/main.tsx, and /@react-refresh each returned 200. This is a startup/dependency check, not a new visual acceptance review.
- Recovery verification server exec session `34877` was stopped with Ctrl+C after the requests. Before a future npm ci, stop Orbit dev/preview/watch processes to release native file locks.
- O-03a implements local Acheron/relic artwork, eight synthetic fixtures, card selection, six equipped-slot shortcuts, name/set/main-stat search, slot/lock filters, resets, desktop side details, a narrow-screen native detail dialog, empty workspace, scanner guide, and persistent light/dark themes. Demo items and filters are transient; no real import, storage database, build math, optimizer, or timeline exists yet.
- Final O-03a checks passed: npm.cmd run typecheck; npm.cmd test (4 tests); npm.cmd run build. Browser evidence, control outcomes, contrast measurements, and antislop gate are in VERIFICATION.md. Owner visual review remains pending.
- Image sources/notices are in ASSETS.md, pinned to StarRailRes `dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487`. Original game files and upstream license are bundled locally; no external image/font runtime requests. Acheron artwork is about 4.6 MB; no performance score is claimed.
- O-03a verification Vite exec session `60406` was stopped after the walkthrough; port 4173 was checked free. The owner can run npm.cmd run dev (or npm run dev if their PowerShell policy permits). Browser viewport overrides were reset. Local ignored screenshots are under .cache/ui-redesign/; no private data appears in them.
- Earlier research successfully queried Enka HSR: HTTP 200 with 8 showcased characters and 6 equipped relics on the first character. This is not a full inventory method.

## Next actions

1. Historical instruction, superseded by the O-04a checkpoint above: Finish its existing integration; after a successful merge, synchronize main, verify ancestry, and delete the source branch remotely and locally.
2. Keep new UI and accessibility copy in English. VERIFICATION.md has the current language check; FIGMA_HANDOFF.md and FIGMA_VERIFICATION.md retain the layout and asset history. Preserve font/SVG notices and game attribution.
3. README distinguishes the working synthetic demo from planned personal-inventory/domain/worker/storage features. Preserve this distinction and update README in the affected implementation task.
4. Continue O-04 and later tasks when requested, using separate branches and focused PRs. The demo fixtures are not a parser/normalization contract; read IMPORT_FORMAT.md before replacing them with real imported records.

## Technical cautions discovered in the prototype

- The early beam-search prototype materializes every expansion and can allocate too much memory. Do not reuse it without a bounded queue or a different bounded search.
- Its partial Trace handling is incomplete, and its all-Traces calculation is not yet validated. Never present that as accurate character stats.
- Set properties include only some static bonuses. Conditional effects, enhanced characters, team buffs, and damage rotations require explicit scope.
- Export OCR loses hidden SPD decimals. UI and calculations must retain an accuracy label.
- Full inventory JSON has not been supplied by the owner. Use clearly labeled synthetic fixtures for tests/demo, and report real-account validation as pending until a real export is available.

## Commit and branch ledger

| Branch | Commit | Result | Integration |
| --- | --- | --- | --- |
| `chore/agent-guidance` | `a1647a8` | Agent routing, 7 validated skills, source pins, notices, ignore rules | In main; branch deleted remotely/locally after ancestry verification |
| `docs/project-plan` | `ba87730` | Product/design/architecture/import/math/testing/research docs and resume plan | Merged as `e7d6e1d`; branch deleted remotely/locally |
| `feat/react-workspace` | `e2ab362` | Framework shell and theme persistence | [PR #1](https://github.com/darelaj/orbit/pull/1) merged as `3af03bd`; technical baseline only, not accepted visual design |
| `docs/design-direction` | `e5c48b6`, `90ebecc` | HSR equipment design brief and checkpoint | [PR #2](https://github.com/darelaj/orbit/pull/2) merged as `5ccdb57`; brief only, followed by O-03a implementation |
| `docs/agent-operating-guide` | `41b648a`, `592a8af` | Expanded guide, current commands, PR and cleanup workflow | [PR #3](https://github.com/darelaj/orbit/pull/3) merged as `6964b82`; branch deleted remotely/locally |
| `docs/readme-architecture` | `fe9d523` | Setup/dev/build/preview instructions, current/planned architecture, README maintenance rule | [PR #4](https://github.com/darelaj/orbit/pull/4) merged as `acc06c4`; branch deleted remotely/locally |
| `docs/windows-dependency-recovery` | `00845c5` | Restore local dependencies and document Windows recovery | [PR #5](https://github.com/darelaj/orbit/pull/5) merged as `efb37e9`; branch deleted remotely/locally |
| `feat/hsr-visual-direction` | `9b6b331` | HSR equipment demo, two themes, browser evidence, asset provenance | [PR #6](https://github.com/darelaj/orbit/pull/6) merged as `e8d431c`; branch deleted remotely/locally |
| `feat/figma-equipment-polish` | `0792404` | Figma-based equipment UI with approved review revisions and local fonts/SVGs | [PR #7](https://github.com/darelaj/orbit/pull/7) merged as `a55f547`; branch deleted remotely/locally |
| `feat/english-ui` | Resolve this task's integration record | English primary UI, accessibility and metadata, updated language guidance | Verify its existing PR and branch refs on resume |

PR records and commits remain the integration history after source branch deletion. Confirm local/remote refs rather than trying to restore an intentionally removed task branch. Record pushes and merges only after verified success.

## Current blockers

No input blocks this UI task. The owner supplied Figma and authorized the review revisions; do not repeat answered design questions. No personal export is available for account-specific acceptance testing. Import and game calculations remain separate future tasks.
