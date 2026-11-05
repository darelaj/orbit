# Research record

Research date: 2026-11-05. Sources are community services or wrappers unless otherwise stated. Endpoint availability and schema compatibility need checking when integrations change.

## Enka

- Website and API for publicly showcased character builds across Genshin, HSR, ZZZ, and Endfield: [Enka](https://enka.network/).
- HSR UID endpoint: `https://enka.network/api/hsr/uid/{UID}/`.
- A direct test returned HTTP 200, root fields `detailInfo`, `ttl`, `uid`, `owner`, `region`, and 8 showcase characters. The first character had 6 relics. This confirms showcase access, not full inventory.
- Cache according to `ttl`, send a custom User-Agent, handle dynamic rate limiting, and do not enumerate UIDs: [API rules](https://github.com/EnkaNetwork/API-docs/blob/master/api.md).
- Saved profile builds may be manually refreshed snapshots. `live: true` does not guarantee an automatically current build.

## Full HSR inventory

- [Reliquary Archiver](https://github.com/IceDynamix/reliquary-archiver) exports inventory from game network packets. Its JSON is based on the Kel-Z format and retains SPD decimals.
- [Kel-Z HSR Scanner](https://github.com/kel-z/HSR-Scanner) uses OCR and exports inventory JSON. Hidden SPD decimals are unavailable. Scanner filters can intentionally omit lower-level/rarity items; Orbit cannot restore items absent from a source export.
- [Fribbels](https://fribbels.github.io/hsr-optimizer/) documents full-inventory imports for both scanners; its Enka profile import covers showcase, and HoYoLAB import covers equipped character relics.
- Reliquary JSON separates active `substats`, `preview_substats`, and `reroll_substats`: [export models](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/models.rs).

## Alternative APIs

- [MiHoMo](https://march7th.xyz/en/api/) offers HSR public-player raw and parsed APIs, not full unequipped inventory.
- [genshin.py](https://seria.is-a.dev/genshin.py/) exposes HoYoLAB data for HSR/ZZZ with authentication and privacy-dependent scope.
- [SKPORT community docs](https://github.com/AixLnyt/skport-api-docs) describe authenticated Endfield account data.
- [Arenyze](https://docs.arenyze.com/endfield) offers Endfield profile and game-data endpoints with an API key. Independence from Enka has not been verified.

## Catalogue sources investigated

- [StarRailRes](https://github.com/Mar-7th/StarRailRes) has broad current HSR data and an AGPL license. It has not been selected for inclusion in this new project.
- [Kel-Z HSR-Data](https://github.com/kel-z/HSR-Data) includes scanner constants, base/ascension data, and Trace mappings under its Unlicense notice. The inspected `game_data_verbose.json` identifies version 2.7.0; it is not a complete current-character catalogue. Missing/new records must use manual profiles or a separately reviewed data update.
- The earlier prototype combined source files without completed validation. Do not use its snapshot as evidence of accurate calculations or selected licensing.
