# Working on Orbit

Orbit is a local web application for Honkai: Star Rail inventory analysis, build comparison, relic optimization, and speed tuning. The owner explicitly chose a framework, React + TypeScript + Vite, and working light and dark themes. Full inventory comes from scanner exports, not Enka UID lookup.

## Resume before changing code

Read these files in order:

1. `docs/SESSION_STATE.md`: current branch, last verified state, unfinished work, and next action.
2. `docs/IMPLEMENTATION_PLAN.md`: task IDs, dependencies, acceptance criteria, and validation.
3. `docs/PRODUCT.md` and the relevant domain document.
4. `DESIGN.md` for interface work.

Update the session state when finishing a task, changing branches, hitting a blocker, or ending a turn. Record actual commands and results. A plan is not evidence that a feature exists.

## Skills

Use the repository copies under `.agents/skills`; provenance belongs in `docs/SKILLS.md`.

- All implementation/review: read `karpathy-guidelines/SKILL.md`.
- Interface work: read `antislop/SKILL.md`, `antislop-ui/SKILL.md`, and `DESIGN.md`.
- UI text/document prose: read `antislop-copywriting/SKILL.md`.
- Comment edits: read `antislop-code/SKILL.md`; its comment-only scope does not prohibit feature implementation requested separately.
- React implementation/performance: read `react-best-practices/SKILL.md`; load applicable rule references, not every rule. Server-rendering rules do not apply to this local client application.
- Inventory, formulas, optimization, timeline: read `hsr-calculation-integrity/SKILL.md`.

The owner selected antislop DURING for the original build session. A future session follows the skill's mode-resolution rules; this historical choice is not a global preference. Both light and dark themes were explicitly requested. Use the text name Orbit; no custom logo or character art has been approved.

## Git workflow

- Repository: `https://github.com/darelaj/orbit.git`.
- Create a new branch per feature or coherent setup task. Examples: `chore/agent-guidance`, `docs/project-plan`, `feat/react-workspace`, `feat/inventory-import`, `feat/build-comparison`, `feat/relic-optimizer`, `feat/speed-tuning`.
- Make focused commits per completed task. Do not combine documentation, unrelated fixes, and multiple features into one catch-all commit.
- Before a commit, inspect staged changes and run checks relevant to that task. Keep a commit/branch ledger in `docs/SESSION_STATE.md`.
- Keep feature branches available for inspection. Integrate completed branches only after their documented checks pass. Never rewrite published history or force-push.
- Do not commit personal exports, tokens, packet captures, dependency folders, or local caches. Demo fixtures must be synthetic and labeled.

## Implementation boundaries

- Keep personal inventory processing and persistence in the browser. No uploads, account system, telemetry, or cloud hosting are in scope.
- Prefer feature modules and pure TypeScript domain functions. Keep optimization off the main thread.
- Preserve input decimals. An OCR export cannot recover hidden SPD decimals.
- Reject unsupported/malformed imports with actionable errors; retain the previous valid inventory. Never silently drop relics.
- Distinguish exact search from heuristic search, and state the candidate pool and limits. A weighted stat score is not simulated DPS.
- State formula scope and conditional effects. Do not guess missing Trace or character mechanics.
- Tests should verify domain invariants, malformed input, real import flows, and user-visible behavior. Do not test wording or implementation structure for its own sake.

## Checks

The framework setup task will define runnable `npm run typecheck`, `npm test`, and `npm run build` scripts. Until they exist, do not claim these checks passed. After each feature, record only checks actually executed. UI delivery requires the antislop gate plus browser evidence for both themes, narrow layouts, keyboard access, and functional controls.

The initial plain JS/HTML/CSS prototype is outside this repository at `../relic-lab`. It is unfinished reference material, not the project to ship. Do not remove it or copy its implementation wholesale.
