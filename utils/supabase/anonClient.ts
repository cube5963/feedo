'use client';

import { createBrowserClient } from "@supabase/ssr";
import { getEnvVars } from "@/utils/feedo/getEnv";

export const createAnonClient = async () => {
    try {
        const supabaseUrl = await getEnvVars('SUPABASE_URL');
        const supabaseAnonKey = await getEnvVars('SUPABASE_ANON_KEY');

        if (!supabaseUrl || !supabaseAnonKey) {
            console.warn('環境変数が空です');
            return null;
        }

        return createBrowserClient(supabaseUrl, supabaseAnonKey);
    } catch (error) {
        console.warn('Supabase匿名クライアント作成失敗:', error);
        return null;
    }
};
