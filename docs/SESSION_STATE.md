# Resume checkpoint

HSR equipment redesign checkpoint, 2026-11-06 (Asia/Jakarta). PR #1 through #5 are merged and their source branches have been removed. On resume, verify this redesign task's integration status before recreating a branch or PR.

## Owner instructions

- Build Orbit as a local web application on the owner's Windows PC.
- Read the complete HSR relic inventory, including unequipped relics; support comparison, min-maxing, and speed tuning.
- Use a framework, not plain JS/HTML/CSS. React + TypeScript + Vite is the selected starting stack.
- Install antislop and Karpathy skills, use them to rebuild the project, add relevant skills, and create AGENTS.md, docs, and planning.
- Antislop mode for this session: DURING, explicitly selected by the owner.
- Ship both light and dark modes, explicitly requested by the owner.
- The owner rejected the plain analytical UI and selected HSR character/relic inspiration, balanced density, prominent real character/splash art, top navigation, a wide work area, side details, and subtle panel/selection motion. The answers are incorporated into DESIGN.md. Palette/type are labeled proposals because those questions were not answered.
- Create a new branch per feature; commit per task; integrate through PRs. After successful merge and ancestry verification, delete the source branch remotely and locally. This supersedes the earlier branch-retention rule.
- Update AGENTS.md when working rules or project decisions change; routine progress belongs in this checkpoint.
- Maintain README.md when run instructions, requirements, supported workflows, architecture, storage, or implemented feature availability changes.
- Keep enough documentation to continue correctly after context/token exhaustion.

## Repository and files

- Checkout: `D:\Kuliah\Oprekan\Enka smth\orbit`.
- Remote: `origin = https://github.com/darelaj/orbit.git`.
- Initial clone was empty. Git author identity is already configured; do not replace it.
- Current task branch: `feat/hsr-visual-direction`, based on synchronized main at `efb37e9c1181af059d5eca57563bb0463256b7d6`. It replaces the old shell with a working HSR equipment demo, assets/notices, tests, and affected documentation.
- Main includes PR #1 through [PR #5](https://github.com/darelaj/orbit/pull/5). All seven earlier task branches were verified as ancestors of main and deleted remotely and locally. Do not try to restore them.
- Four upstream antislop skills have been installed under `.agents/skills` at commit `9504989f162a92b1996853eccbb3d8a86e73df68`.
- Karpathy and React skills are installed at pins in SKILLS.md. The local HSR integrity skill is present. All seven passed the official validator.
- `../relic-lab` contains the unfinished earlier plain JS prototype. Preserve it; do not ship it. It includes an untested engine and a game-data snapshot, but no app.js, no tests, and no completed UI.

## What is actually verified

- Repo metadata and empty clone verified.
- Node v24.16.0 and npm are installed.
- Git remote and local author identity verified.
- Python 3.12 was downloaded through uv into `.cache/python` to run the official skill installer. Cache is ignored by Git.
- All skill installations completed successfully. The official quick_validate.py reported `Skill is valid!` for each of seven folders using Python 3.12 and PyYAML through uv.
- The initial git whitespace check reported trailing whitespace in vendored React guidance. Upstream files were preserved intentionally; project-owned files are checked separately.
- React 19.3.1, TypeScript 7.0.2, Vite 8.3.6, and Vitest 5.1.0 are installed with exact versions and a lockfile.
- Historical O-03 baseline checks passed: typecheck, 1 theme persistence test, build, and a 703px browser smoke. That shell's visual direction was rejected and is superseded by O-03a below.
- O-01a documentation verification passed: all 11 referenced project documents, 7 skill entrypoints, and 6 documented npm scripts exist; `git diff --check -- AGENTS.md docs/SESSION_STATE.md docs/IMPLEMENTATION_PLAN.md` passed. No application tests/build were rerun because this task changes documentation only.
- Before the PR sequence, the combined framework was checked again: `npm.cmd run typecheck`, `npm.cmd test` (1 passing test), and `npm.cmd run build` all succeeded. PR #1's GitHub check/status lists were empty; no CI success was inferred from that absence.
- README task verification: relative documentation links, every documented npm script, runtime host/port/Node requirements, and the current source-tree entries were checked against local files. Scoped `git diff --check` passed. Application tests/build were not rerun for this documentation-only change.
- Windows recovery: the old Orbit Vite process was still listening on 127.0.0.1:4173 while npm ci failed to unlink the Rolldown native binding. The failed install also removed the local Vite launcher. Stopped the original exec session `90637` with Ctrl+C, then npm.cmd ci succeeded (88 packages added, audit reported 0 vulnerabilities). No package manifest or lockfile changes.
- Recovery checks passed: npm.cmd run build (includes TypeScript checking), npm.cmd test (1 test), and npm.cmd run dev. HTTP requests to /, /src/main.tsx, and /@react-refresh each returned 200. This is a startup/dependency check, not a new visual acceptance review.
- Recovery verification server exec session `34877` was stopped with Ctrl+C after the requests. Before a future npm ci, stop Orbit dev/preview/watch processes to release native file locks.
- O-03a implements local Acheron/relic artwork, eight synthetic fixtures, card selection, six equipped-slot shortcuts, name/set/main-stat search, slot/lock filters, resets, desktop side details, a narrow-screen native detail dialog, empty workspace, scanner guide, and persistent light/dark themes. Demo items and filters are transient; no real import, storage database, build math, optimizer, or timeline exists yet.
- Final O-03a checks passed: npm.cmd run typecheck; npm.cmd test (4 tests); npm.cmd run build. Browser evidence, control outcomes, contrast measurements, and antislop gate are in VERIFICATION.md. Owner visual review remains pending.
- Image sources/notices are in ASSETS.md, pinned to StarRailRes `dbe8cdfcfb0bf657b9fe1cf92d5537f118ccb487`. Original game files and upstream license are bundled locally; no external image/font runtime requests. Acheron artwork is about 4.6 MB; no performance score is claimed.
- O-03a verification Vite exec session `60406` was stopped after the walkthrough; port 4173 was checked free. The owner can run npm.cmd run dev (or npm run dev if their PowerShell policy permits). Browser viewport overrides were reset. Local ignored screenshots are under .cache/ui-redesign/; no private data appears in them.
- Earlier research successfully queried Enka HSR: HTTP 200 with 8 showcased characters and 6 equipped relics on the first character. This is not a full inventory method.

## Next actions

1. Check whether `feat/hsr-visual-direction` already has an open or merged PR. Finish its existing integration if needed; do not create a duplicate. After a successful merge, synchronize main, verify ancestry, and delete the source branch remotely and locally.
2. Let the owner review the implemented equipment design. Do not claim the visual direction is approved merely because its checks pass. Retain both themes and the source notices during revisions.
3. README distinguishes the working synthetic demo from planned personal-inventory/domain/worker/storage features. Preserve this distinction and update README in the affected implementation task.
4. Continue O-04 and later tasks when requested, using separate branches and focused PRs. The demo fixtures are not a parser/normalization contract; read IMPORT_FORMAT.md before replacing them with real imported records.

## Technical cautions discovered in the prototype

- The early beam-search prototype materializes every expansion and can allocate too much memory. Do not reuse it without a bounded queue or a different bounded search.
- Its partial Trace handling is incomplete, and its all-Traces calculation is not yet validated. Never present that as accurate character stats.
- Set properties include only some static bonuses. Conditional effects, enhanced characters, team buffs, and damage rotations require explicit scope.
- Export OCR loses hidden SPD decimals. UI and calculations must retain an accuracy label.
- Full inventory JSON has not been supplied by the owner. Use clearly labeled synthetic fixtures for tests/demo, and report real-account validation as pending until a real export is available.

## Commit and branch ledger

| Branch | Commit | Result | Integration |
| --- | --- | --- | --- |
| `chore/agent-guidance` | `a1647a8` | Agent routing, 7 validated skills, source pins, notices, ignore rules | In main; branch deleted remotely/locally after ancestry verification |
| `docs/project-plan` | `ba87730` | Product/design/architecture/import/math/testing/research docs and resume plan | Merged as `e7d6e1d`; branch deleted remotely/locally |
| `feat/react-workspace` | `e2ab362` | Framework shell and theme persistence | [PR #1](https://github.com/darelaj/orbit/pull/1) merged as `3af03bd`; technical baseline only, not accepted visual design |
| `docs/design-direction` | `e5c48b6`, `90ebecc` | HSR equipment design brief and checkpoint | [PR #2](https://github.com/darelaj/orbit/pull/2) merged as `5ccdb57`; brief only, followed by O-03a implementation |
| `docs/agent-operating-guide` | `41b648a`, `592a8af` | Expanded guide, current commands, PR and cleanup workflow | [PR #3](https://github.com/darelaj/orbit/pull/3) merged as `6964b82`; branch deleted remotely/locally |
| `docs/readme-architecture` | `fe9d523` | Setup/dev/build/preview instructions, current/planned architecture, README maintenance rule | [PR #4](https://github.com/darelaj/orbit/pull/4) merged as `acc06c4`; branch deleted remotely/locally |
| `docs/windows-dependency-recovery` | `00845c5` | Restore local dependencies and document Windows recovery | [PR #5](https://github.com/darelaj/orbit/pull/5) merged as `efb37e9`; branch deleted remotely/locally |
| `feat/hsr-visual-direction` | Resolve this task's integration record | HSR equipment demo, two themes, browser evidence, asset provenance | Verify its existing PR and branch refs on resume |

PR records and commits remain the integration history after source branch deletion. Confirm local/remote refs rather than trying to restore an intentionally removed task branch. Record pushes and merges only after verified success.

## Current blockers

No required design answer blocks work. Palette/type and reference URLs were not supplied; DESIGN.md labels proposed choices clearly. Do not repeat answered design questions. No personal export is available for account-specific acceptance testing; schema-derived synthetic fixtures remain usable.
