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
import Header from '@/app/_components/Header'
import {useEffect, useState} from 'react';
import {createForm} from '@/utils/feedo/form/create';
import {fixAIFormDates, formatSafeDate} from "@/utils/feedo/fixTime";
import {deleteForm} from "@/utils/feedo/form/delete";
import {SupabaseAuthClient} from "@/utils/supabase/user";

// Supabaseフォーム型
interface FormData {
    FormUUID: string;
    FormName: string;
    ImgID: string;
    CreatedAt: string;
    UpdatedAt: string;
    Delete: boolean;
    UserID?: string;
}

export default function Project() {
    const router = useRouter();
    const [createOpen, setCreateOpen] = useState(false);
    const [useAi, setUseAi] = useState(false);
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState<FormData[]>([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const {supabase, isAuth, user　} = SupabaseAuthClient();

    // ログインユーザーの認証状態確認とフォーム取得
    useEffect(() => {
        if (!supabase) return;

        const checkUserAndFetchForms = async () => {
            try {
                if (!isAuth || !user || !supabase) {
                    router.push('/account/signin');
                    return;
                }

                // ログインユーザーのフォームのみを取得
                const {data, error} = await supabase
                    .from('Form')
                    .select('*')
                    .eq('Delete', false)
                    .order('CreatedAt', {ascending: false});


                if (error) {
                    // UserIDカラムが存在しない場合は空のリストを表示
                    if (error.code === '42703' || error.message?.includes('UserID')) {
                        setForms([]);
                    } else {
                        setForms([]);
                    }
                } else {
                    // 日付の問題をデバッグするためのログ出力
                    if (data && data.length > 0) {
                        const formsNeedingDateFix: any[] = [];

                        data.forEach((form: {
                            FormName: string | string[];
                            ImgID: string;
                            FormUUID: any;
                            CreatedAt: string | number | Date;
                            UpdatedAt: string | number | Date;
                            UserID: any;
                        }) => {
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
                            await fixAIFormDates(formsNeedingDateFix, supabase);
                        }
                    }
                    setForms(data);
                }
            } catch (error) {
                router.push('/account/signin');
            } finally {
                setLoadingForms(false);
            }
        };

        checkUserAndFetchForms();
    }, [router, supabase]);


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
        if (!isAuth　|| !supabase) {
            router.push('/account/signin');
            return;
        }

        setLoading(true);
        const newForm = await createForm(user, supabase);
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

    // フォーム削除関数
    const handleDeleteForm = async (formId: string, formName: string, event: React.MouseEvent) => {
        event.stopPropagation();

        if (!isAuth) {
            console.log('未認証のユーザー - サインインページにリダイレクト');
            router.push('/account/signin');
            return;
        }

        setLoading(true)

        if (!confirm(`「${formName}」を削除しますか？\nこのフォーム内のすべてのセクションも同時に削除されます。`)) {
            return;
        }

        setLoading(true);

        try {

            if (await deleteForm(formId, supabase))
                setForms(prev => prev.filter(form => form.FormUUID !== formId));

            setLoading(false)

        } catch (error: any) {
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
                {(!isAuth && loadingForms) ? (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="body2" color="text.secondary">
                            認証情報を確認中...
                        </Typography>
                    </Box>
                ) : null}

                {/* 認証済みの場合のコンテンツ */}
                {isAuth ? (
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
                        <Box sx={{display: 'flex', alignItems: 'center', mb: 3, mt: 3}}>
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
                ) : null}
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
