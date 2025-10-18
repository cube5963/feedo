'use client';

import { createBrowserClient } from "@supabase/ssr";

const res = await fetch('/api/env?type=SUPABASE_URL');
const result = await res.json();
const supabaseUrl = result.data;

const res2 = await fetch('/api/env?type=SUPABASE_ANON_KEY');
const result2 = await res2.json();
const supabaseAnonKey = result2.data;

export const createClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );
