import { useEffect, useState } from 'react';
import type { SupabaseClient } from '@supabase/supabase-js';
import type { TrainingWindowRow, TrainingBlockRow, TrainingCardRow } from '@rsys-os/data';

export type { TrainingWindowRow, TrainingBlockRow, TrainingCardRow };

interface QueryState<T> {
  data: T | null;
  isLoading: boolean;
  error: string | null;
}

const INITIAL_STATE = {
  data: null,
  isLoading: true,
  error: null,
};

// Note: Replace with React Query when the dependency is introduced.
export function useTrainingWindows(supabase: SupabaseClient) {
  const [state, setState] = useState<QueryState<TrainingWindowRow[]>>(
    INITIAL_STATE
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchWindows() {
      const { data, error } = await (supabase as any)
        .from('training_windows')
        .select('*')
        .order('duration_minutes', { ascending: true });

      if (cancelled) return;

      if (error) {
        setState({ data: null, isLoading: false, error: error.message });
        return;
      }

      setState({ data: data ?? [], isLoading: false, error: null });
    }

    fetchWindows();

    return () => {
      cancelled = true;
    };
  }, [supabase]);

  return state;
}

// Note: Replace with React Query when the dependency is introduced.
export function useTrainingBlocks(supabase: SupabaseClient, windowType: string | undefined) {
  const [state, setState] = useState<QueryState<TrainingBlockRow[]>>(
    INITIAL_STATE
  );

  useEffect(() => {
    let cancelled = false;

    if (!windowType) {
      setState({ data: [], isLoading: false, error: null });
      return;
    }

    async function fetchBlocks() {
      const { data, error } = await (supabase as any)
        .from('training_blocks')
        .select('*')
        .eq('window_type', windowType!)
        .order('block_code', { ascending: true });

      if (cancelled) return;

      if (error) {
        setState({ data: null, isLoading: false, error: error.message });
        return;
      }

      setState({ data: data ?? [], isLoading: false, error: null });
    }

    fetchBlocks();

    return () => {
      cancelled = true;
    };
  }, [windowType, supabase]);

  return state;
}

// Note: Replace with React Query when the dependency is introduced.
export function useTrainingCards(supabase: SupabaseClient, blockId: string | undefined) {
  const [state, setState] = useState<QueryState<TrainingCardRow[]>>(
    INITIAL_STATE
  );

  useEffect(() => {
    let cancelled = false;

    if (!blockId) {
      setState({ data: [], isLoading: false, error: null });
      return;
    }

    async function fetchCards() {
      const { data, error } = await (supabase as any)
        .from('training_cards')
        .select('*')
        .eq('block_id', blockId!)
        .order('card_order', { ascending: true });

      if (cancelled) return;

      if (error) {
        setState({ data: null, isLoading: false, error: error.message });
        return;
      }

      setState({ data: data ?? [], isLoading: false, error: null });
    }

    fetchCards();

    return () => {
      cancelled = true;
    };
  }, [blockId, supabase]);

  return state;
}
