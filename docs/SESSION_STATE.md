# Resume checkpoint

Updated: 2026-11-05, Asia/Jakarta.

## Owner instructions

- Build Orbit as a local web application on the owner's Windows PC.
- Read the complete HSR relic inventory, including unequipped relics; support comparison, min-maxing, and speed tuning.
- Use a framework, not plain JS/HTML/CSS. React + TypeScript + Vite is the selected starting stack.
- Install antislop and Karpathy skills, use them to rebuild the project, add relevant skills, and create AGENTS.md, docs, and planning.
- Antislop mode for this session: DURING, explicitly selected by the owner.
- Ship both light and dark modes, explicitly requested by the owner.
- Create a new branch per feature; commit per task.
- Keep enough documentation to continue correctly after context/token exhaustion.

## Repository and files

- Checkout: `D:\Kuliah\Oprekan\Enka smth\orbit`.
- Remote: `origin = https://github.com/darelaj/orbit.git`.
- Initial clone was empty. Git author identity is already configured; do not replace it.
- Current work branch: `docs/project-plan`. Main and `chore/agent-guidance` contain foundation commit `a1647a8`.
- Four upstream antislop skills have been installed under `.agents/skills` at commit `9504989f162a92b1996853eccbb3d8a86e73df68`.
- Karpathy and React skills are installed at pins in SKILLS.md. The local HSR integrity skill is present. All seven passed the official validator.
- `../relic-lab` contains the unfinished earlier plain JS prototype. Preserve it; do not ship it. It includes an untested engine and a game-data snapshot, but no app.js, no tests, and no completed UI.

## What is actually verified

- Repo metadata and empty clone verified.
- Node v24.16.0 and npm are installed.
- Git remote and local author identity verified.
- Python 3.12 was downloaded through uv into `.cache/python` to run the official skill installer. Cache is ignored by Git.
- All skill installations completed successfully. The official quick_validate.py reported `Skill is valid!` for each of seven folders using Python 3.12 and PyYAML through uv.
- The initial git whitespace check reported trailing whitespace in vendored React guidance. Upstream files were preserved intentionally; project-owned files are checked separately. No application checks have run because the framework application does not exist yet.
- Earlier research successfully queried Enka HSR: HTTP 200 with 8 showcased characters and 6 equipped relics on the first character. This is not a full inventory method.

## Next actions

1. Commit the completed documentation on `docs/project-plan` and integrate it into main without removing the branch.
2. Scaffold React + TypeScript + Vite on `feat/react-workspace`, install dependencies, run typecheck/tests/build, and add accurate run instructions.
3. Implement subsequent tasks in plan order, switching branches per feature and recording tested results below.

## Technical cautions discovered in the prototype

- The early beam-search prototype materializes every expansion and can allocate too much memory. Do not reuse it without a bounded queue or a different bounded search.
- Its partial Trace handling is incomplete, and its all-Traces calculation is not yet validated. Never present that as accurate character stats.
- Set properties include only some static bonuses. Conditional effects, enhanced characters, team buffs, and damage rotations require explicit scope.
- Export OCR loses hidden SPD decimals. UI and calculations must retain an accuracy label.
- Full inventory JSON has not been supplied by the owner. Use clearly labeled synthetic fixtures for tests/demo, and report real-account validation as pending until a real export is available.

## Commit and branch ledger

| Branch | Commit | Result | Integration |
| --- | --- | --- | --- |
| `chore/agent-guidance` | `a1647a8` | Agent routing, 7 validated skills, source pins, notices, ignore rules | Local main created at this foundation commit; not pushed yet |
| `docs/project-plan` | Pending this task commit | Product/design/architecture/import/math/testing/research docs and resume plan | Ready for project-owned whitespace and link checks |

No branches have been pushed yet. Retain feature branches after integration. Record a push only after confirming the remote refs.

## Current blockers

No user decision blocks repository/documentation work. No personal export is available for account-specific acceptance testing. This does not block implementing and testing the importer with schema-derived synthetic fixtures.
