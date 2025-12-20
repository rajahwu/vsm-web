-- Migration: Add metadata to cards and category to blocks
-- Date: 2025-12-19
-- Author: Gemini
-- Purpose: Enhance schema for registry consolidation and richer UI metadata.

-- 1. Add metadata to training_cards
ALTER TABLE training_cards 
ADD COLUMN IF NOT EXISTS metadata JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN training_cards.metadata IS 'Structured data for UI (difficulty, symbols, genesis_id, etc.)';

-- 2. Add category to training_blocks
ALTER TABLE training_blocks
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'generic' CHECK (category IN ('school', 'generic', 'custom'));

COMMENT ON COLUMN training_blocks.category IS 'Content category for grouping (school curriculum vs generic drills)';

-- 3. Add order to training_blocks for stable sorting
ALTER TABLE training_blocks
ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;

-- Rollback Commands:
-- ALTER TABLE training_blocks DROP COLUMN sort_order;
-- ALTER TABLE training_blocks DROP COLUMN category;
-- ALTER TABLE training_cards DROP COLUMN metadata;
