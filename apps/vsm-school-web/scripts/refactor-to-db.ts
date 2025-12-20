import { createClient } from '@supabase/supabase-js';
import { missionRegistry } from '@gttm/mission';
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_KEY.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function refactorMissionsToDB() {
    for (const [blockIndex, block] of window.blocks.entries()) {
      // 1. Upsert the Block first to get an ID
      const { data: dbBlock, error: blockError } = await (supabase as any)
        .from('training_blocks')
        .upsert({
          block_code: block.id,
          title: block.title,
          window_type: window.id, // sprint, standard, grind
          category: 'generic',
          sort_order: blockIndex,
          // Map skills object to schema columns
          physical_skill_name: block.skills.physical.name,
          physical_skill_description: block.skills.physical.description,
          mental_skill_name: block.skills.mental.name,
          mental_skill_description: block.skills.mental.description,
          theme: block.theme      // theme string
        })
        .select()
        .single();

      if (blockError) {
        console.error(`Error upserting block ${block.title}:`, blockError);
        continue;
      }

      // 2. Parse and Insert Cards
      const cardEntries = block.cards.map((card, index) => {
        const frontParsed = parsePlainText(card.front, ['SKILL', 'FOCUS', 'DRILL', 'REP']);
        const backParsed = parsePlainText(card.back, ['CONCEPT', 'SOURCE', 'TASK', 'CONSTRAINT']);

        return {
          block_id: dbBlock.id,
          card_order: index,
          title: frontParsed.SKILL || 'Untitled Drill',
          // Store the raw text for safety, but we can also store JSON
          front_text: card.front,
          back_text: card.back,
          metadata: {
            front: frontParsed,
            back: backParsed,
            difficulty: 1
          }
        };
      });

      const { error: cardError } = await supabase
        .from('training_cards')
        .insert(cardEntries);

      if (cardError) console.error(`Error inserting cards for ${block.title}:`, cardError);
    }
  }
}

// Simple Helper to turn your plain text into an object
function parsePlainText(text: string, keys: string[]) {
  const obj: Record<string, string> = {};
  const lines = text.split('\n');
  
  lines.forEach(line => {
    keys.forEach(key => {
      if (line.startsWith(`${key}:`)) {
        obj[key] = line.replace(`${key}:`, '').trim();
      }
    });
  });
  
  // Handle the '---' body content if present
  if (text.includes('---')) {
    obj['BODY'] = text.split('---')[1]?.trim();
  }
  
  return obj;
}
