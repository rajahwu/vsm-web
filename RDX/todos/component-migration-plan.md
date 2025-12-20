# RDX TODO - Component Migration Plan

**Last Updated:** 2025-12-19
**Scope:** Mission Surface component buildout, orchestration, and package extraction.

---

## P0 - Blocking

- [x] Implement `CardRitual` component with 4 phases (codex, instruction, prime, produce) and haptics support. Status: complete.
- [x] Implement `WorkSurface` component (full-screen editor, autosave, archive CTA, context card). Status: complete.
- [x] Build `MissionSurface` orchestrator to coordinate Pulse -> Codex -> Track -> Prime -> Produce -> Archive. Status: complete.
- [x] Integrate Codex into MissionSurface (story nodes -> ritual trigger -> ritual completion flow). Status: complete.
- [x] Add track-based progress state (per-track completion, resume behavior, archive hooks). Status: complete (Database-backed).

## P1 - Core UX

- [x] Integrate phase audio into MissionSurface (phase entry/exit, controls, fallback). Status: audio controls wired in CardRitual.
- [x] Add training flow error boundaries and loading states for async data. Status: FlowErrorBoundary added, loading guard in CardRitual.
- [x] Add responsive layout tests for core mission components. Status: ✅ Test infrastructure complete. Playwright tests stabilized for tablet/desktop.

## P2 - Packaging

- [x] Extract shared mission components into packages (@ritual/* and @gttm/*) with stable public APIs. Status: Complete.
- [x] Standardize component props and naming to match canonical system. Status: Complete.

---

## Current Implementation Notes (2025-12-19 Update)

- All mission orchestration components and primitives extracted to `@gttm/mission`.
- Standardized UI primitives and ritual mechanics extracted to `@ritual/components`.
- Full Supabase persistence active for `MissionSurface` and `VSMTrainer`.
- `apps/vsm-school-web` is now a thin consumer of workspace packages.

---

**Related Docs:**
- `RDX/plans/2025-12-18_migration-plan-components-data.md`
- `apps/vsm-school-web/mission-surface-migration-checklist.md`
