# Resume checkpoint

Integration checkpoint for PR #3, recorded after PR #1 and PR #2 were successfully merged. On resume, verify PR #3 and current refs before acting on the branch state below.

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
- Keep enough documentation to continue correctly after context/token exhaustion.

## Repository and files

- Checkout: `D:\Kuliah\Oprekan\Enka smth\orbit`.
- Remote: `origin = https://github.com/darelaj/orbit.git`.
- Initial clone was empty. Git author identity is already configured; do not replace it.
- Integration source: `docs/agent-operating-guide`, branched from `90ebecc`. It includes the framework, design brief, expanded guide, and the owner's corrected PR/branch-cleanup workflow. [PR #3](https://github.com/darelaj/orbit/pull/3) is its integration record; after it is merged, continue from synchronized `main`, not a deleted source branch.
- Remote main already includes PR #1 (`3af03bd11b9c1081936055950776da0d66e2a442`) and PR #2 (`5ccdb573690d355f5a9c70885499ea8800640453`). Local main needs synchronization after the integration sequence.
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
- O-03 checks passed: `npm.cmd run typecheck`, `npm.cmd test` (1 theme persistence test), and `npm.cmd run build`. The app currently contains the framework shell and theme toggle, not inventory features.
- Browser smoke verified the shell at a 703px-wide viewport: dark theme rendered, clicking the theme toggle rendered light theme. This is functional evidence only; the owner did not approve its visual direction.
- O-01a documentation verification passed: all 11 referenced project documents, 7 skill entrypoints, and 6 documented npm scripts exist; `git diff --check -- AGENTS.md docs/SESSION_STATE.md docs/IMPLEMENTATION_PLAN.md` passed. No application tests/build were rerun because this task changes documentation only.
- Before the PR sequence, the combined framework was checked again: `npm.cmd run typecheck`, `npm.cmd test` (1 passing test), and `npm.cmd run build` all succeeded. PR #1's GitHub check/status lists were empty; no CI success was inferred from that absence.
- Vite dev server is running at `http://127.0.0.1:4173/` in exec session `90637`. Reuse it while valid; check readiness before starting another process on the same port.
- Earlier research successfully queried Enka HSR: HTTP 200 with 8 showcased characters and 6 equipped relics on the first character. This is not a full inventory method.

## Next actions

1. Check PR #3. If open, finish its existing integration; do not create a duplicate PR. If merged, fetch origin and fast-forward local main.
2. Verify the task branch tips are ancestors of updated main, then delete their remote and local source branches if still present. Never force-delete an unmerged branch or delete main. The older foundation/documentation branches are already integrated and can be cleaned up by the same ancestry check.
3. Before another feature, read AGENTS.md and DESIGN.md. When UI development resumes, branch `feat/hsr-visual-direction` from synchronized main. The browser's old shell is not approved visual design; both themes and asset provenance remain required.
4. Continue O-04 and later tasks in plan order when requested. Use focused PRs and remove source branches after verified successful merges.

## Technical cautions discovered in the prototype

- The early beam-search prototype materializes every expansion and can allocate too much memory. Do not reuse it without a bounded queue or a different bounded search.
- Its partial Trace handling is incomplete, and its all-Traces calculation is not yet validated. Never present that as accurate character stats.
- Set properties include only some static bonuses. Conditional effects, enhanced characters, team buffs, and damage rotations require explicit scope.
- Export OCR loses hidden SPD decimals. UI and calculations must retain an accuracy label.
- Full inventory JSON has not been supplied by the owner. Use clearly labeled synthetic fixtures for tests/demo, and report real-account validation as pending until a real export is available.

## Commit and branch ledger

| Branch | Commit | Result | Integration |
| --- | --- | --- | --- |
| `chore/agent-guidance` | `a1647a8` | Agent routing, 7 validated skills, source pins, notices, ignore rules | Already in main; source ref is eligible for verified cleanup |
| `docs/project-plan` | `ba87730` | Product/design/architecture/import/math/testing/research docs and resume plan | Merged as `e7d6e1d`; source ref is eligible for verified cleanup |
| `feat/react-workspace` | `e2ab362` | Framework shell and theme persistence | [PR #1](https://github.com/darelaj/orbit/pull/1) merged as `3af03bd`; technical baseline only, not accepted visual design |
| `docs/design-direction` | `e5c48b6`, `90ebecc` | HSR equipment design brief and checkpoint | [PR #2](https://github.com/darelaj/orbit/pull/2) merged as `5ccdb57`; redesigned UI remains unimplemented |
| `docs/agent-operating-guide` | `41b648a` and its workflow/checkpoint follow-up | Expanded guide, current commands, PR and cleanup workflow | [PR #3](https://github.com/darelaj/orbit/pull/3); check its merged state and main ancestry on resume |

PR records and commits remain the integration history after source branch deletion. Confirm local/remote refs rather than trying to restore an intentionally removed task branch. Record pushes and merges only after verified success.

## Current blockers

No required design answer blocks work. Palette/type and reference URLs were not supplied; DESIGN.md labels proposed choices clearly. Do not repeat answered design questions. No personal export is available for account-specific acceptance testing; schema-derived synthetic fixtures remain usable.
