# Sources and notices

This is the maintained provenance record for assets, constants, scanner integration and repository skills. Read only the relevant section. Preserve upstream notices; this file does not select a project-wide license. Historical research is dated and must be rechecked before a new integration.

## Asset and font sources

The HSR equipment demo uses actual game artwork from the community-maintained [Mar-7th/StarRailRes](https://github.com/Mar-7th/StarRailRes) repository, pinned to commit `dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487` (retrieved 2026-11-06).

Files are served locally from public/assets/hsr; no external image/font CDN is contacted at runtime.

| Local file | Upstream path at the pinned commit | Use |
| --- | --- | --- |
| 1308.png | image/character_portrait/1308.png | Acheron, the explicitly labeled demo character |
| 117_0.png | icon/relic/117_0.png | Pioneer's Heatproof Shell |
| 117_1.png | icon/relic/117_1.png | Pioneer's Lacuna Compass |
| 117_2.png | icon/relic/117_2.png | Pioneer's Sealed Lead Apron |
| 117_3.png | icon/relic/117_3.png | Pioneer's Starfaring Anchor |
| 314_0.png | icon/relic/314_0.png | Izumo's Magatsu no Morokami |
| 314_1.png | icon/relic/314_1.png | Izumo's Blades of Origin and End |

Source URL pattern: https://raw.githubusercontent.com/Mar-7th/StarRailRes/dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487/{upstream-path}.

The upstream repository publishes an AGPL-3.0 LICENSE, preserved verbatim as public/assets/hsr/StarRailRes-LICENSE.txt. Game imagery belongs to HoYoverse and its respective owners; Orbit does not claim ownership or official affiliation. The app footer links asset/source notices. No upstream application code, generated character art, or custom logo was bundled.

Character/relic identity and English names were checked against the pinned index_new/en/characters.json and relics.json. The eight item instances and their numeric stats in src/app/demo.ts are synthetic UI fixtures. They are not game catalogue calculations, personal account records, or a verified build.

In O-03b, all seven game PNGs were compared with the owner-supplied Figma image exports and matched SHA-256 file hashes exactly. They are reused through data-driven image props without duplication. Relic files are 128x128; the character portrait is 2048x2048. A missing image has a labeled, size-preserving fallback.

### Figma SVGs

The owner supplied [the Orbit Figma design](https://www.figma.com/design/pVMHEP3S3rp9vMRIlfoeUp/Untitled?node-id=2-2698). SVGs were exported from the high-fidelity desktop dark/light contexts (2:2698 and 2:3063), downloaded as instructed by the connector, and preserved verbatim under public/assets/figma. No temporary Figma URL is referenced at runtime. The export payload did not include a separate icon license; no upstream authorship/license is invented here.

| Files | Role and root geometry |
| --- | --- |
| dark-imgMoon.svg, light-imgSun.svg | Theme state, 18x18 |
| dark-imgSearch.svg, light-imgSearch.svg | Search field, 18x18 |
| dark-imgLockKeyhole.svg, light-imgLockKeyhole.svg | Locked card state, 13x13 |
| dark-imgLockOpen.svg, light-imgLockOpen.svg | Unlocked card/detail state, 13x13 |
| dark-imgLockKeyhole1.svg, light-imgLockKeyhole1.svg | Locked inspector state, 16x16 |

FigmaIcon in Equipment.tsx chooses the supplied theme variant through CSS and retains each SVG's original dimensions. No icon package, redrawn SVG path, filter-based recoloring, or externally hosted image is used.

### Local fonts

The Figma font families are bundled as original Latin-subset WOFF2 files. They were obtained through the Google Fonts CSS API on 2026-11-06; the versioned download URLs below are provenance, not runtime dependencies.

| Local file | Source URL |
| --- | --- |
| rajdhani-latin-600.woff2 | https://fonts.gstatic.com/s/rajdhani/v17/LDI2apCSOBg7S-QT7pbYF_Oreec.woff2 |
| inter-latin-variable.woff2 | https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2 |
| ibm-plex-mono-latin-400.woff2 | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2 |
| ibm-plex-mono-latin-500.woff2 | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2 |

All three families use SIL Open Font License 1.1. Copyright/license files are preserved beside the fonts as rajdhani-OFL.txt, inter-OFL.txt, and ibmplexmono-OFL.txt, from [google/fonts](https://github.com/google/fonts/tree/24ddc1f324cac5d9f5aedca126d298f56e3f1640/ofl) commit 24ddc1f324cac5d9f5aedca126d298f56e3f1640. The notices identify Indian Type Foundry, The Inter Project Authors, and IBM Corp. respectively. System fallbacks cover unsupported glyphs; this is not a claim of bundled multilingual font coverage.

### O-04b inventory catalogue

`scripts/fetch-catalogue.mjs` reproducibly retrieves data at the same pinned StarRailRes commit above. `src/data/relic-main-affixes.json` retains its main-affix groups; `src/data/relic-catalogue.json` projects English item names and icon filenames keyed by set ID and slot. The 192 distinct icons from `icon/relic/` are bundled under `public/assets/hsr/relic/`. The existing upstream license and HoYoverse attribution apply. No runtime remote asset requests are introduced. Unknown set/slot records remain importable with an explicit artwork fallback.

O-05 additionally bundles index_new/en/relic_sets.json at the same StarRailRes pin, using scripts/fetch-sets.mjs. Existing upstream license/attribution apply. Acheron's existing portrait is reused for an explicitly declared Acheron manual profile; no new artwork or runtime CDN was introduced.

## Character profile catalogue

O-11c adds `src/data/stat-profiles.json`, reproducibly projected by `node scripts/fetch-profiles.mjs` from `index_new/en/characters.json`, `character_promotions.json`, `character_skill_trees.json`, `light_cones.json` and `light_cone_promotions.json` at the same StarRailRes commit above. The existing AGPL notice/attribution applies; no new imagery, dependency or runtime download is introduced. Initial reviewed character IDs are 1001 (March 7th Preservation), 1101 (Bronya), 1308 (Acheron); the 170 pinned Light Cone entries supply base growth only, not passives.

Scanner-to-catalogue Path names and Point06–18 → major/minor Trace fields were checked against pinned Reliquary v0.19.0 [utils](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/utils.rs) and [converters](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/converters.rs). Nodes map by explicit anchor, with source prerequisites/level/ascension retained, not list ordering. Character/Light Cone growth uses catalogue `base + (level - 1) * step`. Imported `ability_version` is retained but its equivalence to this baseline catalogue is unverified; using the baseline model requires an explicit UI choice. Unknown forms/paths, missing progression and unresolved/special kits remain manual. This is not a claim of full current-game coverage or owner stat matching.

## Project skills

Skills live in `.agents/skills` so their source and changes can be reviewed with the project. The official Codex skill-installer installed upstream folders with pinned `--ref` commits and a repository-local `--dest`. Repository copies are discoverable on the next turn/session; the current session read their instructions directly.

| Folder | Upstream | Pinned commit | Role |
| --- | --- | --- | --- |
| `antislop` | [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) | `9504989f162a92b1996853eccbb3d8a86e73df68` | UI direction, honesty, functional delivery gate |
| `antislop-ui` | same | same | Layout, contrast, themes, interaction |
| `antislop-copywriting` | same | same | Specific product text and natural prose |
| `antislop-code` | same | same | Comment hygiene; changes comments only when invoked for comment cleanup |
| `karpathy-guidelines` | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | `2c606141936f1eeef17fa3043a72095b4765b9c2` | Explicit assumptions, simple code, scoped changes, verifiable goals |
| `react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | Relevant client-side React, rendering, data and bundle guidance |
| `hsr-calculation-integrity` | Authored for Orbit | tracked in this repository | Inventory precision, stat math, search guarantees, AV boundaries |

The Karpathy package is community-maintained guidance inspired by Andrej Karpathy's observations. It is not presented as an official package authored by Karpathy. The original `forrestchang` repository redirects to `multica-ai`.

### Application

The owner selected antislop DURING in this build session. Both themes are requested. `DESIGN.md` records the design read and reasons. Future sessions resolve their mode according to the upstream skill; no global preference has been changed.

Apply React guidance relevant to a Vite client. Do not introduce Next.js, server actions, a cloud deployment, or extra caching libraries just because an upstream example uses them.

Keep upstream files intact. Record local overrides in AGENTS.md and project docs. Updating a skill is a separate reviewable task: inspect the upstream diff, update the pin, install, read, and validate before changing application behavior.

### Notices and validation

Antislop is MIT-licensed; its root notice is preserved at `third_party/antislop-LICENSE.txt`, along with bundled notices inside the installed skill folders. Karpathy and React skills declare MIT in their original SKILL.md metadata; those files are preserved. No project-wide license has been selected on the owner's behalf.

All seven skills passed the Codex `skill-creator/scripts/quick_validate.py` helper on 2026-11-05. Re-run it when adding or changing a skill. The consolidation only updates the local HSR skill's contract path; upstream skill files and pins remain unchanged. Upstream React guidance includes trailing whitespace; preserve the upstream copy and exclude vendor files from project-owned whitespace checks. Do not silently rewrite upstream instructions to satisfy a superficial check.

## Scanner and import sources

The integrated reader is Reliquary Archiver v0.19.0, pinned by URL, size and SHA-256 in code; see [scanner contract](TECHNICAL.md#scanner). Preserve [its MIT notice](../server/RELIQUARY-LICENSE.txt).

- [Release](https://github.com/IceDynamix/reliquary-archiver/releases/tag/v0.19.0), [CLI/privileges](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/main.rs), [export/initialization](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/exporter.rs), [Packet Monitor](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/capture/pktmon.rs), [license](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/LICENSE).
- Schema adapters were inspected on 2026-11-06: [export model](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/models.rs), [converters](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/converters.rs), [source/version](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/exporter.rs), [stat/slot conversion](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/utils.rs), [Kel-Z schema examples](https://github.com/kel-z/HSR-Scanner#output). Moving upstream links describe the research source, not automatic adapter compatibility.

## Research record

Research date: 2026-11-05. Sources are community services or wrappers unless otherwise stated. Endpoint availability and schema compatibility need checking when integrations change.

### Enka

- Website and API for publicly showcased character builds across Genshin, HSR, ZZZ, and Endfield: [Enka](https://enka.network/).
- HSR UID endpoint: `https://enka.network/api/hsr/uid/{UID}/`.
- A direct test returned HTTP 200, root fields `detailInfo`, `ttl`, `uid`, `owner`, `region`, and 8 showcase characters. The first character had 6 relics. This confirms showcase access, not full inventory.
- Cache according to `ttl`, send a custom User-Agent, handle dynamic rate limiting, and do not enumerate UIDs: [API rules](https://github.com/EnkaNetwork/API-docs/blob/master/api.md).
- Saved profile builds may be manually refreshed snapshots. `live: true` does not guarantee an automatically current build.

### Full HSR inventory

- [Reliquary Archiver](https://github.com/IceDynamix/reliquary-archiver) exports inventory from game network packets. Its JSON is based on the Kel-Z format and retains SPD decimals.
- [Kel-Z HSR Scanner](https://github.com/kel-z/HSR-Scanner) uses OCR and exports inventory JSON. Hidden SPD decimals are unavailable. Scanner filters can intentionally omit lower-level/rarity items; Orbit cannot restore items absent from a source export.
- [Fribbels](https://fribbels.github.io/hsr-optimizer/) documents full-inventory imports for both scanners; its Enka profile import covers showcase, and HoYoLAB import covers equipped character relics.
- Reliquary JSON separates active `substats`, `preview_substats`, and `reroll_substats`: [export models](https://github.com/IceDynamix/reliquary-archiver/blob/main/src/export/fribbels/models.rs).

### Alternative APIs

- [MiHoMo](https://march7th.xyz/en/api/) offers HSR public-player raw and parsed APIs, not full unequipped inventory.
- [genshin.py](https://seria.is-a.dev/genshin.py/) exposes HoYoLAB data for HSR/ZZZ with authentication and privacy-dependent scope.
- [SKPORT community docs](https://github.com/AixLnyt/skport-api-docs) describe authenticated Endfield account data.
- [Arenyze](https://docs.arenyze.com/endfield) offers Endfield profile and game-data endpoints with an API key. Independence from Enka has not been verified.

### Catalogue sources investigated

- [StarRailRes](https://github.com/Mar-7th/StarRailRes) has broad current HSR data and an AGPL license. This was an initial research note; Orbit subsequently selected the pinned relic assets/constants described above. It does not supply automatic character stat profiles.
- [Kel-Z HSR-Data](https://github.com/kel-z/HSR-Data) includes scanner constants, base/ascension data, and Trace mappings under its Unlicense notice. The inspected `game_data_verbose.json` identifies version 2.7.0; it is not a complete current-character catalogue. Missing/new records must use manual profiles or a separately reviewed data update.
- The earlier prototype combined source files without completed validation. Do not use its snapshot as evidence of accurate calculations or selected licensing.
