# Integrated local scanner

Owner decision, 2026-11-06: keep Orbit in the browser and integrate a Windows scanner into the project. The owner should not have to operate a separate scanner application or find an exported JSON manually. A browser alone cannot inspect the game's complete inventory.

## Implementation plan

O-09 uses the MIT-licensed [Reliquary Archiver v0.19.0](https://github.com/IceDynamix/reliquary-archiver/releases/tag/v0.19.0) Packet Monitor x64 engine. Its headless CLI produces the source/schema-4 export already supported by Orbit. It requires the game login sequence, not scrolling inventory. Game-version compatibility remains an upstream dependency, not an Orbit guarantee.

Release metadata read from GitHub on 2026-11-06:

- Asset: `reliquary-archiver-pktmon-x64.exe`, 12,294,144 bytes.
- SHA-256: `4c687b0cc042d641fe3d2e513e3380544055f46ebb4092cc2a6dcb9072835c0a`.
- Source tag: `v0.19.0`; retain the upstream MIT notice.

Pin both URL and digest in code. Setup downloads the engine into ignored `.cache/`, verifies size and digest before publication, and never executes it. No automatic latest-version update. Changing the pin requires source/schema review and a focused commit.

The retained upstream [MIT notice](../server/RELIQUARY-LICENSE.txt) accompanies the integration. `npm start` builds the app, reserves its loopback origin, verifies/provisions the engine on Windows x64, then enables scanner controls. `npm run scanner:setup` only provisions/verifies. Both helpers use a process-scoped execution-policy option; no global Windows policy changes.

## Runtime boundary

The Node local runtime serves the built React app and a small same-origin scanner API on `http://127.0.0.1:4173`, retaining the existing IndexedDB origin. It remains an ordinary user process. A Scan request starts a fixed PowerShell helper that requests Windows elevation for only the native scan. The elevated helper verifies the engine digest again, disables self-update and streaming, and runs a bounded, one-shot headless capture. No shell command, executable path, port or output filename comes from HTTP input.

Bind only IPv4 loopback. Reject unexpected Host and Origin headers. Require a per-runtime random session token in a custom header on all scanner requests, including result reads. Do not enable CORS. Serve only the production `dist` tree, never the repository, cache or arbitrary filesystem paths. Do not expose native stdout/stderr, raw packets or account metadata in status responses.

Only one native run may be outstanding. Cancellation discards its result and waits for the engine's finite capture timeout/normal exit; do not force-kill a packet capture and claim it has released Windows resources. Keep the scan blocked while it finishes. Service shutdown follows the same drain policy. Explain this behavior in the UI. A denied UAC prompt must become an actionable error, not a successful empty inventory.

The engine may write a broader export (account/gacha/material fields). Keep it only in a unique ignored temporary run directory. On successful exit, forward only source/version/relics and character/Light Cone identity fields needed by the existing importer. Delete temporary files after reading, cancellation or failure. Expire the in-memory result after five minutes. On startup, clean recognized run directories older than ten minutes; preserve recent runs and unrelated files. The elevated helper's named mutex also prevents overlapping Orbit captures across runtime restarts. Temporary info-level stdout/stderr enable checking the initialization marker; do not expose them through HTTP. Do not request packet captures or trace logs. Raw game packets stay inside the upstream engine; Orbit adds no memory reading or game automation.

## Browser flow

1. Start Orbit's scanner runtime after installing the pinned engine through the project setup command.
2. Open the in-game Click to Start screen. Choose **Scan inventory**, then approve the Windows request.
3. Enter HSR within the 120-second capture window. Orbit shows the real job state while the helper runs.
4. Read the completed result through the authenticated same-origin API. Run the existing full unknown-input schema validation in the browser.
5. Review the actual count and explicitly choose **Replace inventory**. Successful IndexedDB persistence precedes replacing React state. A cancelled/invalid scan or storage failure leaves the prior inventory available.

Manual file import stays available. `npm run dev` and `npm run preview` remain frontend-only; their UI explains how to start the scanner runtime rather than claiming a scanner is connected. No personal scan runs on page load, installation, build, tests or health checks.

## Verification milestones

- O-09a: scope, source pin, privilege/lifecycle decision and resumable plan.
- O-09b: verified setup, constrained runtime/API, native helper, synthetic process/HTTP tests, separate focused commits.
- O-09c: English scan panel, status/cancel/retry, validated import preview, synthetic component tests and both-theme browser review.
- O-09d: README/architecture/testing/checkpoint, exact-head CI and PR integration.

Tests must cover digest mismatch, single-run exclusion, denial/failure/empty output, oversized output, expiry, cancellation and stale result isolation, origin/token/static path rejection, metadata stripping, and existing-inventory retention. Use a fake executable adapter and synthetic exports; never start packet capture in CI.

Real HSR capture, Windows UAC behavior and upstream game-version compatibility require an owner-driven scan. Record them as pending until observed. Synthetic tests do not establish game compatibility, inventory completeness or capture-resource cleanup on the owner's Windows version.

## Sources

- [Pinned CLI and privilege handling](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/main.rs)
- [Export source/version and initialization](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/export/fribbels/exporter.rs)
- [Packet Monitor backend](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/src/capture/pktmon.rs)
- [Upstream license](https://github.com/IceDynamix/reliquary-archiver/blob/v0.19.0/LICENSE)
