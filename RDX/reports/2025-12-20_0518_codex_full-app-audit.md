# RDX Report: Full Web App Audit

**Date:** 2025-12-20 05:18
**Scope:** `apps/vsm-school-web` plus supporting packages (`packages/gttm`, `packages/ritual`, `packages/rsys-os`).

## Executive Summary

- The app is operational with multiple user-facing flows (landing, mission, training, workbook, blackjack, blackout, editor, tracker).
- Training is now fully DB-backed (Supabase) and persists session history into `atoms`.
- Mission flow is packaged in `@gttm/mission` and gated by a feature flag, but progress tracking is inactive without a userId.
- Mission UI components exist in multiple packages, which increases maintenance risk.

## App Routes & UI Surfaces

- `apps/vsm-school-web/src/app/page.tsx`: Marketing landing page with CTA to `/mission`.
- `apps/vsm-school-web/src/app/mission/page.tsx`: Mission surface gated by `NEXT_PUBLIC_USE_MISSION_SURFACE`.
- `apps/vsm-school-web/src/app/training/page.tsx`: Training flow using Supabase hooks (training windows/blocks/cards) with localStorage session persistence.
- `apps/vsm-school-web/src/app/editor/page.tsx`: Training block/card authoring UI (local state + export JSON).
- `apps/vsm-school-web/src/app/workbook/page.tsx`: Workbook editor with Supabase atom saving and markdown export.
- `apps/vsm-school-web/src/app/blackjack/page.tsx`: Blackjack protocol timer + splintering + atom save.
- `apps/vsm-school-web/src/app/blackout/ProtocolBlackout.tsx`: Standalone story flow (local story engine).
- `apps/vsm-school-web/src/app/tracker/page.tsx`: Renders `RitualCycleTracker`.
- `apps/vsm-school-web/src/app/genesis/page.tsx`: Genesis curriculum wrapper using `GenesisTracker`.

## Data & State Flow

- **Supabase Client:** `apps/vsm-school-web/src/lib/supabase/client.ts` uses `@rsys-os/data` typed client and hard-requires env vars.
- **Training:** `packages/gttm/mission/src/hooks/useTrainingData.ts` fetches `training_windows`, `training_blocks`, `training_cards`. UI uses these hooks in `apps/vsm-school-web/src/app/training/page.tsx`.
- **Atoms:** Multiple flows insert into the `atoms` table (`training`, `workbook`, `blackjack`, `mission` progress), using anon client with `as any` casts.
- **Mission Progress:** `packages/gttm/mission/src/hooks/useMissionProgress.ts` reads `atoms` for a given `userId`. App does not provide `userId` yet.

## Package Layout (Key)

- `@gttm/mission`: MissionSurface, CardRitual, training hooks, registries.
- `@ritual/ui-lib`: Ritual UI library; now also contains mission UI components.
- `@gttm/story`: Story components and content.
- `@gttm/components`: Markdown renderer and shared UI.
- `@rsys-os/data`: Supabase typed client + DB types.

## Issues & Risks (See `issues.md`)

- Broken `useTrainingData` import (nonexistent supabase client).
- Mission editor Save CTA is inert.
- Mission progress requires userId and never loads in app.
- Training DB flag unused; no fallback.
- Mission UI component duplication across packages.
- Protocol Blackout duplicates story engine.
- Supabase env vars are hard-required and can crash locally.

## Testing Status

- No tests executed during this audit.
- `apps/vsm-school-web` includes unit/e2e scripts, but no local validation performed here.

## Recommended Next Actions

- Follow `RDX/todos/2025-12-20_ui-app-audit.md` to resolve blocking issues and consolidate packages.
