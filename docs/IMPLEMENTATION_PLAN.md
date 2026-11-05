# Implementation plan

Each task has a branch and at least one focused commit. Integrate through a PR, verify the successful merge, then delete the source branch remotely and locally. For stacked branches, merge dependencies first. Update status only after its acceptance criteria and checks have actually passed. Implementation runs sequentially; no agent delegation has been requested.

| ID | Branch | Status | Depends on | Deliverable and verification |
| --- | --- | --- | --- | --- |
| O-01 | `chore/agent-guidance` | Complete | none | AGENTS.md, pinned upstream skills, HSR integrity skill, provenance and skill validation |
| O-01a | `docs/agent-operating-guide` | Complete documentation revision | O-01, current framework/design state | Expanded AGENTS.md with current runtime commands, resume protocol, branch/commit rules, domain invariants, design routing, and change-specific verification; no runtime changes |
| O-02 | `docs/project-plan` | Complete | O-01 | Product scope, design for both themes, architecture, import contract, formula scope, testing plan, resume checkpoint |
| O-03 | `feat/react-workspace` | Complete technical baseline | O-02 | React/TypeScript/Vite and working two-theme shell; visual direction rejected, see O-03a |
| O-03a | `docs/design-direction`, then `feat/hsr-visual-direction` | Brief rewritten; UI pending | O-03 | HSR character/relic inspiration, balanced density, prominent splash art, top navigation, side details, subtle motion, both themes |
| O-04 | `feat/inventory-import` | Not started | O-03 | Atomic validated scanner JSON import, all relics, local persistence, backup, inventory filters, explicit empty/error/loading/demo states |
| O-05 | `feat/build-comparison` | Not started | O-04 | Same-character A/B six-slot loadouts, documented stat calculation, manual corrections, set information, saved local builds, measured deltas |
| O-06 | `feat/relic-optimizer` | Not started | O-05 | Worker search, objective/constraints, cancellation, exact-vs-heuristic disclosure, result comparison, bounded resource use |
| O-07 | `feat/speed-tuning` | Not started | O-05 | Four-member AV timeline, fixed buffs and initial advance, cycle thresholds, import SPD from compared build, boundary tests |
| O-08 | `test/workspace-acceptance` | Not started | O-06, O-07 | Both themes and narrow viewport, keyboard flows, invalid-import rollback, persistence, worker lifecycle, no console errors, antislop delivery evidence |

## O-01 acceptance

- Skills are committed inside `.agents/skills` and upstream sources are pinned.
- Karpathy skill is credited as community guidance inspired by Karpathy, not an official skill authored by him.
- Relevant upstream licenses/notices are preserved. Local domain skill contains specific HSR invariants without expanding product scope.
- AGENTS.md routes agents to current docs, relevant skills, task branches, and meaningful checks.

## O-02 acceptance

- A fresh session can identify the branch, what works, what has not run, the next task, and known correctness risks without chat history.
- Documentation separates full inventory export from Enka showcase and does not promise unsupported real-time scanning or full damage simulation.
- Design covers both requested themes and real data views. No invented logos, character illustrations, testimonials, or usage claims.

## O-03 acceptance

- Uses React components and strict TypeScript, built by Vite.
- `npm run typecheck`, `npm test`, and `npm run build` succeed.
- Application binds local preview to loopback. Personal exports are not served or transmitted.
- Both themes share tokens and produce readable controls; choice persists.

## O-04 acceptance

- Reliquary Archiver and Kel-Z schema-derived fixtures import every relic, including unequipped, locked, and discarded items.
- Invalid/unsupported data does not replace prior inventory. Issues identify the offending record.
- Duplicate scanner IDs and identical relics are handled deliberately; no loss through accidental deduplication.
- Preview/reroll substats do not silently become active substats. SPD precision source is visible.
- Filters and pagination work with thousands of relics; persistence and backup round-trip are verified.

## O-05 acceptance

- Base stats, percent and flat additions, static set effects, and manual corrections have independent numerical tests.
- Partial/unknown Trace and unsupported mechanics are disclosed rather than guessed.
- Changing a slot updates B and numeric deltas. A remains a stable reference. Saved builds use stable local identities or snapshots.
- Static index values are labeled as indices, not DPS.

## O-06 acceptance

- Exact mode matches brute-force results on a small reference fixture.
- Heuristic mode is labeled; candidate filtering and search limits are disclosed.
- Constraints are honored in returned results, including min/max SPD and required sets.
- Search can be cancelled; stale worker results cannot overwrite a newer run or inventory.
- Memory use is bounded by a defined queue/candidate strategy, not all intermediate combinations.

## O-07 acceptance

- AV = 10000 / SPD; first cycle = 150 AV, later cycles = 100 AV.
- Speed-percent buffs use character base SPD, not final panel SPD.
- Initial action advance affects initial remaining action distance only. Repeated advance and changing combat buffs are outside this first model.
- Stable tie ordering and cycle-boundary behavior are tested. Uncertain OCR input stays labeled.

## O-08 acceptance

Record a control-by-control browser walkthrough in `docs/VERIFICATION.md`. Include actual viewport sizes, themes, interaction outcomes, and console findings. Do not mark manual checks passed from code inspection alone.

## Deferred scope

Direct packet capture, scanner binaries, cloud sync, account login, Enka integration, gacha, auto-salvage, whole-team relic allocation, and character-specific combat/DPS rotations are deferred. Add them only after an explicit scope change. Scanner output is the first full-inventory boundary.
