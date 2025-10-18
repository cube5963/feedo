import { createClient } from '@supabase/supabase-js';
const res = await fetch('/api/env?data=URL');
const result = await res.json();
const supabaseUrl = result.data;

const res2 = await fetch('/api/env?data=ANON_KEY');
const result2 = await res2.json();
const supabaseAnonKey = result2.data;
export function createServiceClient() {
    return createClient(
        supabaseUrl,
        supabaseAnonKey
    );
}