# Component Migration Plan Audit

**Date:** 2025-12-19 03:19
**Author:** Codex
**Scope:** Review and complete status update for `RDX/todos/component-migration-plan.md`.

---

## What I Did

- Audited Mission Surface component implementation status in `apps/vsm-school-web/src/components`.
- Updated `RDX/todos/component-migration-plan.md` with status annotations and an implementation notes section.

## Findings

- `MissionSurface` exists and handles phase routing, but it is not the full Pulse -> Codex -> Track -> Prime -> Produce -> Archive flow, and does not use `CardRitual`.
- `WorkSurface` exists but is missing core requirements (markdown preview, periodic autosave, sticky context card, keyboard shortcuts).
- `CardRitual` is not implemented; only its interface exists in `apps/vsm-school-web/src/lib/mission-types.ts`.
- Track-based progress state and persistence hooks are not present.

## Suggestions

1. Implement `CardRitual` first and wire it into `MissionSurface` to unify phase logic and eliminate duplicate routing.
2. Expand `WorkSurface` to meet baseline UX requirements before adding new phases or packaging work.
3. Add a minimal progress persistence layer (localStorage stub) before Supabase integration to validate flow.

## Next Steps

- Complete P0 items in `RDX/todos/component-migration-plan.md` in this order: CardRitual, WorkSurface upgrades, MissionSurface orchestration, progress state.
- Add phase audio and error boundaries as the first P1 items once P0 is stable.
- Re-audit after P0 completion and update readiness checklist.
