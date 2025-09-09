"use client"

import React from 'react';
import { useRouter } from 'next/navigation';
import { Box, IconButton, Typography, AppBar, Toolbar } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

interface HeaderProps {
  title?: string;
  onBack?: () => void;
  showBackButton?: boolean;
  maxWidth?: number;
}

export default function Header({
  title,
  onBack,
  showBackButton = true,
  maxWidth = 1200,
}: HeaderProps) {
  const router = useRouter();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.back();
    }
  };

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: 'white',
        borderBottom: '1px solid #e0e0e0',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        zIndex: 1100
      }}
    >
      <Toolbar sx={{
        maxWidth: maxWidth,
        width: '100%',
        mx: 'auto',
        justifyContent: 'space-between',
        px: { xs: 2, sm: 3 }
      }}>
        {/* 戻るボタン */}
        {showBackButton && (
          <IconButton
            onClick={handleBack}
            sx={{
              color: '#333',
              '&:hover': {
                backgroundColor: 'rgba(0,0,0,0.05)'
              }
            }}
          >
            <ArrowBackIcon />
          </IconButton>
        )}

        {/* タイトル */}
        <Typography
          variant="h6"
          sx={{
            flex: 1,
            textAlign: showBackButton ? 'center' : 'left',
            ml: showBackButton ? -6 : 0, // 戻るボタンがある場合は中央配置のため調整
            color: '#333',
            fontWeight: 600,
            fontSize: '1.1rem'
          }}
        >
          {title}
        </Typography>

        {/* 右側のスペース（左右のバランスを取るため） */}
        {showBackButton && (
          <Box sx={{ width: 48 }} />
        )}
      </Toolbar>
    </AppBar>
  );
}
