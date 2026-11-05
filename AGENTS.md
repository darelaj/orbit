# Working on Orbit

## Project and scope

Orbit is a local Honkai: Star Rail web application for a PC player. Its intended workflows are complete relic inventory inspection, six-slot build comparison, relic optimization, and action-value speed tuning.

The owner requires React + TypeScript + Vite, working light and dark themes, a new branch per feature, focused commits per task, pull requests for integration, and documentation that survives context loss. After a PR is successfully merged and verified, delete its source branch remotely and locally. Full inventory comes from scanner exports. Enka UID lookup only supplies public showcase data.

Implement the task requested in the current conversation. Keep unfinished project work in the plan; a documentation request does not authorize unrelated UI or calculation changes. Do not treat a planned feature as implemented.

Personal inventory processing and persistence belong in the browser. Cloud hosting, telemetry, account login, direct packet capture, game memory access, scanner execution, gacha features, auto-salvage, and whole-team allocation are outside the initial scope unless the owner changes it. Do not introduce these because a reference application supports them.

The earlier prototype at ../relic-lab is unfinished reference material outside this repository. Preserve it. Do not copy its engine, data snapshot, or visual design without inspecting provenance, correctness, and applicability.

## Sources of truth

Use this map instead of duplicating full specifications here:

| File | Authority and when to read |
| --- | --- |
| README.md | Human-facing setup, run commands, current feature availability, and architecture overview |
| docs/SESSION_STATE.md | Current branch, latest verified work, unfinished tasks, blockers, running services, next action; first read on resume |
| docs/IMPLEMENTATION_PLAN.md | Task IDs, dependencies, acceptance criteria, branch boundaries |
| docs/PRODUCT.md | Product workflows and exclusions |
| DESIGN.md | Accepted design decisions, proposed visual choices, screen composition, themes, motion |
| docs/ARCHITECTURE.md | Module boundaries, client processing, persistence, workers |
| docs/IMPORT_FORMAT.md | Scanner schemas, item identity, precision, validation, backup semantics |
| docs/CALCULATIONS.md | Units, formulas, set scope, search guarantees, timeline assumptions |
| docs/TESTING.md | Test scenarios and browser acceptance |
| docs/SKILLS.md | Skill sources, pins, notices, validation history |
| docs/RESEARCH.md | Dated research and source links, not proof that an integration is currently working |
| docs/VERIFICATION.md | Actual UI walkthrough, scoped delivery gate, and verification limits |
| docs/ASSETS.md | Artwork/icon provenance, source pins, attribution, and bundled notices |

Current owner instructions take precedence over older project decisions. The source code establishes what exists; the plan establishes what remains. If a document and code disagree, investigate and correct the affected document or implementation within the task's scope. Do not silently choose whichever interpretation is easier.

Keep volatile commit hashes, process/session IDs, test counts, and task status in SESSION_STATE.md, not in this operating guide. Inspect package.json and the lockfile for current dependency versions. Update this guide when working rules, scope, architecture, verification requirements, or accepted owner decisions change; use the checkpoint for routine progress instead of rewriting AGENTS.md every task.

Maintain README.md in the same task when setup/Node requirements, commands, supported workflows, architecture boundaries, storage behavior, or implemented feature availability changes. Verify its examples against the code and package scripts. Label future modules and features as planned; do not rewrite the README for routine progress that belongs in SESSION_STATE.md.

## Starting or resuming work

1. Confirm the checkout and inspect git status --short --branch, the recent log, and the configured remote. Do not assume the current branch is main or that the working tree is clean.
2. Read SESSION_STATE.md and IMPLEMENTATION_PLAN.md. Identify the requested task, its acceptance criteria, and the next unfinished dependency.
3. Read the relevant domain document and skills below. UI work also requires the revised DESIGN.md.
4. Inspect the actual affected files. Proposed directories in ARCHITECTURE.md may not exist yet; do not describe them as implemented.
5. State a short plan with verifiable outcomes. Surface material assumptions before implementing. Do independent work while a genuinely necessary clarification is pending.
6. Reuse a valid local preview process when one exists. Verify that its checkout, origin, and port match this workspace before starting another.

Preserve unrelated local changes. Do not reset, discard, stash, switch away from conflicting work, or overwrite files to manufacture a clean baseline. If changes overlap the task, inspect them and resolve the conflict with the owner when necessary.

After compaction, resume from the checkpoint rather than restarting the project, reinstalling skills, repeating answered questions, or recreating committed work.

## Skills and routing

Read the repository copies under .agents/skills. Do not infer a skill's behavior from its name or copy all upstream instructions into this file.

| Work | Skill to read |
| --- | --- |
| Implementation, review, refactoring | karpathy-guidelines/SKILL.md |
| UI planning, implementation, or visual review | antislop/SKILL.md and antislop-ui/SKILL.md |
| Product text and documentation prose | antislop-copywriting/SKILL.md |
| Comment writing or comment cleanup | antislop-code/SKILL.md |
| React rendering, components, or performance | react-best-practices/SKILL.md and relevant rule references |
| Inventory, stat math, optimization, or timeline | hsr-calculation-integrity/SKILL.md |

Karpathy guidance is a community package inspired by Karpathy, not an official package authored by him. Apply simplicity, explicit assumptions, scoped changes, and verifiable goals.

Antislop DURING was explicitly selected for the original build session. This is recorded session context, not a changed global preference. A future session follows the upstream skill's mode-resolution instructions; do not invent a global preference or add extra approval gates.

Antislop-code limits comment-cleanup edits to comments. It does not prohibit separately requested feature implementation. React guidance uses some Next.js examples; this project is a Vite client and does not need Next.js, SSR, server actions, or cloud integrations to follow applicable client-side guidance.

Preserve upstream skill files and bundled notices. Updating a skill is a separate task: inspect the diff, update its pin/provenance in SKILLS.md, install, read, and validate it. Do not rewrite vendor files merely to remove upstream trailing whitespace.

## Branches, commits, and integration

Repository remote: https://github.com/darelaj/orbit.git.

- Create a new branch per feature or coherent documentation/setup task. Use descriptive names such as docs/agent-operating-guide, feat/inventory-import, feat/build-comparison, feat/relic-optimizer, or feat/speed-tuning.
- Check the actual dependency branch before creating it. Some existing branches are stacked and not merged into main; branching from main blindly can lose required framework or design work.
- Record the base branch/commit and integration status in the checkpoint. An unmerged feature branch is not a missing feature if the checkpoint says where it lives.
- Make focused commits per completed task. Keep a design change, importer behavior, and a search algorithm in separate reviewable commits.
- Stage explicit task files and inspect git diff --cached and the staged file list. Never include personal exports, tokens, packet captures, node_modules, dist, local caches, or unrelated changes.
- Run checks appropriate to the change before committing. A command must succeed; the final command's exit status does not erase an earlier failure.
- Preserve existing author identity and published history. Do not force-push, amend published commits, or run destructive Git cleanup. Branch deletion is allowed after the successful-merge checks below.
- Integrate completed features through a pull request after their documented checks pass. For stacked branches, merge dependencies first so each PR describes its actual remaining diff. Preserve focused task commits with a merge commit unless the owner selects another strategy.
- Verify the PR is merged and the intended head commit is included in the updated main branch, then delete that PR's source branch both remotely and locally. Switch away before deleting the current branch. Never delete an unmerged branch, main, or unrelated work; do not use forced local deletion to bypass a failed ancestry check.
- When pushing is in scope, verify the resulting remote ref against the intended local commit. Record failure or authentication/network limitations accurately; a local commit is not a successful push.

Use the user's existing authorization for ordinary reversible task work. Ask for missing information only when it changes the result materially or an applicable instruction explicitly requires it. If a skill requires a pause or confirmation, identify its exact file and instruction; do not create additional approval flows from general caution.

## Implementation structure

React components manage interface state and interactions. Pure TypeScript modules own validation, normalization, math, search, and timeline behavior. Module Web Workers own expensive search. IndexedDB owns durable personal workspace data; a small versioned localStorage key can hold theme preference.

Follow ARCHITECTURE.md as features are introduced. Keep modules near their feature or domain and extract shared code when there is a real second use. Do not create empty directories, speculative abstractions, or a generic framework around a single feature.

- Keep strict TypeScript enabled. Treat imported JSON and persisted external data as unknown until validated; do not hide schema problems with broad casts or any.
- Prefer explicit domain types and pure functions whose inputs include calculation assumptions.
- Derive filtered inventory, calculated stats, and timeline events from current inputs rather than maintaining duplicate effect-driven state.
- Keep profile inputs, source data, computed output, and display formatting separate.
- Preserve numeric precision during parsing and calculation. Round only for display or a documented game rounding rule.
- Keep expensive computation off the main thread and avoid rendering thousands of full item components at once.
- Handle plausible boundary failures with actionable feedback. Do not silently catch import/storage failures and claim success.
- Do not refactor unrelated files, change formatting across the repository, or add dependencies merely to resemble an upstream example.
- Comments explain non-obvious constraints, units, protocols, or tradeoffs. Avoid narration, decorative separators, and vague TODOs.

## Dependencies and local runtime

Use npm and the committed package-lock.json. Inspect existing scripts before changing commands. Pin intentional dependency changes and update the lockfile in the same task. Do not run a broad upgrade, change package managers, or install an unrelated UI/state/chart stack without a concrete need.

Current commands:

| Purpose | Command |
| --- | --- |
| Reproduce dependencies | npm ci |
| Local development | npm run dev |
| Type checking | npm run typecheck |
| Unit/component tests | npm test |
| Watch tests during development | npm run test:watch |
| Production build | npm run build |
| Preview the built app | npm run preview |

On Windows PowerShell, use npm.cmd if execution policy blocks npm.ps1. Run from the repository root. Read the Node requirement from package.json.

Development and preview bind to 127.0.0.1:4173 and cannot occupy the port together. Keep a consistent origin because browser storage belongs to hostname, port, and browser profile. Do not expose the server on 0.0.0.0 or move inventory processing to a server as an incidental workaround.

A running service recorded in SESSION_STATE.md may be stale in a new session. Check it before reuse. Record newly started services and how to stop them. Never kill an unrelated process merely to free the port.

## Inventory and persistence invariants

Read IMPORT_FORMAT.md before changing an adapter or normalized model.

- Full inventory includes equipped and unequipped relics, including locked/discarded records. Scanner-side filters may omit items; Orbit cannot reconstruct absent data.
- Validate the entire supported export before replacing the active inventory. Invalid input must leave the last valid workspace available and identify the offending record or field.
- Define explicit limits and supported schema versions. Do not accept a new format just because it contains a relics array.
- Identical stats do not mean identical items. Preserve distinct relics; detect duplicate external IDs deliberately.
- Distinguish durable game IDs from OCR scan-assigned IDs. Saved builds must not silently point to a different item after reimport.
- Keep active, preview, and reroll substats separate. An alternative or unrevealed substat does not contribute to the current build.
- Preserve provenance and precision. OCR cannot recover hidden SPD decimals; unknown sources must not be labeled exact.
- Unknown catalogue records must not silently disappear or become zero-valued mechanics. Preserve supported raw identity and disclose missing calculation data, or report an explicit unsupported record.
- Persist only the application's required fields, not unrelated gacha/material data or credentials from a broad scanner export.
- Version workspace records and backups. Validate restores and handle migration/storage failure explicitly.
- Backups and saved builds need round-trip and reimport behavior tests. Do not clear browser data as a routine development step.

Personal exports, credentials, logs containing sensitive fields, captures, and real-account fixtures do not belong in Git. Use clearly labeled synthetic fixtures. Do not fetch or upload personal data merely to populate a screenshot.

## Calculation and comparison invariants

Read CALCULATIONS.md and the HSR integrity skill before changing formulas.

Use the documented flat/percentage units. Compute HP/ATK/DEF from the appropriate character-plus-Light-Cone base, then percentage and flat additions. Speed-percent buffs use character base SPD, not final panel SPD.

Apply only explicitly modeled properties. Conditional set bonuses, partial Trace mappings, enhanced kits, conversion passives, combat buffs, and rotations require real support or a visible limitation. Do not infer effect logic from descriptive text or guess a missing mapping.

A and B compare the same character/profile unless a separately specified workflow permits otherwise. Keep A stable while B changes. Expose relevant input corrections and assumptions near the resulting measurements.

A weighted score or ATK/CRIT index is not simulated DPS. Label it as an index and do not claim it represents every character archetype. Preserve decimal SPD in the comparison and carry its source precision into speed tuning.

## Optimizer and worker invariants

Every returned build must contain one relic per slot and satisfy all requested constraints. Validate legality separately from ranking, including set counts and exclusions.

Exact search means exhaustive enumeration or sound bounding of the declared candidate space. If items were screened out, the guarantee is limited to that disclosed pool. Beam search, truncated enumeration, and resource-capped search must not be presented as a global optimum.

Bound intermediate memory and retained results. Do not materialize all combinations or every beam expansion before sorting. Report search mode, pool size, evaluated count, limits, and no-result meaning.

Associate messages with a run ID and inventory revision. Terminate workers for cancellation/new work, release resources on unmount, and reject stale progress/results. A new inventory invalidates an old search. Cancellation must remain responsive while a synchronous worker loop is running.

## Speed-tuning invariants

AV equals 10000 divided by effective SPD. The first cycle spans 150 AV and later cycles span 100 AV. Keep boundary tolerance and equal-timestamp ordering explicit.

The initial model uses fixed speed/buffs and an initial action-advance adjustment. Do not imply support for changing mid-combat speed, repeated advance, delay, summons, ultimates, or a full rotation unless implemented and tested.

Reject non-finite/non-positive speeds, use a bounded horizon/event count, and preserve the precision label. Test speeds close to cycle thresholds and keep a readable numeric event list alongside the timeline.

## UI and assets

The revised DESIGN.md supersedes the rejected plain analytical shell. Its accepted direction is HSR character/relic equipment composition, balanced density, prominent real artwork, top navigation, wide work area, a side details panel, and subtle user-triggered transitions.

Both themes are required and must work equally. Palette and typography are still documented proposals, not an owner-selected brand specification. Do not repeat answered design questions or silently call the old UI approved.

- Keep relics visual and key stats visible without hover. Maintain stable six-slot positions and aligned measurements.
- Character artwork represents the selected character/context. It cannot cover controls, obscure numeric contrast, or become a random background.
- The Orbit name is a text wordmark. No custom logo or fabricated official-looking game assets have been approved.
- Record asset/font source and applicable notices before bundling. Preserve explicit dimensions/aspect ratios and useful missing-image fallbacks.
- Use theme tokens. Verify foreground/background pairs, focus, errors, selection, images, and disabled controls in both modes.
- Use native semantic controls, visible labels, logical keyboard order, focus return, and Escape for dialogs. Minimum touch targets are 44px.
- Keep the page within the viewport; any necessary table scrolling stays inside a named region.
- Respect reduced motion. No endless pulses, particles, counting animations, or disruptive movement of numeric results.
- Provide real empty, loading, error, cancelled, and no-result states. Demo content is clearly synthetic.
- Product copy is Indonesian with familiar HSR stat labels; code identifiers and developer docs use consistent English. Follow an explicit user language request when it differs.

## Verification by change type

Run the smallest meaningful checks first. Broaden only for a real failure, shared impact, or an unresolved concern.

| Change | Evidence required |
| --- | --- |
| Documentation only | Inspect the diff, verify referenced files/commands, and run a scoped whitespace check; application builds are unnecessary unless behavior/config also changes |
| Skill change | Official skill validator, source/pin/notices review, and relevant behavioral checks |
| Parser/storage | Valid/invalid fixtures, no-loss identity/precision tests, rollback, restore/backup behavior |
| Formula/timeline | Independent numeric expectations and boundary tests, not just snapshots |
| Search | Small reference brute force, constraint legality, bounded work, cancellation/stale-result tests |
| React/interaction | Relevant component flows, typecheck, tests, build, and browser evidence for changed controls |
| Visual/theme | Browser walkthrough of both themes, wide/narrow layouts, keyboard access, contrast, and asset failure |

For application features, run npm run typecheck, npm test, and npm run build before integration. A passing build does not prove formulas, persistence, UI behavior, or design acceptance. Do not add tests that merely assert wording, CSS class names, file layout, or the implementation itself.

Record exact commands, results, meaningful counts, and limitations. Do not report an old test run as verification of newer runtime changes. Do not invent performance or accessibility scores.

For final UI delivery, complete the antislop gate and record control-by-control outcomes in docs/VERIFICATION.md. Only claim interactions actually exercised. A screenshot proves appearance, not complete functionality.

## Checkpoint and task completion

Update SESSION_STATE.md when completing a task, switching branches, changing direction, encountering a blocker, or ending work. Keep it concise and sufficient for another session to resume.

A useful checkpoint includes:

1. Current branch and base, latest relevant commits, local changes, push/integration status.
2. What actually works, with executed checks and their outcomes.
3. What is incomplete, rejected, assumed, or not tested on a real account.
4. Current owner decisions, including design changes and scope restrictions.
5. The next concrete task and affected files, plus any dependency or necessary input.
6. Relevant running services and known correctness risks.

Update affected domain docs when behavior changes, and task status only when acceptance criteria pass. Do not leave a completed task marked pending or turn a rejected design into a completed UI milestone.

Before handing off a task, inspect the final diff and working tree, account for unrelated changes, create its focused commit, and verify any requested push. Report the outcome, evidence, and remaining limitation in plain language. For a documentation-only task, do not start building the next feature merely because it appears in the roadmap.
