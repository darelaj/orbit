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

The upstream repository publishes an AGPL-3.0 LICENSE, preserved verbatim as public/assets/hsr/StarRailRes-LICENSE.txt. Game imagery belongs to HoYoverse and its respective owners; Orbit does not claim ownership or official affiliation. The app footer links the source and identifies the game-asset attribution. No external source code, font, generated character art, or custom logo was bundled for this redesign.

Character/relic identity and English names were checked against the pinned index_new/en/characters.json and relics.json. The eight item instances and their numeric stats in src/app/demo.ts are synthetic UI fixtures. They are not game catalogue calculations, personal account records, or a verified build.

Typography uses installed Bahnschrift/Arial Narrow with Segoe UI/system fallbacks. No font files are redistributed. A missing image is replaced by a labeled, size-preserving fallback.
