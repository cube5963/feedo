import { useEffect, useState } from 'react';
import { createPersonalClient } from './personalClient';
import { createAnonClient } from './anonClient';
import { SupabaseClient, User } from '@supabase/supabase-js';

export function SupabaseAuthClient() {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [isAuth, setisAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        const init = async () => {
            try {
                const personal = await createPersonalClient();

                if (personal && personal.auth) {
                    const { data: { session } } = await personal.auth.getSession();

                    if (session) {
                        // セッションが有効な場合のみユーザー情報を取得
                        const { data: { user: currentUser } } = await personal.auth.getUser();
                        setUser(currentUser);
                        setSupabase(personal);
                        setisAuth(true);
                    } else {
                        const anon = await createAnonClient();
                        setSupabase(anon);
                        setisAuth(false);
                        setUser(null);
                    }
                } else {
                    const anon = await createAnonClient();
                    setSupabase(anon);
                    setisAuth(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('認証初期化エラー:', error);
                const anon = await createAnonClient();
                setSupabase(anon);
                setisAuth(false);
                setUser(null);
            } finally {
                setLoading(false);
            }
        };
        init();
    }, []);

    return { supabase, isAuth, loading, user };
}
