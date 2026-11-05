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
