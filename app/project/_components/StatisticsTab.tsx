"use client"

import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Card, 
  CardContent,
  CircularProgress,
  Alert,
  Divider,
  Chip,
  IconButton
} from '@mui/material';
import { PieChart } from '@mui/x-charts/PieChart';
import { BarChart } from '@mui/x-charts/BarChart';
import StarIcon from '@mui/icons-material/Star';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { createClient } from '@/utils/supabase/client';
import { Section } from '@/app/_components/forms/types';
import BarChartIcon from '@mui/icons-material/BarChart';
import PeopleIcon from '@mui/icons-material/People';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';

interface StatisticsData {
  totalResponses: number;
  totalQuestions: number;
  responseRate: number;
  questionStats: QuestionStatistics[];
}

interface QuestionStatistics {
  section: Section;
  responseCount: number;
  responses: any[];
  statistics: any;
}

interface StatisticsTabProps {
  projectId: string;
}

export default function StatisticsTab({ projectId }: StatisticsTabProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [statistics, setStatistics] = useState<StatisticsData | null>(null);
  const [starViewModes, setStarViewModes] = useState<Record<string, 'average' | 'chart'>>({});

  useEffect(() => {
    fetchStatistics();
  }, [projectId]);

  const fetchStatistics = async () => {
    try {
      setLoading(true);
      const supabase = createClient();

      // セクション一覧を取得
      const { data: sections, error: sectionsError } = await supabase
        .from('Section')
        .select('*')
        .eq('FormUUID', projectId)
        .eq('Delete', false)
        .order('SectionOrder', { ascending: true });

      if (sectionsError) {
        setError('質問データの取得に失敗しました');
        return;
      }

      if (!sections || sections.length === 0) {
        setStatistics({
          totalResponses: 0,
          totalQuestions: 0,
          responseRate: 0,
          questionStats: []
        });
        return;
      }

      // 各質問の回答データを取得
      const questionStats: QuestionStatistics[] = [];
      let totalUniqueResponders = new Set<string>();

      for (const section of sections) {
        const { data: responses, error: responsesError } = await supabase
          .from('Answer')
          .select('*')
          .eq('FormUUID', projectId)
          .eq('SectionUUID', section.SectionUUID);

        if (responsesError) {
          console.error('回答データ取得エラー:', responsesError);
          continue;
        }

        const responseData = responses || [];
        
        // 回答者のユニークIDを追加
        responseData.forEach(response => {
          totalUniqueResponders.add(response.AnswerUUID || 'anonymous');
        });

        // 質問タイプに応じた統計を計算
        const statistics = calculateQuestionStatistics(section, responseData);

        questionStats.push({
          section,
          responseCount: responseData.length,
          responses: responseData,
          statistics
        });
      }

      const statisticsData: StatisticsData = {
        totalResponses: totalUniqueResponders.size,
        totalQuestions: sections.length,
        responseRate: sections.length > 0 ? (questionStats.reduce((sum, q) => sum + q.responseCount, 0) / sections.length) : 0,
        questionStats
      };

      setStatistics(statisticsData);

    } catch (error) {
      console.error('統計データ取得エラー:', error);
      setError('統計データの取得に失敗しました');
    } finally {
      setLoading(false);
    }
  };

  const calculateQuestionStatistics = (section: Section, responses: any[]) => {
    if (responses.length === 0) return null;

    try {
      // 安全なJSON解析関数
      const parseJsonSafely = (jsonString: string, defaultValue: any = {}) => {
        try {
          if (!jsonString || jsonString.trim() === '' || jsonString.trim() === '{}') {
            return defaultValue;
          }
          return JSON.parse(jsonString);
        } catch (error) {
          console.warn('JSON解析エラー:', error, 'データ:', jsonString);
          return defaultValue;
        }
      };

      const sectionDesc = parseJsonSafely(section.SectionDesc, {});
      const answers = responses.map(r => {
        try {
          return JSON.parse(r.Answer);
        } catch {
          return r.Answer;
        }
      });

      switch (section.SectionType) {
        case 'radio':
        case 'checkbox':
          return calculateChoiceStatistics(answers, sectionDesc.options || ['選択肢1', '選択肢2']);
        case 'star':
          return calculateStarStatistics(answers, sectionDesc.maxStars || 5);
        case 'slider':
          return calculateSliderStatistics(answers, sectionDesc);
        case 'text':
          return calculateTextStatistics(answers);
        case 'two_choice':
          return calculateTwoChoiceStatistics(answers);
        default:
          return null;
      }
    } catch (error) {
      console.error('統計計算エラー:', error);
      return null;
    }
  };

  const calculateChoiceStatistics = (answers: any[], options: string[]) => {
    const counts: Record<string, number> = {};
    options.forEach(option => counts[option] = 0);

    answers.forEach(answer => {
      if (Array.isArray(answer)) {
        // checkbox の場合
        answer.forEach(choice => {
          if (counts.hasOwnProperty(choice)) {
            counts[choice]++;
          }
        });
      } else {
        // radio の場合
        if (counts.hasOwnProperty(answer)) {
          counts[answer]++;
        }
      }
    });

    return {
      type: 'choice',
      counts,
      total: answers.length,
      options
    };
  };

  const calculateStarStatistics = (answers: number[], maxStars: number) => {
    const counts: Record<number, number> = {};
    for (let i = 1; i <= maxStars; i++) {
      counts[i] = 0;
    }

    answers.forEach(answer => {
      if (typeof answer === 'number' && answer >= 1 && answer <= maxStars) {
        counts[answer]++;
      }
    });

    const average = answers.length > 0 ? 
      answers.reduce((sum, answer) => sum + (typeof answer === 'number' ? answer : 0), 0) / answers.length : 0;

    return {
      type: 'star',
      counts,
      average: Math.round(average * 100) / 100,
      total: answers.length,
      maxStars
    };
  };

  const calculateSliderStatistics = (answers: number[], settings: any) => {
    const validAnswers = answers.filter(answer => typeof answer === 'number');
    const average = validAnswers.length > 0 ? 
      validAnswers.reduce((sum, answer) => sum + answer, 0) / validAnswers.length : 0;
    const min = validAnswers.length > 0 ? Math.min(...validAnswers) : 0;
    const max = validAnswers.length > 0 ? Math.max(...validAnswers) : 0;

    // デフォルトのスライダー設定
    const defaultSettings = {
      min: 0,
      max: 10,
      divisions: 5,
      labels: { min: '最小', max: '最大' }
    };

    return {
      type: 'slider',
      average: Math.round(average * 100) / 100,
      min,
      max,
      total: validAnswers.length,
      settings: settings || defaultSettings
    };
  };

  const calculateTextStatistics = (answers: string[]) => {
    const validAnswers = answers.filter(answer => typeof answer === 'string' && answer.trim() !== '');
    return {
      type: 'text',
      total: validAnswers.length,
      responses: validAnswers
    };
  };

  const calculateTwoChoiceStatistics = (answers: any[]) => {
    const counts = { true: 0, false: 0 };
    answers.forEach(answer => {
      if (answer === true || answer === 'はい') counts.true++;
      else if (answer === false || answer === 'いいえ') counts.false++;
    });

    return {
      type: 'two_choice',
      counts,
      total: answers.length
    };
  };

  const renderQuestionStatistics = (questionStat: QuestionStatistics) => {
    const { section, responseCount, statistics } = questionStat;
    const sectionId = section.SectionUUID || '';
    const currentStarViewMode = starViewModes[sectionId] || 'average';
    
    const toggleStarViewMode = () => {
      setStarViewModes(prev => ({
        ...prev,
        [sectionId]: prev[sectionId] === 'average' ? 'chart' : 'average'
      }));
    };

    if (!statistics) {
      return (
        <Card key={section.SectionUUID} sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              {section.SectionName}
            </Typography>
            <Typography color="text.secondary">
              回答数: {responseCount}件
            </Typography>
            <Typography color="text.secondary" sx={{ mt: 1 }}>
              統計データを処理できませんでした
            </Typography>
          </CardContent>
        </Card>
      );
    }

    // PieChart用のデータを準備
    const preparePieData = () => {
      if (statistics.type === 'choice') {
        return statistics.options.map((option: string, index: number) => ({
          id: index,
          value: statistics.counts[option] || 0,
          label: option,
        }));
      } else if (statistics.type === 'star') {
        return Object.entries(statistics.counts).map(([star, count], index) => ({
          id: index,
          value: Number(count),
          label: `★${star}`,
        }));
      } else if (statistics.type === 'two_choice') {
        return [
          { id: 0, value: statistics.counts.true, label: 'はい' },
          { id: 1, value: statistics.counts.false, label: 'いいえ' },
        ];
      }
      return [];
    };

    // BarChart用のデータを準備（スター用）
    const prepareBarData = () => {
      if (statistics.type === 'star') {
        const data = [];
        const labels = [];
        for (let i = 1; i <= statistics.maxStars; i++) {
          data.push(statistics.counts[i] || 0);
          labels.push(`★${i}`);
        }
        return { data, labels };
      }
      return { data: [], labels: [] };
    };

    // スター評価の星表示を生成
    const renderStarRating = (average: number, maxStars: number) => {
      const stars = [];
      for (let i = 1; i <= maxStars; i++) {
        if (i <= Math.floor(average)) {
          stars.push(<StarIcon key={i} sx={{ color: '#ffc107', fontSize: 32 }} />);
        } else if (i === Math.ceil(average) && average % 1 !== 0) {
          // 半星の表現（簡易版）
          stars.push(<StarIcon key={i} sx={{ color: '#ffc107', fontSize: 32, opacity: 0.5 }} />);
        } else {
          stars.push(<StarBorderIcon key={i} sx={{ color: '#ffc107', fontSize: 32 }} />);
        }
      }
      return stars;
    };

    const pieData = preparePieData();
    const barData = prepareBarData();

    return (
      <Card key={section.SectionUUID} sx={{ mb: 3 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', mb: 2 }}>
            <Typography variant="h6" sx={{ flex: 1 }}>
              {section.SectionName}
            </Typography>
            <Chip 
              label={`${responseCount}件の回答`} 
              size="small" 
              color="primary" 
              variant="outlined"
            />
          </Box>

          {/* カードの左半分：グラフ、右半分：将来の機能用スペース */}
          <Box sx={{ display: 'flex', gap: 2, minHeight: 250 }}>
            {/* 左半分：グラフエリア */}
            <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              {/* 選択式・二択質問 */}
              {(statistics.type === 'choice' || statistics.type === 'two_choice') && pieData.length > 0 && (
                <PieChart
                  series={[
                    {
                      data: pieData,
                      highlightScope: { fade: 'global', highlight: 'item' },
                      faded: { innerRadius: 30, additionalRadius: -30, color: 'gray' },
                    },
                  ]}
                  height={200}
                />
              )}

              {/* スター評価のカルーセル */}
              {statistics.type === 'star' && (
                <Box sx={{ position: 'relative' }}>
                  {currentStarViewMode === 'average' ? (
                    <Box sx={{ textAlign: 'center', py: 2 }}>
                      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
                        {renderStarRating(statistics.average, statistics.maxStars)}
                      </Box>
                      <Typography variant="h4" color="primary.main" sx={{ mb: 1 }}>
                        {statistics.average}
                      </Typography>
                      <Typography variant="body1" color="text.secondary">
                        / {statistics.maxStars}
                      </Typography>
                    </Box>
                  ) : (
                    <BarChart
                      xAxis={[{ scaleType: 'band', data: barData.labels }]}
                      series={[{ data: barData.data, color: '#ffc107' }]}
                      height={150}
                    />
                  )}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <IconButton 
                      onClick={toggleStarViewMode}
                      sx={{ opacity: 0.7 }}
                    >
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="body2" color="text.secondary">
                      {currentStarViewMode === 'average' ? '平均評価' : '分布'}
                    </Typography>
                    <IconButton 
                      onClick={toggleStarViewMode}
                      sx={{ opacity: 0.7 }}
                    >
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>
                </Box>
              )}

              {/* スライダー */}
              {statistics.type === 'slider' && (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography variant="h3" color="primary.main" sx={{ mb: 1 }}>
                    {statistics.average}
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 1 }}>
                    平均値
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    最小値: {statistics.min} / 最大値: {statistics.max}
                  </Typography>
                </Box>
              )}

              {/* テキスト回答のスクロール表示 */}
              {statistics.type === 'text' && (
                <Box 
                  sx={{ 
                    maxHeight: 200,
                    overflowY: 'auto',
                    py: 2,
                    pr: 1, // スクロールバー用のパディング
                    '&::-webkit-scrollbar': {
                      width: '6px',
                    },
                    '&::-webkit-scrollbar-track': {
                      backgroundColor: '#f1f1f1',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb': {
                      backgroundColor: '#c1c1c1',
                      borderRadius: '3px',
                    },
                    '&::-webkit-scrollbar-thumb:hover': {
                      backgroundColor: '#a8a8a8',
                    },
                  }}
                >
                  {statistics.responses.map((response: string, index: number) => (
                    <Typography 
                      key={index} 
                      variant="body2" 
                      sx={{ 
                        mb: 2, 
                        p: 2, 
                        backgroundColor: '#f5f5f5', 
                        borderRadius: 1,
                        fontStyle: 'italic',
                        fontSize: '0.9rem',
                        lineHeight: 1.4,
                        wordBreak: 'break-word'
                      }}
                    >
                      "{response}"
                    </Typography>
                  ))}
                </Box>
              )}
            </Box>

            {/* 右半分：将来の機能用スペース */}
            <Box sx={{ 
              flex: 1, 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              backgroundColor: '#f8f9fa',
              borderRadius: 1,
              border: '1px dashed #ddd'
            }}>
              <Typography variant="body2" color="text.secondary">
                将来の機能用スペース
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Box sx={{ py: 4, textAlign: 'center' }}>
        <CircularProgress />
        <Typography variant="body2" sx={{ mt: 2 }}>
          統計データを読み込んでいます...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (!statistics || statistics.totalQuestions === 0) {
    return (
      <Box sx={{ py: 4 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          アンケート統計
        </Typography>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <BarChartIcon sx={{ fontSize: 60, color: '#ccc', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            まだ質問がありません
          </Typography>
          <Typography variant="body2" color="text.secondary">
            質問を作成してアンケートを開始してください
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        アンケート統計
      </Typography>

      {/* 概要統計 */}
      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 2, mb: 4 }}>
        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <PeopleIcon sx={{ fontSize: 40, color: '#1976d2', mb: 1 }} />
            <Typography variant="h4" color="primary.main">
              {statistics.totalResponses}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              回答者数
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <QuestionAnswerIcon sx={{ fontSize: 40, color: '#ff9800', mb: 1 }} />
            <Typography variant="h4" color="primary.main">
              {statistics.totalQuestions}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              質問数
            </Typography>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ textAlign: 'center' }}>
            <BarChartIcon sx={{ fontSize: 40, color: '#4caf50', mb: 1 }} />
            <Typography variant="h4" color="primary.main">
              {statistics.responseRate.toFixed(1)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              平均回答数/質問
            </Typography>
          </CardContent>
        </Card>
      </Box>

      <Divider sx={{ mb: 4 }} />

      {/* 質問別統計 */}
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        質問別統計
      </Typography>

      {statistics.questionStats.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Typography variant="body1" color="text.secondary">
            まだ回答がありません
          </Typography>
        </Paper>
      ) : (
        statistics.questionStats.map(renderQuestionStatistics)
      )}
    </Box>
  );
}
