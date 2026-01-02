# App Issues

Date: 2025-12-20

## High
- Broken import in legacy training hook: `apps/vsm-school-web/src/hooks/useTrainingData.ts` references a missing `supabaseClient` file.
- Mission editor “Save to Core” button has no handler and does nothing.

## Medium
- Mission progress does not load because `userId` is never provided to `MissionSurface`.
- Training data source flag is unused; DB training is always on.
- Mission UI components are duplicated across packages (`@gttm/mission` vs `@ritual/ui-lib`).

## Low
- Protocol Blackout maintains a local story system instead of using the shared story package.
- Supabase env vars are hard-required and can crash locally when missing.
