import { useEffect, useState } from 'react';
import { createPersonalClient } from './personalClient';
import { createAnonClient } from './anonClient';

export function SupabaseAuthClient() {
    const [supabase, setSupabase] = useState<any>(null);
    const [isAuth, setisAuth] = useState<boolean>(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const personal = createPersonalClient();
            const { data: sessionData } = await personal.auth.getSession();
            if (sessionData?.session) {
                setSupabase(personal);
                setisAuth(true);
            } else {
                setSupabase(createAnonClient());
                setisAuth(false);
            }
            setLoading(false);
        };
        init();
    }, []);

    return { supabase, isAuth };
}