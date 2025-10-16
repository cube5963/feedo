'use client';

import { createBrowserClient } from "@supabase/ssr";

// パブリッククライアント（回答専用）
// フォームへの回答送信・表示に使用
// RLS（Row Level Security）でアクセス制御
const res = await fetch('/api/env?data=URL');
const result = await res.json();
const supabaseUrl = result.data;

const res2 = await fetch('/api/env?data=ANON_KEY');
const result2 = await res2.json();
const supabaseAnonKey = result2.data;

export const createAnonClient = () =>
  createBrowserClient(
    supabaseUrl,
    supabaseAnonKey,
  );