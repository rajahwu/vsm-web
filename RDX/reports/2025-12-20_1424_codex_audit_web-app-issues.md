# Web App Audit Issues

Date: 2025-12-20

## High

1) Broken import in legacy training hook
- File: `apps/vsm-school-web/src/hooks/useTrainingData.ts`
- Issue: Imports `../lib/supabaseClient` which does not exist (only `supabase/client.ts` is present). If the hook is used, it will crash at runtime.
- Suggested fix: Remove the legacy hook or update it to import `@/lib/supabase/client` and align types with the current training hooks.

2) Mission editor “Save to Core” is inert
- File: `apps/vsm-school-web/src/app/editor/page.tsx`
- Issue: The “Save to Core” button has no handler, so the primary CTA does nothing.
- Suggested fix: Wire the button to a save action (Supabase insert or local export), or remove/disable it until implemented.

## Medium

3) Mission progress never loads without a userId
- Files: `apps/vsm-school-web/src/app/mission/page.tsx`, `packages/gttm/mission/src/hooks/useMissionProgress.ts`
- Issue: `MissionSurface` expects a `userId` for progress queries but the app only passes `supabase`, so progress always appears empty.
- Suggested fix: Inject userId from auth/session or allow an anonymous mode keyed by device/session.

4) Feature flag unused for training data source
- Files: `apps/vsm-school-web/src/lib/features.ts`, `apps/vsm-school-web/src/app/training/page.tsx`
- Issue: `USE_DATABASE_TRAINING` is defined but the training page always uses DB hooks, leaving no fallback if data is missing.
- Suggested fix: Gate the DB hooks behind the flag and provide a fallback to registry data or empty-state guidance.

5) Duplicate mission UI implementations across packages
- Files: `packages/gttm/mission/src/components/*`, `packages/ritual/ui-lib/src/mission/*`
- Issue: Mission UI components exist in multiple packages, increasing maintenance risk and making ownership unclear.
- Suggested fix: Choose a single source-of-truth package and migrate all consumers to it.

## Low

6) Protocol Blackout duplicates story system
- File: `apps/vsm-school-web/src/app/blackout/ProtocolBlackout.tsx`
- Issue: Local story engine and UI duplicate `@gttm/story` functionality, which may drift from the canonical story package.
- Suggested fix: Replace with `@gttm/story` components or move the blackout content into the shared story registry.

7) Supabase env vars are hard-required
- File: `apps/vsm-school-web/src/lib/supabase/client.ts`
- Issue: Non-null assertions will crash the app if env vars are missing.
- Suggested fix: Add runtime guards with clear errors or provide a mock client for local/offline usage.
