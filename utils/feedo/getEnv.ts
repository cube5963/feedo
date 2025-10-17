'use client';

let supabaseUrl: string | null = null;
let supabaseAnonKey: string | null = null;

export async function getEnvVars() {
    if (supabaseUrl && supabaseAnonKey) {
        return { supabaseUrl, supabaseAnonKey };
    }

    const res = await fetch('/api/env?type=URL');
    const result = await res.json();
    supabaseUrl = result.data;

    const res2 = await fetch('/api/env?type=ANON_KEY');
    const result2 = await res2.json();
    supabaseAnonKey = result2.data;

    return { supabaseUrl, supabaseAnonKey };
}