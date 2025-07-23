"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { 
    TextField, 
    Box,
    Button,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Alert,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Chip,
    IconButton,
    Divider,
    Paper
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import AddIcon from '@mui/icons-material/Add'
import { useEffect } from 'react'

interface Section {
    SectionID?: number
    FormID: number
    SectionName: string
    SectionOrder: number
    SectionType: FormType
    SectionDesc: string
    CreatedAt?: string
    UpdatedAt?: string
    Delete?: boolean
}

type FormType = "radio" | "checkbox" | "text" | "star" | "two_choice" | "slider"

interface FormProps {
    initialSections?: Section[]
    formId?: number // FormIDを受け取るためのprop
}

export default function Page({ initialSections = [], formId }: FormProps) {
    const [sections, setSections] = useState<Section[]>(initialSections)
    const [sectionName, setSectionName] = useState('')
    const [sectionType, setSectionType] = useState<FormType>('text')
    const [sectionDesc, setSectionDesc] = useState('')
    const [options, setOptions] = useState<string[]>(['', ''])
    const [sliderDivisions, setSliderDivisions] = useState(5)
    const [sliderMin, setSliderMin] = useState(0)
    const [sliderMax, setSliderMax] = useState(10)
    const [sliderLabel, setSliderLabel] = useState({ min: '最小', max: '最大' })
    const [starCount, setStarCount] = useState(5)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [availableFormIds, setAvailableFormIds] = useState<number[]>([])
    const [currentFormId, setCurrentFormId] = useState<number | null>(formId || null)

    useEffect(() => {
        // fetchData: SupabaseからFormとSectionテーブルのデータを取得する非同期関数
        const fetchData = async () => {
            try {
                const supabase = createClient()
                console.log('Supabaseクライアント作成成功')
                
                // Formテーブルから有効なFormIDを取得
                const { data: formData, error: formError } = await supabase
                    .from('Form')
                    .select('FormID, FormName')
                    .order('CreatedAt', { ascending: false })
                
                if (formError) {
                    console.error('Formテーブル取得エラー:', formError)
                    setMessage('Formテーブルの取得に失敗しました')
                    return
                }
                
                if (formData && formData.length > 0) {
                    const formIds = formData.map(form => form.FormID)
                    setAvailableFormIds(formIds)
                    console.log('有効なForm一覧:', formData)
                    
                    // 現在のFormIDが無効な場合、最初の有効なFormIDを使用
                    if (!currentFormId || !formIds.includes(currentFormId)) {
                        setCurrentFormId(formIds[0])
                        console.log('FormIDを自動設定:', formIds[0])
                    }
                } else {
                    console.log('Formテーブルにデータがありません')
                    
                    // 自動的にデフォルトフォームを作成
                    const { data: newForm, error: createError } = await supabase
                        .from('Form')
                        .insert([{
                            FormName: 'デフォルトフォーム',
                            ImgID: '',
                            Delete: false
                        }])
                        .select()
                        .single()
                    
                    if (createError) {
                        console.error('フォーム作成エラー:', createError)
                        setMessage('フォームの作成に失敗しました。手動でFormテーブルにデータを追加してください。')
                        return
                    }
                    
                    if (newForm) {
                        setAvailableFormIds([newForm.FormID])
                        setCurrentFormId(newForm.FormID)
                        setMessage('デフォルトフォームを自動作成しました。')
                        console.log('自動作成されたForm:', newForm)
                    }
                }
                
                // 現在のFormIDに関連するSectionデータを取得
                const formIdToUse = currentFormId || (formData.length > 0 ? formData[0].FormID : null)
                if (formIdToUse) {
                    const { data: sectionData, error: sectionError } = await supabase
                        .from('Section')
                        .select('*')
                        .eq('FormID', formIdToUse)
                        .order('SectionOrder', { ascending: true })
                    
                    if (sectionError) {
                        console.error('Sectionデータ取得エラー:', sectionError)
                        setMessage(`Sectionデータの取得に失敗しました: ${sectionError.message}`)
                    } else {
                        console.log('取得したSectionデータ:', sectionData)
                        setSections(sectionData || [])
                    }
                }
            } catch (error: any) {
                console.error('fetchData エラー:', error)
                setMessage(`データベース接続エラー: ${error?.message || 'Unknown error'}`)
            }
        }
        
        // 初期データを取得
        fetchData()
    }, [currentFormId]) // currentFormIdが変化したときに実行

    // セクションタイプが変更されたときの処理
    useEffect(() => {
        // セクションタイプが変更されたら、適切なデフォルト値を設定
        if (sectionType === 'radio' || sectionType === 'checkbox') {
            setOptions(['選択肢1', '選択肢2'])
        } else if (sectionType === 'star') {
            setStarCount(5)
        } else if (sectionType === 'slider') {
            setSliderDivisions(5)
            setSliderMin(0)
            setSliderMax(10)
            setSliderLabel({ min: '最小', max: '最大' })
        }
    }, [sectionType])

    // 選択肢を追加する関数
    const addOption = () => {
        const maxOptions = sectionType === 'star' ? 10 : 10
        if (options.length < maxOptions) {
            setOptions([...options, ''])
        }
    }

    // 選択肢を削除する関数
    const removeOption = (index: number) => {
        const minOptions = sectionType === 'star' ? 3 : 2
        if (options.length > minOptions) {
            setOptions(options.filter((_, i) => i !== index))
        }
    }

    // 選択肢の値を更新する関数
    const updateOption = (index: number, value: string) => {
        const newOptions = [...options]
        newOptions[index] = value
        setOptions(newOptions)
    }

    // セクション説明のJSONを生成する関数
    const generateSectionDesc = () => {
        switch (sectionType) {
            case 'radio':
            case 'checkbox':
                return JSON.stringify({ 
                    options: options.filter(opt => opt.trim() !== '') 
                })
            case 'star':
                return JSON.stringify({ 
                    maxStars: starCount,
                    labels: options.filter(opt => opt.trim() !== '') 
                })
            case 'slider':
                return JSON.stringify({ 
                    min: sliderMin,
                    max: sliderMax,
                    divisions: sliderDivisions,
                    labels: sliderLabel
                })
            case 'text':
            case 'two_choice':
            default:
                return '{}'
        }
    }

    // セクションを保存する関数
    const handleSaveSection = async () => {
        if (!sectionName.trim()) {
            setMessage('質問を入力してください')
            return
        }

        if (!currentFormId) {
            setMessage('フォームIDが設定されていません。Formテーブルにデータを追加してください。')
            return
        }

        // バリデーション追加
        if ((sectionType === 'radio' || sectionType === 'checkbox') && 
            options.filter(opt => opt.trim() !== '').length < 2) {
            setMessage('選択肢を最低2つ入力してください')
            return
        }

        if (sectionType === 'star' && starCount < 3) {
            setMessage('星評価は最低3段階必要です')
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
            // 現在のセクション数を取得して順序を決定
            const maxOrder = sections.length > 0 
                ? Math.max(...sections.map(s => s.SectionOrder)) + 1 
                : 1

            const generatedDesc = generateSectionDesc()
            
            // デバッグ用ログ
            console.log('保存しようとするデータ:', {
                FormID: currentFormId,
                SectionName: sectionName,
                SectionOrder: maxOrder,
                SectionType: sectionType,
                SectionDesc: generatedDesc
            })

            const newSection: Omit<Section, 'SectionID' | 'CreatedAt' | 'UpdatedAt'> = {
                FormID: currentFormId,
                SectionName: sectionName,
                SectionOrder: maxOrder,
                SectionType: sectionType,
                SectionDesc: generatedDesc, // 動的に生成されたJSON
                Delete: false
            }

            const { data, error } = await supabase
                .from('Section')
                .insert([newSection])
                .select()

            // 詳細なエラー情報を出力
            if (error) {
                console.error('Supabaseエラー詳細:', {
                    message: error.message,
                    details: error.details,
                    hint: error.hint,
                    code: error.code
                })
                
                // 特定のエラータイプに対する対応
                if (error.code === '23503') {
                    setMessage(`外部キー制約エラー: FormID ${currentFormId} が見つかりません。Supabaseダッシュボードでフォームを作成してください。`)
                } else if (error.code === '42501' || error.message.includes('RLS')) {
                    setMessage('認証が必要です。RLSポリシーにより書き込みが制限されています。')
                } else {
                    setMessage(`保存エラー: ${error.message}`)
                }
                return
            }

            if (data && data.length > 0) {
                // 新しいセクションをリストに追加
                setSections(prev => [...prev, data[0]])
                // フォームをリセット
                setSectionName('')
                setSectionDesc('')
                setOptions(['選択肢1', '選択肢2'])
                setSliderDivisions(5)
                setSliderMin(0)
                setSliderMax(10)
                setSliderLabel({ min: '最小', max: '最大' })
                setStarCount(5)
                setMessage('質問が正常に保存されました')
            }
        } catch (error: any) {
            console.error('質問保存エラー詳細:', {
                error,
                message: error?.message,
                stack: error?.stack,
                name: error?.name
            })
            setMessage(`質問の保存に失敗しました: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    // セクションを削除する関数
    const handleDeleteSection = async (sectionId: number) => {
        if (!confirm('この質問を削除しますか？この操作は取り消せません。')) {
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
            console.log('削除しようとするSectionID:', sectionId)

            const { error } = await supabase
                .from('Section')
                .delete()
                .eq('SectionID', sectionId)

            if (error) {
                console.error('質問削除エラー:', error)
                setMessage(`削除に失敗しました: ${error.message}`)
                return
            }

            // 削除成功時、ローカルステートからも削除
            setSections(prev => prev.filter(section => section.SectionID !== sectionId))
            setMessage('質問が正常に削除されました')
            
        } catch (error: any) {
            console.error('セクション削除エラー詳細:', error)
            setMessage(`セクションの削除に失敗しました: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Box sx={{ p: 2 }}>
            {message && (
                <Alert severity={message.includes('失敗') ? 'error' : 'success'} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            
            <TextField
                label="質問"
                value={sectionName}
                onChange={(e) => setSectionName(e.target.value)}
                fullWidth
                sx={{ mb: 2 }}
            />

            {/* Formセレクター */}
            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>使用するフォーム</InputLabel>
                <Select
                    value={currentFormId || ''}
                    label="使用するフォーム"
                    onChange={(e) => setCurrentFormId(Number(e.target.value))}
                    disabled={availableFormIds.length === 0}
                >
                    {availableFormIds.map((formId) => (
                        <MenuItem key={formId} value={formId}>
                            Form ID: {formId}
                        </MenuItem>
                    ))}
                </Select>
                {availableFormIds.length === 0 && (
                    <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                        利用可能なフォームがありません。Supabaseダッシュボードでフォームを作成してください。
                    </Typography>
                )}
            </FormControl>

            <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>質問タイプ</InputLabel>
                <Select
                    value={sectionType}
                    label="質問タイプ"
                    onChange={(e) => setSectionType(e.target.value as FormType)}
                >
                    <MenuItem value="radio">ラジオボタン</MenuItem>
                    <MenuItem value="checkbox">チェックボックス</MenuItem>
                    <MenuItem value="text">テキスト入力</MenuItem>
                    <MenuItem value="star">星評価</MenuItem>
                    <MenuItem value="two_choice">二択</MenuItem>
                    <MenuItem value="slider">スライダー</MenuItem>
                </Select>
            </FormControl>

            {/* セクションタイプに応じた設定 */}
            <Accordion expanded={true} sx={{ mb: 2 }}>
                <AccordionSummary>
                    <Typography variant="h6">
                        {sectionType === 'radio' && 'ラジオボタンの設定'}
                        {sectionType === 'checkbox' && 'チェックボックスの設定'}
                        {sectionType === 'star' && '星評価の設定'}
                        {sectionType === 'slider' && 'スライダーの設定'}
                        {sectionType === 'text' && 'テキスト入力の設定'}
                        {sectionType === 'two_choice' && '二択の設定'}
                    </Typography>
                </AccordionSummary>
                <AccordionDetails>
                    {/* ラジオボタン・チェックボックスの設定 */}
                    {(sectionType === 'radio' || sectionType === 'checkbox') && (
                        <Box>
                            <Typography variant="subtitle1" sx={{ mb: 2 }}>
                                選択肢を設定してください (2-10個)
                            </Typography>
                            {options.map((option, index) => (
                                <Box key={index} sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                                    <TextField
                                        label={`選択肢 ${index + 1}`}
                                        value={option}
                                        onChange={(e) => updateOption(index, e.target.value)}
                                        fullWidth
                                        sx={{ mr: 1 }}
                                    />
                                    <IconButton 
                                        color="error"
                                        onClick={() => removeOption(index)}
                                        disabled={options.length <= 2}
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button 
                                startIcon={<AddIcon />}
                                variant="outlined" 
                                onClick={addOption}
                                disabled={options.length >= 10}
                                sx={{ mt: 1 }}
                            >
                                選択肢を追加
                            </Button>
                            
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2">プレビュー:</Typography>
                            <Box sx={{ mt: 1 }}>
                                {options.filter(opt => opt.trim()).map((option, index) => (
                                    <Chip key={index} label={option} sx={{ mr: 1, mb: 1 }} />
                                ))}
                            </Box>
                        </Box>
                    )}

                    {/* 星評価の設定 */}
                    {sectionType === 'star' && (
                        <Box>
                            <TextField
                                label="星の数"
                                type="number"
                                value={starCount}
                                onChange={(e) => setStarCount(parseInt(e.target.value) || 5)}
                                inputProps={{ min: 3, max: 10 }}
                                sx={{ mb: 2, width: '200px' }}
                                helperText="3-10個まで設定可能"
                            />                          
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2">プレビュー:</Typography>
                            <Box sx={{ mt: 1 }}>
                                {'★'.repeat(starCount)} ({starCount}段階評価)
                            </Box>
                        </Box>
                    )}

                    {/* スライダーの設定 */}
                    {sectionType === 'slider' && (
                        <Box>
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="最小値"
                                    type="number"
                                    value={sliderMin}
                                    onChange={(e) => setSliderMin(parseInt(e.target.value) || 0)}
                                    sx={{ flex: 1 }}
                                    inputProps={{ min: 0, max: sliderMax - 1 }}
                                />
                                <TextField
                                    label="最大値"
                                    type="number"
                                    value={sliderMax}
                                    onChange={(e) => setSliderMax(parseInt(e.target.value) || 10)}
                                    sx={{ flex: 1 }}
                                    inputProps={{ min: sliderMin + 1, max: 100 }}
                                />
                                <TextField
                                    label="区分数"
                                    type="number"
                                    value={sliderDivisions}
                                    onChange={(e) => setSliderDivisions(parseInt(e.target.value) || 5)}
                                    inputProps={{ min: 2, max: sliderMax+1 }}
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                            
                            <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                                <TextField
                                    label="最小値のラベル"
                                    value={sliderLabel.min}
                                    onChange={(e) => setSliderLabel(prev => ({ ...prev, min: e.target.value }))}
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="最大値のラベル"
                                    value={sliderLabel.max}
                                    onChange={(e) => setSliderLabel(prev => ({ ...prev, max: e.target.value }))}
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                            
                            <Divider sx={{ my: 2 }} />
                            <Typography variant="subtitle2">プレビュー:</Typography>
                            <Box sx={{ mt: 1, p: 2, bgcolor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body2">
                                    {sliderLabel.min} ({sliderMin}) ────────── {sliderLabel.max} ({sliderMax})
                                </Typography>
                                <Typography variant="caption">
                                    {sliderDivisions}段階
                                </Typography>
                            </Box>
                        </Box>
                    )}

                    {/* テキスト入力・二択の設定 */}
                    {(sectionType === 'text' || sectionType === 'two_choice') && (
                        <Alert severity="info">
                            {sectionType === 'text' 
                                ? 'テキスト入力タイプでは追加設定は不要です。ユーザーは自由にテキストを入力できます。'
                                : '二択タイプでは追加設定は不要です。「はい/いいえ」または「賛成/反対」形式で表示されます。'
                            }
                        </Alert>
                    )}
                </AccordionDetails>
            </Accordion>

            <Button 
                variant="contained" 
                onClick={handleSaveSection}
                disabled={loading}
                sx={{ mb: 3 }}
            >
                {loading ? '保存中...' : 'セクションを保存'}
            </Button>

            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    既存の質問一覧 {currentFormId && `(Form ID: ${currentFormId})`}
                </Typography>
                {sections?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        まだ質問がありません。
                    </Typography>
                ) : (
                    sections?.map((section) => (
                        <Paper key={section.SectionID} sx={{ mb: 2, p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <Box sx={{ flex: 1 }}>
                                    <Typography variant="h6">{section.SectionName}</Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        タイプ: {section.SectionType} | 順序: {section.SectionOrder} | Form ID: {section.FormID}
                                    </Typography>
                                    {section.SectionDesc !== '{}' && (
                                        <Typography variant="body2" sx={{ mt: 1 }}>
                                            設定: {section.SectionDesc}
                                        </Typography>
                                    )}
                                </Box>
                                <IconButton 
                                    color="error"
                                    onClick={() => handleDeleteSection(section.SectionID!)}
                                    sx={{ ml: 2 }}
                                    title="この質問を削除"
                                >
                                    <DeleteIcon />
                                </IconButton>
                            </Box>
                        </Paper>
                    ))
                )}
            </Box>
        </Box>
    )
}
