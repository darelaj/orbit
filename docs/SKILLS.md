# Project skills

Skills live in `.agents/skills` so their source and changes can be reviewed with the project. The official Codex skill-installer installed upstream folders with pinned `--ref` commits and a repository-local `--dest`. Repository copies are discoverable on the next turn/session; the current session read their instructions directly.

| Folder | Upstream | Pinned commit | Role |
| --- | --- | --- | --- |
| `antislop` | [miqdadbadjuber/anti-slop](https://github.com/miqdadbadjuber/anti-slop) | `9504989f162a92b1996853eccbb3d8a86e73df68` | UI direction, honesty, functional delivery gate |
| `antislop-ui` | same | same | Layout, contrast, themes, interaction |
| `antislop-copywriting` | same | same | Specific product text and natural prose |
| `antislop-code` | same | same | Comment hygiene; changes comments only when invoked for comment cleanup |
| `karpathy-guidelines` | [multica-ai/andrej-karpathy-skills](https://github.com/multica-ai/andrej-karpathy-skills) | `2c606141936f1eeef17fa3043a72095b4765b9c2` | Explicit assumptions, simple code, scoped changes, verifiable goals |
| `react-best-practices` | [vercel-labs/agent-skills](https://github.com/vercel-labs/agent-skills) | `1a2c79d4e6c4a2283dc2c614b6538cbe1ed5ca62` | Relevant client-side React, rendering, data and bundle guidance |
| `hsr-calculation-integrity` | Authored for Orbit | tracked in this repository | Inventory precision, stat math, search guarantees, AV boundaries |

The Karpathy package is community-maintained guidance inspired by Andrej Karpathy's observations. It is not presented as an official package authored by Karpathy. The original `forrestchang` repository redirects to `multica-ai`.

## Application

The owner selected antislop DURING in this build session. Both themes are requested. `DESIGN.md` records the design read and reasons. Future sessions resolve their mode according to the upstream skill; no global preference has been changed.

Apply React guidance relevant to a Vite client. Do not introduce Next.js, server actions, a cloud deployment, or extra caching libraries just because an upstream example uses them.

Keep upstream files intact. Record local overrides in AGENTS.md and project docs. Updating a skill is a separate reviewable task: inspect the upstream diff, update the pin, install, read, and validate before changing application behavior.

## Notices and validation

Antislop is MIT-licensed; its root notice is preserved at `third_party/antislop-LICENSE.txt`, along with bundled notices inside the installed skill folders. Karpathy and React skills declare MIT in their original SKILL.md metadata; those files are preserved. No project-wide license has been selected on the owner's behalf.

All seven skills passed the Codex `skill-creator/scripts/quick_validate.py` helper on 2026-11-05. Re-run it when adding or changing a skill. Upstream React guidance includes trailing whitespace; preserve the upstream copy and exclude vendor files from project-owned whitespace checks. Do not silently rewrite upstream instructions to satisfy a superficial check.
