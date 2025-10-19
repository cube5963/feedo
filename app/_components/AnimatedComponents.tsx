"use client";
import React, {useEffect, useRef, useState} from 'react';
import {Box} from '@mui/material';
import gsap from 'gsap';

// パルスアニメーション要素
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
