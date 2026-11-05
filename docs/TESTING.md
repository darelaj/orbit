# Verification plan

Tests focus on input preservation and calculation correctness. The framework setup will define executable commands; SESSION_STATE.md records commands actually run.

## Import and persistence

- Equipped and unequipped relics, lock/discard flags, decimal SPD, all six slots, percent/flat stat distinctions.
- Valid scanner exports, missing optional sections, duplicate external IDs, identical but distinct items, malformed records, unsupported schema versions, unsupported stat keys, file limits.
- Active/preview/reroll separation; character and Light Cone mapping.
- Invalid import and storage failures preserve the last good inventory.
- Backup round-trip and restore after reload. Exclude unrelated scanner data.
- Thousands of relics render through pagination or virtualization without producing thousands of heavy card components.

## Math and search

- Hand-computable flat-plus-percent calculations and set thresholds.
- SPD buffs use base speed; OCR values are retained without invented precision.
- Known minor Trace mapping, missing data, and manual corrections have explicit outcomes.
- Exact search matches a separately written small brute-force reference, including ties and constraints.
- Heuristic search reports its mode, stays within resource bounds, and returns only legal builds.
- Cancellation and a new import invalidate old worker messages.
- Timeline thresholds, initial advance, cycle boundaries, equal-time order, invalid speeds, and capped horizons.

## Browser acceptance

Exercise both requested themes at desktop and a narrow viewport, then record each control's observable outcome in `VERIFICATION.md`:

- Navigation and theme toggle, including persisted theme.
- First-run import guidance, demo labeling, successful import, invalid import rollback, file re-selection, backup download.
- Filters, reset, pagination, relic detail, dialog Escape and focus return.
- Six-slot edits, profile corrections, stable A/B comparison, save/load builds.
- Optimizer objective/constraint edits, search, cancel, no-result state, send-to-comparison.
- Team input edits, build-to-SPD transfer, timeline and event list.
- Keyboard-only use, visible focus, labels, touch targets, text contrast, no page overflow, no console errors.

Run typecheck, unit/integration tests, and a production build before feature integration. Do not claim manual interactions from a passing build. Do not invent performance scores; benchmarks are recorded only if measured.

The antislop delivery gate must include evidence for its hard gates, purpose decisions, liveliness dials, and craftsmanship checks. Keep the detailed report in VERIFICATION.md and link it from the final delivery.
