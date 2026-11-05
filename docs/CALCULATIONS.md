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
