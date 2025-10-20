"use client";
import {Box, Button, Card, CardContent, Chip, Container, Stack, Typography} from '@mui/material';
import {AutoAwesome, BarChart, CheckCircleOutline, Group, PhoneIphone} from '@mui/icons-material';
import {useRouter} from 'next/navigation';
import Header from '@/app/_components/Header';

export default function FeaturesPage() {
    const router = useRouter();

    const mainFeatures = [
        {
            icon: <AutoAwesome sx={{fontSize: 48, color: '#000'}}/>,
            title: 'AI自動生成',
            description: 'あなたの質問内容から、AIが最適なフォーム構成を瞬時に生成。質問タイプの選択から項目の配置まで、すべて自動化。',
            benefits: [
                '10秒以内でフォーム完成',
                '最適な質問タイプを自動選択',
                '回答率を最大化する構成',
                '多言語対応可能'
            ]
        },
        {
            icon: <BarChart sx={{fontSize: 48, color: '#000'}}/>,
            title: 'リアルタイム分析',
            description: '回答データを即座に可視化し、洞察を得られる高度な分析機能。グラフ、チャート、統計データで結果を把握。',
            benefits: [
                '回答と同時にグラフ更新',
                '詳細な統計分析',
                'CSV・PDF出力対応',
                'ダッシュボード機能'
            ]
        },
        {
            icon: <Group sx={{fontSize: 48, color: '#000'}}/>,
            title: 'チーム協業',
            description: 'フォームの作成から分析まで、チーム全体でスムーズに協業。権限管理と共有機能で効率的なワークフロー。',
            benefits: [
                'メンバー招待・権限設定',
                'リアルタイム共同編集',
                'コメント・レビュー機能',
                '変更履歴の追跡'
            ]
        },
        {
            icon: <PhoneIphone sx={{fontSize: 48, color: '#000'}}/>,
            title: 'マルチデバイス',
            description: 'PC、タブレット、スマートフォン、どのデバイスでも最適な表示。回答者にストレスを与えない完璧なレスポンシブデザイン。',
            benefits: [
                'すべてのデバイスで最適表示',
                'タッチ操作に完全対応',
                'オフライン回答機能',
                'PWAアプリ対応'
            ]
        }
    ];

    const detailedFeatures = [
        {
            category: 'フォーム作成',
            features: [
                '20種類以上の質問タイプ',
                'ドラッグ&ドロップ編集',
                'カスタムデザインテーマ',
                '条件分岐機能',
                '入力値検証'
            ]
        },
        {
            category: 'データ収集',
            features: [
                'URL共有・埋め込み',
                'QRコード生成',
                'メール一括送信',
                'SNS連携',
                'API連携'
            ]
        },
        {
            category: '分析・出力',
            features: [
                'リアルタイムダッシュボード',
                '高度な統計分析',
                'データエクスポート',
                'レポート自動生成',
                'Webhook通知'
            ]
        },
        {
            category: 'セキュリティ',
            features: [
                'SSL暗号化通信',
                'GDPR完全準拠',
                'データ保護認証',
                'アクセスログ監視',
                'バックアップ機能'
            ]
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
                            label="✨ Full Feature Overview"
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
                            すべての機能を
                            <br/>
                            <Box component="span" sx={{textDecoration: 'underline'}}>
                                一つのプラットフォームで
                            </Box>
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
                            フォーム作成から分析まで、必要なすべての機能を統合。
                            従来の10倍の効率でデータ収集業務を革新します。
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
                        >
                            無料で機能体験
                        </Button>
                    </Box>
                </Container>
            </Box>

            {/* メイン機能セクション */}
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
                        コア機能
                    </Typography>
                    <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                        フォーム作成の全工程を革新する、4つの主要機能
                    </Typography>
                </Box>

                <Stack spacing={8}>
                    {mainFeatures.map((feature, index) => (
                        <Card
                            key={index}
                            elevation={0}
                            sx={{
                                border: '1px solid #e0e0e0',
                                borderRadius: 3,
                                overflow: 'hidden'
                            }}
                        >
                            <CardContent sx={{p: 0}}>
                                <Box sx={{
                                    display: 'flex',
                                    flexDirection: {xs: 'column', md: index % 2 === 0 ? 'row' : 'row-reverse'},
                                    alignItems: 'center'
                                }}>
                                    <Box sx={{
                                        flex: 1,
                                        p: {xs: 4, md: 6},
                                        textAlign: {xs: 'center', md: 'left'}
                                    }}>
                                        <Box sx={{mb: 3}}>
                                            {feature.icon}
                                        </Box>
                                        <Typography variant="h4" sx={{fontWeight: 700, mb: 3, color: '#000'}}>
                                            {feature.title}
                                        </Typography>
                                        <Typography variant="body1" sx={{lineHeight: 1.7, mb: 4, color: '#666'}}>
                                            {feature.description}
                                        </Typography>
                                        <Stack spacing={1.5}>
                                            {feature.benefits.map((benefit, idx) => (
                                                <Box key={idx} sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                                    <CheckCircleOutline sx={{fontSize: 20, color: '#000'}}/>
                                                    <Typography variant="body2" sx={{fontWeight: 500}}>
                                                        {benefit}
                                                    </Typography>
                                                </Box>
                                            ))}
                                        </Stack>
                                    </Box>
                                    <Box sx={{
                                        flex: 1,
                                        backgroundColor: '#f8f8f8',
                                        minHeight: 300,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #e0e0e0'
                                    }}>
                                        <Typography variant="h6" color="text.secondary">
                                            機能デモ画面
                                        </Typography>
                                    </Box>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Stack>
            </Container>

            {/* 詳細機能一覧 */}
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
                            全機能一覧
                        </Typography>
                        <Typography variant="h6" color="text.secondary" sx={{maxWidth: 600, mx: 'auto'}}>
                            カテゴリ別の詳細機能リスト
                        </Typography>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 4,
                        justifyContent: 'center'
                    }}>
                        {detailedFeatures.map((category, index) => (
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
                                    '&:hover': {
                                        borderColor: '#000',
                                        transform: 'translateY(-4px)',
                                        transition: 'all 0.3s ease'
                                    }
                                }}
                            >
                                <Typography variant="h5" sx={{fontWeight: 700, mb: 3, color: '#000'}}>
                                    {category.category}
                                </Typography>
                                <Stack spacing={1.5}>
                                    {category.features.map((feature, idx) => (
                                        <Box key={idx} sx={{display: 'flex', alignItems: 'center', gap: 2}}>
                                            <CheckCircleOutline sx={{fontSize: 18, color: '#000'}}/>
                                            <Typography variant="body2" sx={{fontWeight: 500}}>
                                                {feature}
                                            </Typography>
                                        </Box>
                                    ))}
                                </Stack>
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
                        今すぐすべての機能を体験
                    </Typography>
                    <Typography variant="h6" sx={{opacity: 0.7, maxWidth: 500, mx: 'auto'}}>
                        無料トライアルですべての機能にアクセス可能。
                        クレジットカード登録は不要です。
                    </Typography>

                    <Stack direction={{xs: 'column', sm: 'row'}} spacing={3} justifyContent="center" sx={{mt: 6}}>
                        <Button
                            variant="contained"
                            size="large"
                            onClick={() => router.push('/account/signup')}
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
                        >
                            無料で始める
                        </Button>
                        <Button
                            variant="outlined"
                            size="large"
                            onClick={() => router.push('/project')}
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
                            デモを見る
                        </Button>
                    </Stack>
                </Stack>
            </Container>
        </Box>
    );
}