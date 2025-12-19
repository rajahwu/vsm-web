import { createClient } from '@supabase/supabase-js';
import { missionRegistry } from '../src/lib/mission-registry';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function rollbackTraining() {
  const blockCodes = missionRegistry.trainingWindows.flatMap(window =>
    window.blocks.map(block => block.id)
  );

  const { data: blocks, error: blockErr } = await supabase
    .from('training_blocks')
    .select('id')
    .in('block_code', blockCodes);

  if (blockErr) throw blockErr;

  const blockIds = (blocks ?? []).map(block => block.id);

  if (blockIds.length > 0) {
    const { error: cardsErr } = await supabase
      .from('training_cards')
      .delete()
      .in('block_id', blockIds);

    if (cardsErr) throw cardsErr;

    const { error: blocksErr } = await supabase
      .from('training_blocks')
      .delete()
      .in('id', blockIds);

    if (blocksErr) throw blocksErr;
  }

  const windowTypes = missionRegistry.trainingWindows.map(window => window.id);
  const { error: windowsErr } = await supabase
    .from('training_windows')
    .delete()
    .in('window_type', windowTypes);

  if (windowsErr) throw windowsErr;

  console.log('✅ Rolled back mission registry training data');
}

rollbackTraining().catch((err) => {
  console.error('❌ Rollback failed', err);
  process.exit(1);
});
