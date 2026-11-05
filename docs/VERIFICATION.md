# O-03a equipment UI verification

Historical report. The current O-03b Figma implementation is verified in [FIGMA_VERIFICATION.md](FIGMA_VERIFICATION.md); use that report for current controls, assets, measurements, and delivery gate.

Recorded 2026-11-06, Windows, at http://127.0.0.1:4173. This verifies the HSR equipment redesign using synthetic demo fixtures. It does not verify a real inventory, importer, stat calculator, comparison, optimizer, or speed timeline. Those controls are not presented as available.

Direction: the owner's HSR character/relic equipment reference; ENERGY 2 / RHYTHM 2 / MOTION 2. The two themes use the palette/type proposals in DESIGN.md. Owner visual acceptance is still pending.

## Executed checks

- npm.cmd run typecheck, npm.cmd test (4 component tests), and npm.cmd run build passed for the final source revision.
- Eight card selections were clicked individually. Every card became pressed and the detail ledger showed its own demo ID, owner, and lock state. Identical item names retained distinct IDs.
- All six equipment shortcuts were clicked. Head/Feet returned two matching items; the other slots returned one. Each shortcut selected the equipped example for that slot.
- Slot=Feet plus Hanya terkunci returned one item; unmatched search returned zero plus a useful empty state. Tampilkan semua relic restored all eight. Searching izumo returned two. Reset filter restored defaults and was disabled when no filter was active.
- Keluar demo removed the character artwork and collection controls, showing six empty equipment positions and the explicit import limitation. Both Jelajahi demo actions restored the demo. It is labeled synthetic, without a UID or personal account claims.
- Panduan scanner and Cara menyiapkan ekspor opened the same native dialog. Close and Escape worked. Escape restored focus to the invoking control. Two scanner links expose their real repository URLs and the guide labels import/calculation features as pending.
- At 390px, a slot shortcut was activated with Enter. Detail opened as a modal, contained the selected relic, and fit the viewport (358px wide, about 771px high in an 844px viewport). Close and Escape worked; focus returned to the invoking item/slot.
- Modal Tab moved through the browser focus cycle rather than activating background controls. Shift+Tab returned to the modal close control. Skip navigation with Enter focused main; focused controls had a visible solid outline.
- Wordmark and Inventory relic navigated to #inventory. All four external links were activated and their hrefs checked. The in-app browser did not expose separate tabs for those activations, so new-tab rendering is not claimed as verified.
- Dark persisted across reload; light persisted across reload. Immediate post-switch/reload contrast inspection was repeated after removing background-color transitions and applying the stored theme before paint.
- Desktop light/dark and mobile light/dark were visually inspected. Additional layout checks covered 320, 520, 703, 1024, 1440, and 1800px widths. No document overflow was measured. Visible buttons/links/fields met 44px bounds; the checkbox's associated label provides its 44px target.
- Computed foreground/background text-pair checks at 1440px: minimum 4.64:1 light and 6.54:1 dark, with disabled controls excluded. Checked item selection and modal/empty layouts as applicable. This is scoped contrast evidence, not an accessibility certification.
- Withheld only the local Acheron file temporarily, reloaded, and observed Artwork tidak tersedia in the same reserved-height area. Restored the original file and reloaded; artwork loaded at its original 2048px width. The missing-image event is also covered by a component test.
- Final restored-page console inspection returned no error/warning entries after the fresh-check timestamp. The deliberate missing-artwork check is excluded from that final normal-state observation.
- Reduced-motion CSS disables nonessential transitions/animation. The host preference was false; an OS-level preference change was not performed. No continuous animation is present.

Local screenshots (ignored artifacts, not repository inputs): .cache/ui-redesign/desktop-dark.jpg, desktop-light.jpg, mobile-dark.jpg, mobile-light.jpg, and mobile-detail.jpg. Temporary viewport overrides were reset. The owned Vite verification session was stopped after the walkthrough so the owner can run the app from their terminal.

## Antislop delivery gate

Scope: the implemented demo interface. Planned import/search/timeline acceptance is not inferred from this UI pass. Each row records PASS with evidence; unrelated planned workflows remain in IMPLEMENTATION_PLAN.md.

| Hard gate | Status and evidence |
| --- | --- |
| R-02 text | PASS: authored UI/docs checked for em dashes; none added. |
| R-03 overflow | PASS: measured document widths at the seven sizes above. |
| R-17 statistics | PASS: only clearly labeled synthetic item values and derived demo result counts are displayed. |
| R-18 testimonials | PASS: no testimonials or customer identities exist. |
| R-23 assets | PASS: owner authorized character/splash art; actual Acheron/relic files and preserved source license are recorded in ASSETS.md; no invented logo. |
| R-24 navigation | PASS: both local anchors were exercised; external hrefs target real repositories; no unavailable feature links. |
| R-25 contrast | PASS: scoped computed-pair measurements above, with opaque stat surfaces and no text fade. |
| R-26 controls | PASS: card/slot selections, filters, resets, theme, demo transitions, and dialog controls were exercised. |
| R-27 states | PASS: synchronous demo, filtered-empty, empty workspace, image error, and theme-storage warning are represented; no nonexistent async import is implied. |
| R-28 FAQ | PASS: no generic FAQ exists. |
| R-32 keyboard | PASS: skip/Enter, dialog Escape, focus return, and native modal browser-focus behavior checked. |
| R-33 implementation | PASS: UI is authored in React components and stylesheet; no runtime patching script. |
| R-34 themes | PASS: both themes visually checked, toggled, and reloaded. |
| R-35 execution | PASS: build/tests and walkthrough recorded above; external new-tab observation limit is explicit. |
| R-36 claims | PASS: no security, damage, optimization, or performance certification claims. |
| R-37 direction | PASS: owner reference and 2/2/2 dials recorded before implementation. |
| R-38 content | PASS: demo labels remain adjacent to item context and details; no fabricated account/profile. |
| R-39 native affordances | PASS: native buttons/inputs/select/dialogs, names/labels, focus states, reduced-motion rule, and 44px targets; index.html has id language/title/viewport. |
| R-40 media | PASS: explicit image dimensions and reserved containers; character artwork has high fetch priority; no third-party font/script/CDN or invented performance score. |

| Purpose gate | Status and written reason |
| --- | --- |
| R-01 gradients | PASS: only the contained character-art fade protects its boundary with the identity area. |
| R-04 icons | PASS: game item icons identify equipment; theme mark identifies the theme switch. No generic icon library. |
| R-06 type | PASS: installed Bahnschrift/Arial Narrow adds equipment-screen character; Segoe UI and tabular numbers support measurements. |
| R-07 backgrounds | PASS: no decorative background grid/pattern. |
| R-08 arrows | PASS: no decorative button arrows. |
| R-09 badges | PASS: Demo sintetis is a plain provenance label, not a decorative capsule. |
| R-10 glass | PASS: opaque reading panels; no backdrop blur. |
| R-12 shadows | PASS: shadow only elevates native dialogs over the workspace. |
| R-13 glow | PASS: no glow treatment. |
| R-14 cards | PASS: repeated cards represent equivalent relic objects, with stable stat ordering and selection. |
| R-19 motion | PASS: selection border transition 140ms, detail position transition 180ms; full text opacity and no counting values. |
| R-22 illustrations | PASS: real artwork belongs to the explicitly selected demo character. |

| Liveliness | Status and evidence |
| --- | --- |
| Explicit dials and design read | PASS: HSR equipment workspace, balanced density, 2/2/2 recorded in DESIGN.md. |
| Dial consistency | PASS: character anchor, relic collection, detail ledger; short user-driven transitions only. |
| Focal point | PASS: selected equipment gets a gold frame and the corresponding readable stat ledger. |
| Whitespace | PASS: separate character, collection, and detail columns; tighter item statistics. |
| Deliberate accent | PASS: gold identifies selection, item rarity/level, and the main measurement. |
| Identity motif | PASS: consistent Head/Hands/Body/Feet/Sphere/Rope positions and actual relic imagery. |

| Craftsmanship/quality | Status and evidence |
| --- | --- |
| C-1, R-31 intention | PASS: major choices are justified in DESIGN.md's purpose register and the rows above. |
| C-2 completeness | PASS: implemented controls have exercised outcomes; later feature controls are omitted. |
| C-3, R-05 composition | PASS: workspace follows equipment tasks; no marketing hero, metrics row, feature cards, or filler sections. |
| C-4 resilience | PASS: both themes, narrow layouts, empty/filter/image-error states, and keyboard flows checked within this scope. |
| C-5 evidence | PASS: synthetic/source boundaries and verification limits are explicit. |
| R-11 radii | PASS: restrained 4px controls, 6px panels, 10px dialogs express role. |
| R-15, R-16 copy | PASS: concrete actions and plain Indonesian explanations; no generic marketing CTAs. |
| R-20 identity | PASS: character context, game assets, six equipment positions, selected relic ledger. |
| R-21 themes | PASS: both requested modes implemented equally; neither deferred. |
| R-29 palette | PASS: neutral surfaces, gold selection, cool focus color; artwork retains original game colors. |
| R-30 reference | PASS: owner explicitly requested HSR equipment inspiration; Orbit remains its own text wordmark and workflow. |
