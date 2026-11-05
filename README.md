# Orbit

Local Honkai: Star Rail relic workspace for importing an entire inventory, comparing builds, searching stat targets, and inspecting action-value timelines.

This repository uses React 19, TypeScript, and Vite. Light and dark themes share the same local workspace. The previous plain JavaScript prototype is not the application in this repository.

Start with [project documentation](docs/README.md), [implementation plan](docs/IMPLEMENTATION_PLAN.md), and [current session state](docs/SESSION_STATE.md). Agents must read [AGENTS.md](AGENTS.md).

No personal inventory is included. Scanner integration starts with JSON exported by [Reliquary Archiver](https://github.com/IceDynamix/reliquary-archiver) or [Kel-Z HSR Scanner](https://github.com/kel-z/HSR-Scanner). Enka only supplies public showcase data and cannot provide the complete inventory.

## Run locally

Use Node.js 22.12 or newer (development verified on Node 24.16.0).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:4173`. Keep the same browser origin for local persistence. On Windows PowerShell with restricted script execution, use `npm.cmd` instead of `npm`.

```sh
npm run typecheck
npm test
npm run build
npm run preview
```

Development and preview use the same port, so stop one before starting the other. `npm run build` creates `dist/`. Dependencies are pinned in package.json and package-lock.json.

Features listed in the plan are not necessarily implemented; see the session state for verified behavior.
