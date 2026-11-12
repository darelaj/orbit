# Current checkpoint

Updated 2026-11-13 (Asia/Jakarta). Branch `test/build-workflow-acceptance`, based on `docs/lean-workflow-guidance` at `7b9b0c6` (integration status unchecked). Main baseline `5c122c4` already contains O-11f/g through PRs #28/#29; do not redo their integration.

O-11h synthetic acceptance implemented. Commit `124a7d0` adds three real-App scenarios to the existing two: character targets/save/confirmed speed/reload, stale profile/reimport callbacks, legacy/invalid import protection. Second commit adds the production fixture builder and scoped evidence/docs. No application, schema, dependency or native changes.

Checks: acceptance file 5/5 passed; strict TypeScript passed; isolated production fixture build and real bundled Worker → compare/save → confirmed speed/team-save browser smoke passed. No full suite or repeated visual matrix. VERIFICATION records numerical expectations and limits; TECHNICAL documents fixture commands. Temporary tab closed and owned preview stopped; no owned services remain.

Next: publish only if requested, checking the guidance-branch dependency first. O-11h still needs owner usability feedback and real-account/stat/native-cleanup acceptance; never mark those complete from synthetic tests. Separate leaderboard deferred. O-10 hosted Companion remains last priority and planning-only.
