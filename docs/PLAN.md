# Roadmap

Read only the milestone relevant to the request. Implemented behavior belongs in README/TECHNICAL, design in DESIGN, current work in SESSION_STATE and historical evidence in Git. Planning does not authorize implementation or release.

## Implemented baseline

| Milestone | Actual status |
| --- | --- |
| O-01/O-02 | Repository guidance, pinned skills and project contracts established. |
| O-03 | React/TypeScript/Vite, English UI and both themes implemented. Earlier shells were superseded by the owner-supplied Figma equipment reference; usability improvements are planned in O-11. |
| O-04 | Schema-4 inventory import, catalogue, filters, precision and atomic IndexedDB backups implemented with synthetic acceptance. |
| O-05 | Same-profile six-slot A/B calculation, manual corrections and saved comparison snapshots implemented. Automatic character stat profiles are not implemented. |
| O-06 | Bounded worker search, single-stat/index objectives, set/SPD constraints and exact/limited coverage implemented. CV and target priorities are planned in O-11. |
| O-07 | Four-member fixed-speed AV model, initial advance and independent team backup implemented. |
| O-08 | Synthetic cross-workflow and scoped production-browser acceptance recorded. Real-account matching and owner acceptance remain limited; see VERIFICATION. |
| O-09 | Integrated same-origin Windows scanner merged through PR #15; launch fixes through PR #18. Owner retry reached Scan received. Inventory completeness/precision and native cleanup acceptance remain pending. |

PRs #16–#18 were merged before this documentation work; main baseline is `96a74e8`. Detailed prior task/branch ledgers and acceptance criteria are retained in Git (see [historical reports](VERIFICATION.md#historical-reports)). Do not recreate completed branches or treat historical tests as fresh checks.

## Scope and deferred work

The application serves HSR PC relic inventory, comparison, stat search and fixed-speed tuning. Full inventory requires a scanner export, not UID showcase lookup. Keep local processing, no credentials, explicit replacement and separate backups. ZZZ/Endfield, gacha/check-in, cloud sync, social features, auto-salvage, game modification/memory access, whole-team relic allocation and combat/DPS rotations remain outside this implementation.

Each coherent task gets a branch and focused milestone commits. Merge dependencies first; verify exact-head CI and commits in synchronized main before deleting that PR's source branch. No delegation has been requested. O-10 and O-11 below are both unstarted proposals, not one authorization to implement everything. Owner priority decision, 2026-11-07: finish O-11 and stabilize the agreed local feature set first. O-10 is the last priority, after the core features are reliable and the owner confirms they meet expectations. Milestone numbers are identifiers, not execution order. O-11a specification is complete; O-11b data retention is complete; the next implementation entry point, when requested, is O-11c.

## O-11 character build workflow

Status: O-11a specification completed 2026-11-07 in [DESIGN](../DESIGN.md#o-11a-character-workflow-specification) and [TECHNICAL](TECHNICAL.md#o-11a-objectives-and-target-contract). O-11b data retention/migration is implemented with synthetic validation; O-11c–h remain unstarted. This is O-11, independent of the unimplemented O-10 hosted Companion proposal.

### Outcome and confirmed decisions

Orbit should answer three questions: How is my character built now? Which relic combination better meets my goals? How does that change the team's turn order?

- Select a character before reviewing or optimizing their build.
- Support maximum CV, other selected stats, and targets followed by a chosen optimization stat. Required sets remain configurable.
- Confirmed priority: reach the SPD target, then maximize CRIT DMG. Extra SPD must not outweigh more CRIT DMG once the target is met.
- Explain build quality through targets and improvements available from the user's own inventory.
- Simplify Comparison, Optimizer and Speed Tuning without hiding calculation limits or removing inventory protections.
- Keep React/TypeScript, English copy, both themes and the accepted HSR/Figma equipment identity. Change workflow and hierarchy, not the brand direction.

The O-11a specification finalizes the workflow and objective contract below for implementation; later tasks must not claim the UI or calculations already exist. Character-specific recommended targets and universal build grades are not established by this plan.

### User journey and screen hierarchy

1. **Choose character.** Keep character and profile visible across review, comparison and optimization. Identify missing profile data before presenting totals as accurate.
2. **Review current build.** Show equipped relics, key stats, active sets and target status. Identify missing slots. Offer one primary action: **Find upgrades**.
3. **Set a goal.** Offer **Maximize CV**, **Maximize a stat**, or **Reach targets, then maximize**. The last reads like “Reach SPD [134], then maximize [CRIT DMG]”; an optional minimum CRIT DMG can also be entered. These are user targets, not recommended breakpoints.
4. **Find builds.** Show progress, cancellation and understandable exact/limited coverage. Lead results with target attainment, objective value, deltas from current equipment and changed slots.
5. **Compare and save.** Use **Current build** and **Candidate** instead of unexplained A/B. Show relevant deltas first and full stats on demand. Saving creates an Orbit snapshot; it does not equip items in the game.
6. **Check turn order.** Explicitly send a chosen build's SPD to a named team member. Show turn order and cycles first, with buffs and the action-value ledger under Advanced.

Reuse top navigation, the wide equipment workspace and side details. Keep a compact character/goal summary; do not add another dashboard or configuration wizard. Artwork supports character and equipment context while numeric columns stay stable.

| Area | Visible first | Under Advanced or Details |
| --- | --- | --- |
| Current build | Character, six slots, relevant stats, targets, Find upgrades | Full stat breakdown, calculation coverage, manual corrections |
| Comparison | Current/Candidate, important deltas, changed pieces, Save build | Full stats, saved-build management, backup/restore |
| Optimizer | Goal, targets, Cavern/Planar set requirements, inventory scope, Find builds | Main-stat filters, exclusions, lock/discard overrides, search settings |
| Speed Tuning | Up to four named characters, SPD, cycles, turn order | Buffs, initial advance, precision/source details, numeric ledger |

Default candidate scope should include unequipped relics and the selected character's relics. Borrowing from other characters requires an explicit choice and identifies affected owners. Respect lock/discard choices and exclusions; never broaden eligibility silently after a failed search.

Keep exact/limited status, missing data and materially excluded mechanics near the result. Advanced disclosure must not hide correctness information. Cover empty, invalid, incomplete, searching, cancelled, stale and no-result states. UI planning/implementation uses the existing antislop DURING mode and DESIGN.md direction.

### Optimization contract

The worker already enumerates small spaces exactly and samples larger spaces in limited mode. Extend its options, constraints and scoring rather than replacing the engine.

- **Maximum stat:** choose a supported computed stat, including CRIT Rate, CRIT DMG, SPD, HP, ATK, DEF or Break Effect. Publish the actual supported list; do not imply damage simulation.
- **Maximum CV:** **Build CV = 2 × computed CRIT Rate + computed CRIT DMG**, in percentage points and under the same static profile as displayed totals. Include modeled main stats and active substats; exclude previews and speculative upgrades. Any later relic-only CV needs a separate definition and label.
- **Targets then maximize:** apply all hard minimums first, then rank feasible builds by the chosen objective. SPD receives no further reward after its target when CRIT DMG is the objective. Preserve optional maximum SPD for turn-order constraints.
- Support multiple minimum constraints in the domain, exposing only the user's chosen goals in basic controls. Avoid free-form formulas, arbitrary weights and long priority forms.
- Compare full-precision values and round only for display. Resolve equal scores deterministically using stable relic identities.

Illustrative results for minimum SPD 134 and maximum CRIT DMG:

| SPD | CRIT DMG | Result |
| --- | --- | --- |
| 133.9 | 230% | Fails SPD minimum, even if display rounding looks like 134 |
| 134 | 210% | Preferred feasible build |
| 145 | 190% | Feasible; surplus SPD does not compensate for lower CRIT DMG |

CV measures crit stats, not DPS or suitability for every role. Display raw CV consistently; flag CRIT Rate above 100% instead of silently changing the formula. Keep the existing ATK/CRIT index separately named and its limits explicit.

Every result needs exactly one eligible relic per slot and must satisfy set composition, main-stat filters, ownership and hard constraints. Support valid four-piece/two-piece Cavern and two-piece Planar requirements; reject contradictions before searching. No feasible result means an explicit explanation of unmet targets and coverage. Never relax constraints silently or label near misses valid.

Exact means exhaustive coverage of the eligible pool under modeled mechanics. Filter first and measure representative synthetic inventories before changing work limits. Add only provably safe pruning, verified against independent brute force. Larger spaces can offer explicitly limited search with **Best found** results; never claim global optimality or sample under an exact label. Retain bounded memory, progress, cancellation and stale-result protection. Report search coverage separately from profile calculation coverage.

### Character data and calculation dependency

O-11b now retains available character/Light Cone identity and progression with validated schema-2 backups and schema-1 compatibility. Missing values remain absent; roster completeness remains unknown. Calculations still use a manual profile: selecting a character does not initialize numerical stats until O-11c.

The owned-character workflow belongs to O-11b/O-11c, not the separate leaderboard project. Read the roster supplied by the scanner, including characters without equipped relics; do not infer ownership from relic locations alone. One supported scan/import should supply relics, characters and Light Cones together. Show roster completeness as unknown when the source omits or filters characters; never claim every owned character was captured from references alone.

Pinned Reliquary v0.19.0 defines character path, level, ascension, Eidolon, skills, Trace flags, optional memosprite and ability version, plus Light Cone level/ascension/superimposition. See its [export model](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/models.rs) and [conversion code](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/converters.rs). Some base-character conversion values are placeholders until path data is resolved; verify the completed export and Trace mapping before using them as real progression. The schema alone does not establish capture completeness or game compatibility.

Intended flow: scan/import roster and inventory → select an owned character → resolve its supported static profile and equipped Light Cone from pinned constants → choose objective/targets/sets → search eligible six-slot combinations → compare with equipped relics. The character's actual progression is the default; hypothetical levels or Light Cones require an explicit override. This requires no Enka UID or leaderboard account. Exactness remains limited to the eligible pool and modeled objective, not universal combat performance.

Inspect pinned scanner/export contracts first. Define a versioned contract for available character level/ascension, form/path or enhancement identity, Eidolon, unlocked minor Traces, and equipped Light Cone identity/level/ascension/superimposition. Retain only fields actually supplied and validated. Resolve supported numeric progression from pinned catalogue data, not names or descriptions. Do not retain unrelated account data.

Both the native server projection and browser adapter need these fields. Old normalized inventories/backups cannot recover discarded values: show **Profile incomplete**, permit explicit manual completion, or request rescan/reimport. Preserve legacy files and failed-import rollback through versioned migrations.

Start with a small verified profile set and independent fixtures for base stats/SPD, progression, Light Cone base stats and mapped static bonuses. Conditional passives, conversions and unsupported effects remain excluded and visible until modeled. Unsupported characters remain selectable without invented zero totals presented as accurate.

Review, comparison and search must use one calculation path and profile/version. Include form and catalogue/profile version in identity. Handle unsaved edits, character switches, inventory replacements and profile changes explicitly; invalidate stale searches while preserving saved snapshots. Keep inventory, build and team backups separate and backward compatible.

### Current-build assessment

The first assessment is **target attainment and personal-inventory upgrade potential**, not an invented universal percentage or letter grade.

- Show equipment completeness, key totals, set activations and each chosen target's actual value and gap.
- Use plain statuses: **Targets met**, **Below target**, **Profile incomplete**. Show relevant crit warnings and calculation exclusions.
- Compare legal candidates under the same profile, goal and eligible pool. Explain improvements through stat deltas and changed pieces.
- Claim **Best in this inventory** only after exact search, qualified by active filters and modeled mechanics. Limited search says **Best found**; no completed search means no optimum claim.
- Do not turn unrelated objectives into an arbitrary quality percentage. CV must not universally grade Break, DoT or support characters.

Versioned role presets and character target suggestions can follow verified research and must allow overrides. User-entered targets are enough initially. Combat rotations and whole-team relic allocation remain deferred.

### Task sequence and acceptance

Each row gets its own feature branch from its merged dependency, after an implementation request. Use focused commits for contract/domain work, integration/persistence and UI/docs as applicable; validate meaningful milestones rather than creating one giant final commit.

| Task / proposed branch | Depends on | Deliverable and acceptance |
| --- | --- | --- |
| O-11a `docs/build-workflow-spec` | This plan | Specification complete: DESIGN defines wireflows, basic/advanced controls, English labels and recovery; TECHNICAL defines CV/targets, legality and independent numerical acceptance cases. Document review only; runtime/owner UI acceptance remains pending O-11f–h. |
| O-11b `feat/character-profile-data` | O-11a | Implemented with synthetic tests: retain the supplied owned roster, including characters with no equipped relics, plus validated progression and Light Cone data. Extend server projection, import types and storage/backup migration. Test roster omission/filtering, placeholder/path resolution and legacy files; missing data stays explicit, invalid records never overwrite storage. |
| O-11c `feat/character-stat-profiles` | O-11b | Add pinned stat resolver and verified fixtures; select an owned character to initialize shared stats using actual progression and its equipped Light Cone. Cover missing/unsupported forms, Trace mappings, explicit hypothetical/manual overrides, profile identity and calculation coverage; no leaderboard dependency. |
| O-11d `feat/target-stat-optimizer` | O-11a | Add CV/stat objectives, minimums, target saturation and legal sets to domain/worker. Match independent brute force; cover thresholds, infeasibility, ties and coverage claims. Measure before pruning; manual/synthetic profiles work until O-11c. |
| O-11e `feat/current-build-assessment` | O-11c, O-11d | Add equipment completeness, target gaps and same-profile candidate deltas. Distinguish exact optimum, best found and no search. Missing profile/equipment stays visible; no universal grade. |
| O-11f `feat/simple-build-workflow` | O-11e | Connect character-first review, simplified Comparison/Optimizer and explicit snapshot save. Preserve filters, cancellation, stale handling and saved builds. Verify basic/advanced flows in both themes, narrow layout and keyboard use. |
| O-11g `feat/simple-speed-tuning` | O-11c, O-11f | Simplify named team editing and explicit candidate-SPD transfer. Lead with turn order/cycles; preserve base-SPD buffs, initial advance, precision, fixed-speed scope and team backups. |
| O-11h `test/build-workflow-acceptance` | O-11f, O-11g | Verify character → review → goal → search → compare/save → speed, legacy/invalid imports, profile/inventory replacement and reload. Record observed evidence and owner acceptance; update README for implemented behavior. |

Likely affected locations: `src/domain/inventory.ts`, `server/scanner.mjs`, inventory persistence, `src/domain/comparison.ts`, `src/domain/optimizer.ts`, worker/runner and comparison/optimizer/speed workspaces/tests. Add a small shared character/profile context only where state ownership needs it. Inspect exact modules at task start; avoid unrelated restructuring.

### Verification and continuation

Use independent expected totals, active/preview fixtures, profile variants, old/new backups, precision boundaries and reference brute force. Cover SPD saturation, simultaneous minimums, CRIT overflow, set legality, eligibility, deterministic ties, cancellation and stale results.

UI acceptance must demonstrate choosing a character, understanding deficiencies, requesting “reach SPD, then maximize CRIT DMG”, comparing and checking team order without Advanced. Also verify incomplete/failed searches, borrowing and precision. Check both themes, focus/dialog behavior, reduced motion, stable readable numbers and overflow. Record observed outcomes; screenshots alone do not establish usability or accuracy.

Run affected checks per milestone and required full suite/build on each final application feature head; inspect Windows/Linux PR CI. Documentation-only work needs links/diff/whitespace checks, not runtime tests. Real scans stay owner-initiated; develop with synthetic fixtures and exclude personal exports from commits.

Keep this roadmap and a short SESSION_STATE handoff with task/branch, merged dependencies, commits/checks, limits and next action. Update domain docs when contracts change. Verify each PR's commits in synchronized main before deleting its source branch. Leave O-10 deployment and unrelated deferred work untouched.

## Separate leaderboard project (deferred)

Owner decision, 2026-11-07: an Akasha/Seeleland-style HSR leaderboard is a separate project from the current Orbit app and O-11. This section records the boundary only; no new repository, service, database or implementation is authorized. O-11 assesses personal builds against targets and the user's inventory, not a community percentile.

- Keep leaderboard UI, backend, participant database, ranking categories and release lifecycle separate. Orbit inventory and optimizer remain usable offline without participation or an account.
- Accept user-submitted public showcase UIDs through reviewed Enka/MiHoMo access. Respect provider rules, cache/TTL and rate limits; no UID enumeration or mass database filling. Verify access/permission before using Seeleland data or rankings; no API availability is assumed.
- Define each category's character/form, progression/Light Cone assumptions, team/scenario, SPD constraints, scoring version and data timestamp. Separate stat rankings from modeled performance. Reuse a reviewed calculation package only if useful; do not duplicate an unverified scoring engine or force shared infrastructure.
- A public ranking requires a shared participant dataset. Display the category's sample size, ties and freshness; a percentile applies to that dataset, not all HSR players. Specify per-UID/build deduplication, refresh/replacement and deletion before collecting submissions. Treat local scanner JSON as untrusted input if ever accepted for public competition.

| Separate milestone | Deliverable, after a specific implementation request |
| --- | --- |
| LB-01 | Decide project/repository boundary, data-provider access and submission rules; choose one character/category for an initial benchmark. |
| LB-02 | Implement independently verified, versioned scoring and category fixtures; disclose excluded mechanics before any ranking claims. |
| LB-03 | Build the participant store, validated submission/refresh pipeline, caching and reproducible rank/percentile computation. |
| LB-04 | Build a separate leaderboard UI and test ranking, ties, stale data, dataset size and owner acceptance before release. |

This track does not block or expand O-11. Stabilize and obtain owner acceptance of Orbit's agreed core features first; schedule this separate project explicitly afterward. O-10 remains Orbit's last priority under its readiness gate below. Neither a leaderboard backend nor its release is implicitly authorized by O-10.

## O-10 hosted website and Windows Companion

Status: planning only, requested 2026-11-06. This document does not authorize implementation, installation, capture, publishing, infrastructure purchases or changes to the current scanner boundary. No Companion installer or hosted-to-local connection exists yet. Last priority: do not start O-10 feasibility, packaging or deployment until the readiness gate below is met and the owner asks to proceed.

### Core-feature readiness gate

O-10 is deliberately scheduled after all agreed core features, including O-11a–h. Before starting O-10a:

- Complete the agreed inventory, character/profile, comparison, stat/CV optimization and speed-tuning workflows; verify supported calculations and precision honestly.
- Resolve blocking data-loss, import/backup, scanner lifecycle, calculation and usability issues. Record remaining limitations and acceptance evidence instead of assuming they passed.
- Complete the applicable automated checks and owner-driven real inventory/stat/scan acceptance. The owner must confirm the core behavior and UI match expectations; passing CI alone is insufficient.
- Review any remaining core-feature requests with the owner before declaring the local product ready. Then obtain the owner's request to begin hosted/Companion work.

This gate adds no requirement to implement every deferred idea. It applies to the agreed core feature set; O-10's own transport feasibility, browser permissions, packaging and release checks still follow afterward.

### Intended result

A player opens an HTTPS Orbit website and uses inventory, comparison, optimization and speed tuning in the browser. For automatic full-inventory scanning, the player installs Orbit Companion once on the Windows PC running HSR. Orbit manages its reader internally; the player does not separately operate Reliquary or locate its JSON export. Players without Companion can still import JSON manually.

Proposed MVP: Windows x64, one local capture at a time, no account login or inventory cloud sync. Keep the existing React/TypeScript/Vite app and browser calculation/storage modules. The Windows component remains an ordinary-user process; only an explicitly requested one-shot scan asks for elevation. Installation, browser pairing, browser network permission and scan elevation are separate events and must be explained separately.

### Current baseline and proposed boundary

| Area | Exists now | Planned change |
| --- | --- | --- |
| Web UI | Local React app; manual import and analysis | Host the built frontend over HTTPS |
| Scanner runtime | Node serves app/API together on 127.0.0.1:4173 | Package a user-runnable Companion; keep the existing local mode working |
| Access | Same-origin API; foreign origins rejected | Add a separate, explicitly paired hosted-origin protocol after feasibility checks |
| Distribution | Development checkout, Node/npm and pinned engine setup | Installable Windows package; end users should not need Node, Git or npm |
| Inventory | Browser validation, preview and IndexedDB | Keep the same ownership and explicit replacement workflow |
| Verification | Synthetic scanner tests, idle production readiness | Add real browser-to-Companion and owner-driven game acceptance |

Proposed data path: hosted page in the player's browser -> authenticated local Companion -> elevated one-shot reader -> projected inventory back to that browser -> validation/preview -> IndexedDB after confirmation. The hosting server delivers application files and version metadata; it does not receive personal scan results. Verify that separation through observed requests, not architecture claims alone.

Do not ship the existing Node HTTP server as a public scanner backend or expose it on 0.0.0.0. A scanner running on the hosting machine cannot inspect the player's PC game traffic.

### Feasibility must precede packaging

The first technical milestone is a synthetic HTTPS-page-to-loopback proof, using no HSR data or elevation. Direct browser requests to a loopback endpoint are the initial candidate, not an approved transport. Record the actual browser versions, OS, request scheme, permission prompts and failure behavior. Test mixed-content handling, Local Network Access rules, preflight and ordinary CORS together.

Chrome documents Local Network Access permission for connections to local software, restricted to secure contexts. Treat that as a requirement to test the real browser flow, not proof that Orbit's proposed transport already works. [Chrome source](https://developer.chrome.com/blog/local-network-access)

Chrome and Edge on supported Windows versions are the proposed initial test targets. No browser/version support claim is accepted until tested. Firefox and other browsers remain unpromised. Do not ask users to disable browser protections, install a root certificate or enable experimental flags as the normal product flow.

Gate: choose the transport and packaging ADR only after the proof works with normal browser settings and explicit permissions. If it fails, document the blocker and evaluate an extension/native-messaging bridge or a local Orbit UI fallback. These alternatives require a separate decision; do not silently replace the requested browser workflow or implement several transports at once.

### Connection and privilege contract

The hosted-origin protocol needs a deliberate design; changing Access-Control-Allow-Origin alone is insufficient. Preserve the existing same-origin local API while adding this boundary separately. [CORS reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

- Bind Companion to loopback only. Choose a documented endpoint during the feasibility milestone; handle occupied ports without network-wide discovery or broad port scanning.
- Allow only the exact approved production HTTPS origin. Keep staging/development origins explicit and separate; reject wildcard origins, opaque/null origins, unapproved Host headers and DNS-rebinding attempts.
- An allowlisted Origin does not establish pairing. Require a visible, user-initiated approval through a trusted local Companion surface before issuing access to that website.
- Use a one-use, short-lived pairing challenge and expiring scoped sessions. Keep secrets out of URLs, browser history and logs. Specify expiry, restart, reconnect and revocation semantics in the protocol ADR before implementation.
- Permit minimal capability/health information before pairing; disclose no inventory, account metadata or job output. Require pairing/session authorization for scan commands and result reads.
- Expose fixed operations only: connect/capabilities, start, status, discard and read result. Do not accept shell text, executable paths, arbitrary file reads or download URLs from the website.
- Retain the pinned engine and integrity checks, one-shot elevation, initialization/completeness checks, run identity, temporary-file cleanup, crash handling and result expiry. Pairing must never elevate the whole Companion or start capture automatically.
- Keep capture cancellation distinct from native exit. Reconnect and multiple tabs must not launch overlapping captures or attach an old result to a new job.

Use synthetic negative tests for foreign sites, unpaired access, expired/replayed challenges, stale jobs, malformed messages, revoked sessions and unavailable Companion. Prove that an unapproved origin cannot trigger native work or read results even if it knows the local endpoint.

### Proposed player flow

1. Open Orbit online. Manual import and analysis work without Companion.
2. Choose Connect Companion. The page reports installation/connection requirements based on actual state.
3. Download the official installer if needed, install and launch Companion as a normal user. Any background startup must be optional; provide a visible exit control.
4. Approve the browser's local-network request if required by the tested transport, then approve pairing in the local Companion surface. Never trigger a scan during setup.
5. Prepare HSR on Click to Start. Choose Scan inventory, approve scan elevation, then enter the game when listening is confirmed.
6. Review the validated count and precision, then confirm Replace inventory. Failed/denied/partial scans preserve the previous workspace.

English remains the product language. Reuse the accepted equipment/Figma identity and both themes. Define missing Companion, permission denied, pairing pending/expired/revoked, version mismatch, scanning, discarding, failed, ready and result-expired states before coding. Explain recovery beside the affected action. This plan adds no new navigation structure, artwork or visual design.

### Packaging and release decisions

After transport validation, compare packaging the existing Node runtime with a small Windows shell against a native host. Record a single choice based on runtime bundling, installer size measured from a prototype, tray/local approval UI, elevation/process cleanup, update handling and maintenance. Do not add a desktop framework just to write this plan.

The installer must include or provision the pinned reader with a verified digest and upstream notices. Define code signing, official download origin, release checksums, installer format and supported Windows versions before distributing. Check what requires signing credentials or cost; no purchase is approved by this plan. Provide install, upgrade, repair, exit and uninstall behavior. Uninstall must explain that browser inventory is separate and should not clear it.

Propose manual updates for the MVP. Define web/Companion API versions and capabilities so an incompatible version yields an actionable update message while manual import remains usable. Never silently download or execute an unreviewed latest scanner. Background auto-update, autostart and additional games are separate future scope.

### Hosting and existing data

Select the provider and final domain later. The website needs HTTPS, correct asset/Worker MIME types, a compatible Content Security Policy, working hash navigation, stable asset paths and deliberate caching. Publish no Node capture endpoint, secrets, cache files or personal fixtures. Review existing asset notices for public distribution before release. No hosting deployment or DNS change happens in this planning task.

IndexedDB belongs to an origin. A new hosted domain cannot automatically read the current localhost workspace; browser profiles and devices are also separate. [IndexedDB reference](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Plan an explicit migration: export inventory, comparison and speed-team backups from the current app, then restore each through the corresponding validated hosted UI. Reuse existing backup formats. Test all three independently, including corrupt/unsupported files and failed writes. Keep the old local app and backups available until recovery is verified. Restore may involve different catalogue/API versions; show incompatibility instead of silently changing mechanics. Changing hosting domains later needs the same consideration. There is no automatic cross-device sync in this MVP.

### Tasks, dependencies and branch boundaries

All implementation tasks below are planned and unstarted. Use focused commits inside each feature branch, then a PR with validation; preserve commits and delete the source branch only after verified merge. Do not turn this table into one large implementation commit.

| Task | Proposed branch | Dependency | Deliverable / acceptance gate |
| --- | --- | --- | --- |
| O-10a | feat/companion-transport-spike | Owner requests implementation | Synthetic HTTPS-to-local proof; dated Chrome/Edge matrix, normal permissions, failure evidence and transport ADR. Stop packaging if unsuccessful |
| O-10b | feat/companion-pairing | O-10a | Protocol/schema/version contract, local approval, session lifecycle, origin/Host guards and negative authorization tests; no native work from unpaired clients |
| O-10c | feat/companion-windows-package | O-10a, O-10b | Packaging ADR and self-contained Windows installer prototype; normal-user runtime, explicit one-shot elevation, engine verification, notices, exit/repair/uninstall and clean-PC tests |
| O-10d | feat/hosted-scanner-connection | O-10b, O-10c | Web connection/pairing/status/recovery UI; both themes, keyboard/narrow checks, job ownership, preview/atomic replacement and unchanged manual import |
| O-10e | feat/hosted-workspace-migration | O-10d | Three-backup restore instructions and verified migration/rollback at a distinct origin; no automatic localhost reads or upload |
| O-10f | chore/hosted-release-pipeline | O-10c, O-10d, owner chooses domain/provider | Reproducible frontend/installer artifacts, signing/checksum policy, compatibility metadata, staging smoke tests and explicit release rollback procedure |
| O-10g | test/hosted-companion-acceptance | O-10e, O-10f | Clean Windows install plus real HTTPS/browser/Companion test; owner-driven actual HSR scan/count/precision/cleanup acceptance; privacy, version mismatch and multi-tab/restart tests |
| O-10h | chore/hosted-orbit-release | O-10g and owner release authorization | Publish chosen artifacts/site; verify download integrity, pairing and analysis paths, support docs and rollback. No release while required acceptance is pending |

Suggested commits per implementation branch: contract or decision first, runtime/domain behavior and meaningful tests next, UI/packaging integration after those checks, then verification and handoff. Share only synthetic fixtures. Keep SESSION_STATE.md current with the exact branch, checks actually run, services, blockers and next dependency after every milestone.

### Resume and completion criteria

Only after the core-feature readiness gate and an owner request: begin O-10a. This is not the next overall project task. Re-read AGENTS.md, SESSION_STATE.md, TECHNICAL.md#scanner and this document; recheck browser policies and inspect the actual runtime/client before changing it. Confirm the existing O-09 real-game acceptance limits remain recorded. Final domain/provider, transport, packaging framework, signing and update channel are open decisions, not assumed approvals.

Completion requires a normal player to install once without developer tools, explicitly pair the hosted website, scan the PC game through a bounded privileged reader and confirm a validated inventory import. The website's existing analysis must work without Companion. Every required release check needs recorded evidence, including owner-driven game validation; neither passing mocks nor a valid engine checksum establishes real inventory completeness.

Planning review PASS: implementation and unverified assumptions are labeled; volatile browser behavior has primary source links and a blocking feasibility gate; task dependencies, branch/commit rules, storage migration and real-account verification are explicit. No UI, runtime, installer, dependency or deployment was changed by this document.
