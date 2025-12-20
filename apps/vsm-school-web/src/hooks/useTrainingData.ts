// apps/vsm-school-web/src/hooks/useTrainingData.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient'; 

export const useTrainingData = () => {
  const [blocks, setBlocks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissions = async () => {
      setLoading(true);
      
      // Fetching from your 11-column training_blocks table
      const { data: blockData, error: blockError } = await supabase
        .from('training_blocks')
        .select(`
          *,
          training_cards (*) 
        `)
        .order('card_order', { foreignTable: 'training_cards', ascending: true });

      if (blockError) {
        console.error("Error fetching Radiant Seven data:", blockError);
      } else {
        setBlocks(blockData);
      }
      setLoading(false);
    };

    fetchMissions();
  }, []);

  return { blocks, loading };
};
