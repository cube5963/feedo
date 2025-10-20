"use client"
import {useParams, useRouter} from 'next/navigation'
import {useEffect, useState} from 'react'
import {Alert, Box, Paper, Tab, Tabs, Typography} from '@mui/material'
import Header from '@/app/_components/Header'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import StatisticsTab from '@/app/project/_components/StatisticsTab'
import FormManager from "@/app/_components/forms/FormManager";
import {SupabaseAuthClient} from "@/utils/supabase/user/user";
import SettingsTab from "@/app/project/_components/SettingsTab";

export default function ProjectPage() {
    const params = useParams()
    const router = useRouter()
    const projectId = params.id as string
    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState("")
    const [currentTab, setCurrentTab] = useState(0) // タブの状態を追加
    const {supabase, isAuth, loading: authLoading, user} = SupabaseAuthClient();

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
        };

        setLoading(false)

        initialize();
    }, [router, supabase, isAuth, user, projectId, authLoading]);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue)
    }

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
                        {currentTab === 1 && <StatisticsTab projectId={projectId} supabase={supabase}/>}
                        {currentTab === 2 && <SettingsTab formId={projectId} supabase={supabase} message={message}
                                                          setMessage={setMessage}/>}
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
