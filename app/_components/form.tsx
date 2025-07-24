"use client"
import { useState } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import {
    DndContext,
    closestCenter,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
} from '@dnd-kit/core'
import {
    arrayMove,
    SortableContext,
    sortableKeyboardCoordinates,
    verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
    useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
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
import DragIndicatorIcon from '@mui/icons-material/DragIndicator'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import EditIcon from '@mui/icons-material/Edit'
import SaveIcon from '@mui/icons-material/Save'
import CancelIcon from '@mui/icons-material/Cancel'
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

// ドラッグ可能なセクションアイテムコンポーネント
function SortableSection({ 
    section, 
    onDelete, 
    onUpdate 
}: { 
    section: Section, 
    onDelete: (id: number) => void,
    onUpdate: (sectionId: number, updatedSection: Partial<Section>) => void
}) {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
        isDragging,
    } = useSortable({ id: section.SectionID! })

    // ローカル状態を section props で初期化し、変更時は即座にデータベースに保存
    const [localSection, setLocalSection] = useState<Section>(section)
    const [editedOptions, setEditedOptions] = useState<string[]>([])
    const [editedSliderSettings, setEditedSliderSettings] = useState({
        min: 0,
        max: 10,
        divisions: 5,
        labels: { min: '最小', max: '最大' }
    })
    const [editedStarCount, setEditedStarCount] = useState(5)

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
    }

    // propsが変更されたときのみローカル状態を更新（初回とデータベースからの更新時）
    useEffect(() => {
        console.log('Section props changed:', section.SectionName, section.SectionType)
        setLocalSection(section)
        
        // セクション詳細設定を解析してローカル状態を更新
        try {
            const sectionDesc = JSON.parse(section.SectionDesc || '{}')
            
            if (section.SectionType === 'radio' || section.SectionType === 'checkbox') {
                setEditedOptions(sectionDesc.options || ['選択肢1', '選択肢2'])
            } else if (section.SectionType === 'star') {
                setEditedStarCount(sectionDesc.maxStars || 5)
                setEditedOptions(sectionDesc.labels || [])
            } else if (section.SectionType === 'slider') {
                setEditedSliderSettings({
                    min: sectionDesc.min || 0,
                    max: sectionDesc.max || 10,
                    divisions: sectionDesc.divisions || 5,
                    labels: sectionDesc.labels || { min: '最小', max: '最大' }
                })
            }
        } catch (error) {
            console.error('セクション設定の解析エラー:', error)
        }
    }, [section.SectionID, section.SectionName, section.SectionType, section.SectionDesc])

    // セクション説明のJSONを生成
    const generateSectionDesc = () => {
        switch (localSection.SectionType) {
            case 'radio':
            case 'checkbox':
                return JSON.stringify({ 
                    options: editedOptions.filter(opt => opt.trim() !== '') 
                })
            case 'star':
                return JSON.stringify({ 
                    maxStars: editedStarCount,
                    labels: editedOptions.filter(opt => opt.trim() !== '') 
                })
            case 'slider':
                return JSON.stringify(editedSliderSettings)
            case 'text':
            case 'two_choice':
            default:
                return '{}'
        }
    }

    // データベースに保存する関数
    const saveToDatabase = async (updatedData: Partial<Section>) => {
        try {
            console.log('データベースに保存中:', updatedData)
            await onUpdate(section.SectionID!, updatedData)
            console.log('データベース保存完了')
        } catch (error) {
            console.error('データベース保存エラー:', error)
            // エラー時は元の状態に戻す
            setLocalSection(section)
        }
    }

    // 質問名変更時の処理
    const handleNameChange = (newName: string) => {
        const updatedSection = { ...localSection, SectionName: newName }
        setLocalSection(updatedSection)
    }

    // 質問名のBlur時の保存処理
    const handleNameBlur = () => {
        if (localSection.SectionName !== section.SectionName) {
            saveToDatabase({ SectionName: localSection.SectionName })
        }
    }

    // 質問タイプ変更時の処理
    const handleTypeChange = async (newType: FormType) => {
        console.log('質問タイプ変更開始:', section.SectionName, 'から', localSection.SectionType, 'へ', newType)
        
        // ローカル状態を即座に更新
        const updatedSection = { ...localSection, SectionType: newType }
        setLocalSection(updatedSection)
        
        // タイプに応じたデフォルト設定
        let newOptions = editedOptions
        let newStarCount = editedStarCount
        let newSliderSettings = editedSliderSettings
        
        if (newType === 'radio' || newType === 'checkbox') {
            newOptions = ['選択肢1', '選択肢2']
            setEditedOptions(newOptions)
        } else if (newType === 'star') {
            newStarCount = 5
            newOptions = []
            setEditedStarCount(newStarCount)
            setEditedOptions(newOptions)
        } else if (newType === 'slider') {
            newSliderSettings = {
                min: 0,
                max: 10,
                divisions: 5,
                labels: { min: '最小', max: '最大' }
            }
            setEditedSliderSettings(newSliderSettings)
        }
        
        // 新しいセクション説明を生成
        let newDesc = '{}'
        if (newType === 'radio' || newType === 'checkbox') {
            newDesc = JSON.stringify({ options: newOptions.filter(opt => opt.trim() !== '') })
        } else if (newType === 'star') {
            newDesc = JSON.stringify({ maxStars: newStarCount, labels: newOptions.filter(opt => opt.trim() !== '') })
        } else if (newType === 'slider') {
            newDesc = JSON.stringify(newSliderSettings)
        }
        
        // データベースに即座に保存
        await saveToDatabase({ 
            SectionType: newType,
            SectionDesc: newDesc
        })
    }

    // 選択肢を追加
    const addEditOption = async () => {
        if (editedOptions.length < 10) {
            const newOptions = [...editedOptions, '']
            setEditedOptions(newOptions)
            
            // 新しいセクション説明を生成して保存
            const newDesc = JSON.stringify({ 
                options: newOptions.filter(opt => opt.trim() !== '') 
            })
            await saveToDatabase({ SectionDesc: newDesc })
        }
    }

    // 選択肢を削除
    const removeEditOption = async (index: number) => {
        const minOptions = localSection.SectionType === 'star' ? 3 : 2
        if (editedOptions.length > minOptions) {
            const newOptions = editedOptions.filter((_, i) => i !== index)
            setEditedOptions(newOptions)
            
            // 新しいセクション説明を生成して保存
            const newDesc = JSON.stringify({ 
                options: newOptions.filter(opt => opt.trim() !== '') 
            })
            await saveToDatabase({ SectionDesc: newDesc })
        }
    }

    // 選択肢を更新
    const updateEditOption = (index: number, value: string) => {
        const newOptions = [...editedOptions]
        newOptions[index] = value
        setEditedOptions(newOptions)
    }

    // 選択肢のBlur時の保存処理
    const handleOptionBlur = async () => {
        const newDesc = JSON.stringify({ 
            options: editedOptions.filter(opt => opt.trim() !== '') 
        })
        if (newDesc !== section.SectionDesc) {
            await saveToDatabase({ SectionDesc: newDesc })
        }
    }

    // 星評価の数変更時の処理
    const handleStarCountChange = (newCount: number) => {
        setEditedStarCount(newCount)
    }

    // 星評価のBlur時の保存処理
    const handleStarCountBlur = async () => {
        const newDesc = JSON.stringify({ 
            maxStars: editedStarCount,
            labels: editedOptions.filter(opt => opt.trim() !== '') 
        })
        if (newDesc !== section.SectionDesc) {
            await saveToDatabase({ SectionDesc: newDesc })
        }
    }

    // スライダー設定変更時の処理
    const handleSliderChange = (field: string, value: any) => {
        setEditedSliderSettings(prev => ({ ...prev, [field]: value }))
    }

    // スライダーラベル変更時の処理
    const handleSliderLabelChange = (type: 'min' | 'max', value: string) => {
        setEditedSliderSettings(prev => ({ 
            ...prev, 
            labels: { ...prev.labels, [type]: value }
        }))
    }

    // スライダー設定のBlur時の保存処理
    const handleSliderBlur = async () => {
        const newDesc = JSON.stringify(editedSliderSettings)
        if (newDesc !== section.SectionDesc) {
            await saveToDatabase({ SectionDesc: newDesc })
        }
    }

    return (
        <Accordion 
            ref={setNodeRef} 
            style={style} 
            sx={{ 
                mb: 2,
                border: isDragging ? '2px dashed #ccc' : 'none',
                '&:before': { display: 'none' } // アコーディオンのデフォルトボーダーを削除
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* ドラッグハンドルをAccordionSummaryの外に移動 */}
                <Box 
                    {...attributes} 
                    {...listeners}
                    sx={{ 
                        cursor: 'grab',
                        '&:active': { cursor: 'grabbing' },
                        color: 'text.secondary',
                        display: 'flex',
                        alignItems: 'center',
                        p: 1,
                        mr: 1
                    }}
                >
                    <DragIndicatorIcon />
                </Box>
                
                <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ 
                        flex: 1,
                        '& .MuiAccordionSummary-content': { 
                            alignItems: 'center',
                            gap: 1
                        }
                    }}
                >
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h6">{section.SectionName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                            タイプ: {section.SectionType} | 順序: {section.SectionOrder}
                        </Typography>
                    </Box>
                </AccordionSummary>

                <IconButton 
                    color="error"
                    onClick={(e) => {
                        e.stopPropagation()
                        onDelete(section.SectionID!)
                    }}
                    title="この質問を削除"
                    sx={{ mr: 1 }}
                >
                    <DeleteIcon />
                </IconButton>
            </Box>

            <AccordionDetails>
                <Box>
                    <TextField
                        label="質問"
                        value={localSection.SectionName}
                        onChange={(e) => handleNameChange(e.target.value)}
                        onBlur={handleNameBlur}
                        fullWidth
                        sx={{ mb: 2 }}
                        size="small"
                    />

                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>質問タイプ</InputLabel>
                        <Select
                            value={localSection.SectionType}
                            label="質問タイプ"
                            size="small"
                            onChange={(e) => handleTypeChange(e.target.value as FormType)}
                        >
                            <MenuItem value="radio">ラジオボタン</MenuItem>
                            <MenuItem value="checkbox">チェックボックス</MenuItem>
                            <MenuItem value="text">テキスト入力</MenuItem>
                            <MenuItem value="star">星評価</MenuItem>
                            <MenuItem value="two_choice">二択</MenuItem>
                            <MenuItem value="slider">スライダー</MenuItem>
                        </Select>
                    </FormControl>

                    {/* 編集用の設定セクション */}
                    {(localSection.SectionType === 'radio' || localSection.SectionType === 'checkbox') && (
                        <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ mb: 1 }}>選択肢の設定</Typography>
                            {editedOptions.map((option, index) => (
                                <Box key={index} sx={{ display: 'flex', mb: 1, alignItems: 'center' }}>
                                    <TextField
                                        label={`選択肢 ${index + 1}`}
                                        value={option}
                                        onChange={(e) => updateEditOption(index, e.target.value)}
                                        onBlur={handleOptionBlur}
                                        fullWidth
                                        size="small"
                                        sx={{ mr: 1 }}
                                    />
                                    <IconButton 
                                        color="error"
                                        onClick={() => removeEditOption(index)}
                                        disabled={editedOptions.length <= 2}
                                        size="small"
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </Box>
                            ))}
                            <Button 
                                startIcon={<AddIcon />}
                                variant="outlined" 
                                onClick={addEditOption}
                                disabled={editedOptions.length >= 10}
                                size="small"
                            >
                                選択肢を追加
                            </Button>
                        </Box>
                    )}

                    {localSection.SectionType === 'star' && (
                        <Box sx={{ mb: 2 }}>
                            <TextField
                                label="星の数"
                                type="number"
                                value={editedStarCount}
                                onChange={(e) => handleStarCountChange(parseInt(e.target.value) || 5)}
                                onBlur={handleStarCountBlur}
                                inputProps={{ min: 3, max: 10 }}
                                size="small"
                                helperText="3-10個まで設定可能"
                            />
                        </Box>
                    )}

                    {localSection.SectionType === 'slider' && (
                        <Box sx={{ mb: 2 }}>
                            <Box sx={{ display: 'flex', gap: 1, mb: 1 }}>
                                <TextField
                                    label="最小値"
                                    type="number"
                                    value={editedSliderSettings.min}
                                    onChange={(e) => handleSliderChange('min', parseInt(e.target.value) || 0)}
                                    onBlur={handleSliderBlur}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="最大値"
                                    type="number"
                                    value={editedSliderSettings.max}
                                    onChange={(e) => handleSliderChange('max', parseInt(e.target.value) || 10)}
                                    onBlur={handleSliderBlur}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="区分数"
                                    type="number"
                                    value={editedSliderSettings.divisions}
                                    onChange={(e) => handleSliderChange('divisions', parseInt(e.target.value) || 5)}
                                    onBlur={handleSliderBlur}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1 }}>
                                <TextField
                                    label="最小値ラベル"
                                    value={editedSliderSettings.labels.min}
                                    onChange={(e) => handleSliderLabelChange('min', e.target.value)}
                                    onBlur={handleSliderBlur}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                                <TextField
                                    label="最大値ラベル"
                                    value={editedSliderSettings.labels.max}
                                    onChange={(e) => handleSliderLabelChange('max', e.target.value)}
                                    onBlur={handleSliderBlur}
                                    size="small"
                                    sx={{ flex: 1 }}
                                />
                            </Box>
                        </Box>
                    )}

                    {(localSection.SectionType === 'text' || localSection.SectionType === 'two_choice') && (
                        <Alert severity="info" sx={{ mt: 1 }}>
                            {localSection.SectionType === 'text' 
                                ? 'テキスト入力タイプでは追加設定は不要です。'
                                : '二択タイプでは追加設定は不要です。'
                            }
                        </Alert>
                    )}
                </Box>
            </AccordionDetails>
        </Accordion>
    )
}

interface FormProps {
    initialSections?: Section[]
    formId?: number // FormIDを受け取るためのprop
    hideFormSelector?: boolean // フォーム選択を隠すかどうか
}

export default function Page({ initialSections = [], formId, hideFormSelector = false }: FormProps) {
    const router = useRouter()
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

    // DnD設定
    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    )

    // ドラッグ終了時の処理
    const handleDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = sections.findIndex(section => section.SectionID === active.id)
            const newIndex = sections.findIndex(section => section.SectionID === over.id)
            
            const newSections = arrayMove(sections, oldIndex, newIndex)
            
            // 新しい順序でSectionOrderを更新
            const updatedSections = newSections.map((section, index) => ({
                ...section,
                SectionOrder: index + 1
            }))
            
            setSections(updatedSections)
            
            // Supabaseにも順序を保存
            try {
                const supabase = createClient()
                
                for (const section of updatedSections) {
                    await supabase
                        .from('Section')
                        .update({ SectionOrder: section.SectionOrder })
                        .eq('SectionID', section.SectionID)
                }
                
                setMessage('質問の順序を更新しました')
            } catch (error) {
                console.error('順序更新エラー:', error)
                setMessage('順序の更新に失敗しました')
            }
        }
    }

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

    // セクションを更新する関数
    const handleUpdateSection = async (sectionId: number, updatedSection: Partial<Section>) => {
        try {
            const supabase = createClient()
            
            console.log('更新しようとするセクション:', { sectionId, updatedSection })

            const { error } = await supabase
                .from('Section')
                .update(updatedSection)
                .eq('SectionID', sectionId)

            if (error) {
                console.error('質問更新エラー:', error)
                setMessage(`更新に失敗しました: ${error.message}`)
                throw error // エラーを投げることで、呼び出し元にエラーを通知
            }

            // 更新成功時、ローカルステートも更新（強制的に同期）
            setSections(prev => prev.map(section => 
                section.SectionID === sectionId 
                    ? { ...section, ...updatedSection }
                    : section
            ))
            console.log('質問が正常に更新されました')
            
            // 更新成功を示すため、少し遅延を入れる
            await new Promise(resolve => setTimeout(resolve, 100))
            
        } catch (error: any) {
            console.error('セクション更新エラー詳細:', error)
            setMessage(`セクションの更新に失敗しました: ${error?.message || 'Unknown error'}`)
            throw error // エラーを再投げして、呼び出し元に処理を委ねる
        }
    }

    // 新規フォームを作成する関数
    const handleCreateNewForm = async () => {
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
            // 新しいフォームを作成
            const { data: newForm, error: createError } = await supabase
                .from('Form')
                .insert([{
                    FormName: `新しいフォーム ${new Date().toLocaleString('ja-JP')}`,
                    ImgID: '',
                    Delete: false
                }])
                .select()
                .single()
            
            if (createError) {
                console.error('フォーム作成エラー:', createError)
                setMessage(`フォームの作成に失敗しました: ${createError.message}`)
                return
            }
            
            if (newForm) {
                console.log('新しいフォームが作成されました:', newForm)
                // 新しいフォームのページに遷移
                router.push(`/project/${newForm.FormID}`)
            }
        } catch (error: any) {
            console.error('フォーム作成エラー詳細:', error)
            setMessage(`フォームの作成に失敗しました: ${error?.message || 'Unknown error'}`)
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

            {/* Formセレクター - hideFormSelectorがfalseの場合のみ表示 */}
            {!hideFormSelector && (
                <>
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

                    {/* 新規フォーム作成ボタン */}
                    <Box sx={{ mb: 2, display: 'flex', gap: 2 }}>
                        <Button 
                            variant="outlined" 
                            onClick={handleCreateNewForm}
                            disabled={loading}
                            startIcon={<AddIcon />}
                            sx={{ minWidth: '200px' }}
                        >
                            {loading ? '作成中...' : '新規フォーム作成'}
                        </Button>
                        <Typography variant="body2" color="text.secondary" sx={{ alignSelf: 'center' }}>
                            新しいフォームを作成して専用ページに移動します
                        </Typography>
                    </Box>
                </>
            )}

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
                {loading ? '保存中...' : 'セクションを追加'}
            </Button>

            <Box>
                <Typography variant="h5" sx={{ mb: 2 }}>
                    既存の質問一覧 {currentFormId && `(Form ID: ${currentFormId})`}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    ドラッグして順序を変更できます
                </Typography>
                {sections?.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                        まだ質問がありません。
                    </Typography>
                ) : (
                    <DndContext 
                        sensors={sensors}
                        collisionDetection={closestCenter}
                        onDragEnd={handleDragEnd}
                    >
                        <SortableContext 
                            items={sections.map(s => s.SectionID!)}
                            strategy={verticalListSortingStrategy}
                        >
                            {sections.map((section) => (
                                <SortableSection
                                    key={section.SectionID}
                                    section={section}
                                    onDelete={handleDeleteSection}
                                    onUpdate={handleUpdateSection}
                                />
                            ))}
                        </SortableContext>
                    </DndContext>
                )}
            </Box>
        </Box>
    )
}
