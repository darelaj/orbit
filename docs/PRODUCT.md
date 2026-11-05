# Product scope

Orbit helps one HSR player inspect the complete relic inventory on a PC, compare alternative loadouts, search for stat targets, and reason about speed tuning. It runs locally in a browser. The owner requested a framework, focused commits, feature branches, project skills, durable docs, and both light and dark themes.

English is the primary application language, including interface copy, accessibility names, errors, and document metadata. Preserve official game names and stat labels.

## Core workflows

1. Export the account using a supported scanner, import its JSON, and inspect equipped and unequipped relics together.
2. Filter by slot, set, main stat, level, owner, and lock/discard state; inspect a relic's active and preview stats separately.
3. Select a character, verify or correct the calculation profile, and compare six-slot loadouts A and B.
4. Choose an objective and constraints, run a bounded search, and send a result to comparison.
5. Use the build's SPD in a team timeline with fixed buffs and initial action advance.
6. Keep inventory and saved builds locally; export a backup and restore it later.

## Full inventory boundary

Reliquary Archiver or Kel-Z HSR Scanner performs extraction from the game. Orbit accepts its resulting JSON. This first version does not install or run a scanner, capture network traffic, read game memory, or automate the game. It does not obtain the full inventory from a UID.

The owner has not supplied a real inventory export. Schema-derived synthetic fixtures enable development. Real-account acceptance remains a separate unverified check until an export is imported.

## Calculation scope

The first optimizer ranks panel-stat objectives and an explicitly labeled ATK/CRIT index. It does not simulate character rotations, enemies, damage types, break damage, SP economy, summons, changing buffs, or a whole-team relic allocation.

Known catalogue data may initialize profiles. Unknown/new characters or incomplete mechanics require explicit manual profile values or corrections. Users must be able to see which inputs and set bonuses contribute. Unsupported data must not cause relic loss or silently turn into zero.

## Personal data

No account login or cloud sync is planned. Import processing runs in the browser. Persist only fields required by this application; a scanner export may include gacha funds or materials that this app does not need. Store normalized inventory and build settings, not raw packet captures or credential data. Browser storage is specific to the local origin; a different hostname/port or cleared browser data may require reimporting a backup.

## Exclusions

Gacha tracking, automatic check-in, auto-salvage, game modifications, social features, hosted deployment, and cross-game ZZZ/Endfield support are outside this initial build. The research covers those games, but the owner chose HSR for this application.
