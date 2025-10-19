import {Avatar, Box, Button, Divider, FormControl, FormLabel, Paper, TextField, Typography} from "@mui/material";
import {useEffect, useState} from "react";
import {getFormName} from "@/utils/feedo/form/name/getName";
import {updateFormName} from "@/utils/feedo/form/name/updateName";
import VisibilityIcon from "@mui/icons-material/Visibility";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {getFirstSection} from "@/utils/feedo/form/section/getFirst";
import {useRouter} from "next/navigation";
import {updateFormMessage} from "@/utils/feedo/form/message/updateMessage";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {deleteImage} from "@/utils/feedo/image/delete";
import {uploadImage} from "@/utils/feedo/image/upload";

interface SettingsTabProps {
    formId: string;
    supabase: any;
    message: string;
    setMessage: (msg: string) => void;
}

export default function SettingsTab({formId, supabase, message, setMessage}: SettingsTabProps) {
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [formTitle, setFormTitle] = useState("")
    const [formMessage, setFormMessage] = useState("")
    const [image, setImage] = useState<string | null>(null)

    useEffect(() => {
        const initialize = async () => {
            try {
                const formName = await getFormName(formId, supabase);
                if (formName == null) {
                    router.push('/project');
                    return;
                }
                setFormTitle(formName || '');
            } catch (error) {
                return
            }
        }

        initialize()
    },[formId, supabase])


    // フォーム名を更新する関数
    const handleUpdateFormName = async (newFormName: string) => {
        if (!newFormName.trim() || !supabase) return

        setLoading(true)

        const res = await updateFormName(formId, newFormName, supabase)

        if(!res){
            setMessage('フォーム名の更新に失敗しました')
        }else{
            setMessage('フォーム名を更新しました')
            setTimeout(() => setMessage(''), 3000)
        }

        setLoading(false)
    }

    // フォーム終了メッセージを更新する関数
    const handleUpdateFormMessage = async (newFormMessage: string) => {
        if (!supabase) return;

        setLoading(true)
        const res = await updateFormMessage(formId, newFormMessage, supabase)

        if(!res){
            setMessage('アンケート終了メッセージの更新に失敗しました')
            return
        }

        setMessage('アンケート終了メッセージを更新しました')
        setTimeout(() => setMessage(''), 3000)
    }


    // アンケート回答ページに移動する関数
    const handleAnswer = async () => {
        if (!supabase) return;

        const uuid = await getFirstSection(formId, supabase)

        if(uuid === null){
            setMessage('質問が見つかりません。まず質問を作成してください。')
            return
        }

        router.push(`/answer/${formId}/${uuid}`)
    }

    // プレビューページに移動する関数
    const handlePreview = async () => {
        if (!supabase) return;

        const uuid = await getFirstSection(formId, supabase)

        if(uuid === null){
            setMessage('質問が見つかりません。まず質問を作成してください。')
            return
        }

        router.push(`/answer/preview/${formId}/${uuid}`)
    }

    const handleImageDelete = async () => {
        if (!supabase) return;

        const res = await deleteImage(formId, supabase)

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
            const url = await uploadImage(formId, file, supabase)

            if (url) {
                setImage(url);
                setMessage("アップロードに成功しました。");
            } else {
                setMessage("アップロードに失敗しました。");
            }
        };

        input.click();

    }

    return (
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
}