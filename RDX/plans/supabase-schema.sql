-- Supabase schema for VSM School Merger
-- Source: RDX/plans/2025-12-18_migration-plan-components-data.md

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Core content tables
CREATE TABLE IF NOT EXISTS genesis_drills (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_index INT NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('Primitive', 'Sentence', 'Protocol', 'Analysis')),
  drill_description TEXT NOT NULL,
  symbol TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_genesis_drills_order ON genesis_drills(order_index);
CREATE INDEX IF NOT EXISTS idx_genesis_drills_category ON genesis_drills(category);

CREATE TABLE IF NOT EXISTS training_windows (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  window_type TEXT NOT NULL UNIQUE CHECK (window_type IN ('sprint', 'standard', 'grind')),
  duration_minutes INT NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS training_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_code TEXT NOT NULL UNIQUE,
  window_type TEXT NOT NULL REFERENCES training_windows(window_type),
  title TEXT NOT NULL,
  theme TEXT NOT NULL,
  physical_skill_name TEXT NOT NULL,
  physical_skill_description TEXT NOT NULL,
  mental_skill_name TEXT NOT NULL,
  mental_skill_description TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX IF NOT EXISTS idx_training_blocks_window ON training_blocks(window_type);

CREATE TABLE IF NOT EXISTS training_cards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  block_id UUID NOT NULL REFERENCES training_blocks(id) ON DELETE CASCADE,
  card_order INT NOT NULL,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_training_cards_block ON training_cards(block_id, card_order);

-- Story tables (Protocol Blackout)
CREATE TABLE IF NOT EXISTS story_nodes (
  id TEXT PRIMARY KEY,
  speaker TEXT NOT NULL,
  text_content TEXT NOT NULL,
  is_ending BOOLEAN DEFAULT FALSE,
  ending_type TEXT CHECK (ending_type IN ('victory', 'defeat', 'bittersweet')),
  ending_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS story_choices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  node_id TEXT NOT NULL REFERENCES story_nodes(id) ON DELETE CASCADE,
  choice_order INT NOT NULL,
  choice_text TEXT NOT NULL,
  next_node_id TEXT NOT NULL REFERENCES story_nodes(id),
  risk_label TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_story_choices_node ON story_choices(node_id, choice_order);

CREATE TABLE IF NOT EXISTS story_entities (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  title TEXT NOT NULL,
  initial_status TEXT NOT NULL,
  initial_integrity INT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- User progress tables
CREATE TABLE IF NOT EXISTS user_genesis_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drill_id UUID NOT NULL REFERENCES genesis_drills(id) ON DELETE CASCADE,
  completed_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, drill_id)
);

CREATE INDEX IF NOT EXISTS idx_user_genesis_progress_user ON user_genesis_progress(user_id);

CREATE TABLE IF NOT EXISTS user_training_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  block_id UUID NOT NULL REFERENCES training_blocks(id),
  started_at TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  duration_seconds INT,
  cards_viewed INT,
  session_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_training_sessions_user ON user_training_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_training_sessions_completed ON user_training_sessions(completed_at);

CREATE TABLE IF NOT EXISTS user_story_progress (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  story_id TEXT NOT NULL DEFAULT 'protocol_blackout',
  current_node_id TEXT NOT NULL REFERENCES story_nodes(id),
  entity_states JSONB NOT NULL,
  choices_made JSONB,
  started_at TIMESTAMPTZ NOT NULL,
  last_played_at TIMESTAMPTZ DEFAULT NOW(),
  completed BOOLEAN DEFAULT FALSE,
  ending_reached TEXT,
  UNIQUE(user_id, story_id)
);

CREATE INDEX IF NOT EXISTS idx_user_story_progress_user ON user_story_progress(user_id);
