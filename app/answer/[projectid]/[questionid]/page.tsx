"use client"

import React, {useState, useEffect} from 'react';
import {useParams, useRouter} from 'next/navigation';
import {Box, Typography, Alert, CircularProgress} from '@mui/material';
import {createAnonClient} from '@/utils/supabase/anonClient';
import {Section} from '@/app/_components/forms/types';
import QuestionComponent from '@/app/preview/_components/QuestionComponent';
import ProgressBar from '@/app/preview/_components/ProgressBar';
import AnswerNavigationButtons from '@/app/answer/_components/AnswerNavigationButtons';
import Header from '@/app/_components/Header';
import FingerprintJS from '@fingerprintjs/fingerprintjs';

interface FormData {
    FormUUID: string;
    FormName: string;
}

/*
interface AnswerData {
    AnswerUUID?: string;
    FormUUID: string;
    SectionUUID: string;
    Answer: string;
    CreatedAt?: string;
    UpdatedAt?: string;
}
*/

export default function AnswerQuestionPage() {
    const params = useParams();
    const router = useRouter();
    const projectId = params.projectid as string;
    const questionId = params.questionid as string;

    const [formData, setFormData] = useState<FormData | null>(null);
    const [sections, setSections] = useState<Section[]>([]);
    const [currentSection, setCurrentSection] = useState<Section | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [answers, setAnswers] = useState<Record<string, any>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [answerUUID, setAnswerUUID] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, [projectId, questionId]);

    useEffect(() => {
        const searchParams = new URLSearchParams(window.location.search);
        const urlAnswerUUID = searchParams.get('answerUUID');

        if (urlAnswerUUID) {
            setAnswerUUID(urlAnswerUUID);
        } else if (currentIndex === 0 && !answerUUID) {
            const uuid = crypto.randomUUID();
            setAnswerUUID(uuid);
        }
    }, [currentIndex]);

    const getCookie = async (name: string) => {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; ${name}=`);
        if (parts.length === 2) {
            const cookieValue = parts.pop();
            if (cookieValue) {
                return cookieValue.split(';').shift();
            }
        }
        return null;
    }

    const fetchData = async () => {
        try {
            setLoading(true);
            const supabase = createAnonClient() // 回答専用クライアント使用

            // フォーム情報を取得
            const {data: formData, error: formError} = await supabase
                .from('Form')
                .select('FormUUID, FormName, singleResponse')
                .eq('FormUUID', projectId)
                .eq('Delete', false)
                .single();

            if (formData && formData.singleResponse === true) {
                const fpPromise = FingerprintJS.load();
                await (async () => {
                    const fp = await fpPromise;
                    const result = await fp.get();
                    const visitorId = result.visitorId;

                    const res = await fetch(`/api/fingerprint?form_id=${projectId}&fingerprint=${visitorId}`);
                    const data = await res.json();
                    if (data.error) throw data.error;

                    if (data.result === true) {
                        const answerUserFromCookie = await getCookie('answer_user');
                        const answerUserFromLocalStorage = localStorage.getItem('answer_user');

                        if (!!(answerUserFromCookie || answerUserFromLocalStorage)) {
                            setError('すでに回答済みです')
                        }
                    }
                })();
            }

            if (formError) {
                setError('フォームが見つかりません');
                return;
            }

            setFormData(formData);

            let sectionsData: Section[] | null = null;

            sectionsData = await fetchSections(projectId);
            
            setSections(sectionsData || []);

            // 現在の質問を特定
            const currentSectionData = sectionsData?.find((s: Section) => s.SectionUUID === questionId);
            if (!currentSectionData) {
                setError('指定された質問が見つかりません');
                return;
            }

            setCurrentSection(currentSectionData);

            // 現在の質問のインデックスを取得
            const index = sectionsData?.findIndex((s: Section) => s.SectionUUID === questionId) ?? 0;
            setCurrentIndex(index);

        } catch (error) {
            console.error('データ取得エラー:', error);
            setError('データの取得に失敗しました');
        } finally {
            setLoading(false);
        }
    };
    const handleAnswer = (answer: any) => {
        if (currentSection) {
            setAnswers(prev => ({
                ...prev,
                [currentSection.SectionUUID!]: answer
            }));
        }
    };

    const fetchSections = async (form_id: string) => {
        const res = await fetch(`/api/sections?form_id=${form_id}`);
        const result = await res.json();
        if (result.error) throw result.error;
        return result.data;
    }

    // 常に新規回答をinsertする
    const saveAnswer = async (sectionUUID: string, answerData: any) => {
        try {
            const res = await fetch('/api/answer', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    form_id: projectId,
                    section_id: sectionUUID,
                    answer_id: answerUUID,
                    answer_data: JSON.stringify({text: answerData, predict: ""})
                })
            });
            const result = await res.json();
            const data = result.data;
            const error = result.error;

            //console.log(data);
            if (error) {
                console.error('回答保存エラー:', JSON.stringify(error));
            } else {
                const section = sections.find(s => s.SectionUUID === sectionUUID);
                const answerSectionUUID = data[0].AnswerSectionUUID;
                if (section && section.SectionType === "text") {
                    await fetch(process.env.NEXT_PUBLIC_AI_API_URL as string + "emotions", {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            type: 'predict',
                            payload: {
                                answer_id: answerSectionUUID
                            }
                        })
                    });
                }
            }
        } catch (error) {
            console.error('回答保存処理エラー:', JSON.stringify(error));
        }
    };
    // 1設問ごとにリアルタイム集計を取得する関数例
    /*
    const fetchStatisticsForSection = async (sectionUUID: string) => {
        try {
            const supabase = createClient();
            const {data: responses, error} = await supabase
                .from('Answer')
                .select('*')
                .eq('FormUUID', projectId)
                .eq('SectionUUID', sectionUUID);
            if (error) {
                console.error('集計取得エラー:', error);
                return null;
            }
            // 必要に応じて集計処理をここに追加
            return responses;
        } catch (error) {
            console.error('集計取得処理エラー:', error);
            return null;
        }
    };
    */

    const handlePrevious = async () => {
        // 現在の回答を保存してから移動
        if (currentSection && answers[currentSection.SectionUUID!] !== undefined) {
            setIsSubmitting(true);
            await saveAnswer(currentSection.SectionUUID!, answers[currentSection.SectionUUID!]);
            setIsSubmitting(false);
        }

        if (currentIndex > 0) {
            const prevSection = sections[currentIndex - 1];
            router.push(`/answer/${projectId}/${prevSection.SectionUUID}?answerUUID=${answerUUID}`);
        }
    };

    const handleNext = async () => {
        // 現在の回答を保存してから移動
        if (currentSection && answers[currentSection.SectionUUID!] !== undefined) {
            setIsSubmitting(true);
            await saveAnswer(currentSection.SectionUUID!, answers[currentSection.SectionUUID!]);
            setIsSubmitting(false);
        }

        if (currentIndex < sections.length - 1) {
            const nextSection = sections[currentIndex + 1];
            router.push(`/answer/${projectId}/${nextSection.SectionUUID}?answerUUID=${answerUUID}`);
        }
    };

    const handleComplete = async () => {
        setIsSubmitting(true);

        // 最後の回答を保存
        if (currentSection && answers[currentSection.SectionUUID!] !== undefined) {
            await saveAnswer(currentSection.SectionUUID!, answers[currentSection.SectionUUID!]);
        }

        // 全ての回答を保存
        /*
        for (const [sectionUUID, answerData] of Object.entries(answers)) {
            await saveAnswer(sectionUUID, answerData);
        }
        */

        setIsSubmitting(false);
        
        router.push(`/answer/${projectId}/complete`);
    };

    const handleBack = () => {
        router.push(`/project/${projectId}`);
    };

    const isAnswered = currentSection ?
        answers[currentSection.SectionUUID!] !== undefined : false;

    if (loading) {
        return (
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                maxWidth: 480,
                mx: 'auto',
                backgroundColor: '#f8f9fa'
            }}>
                <CircularProgress/>
            </Box>
        );
    }

    if (error) {
        return (
            <Box sx={{
                maxWidth: 480,
                mx: 'auto',
                p: 2,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Alert severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Box>
        );
    }

    if (!currentSection || !formData) {
        return (
            <Box sx={{
                maxWidth: 480,
                mx: 'auto',
                p: 2,
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center'
            }}>
                <Alert severity="warning" sx={{width: '100%'}}>
                    質問データが見つかりません
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{
            minHeight: '100vh',
            backgroundColor: '#f8f9fa',
            display: 'flex',
            flexDirection: 'column',
            maxWidth: 480,  // スマホサイズに制限
            mx: 'auto',     // 中央配置
            position: 'relative'
        }}>
            {/* ヘッダー */}
            <Header
                title="アンケート回答"
                onBack={handleBack}
                maxWidth={480}
                showBackButton={false}
            />

            {/* プログレスバー */}
            <Box sx={{mt: 8}}> {/* ヘッダーの高さ分のマージン */}
                <ProgressBar
                    current={currentIndex + 1}
                    total={sections.length}
                />
            </Box>

            {/* メインコンテンツ */}
            <Box sx={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                pt: 8, // プログレスバーの分
                pb: 14, // ナビゲーションボタンの分（浮いている分を考慮）
                px: 3,
                minHeight: 'calc(100vh - 200px)' // ヘッダー、プログレスバー、フッターを除いた高さ
            }}>
                {/* フォームタイトル */}
                <Typography
                    variant="h5"
                    align="center"
                    sx={{
                        mb: 4,
                        fontWeight: 600,
                        px: 2,
                        fontSize: '1.4rem',
                        color: '#333',
                        lineHeight: 1.3
                    }}
                >
                    {formData.FormName}
                </Typography>

                {/* 質問番号表示 */}
                <Typography
                    variant="body1"
                    align="center"
                    sx={{
                        mb: 3,
                        color: '#666',
                        fontSize: '1rem'
                    }}
                >
                    質問 {currentIndex + 1} / {sections.length}
                </Typography>

                {/* 質問コンポーネント */}
                <Box sx={{px: 1}}>
                    <QuestionComponent
                        section={currentSection}
                        onAnswer={handleAnswer}
                        isAnswered={isAnswered}
                    />
                </Box>
            </Box>

            {/* ナビゲーションボタン */}
            <AnswerNavigationButtons
                onPrevious={handlePrevious}
                onNext={handleNext}
                onComplete={handleComplete}
                isFirstQuestion={currentIndex === 0}
                isLastQuestion={currentIndex === sections.length - 1}
                isAnswered={isAnswered}
                isSubmitting={isSubmitting}
            />
        </Box>
    );
}
