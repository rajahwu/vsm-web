# RDX TODO - Open Questions

**Last Updated:** 2025-12-19
**Scope:** Product decisions and unresolved architecture questions.

---

- [x] Relationship to Training App MVP: Consolidated into single pnpm workspace. `VSMTrainer` and `MissionSurface` coexist as different entry points to the same underlying data.
- [x] VSM Schools landing page purpose: Integrated as product root. Deployment via Next.js.
- [ ] Backend architecture: continue with Supabase or introduce custom API layer? (Currently stabilized on Supabase + `@rsys-os/data`).
- [ ] Content management ownership: authoring, review, approval workflow? (Initial `/editor` tool implemented).
- [ ] Registry Consolidation: Consolidate `registry.ts` (@gttm/mission) and `legacy-registry.ts`?
- [ ] Metadata Column Migration: When to execute `001_add_metadata_to_cards.sql`?
- [ ] Monetization strategy: free vs paid tiers, certification, enterprise?
