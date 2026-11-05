# Resume checkpoint

Updated: 2026-11-05, Asia/Jakarta.

## Owner instructions

- Build Orbit as a local web application on the owner's Windows PC.
- Read the complete HSR relic inventory, including unequipped relics; support comparison, min-maxing, and speed tuning.
- Use a framework, not plain JS/HTML/CSS. React + TypeScript + Vite is the selected starting stack.
- Install antislop and Karpathy skills, use them to rebuild the project, add relevant skills, and create AGENTS.md, docs, and planning.
- Antislop mode for this session: DURING, explicitly selected by the owner.
- Ship both light and dark modes, explicitly requested by the owner.
- The owner rejected the initial plain analytical UI and selected an HSR-inspired direction: game atmosphere, visual relic panels, and more characterful typography. A deeper design interview is pending; do not continue UI styling until those answers are incorporated into DESIGN.md.
- Create a new branch per feature; commit per task.
- Keep enough documentation to continue correctly after context/token exhaustion.

## Repository and files

- Checkout: `D:\Kuliah\Oprekan\Enka smth\orbit`.
- Remote: `origin = https://github.com/darelaj/orbit.git`.
- Initial clone was empty. Git author identity is already configured; do not replace it.
- Current work branch: `feat/react-workspace`. Main includes documentation merge `e7d6e1d` and foundation commit `a1647a8`.
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
- Vite dev server is running at `http://127.0.0.1:4173/` in exec session `90637`. Reuse it while valid; check readiness before starting another process on the same port.
- Earlier research successfully queried Enka HSR: HTTP 200 with 8 showcased characters and 6 equipped relics on the first character. This is not a full inventory method.

## Next actions

1. Save the tested framework baseline on `feat/react-workspace`. Do not present its current visual design as approved.
2. Create `docs/design-direction` and revise DESIGN.md after the owner's design-interview answers arrive. The interview asks about HSR screen inspiration, density, permission for game assets, workspace layout, palette/type, motion, and reference URLs.
3. Implement the approved design direction on its own feature branch, retaining both themes.
4. Continue O-04 and subsequent tasks in plan order. Keep domain correctness and feature work separate from design approval.

## Technical cautions discovered in the prototype

- The early beam-search prototype materializes every expansion and can allocate too much memory. Do not reuse it without a bounded queue or a different bounded search.
- Its partial Trace handling is incomplete, and its all-Traces calculation is not yet validated. Never present that as accurate character stats.
- Set properties include only some static bonuses. Conditional effects, enhanced characters, team buffs, and damage rotations require explicit scope.
- Export OCR loses hidden SPD decimals. UI and calculations must retain an accuracy label.
- Full inventory JSON has not been supplied by the owner. Use clearly labeled synthetic fixtures for tests/demo, and report real-account validation as pending until a real export is available.

## Commit and branch ledger

| Branch | Commit | Result | Integration |
| --- | --- | --- | --- |
| `chore/agent-guidance` | `a1647a8` | Agent routing, 7 validated skills, source pins, notices, ignore rules | Main and feature branch pushed and verified |
| `docs/project-plan` | `ba87730` | Product/design/architecture/import/math/testing/research docs and resume plan | Merged into main as `e7d6e1d`; pushed and verified |
| `feat/react-workspace` | Pending | Framework shell, exact dependency versions, working theme persistence, run scripts | Typecheck, 1 test, production build, two-theme browser smoke passed; visual direction rejected and being revised |

Remote heads for main and the first two task branches were confirmed with `git ls-remote --heads origin`. Retain feature branches after integration. Record a push only after confirming the remote refs.

## Current blockers

UI design is waiting for the deeper design-interview answers. The owner chose HSR inspiration and both themes; do not repeat those questions. No personal export is available for account-specific acceptance testing. This does not block domain parsing/math development with schema-derived synthetic fixtures.
