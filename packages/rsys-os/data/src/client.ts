import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './types';

export function createTypedSupabaseClient(supabaseUrl: string, supabaseKey: string): SupabaseClient<Database> {
  return createClient<Database>(supabaseUrl, supabaseKey);
}

export type TypedSupabaseClient = SupabaseClient<Database>;
