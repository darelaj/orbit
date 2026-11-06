# Hosted Orbit and Windows Companion plan

Status: planning only, requested 2026-11-06. This document does not authorize implementation, installation, capture, publishing, infrastructure purchases or changes to the current scanner boundary. No Companion installer or hosted-to-local connection exists yet. Future work starts only when the owner asks to implement it.

## Intended result

A player opens an HTTPS Orbit website and uses inventory, comparison, optimization and speed tuning in the browser. For automatic full-inventory scanning, the player installs Orbit Companion once on the Windows PC running HSR. Orbit manages its reader internally; the player does not separately operate Reliquary or locate its JSON export. Players without Companion can still import JSON manually.

Proposed MVP: Windows x64, one local capture at a time, no account login or inventory cloud sync. Keep the existing React/TypeScript/Vite app and browser calculation/storage modules. The Windows component remains an ordinary-user process; only an explicitly requested one-shot scan asks for elevation. Installation, browser pairing, browser network permission and scan elevation are separate events and must be explained separately.

## Current baseline and proposed boundary

| Area | Exists now | Planned change |
| --- | --- | --- |
| Web UI | Local React app; manual import and analysis | Host the built frontend over HTTPS |
| Scanner runtime | Node serves app/API together on 127.0.0.1:4173 | Package a user-runnable Companion; keep the existing local mode working |
| Access | Same-origin API; foreign origins rejected | Add a separate, explicitly paired hosted-origin protocol after feasibility checks |
| Distribution | Development checkout, Node/npm and pinned engine setup | Installable Windows package; end users should not need Node, Git or npm |
| Inventory | Browser validation, preview and IndexedDB | Keep the same ownership and explicit replacement workflow |
| Verification | Synthetic scanner tests, idle production readiness | Add real browser-to-Companion and owner-driven game acceptance |

Proposed data path: hosted page in the player's browser -> authenticated local Companion -> elevated one-shot reader -> projected inventory back to that browser -> validation/preview -> IndexedDB after confirmation. The hosting server delivers application files and version metadata; it does not receive personal scan results. Verify that separation through observed requests, not architecture claims alone.

Do not ship the existing Node HTTP server as a public scanner backend or expose it on 0.0.0.0. A scanner running on the hosting machine cannot inspect the player's PC game traffic.

## Feasibility must precede packaging

The first technical milestone is a synthetic HTTPS-page-to-loopback proof, using no HSR data or elevation. Direct browser requests to a loopback endpoint are the initial candidate, not an approved transport. Record the actual browser versions, OS, request scheme, permission prompts and failure behavior. Test mixed-content handling, Local Network Access rules, preflight and ordinary CORS together.

Chrome documents Local Network Access permission for connections to local software, restricted to secure contexts. Treat that as a requirement to test the real browser flow, not proof that Orbit's proposed transport already works. [Chrome source](https://developer.chrome.com/blog/local-network-access)

Chrome and Edge on supported Windows versions are the proposed initial test targets. No browser/version support claim is accepted until tested. Firefox and other browsers remain unpromised. Do not ask users to disable browser protections, install a root certificate or enable experimental flags as the normal product flow.

Gate: choose the transport and packaging ADR only after the proof works with normal browser settings and explicit permissions. If it fails, document the blocker and evaluate an extension/native-messaging bridge or a local Orbit UI fallback. These alternatives require a separate decision; do not silently replace the requested browser workflow or implement several transports at once.

## Connection and privilege contract

The hosted-origin protocol needs a deliberate design; changing Access-Control-Allow-Origin alone is insufficient. Preserve the existing same-origin local API while adding this boundary separately. [CORS reference](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS)

- Bind Companion to loopback only. Choose a documented endpoint during the feasibility milestone; handle occupied ports without network-wide discovery or broad port scanning.
- Allow only the exact approved production HTTPS origin. Keep staging/development origins explicit and separate; reject wildcard origins, opaque/null origins, unapproved Host headers and DNS-rebinding attempts.
- An allowlisted Origin does not establish pairing. Require a visible, user-initiated approval through a trusted local Companion surface before issuing access to that website.
- Use a one-use, short-lived pairing challenge and expiring scoped sessions. Keep secrets out of URLs, browser history and logs. Specify expiry, restart, reconnect and revocation semantics in the protocol ADR before implementation.
- Permit minimal capability/health information before pairing; disclose no inventory, account metadata or job output. Require pairing/session authorization for scan commands and result reads.
- Expose fixed operations only: connect/capabilities, start, status, discard and read result. Do not accept shell text, executable paths, arbitrary file reads or download URLs from the website.
- Retain the pinned engine and integrity checks, one-shot elevation, initialization/completeness checks, run identity, temporary-file cleanup, crash handling and result expiry. Pairing must never elevate the whole Companion or start capture automatically.
- Keep capture cancellation distinct from native exit. Reconnect and multiple tabs must not launch overlapping captures or attach an old result to a new job.

Use synthetic negative tests for foreign sites, unpaired access, expired/replayed challenges, stale jobs, malformed messages, revoked sessions and unavailable Companion. Prove that an unapproved origin cannot trigger native work or read results even if it knows the local endpoint.

## Proposed player flow

1. Open Orbit online. Manual import and analysis work without Companion.
2. Choose Connect Companion. The page reports installation/connection requirements based on actual state.
3. Download the official installer if needed, install and launch Companion as a normal user. Any background startup must be optional; provide a visible exit control.
4. Approve the browser's local-network request if required by the tested transport, then approve pairing in the local Companion surface. Never trigger a scan during setup.
5. Prepare HSR on Click to Start. Choose Scan inventory, approve scan elevation, then enter the game when listening is confirmed.
6. Review the validated count and precision, then confirm Replace inventory. Failed/denied/partial scans preserve the previous workspace.

English remains the product language. Reuse the accepted equipment/Figma identity and both themes. Define missing Companion, permission denied, pairing pending/expired/revoked, version mismatch, scanning, discarding, failed, ready and result-expired states before coding. Explain recovery beside the affected action. This plan adds no new navigation structure, artwork or visual design.

## Packaging and release decisions

After transport validation, compare packaging the existing Node runtime with a small Windows shell against a native host. Record a single choice based on runtime bundling, installer size measured from a prototype, tray/local approval UI, elevation/process cleanup, update handling and maintenance. Do not add a desktop framework just to write this plan.

The installer must include or provision the pinned reader with a verified digest and upstream notices. Define code signing, official download origin, release checksums, installer format and supported Windows versions before distributing. Check what requires signing credentials or cost; no purchase is approved by this plan. Provide install, upgrade, repair, exit and uninstall behavior. Uninstall must explain that browser inventory is separate and should not clear it.

Propose manual updates for the MVP. Define web/Companion API versions and capabilities so an incompatible version yields an actionable update message while manual import remains usable. Never silently download or execute an unreviewed latest scanner. Background auto-update, autostart and additional games are separate future scope.

## Hosting and existing data

Select the provider and final domain later. The website needs HTTPS, correct asset/Worker MIME types, a compatible Content Security Policy, working hash navigation, stable asset paths and deliberate caching. Publish no Node capture endpoint, secrets, cache files or personal fixtures. Review existing asset notices for public distribution before release. No hosting deployment or DNS change happens in this planning task.

IndexedDB belongs to an origin. A new hosted domain cannot automatically read the current localhost workspace; browser profiles and devices are also separate. [IndexedDB reference](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API)

Plan an explicit migration: export inventory, comparison and speed-team backups from the current app, then restore each through the corresponding validated hosted UI. Reuse existing backup formats. Test all three independently, including corrupt/unsupported files and failed writes. Keep the old local app and backups available until recovery is verified. Restore may involve different catalogue/API versions; show incompatibility instead of silently changing mechanics. Changing hosting domains later needs the same consideration. There is no automatic cross-device sync in this MVP.

## Tasks, dependencies and branch boundaries

All implementation tasks below are planned and unstarted. Use focused commits inside each feature branch, then a PR with validation; preserve commits and delete the source branch only after verified merge. Do not turn this table into one large implementation commit.

| Task | Proposed branch | Dependency | Deliverable / acceptance gate |
| --- | --- | --- | --- |
| O-10a | feat/companion-transport-spike | Owner requests implementation | Synthetic HTTPS-to-local proof; dated Chrome/Edge matrix, normal permissions, failure evidence and transport ADR. Stop packaging if unsuccessful |
| O-10b | feat/companion-pairing | O-10a | Protocol/schema/version contract, local approval, session lifecycle, origin/Host guards and negative authorization tests; no native work from unpaired clients |
| O-10c | feat/companion-windows-package | O-10a, O-10b | Packaging ADR and self-contained Windows installer prototype; normal-user runtime, explicit one-shot elevation, engine verification, notices, exit/repair/uninstall and clean-PC tests |
| O-10d | feat/hosted-scanner-connection | O-10b, O-10c | Web connection/pairing/status/recovery UI; both themes, keyboard/narrow checks, job ownership, preview/atomic replacement and unchanged manual import |
| O-10e | feat/hosted-workspace-migration | O-10d | Three-backup restore instructions and verified migration/rollback at a distinct origin; no automatic localhost reads or upload |
| O-10f | chore/hosted-release-pipeline | O-10c, O-10d, owner chooses domain/provider | Reproducible frontend/installer artifacts, signing/checksum policy, compatibility metadata, staging smoke tests and explicit release rollback procedure |
| O-10g | test/hosted-companion-acceptance | O-10e, O-10f | Clean Windows install plus real HTTPS/browser/Companion test; owner-driven actual HSR scan/count/precision/cleanup acceptance; privacy, version mismatch and multi-tab/restart tests |
| O-10h | chore/hosted-orbit-release | O-10g and owner release authorization | Publish chosen artifacts/site; verify download integrity, pairing and analysis paths, support docs and rollback. No release while required acceptance is pending |

Suggested commits per implementation branch: contract or decision first, runtime/domain behavior and meaningful tests next, UI/packaging integration after those checks, then verification and handoff. Share only synthetic fixtures. Keep SESSION_STATE.md current with the exact branch, checks actually run, services, blockers and next dependency after every milestone.

## Resume and completion criteria

Next implementation entry point, when requested: O-10a. Re-read AGENTS.md, SESSION_STATE.md, SCANNER.md and this document; recheck browser policies and inspect the actual runtime/client before changing it. Confirm the existing O-09 real-game acceptance limits remain recorded. Final domain/provider, transport, packaging framework, signing and update channel are open decisions, not assumed approvals.

Completion requires a normal player to install once without developer tools, explicitly pair the hosted website, scan the PC game through a bounded privileged reader and confirm a validated inventory import. The website's existing analysis must work without Companion. Every required release check needs recorded evidence, including owner-driven game validation; neither passing mocks nor a valid engine checksum establishes real inventory completeness.

Planning review PASS: implementation and unverified assumptions are labeled; volatile browser behavior has primary source links and a blocking feasibility gate; task dependencies, branch/commit rules, storage migration and real-account verification are explicit. No UI, runtime, installer, dependency or deployment was changed by this document.
