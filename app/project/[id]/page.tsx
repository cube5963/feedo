"use client"
import { useParams, useRouter } from 'next/navigation'
import { useState, useEffect, useCallback } from 'react'
import React, { ChangeEvent, useRef } from "react"
import FormComponent from '@/app/_components/form'
import {
  Box,
  Typography,
  Paper,
  TextField,
  Container,
  Alert,
  Fade,
  Button,
  Tabs,
  Tab,
  Divider,
  FormControl,
  FormLabel,
  Avatar
} from '@mui/material'
import { createClient } from '@/utils/supabase/client'
import VisibilityIcon from '@mui/icons-material/Visibility'
import Header from '@/app/_components/Header'
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer'
import BarChartIcon from '@mui/icons-material/BarChart'
import SettingsIcon from '@mui/icons-material/Settings'
import CloudUploadIcon from '@mui/icons-material/CloudUpload'
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera'
import StatisticsTab from '@/app/project/_components/StatisticsTab'
import { getImage, uploadImage } from '../[id]/supabaseFunctions';












export default function ProjectPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = params.id as string
  const [formTitle, setFormTitle] = useState("")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [currentTab, setCurrentTab] = useState(0) // タブの状態を追加
  const [memberImage, setMemberImage] = useState<string | null>(null);








  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
      setCurrentTab(newValue)
  }


  useEffect(() => {
 const fetchImage = async () => {
   const url = await getImage(projectId); // ← async関数をawaitする
   if (url) {
     setMemberImage(url);
   }
 };
 fetchImage();
}, [projectId]);


   const handleDeleteClick = async () => {


       const supabase = createClient();
       const filePath = `${projectId}/icon.jpg`;


       const { error } = await supabase.storage.from("feedo").remove([filePath]);


       if (error) {
           setMessage("削除に失敗しました。");
           console.error("画像削除エラー:", error);
           return;
       }


       // 削除成功したら、画面の画像もクリア
       setMemberImage(null);
       setMessage("画像を削除しました。");
   };


  const handleUploadClick = () => {
   const input = document.createElement("input");
   input.type = "file";
   input.accept = "image/*";


   input.onchange = async () => {
       if (!input.files || input.files.length === 0) return;


       const file = input.files[0];


       const url = await uploadImage(projectId, file); // ← 自作関数を使う！


       if (url) {
       setMemberImage(url);
       setMessage("アップロードに成功しました。");
       } else {
       setMessage("アップロードに失敗しました。");
       }
       console.log("📤 Uploading file:", file);
       console.log("📥 Upload URL:", url);
       console.log("🖼️ Setting image src to:", url);
   };
  


   input.click();
};






  // アンケート回答ページに移動する関数
  const handleAnswer = async () => {
      try {
          const supabase = createClient()
        
          // 最初の質問を取得
          const { data: sections, error } = await supabase
              .from('Section')
              .select('SectionUUID')
              .eq('FormUUID', projectId)
              .eq('Delete', false)
              .order('SectionOrder', { ascending: true })
              .limit(1)




          if (error || !sections || sections.length === 0) {
              setMessage('質問が見つかりません。まず質問を作成してください。')
              return
          }




          // 最初の質問のアンケート回答ページに移動
          router.push(`/answer/${projectId}/${sections[0].SectionUUID}`)
      } catch (error) {
          console.error('アンケート回答エラー:', error)
          setMessage('アンケート回答ページの表示に失敗しました')
      }
  }




  // プレビューページに移動する関数
  const handlePreview = async () => {
      try {
          const supabase = createClient()
        
          // 最初の質問を取得
          const { data: sections, error } = await supabase
              .from('Section')
              .select('SectionUUID')
              .eq('FormUUID', projectId)
              .eq('Delete', false)
              .order('SectionOrder', { ascending: true })
              .limit(1)




          if (error || !sections || sections.length === 0) {
              setMessage('質問が見つかりません。まず質問を作成してください。')
              return
          }




          // 最初の質問のプレビューページに移動
          router.push(`/preview/${projectId}/${sections[0].SectionUUID}`)
      } catch (error) {
          console.error('プレビューエラー:', error)
          setMessage('プレビューの表示に失敗しました')
      }
  }




  // フォーム名を取得する関数
  const fetchFormName = async () => {
      try {
          const supabase = createClient()
          const { data, error } = await supabase
              .from('Form')
              .select('FormName')
              .eq('FormUUID', projectId)
              .eq('Delete', false)
              .single()




          if (error || !data) {
              console.error('フォーム名取得エラー:', error)
              router.push('/project')
              return
          }




          setFormTitle(data.FormName || '')
      } catch (error) {
          console.error('フォーム名取得エラー:', error)
          router.push('/project')
      }
  }    // フォーム名を更新する関数
  const updateFormName = async (newFormName: string) => {
      if (!newFormName.trim()) return




      setLoading(true)
      try {
          const supabase = createClient()
          const { error } = await supabase
              .from('Form')
              .update({ FormName: newFormName, UpdatedAt: new Date().toISOString() })
              .eq('FormUUID', projectId)
              .eq('Delete', false)




          if (error) {
              console.error('フォーム名更新エラー:', error)
              setMessage('フォーム名の更新に失敗しました')
              return
          }




          setMessage('フォーム名を更新しました')
          setTimeout(() => setMessage(''), 3000) // 3秒後にメッセージを消す
      } catch (error) {
          console.error('フォーム名更新エラー:', error)
          setMessage('フォーム名の更新に失敗しました')
      } finally {
          setLoading(false)
      }
  }












  // コンポーネントマウント時にフォーム名を取得
  useEffect(() => {
      if (projectId) {
          fetchFormName()
      }
  }, [projectId])




  // 統計タブのコンテンツ
  const renderStatisticsTab = () => (
      <StatisticsTab projectId={projectId} />
  )




  // 設定タブのレンダリング
  const renderSettingsTab = () => (
      <Box>
          <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              プロジェクト設定
          </Typography>
        
        
        
          {/* プロジェクト設定 */}
          <Paper
              elevation={2}
              sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
              }}
          >
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                  基本設定
              </Typography>
            
              <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-end', mb: 3 }}>
                  <TextField
                      label="プロジェクト名"
                      variant="outlined"
                      fullWidth
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                      onBlur={() => updateFormName(formTitle)}
                      inputProps={{ maxLength: 50 }}
                      onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                              updateFormName(formTitle)
                          }
                      }}
                      disabled={loading}
                      placeholder="わかりやすいプロジェクト名を入力してください"
                  />
                  <Button
                      variant="outlined"
                      startIcon={<VisibilityIcon />}
                      onClick={handlePreview}
                      sx={{
                          minWidth: 120,
                          height: 56  // TextFieldと同じ高さ
                      }}
                  >
                      プレビュー
                  </Button>
                  <Button
                      variant="contained"
                      startIcon={<QuestionAnswerIcon />}
                      onClick={async () => {
                          try {
                              const supabase = createClient()
                            
                              // 最初の質問を取得
                              const { data: sections, error } = await supabase
                                  .from('Section')
                                  .select('SectionUUID')
                                  .eq('FormUUID', projectId)
                                  .eq('Delete', false)
                                  .order('SectionOrder', { ascending: true })
                                  .limit(1)




                              if (error || !sections || sections.length === 0) {
                                  setMessage('質問が見つかりません。まず質問を作成してください。')
                                  return
                              }




                              // 最初の質問のアンケート回答ページを新しいタブで開く
                              const answerUrl = `/answer/${projectId}/${sections[0].SectionUUID}`;
                              window.open(answerUrl, '_blank');
                          } catch (error) {
                              console.error('アンケート回答エラー:', error)
                              setMessage('アンケート回答ページの表示に失敗しました')
                          }
                      }}
                      sx={{
                          minWidth: 140,
                          height: 56  // TextFieldと同じ高さ
                      }}
                  >
                      アンケート回答
                  </Button>
              </Box>
            
              <Divider sx={{ my: 3 }} />
            
              {/* 追加設定オプション */}
              <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
                  その他の設定
              </Typography>
            
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <FormControl component="fieldset">
                      <FormLabel component="legend">回答の公開設定</FormLabel>
                      <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                              回答結果の表示設定を選択してください
                          </Typography>
                      </Box>
                  </FormControl>
                
                  <FormControl component="fieldset">
                      <FormLabel component="legend">アクセス制限</FormLabel>
                      <Box sx={{ mt: 1 }}>
                          <Typography variant="body2" color="text.secondary">
                              プロジェクトへのアクセス権限を設定できます
                          </Typography>
                      </Box>
                  </FormControl>
              </Box>
          </Paper>
          {/* プロジェクト画像設定（デザインのみ） */}
          <Paper
              elevation={2}
              sx={{
                  p: 4,
                  mb: 4,
                  borderRadius: 2,
                  border: '1px solid #e0e0e0'
              }}
          >
              <Typography variant="subtitle1" sx={{ mb: 3, fontWeight: 600 }}>
                  プロジェクト画像
              </Typography>
            
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mb: 3 }}>
                  <Avatar
                   src={memberImage || undefined}
                   sx={{
                       width: 80,
                       height: 80,
                       bgcolor: memberImage ? 'transparent' : 'primary.main',
                       borderRadius: memberImage ? 2 : '50%',
                   }}
                   >
                   {!memberImage && <PhotoCameraIcon sx={{ fontSize: 40 }} />}
                   </Avatar>


                                  
                  <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          プロジェクトのイメージ画像をアップロードできます。
                          <br />
                          対応形式: JPEG、PNG、WebP（最大5MB）
                      </Typography>
                    




                      <Box sx={{ display: 'flex', gap: 1 }}>
                      <input
                              type="file"
                              style={{ display: 'none' }}
                              id="file-upload-input"
                      />
                          <Button
                              variant="outlined"
                              startIcon={<CloudUploadIcon />}
                              size="small"
                              sx={{ opacity: 0.6 }}
                              onClick={handleUploadClick}
                              >
                              画像を選択（準備中）
                          </Button>
                        
                        
                          <Button
                              variant="text"
                              color="error"
                              size="small"
                              sx={{ opacity: 0.6 }}
                              onClick={handleDeleteClick}
                          >
                              削除
                          </Button>
                      </Box>
                  </Box>
              </Box>
          </Paper>
      </Box>
  )




  return (
      <Box sx={{
          minHeight: '100vh',
          backgroundColor: '#ffffff'
      }}>
          {/* ヘッダー */}
          <Header
              title="プロジェクト編集"
              onBack={() => router.push('/project')}
          />




          {/* メインコンテンツ */}
          <Box sx={{
              pt: 10, // ヘッダーの高さ分のマージン
              pb: 4,
              maxWidth: 800,
              mx: 'auto',
              px: 3,
              width: '100%'
          }}>
              {/* タブバー */}
              <Paper sx={{ mb: 3, borderRadius: 2 }}>
                  <Tabs
                      value={currentTab}
                      onChange={handleTabChange}
                      variant="fullWidth"
                      sx={{
                          '& .MuiTab-root': {
                              minHeight: 64,
                              fontSize: '1rem',
                              fontWeight: 600,
                              textTransform: 'none'
                          }
                      }}
                  >
                      <Tab
                          icon={<QuestionAnswerIcon />}
                          label="質問"
                          iconPosition="start"
                      />
                      <Tab
                          icon={<BarChartIcon />}
                          label="統計"
                          iconPosition="start"
                      />
                      <Tab
                          icon={<SettingsIcon />}
                          label="設定"
                          iconPosition="start"
                      />
                  </Tabs>
              </Paper>




              {/* メッセージ表示 */}
              {message && (
                  <Alert
                      severity={message.includes('失敗') ? 'error' : 'success'}
                      sx={{
                          mb: 3,
                          borderRadius: 2
                      }}
                  >
                      {message}
                  </Alert>
              )}




              {/* タブコンテンツ */}
              {currentTab === 0 && (
                  <Box>
                      <FormComponent formId={projectId} hideFormSelector={true} />
                  </Box>
              )}
              {currentTab === 1 && renderStatisticsTab()}
              {currentTab === 2 && renderSettingsTab()}
          </Box>
      </Box>
  )
}
