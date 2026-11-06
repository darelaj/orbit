# Verification plan

## Integrated scanner verification

`npm test` runs Vitest then `npm run test:scanner`. The latter uses Node's test runner on tests/server.test.mjs: wrong size/digest and failed downloads, metadata projection and malformed-output redaction, one-shot result/expiry, partial/missing/oversized export rejection, cancellation/stale IDs/single-run protection, denied permission/missing engine, shutdown drain, stale-cache cleanup and actual loopback HTTP origin/Host/token/body/path checks. On Windows, it parses both scripts with Windows PowerShell 5.1 without executing them. All native execution uses an injected synthetic adapter; CI neither downloads the engine nor requests elevation/capture.

ScannerPanel.test.tsx checks lazy connection, native-result preview, cancel and failed-save retention, fractional SPD/preview provenance, unsupported schema, discard-until-exit, offline reconnect, missing/unsupported capability, status decoding, preview focus and reconnect feedback. Existing numerical and persistence tests remain independent of the scanner runtime.

For manual scanner UI testing, build then run `node tests/browser/preview-scanner.mjs`. Its fake native adapter only writes a labeled synthetic export after 2.5 seconds. Add `--incomplete` to test a rejected partial result. It binds the normal loopback port, so stop other Orbit servers first. Synthetic jobs are clearly labeled; this test entry point is never imported by production start code and exposes no capture-capable test endpoint. Do not substitute a real capture for this harness in development or CI.

Use `npm start` only for the idle installed/ready production check during development. Actual HSR login extraction, UAC approval/denial, normal/timeout/cancel Packet Monitor cleanup and game-version compatibility remain owner-driven acceptance checks. An installed binary, a valid hash or a synthetic browser walkthrough does not prove those checks passed.

Tests focus on input preservation and calculation correctness. Run npm.cmd run typecheck, npm.cmd test and npm.cmd run build from the checkout. SESSION_STATE.md records actual runs. The pinned GitHub Actions workflow verifies clean install and these commands on Node 24, Linux and Windows; it does not claim native-browser automation.

## Import and persistence

- Equipped and unequipped relics, lock/discard flags, decimal SPD, all six slots, percent/flat stat distinctions.
- Valid scanner exports, missing optional sections, duplicate external IDs, identical but distinct items, malformed records, unsupported schema versions, unsupported stat keys, file limits.
- Active/preview/reroll separation; character and Light Cone mapping.
- Invalid import and storage failures preserve the last good inventory.
- Backup round-trip and restore after reload. Exclude unrelated scanner data.
- Thousands of relics render through pagination or virtualization without producing thousands of heavy card components.

## Math and search

- Hand-computable flat-plus-percent calculations and set thresholds.
- SPD buffs use base speed; OCR values are retained without invented precision.
- Known minor Trace mapping, missing data, and manual corrections have explicit outcomes.
- Exact search matches a separately written small brute-force reference, including ties and constraints.
- Heuristic search reports its mode, stays within resource bounds, and returns only legal builds.
- Cancellation and a new import invalidate old worker messages.
- Timeline thresholds, initial advance, cycle boundaries, equal-time order, invalid speeds, and capped horizons.

## Browser acceptance

Exercise both requested themes at desktop and a narrow viewport, then record each control's observable outcome in `VERIFICATION.md`:

- Navigation and theme toggle, including persisted theme.
- First-run import guidance, demo labeling, successful import, invalid import rollback, file re-selection, backup download.
- Filters, reset, pagination, relic detail, dialog Escape and focus return.
- Six-slot edits, profile corrections, stable A/B comparison, save/load builds.
- Optimizer objective/constraint edits, search, cancel, no-result state, send-to-comparison.
- Team input edits, build-to-SPD transfer, timeline and event list.
- Keyboard-only use, visible focus, labels, touch targets, text contrast, no page overflow, no console errors.

Run typecheck, unit/integration tests, and a production build before feature integration. Do not claim manual interactions from a passing build. Do not invent performance scores; benchmarks are recorded only if measured.

The antislop delivery gate must include evidence for its hard gates, purpose decisions, liveliness dials, and craftsmanship checks. Keep the detailed report in VERIFICATION.md and link it from the final delivery.

## Cross-workflow acceptance suite

`tests/workspace.acceptance.test.tsx` renders the real App, parses synthetic schema-derived exports and uses real storage modules against a fresh fake IndexedDB factory per test. It traverses import, comparison, optimizer result transfer, B-to-team copying, save/reload and independent inventory replacement. Its Worker is a controlled message adapter using the real search engine; actual module-Worker behavior is exercised separately in the production browser. A second independent fixture forces transaction aborts in each store and confirms all old values remain readable. Tests do not depend on one another's data.

`src/features/optimizer/runner.test.ts` covers cancel, restart, import revision, stale progress/terminal/error messages and terminal resource release. App navigation regressions cover keyboard skip focus without route changes across all calculation destinations. A native production-browser walkthrough still checks file choosers/downloads, actual Worker chunks, dialog focus/Escape, both themes and responsive layouts.

`tests/browser/audit-ui.js` is a browser-only, read-only inspection snippet, not a CLI/Vitest test. Read its text through the approved browser automation runtime and evaluate it with the documented read-only DOM API on a rendered view. It reports overflow, active target bounds and solid-background computed text contrast; disabled controls are exempt, and checkbox/radio labels count as their effective target. It excludes hidden/closed-detail content. It cannot certify image/pseudo-element compositing, every browser, assistive technology or the full WCAG standard. Open relevant disclosures and inspect screenshots as well as numeric output. It does not read browser storage or mutate the page.

Before destructive test replacement, export all three supported backup types through the UI. Restore them after manual QA and compare canonicalized JSON output to the originals, rather than assuming that visually similar rows prove recovery. Keep personal exports and downloaded backups out of Git; only synthetic fixtures and verification code belong in the repository.
