import { useState, useEffect, useMemo } from 'react';
import { supabase } from '@/lib/supabase/client';
import { MISSION_REGISTRY } from '@/lib/registry';
import type { MissionTrackId, MissionCardId } from '@/lib/registry';

export function useMissionProgress(userId: string | undefined) {
  const [completedCardIds, setCompletedCardIds] = useState<Set<MissionCardId>>(new Set());
  const [isLoading, setIsLoading] = useState(true);

  /* =========================
     Fetch Progress
     ========================= */

  useEffect(() => {
    if (!userId) {
      setIsLoading(false);
      return;
    }

    async function fetchProgress() {
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

      setIsLoading(false);
    }

    fetchProgress();
  }, [userId]);

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
