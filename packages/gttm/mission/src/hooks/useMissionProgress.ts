import { useState, useEffect, useMemo } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import { MISSION_REGISTRY } from '../registry';
import type { MissionTrackId, MissionCardId } from '../registry';

export function useMissionProgress(supabase: SupabaseClient, userId: string | undefined) {
  const [completedCardIds, setCompletedCardIds] = useState<Set<MissionCardId>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  /* =========================
     Fetch Progress
     ========================= */

  useEffect(() => {
    if (!userId || userId === 'undefined' || !userId.trim()) {
      setIsLoading(false);
      return;
    }
    
    setIsLoading(true);
    
    async function fetchProgress() {
      try {
        const { data, error } = await supabase
          .from('atoms')
          .select('val')
          .eq('type', 'vsm_session')
          .eq('val->>userId', userId);

        if (!error && data) {
          const ids = new Set<MissionCardId>(
            data.map(atom => atom.val.cardId as MissionCardId)
          );
          setCompletedCardIds(ids);
        }
      } catch (e) {
        console.error('Failed to fetch progress:', e);
      } finally {
        setIsLoading(false);
      }
    }

    fetchProgress();
  }, [userId, supabase]);

  /* =========================
     Derived Progress
     ========================= */

  const stats = useMemo(() => {
    const literacy: Record<MissionTrackId, number> = {} as Record<
      MissionTrackId,
      number
    >;

    let activeTrackId: MissionTrackId = 'genesis';
    let activeCardId: MissionCardId = 'dot';
    let foundNext = false;

    const tracks = Object.values(MISSION_REGISTRY).sort(
      (a, b) => (a.order ?? 0) - (b.order ?? 0)
    );

    for (const track of tracks) {
      const trackCards = track.cards;

      const completedInTrack = trackCards.filter(cardId =>
        completedCardIds.has(cardId)
      );

      literacy[track.id] = Math.round(
        (completedInTrack.length / trackCards.length) * 100
      );

      // First incomplete track becomes active
      if (!foundNext && completedInTrack.length < trackCards.length) {
        activeTrackId = track.id;
        activeCardId =
          trackCards.find(cardId => !completedCardIds.has(cardId)) ??
          activeCardId;
        foundNext = true;
      }
    }

    return {
      literacy,
      activeTrackId,
      activeCardId,
    };
  }, [completedCardIds]);

  return {
    ...stats,
    completedCardIds,
    isLoading,
  };
}
