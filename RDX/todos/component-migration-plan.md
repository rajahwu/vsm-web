# RDX TODO - Component Migration Plan

**Last Updated:** 2025-12-19
**Scope:** Mission Surface component buildout, orchestration, and package extraction.

---

## P0 - Blocking

- [x] Implement `CardRitual` component with 4 phases (codex, instruction, prime, produce) and haptics support. Status: complete.
- [x] Implement `WorkSurface` component (full-screen editor, autosave, archive CTA, context card). Status: complete.
- [x] Build `MissionSurface` orchestrator to coordinate Pulse -> Codex -> Track -> Prime -> Produce -> Archive. Status: complete.
- [x] Integrate Codex into MissionSurface (story nodes -> ritual trigger -> ritual completion flow). Status: complete.
- [x] Add track-based progress state (per-track completion, resume behavior, archive hooks). Status: complete (localStorage-based).

## P1 - Core UX

- [x] Integrate phase audio into MissionSurface (phase entry/exit, controls, fallback). Status: audio controls wired in CardRitual.
- [x] Add training flow error boundaries and loading states for async data. Status: FlowErrorBoundary added, loading guard in CardRitual.
- [ ] Add responsive layout tests for core mission components. Status: checklist added in `RDX/plans/mission-surface-responsive-checklist.md`, execution pending.

## P2 - Packaging

- [ ] Extract shared mission components into packages (ritual-ui/ritual-brand) with stable public APIs. Status: not started.
- [ ] Standardize component props and naming to match canonical system. Status: not started.

---

## Current Implementation Notes (2025-12-19 Update)

- `apps/vsm-school-web/src/components/CardRitual.tsx` now orchestrates codex, instruction, prime, and produce phases with haptics and local phase tracking.
- `apps/vsm-school-web/src/components/MissionSurface.tsx` now handles Pulse -> Track -> Ritual -> Success and persists per-track progress in localStorage.
- `apps/vsm-school-web/src/components/WorkSurface.tsx` now supports preview toggle, 30s autosave, sticky context, and keyboard shortcuts.

---

**Related Docs:**
- `RDX/plans/2025-12-18_migration-plan-components-data.md`
- `apps/vsm-school-web/mission-surface-migration-checklist.md`
