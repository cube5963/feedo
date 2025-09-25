"use client";
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Card, 
  CardContent,
  Stack,
  Chip,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Switch,
  Divider,
  Alert,
  Paper
} from '@mui/material';
import { 
  CheckCircleOutline,
  Close,
  Star,
  TrendingUp,
  Security,
  Support,
  Speed,
  People,
  Analytics,
  Cloud,
  AutoAwesome,
  BusinessCenter,
  Business
} from '@mui/icons-material';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/app/_components/Header';

export default function PlansPage() {
  const router = useRouter();
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: 'Starter',
      icon: <Speed sx={{ fontSize: 40, color: '#666' }} />,
      description: '個人利用や小規模チームに最適',
      monthlyPrice: 0,
      annualPrice: 0,
      popular: false,
      features: [
        { name: 'フォーム作成数', value: '5個まで', included: true },
        { name: '月間回答数', value: '100回答', included: true },
        { name: 'AI自動生成', value: '月5回', included: true },
        { name: '基本テンプレート', value: '20種類', included: true },
        { name: 'データエクスポート', value: 'CSV', included: true },
        { name: 'メールサポート', value: '基本', included: true },
        { name: 'カスタムドメイン', value: '', included: false },
        { name: 'チーム機能', value: '', included: false },
        { name: '高度な分析', value: '', included: false },
        { name: '無制限フォーム', value: '', included: false }
      ],
      highlights: [
        '完全無料でスタート',
        '基本機能をすべて利用',
        'AI機能も体験可能',
        'クレジットカード不要'
      ]
    },
    {
      name: 'Professional',
      icon: <BusinessCenter sx={{ fontSize: 40, color: '#000' }} />,
      description: '本格運用とチーム協業に最適',
      monthlyPrice: 2980,
      annualPrice: 29800,
      popular: true,
      features: [
        { name: 'フォーム作成数', value: '無制限', included: true },
        { name: '月間回答数', value: '10,000回答', included: true },
        { name: 'AI自動生成', value: '無制限', included: true },
        { name: 'プレミアムテンプレート', value: '100種類', included: true },
        { name: 'データエクスポート', value: 'CSV/PDF/Excel', included: true },
        { name: 'チャットサポート', value: '24/7', included: true },
        { name: 'カスタムドメイン', value: '✓', included: true },
        { name: 'チーム機能', value: '10名まで', included: true },
        { name: '高度な分析', value: '詳細レポート', included: true },
        { name: '条件分岐', value: '無制限', included: true }
      ],
      highlights: [
        '無制限のフォーム作成',
        'AI機能をフル活用',
        'チーム協業機能付き',
        '高度な分析・レポート'
      ]
    },
    {
      name: 'Enterprise',
      icon: <Business sx={{ fontSize: 40, color: '#000' }} />,
      description: '大規模組織向けエンタープライズ',
      monthlyPrice: 9980,
      annualPrice: 99800,
      popular: false,
      features: [
        { name: 'フォーム作成数', value: '無制限', included: true },
        { name: '月間回答数', value: '100,000回答', included: true },
        { name: 'AI自動生成', value: '無制限', included: true },
        { name: 'カスタムテンプレート', value: '作成可能', included: true },
        { name: 'データエクスポート', value: 'すべて対応', included: true },
        { name: '専任サポート', value: '1営業日以内', included: true },
        { name: 'カスタムドメイン', value: '複数対応', included: true },
        { name: 'チーム機能', value: '無制限', included: true },
        { name: 'API連携', value: '無制限', included: true },
        { name: 'SSO認証', value: '対応', included: true }
      ],
      highlights: [
        '大規模データ収集対応',
        'エンタープライズ級セキュリティ',
        'API・SSO完全対応',
        '専任サポート体制'
      ]
    }
  ];

  const additionalFeatures = {
    security: [
      { name: 'SSL暗号化', starter: true, pro: true, enterprise: true },
      { name: 'GDPR準拠', starter: true, pro: true, enterprise: true },
      { name: '2段階認証', starter: false, pro: true, enterprise: true },
      { name: 'IP制限', starter: false, pro: false, enterprise: true },
      { name: '監査ログ', starter: false, pro: false, enterprise: true }
    ],
    integrations: [
      { name: 'Webhook', starter: false, pro: true, enterprise: true },
      { name: 'Zapier連携', starter: false, pro: true, enterprise: true },
      { name: 'Slack通知', starter: false, pro: true, enterprise: true },
      { name: 'Google Analytics', starter: false, pro: true, enterprise: true },
      { name: 'カスタムAPI', starter: false, pro: false, enterprise: true }
    ],
    support: [
      { name: 'メールサポート', starter: true, pro: true, enterprise: true },
      { name: 'チャットサポート', starter: false, pro: true, enterprise: true },
      { name: '電話サポート', starter: false, pro: false, enterprise: true },
      { name: '専任担当者', starter: false, pro: false, enterprise: true },
      { name: 'オンボーディング', starter: false, pro: false, enterprise: true }
    ]
  };

  const faqs = [
    {
      question: 'プランの変更はいつでも可能ですか？',
      answer: 'はい、いつでもプランのアップグレード・ダウングレードが可能です。変更は即座に反映され、料金は日割り計算されます。'
    },
    {
      question: '年間プランの割引率はどれくらいですか？',
      answer: '年間プランをお選びいただくと、月間プランと比較して約17%の割引が適用されます。'
    },
    {
      question: 'フリープランでもすべての機能を試せますか？',
      answer: 'Starterプランでは主要機能をすべて体験できます。AI生成、基本分析、データエクスポートなどの機能も利用可能です。'
    },
    {
      question: 'Enterpriseプランのカスタマイズは可能ですか？',
      answer: 'はい、Enterpriseプランでは組織のニーズに合わせたカスタマイズが可能です。詳細は営業チームにお問い合わせください。'
    },
    {
      question: 'データの移行サポートはありますか？',
      answer: 'ProfessionalプランとEnterpriseプランでは、他のサービスからのデータ移行サポートを提供しています。'
    }
  ];

  const getPrice = (plan: any) => {
    return isAnnual ? plan.annualPrice : plan.monthlyPrice;
  };

  const getSavings = (plan: any) => {
    if (plan.monthlyPrice === 0) return 0;
    return plan.monthlyPrice * 12 - plan.annualPrice;
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <Header showBackButton={false} showNavigation={true} />
      
      {/* ヒーローセクション */}
      <Box sx={{ pt: 12, pb: 8, backgroundColor: '#000', color: '#fff' }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: 'center', mb: 8 }}>
            <Chip 
              label="💰 Flexible Pricing Plans" 
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
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                mb: 3
              }}
            >
              あなたのニーズに
              <br />
              <Box component="span" sx={{ textDecoration: 'underline' }}>
                最適なプラン
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
                mb: 6
              }}
            >
              個人からエンタープライズまで、
              規模と用途に合わせた柔軟な料金プラン。
              まずは無料から始められます。
            </Typography>
            
            {/* 年間/月間切り替え */}
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              gap: 2,
              mb: 2
            }}>
              <Typography sx={{ opacity: isAnnual ? 0.6 : 1 }}>月間</Typography>
              <Switch
                checked={isAnnual}
                onChange={(e) => setIsAnnual(e.target.checked)}
                sx={{
                  '& .MuiSwitch-switchBase.Mui-checked': {
                    color: '#fff',
                  },
                  '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                    backgroundColor: '#fff',
                  },
                }}
              />
              <Typography sx={{ opacity: isAnnual ? 1 : 0.6 }}>年間</Typography>
              {isAnnual && (
                <Chip 
                  label="17% OFF"
                  size="small"
                  sx={{ 
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 600
                  }}
                />
              )}
            </Box>
          </Box>
        </Container>
      </Box>

      {/* プラン比較 */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Box sx={{ 
          display: 'flex', 
          flexDirection: { xs: 'column', lg: 'row' },
          gap: 4,
          alignItems: { xs: 'center', lg: 'stretch' }
        }}>
          {plans.map((plan, index) => (
            <Card 
              key={index}
              elevation={plan.popular ? 8 : 0}
              sx={{ 
                flex: 1,
                maxWidth: { xs: 400, lg: 'none' },
                position: 'relative',
                border: plan.popular ? '2px solid #000' : '1px solid #e0e0e0',
                borderRadius: 4,
                overflow: 'visible',
                transform: plan.popular ? 'scale(1.05)' : 'none',
                '&:hover': {
                  transform: plan.popular ? 'scale(1.05)' : 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              {plan.popular && (
                <Box sx={{
                  position: 'absolute',
                  top: -12,
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#000',
                  color: '#fff',
                  px: 3,
                  py: 1,
                  borderRadius: 2,
                  fontSize: '0.8rem',
                  fontWeight: 600,
                  zIndex: 1
                }}>
                  おすすめ
                </Box>
              )}
              
              <CardContent sx={{ p: 4, height: '100%', display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ textAlign: 'center', mb: 4 }}>
                  <Box sx={{ mb: 2 }}>
                    {plan.icon}
                  </Box>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, color: '#000' }}>
                    {plan.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    {plan.description}
                  </Typography>
                  
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: '#000' }}>
                      {getPrice(plan) === 0 ? '無料' : `¥${getPrice(plan).toLocaleString()}`}
                    </Typography>
                    {getPrice(plan) > 0 && (
                      <Typography variant="body2" color="text.secondary">
                        /{isAnnual ? '年' : '月'}
                      </Typography>
                    )}
                    {isAnnual && getSavings(plan) > 0 && (
                      <Typography variant="body2" sx={{ color: '#000', fontWeight: 600 }}>
                        年間¥{getSavings(plan).toLocaleString()}お得
                      </Typography>
                    )}
                  </Box>

                  <Button
                    variant={plan.popular ? "contained" : "outlined"}
                    fullWidth
                    size="large"
                    onClick={() => router.push('/account/signup')}
                    sx={{
                      backgroundColor: plan.popular ? '#000' : 'transparent',
                      color: plan.popular ? '#fff' : '#000',
                      borderColor: '#000',
                      fontWeight: 600,
                      py: 1.5,
                      mb: 4,
                      '&:hover': {
                        backgroundColor: plan.popular ? '#333' : '#f5f5f5'
                      }
                    }}
                  >
                    {plan.name === 'Starter' ? '無料で始める' : 'プランを選択'}
                  </Button>
                </Box>

                <Box sx={{ flex: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                    主な特徴
                  </Typography>
                  <Stack spacing={1} sx={{ mb: 4 }}>
                    {plan.highlights.map((highlight, idx) => (
                      <Box key={idx} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Star sx={{ fontSize: 16, color: '#000' }} />
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {highlight}
                        </Typography>
                      </Box>
                    ))}
                  </Stack>

                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                    機能詳細
                  </Typography>
                  <List dense sx={{ p: 0 }}>
                    {plan.features.map((feature, idx) => (
                      <ListItem key={idx} sx={{ px: 0, py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          {feature.included ? 
                            <CheckCircleOutline sx={{ fontSize: 18, color: '#000' }} /> :
                            <Close sx={{ fontSize: 18, color: '#ccc' }} />
                          }
                        </ListItemIcon>
                        <ListItemText 
                          primary={
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Typography variant="body2" sx={{ 
                                color: feature.included ? '#000' : '#ccc',
                                fontWeight: feature.included ? 500 : 400
                              }}>
                                {feature.name}
                              </Typography>
                              {feature.value && (
                                <Typography variant="body2" sx={{ 
                                  fontWeight: 600,
                                  color: feature.included ? '#000' : '#ccc'
                                }}>
                                  {feature.value}
                                </Typography>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                    ))}
                  </List>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      </Container>

      {/* 追加機能比較 */}
      <Box sx={{ py: 10, backgroundColor: '#f8f8f8' }}>
        <Container maxWidth="lg">
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 8,
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#000',
              textAlign: 'center'
            }}
          >
            詳細機能比較
          </Typography>

          <Stack spacing={6}>
            {/* セキュリティ */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#000' }}>
                  <Security sx={{ mr: 1, verticalAlign: 'middle' }} />
                  セキュリティ機能
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {additionalFeatures.security.map((feature, idx) => (
                    <Box key={idx} sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 1,
                      borderBottom: idx < additionalFeatures.security.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Typography variant="body1" sx={{ flex: '1', fontWeight: 500 }}>
                        {feature.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 8 }}>
                        {[feature.starter, feature.pro, feature.enterprise].map((included, planIdx) => (
                          <Box key={planIdx} sx={{ width: 60, textAlign: 'center' }}>
                            {included ? 
                              <CheckCircleOutline sx={{ color: '#000' }} /> :
                              <Close sx={{ color: '#ccc' }} />
                            }
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* 統合・連携 */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#000' }}>
                  <Cloud sx={{ mr: 1, verticalAlign: 'middle' }} />
                  統合・連携機能
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {additionalFeatures.integrations.map((feature, idx) => (
                    <Box key={idx} sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 1,
                      borderBottom: idx < additionalFeatures.integrations.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Typography variant="body1" sx={{ flex: '1', fontWeight: 500 }}>
                        {feature.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 8 }}>
                        {[feature.starter, feature.pro, feature.enterprise].map((included, planIdx) => (
                          <Box key={planIdx} sx={{ width: 60, textAlign: 'center' }}>
                            {included ? 
                              <CheckCircleOutline sx={{ color: '#000' }} /> :
                              <Close sx={{ color: '#ccc' }} />
                            }
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>

            {/* サポート */}
            <Card elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 3, color: '#000' }}>
                  <Support sx={{ mr: 1, verticalAlign: 'middle' }} />
                  サポート体制
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {additionalFeatures.support.map((feature, idx) => (
                    <Box key={idx} sx={{ 
                      display: 'flex', 
                      alignItems: 'center',
                      py: 1,
                      borderBottom: idx < additionalFeatures.support.length - 1 ? '1px solid #f0f0f0' : 'none'
                    }}>
                      <Typography variant="body1" sx={{ flex: '1', fontWeight: 500 }}>
                        {feature.name}
                      </Typography>
                      <Box sx={{ display: 'flex', gap: 8 }}>
                        {[feature.starter, feature.pro, feature.enterprise].map((included, planIdx) => (
                          <Box key={planIdx} sx={{ width: 60, textAlign: 'center' }}>
                            {included ? 
                              <CheckCircleOutline sx={{ color: '#000' }} /> :
                              <Close sx={{ color: '#ccc' }} />
                            }
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  ))}
                </Box>
              </CardContent>
            </Card>
          </Stack>
        </Container>
      </Box>

      {/* FAQ */}
      <Container maxWidth="md" sx={{ py: 10 }}>
        <Typography 
          variant="h2" 
          sx={{ 
            fontWeight: 900, 
            mb: 8,
            fontSize: { xs: '2rem', md: '3rem' },
            color: '#000',
            textAlign: 'center'
          }}
        >
          よくある質問
        </Typography>
        
        <Stack spacing={3}>
          {faqs.map((faq, index) => (
            <Card key={index} elevation={0} sx={{ border: '1px solid #e0e0e0', borderRadius: 3 }}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                  {faq.question}
                </Typography>
                <Typography variant="body1" sx={{ lineHeight: 1.7, color: '#666' }}>
                  {faq.answer}
                </Typography>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Container>

      {/* CTAセクション */}
      <Container maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Stack spacing={4}>
          <Typography 
            variant="h2" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2rem', md: '3rem' },
              color: '#000'
            }}
          >
            今すぐ始めましょう
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.7, maxWidth: 500, mx: 'auto' }}>
            無料プランから始めて、必要に応じて
            いつでもアップグレード可能です。
          </Typography>
          
          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} justifyContent="center" sx={{ mt: 6 }}>
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
              onClick={() => router.push('/contact')}
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
              営業に相談
            </Button>
          </Stack>
        </Stack>

        <Alert 
          severity="info" 
          sx={{ 
            mt: 6, 
            backgroundColor: '#f8f8f8',
            border: '1px solid #e0e0e0',
            '& .MuiAlert-message': { 
              fontWeight: 500 
            }
          }}
        >
          すべてのプランで30日間の返金保証付き。満足いただけない場合は全額返金いたします。
        </Alert>
      </Container>
    </Box>
  );
}