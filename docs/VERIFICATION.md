# O-06 optimizer verification (current)

2026-11-06: full suite 31 tests / 11 files passed; typecheck and production build passed, with a separately bundled module Worker. The final unavailable-filter assertion was additionally run in the optimizer component test and typecheck. Search tests compare exact results against independent brute force over 64 combinations; assert six-slot results, SPD/set/ID constraints, locked eligibility, no-result cases, budget rejection, limited coverage, BigInt counts beyond safe integer range, invalid calculation disclosure and index scoring. Lifecycle/component tests assert Worker termination, stale cancel/restart/import suppression, current-result transfer, input invalidation and visible retained filter values after inventory changes.

Browser outcomes with synthetic data: shared saved manual profile loaded; exact 7-relic search with SPD 130–132 and four Musketeer pieces found two builds at SPD 131.032; transferring result 2 kept A's Body compare_2 and assigned compare_alt to B. Importing 240 synthetic relics invalidated results. Exact search rejected 4,096,000,000 combinations over budget. Limited search with a million-evaluation budget emitted progress, cancelled with no application, then a 1,000-sample run completed with ten retained results and a non-exhaustive label. Keyboard Enter also completed a run. These checks exercise the actual Vite Worker, not only a stub.

Desktop 1440x1000 dark, mobile 390x844 light and narrow 320x800 had no document overflow; mobile optimizer link remained visible. Error-console query returned no entries. Screenshots `.cache/optimizer-qa/desktop-dark.jpg` and `mobile-light.jpg` (the mobile capture may show keyboard-run progress rather than completed results). Owned Vite session 47456 stopped and temporary viewport reset. Retained-unavailable dropdown labels were added after browser QA and covered automatically.

Scoped antislop gate: established shared-profile/HSR equipment identity reused; no generated assets; settings/results disclose filtered pool, coverage, objective, precision, invalid exclusions and search limits. Run/cancel/keyboard/result transfer work as tested. No heuristic quality guarantee, real-account accuracy, throughput benchmark, full accessibility/contrast certification, conditional combat simulation or timeline is claimed. Exact means exhaustive over the filtered pool; unsupported calculations remain disclosed exclusions. Sampling no-result does not establish infeasibility.

# O-05 build-comparison verification (current)

2026-11-06. Final typecheck, 24 tests in 8 files and production build passed. A test-query typing error was fixed before the final run. Numerical tests independently check base/percent/flat ordering, SPD base scaling, inactive alternatives, set thresholds, planar static-versus-conditional scope, invalid profiles/slots and duplicate equipped records. Persistence tests verify profile/relic round trips, inventory-replacement independence and failed-save retention. Interaction tests verify B changes without A mutation, signed deltas, reset, load, save-failure feedback and drafts surviving view navigation.

Browser used a synthetic seven-relic scanner file. Actions verified: import confirmation; initialize equipped A/B; edit seven manual base inputs; swap B Body while retaining A; inspect CRIT delta +26.600; save/load named snapshot; download comparison backup; restore preview and confirmation; reload then load saved pair; clear/reset B; keyboard Enter candidate choice; switch Inventory/Comparison without losing draft values. Actual default profile contributions are manual, not a verified in-game Acheron profile. Comparison save/load remains explicit; reload does not automatically select a saved pair.

Desktop dark 1440x1000 and mobile light 390x844: no document overflow. Local relic/character art appeared, six slots were visible in responsive layouts, numeric columns aligned and mobile navigation retained both destinations. Error-console query returned no entries. Screenshots `.cache/comparison-qa/desktop-dark.jpg` and `mobile-light.jpg`; owned Vite session 6584 stopped and temporary viewport reset. The final demo-routing/scanner-copy adjustment was verified by automated checks after browser QA; it is not claimed as an additional manual walkthrough.

Scoped antislop delivery gate: existing HSR/Figma palette and local art retained; artwork tied to declared character rather than a random portrait; profile assumptions and excluded mechanics disclosed; candidate and ledger controls work as exercised; snapshots retain identity/precision; status/error text distinguishes storage success/failure. No full accessibility/contrast audit, real-account stat matching, character auto-profiles, combat/DPS calculation, optimizer or timeline is claimed. Inventory import and comparison have separate backup files with distinct supported schemas.

# O-04b catalogue verification (current)

Executed 2026-11-06: 17 tests across 5 files passed, typecheck and production build passed. Added numeric catalogue tests, reference validation/backup round-trip tests, legacy timestamp compatibility, and a 10,000-relic filter/pagination component test. The last metadata compatibility fix was covered by the final automated run; browser QA preceded it.

Browser: restored existing synthetic schema-1 inventory, resolved 48 local images, displayed catalogue ATK 352.80 for a 5-star +15 Hands item, changed rarity to no results and reset, opened desktop inspector, then mobile dialog. Escape closed the dialog and returned focus to its relic card. No document overflow at 1440x1000 dark or 390x844 light. Error console query returned no entries. Screenshots in `.cache/catalogue-qa/desktop-dark.jpg` and `mobile-light.jpg`; temporary viewport reset and owned Vite session 62981 stopped. Missing-reference/unknown-catalogue and composed five-filter cases are automated rather than separately claimed as browser checks.

Scoped antislop gate: established Figma palette/grid/inspector retained; actual sourced relic assets serve identity, no invented imagery; English labels show derived values and unavailable references; tested filter/reset/selection flows work. No broad contrast/accessibility certification, measured throughput benchmark, real-account validation, character build stats or combat simulation is claimed. Main catalogue numbers are intentionally displayed with their own decimal formatting, not game panel truncation. O-04 synthetic acceptance is complete; real scanner export acceptance remains pending.

# O-04a import verification (current)

Executed 2026-11-06. `npm.cmd run typecheck`, `npm.cmd test` (12 tests in 4 files), `npm.cmd run build` passed. Existing six demo tests remain passing. Added domain tests cover both scanner sources, separate preview/reroll values, precision-preserving backup round trips, invalid field paths, unsupported source/version/events, duplicate IDs, malformed JSON and limits. Storage test uses pinned dev-only fake-indexeddb and aborts a replacement transaction before asserting the prior inventory is still readable. UI tests cover preview/confirm/cancel, storage-failure retry, invalid-file retention, restoration and 48-item pagination.

Browser controls exercised with 100 synthetic items: file chooser and preview, Replace inventory, Download backup, Next page (page 2 of 3), Inventory status (discard: 1 of 100), search, Reset inventory filters, selection, Back to inventory/Escape with focus return, theme switch, reload restore and invalid JSON alert without losing inventory. Actual backup download succeeded. Source precision and inactive preview labels were visible. Desktop 1440x1000 dark and mobile 390x844 light had no document overflow. Screenshots: `.cache/import-qa/desktop-dark.jpg`, `.cache/import-qa/mobile-light.jpg`. Vite session 27510 stopped and temporary viewport reset.

Scoped antislop gate: direction follows existing theme/grid/inspector; no generated assets or arbitrary character art for unknown records. English copy and actionable import errors present. Relevant controls function as tested above; unrelated planned actions are not advertised. No full accessibility/contrast certification or measured large-inventory performance is claimed. Browser console audit and real-account validation were not completed. Numeric main-stat amounts, catalogue images, reference validation and richer filters remain O-04b; overall O-04 is not complete. Historical Figma/demo reports below apply to that separate view.

# UI verification

## O-03c English interface (current)

The owner requested English as the primary product language on 2026-11-06. Visible labels, scanner guidance, empty/no-result/hidden-selection copy, source disclosure, image fallbacks, screen-reader names, theme announcements, page language, and description are English. Game names, assets, layout/styles, storage keys, and dependency versions are retained. The transient slot-filter sentinel is now all rather than a translated display word.

Executed checks:

- npm.cmd run typecheck and npm.cmd test passed (6 existing interaction tests updated to the English accessible names). npm.cmd run build passed for the same final source.
- Browser confirmed html lang=en and the English page description. Desktop snapshot showed English navigation, controls/options, status counts, equipment/detail state, and footer.
- Scanner guide opened with English instructions and both scanner links; Close guide closed it. Unmatched search showed No matching relics and 0 of 8 relics; Show all relics restored the collection. Equipment selection preserved an Izumo filter, showed the English hidden-selection notice, and Show selected relic restored the selected card to the full results.
- Exit demo showed Your inventory is empty and English preparation text; Explore demo restored the fixtures. Source & precision opened the English disclosure. The image-fallback component test checks Artwork unavailable and decorative-image semantics.
- Desktop 1440x1000 dark and mobile 390x844 light were checked for text contrast, visible control bounds, and overflow: no failures. Mobile Enter opened Selected relic details; Back to collection/Escape closed it and focus returned to View Body equipment. The original 703px viewport was restored, with no overflow.
- Copy gate PASS: concise English actions, clear synthetic/pending-feature boundaries, semantic English names, and matching lang/metadata. Layout/media/state behavior inherits the unchanged Figma implementation; current text/layout checks supplement its detailed gate in FIGMA_VERIFICATION.md. Historical Indonesian labels in older evidence below describe those earlier revisions.

Local ignored screenshots: .cache/english-ui/desktop-dark.jpg and mobile-light.jpg. The owned verification server was stopped after the walkthrough. Source text, documentation references, and scoped whitespace checks were reviewed before integration.

## O-03a equipment UI verification (historical)

The O-03b Figma layout is verified in [FIGMA_VERIFICATION.md](FIGMA_VERIFICATION.md). O-03c above updates its product language; earlier labels/screenshots remain historical evidence.

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
