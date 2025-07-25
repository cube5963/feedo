"use client"
import { useParams } from 'next/navigation'
import { useState, useEffect } from 'react'
import FormComponent from '@/app/_components/form'
import { Box, Typography, Paper, TextField, Container, Alert, Fade } from '@mui/material'
import { createClient } from '@/utils/supabase/client'

export default function ProjectPage() {
    const params = useParams()
    const projectId = params.id as string
    const [formTitle, setFormTitle] = useState("")
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")

    // フォーム名を取得する関数
    const fetchFormName = async () => {
        try {
            const supabase = createClient()
            const { data, error } = await supabase
                .from('Form')
                .select('FormName')
                .eq('FormUUID', projectId)
                .single()

            if (error) {
                console.error('フォーム名取得エラー:', error)
                setMessage('フォーム名の取得に失敗しました')
                return
            }

            if (data) {
                setFormTitle(data.FormName)
            }
        } catch (error) {
            console.error('フォーム名取得エラー:', error)
            setMessage('フォーム名の取得に失敗しました')
        }
    }

    // フォーム名を更新する関数
    const updateFormName = async (newFormName: string) => {
        if (!newFormName.trim()) return

        setLoading(true)
        try {
            const supabase = createClient()
            const { error } = await supabase
                .from('Form')
                .update({ FormName: newFormName })
                .eq('FormUUID', projectId)

            if (error) {
                console.error('フォーム名更新エラー:', error)
                setMessage('フォーム名の更新に失敗しました')
                return
            }

            setMessage('フォーム名を更新しました')
            setTimeout(() => setMessage(''), 3000) // 3秒後にメッセージを消す
        } catch (error) {
            console.error('フォーム名更新エラー:', error)
            setMessage('フォーム名の更新に失敗しました')
        } finally {
            setLoading(false)
        }
    }

    // コンポーネントマウント時にフォーム名を取得
    useEffect(() => {
        if (projectId) {
            fetchFormName()
        }
    }, [projectId])

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#ffffff',
            py: 4
        }}>
            <Box sx={{
                maxWidth: 800,
                mx: 'auto',
                px: 3,
                width: '100%'
            }}>
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
                    <Typography variant="h6" sx={{ mb: 2, color: '#333', fontWeight: 600 }}>
                        プロジェクト設定
                    </Typography>
                    <TextField
                        label="プロジェクト名"
                        variant="outlined"
                        fullWidth
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        onBlur={() => updateFormName(formTitle)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                updateFormName(formTitle)
                            }
                        }}
                        disabled={loading}
                        placeholder="わかりやすいプロジェクト名を入力してください"
                    />
                </Paper>

                {/* メッセージ表示 */}
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

                {/* フォームコンポーネント */}
                <FormComponent formId={projectId} hideFormSelector={true} />
            </Box>
        </Box>
    )
}
