import { useState } from 'react';
import { SupabaseAuthClient } from '@/utils/supabase/user';

export function useGoogleAuth() {
    const [error, setError] = useState<string | null>(null);
    const { supabase } = SupabaseAuthClient();

    const signInWithGoogle = async () => {
        if (!supabase) return;

        setError(null);

        try {
            const res = await fetch('/api/env?type=REDIRECT_URL');
            const result = await res.json();
            const { data, error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: result.data,
                },
            });

            if (error) {
                setError(`エラーが発生しました: ${error.message}`);
                return false;
            }
            return true;
        } catch (err) {
            setError('認証処理でエラーが発生しました');
            return false;
        }
    };

    return {
        signInWithGoogle,
        error,
        setError,
        isReady: !!supabase
    };
}
