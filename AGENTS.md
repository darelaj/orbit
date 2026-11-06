# Working on Orbit

## Scope and owner decisions

Orbit is a local HSR relic workspace using React, strict TypeScript and Vite. Keep English product copy, light/dark themes and the accepted HSR/Figma equipment identity. Conversation follows the user's language.

Implement only the current request. Questions normally need an answer, not repository work. A plan request authorizes documentation, not implementation or deployment. The hosted website/Windows Companion proposal remains planning-only in docs/DEPLOYED_COMPANION_PLAN.md. Do not start O-10 code without an implementation request.

Validation, calculations and durable personal storage stay in the browser. The existing same-origin Windows scanner is governed by docs/SCANNER.md. Never start personal capture or elevation as a development check; real scans start from the owner's explicit Scan action. Cloud sync, telemetry, account login, game memory access, auto-salvage and unmodeled combat features remain outside scope. Preserve ../relic-lab as unfinished reference material.

## Read only what the task needs

For repository work, inspect git status --short --branch. Read the short docs/SESSION_STATE.md when resuming or when branch/dependencies are unclear. Check recent commits/remotes only when needed for branch or integration decisions. Already-read, unchanged instructions and skills need not be fetched again while available in context.

Use rg to find relevant headings/symbols, then bounded reads of affected sections. Inspect actual code before editing it. Increase the read range when a dependency or uncertainty requires it; do not concatenate whole documents or dump the repo map by default. If output truncates, narrow the next read instead of repeating the large command.

| Task | Relevant source, only when needed |
| --- | --- |
| Setup or implemented availability | README.md and package.json; lockfile for dependency versions |
| Milestone/dependency | Relevant entry in docs/IMPLEMENTATION_PLAN.md |
| Architecture/module boundary | Relevant section of docs/ARCHITECTURE.md |
| Import/storage/precision | docs/IMPORT_FORMAT.md and ENGINEERING_RULES inventory section |
| Stat math/search/timeline | docs/CALCULATIONS.md and corresponding ENGINEERING_RULES section |
| Scanner/native/API | docs/SCANNER.md; treat game/UAC acceptance as pending until observed |
| React/source organization | ENGINEERING_RULES implementation section |
| UI/design/assets | DESIGN.md, ENGINEERING_RULES UI section; FIGMA_HANDOFF.md for Figma fidelity, ASSETS.md for new assets |
| Test scenarios or prior evidence | Relevant section of docs/TESTING.md or docs/VERIFICATION.md |
| Hosted Companion work | docs/DEPLOYED_COMPANION_PLAN.md; all code milestones remain unstarted |
| Other documents/history | docs/README.md is the map; archive is optional historical lookup |

ENGINEERING_RULES.md above means docs/ENGINEERING_RULES.md. Current code establishes implementation; plans establish remaining work. Correct a relevant contradiction rather than treating old evidence as new verification.

## Skills

Load only applicable repository skills under .agents/skills, once while their unchanged content remains in context:

- Implementation/review: karpathy-guidelines/SKILL.md. Community guidance inspired by Karpathy, not an official package by him.
- Inventory/math/search/timeline: hsr-calculation-integrity/SKILL.md.
- UI planning/implementation/review: antislop/SKILL.md and antislop-ui/SKILL.md; React work also uses react-best-practices/SKILL.md and applicable rules, not its entire rule library.
- Human-facing prose: antislop-copywriting/SKILL.md with its core; comments: antislop-code/SKILL.md. Comment-cleanup restrictions do not block separately requested executable changes.

Antislop DURING was explicitly chosen in this conversation; this is session context, not a saved global preference. A new session follows the skill's mode-resolution instructions. Preserve upstream skills/notices; skill updates are separate work with provenance and validation in docs/SKILLS.md. Do not install extra frameworks or dependencies merely because a skill example uses them.

## Efficient execution and verification

Batch independent searches/reads and keep tool output scoped: relevant lines, failing diagnostics or compact status. Successful tests usually need a summary, not full logs. Reuse known valid server/browser handles; verify ownership before reuse. Do not launch browser automation for documentation, planning or backend-only changes without a concrete UI question.

State the acceptance target briefly for substantial work, then execute it. Keep progress updates concise and meaningful. Use external research when requested or required for changing/uncertain facts; reuse already-verified stable facts rather than researching an unchanged explanation again. Do not promise a numerical token saving without measurement.

| Change | Minimum meaningful verification |
| --- | --- |
| Documentation only | Review diff, relevant links/commands and scoped whitespace; no app tests/build/browser |
| Parser/storage | Valid/invalid fixtures, identity/precision preservation, atomic rollback and backup/restore |
| Formula/timeline | Independent numerical expectations and boundary tests |
| Search | Reference brute force, constraint legality, bounded work, cancellation/stale results |
| Scanner/backend | Affected synthetic process/API tests; Windows helper parsing when changed; no real capture/UAC |
| React interaction | Affected component flows and changed controls in browser when behavior needs it |
| Visual/layout/theme | Changed view in both themes, wide/narrow, keyboard/contrast/overflow; broaden breakpoints only for unresolved risk |
| Skill update | Validator plus source/pin/notices and relevant behavioral checks |

Run focused checks during development. For an application feature before integration, run the full suite and production build once on the final relevant code; build already includes strict TypeScript checking. Run a separate typecheck when it resolves uncertainty or CI requires it. Preserve required CI and inspect both OS jobs for the exact PR head. After later changes, rerun affected checks and let required CI verify the new head; do not repeat unchanged full local suites or UI matrices without a reason. Record which checks cover which code and never reuse stale evidence as a new pass.

Tests must verify behavior, not mirror source, wording or CSS classes. Do not add tests for reversible prose/format edits. A passing build cannot prove calculations, real capture or UI acceptance. UI delivery still requires the applicable antislop gate and actual control evidence in docs/VERIFICATION.md. A screenshot proves appearance, not complete behavior. Never invent performance, accuracy or accessibility certification.

## Git, runtime and data protection

Create a branch per feature or coherent docs task from its actual dependency. Preserve unrelated changes, author identity and published history. Keep focused commits per validated milestone; a small coherent docs edit can be one commit, while a feature must not become one giant final commit. Stage explicit paths and review staged changes; exclude personal exports, credentials, captures, caches, node_modules and dist. No force-push, destructive reset or forced branch deletion.

Integrate completed features through PRs with merge commits unless the owner selects otherwise. For stacked branches, integrate dependencies first. Verify merged status and every task commit in synchronized main before deleting that PR's source branch remotely and locally. Never delete unrelated or unmerged work. Verify remote refs when pushing is in scope; local commits are not a push. Do not ask again for already-authorized routine work; explain an actual approval requirement when one applies.

Use npm and the committed lockfile. Read package.json for exact scripts/Node requirements. In PowerShell use npm.cmd if npm.ps1 is blocked. No dependency reinstall or upgrade without need; stop owned Vite/watch processes before npm ci to avoid Rolldown locks. Local dev, preview and scanner runtime share 127.0.0.1:4173 and cannot run together. Preserve that browser origin; do not bind 0.0.0.0, kill unrelated processes or clear browser data for testing. Record owned service sessions and stop them after verification unless needed by the user.

Full inventory is scanner data; Enka supplies public showcase only. Preserve distinct items, IDs/provenance, unrounded values and separate active/preview/reroll stats. Validate everything before replacing saved data; keep independent backup types and failed-write recovery. Preserve unsupported identities and disclose unknown mechanics rather than silently dropping items or inventing zero stats. Use synthetic fixtures. Required domain details remain in docs/ENGINEERING_RULES.md and their contracts.

## Documentation and handoff

Update only documents whose contract, setup, working rules or implemented behavior actually changed. README changes when run commands, architecture, storage or availability change; routine progress belongs in SESSION_STATE.md. A new plan normally needs its main document plus a short link/checkpoint, not restating it in every document.

Keep SESSION_STATE.md current and short (aim below 400 words): branch/base/dependency, actual results, local changes/integration, pending limitations, next task and services. Replace the current state rather than appending every prior checkpoint. Keep detailed evidence in VERIFICATION.md, planning in its document and history in Git/archive. Do not read historical checkpoints automatically after compaction.

Before handoff, review final diff/status, relevant checks and focused commit(s). Report outcome, evidence and material remaining limitations concisely. Do not continue into a roadmap feature after completing a documentation request. Efficiency reduces unnecessary reading/output/repetition; it never removes data protection, domain correctness or required verification.
