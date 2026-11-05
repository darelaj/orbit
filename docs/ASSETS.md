# Visual asset sources

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

## Figma SVGs

The owner supplied [the Orbit Figma design](https://www.figma.com/design/pVMHEP3S3rp9vMRIlfoeUp/Untitled?node-id=2-2698). SVGs were exported from the high-fidelity desktop dark/light contexts (2:2698 and 2:3063), downloaded as instructed by the connector, and preserved verbatim under public/assets/figma. No temporary Figma URL is referenced at runtime. The export payload did not include a separate icon license; no upstream authorship/license is invented here.

| Files | Role and root geometry |
| --- | --- |
| dark-imgMoon.svg, light-imgSun.svg | Theme state, 18x18 |
| dark-imgSearch.svg, light-imgSearch.svg | Search field, 18x18 |
| dark-imgLockKeyhole.svg, light-imgLockKeyhole.svg | Locked card state, 13x13 |
| dark-imgLockOpen.svg, light-imgLockOpen.svg | Unlocked card/detail state, 13x13 |
| dark-imgLockKeyhole1.svg, light-imgLockKeyhole1.svg | Locked inspector state, 16x16 |

FigmaIcon in Equipment.tsx chooses the supplied theme variant through CSS and retains each SVG's original dimensions. No icon package, redrawn SVG path, filter-based recoloring, or externally hosted image is used.

## Local fonts

The Figma font families are bundled as original Latin-subset WOFF2 files. They were obtained through the Google Fonts CSS API on 2026-11-06; the versioned download URLs below are provenance, not runtime dependencies.

| Local file | Source URL |
| --- | --- |
| rajdhani-latin-600.woff2 | https://fonts.gstatic.com/s/rajdhani/v17/LDI2apCSOBg7S-QT7pbYF_Oreec.woff2 |
| inter-latin-variable.woff2 | https://fonts.gstatic.com/s/inter/v20/UcC73FwrK3iLTeHuS_nVMrMxCp50SjIa1ZL7.woff2 |
| ibm-plex-mono-latin-400.woff2 | https://fonts.gstatic.com/s/ibmplexmono/v20/-F63fjptAgt5VM-kVkqdyU8n1i8q1w.woff2 |
| ibm-plex-mono-latin-500.woff2 | https://fonts.gstatic.com/s/ibmplexmono/v20/-F6qfjptAgt5VM-kVkqdyU8n3twJwlBFgg.woff2 |

All three families use SIL Open Font License 1.1. Copyright/license files are preserved beside the fonts as rajdhani-OFL.txt, inter-OFL.txt, and ibmplexmono-OFL.txt, from [google/fonts](https://github.com/google/fonts/tree/24ddc1f324cac5d9f5aedca126d298f56e3f1640/ofl) commit 24ddc1f324cac5d9f5aedca126d298f56e3f1640. The notices identify Indian Type Foundry, The Inter Project Authors, and IBM Corp. respectively. System fallbacks cover unsupported glyphs; this is not a claim of bundled multilingual font coverage.

## O-04b inventory catalogue

`scripts/fetch-catalogue.mjs` reproducibly retrieves data at the same pinned StarRailRes commit above. `src/data/relic-main-affixes.json` retains its main-affix groups; `src/data/relic-catalogue.json` projects English item names and icon filenames keyed by set ID and slot. The 192 distinct icons from `icon/relic/` are bundled under `public/assets/hsr/relic/`. The existing upstream license and HoYoverse attribution apply. No runtime remote asset requests are introduced. Unknown set/slot records remain importable with an explicit artwork fallback.
