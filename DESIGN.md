# Orbit design direction

Owner direction: a local analytical HSR tool, with both light and dark themes. The owner selected antislop DURING. The word Orbit is the product name; there is no approved graphic logo or character illustration.

Design read: an inventory and build-analysis workspace for HSR PC players, using a compact analytical language with ENERGY 1 / RHYTHM 2 / MOTION 1.

## Screen jobs

| Screen | Primary decision | Composition |
| --- | --- | --- |
| Inventory | Which relic merits inspection or a build slot? | Filter toolbar, dense stat table, selected-relic detail |
| Comparison | Is loadout B better for the user's target? | Character/profile controls, six slots, aligned A/B stat deltas |
| Optimizer | Which candidate satisfies the chosen constraints? | Search controls beside ranked results, visible search scope |
| Speed tuning | Who acts when, and does the desired cycle order hold? | Member inputs above an AV timeline and an accessible event list |

Navigation maps to those four requested jobs. It is not a marketing sidebar with overview metrics. On a small viewport it wraps into a compact navigation row. Unimplemented screens must not appear as working navigation.

## Themes and tokens

- Dark theme: charcoal/slate backgrounds, near-white text, muted text with AA contrast, teal for the primary action and selected state. Brass is reserved for equipment-level/rarity information.
- Light theme: warm near-white surfaces, dark slate text, a darker teal accent, dark brass for equipment information.
- Meaning survives the theme change and color-blind use: deltas have signs, selection has text/state, and actor lanes have names and order numbers.
- Use CSS custom properties for surfaces, borders, text, accent, warning, and positive/negative values. No scattered theme-specific color literals in feature components.
- Initial theme follows the system preference; the user's toggle is persisted. Both requested modes are verified.

## One-line reasons

| Choice | Reason |
| --- | --- |
| System sans-serif (Segoe UI on Windows) | Keeps form labels and dense tables readable on the target PC without remote font requests. |
| Tabular numbers; monospace only for numeric measurements where useful | Makes small SPD and stat differences easy to compare without a terminal aesthetic. |
| Inventory table instead of a card wall | Lets the user compare main stat, substat quality, equipment state, and level across many relics. |
| Teal primary action | Gives one clear next action while neutral controls remain subordinate. |
| Brass equipment annotation | Separates item metadata from editable controls and calculated deltas. |
| Flat surfaces, restrained borders, small radii | Supports prolonged analysis and distinguishes field/control/panel hierarchy. |
| Timeline axis and cycle marks | Shows action timing and cycle boundaries directly; this is data geometry, not a decorative background grid. |
| Different comparison/search/timeline compositions | Each view answers a different decision instead of repeating a dashboard template. |
| Text-only Orbit name | Preserves the accepted product name without inventing an unapproved logo. |
| No illustrations or remote character art | Inventory and numeric evidence are the relevant content; art is not needed to make the decisions work. |

## Interaction and copy

Use Indonesian explanations and familiar HSR stat labels. Actions name the result: Impor inventory, Simpan build, Cari kombinasi, Batalkan pencarian. Show original set/character names from exports. No slogans, decorative emoji, usage statistics, testimonials, or decorative status dots.

Native buttons and links have visible hover, active, disabled, and keyboard-focus states. Input fields have visible labels. Touch targets are at least 44px. Tables may scroll inside their own named region on a narrow viewport; the page itself must not overflow. Dialogs close on Escape and return focus.

MOTION 1 means state/hover transitions only. No continuous pulses, floating decoration, or scroll reveals. Respect reduced-motion preferences.

## State design

- First run explains that a full inventory needs scanner JSON and gives the import action.
- A filtered empty table explains which filters removed the results and offers reset.
- Loading labels name the work: validating JSON, restoring local inventory, or searching candidates.
- Import errors identify the record and preserve the previous inventory.
- Demo data is explicitly synthetic and is never presented as the owner's account.
- Calculation limitations sit near the affected result, not behind a generic disclaimer.

Record the antislop delivery gate and actual browser interactions in `docs/VERIFICATION.md`. A polished screenshot does not establish behavior or correctness.
