import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client'; //
import { MISSION_REGISTRY } from '@/lib/registry'; //

export function useMissionProgress(userId: string | undefined) {
  const [completedCardIds, setCompletedCardIds] = useState<Set<string>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    async function fetchProgress() {
      // 1. Fetch all completed VSM sessions for this user
      const { data, error } = await supabase
        .from('atoms')
        .select('val')
        .eq('type', 'vsm_session') //
        .eq('val->>userId', userId); // Scoped to user

      if (!error && data) {
        // 2. Map shipped atoms to unique Card IDs
        const ids = new Set(data.map(atom => atom.val.cardId));
        setCompletedCardIds(ids);
      }
      setIsLoading(false);
    }

    fetchProgress();
  }, [userId]);

  // 3. Calculate Literacy and Active State
  const stats = useMemo(() => {
    const literacy: Record<string, number> = {};
    let activeTrackId = "genesis"; // Default starting point
    let activeCardId = "dot";

    // Iterate tracks in order (Genesis -> Source Code -> Powerhouse)
    const tracks = Object.values(MISSION_REGISTRY.tracks).sort((a, b) => a.order - b.order);

    for (const track of tracks) {
      const trackCards = track.cardIds;
      const completedInTrack = trackCards.filter(id => completedCardIds.has(id));
      
      // Calculate literacy percentage for this track
      literacy[track.id] = Math.round((completedInTrack.length / trackCards.length) * 100);

      // Identify the first incomplete card as the "Next Mission"
      if (completedInTrack.length < trackCards.length && activeTrackId === "genesis") {
        activeTrackId = track.id;
        activeCardId = trackCards.find(id => !completedCardIds.has(id)) || activeCardId;
      }
    }

    return { literacy, activeTrackId, activeCardId };
  }, [completedCardIds]);

  return {
    ...stats,
    completedCardIds,
    isLoading,
  };
}
