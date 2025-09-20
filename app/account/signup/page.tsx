"use client";
import {Alert, Box, Button, Divider, Link, Paper, TextField, Typography} from "@mui/material";
import {Google} from "@mui/icons-material";
import {createClient} from "@/utils/supabase/client";
import React, {useEffect, useState} from 'react';
import {createPersonalClient} from "@/utils/supabase/personalClient";
import {useRouter} from "next/navigation";
import Header from '@/app/_components/Header';

export default function SignUp() {
    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState<string | null>(null);

    const router = useRouter();

    useEffect(() => {
        const checkUser = async () => {
            const supabase = createPersonalClient(); // 個人用クライアント使用

            // 現在のセッション確認
            const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

            const currentUser = sessionData?.session?.user;
            if (currentUser) {
                router.push('/project'); // ユーザーが存在する場合、/projectへリダイレクト
                return;
            }
        };

        checkUser();
    }, [router]);

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(null);

        const {email, password, confirmPassword} = formValues;
        if (!email || !password || !confirmPassword) {
            setError("すべてのフィールドを入力してください。");
            setLoading(false);
            return;
        }

        if (password !== confirmPassword) {
            setError("パスワードが一致しません。");
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError("パスワードは6文字以上である必要があります。");
            setLoading(false);
            return;
        }

        const supabase = createClient();
        const {data, error} = await supabase.auth.signUp({
            email,
            password,
        });

        setLoading(false);
        if (error) {
            setError(`エラーが発生しました: ${error.message}`);
        } else {
            setSuccess("登録が完了しました。確認メールをチェックしてください。");
            setFormValues({email: '', password: '', confirmPassword: ''});
        }
    }

    const google_signup = async (e: React.MouseEvent) => {
        e.preventDefault();
        setError(null);

        const supabase = createClient();
        const {data, error} = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: 'http://localhost:3000/project',
            },
        });

        if (error) {
            setError(`エラーが発生しました: ${error.message}`);
        }
    }

    return (
        <div style={{minHeight: '100vh', backgroundColor: '#f5f5f5'}}>
            <Header showBackButton={false} showNavigation={true}/>
            <Box sx={{ height: 32 }} />

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
                            新規登録
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            新しいアカウントを作成してください
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{mb: 2}}>
                            {error}
                        </Alert>
                    )}

                    {success && (
                        <Alert severity="success" sx={{mb: 2}}>
                            {success}
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
                            sx={{mb: 2}}
                            required
                            helperText="6文字以上で入力してください"
                        />
                        <TextField
                            fullWidth
                            label="パスワード（確認）"
                            type="password"
                            variant="outlined"
                            value={formValues.confirmPassword}
                            onChange={(e) => setFormValues({...formValues, confirmPassword: e.target.value})}
                            sx={{mb: 3}}
                            required
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                mb: 2,
                                backgroundColor: '#1976d2',
                                '&:hover': {
                                    backgroundColor: '#1565c0',
                                },
                            }}
                        >
                            {loading ? '登録中...' : 'アカウントを作成'}
                        </Button>
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
                        onClick={google_signup}
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
                        Googleで登録
                    </Button>

                    <Box sx={{textAlign: 'center'}}>
                        <Typography variant="body2" color="text.secondary">
                            すでにアカウントをお持ちの方は{' '}
                            <Link href="/account/signin" sx={{textDecoration: 'none'}}>
                                こちら
                            </Link>
                        </Typography>
                    </Box>
                </Paper>
            </Box>
        </div>
    );
}