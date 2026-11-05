# O-03b Figma implementation verification

Layout/interaction evidence for O-03b. The subsequent English-primary UI request is verified in [VERIFICATION.md](VERIFICATION.md); Indonesian labels quoted here belong to the earlier revision.

Recorded 2026-11-06 on Windows at http://127.0.0.1:4173. This report supersedes the O-03a walkthrough for the current UI. Scope is the Figma-based synthetic demo plus the owner-approved revisions in FIGMA_HANDOFF.md. No real-account/import/calculation/optimizer/timeline acceptance is inferred.

## Executed verification

- Final commands: npm.cmd run typecheck; npm.cmd test (6 component tests); npm.cmd run build. Each passed for the final source revision.
- All eight cards were clicked individually. Selection updated the matching main/substats, ownership, lock state, and position in the inspector. The two Body examples retained separate identities and main stats.
- All six equipment selectors were clicked. Each chose the equipped example while the collection remained 8 of 8. With query Izumo active, Head selection preserved the query and its two results, displayed Di luar hasil, and offered Tampilkan relic terpilih. That action restored all eight without losing selection.
- Slot filters produced Head=1, Hands=1, Body=2, Feet=2, Sphere=1, Rope=1, all=8. Lock filters produced locked=6, unlocked=2, all=8. Body plus unlocked returned one item; selecting it showed position 01 / 01.
- Unmatched text produced 0 of 8 with a useful no-results action. Tampilkan semua relic restored the collection. Search matched the Izumo set. Component tests additionally cover composed search/filters and recovery.
- Slot reverse ordering put Rope first and Head last; the inspector position tracked the visible sort order. Default equipped-first ordering and both slot directions are native select options. Reset restored query/slot/lock/order defaults and became disabled with no active changes.
- Keluar demo removed character/inventory controls and showed scanner preparation. Both Buka demo and Jelajahi demo restored the example. There is no active file-import control.
- Panduan scanner opened a native dialog containing both scanner repository links. Escape worked and focus returned to the invoking guide button; its unchanged native-close button wiring was inspected. Local wordmark and Inventaris anchors worked. External hrefs were inspected; external new-tab rendering was not part of this walkthrough.
- At 390x844, equipment activation with Enter opened the full-height native detail dialog, measured 390x844. All four stats were available, one Kembali ke koleksi action was present, and Close/Escape returned focus to the invoking equipment/card. Source disclosure expanded to the selected example's ID and explanation.
- Skip navigation with Enter focused main. Visible controls and the source disclosure had focus outlines and targets at least 44px. Native modal behavior was reused; no custom focus trap or fake navigation was introduced.
- Dark and light persisted across reload. Text-pair inspection after final corrections found minima about 7.21:1 dark and 4.54:1 light at 1440px. Disabled controls were excluded. Light secondary text on the selected surface improved from about 4.38:1 to 4.65:1. These scoped measurements are not an accessibility certification.
- Widths 320, 390, 520, 703, 1024, 1280, 1440, and 1800 were inspected for document overflow, visible control bounds, and text-pair failures. None were found. At 1280px, first-card Y was about 534px; at 1440px about 526px. At 390px, first-card Y was about 589px, card height 227px, page height 2578px.
- Compared the rendered desktop with the Figma reference: palette/type, character/relic imagery, slot order, main-stat hierarchy, selected framing, and inspector are retained. The density, disclosures, controls, and responsive geometry differ deliberately as documented in FIGMA_HANDOFF.md.
- All seven original PNGs matched Figma-exported image-reference hashes. Visible original SVGs rendered at their root dimensions (13/16/18px); game images retained square geometry. Restored normal-state images were loaded with nonzero natural dimensions.
- Temporarily withheld Acheron and Body PNGs, reloaded, and observed named character/detail fallbacks with statistics intact. Banner remained 128px, cards 299px, and no overflow appeared. Both original files were restored before final checks. Decorative fallback semantics are covered by a component test.
- Final restored-page console inspection contained no error/warning entries after the recorded fresh-check timestamp. Deliberate missing-image checks occurred before it. Font files and all image/icon assets are local; the app has no temporary Figma URLs or runtime font/image CDN references.
- Reduced-motion CSS disables nonessential animation/transition. Host preference was false; no OS preference change was performed. The implementation has no continuous motion or animated numeric counting.

Screenshots are ignored local artifacts in .cache/figma-polish/: desktop-dark.jpg, desktop-light.jpg, mobile-dark.jpg, mobile-light.jpg, mobile-detail-dark.jpg, and mobile-detail-light.jpg. Desktop artifacts show the page; mobile artifacts show the viewport. Temporary viewport overrides were reset to the original 703px surface. The owned verification server was stopped after the walkthrough.

## Antislop delivery gate

Design read: owner-supplied HSR equipment workspace, ENERGY 2 / RHYTHM 2 / MOTION 2. This pass concerns the implemented demo interface, not unfinished product workflows.

| Hard gate | Result and evidence |
| --- | --- |
| R-02 text | PASS: authored source/docs checked for em dashes; upstream notices preserved separately. |
| R-03 overflow | PASS: eight tested widths above; no document overflow. |
| R-17 statistics | PASS: visible values are explicitly synthetic; result counts derive from the filtered fixtures. |
| R-18 testimonials | PASS: no fabricated customers/testimonials. |
| R-23 assets | PASS: owner authorized the Figma reference and real game art; exact image matches, original SVGs, and source/font notices are retained. |
| R-24 navigation | PASS: local anchors exercised; external repository hrefs inspected; no links to unimplemented product views. |
| R-25 contrast | PASS: final light/dark text-pair measurements and correction above; no text opacity fade. |
| R-26 controls | PASS: all card/equipment selections, filter/sort/reset/exit/entry actions, guide, return action, and source disclosure exercised. |
| R-27 states | PASS: synchronous demo, hidden selection, no results, empty workspace, artwork failure, and theme-storage warning are represented; import remains pending. |
| R-28 FAQ | PASS: no generic FAQ. |
| R-32 keyboard | PASS: skip, Enter, Escape, focus return, and native modal behavior checked. |
| R-33 implementation | PASS: authored React/CSS source; Figma prototype code adapted to existing components without runtime patching. |
| R-34 themes | PASS: both modes visually checked, toggled, measured, and reloaded. |
| R-35 execution | PASS: typecheck/tests/build and browser walkthrough above; external new-tab verification is not claimed. |
| R-36 claims | PASS: no simulated-DPS, optimization, security, or performance certification claims. |
| R-37 direction | PASS: owner supplied Figma and explicitly authorized the review revisions before implementation. |
| R-38 content | PASS: synthetic boundaries remain visible; no fake account or UID. |
| R-39 affordances | PASS: semantic controls, labels/names, focus, 44px bounds, and reduced-motion rule; existing document language/title/viewport retained. |
| R-40 media | PASS: reserved image dimensions, high-priority character art, local assets/fonts, no blocking third-party script or fabricated performance score. |

| Purpose gate | Result and reason |
| --- | --- |
| R-01 gradient | PASS: one contained character veil protects labels beside the portrait. |
| R-04 icons | PASS: supplied Figma search/theme/lock vectors identify real functions/state, with original geometry. |
| R-06 typography | PASS: supplied Rajdhani/Inter/IBM Plex Mono roles match headings, prose, and aligned stats. |
| R-07 background | PASS: no decorative grid/pattern. |
| R-08 arrows | PASS: native select disclosure carries interaction meaning; no decorative arrows on every action. |
| R-09 badges | PASS: compact demo provenance label states that the visible collection is synthetic. |
| R-10 glass | PASS: opaque reading surfaces; no backdrop blur. |
| R-12 shadows | PASS: only native dialogs use elevation shadows. |
| R-13 glow | PASS: no glow treatment. |
| R-14 cards | PASS: equivalent equipment objects share a consistent layout and stable stat order. |
| R-19 motion | PASS: 140ms border state and 160ms detail position transition; numbers are replaced directly. |
| R-22 illustrations | PASS: original artwork corresponds to Acheron, the selected demo context. |

| Liveliness and craftsmanship | Result and evidence |
| --- | --- |
| Explicit dials / design read | PASS: Figma equipment reference and 2/2/2 direction recorded before edits. |
| Dial consistency | PASS: contained character context, equipment row, dense cards, inspector; short user-triggered motion only. |
| Focal point | PASS: selected equipment/card frame and inspector share the same item and dominant main stat. |
| Structural whitespace | PASS: compact context before the collection; readable separation inside the inspector. |
| Accent / motif | PASS: gold selection/rarity plus repeated six-slot equipment identities. |
| C-1 / R-31 intention | PASS: retained and revised choices documented in FIGMA_HANDOFF.md and DESIGN.md. |
| C-2 completeness | PASS: real outcomes for implemented controls; unavailable product features omitted. |
| C-3 / R-05 composition | PASS: equipment work area rather than a marketing/dashboard template. |
| C-4 resilience | PASS: two themes, responsive widths, empty/hidden/image-error states, keyboard and modal flows checked. |
| C-5 evidence | PASS: source/synthetic boundaries, measurements, and verification limits are explicit. |
| R-11 radii | PASS: role-based control/card/banner/dialog radii remain restrained. |
| R-15 / R-16 copy | PASS: concrete Indonesian actions and concise explanations. |
| R-20 identity | PASS: supplied wordmark, condensed headings, real HSR imagery, six slots, selected relic stats. |
| R-21 themes | PASS: both requested modes implemented equally. |
| R-29 palette | PASS: supplied neutral/gold tokens plus keyboard focus color; original art colors retained. |
| R-30 reference | PASS: owner explicitly requested the supplied Figma/HSR equipment direction. |
