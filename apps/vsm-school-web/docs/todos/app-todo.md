# App TODO

Date: 2025-12-20

## P0
- Fix or remove the legacy training hook with the broken supabase import.
- Wire Mission Editor “Save to Core” or disable it until implemented.

## P1
- Provide `userId` to MissionSurface or add anonymous progress storage.
- Gate training data source with `USE_DATABASE_TRAINING` and add fallback/empty state.
- Consolidate mission UI components into a single package.

## P2
- Replace Protocol Blackout local story system with shared `@gttm/story`.
- Add runtime guards for missing Supabase env vars.
