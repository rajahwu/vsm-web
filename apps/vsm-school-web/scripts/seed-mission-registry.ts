import { createClient } from '@supabase/supabase-js';
import { missionRegistry } from '../src/lib/mission-registry';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedTraining() {
  // Upsert windows
  const windows = missionRegistry.trainingWindows.map((w) => ({
    window_type: w.id,
    duration_minutes: w.durationMinutes,
    display_name: w.displayName,
  }));

  const { error: winErr } = await supabase.from('training_windows').upsert(windows, {
    onConflict: 'window_type',
  });
  if (winErr) throw winErr;

  // Upsert blocks + cards
  for (const w of missionRegistry.trainingWindows) {
    for (const block of w.blocks) {
      const { data: blockRow, error: blockErr } = await supabase
        .from('training_blocks')
        .upsert({
          block_code: block.id,
          window_type: w.id,
          title: block.title,
          theme: block.theme,
          physical_skill_name: block.skills.physical.name,
          physical_skill_description: block.skills.physical.description,
          mental_skill_name: block.skills.mental.name,
          mental_skill_description: block.skills.mental.description,
        }, {
          onConflict: 'block_code'
        })
        .select()
        .single();

      if (blockErr) throw blockErr;

      const cards = block.cards.map((card, idx) => ({
        block_id: blockRow.id,
        card_order: idx + 1,
        front_text: card.front,
        back_text: card.back,
      }));

      const { error: cardErr } = await supabase.from('training_cards').upsert(cards, {
        onConflict: 'block_id,card_order'
      });
      if (cardErr) throw cardErr;
    }
  }

  console.log('✅ Mission registry training data seeded');
}

seedTraining().catch((err) => {
  console.error('❌ Seed failed', err);
  process.exit(1);
});
