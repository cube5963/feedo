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
  Avatar,
  Paper,
  Divider
} from '@mui/material';
import { 
  PlayArrow,
  AutoAwesome,
  Speed,
  BarChart,
  Shield,
  CheckCircleOutline,
  ArrowForward,
  Star,
  TrendingUp
} from '@mui/icons-material';
import { useRouter } from 'next/navigation';
import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import {
  useFadeInAnimation,
  useSlideInAnimation,
  useScaleAnimation,
  useStaggerAnimation,
  useParallaxAnimation,
  useHoverAnimation,
  useCountUpAnimation
} from '../lib/hooks/useGSAPAnimations';
import { 
  AnimatedCard, 
  AnimatedButton, 
  FloatingElement, 
  PulsingElement, 
  GlowEffect,
  SushiBelt,
  ExplodeEffect,
  Flip3DCard,
  IntenseBounce,
  RainbowGlow,
  ParticleExplosion,
  MatrixText,
  SparkleEffect,
  NeonGlow
} from './_components/AnimatedComponents';
import WebNavi from './_components/webnavi';

export default function Home() {
  const router = useRouter();
  
  // アニメーション用のrefs
  const heroRef = useRef<HTMLDivElement>(null);
  const featuresRef = useRef<HTMLDivElement>(null);
  const statsRef = useRef<HTMLDivElement>(null);
  const testimonialRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAPプラグインの登録
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      // ヒーローセクションのアニメーション
      const tl = gsap.timeline();
      
      if (heroRef.current) {
        const heroChip = heroRef.current.querySelector('.hero-chip');
        const heroTitle = heroRef.current.querySelector('.hero-title');
        const heroDescription = heroRef.current.querySelector('.hero-description');
        const heroButtons = heroRef.current.querySelectorAll('.hero-button');

        if (heroChip) {
          tl.fromTo(heroChip, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }
          );
        }
        
        if (heroTitle) {
          tl.fromTo(heroTitle, 
            { y: 50, opacity: 0 },
            { y: 0, opacity: 1, duration: 1, ease: "power2.out" }, "-=0.5"
          );
        }
        
        if (heroDescription) {
          tl.fromTo(heroDescription, 
            { y: 30, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.8, ease: "power2.out" }, "-=0.3"
          );
        }
        
        if (heroButtons.length > 0) {
          tl.fromTo(heroButtons, 
            { y: 30, opacity: 0, scale: 0.95 },
            { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.7)", stagger: 0.1 }, "-=0.2"
          );
        }
      }

      // 機能セクションのアニメーション
      if (featuresRef.current) {
        const featureCards = featuresRef.current.querySelectorAll('.feature-card');
        if (featureCards.length > 0) {
          gsap.fromTo(featureCards, 
            { y: 60, opacity: 0, scale: 0.9 },
            {
              y: 0,
              opacity: 1,
              scale: 1,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.2,
              scrollTrigger: {
                trigger: featuresRef.current,
                start: "top 80%",
                end: "bottom 20%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }

      // 統計セクションのアニメーション
      if (statsRef.current) {
        const statItems = statsRef.current.querySelectorAll('.stat-item');
        if (statItems.length > 0) {
          gsap.fromTo(statItems, 
            { y: 40, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.6,
              ease: "power2.out",
              stagger: 0.1,
              scrollTrigger: {
                trigger: statsRef.current,
                start: "top 85%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }

      // 証言セクションのアニメーション
      if (testimonialRef.current) {
        const testimonialCards = testimonialRef.current.querySelectorAll('.testimonial-card');
        if (testimonialCards.length > 0) {
          gsap.fromTo(testimonialCards, 
            { x: -50, opacity: 0 },
            {
              x: 0,
              opacity: 1,
              duration: 0.8,
              ease: "power2.out",
              stagger: 0.15,
              scrollTrigger: {
                trigger: testimonialRef.current,
                start: "top 75%",
                toggleActions: "play none none reverse"
              }
            }
          );
        }
      }

      // CTAセクションのアニメーション
      if (ctaRef.current) {
        gsap.fromTo(ctaRef.current, 
          { y: 50, opacity: 0, scale: 0.95 },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: ctaRef.current,
              start: "top 80%",
              toggleActions: "play none none reverse"
            }
          }
        );
      }

      // パララックス効果
      const parallaxBg = document.querySelector('.parallax-bg');
      const parallaxSection = document.querySelector('.parallax-section');
      if (parallaxBg && parallaxSection) {
        gsap.to(parallaxBg, {
          yPercent: -50,
          ease: "none",
          scrollTrigger: {
            trigger: parallaxSection,
            start: "top bottom",
            end: "bottom top",
            scrub: true
          }
        });
      }

      return () => {
        ScrollTrigger.getAll().forEach(trigger => trigger.kill());
      };
    }
  }, []);

  const features = [
    {
      icon: <AutoAwesome sx={{ fontSize: 32, color: '#000' }} />,
      title: 'AI自動生成',
      description: '質問内容を入力するだけで、AIが最適なフォーム構成を瞬時に生成'
    },
    {
      icon: <Speed sx={{ fontSize: 32, color: '#000' }} />,
      title: '高速作成',
      description: '従来の10分の1の時間でプロフェッショナルなフォームが完成'
    },
    {
      icon: <BarChart sx={{ fontSize: 32, color: '#000' }} />,
      title: 'リアルタイム分析',
      description: '回答データを即座に可視化し、洞察を得られるダッシュボード'
    },
    {
      icon: <Shield sx={{ fontSize: 32, color: '#000' }} />,
      title: 'セキュア',
      description: 'エンタープライズ級のセキュリティでデータを保護'
    }
  ];

  const stats = [
    { number: '50,000+', label: '作成されたフォーム' },
    { number: '99.9%', label: 'アップタイム' },
    { number: '10秒', label: '平均作成時間' },
    { number: '500+', label: '満足企業' }
  ];

  const testimonials = [
    {
      name: '田中 太郎',
      company: 'スタートアップ CEO',
      comment: 'フォーム作成が劇的に効率化されました。AIの精度に驚いています。',
      avatar: '👨‍💼',
      rating: 5
    },
    {
      name: '佐藤 花子',
      company: 'マーケティング部長',
      comment: 'データ分析機能が素晴らしく、意思決定が格段に速くなりました。',
      avatar: '👩‍💼',
      rating: 5
    },
    {
      name: '山田 次郎',
      company: 'IT企業 CTO',
      comment: 'セキュリティ面でも安心して使えるエンタープライズ級のサービスです。',
      avatar: '👨‍💻',
      rating: 5
    },
    {
      name: '鈴木 美咲',
      company: 'コンサルタント',
      comment: 'クライアント向けのアンケートが簡単に作れて重宝しています。',
      avatar: '👩‍🏫',
      rating: 5
    },
    {
      name: '高橋 勇',
      company: '中小企業 社長',
      comment: 'コストパフォーマンスが最高！小さな会社でも使いやすいです。',
      avatar: '🧑‍💼',
      rating: 5
    },
    {
      name: '伊藤 明子',
      company: 'NPO代表',
      comment: 'ボランティア向けのフォームも簡単に作成できて助かっています。',
      avatar: '👩‍🔬',
      rating: 5
    }
  ];

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#ffffff' }}>
      <WebNavi />
      
      {/* ヒーローセクション */}
      <Box ref={heroRef} sx={{ pt: 12, pb: 8, backgroundColor: '#000', color: '#fff' }} className="parallax-section">
        <Box className="parallax-bg" sx={{ 
          position: 'absolute', 
          top: 0, 
          left: 0, 
          width: '100%', 
          height: '120%', 
          backgroundColor: 'linear-gradient(45deg, #000 0%, #333 100%)', 
          zIndex: -1 
        }} />
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            flexWrap: 'wrap',
            gap: 4,
            minHeight: '70vh'
          }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 60%' } }}>
              <Stack spacing={4}>
                <Chip 
                  className="hero-chip"
                  label="✨ AI-Powered Form Builder" 
                  sx={{ 
                    alignSelf: 'flex-start',
                    backgroundColor: '#fff',
                    color: '#000',
                    fontWeight: 600,
                    fontSize: '0.9rem'
                  }} 
                />
                <Typography 
                  className="hero-title"
                  variant="h1" 
                  component="h1" 
                  sx={{ 
                    fontWeight: 900,
                    fontSize: { xs: '3rem', md: '4.5rem' },
                    lineHeight: 1.1,
                    letterSpacing: '-0.02em'
                  }}
                >
                  フォーム作成を
                  <br />
                  <Box component="span" sx={{ color: '#fff', textDecoration: 'underline' }}>
                    革新する
                  </Box>
                </Typography>
                <Typography 
                  className="hero-description"
                  variant="h5" 
                  sx={{ 
                    opacity: 0.8,
                    fontWeight: 300,
                    lineHeight: 1.6,
                    maxWidth: 500
                  }}
                >
                  AIがあなたの質問を理解し、最適なフォームを瞬時に生成。
                  データ収集から分析まで、すべてをシンプルに。
                </Typography>
                <Stack direction="row" spacing={3} sx={{ mt: 4 }}>
                  <GlowEffect glowColor="#ffffff" intensity={15}>
                    <Button
                      className="hero-button"
                      variant="contained"
                      size="large"
                      onClick={() => router.push('/ai')}
                      sx={{
                        backgroundColor: '#fff',
                        color: '#000',
                        fontWeight: 600,
                        px: 4,
                        py: 1.5,
                        fontSize: '1.1rem',
                        borderRadius: 2,
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        '&:hover': {
                          backgroundColor: '#f5f5f5',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
                        }
                      }}
                    >
                      無料でAI体験
                    </Button>
                  </GlowEffect>
                  <Button
                    className="hero-button"
                    variant="outlined"
                    size="large"
                    startIcon={<PlayArrow />}
                    onClick={() => router.push('/features')}
                    sx={{
                      borderColor: '#fff',
                      color: '#fff',
                      fontWeight: 600,
                      px: 4,
                      py: 1.5,
                      borderRadius: 2,
                      transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                      '&:hover': {
                        borderColor: '#fff',
                        backgroundColor: 'rgba(255,255,255,0.1)',
                        transform: 'translateY(-2px)',
                        boxShadow: '0 8px 25px rgba(255,255,255,0.1)'
                      }
                    }}
                  >
                    デモを見る
                  </Button>
                </Stack>
              </Stack>
            </Box>
            <Box sx={{ 
              flex: { xs: '1 1 100%', md: '1 1 40%' },
              textAlign: 'center'
            }}>
              <Paper
                elevation={0}
                sx={{
                  p: 4,
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: 3,
                  border: '2px solid #e0e0e0'
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                  📊 顧客満足度調査
                </Typography>
                <Stack spacing={2}>
                  {['サービス品質はいかがですか？', '価格に満足していますか？', 'おすすめ度を教えてください'].map((question, index) => (
                    <Box key={index} sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      gap: 2,
                      p: 2,
                      backgroundColor: '#f8f8f8',
                      borderRadius: 2,
                      border: '1px solid #e0e0e0'
                    }}>
                      <CheckCircleOutline sx={{ fontSize: 18, color: '#000' }} />
                      <Typography variant="body2">{question}</Typography>
                    </Box>
                  ))}
                </Stack>
                <Typography variant="caption" sx={{ mt: 2, opacity: 0.6, display: 'block' }}>
                  AIがアンケートを自動生成
                </Typography>
              </Paper>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* 統計セクション */}
      <Box ref={statsRef} sx={{ py: 6, backgroundColor: '#f8f8f8', borderTop: '1px solid #e0e0e0', borderBottom: '1px solid #e0e0e0' }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            justifyContent: 'space-around',
            gap: 4,
            textAlign: 'center'
          }}>
            {stats.map((stat, index) => (
              <Box key={index} className="stat-item" sx={{ flex: '1 1 200px' }}>
                <Typography 
                  variant="h3" 
                  sx={{ 
                    fontWeight: 900, 
                    color: '#000',
                    fontSize: { xs: '2rem', md: '3rem' }
                  }}
                >
                  {stat.number}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.7, fontWeight: 500 }}>
                  {stat.label}
                </Typography>
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* 機能紹介セクション */}
      <Container ref={featuresRef} maxWidth="lg" sx={{ py: 10 }}>
        <Box className="features-header" sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h2" 
            component="h2" 
            sx={{ 
              fontWeight: 900, 
              mb: 3,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#000'
            }}
          >
            なぜFeedoなのか？
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: 'auto' }}>
            従来のフォーム作成ツールの限界を超えた、次世代のソリューション
          </Typography>
        </Box>

        <Box sx={{ 
          display: 'flex', 
          flexWrap: 'wrap', 
          gap: 4,
          justifyContent: 'center'
        }}>
          {features.map((feature, index) => (
            <Card 
              key={index}
              className="feature-card"
              elevation={0}
              sx={{ 
                flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
                maxWidth: 500,
                border: '1px solid #e0e0e0',
                borderRadius: 3,
                p: 3,
                '&:hover': {
                  borderColor: '#000',
                  transform: 'translateY(-4px)',
                  transition: 'all 0.3s ease'
                }
              }}
            >
              <Stack spacing={3} alignItems="flex-start">
                <Box 
                  sx={{ 
                    p: 2, 
                    backgroundColor: '#f8f8f8', 
                    borderRadius: 2,
                    border: '1px solid #e0e0e0'
                  }}
                >
                  {feature.icon}
                </Box>
                <Box>
                  <Typography variant="h5" component="h3" sx={{ fontWeight: 700, mb: 2, color: '#000' }}>
                    {feature.title}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {feature.description}
                  </Typography>
                </Box>
              </Stack>
            </Card>
          ))}
        </Box>
      </Container>

      {/* お客様の声セクション */}
      <Box ref={testimonialRef} sx={{ py: 10, backgroundColor: '#000', color: '#fff' }}>
        <Container maxWidth="lg">
          <Box className="testimonials-header" sx={{ textAlign: 'center', mb: 8 }}>
            <Typography 
              variant="h2" 
              component="h2" 
              sx={{ 
                fontWeight: 900, 
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' }
              }}
            >
              お客様の声
            </Typography>
            <Typography variant="h6" sx={{ opacity: 0.8, maxWidth: 600, mx: 'auto' }}>
              実際にFeedoを使用している企業様からの評価
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
            justifyContent: 'center'
          }}>
            {testimonials.map((testimonial, index) => (
              <Card 
                key={index}
                className="testimonial-card"
                elevation={0}
                sx={{ 
                  flex: { xs: '1 1 100%', md: '1 1 calc(50% - 16px)' },
                  maxWidth: 500,
                  backgroundColor: '#fff',
                  color: '#000',
                  borderRadius: 3,
                  p: 4
                }}
              >
                <Stack spacing={3}>
                  <Box sx={{ display: 'flex', gap: 0.5 }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} sx={{ fontSize: 20, color: '#000' }} />
                    ))}
                  </Box>
                  <Typography variant="body1" sx={{ lineHeight: 1.8, fontStyle: 'italic' }}>
                    "{testimonial.comment}"
                  </Typography>
                  <Box>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      {testimonial.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {testimonial.company}
                    </Typography>
                  </Box>
                </Stack>
              </Card>
            ))}
          </Box>
        </Container>
      </Box>

      {/* CTAセクション */}
      <Container ref={ctaRef} maxWidth="md" sx={{ py: 12, textAlign: 'center' }}>
        <Stack spacing={4}>
          <Typography 
            className="cta-title"
            variant="h2" 
            sx={{ 
              fontWeight: 900,
              fontSize: { xs: '2.5rem', md: '3.5rem' },
              color: '#000'
            }}
          >
            今すぐ始めよう
          </Typography>
          <Typography className="cta-description" variant="h6" sx={{ opacity: 0.7, maxWidth: 500, mx: 'auto' }}>
            3分でアカウント作成完了。クレジットカード不要で今すぐお試しいただけます。
          </Typography>
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3, 
            justifyContent: 'center',
            mt: 6 
          }}>
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
              無料アカウント作成
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => router.push('/account/signin')}
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
              ログイン
            </Button>
          </Box>
          
          <Typography variant="body2" sx={{ opacity: 0.5, mt: 4 }}>
            30日間の無料トライアル期間付き
          </Typography>
        </Stack>
      </Container>

      {/* フッター */}
      <Box sx={{ backgroundColor: '#f8f8f8', borderTop: '1px solid #e0e0e0', py: 6 }}>
        <Container maxWidth="lg">
          <Box sx={{ 
            display: 'flex', 
            flexWrap: 'wrap', 
            gap: 4,
            alignItems: 'flex-start',
            justifyContent: 'space-between'
          }}>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Typography variant="h4" sx={{ fontWeight: 900, mb: 2, color: '#000' }}>
                Feedo
              </Typography>
              <Typography variant="body1" sx={{ opacity: 0.7, maxWidth: 400 }}>
                AIの力でフォーム作成を革新する次世代プラットフォーム。
                データ収集から分析まで、すべてをシンプルに。
              </Typography>
            </Box>
            <Box sx={{ flex: { xs: '1 1 100%', md: '1 1 50%' } }}>
              <Stack 
                direction="row" 
                spacing={4} 
                justifyContent={{ xs: 'flex-start', md: 'flex-end' }}
                flexWrap="wrap"
              >
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                    製品
                  </Typography>
                  <Stack spacing={1}>
                    <Button 
                      color="inherit" 
                      sx={{ justifyContent: 'flex-start', p: 0, minWidth: 'auto' }}
                      onClick={() => router.push('/features')}
                    >
                      機能一覧
                    </Button>
                    <Button 
                      color="inherit" 
                      sx={{ justifyContent: 'flex-start', p: 0, minWidth: 'auto' }}
                      onClick={() => router.push('/ai')}
                    >
                      AI フォーム作成
                    </Button>
                    <Button 
                      color="inherit" 
                      sx={{ justifyContent: 'flex-start', p: 0, minWidth: 'auto' }}
                      onClick={() => router.push('/plans')}
                    >
                      料金プラン
                    </Button>
                  </Stack>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 2, color: '#000' }}>
                    サポート
                  </Typography>
                  <Stack spacing={1}>
                    <Button 
                      color="inherit" 
                      sx={{ justifyContent: 'flex-start', p: 0, minWidth: 'auto' }}
                    >
                      ヘルプセンター
                    </Button>
                    <Button 
                      color="inherit" 
                      sx={{ justifyContent: 'flex-start', p: 0, minWidth: 'auto' }}
                    >
                      お問い合わせ
                    </Button>
                  </Stack>
                </Box>
              </Stack>
            </Box>
          </Box>
          
          <Divider sx={{ my: 4 }} />
          
          <Box sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', sm: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}>
            <Typography variant="body2" sx={{ opacity: 0.6 }}>
              © 2025 Feedo. All rights reserved.
            </Typography>
            <Stack direction="row" spacing={3}>
              <Button color="inherit" size="small">プライバシーポリシー</Button>
              <Button color="inherit" size="small">利用規約</Button>
            </Stack>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
