"use client"
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'
import { FormProps, Section } from './types'
import { FormSelector } from './FormSelector'
import { SectionCreator } from './SectionCreator'
import { SectionList } from './SectionList'
import { arrayMove } from '@dnd-kit/sortable'
import { Box, Alert } from '@mui/material'

export default function FormManager({ initialSections = [], formId, hideFormSelector = false }: FormProps) {
    const router = useRouter()
    const [sections, setSections] = useState<Section[]>(initialSections)
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [availableFormIds, setAvailableFormIds] = useState<string[]>([])
    const [currentFormId, setCurrentFormId] = useState<string | null>(formId || null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const supabase = createClient()
                console.log('Supabaseクライアント作成成功')
                
                const { data: formData, error: formError } = await supabase
                    .from('Form')
                    .select('FormUUID, FormName')
                    .eq('Delete', false)
                    .order('CreatedAt', { ascending: false })
                
                if (formError) {
                    console.error('Formテーブル取得エラー:', formError)
                    setMessage('Formテーブルの取得に失敗しました')
                    return
                }
                
                if (formData && formData.length > 0) {
                    const formIds = formData.map(form => form.FormUUID)
                    setAvailableFormIds(formIds)
                    console.log('有効なForm一覧:', formData)
                    
                    if (!currentFormId || !formIds.includes(currentFormId)) {
                        setCurrentFormId(formIds[0])
                        console.log('FormUUIDを自動設定:', formIds[0])
                    }
                } else {
                    console.log('Formテーブルにデータがありません')
                    
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
                        setAvailableFormIds([newForm.FormUUID])
                        setCurrentFormId(newForm.FormUUID)
                        setMessage('デフォルトフォームを自動作成しました。')
                        console.log('自動作成されたForm:', newForm)
                    }
                }
                
                const formIdToUse = currentFormId || (formData.length > 0 ? formData[0].FormUUID : null)
                if (formIdToUse) {
                    const { data: sectionData, error: sectionError } = await supabase
                        .from('Section')
                        .select('*')
                        .eq('FormUUID', formIdToUse)
                        .eq('Delete', false)
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
        
        fetchData()
    }, [currentFormId])

    const handleSaveSection = async (sectionData: Omit<Section, 'SectionUUID' | 'CreatedAt' | 'UpdatedAt'>) => {
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
            console.log('保存しようとするデータ:', sectionData)

            const { data, error } = await supabase
                .from('Section')
                .insert([sectionData])
                .select()

            if (error) {
                console.error('Supabaseエラー詳細:', error)
                
                if (error.code === '23503') {
                    setMessage(`外部キー制約エラー: FormID ${currentFormId} が見つかりません。`)
                } else if (error.code === '42501' || error.message.includes('RLS')) {
                    setMessage('認証が必要です。RLSポリシーにより書き込みが制限されています。')
                } else {
                    setMessage(`保存エラー: ${error.message}`)
                }
                return
            }

            if (data && data.length > 0) {
                setSections(prev => [...prev, data[0]])
                setMessage('質問が正常に保存されました')
            }
        } catch (error: any) {
            console.error('質問保存エラー詳細:', error)
            setMessage(`質問の保存に失敗しました: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleDeleteSection = async (sectionId: string) => {
        if (!confirm('この質問を削除しますか？')) {
            return
        }

        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
            console.log('削除しようとするSectionUUID:', sectionId)

            const { error } = await supabase
                .from('Section')
                .update({ Delete: true, UpdatedAt: new Date().toISOString() })
                .eq('SectionUUID', sectionId)
                .eq('Delete', false)

            if (error) {
                console.error('質問削除エラー:', error)
                setMessage(`削除に失敗しました: ${error.message}`)
                return
            }

            setSections(prev => prev.filter(section => section.SectionUUID !== sectionId))
            setMessage('質問が正常に削除されました')
            
        } catch (error: any) {
            console.error('セクション削除エラー詳細:', error)
            setMessage(`セクションの削除に失敗しました: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }

    const handleUpdateSection = async (sectionId: string, updatedSection: Partial<Section>) => {
        try {
            const supabase = createClient()
            
            console.log('更新しようとするセクション:', { sectionId, updatedSection })

            const { error } = await supabase
                .from('Section')
                .update(updatedSection)
                .eq('SectionUUID', sectionId)

            if (error) {
                console.error('質問更新エラー:', error)
                setMessage(`更新に失敗しました: ${error.message}`)
                throw error
            }

            setSections(prev => prev.map(section => 
                section.SectionUUID === sectionId 
                    ? { ...section, ...updatedSection }
                    : section
            ))
            console.log('質問が正常に更新されました')
            
            await new Promise(resolve => setTimeout(resolve, 100))
            
        } catch (error: any) {
            console.error('セクション更新エラー詳細:', error)
            setMessage(`セクションの更新に失敗しました: ${error?.message || 'Unknown error'}`)
            throw error
        }
    }

    const handleDragEnd = async (event: any) => {
        const { active, over } = event

        if (active.id !== over.id) {
            const oldIndex = sections.findIndex(section => section.SectionUUID === active.id)
            const newIndex = sections.findIndex(section => section.SectionUUID === over.id)
            
            const newSections = arrayMove(sections, oldIndex, newIndex)
            
            const updatedSections = newSections.map((section, index) => ({
                ...section,
                SectionOrder: index + 1
            }))
            
            setSections(updatedSections)
            
            try {
                const supabase = createClient()
                
                for (const section of updatedSections) {
                    await supabase
                        .from('Section')
                        .update({ SectionOrder: section.SectionOrder })
                        .eq('SectionUUID', section.SectionUUID)
                }
                
                setMessage('質問の順序を更新しました')
            } catch (error) {
                console.error('順序更新エラー:', error)
                setMessage('順序の更新に失敗しました')
            }
        }
    }

    const handleCreateNewForm = async () => {
        setLoading(true)
        setMessage('')

        try {
            const supabase = createClient()
            
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
                router.push(`/project/${newForm.FormUUID}`)
            }
        } catch (error: any) {
            console.error('フォーム作成エラー詳細:', error)
            setMessage(`フォームの作成に失敗しました: ${error?.message || 'Unknown error'}`)
        } finally {
            setLoading(false)
        }
    }
    
    return (
        <Box sx={{ 
            width: '100%'
        }}>
            {message && (
                <Alert severity={message.includes('失敗') ? 'error' : 'success'} sx={{ mb: 2 }}>
                    {message}
                </Alert>
            )}
            
            {!hideFormSelector && (
                <FormSelector 
                    availableFormIds={availableFormIds}
                    currentFormId={currentFormId}
                    onFormChange={setCurrentFormId}
                    onCreateNew={handleCreateNewForm}
                    loading={loading}
                />
            )}

            <SectionCreator 
                currentFormId={currentFormId}
                onSave={handleSaveSection}
                loading={loading}
                sectionsCount={sections.length}
            />
            <SectionList 
                sections={sections}
                currentFormId={currentFormId}
                onDelete={handleDeleteSection}
                onUpdate={handleUpdateSection}
                onReorder={handleDragEnd}
            />
        </Box>
    )
}
