import { createTypedSupabaseClient } from '@rsys-os/data';

// Access variables safely
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createTypedSupabaseClient(supabaseUrl, supabaseAnonKey);
