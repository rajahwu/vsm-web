# RDX Report: UI/App/Packages Snapshot

**Date:** 2025-12-20 04:11
**Scope:** Current UI surfaces, app routing, and package layout in `vsm_school_merger`.

## UI State (Apps)

- **Landing page:** `apps/vsm-school-web/src/app/page.tsx` provides the marketing/hero layout, multi-section content, and CTA routing to `/mission`.
- **Mission surface:** `apps/vsm-school-web/src/app/mission/page.tsx` gates the mission UI behind `NEXT_PUBLIC_USE_MISSION_SURFACE`. When enabled, it renders `MissionSurface` from `@gttm/mission` and supplies a Supabase client.
- **Training flow:** `apps/vsm-school-web/src/app/training/page.tsx` is fully DB-backed via `@gttm/mission` hooks (training windows, blocks, cards). The view state is persisted in `localStorage` and sessions are shipped to the `atoms` table.
- **Mission editor:** `apps/vsm-school-web/src/app/editor/page.tsx` provides an authoring UI for blocks/cards with local state and JSON export; no backend persistence is wired.
- **Other routes present:** `apps/vsm-school-web/src/app/blackout`, `apps/vsm-school-web/src/app/genesis`, `apps/vsm-school-web/src/app/tracker`, `apps/vsm-school-web/src/app/workbook`, `apps/vsm-school-web/src/app/blackjack` (not audited in depth here).

## Training UI Data Path (Current)

- Data hooks live in `packages/gttm/mission/src/hooks/useTrainingData.ts` and query `training_windows`, `training_blocks`, and `training_cards`.
- `apps/vsm-school-web/src/app/training/page.tsx` drives UI state from these hooks and prevents entering the card view until cards are loaded.
- Session shipments to Supabase are inserted into `atoms` with `type: vsm_session` and include the active card snapshot.

## Mission Surface (Current)

- `packages/gttm/mission/src/components/MissionSurface.tsx` renders the pulse → track → ritual → success flow with Tailwind classes.
- Progress is read from `atoms` in `packages/gttm/mission/src/hooks/useMissionProgress.ts` and expects a `userId`. When `userId` is absent, it skips loading and returns empty progress.

## Package Map (Current)

- `packages/gttm/*`
  - `brand`, `codex`, `components`, `mission`, `story`.
  - `@gttm/mission` exports UI, registry, story registry, and training hooks.
- `packages/ritual/*`
  - `brand`, `components`, `ui-lib`, `codex`.
  - `@ritual/ui-lib` now includes mission UI components (CodexViewer, PrimePanel, WorkSurface, MissionSuccess, FlowErrorBoundary, StoryPlayer, MarkdownRenderer).
- `packages/rsys-os/*`
  - `data` (Supabase types), `design-source`, `style`.
- `packages/vsm/*`
  - `brand`.

## Observations / Risks

- **Component duplication:** `@gttm/mission` still contains its own MissionSurface + ritual components, while `@ritual/ui-lib` also ships similar mission UI. This duplicates UI logic across packages.
- **Mission progress visibility:** `MissionSurface` currently depends on `userId` for progress; the app route only passes `supabase`, so progress always appears fresh unless userId is injected.
- **Training depends on DB seed state:** The training page is now fully database-driven; empty tables result in empty UI with disabled engagement.
- **Editor is local-only:** The training editor UI is disconnected from Supabase (export only).

## References

- `apps/vsm-school-web/src/app/page.tsx`
- `apps/vsm-school-web/src/app/mission/page.tsx`
- `apps/vsm-school-web/src/app/training/page.tsx`
- `apps/vsm-school-web/src/app/editor/page.tsx`
- `packages/gttm/mission/src/components/MissionSurface.tsx`
- `packages/gttm/mission/src/hooks/useTrainingData.ts`
- `packages/gttm/mission/src/hooks/useMissionProgress.ts`
- `packages/ritual/ui-lib/src/mission/*`
