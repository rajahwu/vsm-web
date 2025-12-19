import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export interface TrainingWindowRow {
  id: string;
  window_type: string;
  duration_minutes: number;
  display_name: string;
  description: string | null;
}

export interface TrainingBlockRow {
  id: string;
  block_code: string;
  window_type: string;
  title: string;
  theme: string;
  physical_skill_name: string;
  physical_skill_description: string;
  mental_skill_name: string;
  mental_skill_description: string;
  created_at: string;
  is_active: boolean;
}

export interface TrainingCardRow {
  id: string;
  block_id: string;
  card_order: number;
  front_text: string;
  back_text: string;
  created_at: string;
}

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
export function useTrainingWindows() {
  const [state, setState] = useState<QueryState<TrainingWindowRow[]>>(
    INITIAL_STATE
  );

  useEffect(() => {
    let cancelled = false;

    async function fetchWindows() {
      const { data, error } = await supabase
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
  }, []);

  return state;
}

// Note: Replace with React Query when the dependency is introduced.
export function useTrainingBlocks(windowType: string | undefined) {
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
      const { data, error } = await supabase
        .from('training_blocks')
        .select('*')
        .eq('window_type', windowType)
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
  }, [windowType]);

  return state;
}

// Note: Replace with React Query when the dependency is introduced.
export function useTrainingCards(blockId: string | undefined) {
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
      const { data, error } = await supabase
        .from('training_cards')
        .select('*')
        .eq('block_id', blockId)
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
  }, [blockId]);

  return state;
}
