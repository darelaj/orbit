# Engineering rules

Read only the section relevant to the change. AGENTS.md owns workflow and scope; these sections preserve implementation, data and UI correctness requirements.

## Implementation structure

React components manage interface state and interactions. Pure TypeScript modules own validation, normalization, math, search, and timeline behavior. Module Web Workers own expensive search. IndexedDB owns durable personal workspace data; a small versioned localStorage key can hold theme preference.

Follow ARCHITECTURE.md as features are introduced. Keep modules near their feature or domain and extract shared code when there is a real second use. Do not create empty directories, speculative abstractions, or a generic framework around a single feature.

- Keep strict TypeScript enabled. Treat imported JSON and persisted external data as unknown until validated; do not hide schema problems with broad casts or any.
- Prefer explicit domain types and pure functions whose inputs include calculation assumptions.
- Derive filtered inventory, calculated stats, and timeline events from current inputs rather than maintaining duplicate effect-driven state.
- Keep profile inputs, source data, computed output, and display formatting separate.
- Preserve numeric precision during parsing and calculation. Round only for display or a documented game rounding rule.
- Keep expensive computation off the main thread and avoid rendering thousands of full item components at once.
- Handle plausible boundary failures with actionable feedback. Do not silently catch import/storage failures and claim success.
- Do not refactor unrelated files, change formatting across the repository, or add dependencies merely to resemble an upstream example.
- Comments explain non-obvious constraints, units, protocols, or tradeoffs. Avoid narration, decorative separators, and vague TODOs.

## Inventory and persistence invariants

Read IMPORT_FORMAT.md before changing an adapter or normalized model.

- Full inventory includes equipped and unequipped relics, including locked/discarded records. Scanner-side filters may omit items; Orbit cannot reconstruct absent data.
- Validate the entire supported export before replacing the active inventory. Invalid input must leave the last valid workspace available and identify the offending record or field.
- Define explicit limits and supported schema versions. Do not accept a new format just because it contains a relics array.
- Identical stats do not mean identical items. Preserve distinct relics; detect duplicate external IDs deliberately.
- Distinguish durable game IDs from OCR scan-assigned IDs. Saved builds must not silently point to a different item after reimport.
- Keep active, preview, and reroll substats separate. An alternative or unrevealed substat does not contribute to the current build.
- Preserve provenance and precision. OCR cannot recover hidden SPD decimals; unknown sources must not be labeled exact.
- Unknown catalogue records must not silently disappear or become zero-valued mechanics. Preserve supported raw identity and disclose missing calculation data, or report an explicit unsupported record.
- Persist only the application's required fields, not unrelated gacha/material data or credentials from a broad scanner export.
- Version workspace records and backups. Validate restores and handle migration/storage failure explicitly.
- Backups and saved builds need round-trip and reimport behavior tests. Do not clear browser data as a routine development step.

Personal exports, credentials, logs containing sensitive fields, captures, and real-account fixtures do not belong in Git. Use clearly labeled synthetic fixtures. Do not fetch or upload personal data merely to populate a screenshot.

## Calculation and comparison invariants

Read CALCULATIONS.md and the HSR integrity skill before changing formulas.

Use the documented flat/percentage units. Compute HP/ATK/DEF from the appropriate character-plus-Light-Cone base, then percentage and flat additions. Speed-percent buffs use character base SPD, not final panel SPD.

Apply only explicitly modeled properties. Conditional set bonuses, partial Trace mappings, enhanced kits, conversion passives, combat buffs, and rotations require real support or a visible limitation. Do not infer effect logic from descriptive text or guess a missing mapping.

A and B compare the same character/profile unless a separately specified workflow permits otherwise. Keep A stable while B changes. Expose relevant input corrections and assumptions near the resulting measurements.

A weighted score or ATK/CRIT index is not simulated DPS. Label it as an index and do not claim it represents every character archetype. Preserve decimal SPD in the comparison and carry its source precision into speed tuning.

## Optimizer and worker invariants

Every returned build must contain one relic per slot and satisfy all requested constraints. Validate legality separately from ranking, including set counts and exclusions.

Exact search means exhaustive enumeration or sound bounding of the declared candidate space. If items were screened out, the guarantee is limited to that disclosed pool. Beam search, truncated enumeration, and resource-capped search must not be presented as a global optimum.

Bound intermediate memory and retained results. Do not materialize all combinations or every beam expansion before sorting. Report search mode, pool size, evaluated count, limits, and no-result meaning.

Associate messages with a run ID and inventory revision. Terminate workers for cancellation/new work, release resources on unmount, and reject stale progress/results. A new inventory invalidates an old search. Cancellation must remain responsive while a synchronous worker loop is running.

## Speed-tuning invariants

AV equals 10000 divided by effective SPD. The first cycle spans 150 AV and later cycles span 100 AV. Keep boundary tolerance and equal-timestamp ordering explicit.

The initial model uses fixed speed/buffs and an initial action-advance adjustment. Do not imply support for changing mid-combat speed, repeated advance, delay, summons, ultimates, or a full rotation unless implemented and tested.

Reject non-finite/non-positive speeds, use a bounded horizon/event count, and preserve the precision label. Test speeds close to cycle thresholds and keep a readable numeric event list alongside the timeline.

## UI and assets

DESIGN.md and the owner-approved Figma reference in docs/FIGMA_HANDOFF.md supersede the earlier rejected layouts. Keep the HSR equipment composition, balanced density, real artwork, top navigation, wide work area, side details, and subtle user-triggered transitions. For Figma implementation, follow the applicable design-to-code skill and record approved deviations; a malformed component width is not a reason to copy broken fixed sizing into the app.

Both themes are required and must work equally. The supplied Figma palette/type and approved review revisions are now the reference, with scoped contrast corrections documented in the handoff. Do not repeat answered design questions or silently call a superseded UI approved.

- Keep relics visual and key stats visible without hover. Maintain stable six-slot positions and aligned measurements.
- Character artwork represents the selected character/context. It cannot cover controls, obscure numeric contrast, or become a random background.
- The Orbit name is a text wordmark. No custom logo or fabricated official-looking game assets have been approved.
- Record asset/font source and applicable notices before bundling. Preserve explicit dimensions/aspect ratios and useful missing-image fallbacks.
- Use theme tokens. Verify foreground/background pairs, focus, errors, selection, images, and disabled controls in both modes.
- Use native semantic controls, visible labels, logical keyboard order, focus return, and Escape for dialogs. Minimum touch targets are 44px.
- Keep the page within the viewport; any necessary table scrolling stays inside a named region.
- Respect reduced motion. No endless pulses, particles, counting animations, or disruptive movement of numeric results.
- Provide real empty, loading, error, cancelled, and no-result states. Demo content is clearly synthetic.
- English is the primary product language. Use English for interface copy, accessibility names, image fallbacks, errors, scanner guidance, and document metadata; keep familiar HSR character/set/stat names. Set the document language to en. Code identifiers and developer docs also use consistent English. Follow the user's language for conversation unless asked otherwise.
