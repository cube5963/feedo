'use client';

import { createBrowserClient } from "@supabase/ssr";
import {getEnvVars} from "@/utils/feedo/getEnv";

export const createAnonClient = async () => {
    const { supabaseUrl, supabaseAnonKey } = await getEnvVars();
    return createBrowserClient(supabaseUrl, supabaseAnonKey);
};