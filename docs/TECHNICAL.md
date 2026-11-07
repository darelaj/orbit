# Technical contracts

Implemented behavior and invariants, consolidated 2026-11-07. Current code is authoritative for implementation; proposed O-10/O-11 behavior belongs in [PLAN](PLAN.md). Read only the relevant section: [architecture](#architecture), [inventory/storage](#inventory-and-storage), [calculations](#calculations), [search](#search), [speed](#speed), [scanner](#scanner), [verification](#verification-policy). Setup commands are in [README](../README.md); sources and pins are in [SOURCES](SOURCES.md).

## Architecture

Orbit uses React, strict TypeScript and Vite. It requires no server rendering, database server, cloud service or user accounts. React owns inputs and interactions; pure domain modules own validation, normalization, calculations, search and AV simulation. Expensive optimization runs in a module Web Worker. Derive outputs from inputs rather than mirroring them into effect-driven state. Keep source data, profile assumptions, computed values and formatting separate. Do not add dependencies or speculative shared abstractions without a concrete need.

| Location | Responsibility |
| --- | --- |
| `src/app/` | Shell, theme, clearly synthetic demo and navigation |
| `src/domain/` | Unknown-input validation, catalogue math, manual-profile comparison, search and speed model |
| `src/features/inventory/` | File/scan preview, filters, details, replacement and backup |
| `src/features/comparison/` | Shared manual profile, A/B drafts and saved snapshots |
| `src/features/optimizer/` and `src/workers/` | Search UI, Worker protocol and lifecycle |
| `src/features/speed/` | Team editing, SPD copying, timeline and ledger |
| `src/storage/` | Versioned IndexedDB records and validated backup restoration |
| `src/data/` and `public/assets/` | Pinned constants, local images/fonts and notices |
| `server/` | Same-origin scanner API, provisioning/supervision and Windows helpers |
| `tests/` | Synthetic cross-workflow, process/API and browser QA fixtures |

`server/engine.mjs` verifies/provisions the pinned reader; `scanner.mjs` supervises one job and projects exports; `http.mjs` serves only dist and authenticated scanner endpoints. `start.mjs` reserves the loopback port before setup and drains active work on shutdown. Scanner UI decodes unknown responses, rejects stale polling across commands and aborts requests on unmount. Scan completion supplies the normal pending import, never an automatic save.

Keep the fixed `http://127.0.0.1:4173` origin for browser storage. Dev, preview, runtime and QA harness cannot share that port simultaneously. Theme uses `orbit:theme:v1` in localStorage with failure handling and system-preference fallback. Other personal workspace data uses IndexedDB. A new hostname, port, browser profile or cleared browser data requires explicit backup recovery; no cross-device sync exists.

## Inventory and storage

Accept only validated `reliquary_archiver` or `HSR-Scanner` schema 4 exports and supported `InitialScan` envelopes containing the same export in `data`. Envelope support is not live WebSocket integration. Maximum input is 20 MiB and 10,000 relics; empty inventories are valid. Enka showcase JSON, another Fribbels save schema or a new source/version requires an explicit adapter with fixtures, not detection by a `relics` property alone.

Normalized items retain scanner ID, set ID/name, slot, rarity, level, main-stat key, unrounded active/preview/reroll values, owner ID and lock/discard status. O-11b retains character identity plus available path, level, ascension, Eidolon, ability version, skill levels, Trace flags and optional memosprite levels. Light Cones retain identity/location plus available level, ascension and superimposition. Keep import time and precision; discard account UID, gacha/material data and roll count/step metadata. O-11c adds explicit baseline initialization for a reviewed subset; raw progression alone is still not a verified calculation profile.

Source fields are `source`, `version`, `relics`, optional `characters`, `light_cones`, `metadata`. A synthetic example shape:

```json
{"source":"reliquary_archiver","version":4,"relics":[{"set_id":"102","name":"Musketeer of Wild Wheat","slot":"Hands","rarity":5,"level":15,"mainstat":"ATK","substats":[{"key":"CRIT Rate_","value":5.1}],"preview_substats":[],"location":"","lock":false,"discard":false,"_uid":"relic_1"}]}
```

Treat files, HTTP responses and persisted data as unknown. Validate shape, slot/rarity/level bounds, finite numbers, main-stat compatibility, active substats and reference records. Reject duplicate scanner IDs, malformed/duplicate references and active substats duplicating the slot-aware main-stat identity. Errors identify the field/record and abort the entire replacement. Identical stats with different IDs remain different relics; IDs are snapshot-local, not guaranteed across scans. Missing owner records are warnings because scanner filters may omit characters; preserve literal IDs. Unknown catalogue identities remain available with warnings/fallbacks, never silently dropped or treated as zero mechanics. Unsupported stat keys need an explicit extension or error.

Percent substat keys use `_`. Main HP/ATK/DEF is flat on Head/Hands and percentage on Body/Feet/Sphere/Rope. Main amounts come from the pinned rarity/slot/level catalogue. Preserve fractional SPD and all imported values; round only for display. `preview_substats` are unrevealed future values and `reroll_substats` are an alternative: neither enters the active build. Reliquary precision is packet-derived; Kel-Z OCR cannot recover hidden SPD decimals. Unknown sources cannot claim exact precision. Scanner filters may omit items; Orbit cannot reconstruct absent data.

File/scan → full validation → preview → explicit replacement → completed IndexedDB transaction → React update. Preview never writes. Invalid input or failed writes keep the previous inventory and show an actionable error. Only required normalized fields persist; never commit personal exports, credentials, captures or account logs. Inventory pages mount 48 cards; comparison candidate pages mount 24 buttons.

Database `orbit-workspace`, version 1, store `workspace`, contains independent keys:

| Key / backup | Contract |
| --- | --- |
| `inventory` / `orbit-inventory`, schema 2 (reads 1 and 2) | Normalized relics reserialized into the supported scanner shape; precision re-derived from original source. Optional ISO `importedAt` or null plus character/Light Cone progression. Schema-1 files decode with legacy provenance; explicit save/backup writes schema 2. Database/store version stays 1. Legacy timestamps stay unknown; only scanner imports assign a new one. |
| `comparisons` / separate schema-1 file | Up to 20 named shared profiles and A/B relic snapshots, source precision and catalogue pin. Whole-list validation, 20 MiB file cap, same-name replacement. Unsupported catalogue pins fail visibly; no silent relinking to new inventory IDs. |
| `speed-team` / `orbit-speed-team`, schema 1 | Exactly four members, cycles and speed/provenance metadata; 16 KiB file cap. Independent of inventory/build backup. |

O-11b normalized `characters[].progression` contains only supplied fields: `path`, `level`, `ascension`, `eidolon`, `ability_version`, `skills` (basic/skill/ult/talent/optional elation), `traces` (ability_1–3, stat_1–10, special) and optional `memosprite` (skill/talent). Missing fields remain absent. Levels accept character 0–80 (0 is unresolved), Light Cone 1–80; ascension 0–6, Eidolon 0–6, superimposition 1–5. Skill/memosprite levels accept bounded integers 0–100 and ability version 0–1,000,000 as structural limits, not verified game-rule legality. Trace flags must be booleans. Unknown extra fields are stripped, not executed or used as calculation bonuses. Malformed known values/objects abort import.

`roster` records `source` (supplied/omitted/legacy-backup) and `completeness: unknown`; `lightConeSource` independently records the same provenance choices. Raw missing sections differ from explicitly empty arrays; null sections are invalid. Schema-1 backups receive legacy provenance; schema-2 backups require these metadata fields and reject completeness claims or omitted sections with nonempty records. All roster entries survive, including characters without relics. Neither roster presence nor an empty Light Cone list proves complete ownership or no equipped cone. Do not infer them from relic owner IDs.

`characterDataStatus` returns missing, partial or unverified, never verified: missing progression, omitted required fields or zero placeholder levels cannot become automatic stats. Even fully supplied data requires O-11c catalogue/path/Trace verification; default zero/false fields may still be upstream placeholders. Skill/Eidolon levels remain raw values without guessed bonus adjustments. Preserve character ID/path/ability version for future form resolution. Backup generation preserves progression/provenance and import time; `saveInventory` validates the complete serialized backup before opening a write transaction. Loads do not rewrite schema-1 storage automatically; explicit save migrates it. Comparison/team outer schemas and database version remain unchanged; comparison relic snapshots can read old schema-1 and new schema-2 inventory envelopes. Old normalized data cannot recover discarded progression: original-file reimport, owner-initiated rescan or manual fallback is required.

Inventory replacement never repoints saved snapshot items by array index. Comparison drafts survive view switches; reload requires loading a named saved comparison. No comparison deletion UI exists; backup restoration can manage the list. Initial saved-list/team read failure disables ordinary saves to protect unread values; explicit validated restore remains a recovery route. Restore persists before UI replacement; failed writes report no success. Team reset affects drafts only. Team backup includes current valid inputs, even unsaved edits; inventory backup does not include comparisons or the team. Back up all three before destructive QA or clearing browser data.

## Calculations

Numeric percentages use percentage points: 12% is stored as 12. Convert fractional catalogue properties once at the boundary. Keep full precision through totals, deltas and search. Manual profile inputs include character base HP/ATK/DEF/SPD, separate Light Cone base HP/ATK/DEF and signed flat/percentage corrections. Character selection does not initialize numeric stats. Baseline CRIT, Energy Regeneration Rate and permanent bonuses require explicit manual entries; zero means no contribution. Do not duplicate relic/static-set additions in corrections.

```text
base = character base HP/ATK/DEF + Light Cone base HP/ATK/DEF
final HP/ATK/DEF = base * (1 + percentage additions / 100) + flat additions
final SPD = character base SPD * (1 + speed percentage additions / 100) + flat SPD
```

Character/Light Cone bases must correspond to their level/ascension. Light Cone base stats apply independently of passive Path eligibility; passives require verified explicit modeling. Minor Trace flags need a verified mapping, not guessed ordering. Manual or explicit baseline catalogue profiles share the same corrections model; major Trace effects, Eidolon conditions, enhanced kits, conversions, combat buffs and other unmodeled effects remain excluded and visible. A text description is not executable rules.

`domain/catalogue.ts` derives main stats as base + level × step using rarity/slot affix groups. StarRailRes pin: `dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487`; see SOURCES for files/notices. Head HP, Hands ATK and Feet SPD stay flat; percentage properties convert once. Unknown groups/properties are unavailable, not zero. Item UI shows percentages to one decimal and flat catalogue values to two decimals; this is not game integer-panel rounding.

`domain/comparison.ts` validates the shared profile and equipped loadouts. Each present slot contributes its unrounded catalogue main stat and active substats. Slot mismatch, duplicate IDs, known set/slot incompatibility or unavailable main stats stop calculation. Missing slots yield marked partial totals/warnings. Unknown sets preserve item stats with a no-bonus warning. Base values are nonnegative, character SPD positive; corrections are finite within ±1,000,000. Negative final HP/ATK/DEF or nonpositive SPD fail.

Count Cavern 2/4 and Planar 2 pieces. Apply only explicit static properties from pinned `relic-sets.json`, fetched by `scripts/fetch-sets.mjs`. Show descriptions plus properties actually applied; descriptive conditional effects remain excluded. For example Izumo's static ATK applies, its team-dependent CRIT does not. A/B share one profile; A stays stable while B changes. Display totals/deltas to three decimals without rounding internally. Preserve source precision into speed tuning.

## Character profile initialization

O-11c initially resolves baseline profiles for IDs 1001 (March 7th Preservation), 1101 (Bronya) and 1308 (Acheron), plus the 170 pinned Light Cone base growth records in `stat-profiles.json`; see SOURCES for reproducible projection and notices. No runtime remote lookup occurs. `resolveCharacterProfile` requires a supplied matching ID/Path and complete raw progression, rejects zero-level/unresolved/special kits, and never substitutes missing data with zero stats. Imported ability versions are preserved as source identity but not automatically mapped to baseline/enhanced kit constants. The UI requires **Use pinned baseline kit** explicitly; this chooses a baseline model, not proof that the current game kit matches it. Unreviewed forms or missing data keep a visible manual fallback.

Growth uses `base + (level - 1) * step` at the actual ascension. Allowed level/ascension bands are 1–20/0, 20–30/1, 30–40/2, 40–50/3, 50–60/4, 60–70/5, 70–80/6. Source CRIT base converts to percentage points; baseline ERR is 100. Minor Trace fields map to explicit Point09–18 anchors, not array position. Apply only unlocked properties after checking source level/ascension and parent Trace flags. Unknown properties or contradictory prerequisites stop initialization; do not infer effects from text. Major effects, Eidolon/Light Cone passives, conversions and combat remain excluded even if their raw fields are present. Only the displayed baseline/Trace corrections enter the existing shared `calculateBuild` path, used by comparison and optimization.

Exactly one owned cone at the character location can initialize equipped base stats. No match or multiple matches is ambiguous, never equivalent to zero base. Explicit `none` and namespaced `owned:<uid>` overrides are available and labeled hypothetical. A cone with mismatching Path still contributes base HP/ATK/DEF with a warning; no passives apply regardless of Path/superimposition. Missing cone progression/catalogue data stops automatic initialization. Changing superimposition changes provenance but not these base stats.

Optional `BuildProfile.origin` stores character ID, exact catalogue pin, full progression/form/ability-version/cone selection key, baseline/edited mode and bounded explanatory notes. Keys include source Trace flags, progression and cone identity/progression; they describe the origin snapshot, not a live inventory link or authenticity proof. Manual numeric edits retain that origin with edited mode. Comparison schema 1 accepts legacy profiles without origin and validates optional metadata (including supported pin) before restoring it; saved numerical snapshots never silently recalculate on import. Invalid source metadata is rejected. Theme/team schemas stay unchanged.

Character selection prepares initialization only. Existing profile/A/B drafts require Replace drafts or Keep editing; failures leave them intact. The picker includes all imported roster entries, not just relic owners. Inventory replacement cancels pending initialization and resets baseline/cone choices, preserving the existing profile snapshot. Applying a different profile triggers the existing optimizer revision/cancellation path. Broader character-first layout is still O-11f; this milestone adds initialization to current controls without claiming a finished redesign.

Artwork identity is separate from numerical model coverage. Optional `BuildProfile.characterId` preserves explicit manual initialization IDs; it must be a nonempty string up to 500 characters and agree with origin.characterId when both are present. Legacy snapshots remain readable without it. The renderer uses origin identity or explicit characterId, never the editable profile name, and resolves only own entries of pinned character-art metadata. No URL is accepted from imports/snapshots. Character selection alone does not switch the active profile portrait before initialization/replacement is confirmed. New portraits load anonymously with no referrer from the pinned public CDN; runtime CSP permits only that portrait directory in img-src, leaving connect-src self. Failed/unknown art is a labeled fallback, and a new character URL remounts image error state. Non-Acheron portraits use a contained frame rather than the Acheron-specific crop. Public metadata, provider visibility and update coverage are documented in SOURCES; no new binary assets, local image cache or provider failover is implemented (normal browser caching still applies).

## Search

`domain/optimizer.ts` is a pure bounded generator. Current objectives maximize HP, ATK, DEF, SPD, Break Effect or the separately labeled index:

```text
ATK/CRIT index = ATK * (1 + clamp(CRIT Rate, 0, 100) / 100 * max(CRIT DMG, 0) / 100)
```

It is not DPS: it omits skill multipliers, damage bonuses/type, enemy defense/resistance, rotations and combat buffs; it is not universal for Break/DoT characters. CV, CRIT objectives and target priorities are future O-11 work, not current features.

Filter candidates by eligibility, exclusions and slot main stats; every accepted build must use one relic per slot, unique IDs and the shared profile, then satisfy requested set counts and inclusive unrounded min/max SPD. Validate legality separately from ranking. Required set IDs are unique, minimum counts 2 or 4, summing to at most six. Current defaults include locked/equipped relics and exclude discarded ones; proposed O-11 scope defaults are not implemented yet.

Exact mode enumerates the full filtered Cartesian pool only if it fits the budget; otherwise it rejects before evaluation. Limited mode samples index `floor(total × i / limit)` using BigInt mixed-radix decoding for `i` in `[0, limit)`. Scanner-order sampling has no quality/global-optimality guarantee. A fitting pool reports exhaustive even if limited was requested. Candidate-reduced exhaustiveness applies only to the disclosed pool. Never call truncated, beam or resource-capped search a global optimum; any pruning requires a justified guarantee or explicit heuristic disclosure.

Limits: 10,000 relics, six groups, evaluation budget 1–1,000,000; UI budgets 1,000/10,000/100,000/1,000,000. Keep exact product counts as strings beyond Number precision. Retain at most ten results, three unique invalid-calculation examples and eleven temporary ranking entries; do not materialize all combinations or sampled indices. Nonfinite totals/objectives fail. Tie order follows joined six-slot scanner IDs. Unknown-set warnings stay visible. Sampling with no feasible result is not proof of infeasibility; exhaustive coverage does not mean unsupported calculations succeeded.

Each run owns a cloned profile/options snapshot and a new module Worker. Protocol messages carry run ID and inventory revision; runner also checks Worker identity. Emit progress every 1,000 evaluations. Terminate for cancel/restart/unmount; synchronous loops cannot service cancellation messages reliably. Profile/options/inventory/view changes invalidate work and old callbacks. Reports include counts, coverage, invalid reasons and bounded results. No persistent queue/results database exists.

Apply copies a result to comparison B and navigates there, keeping A stable; mixed snapshot/current-inventory precision becomes unknown conservatively. Explicitly save the comparison to persist it.

## O-11a objectives and target contract

Future contract specified 2026-11-07; not implemented by O-11a. Current search behavior above remains authoritative until O-11d. UI behavior is specified in [DESIGN](../DESIGN.md#o-11a-character-workflow-specification). This section finalizes the objective semantics previously proposed in PLAN; O-11b data retention is implemented; O-11c supports a reviewed baseline subset; O-11d optimization remains unstarted.

Supported future objectives: HP, ATK, DEF, SPD, CRIT Rate, CRIT DMG, Break Effect, Build CV and the existing separately named ATK/CRIT index. Use final computed static totals under one selected character/profile version, with units inherited from Calculations. Do not score descriptions or pretend these are simulated damage. Build CV is `2 * CRIT Rate + CRIT DMG` in percentage points, including modeled baseline/profile, main stats, active substats and static set bonuses exactly once. It is not relic-substat-only CV. Preview/reroll values never contribute. Raw CV does not cap CRIT Rate; flag excess above 100% as potentially wasted, and do not confuse it with the clamped ATK/CRIT index.

Three goal modes share one feasibility predicate: maximize Build CV; maximize one supported stat/index; or satisfy selected minimums then maximize one supported objective. Target mode expresses SPD-first as **a hard minimum**, not unlimited lexicographic SPD ranking or a weighted sum. Once feasible, rank solely by the selected objective; there is no secondary reward for surplus SPD. Other minimums, such as CRIT DMG, remain hard constraints. Explicit maximum constraints are inclusive. Empty targets mean absent, never zero; require at least one minimum in target mode, finite valid inputs, consistent min/max ranges and no duplicate stat constraints. Negative thresholds and min > max are invalid. Max-stat/CV modes may also retain explicit Advanced bounds.

Reference acceptance case, synthetic profile with minimum SPD 134 and objective CRIT DMG:

| Candidate | SPD | CRIT DMG | Expected result |
| --- | --- | --- | --- |
| A | 133.9 | 230% | Infeasible; display rounding cannot change it. |
| B | 134 | 210% | First: meets minimum and has higher objective than C. |
| C | 145 | 190% | Second: surplus SPD has no ranking reward. |

Adding minimum CRIT DMG 220% makes all three infeasible; never select A as a relaxed fallback. At equal objective values, sort by stable six-slot relic-ID tuple, not extra SPD. Compare unrounded values, without hidden target tolerance. Synthetic CV checks: CRIT Rate 70%, CRIT DMG 140% gives 280 CV; CRIT Rate 110%, CRIT DMG 140% gives raw 360 CV plus the excess-CRIT warning. These examples are test expectations, not character recommendations.

Every candidate must have a valid complete static profile, one eligible unique relic per slot and satisfy all chosen set/main-stat/ownership/lock/discard/exclusion constraints. Cavern requirements occupy only its four slots: a four-piece set, one two-piece requirement or two different two-piece sets. Planar requirements occupy its two slots; at most one two-piece requirement. Reject contradictory/unknown requirements with actionable errors. No requirement is implied by Any sets. Borrowing is opt-in under future defaults. Missing current equipment can coexist with a valid six-slot candidate; a current-build quality delta must state that its reference is partial.

Search reports bind inventory revision, character/form/profile/catalogue version, goal and pool snapshot to the run. Keep numerical objective separate from feasibility. Exact search refuses excess work before enumeration; quick search keeps its limited-coverage label. Reuse bounded results, cancellation and stale protection; no silent transition from exact to quick. An exhaustive run with excluded unsupported calculations reports those exclusions and cannot claim a universal pool optimum. No-result limited search is inconclusive; no-result exhaustive search means no *computable* feasible build under disclosed assumptions. Neither status relaxes constraints or changes storage.

O-11d tests must independently verify the table, simultaneous bounds, CV units/overflow and profile contributions, legal Cavern/Planar partitions, tie ordering, invalid/missing targets, active-versus-preview values, exact-versus-reference brute force, limited no-result claims, caps/cancel/staleness. O-11e assessment and O-11f UI consume these same totals/constraints, not a separate quality formula. There is no community percentile, character recommendation preset or damage/rotation model in this contract.

## Speed

`domain/speed.ts` uses exactly four named members with fixed speed/buffs and one initial action advance:

```text
effective SPD = panel SPD + character base SPD * fixed buff % / 100 + fixed flat SPD
interval AV = 10000 / effective SPD
first AV = interval AV * (1 - initial advance % / 100)
turn AV = first AV + (turn - 1) * interval AV
cycle n ends at 150 + 100*n AV
unbuffed required SPD = 10000 * target turns / (150 + 100 * (cycles - 1))
```

Percentage buffs use character base SPD, never panel SPD. Cycle 0 is 150 AV, later cycles 100. Sort raw AV then member index then turn; exact ties follow input order. Absolute `1e-9` AV tolerance applies only to horizon inclusion and closing-cycle classification, not reordering distinct times. An action at 150 belongs to C0, at 250 to C1. Ledger/counts/chart share unrounded events; display uses six decimals. Two unbuffed actions by 150 require 133.333… SPD, not an internally rounded 134.

Require 1–20 cycles, finite numeric magnitudes ≤1,000,000, positive base/panel/effective SPD and advance in [0,100]. Intervals must be finite. Reject >2,000 predicted events before allocation; exactly 2,000 is accepted across all members. Threshold helper accepts 1–2,000 turns and displays twelve significant digits while retaining precision. Default 100-SPD members are illustrative. No changing mid-combat buffs, repeated/mid-turn advance, delays, summons, ultimates, rotations or SP economy are modeled.

Comparison-B copying requires a complete valid six-slot profile calculation. Capture base/panel SPD and precision/source, reset extra buffs/advance, and disclose manual-profile limits. Later B/inventory edits do not update this snapshot. Manual edits to copied base/panel speed change provenance to manual; editing buffs/advance alone preserves it. OCR/manual/unknown values cannot guarantee exact in-game thresholds.

The speed view skips simulation/rendering when hidden; bounded output needs no Worker. Ledger pages mount 50 rows; chart markers share the event cap. Keep numeric events accessible alongside the chart.

## Scanner

Implemented local mode serves app/API together on `127.0.0.1:4173`. Browser validation, math and durable storage remain local to the browser; a normal-user Node process supervises one elevated native reader. A browser alone or UID lookup cannot obtain complete inventory. O-10 hosted pairing/packaging is only a proposal in PLAN.

Pin Reliquary Archiver v0.19.0 Packet Monitor x64, asset `reliquary-archiver-pktmon-x64.exe`, 12,294,144 bytes, SHA-256 `4c687b0cc042d641fe3d2e513e3380544055f46ebb4092cc2a6dcb9072835c0a`. Preserve the MIT notice in `server/RELIQUARY-LICENSE.txt`. Provision under ignored `.cache/`, checking URL/size/digest before publication and again in the elevated helper. Setup never executes it, never follows automatic latest updates. A pin change requires source/schema review. Game-version support remains an upstream dependency.

`npm.cmd start` builds, reserves the origin, verifies/provisions on Windows x64 and enables controls; `npm.cmd run scanner:setup` only provisions. Dev/preview are frontend-only and show connection guidance. Helpers use a process-scoped policy; no global Windows policy changes. No capture starts during install, startup, health checks, build or tests.

API requires valid Host/Origin, no CORS and a per-runtime random token on all job/result requests:

| Operation | Contract |
| --- | --- |
| `GET /api/scanner/session` | Requires `X-Orbit-Client: 1`; obtains runtime session |
| `GET /api/scanner/status` | Capability/current job; requires `X-Orbit-Session` |
| `POST /api/scanner/scan` | Starts one fixed job; session required |
| `GET /api/scanner/scan/{id}/result` | Current projected result; session/job ID required |
| `DELETE /api/scanner/scan/{id}` | Discards result; session/job ID required |

Commands accept no body, shell text, executable path, download URL, port or output filename. Serve only dist, never repo/cache/arbitrary files. No raw stdout/stderr, paths, packets or account metadata in responses. Browser decoders must validate response shapes.

Scan flow: prepare HSR at **Click to Start** → explicitly choose Scan → approve elevation → enter game when listening within the 120-second window → browser validates completed projected JSON → review count → explicitly Replace inventory after successful persistence. Denied/failed/incomplete scans preserve the old inventory. Closing the panel leaves the job active; reconnect can recover runtime state after reload. Manual file import stays available.

`launch-scan.ps1` requests elevation only for `scan-worker.ps1`, not the web server. Launch Windows PowerShell hidden without detached mode; a harmless probe established detached mode could exit 0 without executing `-File`. Quote worker paths/payload, retain child/native reader handles, wait explicitly and reject missing/nonzero exits. A named Windows mutex prevents overlapping Orbit captures across runtime restarts. Disable reader self-update/streaming; require initialization marker and valid complete export.

Stage errors remain sanitized. Incomplete reasons are `exit_unknown`, `native_exit`, `crash`, `unsupported_version`, `capture_setup`, `initialization_missing`, `export_missing`; unknown reasons retain a generic failure. Missing initialization alone does not prove game-version incompatibility. Upstream's panic handler writes `crashlog.txt` and waits for Enter: use empty redirected stdin for EOF, reject crash results and remove artifacts. Actual native panic remains untested.

Only one native run may be outstanding. Discard marks the result unusable and blocks a new job until finite native completion, including after status-file failure. Shutdown drains the same way. Do not force-kill capture and claim Windows resources were released; helper waits before releasing mutex. Explain the waiting state and make denied UAC actionable.

Raw export and temporary info-level stdout/stderr stay in a unique ignored run directory only for completion checks. Forward source/version/relics and whitelisted character/Light Cone identity/progression fields; preserve omitted reference sections and strip unrelated data. Remove run artifacts after read/cancel/failure, surface cleanup errors, expire memory results after five minutes. Startup cleans only recognized run directories older than ten minutes, preserving recent/unrelated files. Request no trace log or packet file. Orbit adds no memory reading or game automation.

## Verification policy

AGENTS owns change-specific verification. Documentation/URL-only changes need relevant links, scope and diff/whitespace checks; do not run app builds, tests or browser audits for prose alone. Application features need focused checks per change, required full-suite/build and exact-head Windows/Linux CI before integration. A passing build or checksum cannot establish real extraction, math correctness, accessibility or usability. Keep current evidence/limits in VERIFICATION, not another report per task.

| Area | Required meaningful checks |
| --- | --- |
| Import/storage | Valid/invalid schema fixtures, limits, duplicate versus identical items, six slots, precision, active/preview/reroll separation, references, unknown data, backup round-trip, reimport/reload and failed-write rollback. |
| Math/search | Independent expected totals, percent/flat order, static/conditional exclusions, manual/missing profiles, separate brute-force reference with constraints/ties, bounded work and exact/limited coverage. |
| Worker/speed | Cancel/restart/revision/stale progress/results/errors and terminal release; AV thresholds, base-SPD buffs, advance, ties, boundaries, invalid/extreme input and event caps. |
| Scanner | Pin/download mismatch, metadata redaction, missing/malformed/partial/oversized output, expiry/stale IDs, single-run/cancel/shutdown/cleanup, denial/missing engine and actual loopback origin/Host/token/body/path rejection. Windows helper parsing and harmless fixtures only; no real capture/UAC in CI. |
| UI | Both themes, desktop/narrow, keyboard/focus/Escape, labels/44px targets, no page overflow/console errors, image failures, empty/loading/error/no-result states and actual changed controls. Record scoped antislop gate and limitations. |

`npm.cmd test` runs Vitest then Node scanner tests. Tests use synthetic exports/adapters and fake IndexedDB. `tests/workspace.acceptance.test.tsx` traverses real App/import/comparison/result transfer/team/save/reload/replacement with isolated storage and a controlled Worker using the real search engine; a separate fixture forces transaction aborts. Actual module-Worker behavior still needs a production-browser check. `src/features/optimizer/runner.test.ts` verifies lifecycle independent of UI.

Scanner component checks include lazy connect/reconnect, unknown responses, cancel/discard-until-exit, result preview/focus, precision/schema rejection and failed-save retention. For synthetic browser QA, build then run `node tests/browser/preview-scanner.mjs` (optional `--incomplete`); its adapter writes a labeled fake export after 2.5 seconds and cannot launch capture. Stop other owned servers on 4173 first. `npm.cmd start` development verification stops at idle ready; real scan acceptance is owner-initiated.

`tests/browser/audit-ui.js` is a read-only browser snippet, not CLI/Vitest. Use the approved browser runtime's DOM API. It measures overflow, active target sizes and computed solid-background text contrast; checkbox/radio labels count, disabled/hidden/closed content is exempt. It cannot certify image/pseudo-element compositing, every browser, assistive technology or full WCAG. Open relevant disclosures and inspect screenshots too; the audit does not read storage or mutate the page.

Before destructive UI QA, export all three backup types and restore them afterward; compare canonicalized JSON, not visual similarity. Use only synthetic fixtures in Git. Real inventory count/stat matching, game compatibility, Windows UAC and normal/timeout/cancel/shutdown capture cleanup require owner-driven evidence. Never start personal capture or elevation as a development check.
