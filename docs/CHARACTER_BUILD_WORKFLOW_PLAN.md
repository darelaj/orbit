# Character build workflow plan

Status: planning only. Requested 2026-11-07; application changes are not authorized yet. This is O-11, independent of the unimplemented O-10 hosted Companion proposal.

## Outcome and confirmed decisions

Orbit should answer three questions: How is my character built now? Which relic combination better meets my goals? How does that change the team's turn order?

- Select a character before reviewing or optimizing their build.
- Support maximum CV, other selected stats, and targets followed by a chosen optimization stat. Required sets remain configurable.
- Confirmed priority: reach the SPD target, then maximize CRIT DMG. Extra SPD must not outweigh more CRIT DMG once the target is met.
- Explain build quality through targets and improvements available from the user's own inventory.
- Simplify Comparison, Optimizer and Speed Tuning without hiding calculation limits or removing inventory protections.
- Keep React/TypeScript, English copy, both themes and the accepted HSR/Figma equipment identity. Change workflow and hierarchy, not the brand direction.

The remaining details are proposed implementation contracts. Character-specific recommended targets and universal build grades are not established by this plan.

## User journey and screen hierarchy

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

## Optimization contract

The worker already enumerates small spaces exactly and samples larger spaces in limited mode. Extend its options, constraints and scoring rather than replacing the engine.

- **Maximum stat:** choose a supported computed stat, including CRIT Rate, CRIT DMG, SPD, HP, ATK, DEF or Break Effect. Publish the actual supported list; do not imply damage simulation.
- **Maximum CV:** proposed **Build CV = 2 × computed CRIT Rate + computed CRIT DMG**, in percentage points and under the same static profile as displayed totals. Include modeled main stats and active substats; exclude previews and speculative upgrades. Any later relic-only CV needs a separate definition and label.
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

## Character data and calculation dependency

Current inventory normalization retains character and Light Cone identity references; calculations use a manual profile. Selecting a character alone cannot initialize accurate progression or passive stats.

Inspect pinned scanner/export contracts first. Define a versioned contract for available character level/ascension, form/path or enhancement identity, Eidolon, unlocked minor Traces, and equipped Light Cone identity/level/ascension/superimposition. Retain only fields actually supplied and validated. Resolve supported numeric progression from pinned catalogue data, not names or descriptions. Do not retain unrelated account data.

Both the native server projection and browser adapter need these fields. Old normalized inventories/backups cannot recover discarded values: show **Profile incomplete**, permit explicit manual completion, or request rescan/reimport. Preserve legacy files and failed-import rollback through versioned migrations.

Start with a small verified profile set and independent fixtures for base stats/SPD, progression, Light Cone base stats and mapped static bonuses. Conditional passives, conversions and unsupported effects remain excluded and visible until modeled. Unsupported characters remain selectable without invented zero totals presented as accurate.

Review, comparison and search must use one calculation path and profile/version. Include form and catalogue/profile version in identity. Handle unsaved edits, character switches, inventory replacements and profile changes explicitly; invalidate stale searches while preserving saved snapshots. Keep inventory, build and team backups separate and backward compatible.

## Current-build assessment

The first assessment is **target attainment and personal-inventory upgrade potential**, not an invented universal percentage or letter grade.

- Show equipment completeness, key totals, set activations and each chosen target's actual value and gap.
- Use plain statuses: **Targets met**, **Below target**, **Profile incomplete**. Show relevant crit warnings and calculation exclusions.
- Compare legal candidates under the same profile, goal and eligible pool. Explain improvements through stat deltas and changed pieces.
- Claim **Best in this inventory** only after exact search, qualified by active filters and modeled mechanics. Limited search says **Best found**; no completed search means no optimum claim.
- Do not turn unrelated objectives into an arbitrary quality percentage. CV must not universally grade Break, DoT or support characters.

Versioned role presets and character target suggestions can follow verified research and must allow overrides. User-entered targets are enough initially. Combat rotations and whole-team relic allocation remain deferred.

## Task sequence and acceptance

Each row gets its own feature branch from its merged dependency, after an implementation request. Use focused commits for contract/domain work, integration/persistence and UI/docs as applicable; validate meaningful milestones rather than creating one giant final commit.

| Task / proposed branch | Depends on | Deliverable and acceptance |
| --- | --- | --- |
| O-11a `docs/build-workflow-spec` | This plan | Finalize basic/advanced wireflows, English labels, CV and target contracts in DESIGN/CALCULATIONS. Review the SPD example, incomplete/no-result states and current/candidate journey before UI code. |
| O-11b `feat/character-profile-data` | O-11a | Validate available progression fields; extend server projection, import types and storage/backup migration. Legacy files still import, missing data stays explicit, invalid records never overwrite storage. |
| O-11c `feat/character-stat-profiles` | O-11b | Add pinned stat resolver and verified fixtures; connect selection to shared stats. Cover missing/unsupported forms, manual overrides, profile identity and actual calculation coverage. |
| O-11d `feat/target-stat-optimizer` | O-11a | Add CV/stat objectives, minimums, target saturation and legal sets to domain/worker. Match independent brute force; cover thresholds, infeasibility, ties and coverage claims. Measure before pruning; manual/synthetic profiles work until O-11c. |
| O-11e `feat/current-build-assessment` | O-11c, O-11d | Add equipment completeness, target gaps and same-profile candidate deltas. Distinguish exact optimum, best found and no search. Missing profile/equipment stays visible; no universal grade. |
| O-11f `feat/simple-build-workflow` | O-11e | Connect character-first review, simplified Comparison/Optimizer and explicit snapshot save. Preserve filters, cancellation, stale handling and saved builds. Verify basic/advanced flows in both themes, narrow layout and keyboard use. |
| O-11g `feat/simple-speed-tuning` | O-11c, O-11f | Simplify named team editing and explicit candidate-SPD transfer. Lead with turn order/cycles; preserve base-SPD buffs, initial advance, precision, fixed-speed scope and team backups. |
| O-11h `test/build-workflow-acceptance` | O-11f, O-11g | Verify character → review → goal → search → compare/save → speed, legacy/invalid imports, profile/inventory replacement and reload. Record observed evidence and owner acceptance; update README for implemented behavior. |

Likely affected locations: `src/domain/inventory.ts`, `server/scanner.mjs`, inventory persistence, `src/domain/comparison.ts`, `src/domain/optimizer.ts`, worker/runner and comparison/optimizer/speed workspaces/tests. Add a small shared character/profile context only where state ownership needs it. Inspect exact modules at task start; avoid unrelated restructuring.

## Verification and continuation

Use independent expected totals, active/preview fixtures, profile variants, old/new backups, precision boundaries and reference brute force. Cover SPD saturation, simultaneous minimums, CRIT overflow, set legality, eligibility, deterministic ties, cancellation and stale results.

UI acceptance must demonstrate choosing a character, understanding deficiencies, requesting “reach SPD, then maximize CRIT DMG”, comparing and checking team order without Advanced. Also verify incomplete/failed searches, borrowing and precision. Check both themes, focus/dialog behavior, reduced motion, stable readable numbers and overflow. Record observed outcomes; screenshots alone do not establish usability or accuracy.

Run affected checks per milestone and required full suite/build on each final application feature head; inspect Windows/Linux PR CI. Documentation-only work needs links/diff/whitespace checks, not runtime tests. Real scans stay owner-initiated; develop with synthetic fixtures and exclude personal exports from commits.

Keep this roadmap and a short SESSION_STATE handoff with task/branch, merged dependencies, commits/checks, limits and next action. Update domain docs when contracts change. Verify each PR's commits in synchronized main before deleting its source branch. Leave O-10 deployment and unrelated deferred work untouched.
