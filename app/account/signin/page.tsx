"use client";
import {Alert, Box, Button, Divider, Link, Paper, TextField, Typography} from "@mui/material";
import {Google} from "@mui/icons-material";
import React, {useEffect, useState} from 'react';
import Header from "@/app/_components/Header";
import {useRouter} from "next/navigation";
import {SupabaseAuthClient} from "@/utils/supabase/user/user";
import {useGoogleAuth} from '@/utils/supabase/user/google';

export default function SignIn() {
    const router = useRouter()

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const {supabase, isAuth, loading: authLoading} = SupabaseAuthClient();
    const {signInWithGoogle, error: googleError, isReady} = useGoogleAuth();

    useEffect(() => {
        if (!authLoading && isAuth) {
            router.push('/project');
        }
    }, [isAuth, authLoading, router]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!supabase) {
            setError("認証システムの初期化中です。しばらくお待ちください。");
            return;
        }

        setLoading(true);
        setError(null);

        const {email, password} = formValues;
        if (!email || !password) {
            setError("メールアドレスとパスワードを入力してください。");
            setLoading(false);
            return;
        }

        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        });

        setLoading(false);
        if (error) {
            setError(`エラーが発生しました: ${error.message}`);
        } else {
            router.push('/project');
        }
    }

    if (authLoading) {
        return (
            <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
                <Header showBackButton={false} showNavigation={true}/>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 80px)'
                }}>
                    <Typography variant="body2" color="text.secondary">
                        認証状態を確認中...
                    </Typography>
                </Box>
            </div>
        );
    }

    if (isAuth) {
        return null;
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
            <Header showBackButton={false} showNavigation={true}/>
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    minHeight: 'calc(100vh - 80px)',
                    padding: 2,
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        maxWidth: 420,
                        padding: 4,
                        borderRadius: 3,
                    }}
                >
                    <Box sx={{textAlign: 'center', mb: 3}}>
                        <Typography variant="h4" component="h1" gutterBottom sx={{fontWeight: 'bold'}}>
                            サインイン
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            アカウントにサインインしてください
                        </Typography>
                    </Box>

                    {(error || googleError) && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error || googleError}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={submit} sx={{mb: 3}}>
                        <TextField
                            fullWidth
                            label="メールアドレス"
                            type="email"
                            variant="outlined"
                            value={formValues.email}
                            onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                            sx={{mb: 2}}
                            required
                        />
                        <TextField
                            fullWidth
                            label="パスワード"
                            type="password"
                            variant="outlined"
                            value={formValues.password}
                            onChange={(e) => setFormValues({...formValues, password: e.target.value})}
                            sx={{mb: 3}}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading || !supabase}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                backgroundColor: '#000',
                                '&:hover': {
                                    backgroundColor: '#333',
                                },
                            }}
                        >
                            {loading ? 'サインイン中...' : 'サインイン'}
                        </Button>

                        <Box sx={{textAlign: 'center', mb: 2}}>
                            <Link href="#" variant="body2">
                                パスワードをお忘れですか？
                            </Link>
                        </Box>
                    </Box>

                    <Divider sx={{mb: 3}}>
                        <Typography variant="body2" color="text.secondary">
                            または
                        </Typography>
                    </Divider>

                    <Button
                        fullWidth
                        variant="outlined"
                        size="large"
                        startIcon={<Google/>}
                        onClick={signInWithGoogle}
                        disabled={!isReady}
                        sx={{
                            py: 1.5,
                            mb: 3,
                            borderColor: '#e0e0e0',
                            color: '#424242',
                            '&:hover': {
                                borderColor: '#bdbdbd',
                                backgroundColor: '#f5f5f5',
                            },
                        }}
                    >
                        Googleでサインイン
                    </Button>

                    <Box sx={{textAlign: 'center'}}>
                        <Typography variant="body2" color="text.secondary">
                            アカウントをお持ちでない方は{' '}
                            <Link href="/account/signup" sx={{textDecoration: 'none'}}>
                                こちら
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}