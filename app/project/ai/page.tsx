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
import React, { useState } from 'react';
import Header from '@/app/_components/Header';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import SendIcon from '@mui/icons-material/Send';

export default function AI(){
    const [prompt, setprompt] = useState({
        title: '',
        text: '',
    })
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const submit = async (e: React.FormEvent)=> {
        e.preventDefault()
        setLoading(true);
        setError(null);
        setSuccess(null);
        
        const user = "1a0c3ad6-9843-4283-b67f-ca48d22fd920"
        //const url = "http://127.0.0.1:5000/";
        const url = "https://b177608f-5fe1-5eba-3b08-96b26bf0824f.mtayo.net/"
        const send_prompt = `UserID:${user}です。以下の与えられた情報のみでフォームとセクションを作成してください。聞きたい内容から必要と思われるセクションを適切なタイプから選択して追加してください。セクションは質問形式になるように文章を調節してください。タイトル:${prompt.title} 聞きたい内容:${prompt.text}`

        console.log(send_prompt)

        try {
            // タイムアウト機能付きのfetch
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 30000); // 30秒タイムアウト

            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json",
                },
                body: JSON.stringify({ prompt: send_prompt }),
                signal: controller.signal,
                // CORSとキャッシュ設定
                cache: 'no-cache',
                credentials: 'omit'
            });

            clearTimeout(timeoutId);

            console.log('Response status:', response.status);
            console.log('Response headers:', response.headers);

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
            }

            const data = await response.json();
            console.log("結果:", data.result);
            setSuccess("フォームが正常に作成されました！");
            
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

    // サーバーヘルスチェック機能を追加
    const checkServerHealth = async () => {
        const url = "https://b177608f-5fe1-5eba-3b08-96b26bf0824f.mtayo.net/"
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Accept": "application/json",
                },
                cache: 'no-cache'
            });
            console.log('サーバーヘルスチェック:', response.status);
            return response.ok;
        } catch (error) {
            console.log('サーバーヘルスチェック失敗:', error);
            return false;
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
                                    disabled={loading || !prompt.title || !prompt.text}
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
                                    {loading ? "作成中..." : "フォームを作成"}
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