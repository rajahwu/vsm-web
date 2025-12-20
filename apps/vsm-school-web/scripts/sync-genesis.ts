import { createClient } from '@supabase/supabase-js';
import { GENESIS_REQUIREMENTS } from '../src/data/GenesisCurriculum';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  // process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role to bypass RLS for seeding
);

async function syncGenesis() {
  console.log('🚀 Starting Genesis Sync...');

  // 1. Group requirements by category to create Blocks

  const categories = [...GENESIS_REQUIREMENTS.map(r => r.category)];

  for (const cat of categories) {
    // Upsert the Block
    const { data: block, error: blockError } = await supabase
      .from('training_blocks')
      .upsert({
        block_code: `GENESIS_${cat.toUpperCase()}`,
        title: `Genesis: ${cat}`,
        window_type: 'sprint',
        theme: `Focus on ${cat} level requirements.`,
        physical_skill_name: 'Genesis Foundations',
        physical_skill_description: 'Fundamental structural drawing',
        mental_skill_name: 'System Analysis',
        mental_skill_description: 'Understanding core primitives'
      }, { onConflict: 'block_code' })
      .select()
      .single();

    if (blockError) {
      console.error(`❌ Error with Block ${cat}:`, blockError);
      continue;
    }

    // 2. Filter requirements for this block and map to Card schema
    const requirementsForBlock = GENESIS_REQUIREMENTS.filter(r => r.category === cat);

    const cardsToUpsert = requirementsForBlock.map((req, index) => ({
      block_id: block.id,
      card_order: index,
      // We store the symbol and category in a metadata JSONB for the UI
      front_text: `SYMBOL: ${req.symbol}\nTITLE: ${req.title}`,
      back_text: `DRILL: ${req.drill}`
    }));

    // Clear old cards for this block to prevent duplicates, then re-insert
    await supabase.from('training_cards').delete().eq('block_id', block.id);

    const { error: cardError } = await supabase
      .from('training_cards')
      .insert(cardsToUpsert);

    if (cardError) {
      console.error(`❌ Error with Cards for ${cat}:`, cardError);
    } else {
      console.log(`✅ Synced ${cat} Block with ${cardsToUpsert.length} cards.`);
    }
  }

  console.log('✨ Sync Complete.');
}

syncGenesis();