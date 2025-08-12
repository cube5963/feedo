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
  Chip
} from '@mui/material';
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

          {statistics.type === 'choice' && (
            <Box>
              {statistics.options.map((option: string, index: number) => {
                const count = statistics.counts[option] || 0;
                const countNum = Number(count);
                const percentage = statistics.total > 0 ? (countNum / statistics.total) * 100 : 0;
                return (
                  <Box key={index} sx={{ mb: 2 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2">{option}</Typography>
                      <Typography variant="body2">{countNum}件 ({percentage.toFixed(1)}%)</Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 8, 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: 4,
                      overflow: 'hidden'
                    }}>
                      <Box sx={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: '#1976d2',
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {statistics.type === 'star' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 2 }}>
                平均評価: <strong>{statistics.average}</strong> / {statistics.maxStars}
              </Typography>
              {Object.entries(statistics.counts).map(([star, count]) => {
                const percentage = statistics.total > 0 ? (Number(count) / statistics.total) * 100 : 0;
                const countNum = Number(count);
                return (
                  <Box key={star} sx={{ mb: 1 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                      <Typography variant="body2">★{star}</Typography>
                      <Typography variant="body2">{countNum}件 ({percentage.toFixed(1)}%)</Typography>
                    </Box>
                    <Box sx={{ 
                      width: '100%', 
                      height: 6, 
                      backgroundColor: '#f0f0f0', 
                      borderRadius: 3 
                    }}>
                      <Box sx={{ 
                        width: `${percentage}%`, 
                        height: '100%', 
                        backgroundColor: '#ff9800',
                        borderRadius: 3,
                        transition: 'width 0.3s ease'
                      }} />
                    </Box>
                  </Box>
                );
              })}
            </Box>
          )}

          {statistics.type === 'slider' && (
            <Box>
              <Typography variant="body1" sx={{ mb: 1 }}>
                平均値: <strong>{statistics.average}</strong>
              </Typography>
              <Typography variant="body2" color="text.secondary">
                最小値: {statistics.min} / 最大値: {statistics.max}
              </Typography>
            </Box>
          )}

          {statistics.type === 'text' && (
            <Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {statistics.total}件のテキスト回答があります
              </Typography>
              {statistics.responses.slice(0, 3).map((response: string, index: number) => (
                <Typography 
                  key={index} 
                  variant="body2" 
                  sx={{ 
                    mb: 1, 
                    p: 1, 
                    backgroundColor: '#f5f5f5', 
                    borderRadius: 1,
                    fontStyle: 'italic'
                  }}
                >
                  "{response}"
                </Typography>
              ))}
              {statistics.responses.length > 3 && (
                <Typography variant="body2" color="text.secondary">
                  ...他 {statistics.responses.length - 3}件
                </Typography>
              )}
            </Box>
          )}

          {statistics.type === 'two_choice' && (
            <Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-around', mt: 2 }}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary.main">
                    {statistics.counts.true}
                  </Typography>
                  <Typography variant="body2">はい</Typography>
                </Box>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="error.main">
                    {statistics.counts.false}
                  </Typography>
                  <Typography variant="body2">いいえ</Typography>
                </Box>
              </Box>
            </Box>
          )}
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
