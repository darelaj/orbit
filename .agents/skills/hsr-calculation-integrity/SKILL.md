---
name: hsr-calculation-integrity
description: Preserve HSR inventory data and calculation guarantees when changing scanner imports, build statistics, relic search, or action-value timelines in Orbit.
---

# HSR calculation integrity

Read the relevant contract in `docs/TECHNICAL.md` (inventory/storage or calculations section) before changing behavior. Keep formulas in pure TypeScript modules, separate from React and persistence.

- Full inventory requires scanner exports. Never claim UID lookup supplies unequipped relics.
- Keep active, preview, and reroll substats separate. Preserve unrounded numeric values and attach the source precision to imports and speed outputs.
- Identical stats do not mean identical items. Reliquary item IDs can support matching; OCR scanner IDs are assigned during a scan and are not durable game identities.
- Parse and validate the entire export before replacing the active workspace. Report unsupported records instead of silently dropping them.
- State the source and version of game constants. Missing character data, partial Trace, conditional bonuses, enhanced kits, and in-combat effects need an explicit model or a visible limitation.
- Apply flat and percentage stats in the correct order. Speed-percent buffs multiply character base SPD. Do not multiply final SPD by a base-speed buff.
- AV is `10000 / effective SPD`. Cycle zero has 150 AV; later cycles have 100. Define tie ordering, tolerance, initial advance, and simulation horizon explicitly.
- Exact optimization must enumerate or soundly bound the declared candidate space. Candidate pruning or beam search requires a heuristic label; never imply a global optimum.
- Test constraints independently of ranking. Every returned build uses one item per slot, respects exclusions and set rules, and uses the requested profile.
- Keep search memory bounded, provide cancellation, and associate worker messages with a run ID and inventory revision so stale results cannot replace current results.

For verification, prefer numerical fixtures with hand-computable answers, reference brute force on small search spaces, import rollback, and cycle-boundary tests. Do not treat a screenshot or a passing UI build as proof of formula correctness.
