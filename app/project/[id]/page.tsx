"use client"
import { useParams } from 'next/navigation'
import FormComponent from '@/app/_components/form'
import { Box, Typography, Paper } from '@mui/material'

export default function ProjectPage() {
    const params = useParams()
    const projectId = params.id as string

    return (
        <Box sx={{ p: 3 }}>
            <Paper sx={{ p: 3, mb: 3 }}>
                <Typography variant="h4" sx={{ mb: 2 }}>
                    プロジェクト管理
                </Typography>
                <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                    Form ID: {projectId}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    このフォームのセクションを管理できます。セクションを追加・編集・削除して、アンケートやフォームをカスタマイズしてください。
                </Typography>
            </Paper>
            
            <FormComponent formId={parseInt(projectId)} hideFormSelector={true} />
        </Box>
    )
}
