# Inventory import contract

Sources inspected: [Reliquary export model](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/models.rs), [Reliquary conversion](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/converters.rs), and [Kel-Z export examples](https://github.com/kel-z/HSR-Scanner).

## Supported input

O-04a supports only source `reliquary_archiver` or `HSR-Scanner`, schema version 4, and the `InitialScan` envelope. A file is limited to 20 MiB and 10,000 relics (including empty inventories). Unsupported sources/versions and duplicate `_uid` values fail the entire import with a field path. Identical items with different IDs remain separate. IDs are local to an imported snapshot, not promised stable across scans.

Inspected on 2026-11-06: [Reliquary exporter source/version](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/exporter.rs), [stat/slot conversion](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/utils.rs), and [Kel-Z schema 4 example](https://github.com/kel-z/HSR-Scanner#output). Tests contain synthetic schema-derived records, not personal exports. New versions require explicit adapter review.

Current normalization retains set ID/name, slot, rarity, level, main-stat key, unrounded active/preview/reroll values, owner ID, lock/discard status, and scanner ID. Character/light-cone payloads, account UID, gacha/material data, roll count/step metadata, and unrelated fields are not stored. Owner IDs are shown literally; missing character records are not guessed. Main-stat amounts and reference integrity are O-04b work, so current inspection does not calculate build stats. The validation requirements below describe the complete O-04 contract, including that remaining work.

An export has `source`, `version`, `relics`, and optional `characters`, `light_cones`, `metadata`. A websocket-style `InitialScan` envelope may contain the same export in `data`, if supported by the importer. Supporting the envelope does not imply a live websocket integration exists.

A relic contains:

```json
{
  "set_id": "102",
  "name": "Musketeer of Wild Wheat",
  "slot": "Hands",
  "rarity": 5,
  "level": 15,
  "mainstat": "ATK",
  "substats": [{ "key": "CRIT Rate_", "value": 5.1 }],
  "preview_substats": [],
  "location": "",
  "lock": false,
  "discard": false,
  "_uid": "relic_1"
}
```

The sample illustrates the shape only, not a personal inventory. `location` is the character ID or empty for unequipped items. Percent substat keys use an underscore suffix. Main HP/ATK/DEF is flat for Head/Hands and percentage on Body/Feet/Sphere/Rope. The main-stat amount is derived from rarity, slot, and level unless the supported schema explicitly carries it.

## Validation and precision

- Parse as unknown data; validate shape, slots, rarity/level bounds, numbers, main-stat compatibility, active substats, and character/Light Cone references.
- Keep fractional SPD and other values as imported. Never round before calculation or infer hidden decimals from OCR.
- Unknown set/character names may remain importable with their original IDs/name; missing calculation data must be disclosed. Unknown stat types need a deliberate supported extension or a record-level error, not silent omission.
- `preview_substats` are future unrevealed stats and are not active. `reroll_substats` are a separate alternative, not an automatic replacement.
- Preserve identical relics as separate records. A repeated external ID must be detected and resolved deliberately; scanner index IDs are not game identities.
- Full validation occurs before replacing the active inventory. An invalid record aborts the import and leaves the previous workspace available.
- Set a file-size and record-count limit with a user-visible error. Keep accepted limits documented in the implementation and tests.

## Precision labels

Reliquary Archiver exports packet-derived values, including hidden SPD decimals. Kel-Z uses OCR, which cannot read hidden SPD decimals. Unknown source names must not be labeled exact. Backup import preserves the original precision label.

## State replacement and backups

O-04a stores a schema-1 `orbit-inventory` backup string in IndexedDB database `orbit-workspace`, store `workspace`, key `inventory`. A backup wraps the normalized relics reserialized into the supported scanner shape; parsing derives precision again from the original source. Preview never writes storage. Replacement updates React only after transaction completion; failed validation or writes preserve prior inventory. Backup download contains only supported inventory fields, not the full scanner export. Clearing browser data removes the workspace; download backups first. Imported collections use 48 items per page. No saved builds exist yet.

A new import replaces the active inventory only after validation and persistence succeed. Saved comparison builds should remain snapshots, or the UI must explicitly explain and confirm their reset. Do not silently repoint an old saved build to a different item with the same array index. Backups are versioned Orbit data and exclude unrelated gacha/material fields.

Do not treat Enka JSON, a Fribbels save format with a different schema, or a new scanner export version as compatible merely because it contains a `relics` field. Add explicit adapters with fixtures when another format is supported.
