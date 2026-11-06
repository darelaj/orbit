# Calculation contract

This document defines the first model, not a claim that every HSR mechanic is implemented. Keep unsupported behavior visible near results.

## Stat conventions

Use numeric percentage points for user-facing CRIT, Break Effect, EHR, RES, and percentage additions. A displayed 12% is stored as 12 in the normalized model; catalogue fractional values must be converted once at their boundary. HP/ATK/DEF/SPD flat values remain flat numbers. Preserve full precision until display.

For HP, ATK, and DEF:

```text
base = character base at level/ascension + Light Cone base at level/ascension
final = base * (1 + total percentage additions / 100) + flat additions
```

For SPD:

```text
final SPD = character base SPD * (1 + speed percentage additions / 100) + flat SPD
```

Light Cone base stats apply independently of passive eligibility. Its passive requires the correct Path. Apply only explicitly modeled static properties. A text description is not executable effect logic.

Known catalogue profiles can initialize character values, Light Cone values, and minor Traces. Partial Trace flags require a verified mapping, not guessed ordering. If data is missing, require a manual correction/profile and show the model scope. Major Traces, Eidolon conditions, enhanced kits, conversion passives, and combat-dependent buffs need separate modeling.

## Set effects

Count equipped pieces. Cavern set thresholds are 2 and 4; planar thresholds are 2. Apply only catalogued static properties. Show active set descriptions so the user can see what has not been evaluated. Conditional effects are excluded unless explicitly enabled and modeled. Do not count preview/reroll substats as active.

## Objective scope

Supported stat objectives can include ATK, HP, DEF, SPD, Break Effect, and weighted stat scores. An optional ATK/CRIT index is:

```text
ATK * (1 + clamp(CRIT Rate, 0, 100) / 100 * max(CRIT DMG, 0) / 100)
```

This is an index for comparison. It omits skill multipliers, damage bonuses, enemy defense/resistance, rotations, damage type, and buffs. It is not DPS and is unsuitable as a universal ranking for Break or DoT characters.

## Search guarantee

Every returned build uses exactly one relic in each slot and passes all selected constraints. Constraints and scoring are separate functions. Required set counts and exclusions apply before accepting a result.

Small spaces can be enumerated exactly. Large spaces use a bounded heuristic or require tighter filters; the UI states which. If the candidate pool was reduced, even exhaustive enumeration is only exact within that stated pool. A resource cap must not be labeled a global optimum. Retain a small ranked set, report evaluated counts, and expose cancellation.

## Action-value timeline

```text
effective SPD = panel SPD + character base SPD * fixed speed buff % / 100 + fixed flat SPD
interval AV = 10000 / effective SPD
first action AV = interval AV * (1 - initial action advance % / 100)
later actions = previous action AV + interval AV
cycle 0 ends at 150 AV
cycle n ends at 150 + 100*n AV
```

The initial-advance formula models a percentage reduction of a full initial action distance. It does not model repeated or mid-turn advances, speed changes during combat, delay, summons, ultimates, or SP economy. SPD must be positive and finite. Define a small numeric tolerance at boundaries, and use stable input order to break exactly equal timestamps. Cap simulation output to a documented limit.

For N turns within C cycles without buffs or advance:

```text
required SPD = 10000 * N / (150 + 100 * (C - 1))
```

For example, two actions by 150 AV require 133.333... SPD. Preserve the decimal instead of replacing the exact threshold with a rounded 134. OCR uncertainty matters near this boundary.

## Implemented relic main-stat boundary (O-04b)

`src/domain/catalogue.ts` uses StarRailRes commit `dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487`, `index_new/en/relic_main_affixes.json` (bundled locally). Affix group is rarity plus slot index. Value = base + level × step. Fractional percentage properties convert to percentage points once; Head HP, Hands ATK and Feet SPD stay flat. Unknown properties/groups return unavailable, never zero. Internal values remain unrounded; UI shows percentages to one decimal and flat catalogue values to two decimals, not the game's integer panel rounding. This is item data only, not an implemented character build calculation. Preview/reroll values do not enter this calculation. Independent numerical tests cover HP base/max, CRIT percentage, SPD, missing groups and unknown properties.

## O-05 manual-profile calculation

The shared profile contains character base HP/ATK/DEF/SPD, separate Light Cone base HP/ATK/DEF and signed manual additions in flat units or percentage points. All non-base values (including baseline CRIT and Energy Regeneration Rate) are explicit correction inputs; zero contributes nothing. No character-name lookup initializes numerical stats. Missing/partial Trace, Eidolon or passive data is excluded and disclosed. Users must enter known permanent contributions manually, without duplicating relic or static-set bonuses already included by the engine.

Each present slot adds its unrounded catalogue main stat and active substats. Preview and reroll values remain inactive. Slot mismatches, duplicate IDs, known-set/slot incompatibility and unavailable main stats stop calculation. Missing slots produce partial totals and individual warnings; unknown sets preserve item stats with a no-bonus warning. HP/ATK/DEF and SPD follow the base/percent/flat formulas above. Negative HP/ATK/DEF or nonpositive SPD are rejected. Corrections must be finite and within ±1,000,000; base values are nonnegative and character SPD is positive.

`src/data/relic-sets.json` is preserved from the same StarRailRes pin as main stats, retrieved reproducibly by `scripts/fetch-sets.mjs`. Count 2/4 pieces for cavern and 2 for planar sets. Only the catalogue's explicit static property entries are applied, converting fractional properties to percentage points once. Descriptions remain visible alongside the exact properties applied; remaining descriptive effects are excluded. For example, Izumo applies unconditional ATK 12%, without its team-dependent CRIT bonus. No arbitrary description text is executed as rules. Result display rounds to three decimals; internal totals/deltas remain unrounded. This is not a DPS index or combat simulation.

## O-06 search implementation and limits

Exact enumeration covers every Cartesian combination after explicit eligibility filters. It refuses a pool larger than the evaluation budget before calculation; no silently truncated exact run exists. Limited mode chooses combination index floor(total × i / limit), using BigInt mixed-radix decoding for i in [0, limit). This is deterministic scanner-order sampling with no quality or global-optimality guarantee. If the entire filtered pool fits, even a requested limited run reports exhaustive coverage. Counts larger than JavaScript's safe integer range remain exact strings.

Limits: at most 10,000 inventory relics, six candidate groups, budget 1–1,000,000 (UI offers 1,000/10,000/100,000/1,000,000), at most ten retained results and three unique invalid-calculation example reasons. No list of all combinations, search expansions or sampled indices is allocated. Temporary ranking has at most eleven entries. Required set IDs are unique with minimum counts 2 or 4, summing to at most six. Every returned result has one relic per slot, unique IDs and the requested set/SPD constraints. SPD comparisons use unrounded JavaScript numbers with inclusive min/max checks and no hidden display-rounding tolerance. Invalid calculations are counted/explained and excluded; exhaustive coverage does not mean unsupported builds were successfully evaluated.

Objectives maximize HP/ATK/DEF/SPD/Break Effect or the ATK/CRIT index defined above. Static set bonuses and profile corrections use O-05 math. Tie order follows joined six-slot scanner IDs. Unknown sets retain item stats with visible warnings. Nonfinite totals/objectives are rejected rather than ranked. Sampling finding no feasible build is not proof of infeasibility. Cancellation terminates the Worker rather than waiting for a synchronous loop to process a message; monotonic run/revision and Worker identity checks reject stale results after restart, input edits or imports.

## O-07 implemented AV model

`domain/speed.ts` computes each member's fixed effective SPD, interval and initial action time from the formulas above. Later times use first + (turn − 1) × interval rather than accumulating rounded values. Events sort by raw AV, then member index, then turn. No tolerance is used to reorder distinct timestamps; exact ties follow input order. An absolute 1e-9 AV tolerance applies only to horizon inclusion and closing-cycle classification. Actions at 150 AV belong to C0 and at 250 AV to C1. Counts and ledger use the same unrounded event data; display is six decimals.

Inputs require exactly four named members, 1–20 cycles, finite numeric magnitudes at most 1,000,000, positive base/panel/effective SPD and advance in [0,100]. Intervals must also be finite. Total predicted events above 2,000 fail before event allocation, without partial output; exactly 2,000 is accepted. This cap includes all four members. Extremely small speeds that overflow interval math fail visibly. The threshold helper accepts 1–2,000 target turns and uses the current cycle horizon without buffs or advance. Approximate display uses twelve significant digits; internal thresholds stay unrounded. The default 100-SPD members are illustrative, not character data.

Comparison-B copying requires a complete six-slot calculation and preserves base/panel speeds plus relic-precision metadata, with explicit manual-profile caveats. It resets additional buffs and advance. Those values remain a snapshot when B/inventory changes. Manual edits to copied speeds change the source label to manual; editing only additional buffs/advance retains the copied SPD provenance. OCR/manual/unknown inputs cannot guarantee exact in-game action boundaries. Repeated/mid-turn advance, dynamic buffs/debuffs, delays, summons, ultimates and SP economy are outside this model.
