# Windows scanner launch regression, 2026-11-07

Owner reported immediate failure without UAC when using npm.cmd start. Read-only runtime status confirmed [status:ENOENT] after adding stage diagnostics. A harmless Windows PowerShell script writing a marker reproduced the cause: detached=true exited 0 without writing the marker, with windowsHide either true or false; detached=false executed the script and returned its intended exit code. The production launcher no longer uses detached mode.

Local verification: 50 Vitest tests passed, production build/strict typecheck passed; after the final Node launch change, all 16 backend tests passed. New cases exercise the actual Node spawn options against a harmless fixture, worker bootstrap and real child argument forwarding with spaces/apostrophes, asynchronous child failure propagation, elevation intent via an intercepted RunAs boundary and redacted stage-specific errors. Worker fixtures use unique test mutexes to avoid competing with the owner's scan. No test launches a real reader or requests Administrator permission.

The owner's first retry reached incomplete inventory after the launch fix. Retaining the native reader handle and adding fixed incomplete reasons followed; all 17 final backend tests passed. After the owner restarted/retried, read-only runtime status reported ready / Scan received. This establishes that the owner's run reached the runtime's complete-result boundary, not that browser import, item completeness or stat precision matched the game. The agent did not read scan results, start a scan or operate a Windows prompt. Count/precision and normal/timeout/shutdown cleanup acceptance remain pending. No browser layout changed; prior UI evidence remains applicable and no new screenshot/visual certification is claimed.

# O-09 integrated scanner verification (historical baseline)

2026-11-06. Final frontend suite: 50 tests in 16 Vitest files passed. Native-boundary suite: 10 Node tests passed on Windows, including PowerShell 5.1 syntax parsing without script execution. Production build (with strict typecheck), pinned engine setup and the actual `npm.cmd start` command succeeded. Later native-helper cleanup/redaction changes passed the affected Node suite again. Final source review also identified upstream's crashlog/Enter prompt: stdin now receives EOF, crash results are rejected and their artifacts cleaned. Synthetic crash cleanup and helper syntax are checked; the native crash path has not run. There is no new npm dependency or lockfile change.

## Executed checks

| Scenario | Observed result |
| --- | --- |
| Official engine setup | Downloaded the pinned v0.19.0 Packet Monitor x64 asset; verified 12,294,144 bytes and SHA-256 from official release metadata. The executable was never run |
| Production startup | npm start built the app, served the existing 127.0.0.1:4173 origin, verified the cache and displayed Scanner ready in the browser. No native job started |
| Synthetic start/discard | Browser showed listening, then discarding; another scan stayed unavailable until the fake native operation completed. Node tests also verify single-run exclusion and shutdown drain |
| Collapsed active panel | Closing the disclosure kept the synthetic scan active and file import disabled; reopening offered Review scan after completion |
| Review/cancel | Synthetic 1-item result passed browser validation, focused the shared confirmation region and left the prior 240-item inventory available. Cancel import retained all 240 items |
| Persistence failure/retry | Automated component test rejected save, retained the prior inventory, then retried successfully with fractional SPD 2.032 and inactive preview ATK 16.9 preserved. This was fault injection, not a manually exhausted browser quota |
| Partial output | Separate --incomplete harness produced an explicit no-complete-inventory error, no Review scan result and no change to the 240-item inventory |
| Bad output and expiry | Node tests reject partial/missing/malformed/oversized exports and unknown source/schema; test expiry, stale IDs and metadata projection. Malformed JSON errors omit raw export contents |
| Local API | Actual loopback HTTP tests reject foreign Host/Origin, missing custom/session headers, request bodies and traversal. Result reads require the current job ID/token; no CORS grant is emitted |
| Frontend-only mode | Vite preview exposed runtime-unavailable guidance and Reconnect scanner; manual import remained available |
| Reconnect and keyboard | Reconnect reached the real idle runtime. A reviewed notice cannot mask another job's state. Enter collapsed/reopened the disclosure; review moved focus to its confirmation region |
| Existing workspace | No browser replacement was confirmed. Original inventory/comparison/team records stayed untouched; light theme and #speed destination were restored, temporary viewport reset and reference tabs preserved |

The browser used the production bundle. Scan/discard/review buttons were exercised only against tests/browser/preview-scanner.mjs, which cannot invoke the native engine or elevation. Real production runtime checks stopped at installed/ready. No HSR process, personal export, UAC prompt or capture was used. The normal runtime, two synthetic harness runs and Vite preview were all stopped; port 4173 was verified free.

## Visual checks and antislop delivery gate

Open scanner panel: dark/light at 1440x1000, 390x844 and 320x800, six cases with no document overflow, no active target below 44px and no scoped computed text-contrast failure. Minimum measured contrast: 4.91 light, 7.97 dark. Final production dark desktop audit passed again. This solid-background DOM check excludes image/pseudo-element compositing, disabled-control contrast and assistive-technology certification. Console error query returned no entries. Evidence is ignored under `.cache/scanner-qa/`: desktop-dark.jpg, mobile-light.jpg and audit-results.json. No screenshot contains a personal account export; shown relics are prior synthetic QA inventory.

Gate scope is the new scanner UI and its integration; unchanged workspace evidence remains below. Native game extraction is a pending acceptance check, not a tested design claim.

| Gate item | Status and evidence |
| --- | --- |
| R-02 copy | PASS: new English copy contains no em dash; commands and game labels retain literal meaning |
| R-03 responsiveness | PASS: six widths/themes have no overflow; screenshots inspected |
| R-17 statistics | PASS: counts come from validated exports; no fabricated rate or accuracy metric |
| R-18 testimonials | PASS: none added |
| R-23 assets | PASS: no artwork, logo, avatar or navigation destination added |
| R-24 navigation | PASS: existing working workspace navigation retained |
| R-25 contrast | PASS within declared scope: no failures in six text-pair audits |
| R-26 controls | PASS: start/discard/review/reconnect and preview cancel exercised with the synthetic adapter; production start/ready verified separately |
| R-27 states | PASS: idle, connecting, offline, active, discarded, partial error and preview have actionable feedback; unsupported/missing capabilities covered by components |
| R-28 FAQ | PASS: none added |
| R-32 keyboard | PASS: native disclosure works with Enter and preview receives focus; 44px targets retained |
| R-33 source edits | PASS: React/CSS source edited directly; no external UI patch generator |
| R-34 themes | PASS: existing tokens retained and both modes audited |
| R-35 execution | PASS: actual build/start plus scoped control walkthrough recorded above |
| R-36 claims | PASS: real capture/UAC/game compatibility explicitly pending; no security certification or performance score |
| R-37 direction | PASS: accepted DESIGN.md HSR equipment language and ENERGY/RHYTHM/MOTION 2/2/2 used before implementation |
| R-38 fabricated content | PASS: synthetic harness is labeled, isolated from production entry point and used only for QA |
| R-39 semantics | PASS: native details/summary/buttons, visible state text, inherited focus/disabled/hover styles; no new animation |
| R-40 media/performance | PASS: no media or third-party page script added, no unmeasured performance claim |
| R-01 visual effects | PASS: opaque existing surfaces; no new gradient/glow |
| R-04 icons | PASS: no new decorative icons |
| R-06 typography | PASS: existing brand fonts; inline code identifies actual commands |
| R-07 patterns | PASS: no background pattern added |
| R-08 arrows | PASS: no decorative button arrows |
| R-09 badges | PASS: native job status is plain text, no promotional capsule |
| R-10 glass | PASS: none added |
| R-12 elevation | PASS: no new shadow/elevated surface |
| R-13 glow/status | PASS: state uses actual job text, no pulsing indicator |
| R-14 cards | PASS: one task disclosure, no repeated feature cards |
| R-19 motion | PASS: no new animation; inherited short control transitions respect reduced motion |
| R-22 illustrations | PASS: none added |
| Liveliness dials | PASS: 2/2/2 matches the existing workspace and short control interactions |
| Focal point | PASS: Scan inventory is the panel's gold primary action; Review scan appears only with a result |
| Whitespace | PASS: collapsed disclosure removes preparation text from item inspection |
| Deliberate accent | PASS: existing gold primary button, quiet secondary actions |
| Identity motif | PASS: inherited equipment workspace, typography and six-slot inventory remain visible |
| Design read | PASS: declared before UI generation and recorded in DESIGN.md |
| C-1 intent | PASS: each panel/surface/type/spacing choice has a stated reason in DESIGN.md |
| C-2 completeness | PASS: every new action has a real handler and tested failure path |
| C-3 content | PASS: scanner preparation/status/review serves inventory acquisition |
| C-4 resilience | PASS within declared scope: both themes, narrow widths, keyboard, offline and error paths checked |
| C-5 evidence | PASS: synthetic versus real-runtime checks and native acceptance limits are explicit |
| R-05 composition | PASS: task disclosure inside the existing equipment view, no dashboard template |
| R-11 radius | PASS: existing 6px panel / 4px control scale |
| R-15 actions | PASS: Scan inventory, Discard scan, Review scan and Reconnect scanner name their actions |
| R-16 language | PASS: no marketing claims added |
| R-20 identity | PASS: scanner belongs to the accepted HSR equipment workspace |
| R-21 themes | PASS: existing owner-required light/dark modes preserved |
| R-29 palette | PASS: existing neutrals/gold tokens only |
| R-30 originality | PASS: no unrelated product template introduced |
| R-31 reasons | PASS: panel position, disclosure, type and accent rationale recorded in DESIGN.md |
| Comment hygiene | PASS: new comments explain protocol, privacy or cleanup constraints; no decorative/narrative comments |
| Copy integrity | PASS: no invented metrics, identities or verification; status reflects the current job |

## Pending owner acceptance

Use the real integrated workflow once: approve/deny Windows elevation, enter HSR after listening, compare the scanned count/equipped/unequipped/locked/discarded items and SPD precision against the game, then confirm replacement only if correct. Also observe normal/timeout/discard/shutdown Packet Monitor cleanup on the owner's Windows version. These checks have not run. Upstream game-version compatibility, real inventory completeness, real stat/turn matching and owner visual approval remain pending.

## Historical verification

# O-08 production acceptance (historical)

Executed 2026-11-06 (Asia/Jakarta). Local typecheck, 43 tests in 15 files and production build passed. Native browser checks used `npm.cmd run preview` against `dist`, including the separately emitted optimizer Worker. [CI run 42176422051](https://github.com/darelaj/orbit/actions/runs/42176422051) passed clean install/typecheck/tests/build on both Linux and Windows for runtime head `de8e9a9`; the final documentation head must also pass before merge. Workflow action SHAs were resolved from the official v6 tags, not inferred from search text. No package or lockfile upgrade was needed.

## Cross-workflow results

| Control / scenario | Observable outcome and evidence |
| --- | --- |
| Valid import, cancel and same-file reselection | Cancel retained 240 existing synthetic relics; reselect/confirm imported all 7 fixture relics |
| Unsupported schema | Version 99 produced an explicit error; the 7-item inventory stayed available |
| Main-stat filter/reset | CRIT Rate filter returned 1/7; reset restored the collection |
| Mobile relic detail | Escape closed native detail dialog and focus returned to compare_alt's card |
| Profile and saved comparison | Initialized equipped A/B, entered manual base/Light Cone values, saved Acceptance flow |
| Actual module Worker | Exact search applied SPD 130–132, 4-piece Musketeer, scanner-ID exclusion and ATK/CRIT index; one legal result had SPD 131.032, score/index 1455.910 |
| No-result recovery | SPD 1000–1200 returned no feasible computable build; restoring 130–132 recovered a result |
| Transfer/save/reload | Applying result retained A's compare_2 and put compare_alt in B; saving/reload/loading retained the optimized B |
| B to team | Copying B preserved OCR provenance; explicit team save survived reload independently |
| Wrong backup formats | Inventory file rejected by comparison restore; comparison file rejected by team restore; prior state stayed available |
| Worker cancellation/invalidation | Production sampled search started on the 240-item pool, cancelled without application; editing SPD during a new run returned idle controls with no stale result |
| Keyboard skip navigation | Initially reproduced a bug that returned calculation views to Inventory. After fix, Enter focuses main and preserves #comparison, #optimizer or #speed |
| Disclosure controls | Initially measured 20px targets. After fix, active summaries were at least 44px with native semantics retained |
| Prior-data recovery | Exported all three backup types before replacement. Restored through UI, exported again, canonicalized JSON and verified inventory/comparisons/team all matched the originals. Only synthetic QA data was used |

The integration test uses the real App/storage modules with independent fake IndexedDB factories and a controlled Worker message adapter running the real solver. Native browser checks cover the actual production Worker/file pickers/focus behavior. A separate test aborts writes in each store and verifies every prior store remains readable; this is automated fault injection, not a claim that browser storage quota was exhausted manually. Worker tests cover late completion/error/progress after cancellation, restart and revision changes. Existing feature tests retain demo/theme/fallback, math, import, persistence and timeline coverage. Unchanged scanner-guide interactions were not separately re-walked in O-08; earlier feature reports remain their browser evidence.

## UI matrix and limits

All four workspaces were audited in light/dark at 1440x1000, 390x844 and 320x800: 24 cases with no document overflow, no active target below 44px and no failures in the scoped text-pair check. Minimum measured contrast was 5.03:1 light and 7.97:1 dark. Relevant manual correction/eligibility disclosures were opened. Focus/keyboard, image/pseudo-element compositing and semantic interaction still require human judgment; this computed solid-background check is not full WCAG or assistive-technology certification. Results and raw measurements are ignored artifacts under `.cache/acceptance/audit-results.json`; the reproducible read-only snippet is `tests/browser/audit-ui.js`.

Console query returned no error entries. Screenshots: `.cache/acceptance/desktop-dark.jpg`, `mobile-light.jpg`. Original light preference and temporary viewport were restored; reference tabs preserved. Production preview session `35373` stopped after QA. Initial backup files are in Downloads as orbit-inventory (1).json, orbit-comparisons (1).json and orbit-speed-team (1).json; they are not committed. Browser data was restored, not erased.

Scoped antislop gate: established Figma/HSR identity retained, no new visual assets or invented data claims, meaningful chart geometry, explicit manual/precision/model limits, working primary actions and accurate failure/recovery feedback. Two observed accessibility/navigation defects were fixed and rechecked. All initial core milestones now have synthetic acceptance evidence. Real-account export accuracy, in-game stat/turn matching, native browsers outside this Chromium environment and owner visual approval remain pending. No performance score or complete accessibility certification is claimed.

## Historical feature reports

# O-07 speed-tuning verification (current)

2026-11-06. Final typecheck, 39 tests across 14 files and production build passed. New numerical tests cover character-base SPD percentage scaling, initial-only advance, actions at 150/250 AV, member-order ties, the unrounded 133.333… threshold, invalid values, interval underflow and an exact 2,000-action cap. Storage tests retain fractional SPD/provenance across round trips and preserve saved data after invalid writes. UI tests cover copy-B reset/provenance, no automatic relinking, manual-label changes after edits, save failure/retry, saved restoration, transient invalid-input handling, reset and pagination.

Browser used synthetic prior comparison B and manual/example team values. Verified complete B copy at SPD 131.032 with OCR label, base/panel/buff/advance inputs, advance-50 times 50/150/250 with cycle C0/C0/C1, save/reload, actual team download, preview/confirmed restore, malformed backup retention, 20-cycle ledger page 2/3, unbuffed C0 threshold about 133.333333333 and excessive-output error hiding the chart. Reload restored the previous saved valid team. No imported data was a personal export or an accurate Acheron profile.

Responsive checks: dark 1440x1000, light 390x844 and 320x800 had no document overflow. Speed navigation stayed available. Chart text retains a 1000px internal canvas and scrolls in a focusable region; ArrowRight/ArrowLeft changed its scroll position. Count/ledger tables retain headers and contained horizontal scrolling. Console query returned no error entries. Screenshots `.cache/speed-qa/desktop-dark.jpg` and `mobile-light.jpg`; owned Vite session 59668 stopped and viewport reset. Reference-browser tabs were preserved; local preview tab 5 marked as deliverable.

Scoped antislop gate: chart boundaries/lanes/markers encode actual AV calculations, with matching numeric cycle counts and chronological values. No invented artwork, extra chart dependency or decorative stat displays were added. Precision/assumptions and conditional-model exclusions are explicit beside controls/results; team input disclosure prioritizes the timeline when collapsed. Save, backup/restore, negative states, pagination, responsive and keyboard controls worked as exercised. No broad accessibility/contrast certification, real-account turn matching or dynamic combat simulation is claimed. O-08 remains the final combined acceptance task.

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
