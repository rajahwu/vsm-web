# RDX TODO - Web App Audit Follow-ups

Date: 2025-12-20

## P0
- [ ] Resolve broken import in `apps/vsm-school-web/src/hooks/useTrainingData.ts` (remove or fix supabase client path).
- [ ] Wire Mission Editor “Save to Core” button to a real action or disable it until implemented.

## P1
- [ ] Pass `userId` into `@gttm/mission` MissionSurface or add anonymous progress support.
- [ ] Use `USE_DATABASE_TRAINING` to switch between DB-backed training and fallback data/empty state.
- [ ] Pick a single package for mission UI components and migrate all consumers (avoid duplication across `@gttm/mission` and `@ritual/ui-lib`).

## P2
- [ ] Consolidate Protocol Blackout to use `@gttm/story` (or move story content into shared registry).
- [ ] Add Supabase env guards in `apps/vsm-school-web/src/lib/supabase/client.ts` for clearer local failures.
