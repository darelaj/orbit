# Working on Orbit

Orbit is a local HSR relic workspace: React, strict TypeScript and Vite. Keep English UI, both themes and the accepted HSR/Figma identity. Converse in the user's language.

## Scope and safety

Implement only the current request; planning does not authorize implementation. O-10 remains last priority and planning-only until requested. Preserve `../relic-lab`.

Validation, calculations and personal storage stay in the browser. Use synthetic QA; never start personal capture/UAC or clear user storage for testing. Preserve identities, precision, active/preview separation, validated replacement and rollback/backups. Disclose unsupported data instead of inventing values. Feature scope lives in README; domain contracts in TECHNICAL.

## Context and execution

Check Git status; read the short SESSION_STATE when resuming. Use `rg`, bounded reads and RTK for supported commands; inspect raw output when needed. Reuse unchanged context, retain long logs and report only useful results. Avoid repeated polling, metadata dumps and unchanged checks.

Read only what applies: README/package.json for setup; PLAN for milestones; TECHNICAL for architecture/math/storage/scanner/testing; DESIGN for UI; SOURCES for provenance; VERIFICATION for evidence. Do not load a stack of docs by default.

Skills under `.agents/skills`: Ponytail for coding; Karpathy for explicit use or complex assumptions/reviews, not automatically alongside Ponytail. Use HSR integrity for domain changes; antislop/UI and relevant React rules for UI; copywriting for substantive copy work, not routine docs edits. Comment cleanup uses antislop-code. Load only needed instructions; preserve upstream files/notices. Antislop DURING is this conversation's choice, not a global preference.

## Verification and handoff

Follow [TECHNICAL's proportional verification policy](docs/TECHNICAL.md#verification-policy). Run only affected checks; no automatic full local suite/build or repeated browser matrix. Broaden for concrete risk or failures. Keep required CI. This owner-directed policy takes precedence over generic skill checklists; never weaken data/security protections or overstate evidence.

Update affected contracts only. Keep plans in PLAN, evidence in VERIFICATION and SESSION_STATE brief: branch/dependencies, checks, limits, next action and owned services. No new report per task. Report results concisely; stop at the requested milestone.

## Git and runtime

Branch per task unless directed otherwise; preserve unrelated work/history. Commit focused changes with explicit paths, excluding secrets, exports, caches and build output. No force-push/reset. Merge dependencies first; verify merged commits in synchronized main before deleting their branches. Push/merge only within authorization.

Use npm's lockfile and `npm.cmd`. Reinstall only when needed; stop owned watchers before `npm ci`. Preserve `127.0.0.1:4173`; never expose it publicly, kill unrelated processes or reuse services without checking ownership. Stop owned QA services afterward.
