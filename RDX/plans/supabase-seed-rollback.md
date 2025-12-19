# Supabase Seed Rollback Procedure

**Last Updated:** 2025-12-19
**Scope:** Training windows/blocks/cards seed rollback for mission registry.

---

## When To Use

- Seed script fails partway through.
- Data is corrupted or duplicated.
- You need to re-run with updated registry content.

## Pre-Checks

- Confirm env vars are set:
  - `NEXT_PUBLIC_SUPABASE_URL`
  - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## Rollback Options

### Option A: Scripted rollback (preferred)

Run the rollback script to delete training windows, blocks, and cards that map to the mission registry IDs.

```bash
pnpm --filter vsm-school-web tsx scripts/rollback-mission-registry.ts
```

### Option B: Manual SQL rollback

Delete in dependency order.

```sql
DELETE FROM training_cards
WHERE block_id IN (SELECT id FROM training_blocks);

DELETE FROM training_blocks;
DELETE FROM training_windows;
```

## Re-Seed

After rollback completes, re-run the seed script:

```bash
pnpm --filter vsm-school-web tsx scripts/seed-mission-registry.ts
```

## Verification

- `training_windows` has 3 rows (sprint, standard, grind).
- `training_blocks` count matches mission registry blocks.
- `training_cards` count matches mission registry cards.
