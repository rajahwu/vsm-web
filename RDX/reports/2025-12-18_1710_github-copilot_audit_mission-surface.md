# Mission Surface Migration Audit (VSM School Web)

**Timestamp:** December 18, 2025 - 17:10 UTC  
**Agent:** GitHub Copilot  
**Scope:** apps/vsm-school-web  
**Goal:** Align current 4-phase training flows to the Mission Surface plan and outline migration steps.

---

## What I Reviewed
- Mission checklist: [apps/vsm-school-web/mission-surface-migration-checklist.md](apps/vsm-school-web/mission-surface-migration-checklist.md)
- VSM Trainer (4-state flow): [apps/vsm-school-web/src/app/training/page.tsx](apps/vsm-school-web/src/app/training/page.tsx)
- Cycle Tracker wrapper: [apps/vsm-school-web/src/app/tracker/page.tsx](apps/vsm-school-web/src/app/tracker/page.tsx)

---

## Current 4-Phase / 4-State Flows
- **Training flow** (`/training`): `timeWindow → block → page → completion`, hardcoded data, CSS module styling, ships to Supabase `atoms` (type `vsm_session`).
- **Cycle tracker** (`/tracker`): Uses `RitualCycleTracker` from `@ritual/ui-lib` (phase timer), still monolithic.
- **Checklist** requirements (Transmission → Dojo → Forge) are not yet mapped to existing routes/components.

---

## Gaps vs Mission Checklist
1. **Registry**: No `MISSION_REGISTRY`; drills/blocks are hardcoded (training) or static arrays (Genesis).
2. **Atom schema**: `vsm_session` insert lacks `trackId`, `cardId`, `outputSummary` (see shipToShell in training flow).
3. **Components**: No `CardRitual.tsx`, `ForgeEditor.tsx`, `MissionSurface.tsx`, or phase reducer; `RitualCycleTracker` still full timer UI.
4. **Story linkage**: Protocol Blackout story engine not wired to `lessonRef`/registry (hardcoded nodes).
5. **Content unlocks**: No track gating/unlocks implemented.
6. **Haptics**: No vibration triggers at timer end.
7. **Decommission plan**: Old routes (`/training`, `/genesis`, `/tracker`) still primary entry; no `/mission` surface.

---

## Suggested Migration Plan (Concise)
**Phase 1: Registry & Data**
- Create `MISSION_REGISTRY` (JSON + TypeScript types) under `packages/rsys-os/data-client` or `apps/.../lib/registry` with cards/drills/tracks.
- Expand `atoms` schema usage to include `trackId`, `cardId`, `outputSummary`; add validation helper.
- Add Supabase seed/migration for tracks/cards if not present.

**Phase 2: Core Components**
- Extract timer/instruction into `CardRitual` (60s engine) and editor into `ForgeEditor`; both theme-aware, no hardcoded CSS.
- Slim `RitualCycleTracker` into a “Pulse” indicator and expose phase/timer state via props or context.
- Build `StoryPlayer` adapter that resolves nodes by `lessonRef` from registry.

**Phase 3: Mission Surface Orchestration**
- Implement `MissionSurface` container with reducer: Context/Transmission → Dojo → Forge → Ship.
- Add haptics (Web Vibration API) on Dojo completion; gate Forge start on Dojo finish.
- Wire Ship-to-Shell to Supabase insert with registry metadata and progress update.

**Phase 4: Content Injection & Unlocks**
- Move Genesis/Source Code/Powerhouse briefs into registry; reference in Transmission step.
- Implement unlock logic: Source Code after 100% Genesis literacy; Powerhouse after Source Code completion.
- Map existing training cards into registry-driven rendering (no hardcoded blocks array).

**Phase 5: Validation & Cutover**
- Add `/mission` route using feature flag; keep legacy routes until parity proven.
- E2E: run “Dot” card end-to-end → verify atom in Supabase and progress UI update.
- Performance: ensure mission surface loads <2s on mobile; lazy-load story data.

---

## Immediate Next Steps (Do This Week)
- **Create registry scaffolding** and seed from current hardcoded data (training blocks, Genesis drills, Protocol Blackout nodes).
- **Update atom payload** in Ship-to-Shell to include `trackId`, `cardId`, `outputSummary` in [apps/vsm-school-web/src/app/training/page.tsx](apps/vsm-school-web/src/app/training/page.tsx#L126-L157).
- **Add feature flag** `NEXT_PUBLIC_USE_MISSION_SURFACE` and stub `/mission` route.
- **Design CardRitual/ForgeEditor interfaces** (props/state/events) before coding UI.

---

## Risks to Watch
- **Data divergence** if registry and hardcoded sources coexist too long → plan short overlap with feature flag.
- **Supabase schema drift** → lock migrations and generate types; add constraints on `trackId/cardId`.
- **Performance** on mobile → prefetch registry, lazy-load story assets, debounce Ship-to-Shell.

---

## Success Criteria
- All cards/tracks sourced from registry, not hardcoded.
- Ship-to-Shell writes `{ trackId, cardId, outputSummary }` for every session.
- Mission Surface flow (Transmission → Dojo → Forge) runs end-to-end on mobile with haptics and progress updates.
- Legacy routes removable after `/mission` reaches parity.

---

## Follow-up Actions Completed
- Training flow now reads from mission registry scaffold (no inline blocks).
- Ship-to-Shell payload enriched with `trackId`, `cardId`, `outputSummary`, `card_snapshot`.
- Feature flag scaffold added for `/mission` (`NEXT_PUBLIC_USE_MISSION_SURFACE`).
- Mission types/contracts defined for CardRitual/ForgeEditor/MissionSurface state.

Next suggested actions:
1) Add Supabase seed script for mission registry data. **(Done: scripts/seed-mission-registry.ts)**
2) Wire `/mission` into Sidebar behind the feature flag. **(Done)**
3) Implement CardRitual + ForgeEditor components using the contracts.
