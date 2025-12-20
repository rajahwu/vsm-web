# RDX TODO - Data Layer / DB

**Last Updated:** 2025-12-19
**Scope:** Supabase schema, data access, persistence, integrations, and analytics.

---

## P0 - Blocking

- [x] Execute Supabase schema creation (training_windows, training_blocks, training_cards, story tables, user progress tables). Status: executed in Supabase.
- [x] Run seed script `apps/vsm-school-web/scripts/seed-mission-registry.ts` and verify data. Status: seeded and verified (windows: 3, blocks: 3, cards: 9).
- [x] Document rollback procedure for seed and migrations. Status: `RDX/plans/supabase-seed-rollback.md` and rollback script added.
- [x] Add React Query hooks (`useTrainingWindows`, `useTrainingBlocks`, `useTrainingCards`) and loading/error states. Status: `apps/vsm-school-web/src/hooks/useTrainingData.ts` (React Query TODO noted).
- [x] Implement feature flag `USE_DATABASE_TRAINING` to toggle registry vs DB data. Status: `apps/vsm-school-web/src/lib/features.ts`.

## P1 - Core Data & Integrations

- [ ] **DB Migration**: Execute `RDX/plans/migrations/001_add_metadata_to_cards.sql` to add `metadata` column.
- [x] Build data client package for Supabase abstraction (typed queries, shared schemas). Status: `@rsys-os/data` integrated.
- [ ] Implement session persistence (resume on refresh, cross-device sync strategy). Status: `MissionSurface` progress moved to DB. `VSMTrainer` state persistence pending.
- [ ] Add authentication and user management (magic links, session storage, RLS alignment).
- [ ] Replace Ship-to-Shell console logs with API integration + retry/queue.
- [ ] Define Content Factor API integration for training content.
- [ ] Add analytics/monitoring pipeline (phase times, completion rates, errors).

## P2 - Hardening

- [ ] Add migration scripts and backup/restore runbook.
- [ ] Evaluate real-time subscriptions where needed (training progress, story triggers).
- [ ] Define data retention policies and export tooling.
