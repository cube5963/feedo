"use client";
import {
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Box,
  Alert,
  Stack
} from "@mui/material";
import React, { useState, useEffect } from 'react';
import Header from '@/app/_components/Header';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';
import {useParams, useRouter} from 'next/navigation'
import { createPersonalClient } from '@/utils/supabase/personalClient';
import type { User } from '@supabase/supabase-js';

export default function AI(){
    const params = useParams()
    const router = useRouter()
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(false);
    const [prompt, setprompt] = useState({
        title: '',
        text: '',
    })
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // ユーザー認証状態の確認
    useEffect(() => {
        const checkUser = async () => {
            const supabase = createPersonalClient();
            const { data: { user: currentUser } } = await supabase.auth.getUser();
            setUser(currentUser);

            if (!currentUser) {
                router.push('/account/signin');
            }
        };

        checkUser();
    }, [router]);

    const submit = async (e: React.FormEvent)=> {
        e.preventDefault()

        // ログインチェック
        if (!user) {
            setError('ログインが必要です');
            router.push('/account/signin');
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        // 実際のログインユーザーのIDを使用
        const userId = user.id;
        console.log('ログインユーザーID:', userId, 'Email:', user.email);
        const res = await fetch('/api/env?data=AI_API_URL');
        const result = await res.json();
        const url = result.data as string + "create";
        const send_prompt = `以下の与えられた情報のみでフォームとセクションを作成してください。聞きたい内容から必要と思われるセクションを適切なタイプから選択して追加してください。すべてテキスト入力ではなく他の選択タイプを適宜利用してください。セクションは質問形式になるように文章を調節してください。タイトル:${prompt.title} 聞きたい内容:${prompt.text}`
        const form_id = params.id


        try {
            const supabase = createPersonalClient();

            await supabase.from('Form').update({"FormName": prompt.title}).eq("FormUUID", params.id).single()

            // タイムアウト機能付きのfetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 60000); // 60秒タイムアウト

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ prompt: send_prompt, form_id: form_id }),
                signal: controller.signal,
                // CORSとキャッシュ設定
                cache: 'no-cache',
                credentials: 'omit'
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log("AI APIレスポンス詳細:", data);

            if(data.status_code == 200){
                setSuccess("フォームが正常に作成されました！");
                router.push(`/project/${params.id}`)
            }else{
                setSuccess("フォームの作成に失敗しました。");
            }

        } catch (error) {
            console.error("詳細エラー:", error);

            if (error instanceof Error) {
                if (error.name === 'AbortError') {
                    setError("リクエストがタイムアウトしました。サーバーの応答が遅い可能性があります。");
                } else if (error.message === 'Failed to fetch') {
                    setError("ネットワークエラー: APIサーバーに接続できません。数秒待ってから再試行してください。");
                } else {
                    setError(`エラーが発生しました: ${error.message}`);
                }
            } else {
                setError("不明なエラーが発生しました。");
            }
        } finally {
            setLoading(false);
        }
    }

    return(
        <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
            {/* ヘッダー */}
            <Header
                title="AI フォーム作成"
                showBackButton={true}
            />

            <Box sx={{ maxWidth: 600, margin: 'auto', pt: 10, pb: 4, px: 2 }}>
                <Card sx={{ mb: 3 }}>
                    <CardContent sx={{ p: 3 }}>
                        {/* アイコンとタイトル */}
                        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                            <SmartToyIcon sx={{ fontSize: 40, color: 'primary.main', mr: 2 }} />
                            <Box>
                                <Typography variant="h5" component="h1" sx={{ fontWeight: 600, mb: 1 }}>
                                    AI フォーム自動作成
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    AIを使ってアンケートフォームを自動作成します
                                </Typography>
                            </Box>
                        </Box>

                        {/* フォーム */}
                        <Stack spacing={3} component="form" onSubmit={submit}>
                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                                >
                                    フォームタイトル
                                </Typography>
                                <TextField
                                    value={prompt.title}
                                    onChange={(e) => setprompt({ ...prompt, title : e.target.value })}
                                    fullWidth
                                    placeholder="例：顧客満足度調査"
                                    variant="outlined"
                                    size="small"
                                />
                            </Box>

                            <Box>
                                <Typography
                                    variant="subtitle1"
                                    sx={{ mb: 1, fontWeight: 600, color: 'text.primary' }}
                                >
                                    聞きたい内容
                                </Typography>
                                <TextField
                                    value={prompt.text}
                                    onChange={(e) => setprompt({ ...prompt, text  : e.target.value })}
                                    fullWidth
                                    placeholder="例：サービスの品質、価格の満足度、改善点について知りたい"
                                    variant="outlined"
                                    multiline
                                    rows={4}
                                    size="small"
                                />
                            </Box>

                            <Box sx={{ display: 'flex', gap: 2, pt: 2 }}>
                                <Button
                                    type="submit"
                                    disabled={loading || !prompt.title || !prompt.text || !user}
                                    variant="contained"
                                    size="large"
                                    startIcon={loading ? null : <SendIcon />}
                                    sx={{
                                        flex: 1,
                                        height: 48,
                                        fontSize: '1rem',
                                        fontWeight: 600
                                    }}
                                >
                                    {!user ? "ログインが必要です" : loading ? "作成中..." : "フォームを作成"}
                                </Button>
                            </Box>
                        </Stack>
                    </CardContent>
                </Card>

                {/* エラー・成功メッセージ */}
                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {success && (
                    <Alert severity="success" sx={{ mb: 2 }}>
                        {success}
                    </Alert>
                )}

                {/* 使用方法のヒント */}
                <Card sx={{ bgcolor: '#f5f5f5' }}>
                    <CardContent sx={{ p: 2 }}>
                        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                            使用のヒント
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • フォームタイトルは簡潔で分かりやすいものにしてください
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            • 聞きたい内容は具体的に記述すると、より適切な質問が生成されます
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            • 例：「年齢、性別、職業、商品の満足度について知りたい」
                        </Typography>
                    </CardContent>
                </Card>
            </Box>
        </Box>
    );
}