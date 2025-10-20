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
import {useRouter} from 'next/navigation';
import Header from '@/app/_components/Header';
import { useEffect, useState, useRef } from 'react';
import {createForm} from '@/utils/feedo/form/create';
import {fixAIFormDates, formatSafeDate} from "@/utils/feedo/fixTime";
import {deleteForm} from "@/utils/feedo/form/delete";
import {SupabaseAuthClient} from "@/utils/supabase/user/user";
import {getImage} from "@/utils/feedo/image/get";

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
    const [loading, setLoading] = useState(false);
    const [forms, setForms] = useState<FormData[]>([]);
    const [loadingForms, setLoadingForms] = useState(true);
    const [formImages, setFormImages] = useState<Record<string, string>>({});
    const {supabase, isAuth, loading: authLoading, user} = SupabaseAuthClient();
    const imageCacheRef = useRef<Record<string, string>>({});
    const imagesInitializedRef = useRef(false);

    // ログインユーザーの認証状態確認とフォーム取得
    useEffect(() => {
        if (!supabase || authLoading) return;

        const checkUserAndFetchForms = async () => {
            try {
                if (!isAuth || !user) {
                    router.push('/account/signin');
                    return;
                }

                const {data, error} = await supabase
                    .from('Form')
                    .select('*')
                    .eq('Delete', false)
                    .order('CreatedAt', {ascending: false});

                if (error) {
                    setForms([]);
                } else {
                    // AIフォームの日付修正
                    if (data && data.length > 0) {
                        const formsNeedingDateFix: any[] = [];
                        data.forEach((form: any) => {
                            const isAICreated = form.FormName?.includes('AI');
                            const hasDateIssue = !form.CreatedAt || !form.UpdatedAt ||
                                new Date(form.CreatedAt).getFullYear() < 1990 ||
                                new Date(form.UpdatedAt).getFullYear() < 1990;

                            if (hasDateIssue && isAICreated) formsNeedingDateFix.push(form);
                        });

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
    }, [router, supabase, authLoading, isAuth, user]);

    // 画像取得 useEffect
    useEffect(() => {
        if (!supabase || forms.length === 0) return;
        if (imagesInitializedRef.current) return;

        let mounted = true;

        const fetchImages = async () => {
            // ImgIDが空でも取得する
            const targets = forms.filter(f => !imageCacheRef.current[f.FormUUID]);

            if (targets.length === 0) {
                imagesInitializedRef.current = true;
                return;
            }

            const promises = targets.map(f =>
                getImage(f.FormUUID, supabase)
                    .then(url => {
                        return { id: f.FormUUID, url };
                    })
                    .catch(() => ({ id: f.FormUUID, url: null }))
            );

            try {
                const results = await Promise.all(promises);
                if (!mounted) return;

                let updated = false;
                for (const r of results) {
                    if (r.url) {
                        imageCacheRef.current[r.id] = r.url;
                        updated = true;
                    } else {
                        imageCacheRef.current[r.id] = '';
                    }
                }

                if (updated) {
                    const imageMap: Record<string, string> = {};
                    Object.entries(imageCacheRef.current).forEach(([k, v]) => {
                        if (v) imageMap[k] = v;
                    });
                    setFormImages(imageMap);
                }
            } finally {
                imagesInitializedRef.current = true;
            }
        };

        fetchImages();

        return () => { mounted = false; };
    }, [forms, supabase]);

    const handleClick = (formId: string) => {
        router.push(`/project/${formId}`);
    };

    const handleCreateNewForm = async (ai: boolean) => {
        if (!isAuth || !supabase) {
            router.push('/account/signin');
            return;
        }

        setLoading(true);
        const newForm = await createForm(user, supabase);
        setLoading(false);

            if (ai) {
                router.push(`/project/ai/${newForm.FormUUID}`);
            } else {
                setForms(prev => [newForm, ...prev]);
                router.push(`/project/${newForm.FormUUID}`);
            }
    };

    const handleDeleteForm = async (formId: string, formName: string, event: React.MouseEvent) => {
        event.stopPropagation();
        if (!isAuth) {
            router.push('/account/signin');
            return;
        }

        if (!confirm(`「${formName}」を削除しますか？\nこのフォーム内のすべてのセクションも同時に削除されます。`)) return;

        setLoading(true);

        try {
            if (await deleteForm(formId, supabase))
                setForms(prev => prev.filter(form => form.FormUUID !== formId));
        } catch (error: any) {
            alert(`フォームの削除に失敗しました: ${error?.message || 'Unknown error'}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#f8f9fa'}}>
            <Header title="プロジェクト一覧" showBackButton={false} showActions={false} />

            <Box sx={{maxWidth: 500, margin: 'auto', pt: 10, pb: 4, px: 2}}>
                {(!isAuth && loadingForms) && (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="body2" color="text.secondary">
                            認証情報を確認中...
                        </Typography>
                    </Box>
                )}

                {isAuth && (
                    <>
                        {user && (
                            <Box sx={{mb: 2, p: 2, bgcolor: 'info.light', borderRadius: 1}}>
                                <Typography variant="body2" color="info.contrastText">
                                    ログイン中: {user.email}
                                </Typography>
                            </Box>
                        )}

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
                                        {forms.map((form) => (
                                            <Box key={`form-${form.FormUUID}`} sx={{width: '100%', mb: 2}}>
                                                <Card
                                                    sx={{
                                                        display: 'flex',
                                                        width: '100%',
                                                        cursor: 'pointer',
                                                        '&:hover': { boxShadow: 2, bgcolor: 'action.hover' }
                                                    }}
                                                    onClick={() => handleClick(form.FormUUID)}
                                                >
                                                    <Avatar
                                                        src={formImages[form.FormUUID] || undefined}
                                                        variant="square"
                                                        sx={{width: 100, height: 100, bgcolor: 'primary.light'}}
                                                    >
                                                        {!formImages[form.FormUUID] && "📝"}
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
                                                            sx={{'&:hover': {bgcolor: 'error.light', color: 'white'}}}
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
                        onClick={() => { setCreateOpen(false); handleCreateNewForm(true) }}
                    >
                        はい
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => { setCreateOpen(false); handleCreateNewForm(false); }}
                    >
                        いいえ
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
