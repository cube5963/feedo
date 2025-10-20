"use client";
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    Container,
    Divider,
    Stack,
    Step,
    StepLabel,
    Stepper,
    Typography
} from '@mui/material';
import {
    Analytics,
    AutoAwesome,
    CheckCircleOutline,
    CompareArrows,
    Language,
    PlayArrow,
    Psychology,
    Tune
} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import Header from '@/app/_components/Header';

export default function AICreationPage() {
    const router = useRouter();

    const aiSteps = [
        {
            title: '要件入力',
            description: 'フォームの目的や対象者を自然言語で入力',
            time: '30秒',
            details: [
                '簡潔な説明文を入力するだけ',
                '専門知識は一切不要',
                '日本語・英語両対応',
                '曖昧な表現でも理解'
            ]
        },
        {
            title: 'AI分析',
            description: '機械学習による最適化とフォーム構成決定',
            time: '5秒',
            details: [
                '10万件以上のデータから学習',
                '業界別ベストプラクティス適用',
                '回答率向上のための最適化',
                '質問順序の自動最適化'
            ]
        },
        {
            title: '自動生成',
            description: '完璧なフォームが瞬時に完成',
            time: '3秒',
            details: [
                '質問タイプを自動選択',
                'デザインテーマの適用',
                '条件分岐の自動設定',
                'バリデーションルール追加'
            ]
        },
        {
            title: 'カスタマイズ',
            description: '必要に応じて微調整可能',
            time: '任意',
            details: [
                'ドラッグ&ドロップで編集',
                'リアルタイムプレビュー',
                'スタイルのワンクリック変更',
                '詳細設定へのアクセス'
            ]
        }
    ];

    const aiFeatures = [
        {
            icon: <Psychology sx={{fontSize: 40, color: '#000'}}/>,
            title: '自然言語理解',
            description: '複雑な要件も日本語で簡潔に伝えるだけで、AIが意図を正確に理解してフォームを生成',
            metrics: '理解精度 98.5%'
        },
        {
            icon: <Analytics sx={{fontSize: 40, color: '#000'}}/>,
            title: 'データドリブン最適化',
            description: '過去の成功事例データを基に、回答率と品質を最大化するフォーム構成を自動選択',
            metrics: '回答率 +35% 向上'
        },
        {
            icon: <Tune sx={{fontSize: 40, color: '#000'}}/>,
            title: '業界別特化',
            description: 'マーケティング、HR、教育など、業界特有のニーズに最適化された質問パターンを適用',
            metrics: '12業界対応'
        },
        {
            icon: <Language sx={{fontSize: 40, color: '#000'}}/>,
            title: '多言語対応',
            description: '日本語入力から多言語フォームを自動生成。国際的な調査も簡単に実現',
            metrics: '15言語サポート'
        }
    ];

    const comparisonData = [
        {
            aspect: '作成時間',
            traditional: '60-180分',
            ai: '30-60秒',
            improvement: '最大360倍高速化'
        },
        {
            aspect: '必要スキル',
            traditional: '専門知識必須',
            ai: '日本語入力のみ',
            improvement: '技術スキル不要'
        },
        {
            aspect: '品質',
            traditional: '経験に依存',
            ai: '常に最適化',
            improvement: '一定品質保証'
        },
        {
            aspect: '回答率',
            traditional: '平均45%',
            ai: '平均61%',
            improvement: '+35%向上'
        }
    ];

    const useCases = [
        {
            title: 'マーケティング調査',
            description: '顧客満足度調査、製品フィードバック、市場リサーチ',
            icon: '📊'
        },
        {
            title: '人事・採用',
            description: '社内アンケート、候補者評価、面接フィードバック',
            icon: '👥'
        },
        {
            title: '教育・研修',
            description: '学習効果測定、コース評価、知識チェック',
            icon: '📚'
        },
        {
            title: 'イベント・サービス',
            description: '参加者アンケート、サービス評価、改善提案',
            icon: '🎯'
        }
    ];

    return (
        <Box sx={{minHeight: '100vh', backgroundColor: '#ffffff'}}>
            <Header showBackButton={false} showNavigation={true}/>

            {/* ヒーローセクション */}
            <Box sx={{pt: 12, pb: 8, backgroundColor: '#000', color: '#fff'}}>
                <Container maxWidth="lg">
                    <Box sx={{textAlign: 'center', mb: 8}}>
                        <Chip
                            label="🤖 AI-Powered Creation"
                            sx={{
                                backgroundColor: '#fff',
                                color: '#000',
                                fontWeight: 600,
                                fontSize: '0.9rem',
                                mb: 3
                            }}
                        />
                        <Typography
                            variant="h1"
                            component="h1"
                            sx={{
                                fontWeight: 900,
                                fontSize: {xs: '2.5rem', md: '4rem'},
                                lineHeight: 1.1,
                                letterSpacing: '-0.02em',
                                mb: 3
                            }}
                        >
                            AI が30秒で
                            <br/>
                            <Box component="span" sx={{textDecoration: 'underline'}}>
                                完璧なフォーム
                            </Box>
                            を作成
                        </Typography>
                        <Typography
                            variant="h6"
                            sx={{
                                opacity: 0.8,
                                fontWeight: 300,
                                lineHeight: 1.6,
                                maxWidth: 600,
                                mx: 'auto',
                                mb: 4
                            }}
                        >
                            自然言語でアイデアを伝えるだけで、
                            AIが業界のベストプラクティスを適用した
                            高品質なフォームを瞬時に生成
                        </Typography>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/project/ai')}
                            sx={{
                                backgroundColor: '#fff',
                                color: '#000',
                                fontWeight: 600,
                                px: 4,
                                py: 1.5,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                            startIcon={<PlayArrow/>}
                        >
                            AI作成を試す
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* AI作成フロー */}
            <Container maxWidth="lg" sx={{py: 10}}>
                <Box sx={{textAlign: 'center', mb: 8}}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            fontSize: {xs: '2rem', md: '3rem'},
                            color: '#000'
                        }}
                    >
                        4ステップで完成
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                        従来の複雑な作成プロセスを、AIが4つのシンプルなステップに集約
                    </Typography>
                </Box>

                <Box sx={{position: 'relative', mb: 8}}>
                    <Stepper
                        activeStep={-1}
                        alternativeLabel
                        sx={{
                            '& .MuiStepConnector-line': {
                                borderTopWidth: 2,
                                borderColor: '#e0e0e0'
                            }
                        }}
                    >
                        {aiSteps.map((step, index) => (
                            <Step key={index}>
                                <StepLabel
                                    sx={{
                                        '& .MuiStepLabel-label': {
                                            fontSize: '1.1rem',
                                            fontWeight: 600,
                                            color: '#000'
                                        }
                                    }}
                                >
                                    {step.title}
                                </StepLabel>
                            </Step>
                        ))}
                    </Stepper>
                </Box>

                <Stack spacing={6}>
                    {aiSteps.map((step, index) => (
                        <Card
                            key={index}
                            elevation={0}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: 3,
                                overflow: 'hidden',
                                '&:hover': {
                                    borderColor: '#000',
                                    transform: 'translateY(-2px)',
                                    transition: 'all 0.3s ease'
                                }
                            }}
                        >
                            <CardContent sx={{p: 6}}>
                                <Box sx={{display: 'flex', alignItems: 'flex-start', gap: 4}}>
                                    <Box sx={{
                                        minWidth: 60,
                                        height: 60,
                                        borderRadius: '50%',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontWeight: 700,
                                        fontSize: '1.5rem'
                                    }}>
                                        {index + 1}
                                    </Box>
                                    <Box sx={{flex: 1}}>
                                        <Box sx={{display: 'flex', alignItems: 'center', gap: 2, mb: 2}}>
                                            <Typography variant="h4" sx={{fontWeight: 700, color: '#000'}}>
                                                {step.title}
                                            </Typography>
                                            <Chip
                                                label={step.time}
                                                size="small"
                                                sx={{
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                        <Typography variant="body1" sx={{mb: 3, color: '#666', lineHeight: 1.7}}>
                                            {step.description}
                                        </Typography>
                                        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 2}}>
                                            {step.details.map((detail, idx) => (
                                                <Box key={idx} sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                                                    <CheckCircleOutline sx={{fontSize: 18, color: '#000'}}/>
                                                    <Typography variant="body2" sx={{fontWeight: 500}}>
                                                        {detail}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Box>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>

            {/* AI機能の特徴 */}
            <Box sx={{py: 10, backgroundColor: '#f8f8f8'}}>
                <Container maxWidth="lg">
                    <Box sx={{textAlign: 'center', mb: 8}}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 900,
                                mb: 3,
                                fontSize: {xs: '2rem', md: '3rem'},
                                color: '#000'
                            }}
                        >
                            AI の核心技術
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                            最先端の機械学習で実現する、次世代フォーム作成システム
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center'
                    }}>
                        {aiFeatures.map((feature, index) => (
                            <Card
                                key={index}
                                elevation={0}
                                sx={{
                                    flex: {xs: '1 1 100%', md: '1 1 calc(50% - 16px)'},
                                    maxWidth: 500,
                                    backgroundColor: '#fff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 3,
                                    p: 4,
                                    '&:hover': {
                                        borderColor: '#000',
                                        transform: 'translateY(-4px)',
                                        transition: 'all 0.3s ease'
                                    }
                                }}
                            >
                                <Box sx={{mb: 3}}>
                                    {feature.icon}
                                </Box>
                                <Typography variant="h5" sx={{fontWeight: 700, mb: 2, color: '#000'}}>
                                    {feature.title}
                                </Typography>
                                <Typography variant="body1" sx={{lineHeight: 1.7, mb: 3, color: '#666'}}>
                                    {feature.description}
                                </Typography>
                                <Chip
                                    label={feature.metrics}
                                    sx={{
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        fontWeight: 600
                                    }}
                                />
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* 従来手法との比較 */}
            <Container maxWidth="lg" sx={{py: 10}}>
                <Box sx={{textAlign: 'center', mb: 8}}>
                    <Typography
                        variant="h2"
                        component="h2"
                        sx={{
                            fontWeight: 900,
                            mb: 3,
                            fontSize: {xs: '2rem', md: '3rem'},
                            color: '#000'
                        }}
                    >
                        従来手法 vs AI作成
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                        AIがもたらす劇的な効率化と品質向上
                    </Typography>
                </Box>

                <Card elevation={0} sx={{border: '1px solid #e0e0e0', borderRadius: 3, overflow: 'hidden'}}>
                    <CardContent sx={{p: 0}}>
                        {comparisonData.map((item, index) => (
                            <Box key={index}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 4,
                                    '&:hover': {backgroundColor: '#f8f8f8'}
                                }}>
                                    <Typography variant="h6" sx={{fontWeight: 600, flex: '0 0 150px', color: '#000'}}>
                                        {item.aspect}
                                    </Typography>
                                    <Box sx={{flex: 1, display: 'flex', alignItems: 'center', gap: 3}}>
                                        <Box sx={{flex: 1, textAlign: 'center'}}>
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                従来手法
                                            </Typography>
                                            <Typography variant="h6" sx={{color: '#999'}}>
                                                {item.traditional}
                                            </Typography>
                                        </Box>
                                        <CompareArrows sx={{color: '#ccc'}}/>
                                        <Box sx={{flex: 1, textAlign: 'center'}}>
                                            <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                                AI作成
                                            </Typography>
                                            <Typography variant="h6" sx={{fontWeight: 600, color: '#000'}}>
                                                {item.ai}
                                            </Typography>
                                        </Box>
                                        <Box sx={{flex: '0 0 150px', textAlign: 'right'}}>
                                            <Chip
                                                label={item.improvement}
                                                sx={{
                                                    backgroundColor: '#000',
                                                    color: '#fff',
                                                    fontWeight: 600
                                                }}
                                            />
                                        </Box>
                                    </Box>
                                </Box>
                                {index < comparisonData.length - 1 && <Divider/>}
                            </Box>
                        ))}
                    </CardContent>
                </Card>
            </Container>

            {/* 活用シーン */}
            <Box sx={{py: 10, backgroundColor: '#f8f8f8'}}>
                <Container maxWidth="lg">
                    <Box sx={{textAlign: 'center', mb: 8}}>
                        <Typography
                            variant="h2"
                            component="h2"
                            sx={{
                                fontWeight: 900,
                                mb: 3,
                                fontSize: {xs: '2rem', md: '3rem'},
                                color: '#000'
                            }}
                        >
                            活用シーン
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                            あらゆる業界・用途で威力を発揮するAI作成機能
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center'
                    }}>
                        {useCases.map((useCase, index) => (
                            <Card
                                key={index}
                                elevation={0}
                                sx={{
                                    flex: {xs: '1 1 100%', sm: '1 1 calc(50% - 16px)'},
                                    maxWidth: 400,
                                    backgroundColor: '#fff',
                                    border: '1px solid #e0e0e0',
                                    borderRadius: 3,
                                    p: 4,
                                    textAlign: 'center',
                                    '&:hover': {
                                        borderColor: '#000',
                                        transform: 'translateY(-4px)',
                                        transition: 'all 0.3s ease'
                                    }
                                }}
                            >
                                <Typography variant="h1" sx={{fontSize: '3rem', mb: 2}}>
                                    {useCase.icon}
                                </Typography>
                                <Typography variant="h5" sx={{fontWeight: 700, mb: 2, color: '#000'}}>
                                    {useCase.title}
                                </Typography>
                                <Typography variant="body1" sx={{lineHeight: 1.7, color: '#666'}}>
                                    {useCase.description}
                                </Typography>
                            </Card>
                        ))}
                    </Box>
                </Container>
            </Box>

            {/* CTAセクション */}
            <Container maxWidth="md" sx={{py: 12, textAlign: 'center'}}>
                <Stack spacing={4}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontWeight: 900,
                            fontSize: {xs: '2rem', md: '3rem'},
                            color: '#000'
                        }}
                    >
                        今すぐAI作成を体験
                    </Typography>
                    <Typography variant="h6" sx={{opacity: 0.7, maxWidth: 500, mx: 'auto'}}>
                        30秒で完璧なフォームが完成。
                        AIの力を今すぐ体感してください。
                    </Typography>

                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={3} justifyContent="center" sx={{mt: 6}}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/project/ai')}
                            sx={{
                                backgroundColor: '#000',
                                color: '#fff',
                                fontWeight: 600,
                                px: 6,
                                py: 2,
                                fontSize: '1.1rem',
                                borderRadius: 2,
                                '&:hover': {
                                    backgroundColor: '#333'
                                }
                            }}
                            startIcon={<AutoAwesome/>}
                        >
                            AI作成を開始
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.push('/features')}
                            sx={{
                                borderColor: '#000',
                                color: '#000',
                                fontWeight: 600,
                                px: 6,
                                py: 2,
                                borderRadius: 2,
                                '&:hover': {
                                    borderColor: '#000',
                                    backgroundColor: '#f5f5f5'
                                }
                            }}
                        >
                            全機能を見る
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}