"use client";
import React, { useRef, useEffect, useState } from 'react';
import { Box, Card, CardContent, IconButton } from '@mui/material';
import { useHoverAnimation, useScaleAnimation } from '../../lib/hooks/useGSAPAnimations';
import gsap from 'gsap';

interface AnimatedCardProps {
  children: React.ReactNode;
  className?: string;
  sx?: any;
  hoverScale?: number;
  animationDelay?: number;
  [key: string]: any;
}

// アニメーション付きカードコンポーネント
export const AnimatedCard: React.FC<AnimatedCardProps> = ({
  children,
  className = '',
  sx = {},
  hoverScale = 1.02,
  animationDelay = 0,
  ...props
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  // ホバーアニメーション
  useHoverAnimation(cardRef, { scale: hoverScale });

  // 初期アニメーション
  useEffect(() => {
    if (!cardRef.current) return;

    gsap.fromTo(cardRef.current, 
      { 
        y: 30, 
        opacity: 0, 
        scale: 0.95 
      },
      { 
        y: 0, 
        opacity: 1, 
        scale: 1, 
        duration: 0.8, 
        ease: "back.out(1.7)",
        delay: animationDelay
      }
    );
  }, [animationDelay]);

  return (
    <Card
      ref={cardRef}
      className={`animated-card ${className}`}
      sx={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        '&:hover': {
          boxShadow: '0 12px 40px rgba(0,0,0,0.1)',
        },
        ...sx
      }}
      {...props}
    >
      {children}
    </Card>
  );
};

interface AnimatedButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'contained' | 'outlined' | 'text';
  color?: 'primary' | 'secondary' | 'inherit';
  onClick?: () => void;
  startIcon?: React.ReactNode;
  sx?: any;
  animationType?: 'scale' | 'slide' | 'bounce';
  [key: string]: any;
}

// アニメーション付きボタンコンポーネント
export const AnimatedButton: React.FC<AnimatedButtonProps> = ({
  children,
  className = '',
  animationType = 'scale',
  sx = {},
  ...props
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!buttonRef.current) return;

    const button = buttonRef.current;

    const handleMouseEnter = () => {
      switch (animationType) {
        case 'scale':
          gsap.to(button, {
            scale: 1.05,
            duration: 0.2,
            ease: "power2.out"
          });
          break;
        case 'slide':
          gsap.to(button, {
            x: 5,
            duration: 0.2,
            ease: "power2.out"
          });
          break;
        case 'bounce':
          gsap.to(button, {
            y: -3,
            duration: 0.2,
            ease: "back.out(1.7)"
          });
          break;
      }
    };

    const handleMouseLeave = () => {
      gsap.to(button, {
        scale: 1,
        x: 0,
        y: 0,
        duration: 0.2,
        ease: "power2.out"
      });
    };

    const handleClick = () => {
      gsap.fromTo(button, 
        { scale: 1 },
        { scale: 0.95, duration: 0.1, yoyo: true, repeat: 1, ease: "power2.inOut" }
      );
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);
    button.addEventListener('click', handleClick);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
      button.removeEventListener('click', handleClick);
      gsap.killTweensOf(button);
    };
  }, [animationType]);

  return (
    <button
      ref={buttonRef}
      className={`animated-button ${className}`}
      style={{
        cursor: 'pointer',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        border: 'none',
        outline: 'none',
        ...sx
      }}
      {...props}
    >
      {children}
    </button>
  );
};

interface FloatingElementProps {
  children: React.ReactNode;
  floatDirection?: 'up' | 'down' | 'left' | 'right';
  floatDistance?: number;
  duration?: number;
  className?: string;
  sx?: any;
}

// 浮遊アニメーション要素
export const FloatingElement: React.FC<FloatingElementProps> = ({
  children,
  floatDirection = 'up',
  floatDistance = 10,
  duration = 2,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;
    let animationProps: any = {};

    switch (floatDirection) {
      case 'up':
        animationProps = { y: -floatDistance };
        break;
      case 'down':
        animationProps = { y: floatDistance };
        break;
      case 'left':
        animationProps = { x: -floatDistance };
        break;
      case 'right':
        animationProps = { x: floatDistance };
        break;
    }

    gsap.to(element, {
      ...animationProps,
      duration,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });

    return () => {
      gsap.killTweensOf(element);
    };
  }, [floatDirection, floatDistance, duration]);

  return (
    <Box
      ref={elementRef}
      className={`floating-element ${className}`}
      sx={sx}
    >
      {children}
    </Box>
  );
};

interface PulsingElementProps {
  children: React.ReactNode;
  pulseScale?: number;
  duration?: number;
  className?: string;
  sx?: any;
}

// パルスアニメーション要素
export const PulsingElement: React.FC<PulsingElementProps> = ({
  children,
  pulseScale = 1.05,
  duration = 1.5,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    gsap.to(elementRef.current, {
      scale: pulseScale,
      duration,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    });

    return () => {
      gsap.killTweensOf(elementRef.current);
    };
  }, [pulseScale, duration]);

  return (
    <Box
      ref={elementRef}
      className={`pulsing-element ${className}`}
      sx={sx}
    >
      {children}
    </Box>
  );
};

interface GlowEffectProps {
  children: React.ReactNode;
  glowColor?: string;
  intensity?: number;
  className?: string;
  sx?: any;
}

// グロー効果コンポーネント
export const GlowEffect: React.FC<GlowEffectProps> = ({
  children,
  glowColor = '#ffffff',
  intensity = 20,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const handleMouseEnter = () => {
      gsap.to(element, {
        boxShadow: `0 0 ${intensity}px ${glowColor}`,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(element, {
        boxShadow: '0 0 0px transparent',
        duration: 0.3,
        ease: "power2.out"
      });
    };

    element.addEventListener('mouseenter', handleMouseEnter);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mouseenter', handleMouseEnter);
      element.removeEventListener('mouseleave', handleMouseLeave);
      gsap.killTweensOf(element);
    };
  }, [glowColor, intensity]);

  return (
    <Box
      ref={elementRef}
      className={`glow-effect ${className}`}
      sx={{
        transition: 'box-shadow 0.3s ease',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// ===== 激しいアニメーション効果 =====

interface ExplodeEffectProps {
  children: React.ReactNode;
  triggerOnHover?: boolean;
  explodeScale?: number;
  duration?: number;
  className?: string;
  sx?: any;
}

// 爆発エフェクト
export const ExplodeEffect: React.FC<ExplodeEffectProps> = ({
  children,
  triggerOnHover = true,
  explodeScale = 1.3,
  duration = 0.6,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const explode = () => {
      gsap.to(element, {
        scale: explodeScale,
        duration: duration * 0.3,
        ease: "back.out(4)",
        yoyo: true,
        repeat: 1,
        transformOrigin: "center center"
      });
      
      // 爆発時の回転
      gsap.to(element, {
        rotation: 360,
        duration: duration,
        ease: "power2.out"
      });
      
      // 爆発時のグロー
      gsap.to(element, {
        boxShadow: "0 0 40px rgba(255,255,255,0.8)",
        duration: duration * 0.3,
        yoyo: true,
        repeat: 1,
        ease: "power2.out"
      });
    };

    if (triggerOnHover) {
      element.addEventListener('mouseenter', explode);
      return () => {
        element.removeEventListener('mouseenter', explode);
        gsap.killTweensOf(element);
      };
    }

    // 自動爆発（3秒間隔）
    const interval = setInterval(explode, 3000);
    return () => {
      clearInterval(interval);
      gsap.killTweensOf(element);
    };
  }, [triggerOnHover, explodeScale, duration]);

  return (
    <Box
      ref={elementRef}
      className={`explode-effect ${className}`}
      sx={{
        cursor: triggerOnHover ? 'pointer' : 'default',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

interface Flip3DCardProps {
  frontContent: React.ReactNode;
  backContent: React.ReactNode;
  autoFlip?: boolean;
  flipInterval?: number;
  className?: string;
  sx?: any;
}

// 3Dフリップカード
export const Flip3DCard: React.FC<Flip3DCardProps> = ({
  frontContent,
  backContent,
  autoFlip = false,
  flipInterval = 4000,
  className = '',
  sx = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const frontRef = useRef<HTMLDivElement>(null);
  const backRef = useRef<HTMLDivElement>(null);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    if (!containerRef.current || !frontRef.current || !backRef.current) return;

    const container = containerRef.current;
    const front = frontRef.current;
    const back = backRef.current;

    // 初期設定
    gsap.set(container, { perspective: 1000 });
    gsap.set([front, back], { transformStyle: "preserve-3d" });
    gsap.set(back, { rotationY: 180 });

    const flip = () => {
      const newFlipped = !isFlipped;
      setIsFlipped(newFlipped);
      
      gsap.to([front, back], {
        duration: 0.8,
        rotationY: newFlipped ? 180 : 0,
        ease: "power2.inOut",
        transformOrigin: "center center"
      });
      
      // 爆発的なスケール変化
      gsap.fromTo(container, 
        { scale: 1 },
        { scale: 1.1, duration: 0.4, yoyo: true, repeat: 1, ease: "back.out(3)" }
      );
    };

    if (autoFlip) {
      const interval = setInterval(flip, flipInterval);
      return () => {
        clearInterval(interval);
        gsap.killTweensOf([container, front, back]);
      };
    }

    container.addEventListener('click', flip);
    return () => {
      container.removeEventListener('click', flip);
      gsap.killTweensOf([container, front, back]);
    };
  }, [isFlipped, autoFlip, flipInterval]);

  return (
    <Box
      ref={containerRef}
      className={`flip-3d-card ${className}`}
      sx={{
        position: 'relative',
        cursor: autoFlip ? 'default' : 'pointer',
        ...sx
      }}
    >
      <Box
        ref={frontRef}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden'
        }}
      >
        {frontContent}
      </Box>
      <Box
        ref={backRef}
        sx={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          backfaceVisibility: 'hidden'
        }}
      >
        {backContent}
      </Box>
    </Box>
  );
};

interface IntenseBounceProps {
  children: React.ReactNode;
  bounceHeight?: number;
  bounceScale?: number;
  continuous?: boolean;
  className?: string;
  sx?: any;
}

// 激しいバウンスエフェクト
export const IntenseBounce: React.FC<IntenseBounceProps> = ({
  children,
  bounceHeight = 30,
  bounceScale = 1.2,
  continuous = true,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const element = elementRef.current;

    const bounce = () => {
      const tl = gsap.timeline();
      
      tl.to(element, {
        y: -bounceHeight,
        scale: bounceScale,
        duration: 0.3,
        ease: "power2.out"
      })
      .to(element, {
        y: 0,
        scale: 1,
        duration: 0.4,
        ease: "bounce.out"
      })
      .to(element, {
        y: -bounceHeight * 0.5,
        scale: bounceScale * 0.8,
        duration: 0.2,
        ease: "power2.out"
      })
      .to(element, {
        y: 0,
        scale: 1,
        duration: 0.3,
        ease: "bounce.out"
      });
    };

    if (continuous) {
      const interval = setInterval(bounce, 2000);
      return () => {
        clearInterval(interval);
        gsap.killTweensOf(element);
      };
    }

    element.addEventListener('mouseenter', bounce);
    return () => {
      element.removeEventListener('mouseenter', bounce);
      gsap.killTweensOf(element);
    };
  }, [bounceHeight, bounceScale, continuous]);

  return (
    <Box
      ref={elementRef}
      className={`intense-bounce ${className}`}
      sx={{
        cursor: continuous ? 'default' : 'pointer',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

interface RainbowGlowProps {
  children: React.ReactNode;
  intensity?: number;
  speed?: number;
  className?: string;
  sx?: any;
}

// レインボーグローエフェクト
export const RainbowGlow: React.FC<RainbowGlowProps> = ({
  children,
  intensity = 20,
  speed = 2,
  className = '',
  sx = {}
}) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const colors = [
      '#ff0000', // 赤
      '#ff8000', // オレンジ
      '#ffff00', // 黄
      '#80ff00', // 黄緑
      '#00ff00', // 緑
      '#00ff80', // 青緑
      '#00ffff', // シアン
      '#0080ff', // 青
      '#0000ff', // 青
      '#8000ff', // 紫
      '#ff00ff', // マゼンタ
      '#ff0080'  // ピンク
    ];

    const tl = gsap.timeline({ repeat: -1 });
    
    colors.forEach((color, index) => {
      tl.to(elementRef.current, {
        boxShadow: `0 0 ${intensity}px ${color}, 0 0 ${intensity * 2}px ${color}`,
        duration: speed / colors.length,
        ease: "none"
      });
    });

    return () => {
      tl.kill();
    };
  }, [intensity, speed]);

  return (
    <Box
      ref={elementRef}
      className={`rainbow-glow ${className}`}
      sx={{
        borderRadius: '8px',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

interface ParticleExplosionProps {
  children: React.ReactNode;
  particleCount?: number;
  colors?: string[];
  triggerOnClick?: boolean;
  className?: string;
  sx?: any;
}

// パーティクル爆発エフェクト
export const ParticleExplosion: React.FC<ParticleExplosionProps> = ({
  children,
  particleCount = 20,
  colors = ['#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff'],
  triggerOnClick = true,
  className = '',
  sx = {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const container = containerRef.current;
    
    // パーティクルを作成
    const particles = Array.from({ length: particleCount }, (_, i) => {
      const particle = document.createElement('div');
      particle.style.position = 'absolute';
      particle.style.width = '4px';
      particle.style.height = '4px';
      particle.style.backgroundColor = colors[i % colors.length];
      particle.style.borderRadius = '50%';
      particle.style.pointerEvents = 'none';
      particle.style.top = '50%';
      particle.style.left = '50%';
      particle.style.transform = 'translate(-50%, -50%)';
      particle.style.opacity = '0';
      container.appendChild(particle);
      return particle;
    });
    
    particlesRef.current = particles;

    const explode = () => {
      particles.forEach((particle, i) => {
        const angle = (i / particleCount) * Math.PI * 2;
        const distance = 100 + Math.random() * 100;
        const x = Math.cos(angle) * distance;
        const y = Math.sin(angle) * distance;
        
        gsap.fromTo(particle, 
          {
            opacity: 1,
            scale: 1,
            x: 0,
            y: 0
          },
          {
            x,
            y,
            opacity: 0,
            scale: 0,
            duration: 1 + Math.random() * 0.5,
            ease: "power2.out",
            delay: Math.random() * 0.2
          }
        );
      });
    };

    if (triggerOnClick) {
      container.addEventListener('click', explode);
      return () => {
        container.removeEventListener('click', explode);
        particles.forEach(p => p.remove());
        gsap.killTweensOf(particles);
      };
    }

    return () => {
      particles.forEach(p => p.remove());
      gsap.killTweensOf(particles);
    };
  }, [particleCount, colors, triggerOnClick]);

  return (
    <Box
      ref={containerRef}
      className={`particle-explosion ${className}`}
      sx={{
        position: 'relative',
        cursor: triggerOnClick ? 'pointer' : 'default',
        overflow: 'visible',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// === モダンで洗練されたアニメーション効果 ===

// テキストモーフィングエフェクト
export const MorphingText: React.FC<{
  texts: string[];
  interval?: number;
  sx?: any;
}> = ({ texts, interval = 3000, sx }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(timer);
  }, [texts.length, interval]);

  useEffect(() => {
    if (!textRef.current) return;

    gsap.fromTo(textRef.current,
      { opacity: 0, y: 20, rotateX: -90 },
      { 
        opacity: 1, 
        y: 0, 
        rotateX: 0,
        duration: 0.6,
        ease: "back.out(1.7)"
      }
    );
  }, [currentIndex]);

  return (
    <Box ref={textRef} sx={sx}>
      {texts[currentIndex]}
    </Box>
  );
};

// 3D変形カードエフェクト
export const Transform3DCard: React.FC<{
  children: React.ReactNode;
  intensity?: number;
  sx?: any;
}> = ({ children, intensity = 0.15, sx }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = (y - centerY) / centerY * intensity * 20;
      const rotateY = (x - centerX) / centerX * intensity * 20;

      gsap.to(card, {
        rotateX: -rotateX,
        rotateY: rotateY,
        transformPerspective: 1000,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(cardRef.current, {
        rotateX: 0,
        rotateY: 0,
        duration: 0.5,
        ease: "power2.out"
      });
    };

    cardRef.current.addEventListener('mousemove', handleMouseMove);
    cardRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      if (cardRef.current) {
        cardRef.current.removeEventListener('mousemove', handleMouseMove);
        cardRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [intensity]);

  return (
    <Box
      ref={cardRef}
      sx={{
        transformStyle: 'preserve-3d',
        transition: 'transform 0.3s ease',
        ...sx
      }}
    >
      {children}
    </Box>
  );
};

// マグネティック効果
export const MagneticElement: React.FC<{
  children: React.ReactNode;
  strength?: number;
  sx?: any;
}> = ({ children, strength = 0.3, sx }) => {
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!elementRef.current) return;

    const handleMouseMove = (e: MouseEvent) => {
      const element = elementRef.current;
      if (!element) return;

      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = (e.clientX - centerX) * strength;
      const deltaY = (e.clientY - centerY) * strength;

      gsap.to(element, {
        x: deltaX,
        y: deltaY,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(elementRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
      });
    };

    document.addEventListener('mousemove', handleMouseMove);
    elementRef.current.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      if (elementRef.current) {
        elementRef.current.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, [strength]);

  return (
    <Box ref={elementRef} sx={sx}>
      {children}
    </Box>
  );
};

// パララックス背景エフェクト
export const ParallaxBackground: React.FC<{
  children: React.ReactNode;
  speed?: number;
  sx?: any;
}> = ({ children, speed = 0.5, sx }) => {
  const bgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!bgRef.current) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      if (bgRef.current) {
        gsap.to(bgRef.current, {
          y: scrolled * speed,
          duration: 0.3,
          ease: "none"
        });
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return (
    <Box ref={bgRef} sx={sx}>
      {children}
    </Box>
  );
};

// 連鎖的なアニメーション効果
export const StaggerContainer: React.FC<{
  children: React.ReactNode;
  stagger?: number;
  delay?: number;
}> = ({ children, stagger = 0.1, delay = 0 }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const childElements = containerRef.current.children;
    
    gsap.fromTo(childElements,
      { 
        opacity: 0,
        y: 50,
        scale: 0.8
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.8,
        stagger: stagger,
        delay: delay,
        ease: "back.out(1.7)"
      }
    );
  }, [stagger, delay]);

  return (
    <Box ref={containerRef}>
      {children}
    </Box>
  );
};

// スムーズなカウントアップエフェクト
export const CountUpNumber: React.FC<{
  end: number;
  start?: number;
  duration?: number;
  suffix?: string;
  sx?: any;
}> = ({ end, start = 0, duration = 2, suffix = '', sx }) => {
  const [count, setCount] = useState(start);
  const numberRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const counter = { value: start };
    
    gsap.to(counter, {
      value: end,
      duration: duration,
      ease: "power2.out",
      onUpdate: () => {
        setCount(Math.round(counter.value));
      }
    });
  }, [end, start, duration]);

  return (
    <Box ref={numberRef} sx={sx}>
      {count.toLocaleString()}{suffix}
    </Box>
  );
};

// 滑らかなライン描画エフェクト
export const DrawingLine: React.FC<{
  width?: string | number;
  height?: number;
  color?: string;
  duration?: number;
  delay?: number;
}> = ({ width = '100%', height = 2, color = '#000', duration = 1.5, delay = 0 }) => {
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!lineRef.current) return;

    gsap.fromTo(lineRef.current,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: duration,
        delay: delay,
        ease: "power2.inOut",
        transformOrigin: "left center"
      }
    );
  }, [duration, delay]);

  return (
    <Box
      ref={lineRef}
      sx={{
        width: width,
        height: height,
        backgroundColor: color,
        transformOrigin: 'left center'
      }}
    />
  );
};

// 高度なホバーエフェクトカード
export const AdvancedHoverCard: React.FC<{
  children: React.ReactNode;
  hoverContent?: React.ReactNode;
  sx?: any;
}> = ({ children, hoverContent, sx }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!cardRef.current || !overlayRef.current) return;

    const card = cardRef.current;
    const overlay = overlayRef.current;

    const handleMouseEnter = () => {
      gsap.to(card, {
        scale: 1.03,
        y: -8,
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(overlay, {
        opacity: 1,
        y: 0,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: "power2.out"
      });

      gsap.to(overlay, {
        opacity: 0,
        y: 20,
        duration: 0.3,
        ease: "power2.out"
      });
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <Box
      ref={cardRef}
      sx={{
        position: 'relative',
        transition: 'all 0.3s ease',
        ...sx
      }}
    >
      {children}
      {hoverContent && (
        <Box
          ref={overlayRef}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            opacity: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'white',
            borderRadius: 'inherit',
            transform: 'translateY(20px)'
          }}
        >
          {hoverContent}
        </Box>
      )}
    </Box>
  );
};