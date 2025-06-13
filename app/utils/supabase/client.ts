import { createBrowserClient } from "@supabase/ssr";
import { cookies } from 'next/headers'

// Supabase クライアントを生成する関数
export const createClient = () =>
  createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

// 利用例:
// const supabase = createClient();
// const { data, error } = await supabase.auth.signUp({
//   email: 'example@email.com',
//   password: 'example-password',
// });
