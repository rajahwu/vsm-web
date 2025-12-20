 Here’s the end‑to‑end data flow for this web app, with emphasis on training_blocks and training_cards.

  Data Sources

  - Primary content source (current runtime): hardcoded mission registry in apps/vsm-school-web/src/lib/
    mission-registry.ts. This is where training windows, blocks, and cards live today.
  - Database schema (target source): Supabase tables training_windows, training_blocks, training_cards
    defined in RDX/plans/supabase-schema.sql.
  - Seeding pipeline: apps/vsm-school-web/scripts/seed-mission-registry.ts takes missionRegistry and upserts
    to training_windows + training_blocks, then replaces related training_cards.

  Data Shaping / Storage

  - missionRegistry data is structured as:
      - TrainingWindow → TrainingBlock → TrainingCard
      - Cards are { front, back }, blocks include skills + theme, windows include duration + display name.
  - The seed script reshapes this into DB rows:
      - training_blocks rows include block_code, window_type, skill fields, etc.
      - training_cards rows include block_id (FK), card_order, front_text, back_text.
      - It deletes existing cards per block to keep card order in sync.

  Consumption (where/when it’s used)

  - Actual UI consumption today: apps/vsm-school-web/src/app/training/page.tsx imports missionRegistry
    directly. No DB read.
  - On initial render:
      - missionRegistry.trainingWindows is reduced to windowMap to drive the UI.
  - On user actions:
      - Selecting a window uses windowMap[window].items (blocks) to populate the block list.
      - Selecting a block sets currentBlock, and the cards are read from currentBlock.cards.
      - Card flipping and advancing use currentBlock.cards[currentCardIndex].
  - Supabase read hooks exist but are unused: apps/vsm-school-web/src/hooks/useTrainingData.ts has
    useTrainingBlocks and useTrainingCards which query training_blocks and training_cards, but no component
    imports them.

  Rendering (how it shows up)

  - Window selection UI: renders each window as a card with duration in apps/vsm-school-web/src/app/
    training/page.tsx.
  - Block selection UI: renders block title + theme list based on currentWindow and windowMap.
  - Card UI: renders front as “SCENARIO” and back as “ACTION” for the current card, with flip and next
    controls.
  - Styling: the entire training flow uses CSS module classes from apps/vsm-school-web/src/app/training/
    training.module.css (not inspected here, but it’s the primary render styling path).

  Key Observation / Gap

  - The app is currently hardcoded to use missionRegistry; the Supabase data path (training_blocks,
    training_cards) is prepared but not wired into the UI. Hooks exist in apps/vsm-school-web/src/hooks/
    useTrainingData.ts, but nothing consumes them in the training page yet.

  If you want, I can write a follow‑up that maps “ideal end‑to‑end” using the Supabase tables (and outline
  what would need to change in apps/vsm-school-web/src/app/training/page.tsx to switch to DB data).