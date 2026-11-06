# Documentation map

| Document | Purpose |
| --- | --- |
| [SESSION_STATE.md](SESSION_STATE.md) | Resume the work: current branch, verification, blockers, next action |
| [ENGINEERING_RULES.md](ENGINEERING_RULES.md) | Technical guardrails; read only the implementation/data/math/search/speed/UI section affected by the task |
| [IMPLEMENTATION_PLAN.md](IMPLEMENTATION_PLAN.md) | Ordered tasks, dependencies, acceptance criteria, branch and commit boundaries |
| [PRODUCT.md](PRODUCT.md) | User goals, accepted scope, exclusions |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Framework, modules, persistence, worker boundary |
| [IMPORT_FORMAT.md](IMPORT_FORMAT.md) | Supported exports, precision, validation, update semantics |
| [SCANNER.md](SCANNER.md) | Integrated Windows reader, engine pin, local API, lifecycle and verification limits |
| [DEPLOYED_COMPANION_PLAN.md](DEPLOYED_COMPANION_PLAN.md) | Proposed hosted web/Windows Companion roadmap; implementation not authorized by the planning request |
| [CHARACTER_BUILD_WORKFLOW_PLAN.md](CHARACTER_BUILD_WORKFLOW_PLAN.md) | O-11 proposal: character profiles, target-based stat/CV search, build assessment and simpler workspaces; planning only |
| [CALCULATIONS.md](CALCULATIONS.md) | Stat formulas, search guarantees, speed assumptions |
| [TESTING.md](TESTING.md) | Meaningful checks and browser verification |
| [VERIFICATION.md](VERIFICATION.md) | Executed UI walkthrough, evidence, and antislop delivery gate |
| [ASSETS.md](ASSETS.md) | Pinned artwork/icon sources and preserved notices |
| [FIGMA_HANDOFF.md](FIGMA_HANDOFF.md) | Figma source frames, approved implementation revisions, component mapping |
| [SKILLS.md](SKILLS.md) | Installed skills, pinned sources, routing, licenses |
| [RESEARCH.md](RESEARCH.md) | Verified API/scanner findings and source links |
| [../DESIGN.md](../DESIGN.md) | Product direction, two themes, hierarchy and interaction decisions |

Documentation must distinguish decisions, implementation, and evidence. Update the affected domain document when its behavior changes. Keep the session checkpoint concise enough that a fresh agent can resume without rereading the chat.

The current checkpoint contains active state only. Historical checkpoints remain in [the session archive](archive/SESSION_HISTORY_2026-11-07.md) and Git history; do not load them during routine resumes. AGENTS.md owns task-scoped reading and verification policy. A small documentation change does not require an application build or a browser audit.
