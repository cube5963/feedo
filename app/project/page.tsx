'use client'; // クライアントコンポーネント指定

import {
    Avatar,
    Box,
    Button,
    Card,
    CardContent,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    IconButton,
    Typography,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import {useRouter} from 'next/navigation'; // App Router 用
import {createPersonalClient} from '@/utils/supabase/personalClient'
import Header from '@/app/_components/Header'
import {useEffect, useState} from 'react';
import {createForm} from '@/utils/feedo/form/create';

// Supabaseフォーム型
interface FormData {
    FormUUID: string;
    FormName: string;
    ImgID: string;
    CreatedAt: string;
    UpdatedAt: string;
    Delete: boolean;
    UserID?: string; // ユーザーIDフィールド（CreatedByからUserIDに変更）
}

export default function Project() {
    const router = useRouter();
    const [createOpen, setCreateOpen] = useState(false);
    const [useAi, setUseAi] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState<FormData[]>([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const [user, setUser] = useState<any>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // 日付を安全にフォーマットする関数
    const formatSafeDate = (dateString: string | null | undefined, fieldName?: string): string => {
        if (!dateString) {
            console.log(`${fieldName || 'Date'}フィールドが空またはnull:`, dateString);
            return '不明';
        }

        try {
            // Unix timestamp（秒）の場合は*1000してミリ秒に変換
            let date: Date;

            // 数値の場合（Unix timestamp）
            if (typeof dateString === 'number' || /^\d+$/.test(String(dateString))) {
                const timestamp = Number(dateString);
                // 秒単位のUnix timestampの場合（桁数が少ない）
                if (timestamp < 10000000000) {
                    date = new Date(timestamp * 1000);
                    console.log(`${fieldName || 'Date'} Unix秒timestamp検出:`, timestamp, '→', date);
                } else {
                    date = new Date(timestamp);
                    console.log(`${fieldName || 'Date'} Unixミリ秒timestamp検出:`, timestamp, '→', date);
                }
            } else {
                date = new Date(dateString);
                console.log(`${fieldName || 'Date'} 文字列日付:`, dateString, '→', date);
            }

            // 無効な日付や1970年代（Unix timestamp 0近辺）をチェック
            if (isNaN(date.getTime()) || date.getFullYear() < 1990) {
                console.warn(`${fieldName || 'Date'} 無効な日付:`, dateString, '→', date);
                return '不明';
            }

            return date.toLocaleDateString('ja-JP');
        } catch (error) {
            console.error(`${fieldName || 'Date'} フォーマットエラー:`, error, dateString);
            return '不明';
        }
    };

    // AIフォームの日付を修正する関数
    const fixAIFormDates = async (formsToFix: any[]) => {
        if (!user || formsToFix.length === 0) return;

        const supabase = createPersonalClient();
        const now = new Date().toISOString();

        console.log('AIフォームの日付修正を開始...');

        for (const form of formsToFix) {
            try {
                const {error: updateError} = await supabase
                    .from('Form')
                    .update({
                        CreatedAt: form.CreatedAt && new Date(form.CreatedAt).getFullYear() >= 1990
                            ? form.CreatedAt
                            : now,
                        UpdatedAt: now  // 最終更新日は現在時刻に設定
                    })
                    .eq('FormUUID', form.FormUUID)
                    .eq('UserID', user.id); // セキュリティのため所有者チェック

                if (updateError) {
                    console.error(`フォーム ${form.FormName} の日付更新エラー:`, updateError);
                } else {
                    console.log(`フォーム ${form.FormName} の日付を修正しました`);
                }
            } catch (error) {
                console.error(`フォーム ${form.FormName} の修正中にエラー:`, error);
            }
        }

        // 修正後にフォーム一覧を再取得
        console.log('日付修正完了。フォーム一覧を再読み込み中...');
        window.location.reload();
    };

    // ログインユーザーの認証状態確認とフォーム取得
    useEffect(() => {
        const checkUserAndFetchForms = async () => {
            try {
                const supabase = createPersonalClient(); // 個人用クライアント使用

                // 現在のセッション確認
                const {data: sessionData, error: sessionError} = await supabase.auth.getSession();

                if (sessionError) {
                    console.error('セッション取得エラー:', sessionError);
                    router.push('/account/signin');
                    return;
                }

                const currentUser = sessionData?.session?.user;
                if (!currentUser) {
                    console.log('未認証のユーザー - サインインページにリダイレクト');
                    router.push('/account/signin');
                    return;
                }

                setUser(currentUser);
                setIsAuthenticated(true);
                console.log('ログイン中のユーザー:', currentUser.id, currentUser.email);

                // ログインユーザーのフォームのみを取得（個人用クライアント使用）
                const {data, error} = await supabase
                    .from('Form')
                    .select('*')
                    .eq('Delete', false)
                    .order('CreatedAt', {ascending: false});

                if (error) {
                    console.error('フォーム取得エラー:', error);

                    // UserIDカラムが存在しない場合は空のリストを表示
                    if (error.code === '42703' || error.message?.includes('UserID')) {
                        console.log('UserIDカラムが存在しません。ユーザー情報が必須のため、空のリストを表示します。');
                        setForms([]);
                    } else {
                        setForms([]);
                    }
                } else {
                    console.log(`ユーザー ${currentUser.email} のフォーム:`, data?.length || 0, '件');

                    // 日付の問題をデバッグするためのログ出力
                    if (data && data.length > 0) {
                        console.log('フォームの日付情報をチェック:');
                        const formsNeedingDateFix: any[] = [];

                        data.forEach(form => {
                            const isAICreated = form.FormName?.includes('AI') || form.ImgID === '' || !form.ImgID;
                            console.log(`フォーム ${form.FormName} ${isAICreated ? '(AI作成可能性)' : '(通常作成)'}:`, {
                                FormUUID: form.FormUUID,
                                CreatedAt: form.CreatedAt,
                                CreatedAtType: typeof form.CreatedAt,
                                CreatedAtParsed: form.CreatedAt ? new Date(form.CreatedAt) : 'null',
                                UpdatedAt: form.UpdatedAt,
                                UpdatedAtType: typeof form.UpdatedAt,
                                UpdatedAtParsed: form.UpdatedAt ? new Date(form.UpdatedAt) : 'null',
                                UserID: form.UserID
                            });

                            // 日付が問題のあるフォームを収集
                            const hasDateIssue = !form.CreatedAt ||
                                !form.UpdatedAt ||
                                new Date(form.CreatedAt).getFullYear() < 1990 ||
                                new Date(form.UpdatedAt).getFullYear() < 1990;

                            if (hasDateIssue && isAICreated) {
                                formsNeedingDateFix.push(form);
                            }
                        });

                        // 問題のあるAIフォームがある場合、自動修正を提案
                        if (formsNeedingDateFix.length > 0) {
                            console.log(`${formsNeedingDateFix.length}個のAIフォームで日付の問題を検出しました:`,
                                formsNeedingDateFix.map(f => f.FormName));

                            // 自動修正を実行（必要に応じてコメントアウト解除）
                            console.log('AIフォームの日付を自動修正します...');
                            fixAIFormDates(formsNeedingDateFix);
                        }
                    }

                    // 念のため、JavaScriptレベルでもUserIDが存在するもののみフィルタリング
                    const validForms = (data || []).filter((form: FormData) => form.UserID === currentUser.id);
                    console.log('最終的に表示するフォーム:', validForms.length, '件');
                    setForms(validForms);
                }
            } catch (error) {
                console.error('ユーザー認証エラー:', error);
                router.push('/account/signin');
            } finally {
                setLoadingForms(false);
            }
        };

        checkUserAndFetchForms();
    }, [router]);

    const handleClick = (formId: string) => {
        // Supabaseフォームのページに遷移
        router.push(`/project/${formId}`);
    };

    const handleBack = () => {
        setUseAi(false);
        setCreateOpen(true);
    };

    // 新規フォーム作成関数
    const handleCreateNewForm = async (ai: boolean) => {
        if (!user) {
            alert('ログインが必要です');
            router.push('/account/signin');
            return;
        }

        setLoading(true);

        const newForm = await createForm(user);
        setLoading(false);

        if (newForm == null) {
            console.log("エラーが発生しました");
        } else {
            if (ai) {
                router.push(`/project/ai/${newForm.FormUUID}`);
            } else {
                setForms(prev => [newForm, ...prev]);
                router.push(`/project/${newForm.FormUUID}`);
            }
        }
    };

    // フォーム削除関数（ログインユーザーのフォームのみ削除可能）
    const handleDeleteForm = async (formId: string, formName: string, event: React.MouseEvent) => {
        event.stopPropagation();

        if (!user) {
            alert('ログインが必要です');
            return;
        }

        if (!confirm(`「${formName}」を削除しますか？\nこのフォーム内のすべてのセクションも同時に削除されます。`)) {
            return;
        }

        setLoading(true);

        try {
            const supabase = createPersonalClient(); // 個人用クライアント使用

            // フォームの所有者確認（念のため）
            const {data: formCheck, error: checkError} = await supabase
                .from('Form')
                .select('UserID')
                .eq('FormUUID', formId)
                .single();

            if (checkError) {
                console.error('フォーム所有者確認エラー:', checkError);
                alert('フォームの削除に失敗しました（所有者確認エラー）');
                setLoading(false);
                return;
            }

            if (formCheck?.UserID && formCheck.UserID !== user.id) {
                alert('このフォームを削除する権限がありません');
                setLoading(false);
                return;
            }

            // 関連するSectionを論理削除
            const {error: sectionError} = await supabase
                .from('Section')
                .update({Delete: true, UpdatedAt: new Date().toISOString()})
                .eq('FormUUID', formId)
                .eq('Delete', false);

            if (sectionError) {
                console.error('セクション削除エラー:', sectionError);
                alert(`セクションの削除に失敗しました: ${sectionError.message}`);
                setLoading(false);
                return;
            }

            // Formを論理削除（UserIDでさらにフィルタリング）
            const {error: deleteError} = await supabase
                .from('Form')
                .update({Delete: true})
                .eq('FormUUID', formId)
                .eq('Delete', false);

            if (deleteError) {
                console.error('フォーム削除エラー:', deleteError);
                alert(`フォームの削除に失敗しました: ${deleteError.message}`);
                setLoading(false);
                return;
            }

            // ローカルのフォームリストから削除
            setForms(prev => prev.filter(form => form.FormUUID !== formId));
            console.log(`フォーム ${formName} (ID: ${formId}) をユーザー ${user.email} が削除しました`);

        } catch (error: any) {
            console.error('フォーム削除エラー詳細:', error);
            alert(`フォームの削除に失敗しました: ${error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
            {/* ヘッダー */}
            <Header
                title="プロジェクト一覧"
                showBackButton={false}
                showActions={false}
            />

            <Box sx={{maxWidth: 500, margin: 'auto', pt: 10, pb: 4, px: 2}}>
                {/* 認証確認中の表示 */}
                {!isAuthenticated && loadingForms && (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="body2" color="text.secondary">
                            認証情報を確認中...
                        </Typography>
                    </Box>
                )}

                {/* 認証済みの場合のコンテンツ */}
                {isAuthenticated && (
                    <>
                        {/* ユーザー情報表示 */}
                        {user && (
                            <Box sx={{mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1}}>
                                <Typography variant="body2" color="info.contrastText">
                                    ログイン中: {user.email}
                                </Typography>
                            </Box>
                        )}

                        {/* 新規作成 */}
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3}}>
                            <Button
                                variant="outlined"
                                sx={{width: 100, height: 100}}
                                onClick={() => setCreateOpen(true)}
                                disabled={loading}
                            >
                                <Typography variant="h3">{loading ? '...' : '＋'}</Typography>
                            </Button>
                            <Box sx={{ml: 2}}>
                                <Typography variant="h6">新規フォーム作成</Typography>
                                <Typography variant="body2" color="text.secondary">
                                    新しいアンケートフォームを作成します
                                </Typography>
                            </Box>
                        </Box>

                        {/* アンケート一覧 */}
                        {loadingForms ? (
                            <Box sx={{textAlign: 'center', py: 4}}>
                                <Typography variant="body2" color="text.secondary">
                                    フォームを読み込み中...
                                </Typography>
                            </Box>
                        ) : (
                            <>
                                {forms.length === 0 ? (
                                    <Box sx={{textAlign: 'center', py: 4}}>
                                        <Typography variant="h6" color="text.secondary" gutterBottom>
                                            まだフォームがありません
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            上の「＋」ボタンをクリックして新しいフォームを作成しましょう
                                        </Typography>
                                    </Box>
                                ) : (
                                    <>
                                        {/* ユーザーのフォーム表示 */}
                                        {forms.map((form) => (
                                            <Box
                                                key={`form-${form.FormUUID}`}
                                                sx={{width: '100%', mb: 2}}
                                            >
                                                <Card
                                                    sx={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        cursor: 'pointer',
                                                        '&:hover': {
                                                            boxShadow: 2,
                                                            bgcolor: 'action.hover'
                                                        }
                                                    }}
                                                    onClick={() => handleClick(form.FormUUID)}
                                                >
                                                    <Avatar
                                                        variant="square"
                                                        sx={{width: 100, height: 100, bgcolor: 'primary.light'}}
                                                    >
                                                        📝
                                                    </Avatar>
                                                    <CardContent sx={{flex: 1}}>
                                                        <Typography variant="subtitle1">{form.FormName}</Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            作成日 {formatSafeDate(form.CreatedAt, 'CreatedAt')}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary">
                                                            最終更新日 {formatSafeDate(form.UpdatedAt, 'UpdatedAt')}
                                                        </Typography>
                                                    </CardContent>
                                                    <Box sx={{display: 'flex', alignItems: 'center', pr: 1}}>
                                                        <IconButton
                                                            color="error"
                                                            onClick={(e) => handleDeleteForm(form.FormUUID, form.FormName, e)}
                                                            disabled={loading}
                                                            title="このフォームを削除"
                                                            sx={{
                                                                '&:hover': {bgcolor: 'error.light', color: 'white'}
                                                            }}
                                                        >
                                                            <DeleteIcon/>
                                                        </IconButton>
                                                    </Box>
                                                </Card>
                                            </Box>
                                        ))}
                                    </>
                                )}
                            </>
                        )}
                    </>
                )}
            </Box>
            <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
                <DialogTitle>新規作成</DialogTitle>
                <DialogContent>
                    <Typography sx={{mt: 1}}>アンケートの作成にAIを使用しますか？</Typography>
                </DialogContent>
                <DialogActions>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={() => {
                            setCreateOpen(false);
                            handleCreateNewForm(true)
                        }}
                    >
                        はい
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => {
                            setCreateOpen(false);
                            handleCreateNewForm(false);
                        }}
                    >
                        いいえ
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={useAi} onClose={() => setUseAi(false)}>
                <DialogTitle>初期設定</DialogTitle>
                <DialogContent>
                    {/* 必要ならここに初期設定内容を追加 */}
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleBack}>戻る</Button>
                    <Button variant="contained" onClick={() => setUseAi(false)}>次へ</Button>
                </DialogActions>
            </Dialog>

        </Box>
    );
}
