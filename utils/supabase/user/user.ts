'use client'

import { useEffect, useState } from 'react';
import { createAnonClient } from '../anonClient';
import { SupabaseClient, User } from '@supabase/supabase-js';

export function SupabaseAuthClient() {
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null);
    const [isAuth, setisAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        let mounted = true;
        let authListener: { data: { subscription: any } } | null = null;

        const init = async () => {
            try {
                const client = await createAnonClient();

                if (!client) {
                    throw new Error('Supabaseクライアントの作成に失敗');
                }

                if (!mounted) return;
                setSupabase(client);

                // 初期セッション取得
                const { data: { session } } = await client.auth.getSession();

                if (!mounted) return;

                if (session) {
                    const { data: { user: currentUser } } = await client.auth.getUser();
                    if (mounted) {
                        setUser(currentUser);
                        setisAuth(true);
                    }
                } else {
                    if (mounted) {
                        setUser(null);
                        setisAuth(false);
                    }
                }

                // 認証状態の変更を監視
                authListener = client.auth.onAuthStateChange((event, session) => {
                    if (!mounted) return;


                    if (session && session.user) {
                        setUser(session.user);
                        setisAuth(true);
                    } else {
                        setUser(null);
                        setisAuth(false);
                    }
                });

            } catch (error) {
                console.error('認証初期化エラー:', error);
                if (mounted) {
                    setUser(null);
                    setisAuth(false);
                }
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        init();

        return () => {
            mounted = false;
            if (authListener) {
                authListener.data.subscription.unsubscribe();
            }
        };
    }, []);

    return { supabase, isAuth, loading, user };
}
