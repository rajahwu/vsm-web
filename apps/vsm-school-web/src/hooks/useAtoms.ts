import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';

export type Atom = {
  id: string;
  type: string;
  val: any;
  created_at: string;
};

export function useAtoms(typeFilter?: string) {
  const [atoms, setAtoms] = useState<Atom[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAtoms = async () => {
    try {
      let query = supabase
        .from('atoms')
        .select('*')
        .order('created_at', { ascending: false });

      if (typeFilter) {
        query = query.eq('type', typeFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setAtoms(data || []);
    } catch (error) {
      console.error('Error fetching atoms:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAtoms();
  }, [typeFilter]);

  return { atoms, refresh: fetchAtoms, loading };
}
