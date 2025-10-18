"use client"
import {useParams, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {
    Alert,
    Avatar,
    Box,
    Button,
    Divider,
    FormControl,
    FormLabel,
    Paper,
    Tab,
    Tabs,
    TextField,
    Typography
} from '@mui/material'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Header from '@/app/_components/Header'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import StatisticsTab from '@/app/project/_components/StatisticsTab'
import FormManager from "@/app/_components/forms/FormManager";
import {SupabaseAuthClient} from "@/utils/supabase/user/user";
import {getImage} from "@/utils/feedo/image/get";
import {uploadImage} from "@/utils/feedo/image/upload";
import {deleteImage} from "@/utils/feedo/image/delete";
import {updateFormName} from "@/utils/feedo/form/name/updateName";
import {getFormName} from "@/utils/feedo/form/name/getName";
import {getFormMessage} from "@/utils/feedo/form/message/getMessage";
import {updateFormMessage} from "@/utils/feedo/form/message/updateMessage";

export default function ProjectPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const [formTitle, setFormTitle] = useState("")
    const [formMessage, setFormMessage] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [currentTab, setCurrentTab] = useState(0) // タブの状態を追加
    const [image, setImage] = useState<string | null>(null)
    const { supabase, isAuth, loading: authLoading, user } = SupabaseAuthClient();

    useEffect(() => {
        if (!supabase) return;

        setLoading(true)

        const initialize = async () => {
            if (!supabase || authLoading) return;

            // 認証チェック
            if (!isAuth || !user) {
                router.push('/account/signin');
                return;
            }

            try {
                const formName = await getFormName(projectId, supabase);
                if (formName == null) {
                    router.push('/project');
                    return;
                }
                setFormTitle(formName || '');

                const formMessage = await getFormMessage(projectId, supabase);
                if (formMessage) {
                    setFormMessage(formMessage);
                }

                const url = await getImage(projectId, supabase);
                if (url) {
                    setImage(url);
                }
            } catch (error) {
                return
            }
        };

        setLoading(false)

        initialize();
    }, [router, supabase, isAuth, user, projectId, authLoading]);


    // フォーム終了メッセージを更新する関数
    const handleUpdateFormMessage = async (newFormMessage: string) => {
        if (!supabase) return;

        setLoading(true)
        const res = await updateFormMessage(projectId, newFormMessage, supabase)

        if(!res){
            setMessage('アンケート終了メッセージの更新に失敗しました')
            return
        }

        setMessage('アンケート終了メッセージを更新しました')
        setTimeout(() => setMessage(''), 3000)
    }

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue)
    }

    // アンケート回答ページに移動する関数
    const handleAnswer = async () => {
        if (!supabase) return;

        try {
            // 最初の質問を取得
            const {data: sections, error} = await supabase
                .from('Section')
                .select('SectionUUID')
                .eq('FormUUID', projectId)
                .eq('Delete', false)
                .order('SectionOrder', {ascending: true})
                .limit(1)

            if (error || !sections || sections.length === 0) {
                setMessage('質問が見つかりません。まず質問を作成してください。')
                return
            }

            // 最初の質問のアンケート回答ページに移動
            router.push(`/answer/${projectId}/${sections[0].SectionUUID}`)
        } catch (error) {
            console.error('アンケート回答エラー:', error)
            setMessage('アンケート回答ページの表示に失敗しました')
        }
    }

    // プレビューページに移動する関数
    const handlePreview = async () => {
        if (!supabase) return;

        try {
            // 最初の質問を取得
            const {data: sections, error} = await supabase
                .from('Section')
                .select('SectionUUID')
                .eq('FormUUID', projectId)
                .eq('Delete', false)
                .order('SectionOrder', {ascending: true})
                .limit(1)

            if (error || !sections || sections.length === 0) {
                setMessage('質問が見つかりません。まず質問を作成してください。')
                return
            }

            // 最初の質問のプレビューページを新しいタブで開く
            const previewUrl = `/preview/${projectId}/${sections[0].SectionUUID}`;
            window.open(previewUrl, '_blank');
        } catch (error) {
            console.error('プレビューエラー:', error)
            setMessage('プレビューの表示に失敗しました')
        }
    }

    const handleImageDelete = async () => {
        if (!supabase) return;

        const res = await deleteImage(projectId, supabase)

        if (!res) {
            setMessage("削除に失敗しました。");
            return;
        }

        setImage(null);
        setMessage("画像を削除しました。");
    }

    const handleImageUpload = async () => {
        if(!supabase) return

        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/'

        input.onchange = async () => {
            if (!input.files || input.files.length === 0) return;

            const file = input.files[0];
            const url = await uploadImage(projectId, file, supabase)

            if (url) {
                setImage(url);
                setMessage("アップロードに成功しました。");
            } else {
                setMessage("アップロードに失敗しました。");
            }
        };

        input.click();

    }

    // フォーム名を更新する関数
    const handleUpdateFormName = async (newFormName: string) => {
        if (!newFormName.trim() || !supabase) return

        setLoading(true)

        const res = await updateFormName(projectId, newFormName, supabase)

        if(!res){
            setMessage('フォーム名の更新に失敗しました')
        }else{
            setMessage('フォーム名を更新しました')
            setTimeout(() => setMessage(''), 3000)
        }

        setLoading(false)
    }

    // 統計タブのコンテンツ
    const renderStatisticsTab = () => (
        <StatisticsTab projectId={projectId}/>
    )

    // 設定タブのレンダリング
    const renderSettingsTab = () => (
        <Box>
            <Typography variant="h6" sx={{mb: 3, fontWeight: 600}}>
                プロジェクト設定
            </Typography>


            {/* プロジェクト設定 */}
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                }}
            >
                <Typography variant="subtitle1" sx={{mb: 3, fontWeight: 600}}>
                    基本設定
                </Typography>

                <Box sx={{display: 'flex', gap: 2, alignItems: 'flex-end', mb: 3}}>
                    <TextField
                        label="プロジェクト名"
                        variant="outlined"
                        fullWidth
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        onBlur={() => handleUpdateFormName(formTitle)}
                        inputProps={{maxLength: 50}}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleUpdateFormName(formTitle)
                            }
                        }}
                        disabled={loading}
                        placeholder="わかりやすいプロジェクト名を入力してください"
                    />
                    <Button
                        variant="outlined"
                        startIcon={<VisibilityIcon/>}
                        onClick={handlePreview}
                        sx={{
                            minWidth: 120,
                            height: 56  // TextFieldと同じ高さ
                        }}
                    >
                        プレビュー
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<QuestionAnswerIcon/>}
                        onClick={handleAnswer}
                        sx={{
                            minWidth: 140,
                            height: 56  // TextFieldと同じ高さ
                        }}
                    >
                        アンケート回答
                    </Button>
                </Box>

                <Divider sx={{my: 3}}/>

                {/* 追加設定オプション */}
                <Typography variant="subtitle2" sx={{mb: 2, fontWeight: 600}}>
                    その他の設定
                </Typography>

                <Box sx={{display: 'flex', flexDirection: 'column', gap: 2}}>
                    <FormControl component="fieldset">
                        <FormLabel style={{fontWeight: 'bold', color: 'black'}}>アンケート終了後のメッセージ</FormLabel>
                        <Box sx={{mt: 1}}>
                            <Typography variant="body2" color="text.secondary">
                                アンケートが終了したときに表示されるメッセージを設定できます。
                            </Typography>
                            <TextField
                                variant="outlined"
                                fullWidth
                                multiline
                                minRows={2}
                                maxRows={4}
                                placeholder="例: ご協力ありがとうございました！"
                                sx={{mt: 1}}
                                value={formMessage}
                                onChange={(e) => setFormMessage(e.target.value)}
                                onBlur={() => handleUpdateFormMessage(formMessage)}
                                inputProps={{maxLength: 200}}
                                disabled={loading}
                            />
                        </Box>
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">回答の公開設定</FormLabel>
                        <Box sx={{mt: 1}}>
                            <Typography variant="body2" color="text.secondary">
                                回答結果の表示設定を選択してください
                            </Typography>
                        </Box>
                    </FormControl>

                    <FormControl component="fieldset">
                        <FormLabel component="legend">アクセス制限</FormLabel>
                        <Box sx={{mt: 1}}>
                            <Typography variant="body2" color="text.secondary">
                                プロジェクトへのアクセス権限を設定できます
                            </Typography>
                        </Box>
                    </FormControl>
                </Box>
            </Paper>
            {/* プロジェクト設定（デザインのみ） */}
            <Paper
                elevation={2}
                sx={{
                    p: 4,
                    mb: 4,
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                }}
            >
                <Typography variant="subtitle1" sx={{mb: 3, fontWeight: 600}}>
                    プロジェクト画像
                </Typography>

                <Box sx={{display: 'flex', alignItems: 'center', gap: 3, mb: 3}}>
                    <Avatar
                        src={image || undefined}
                        sx={{
                            width: 80,
                            height: 80,
                            bgcolor: image ? 'transparent' : 'primary.main',
                            borderRadius: image ? 2 : '50%',
                        }}
                    >
                        {!image && <PhotoCameraIcon sx={{fontSize: 40}}/>}
                    </Avatar>

                    <Box sx={{flex: 1}}>
                        <Typography variant="body2" color="text.secondary" sx={{mb: 2}}>
                            プロジェクトのイメージ画像をアップロードできます。
                            <br/>
                            対応形式: JPEG、PNG、WebP（最大5MB）
                        </Typography>

                        <Box sx={{display: 'flex', gap: 1}}>
                            <Button
                                variant="outlined"
                                startIcon={<CloudUploadIcon/>}
                                size="small"
                                onClick={handleImageUpload}
                            >
                                画像を選択
                            </Button>
                            <Button
                                variant="text"
                                color="error"
                                size="small"
                                sx={{opacity: 0.6}}
                                onClick={handleImageDelete}
                            >
                                削除
                            </Button>
                        </Box>
                    </Box>
                </Box>
            </Paper>
        </Box>
    )

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#ffffff'
        }}>
            {/* ヘッダー */}
            <Header
                title="プロジェクト編集"
                onBack={() => router.push('/project')}
            />

            {/* メインコンテンツ */}
            <Box sx={{
                pt: 10, // ヘッダーの高さ分のマージン
                pb: 4,
                maxWidth: 800,
                mx: 'auto',
                px: 3,
                width: '100%'
            }}>
                {/* タブバー */}
                <Paper sx={{mb: 3, borderRadius: 2}}>
                    <Tabs
                        value={currentTab}
                        onChange={handleTabChange}
                        variant="fullWidth"
                        sx={{
                            '& .MuiTab-root': {
                                minHeight: 64,
                                fontSize: '1rem',
                                fontWeight: 600,
                                textTransform: 'none'
                            }
                        }}
                    >
                        <Tab
                            icon={<QuestionAnswerIcon/>}
                            label="質問"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<BarChartIcon/>}
                            label="統計"
                            iconPosition="start"
                        />
                        <Tab
                            icon={<SettingsIcon/>}
                            label="設定"
                            iconPosition="start"
                        />
                    </Tabs>
                </Paper>

                {(!isAuth && loading) ? (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="body2" color="text.secondary">
                            認証情報を確認中...
                        </Typography>
                    </Box>
                ) : (isAuth && !loading && supabase) ? (
                    <>
                        {message && (
                            <Alert
                                severity={message.includes('失敗') ? 'error' : 'success'}
                                sx={{
                                    mb: 3,
                                    borderRadius: 2
                                }}
                            >
                                {message}
                            </Alert>
                        )}
                        {currentTab === 0 && (
                            <Box>
                                <FormManager formId={projectId} hideFormSelector={true} supabase={supabase}/>
                            </Box>
                        )}
                        {currentTab === 1 && renderStatisticsTab()}
                        {currentTab === 2 && renderSettingsTab()}
                    </>
                ) : (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="body2" color="text.secondary">
                            読み込み中...
                        </Typography>
                    </Box>
                )}
            </Box>
        </Box>
    )
}
