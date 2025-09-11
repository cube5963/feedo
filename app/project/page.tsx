'use client'; // クライアントコンポーネント指定

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation'; // App Router 用
import { createClient } from '@/utils/supabase/client'
import Header from '@/app/_components/Header'

// Supabaseフォーム型
interface FormData {
  FormUUID: string;
  FormName: string;
  ImgID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Delete: boolean;
}

import { useState, useEffect } from 'react';

export default function Project() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<FormData[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);

  // Supabaseからフォーム一覧を取得
  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getSession().then(({ data, error }) => {
      console.log('Supabase Session:', data?.session);
      if (error) {
        console.error('セッション取得エラー:', error);
      }
    });

    const fetchForms = async () => {
      try {
        const supabase = createClient();
        const { data, error } = await supabase
          .from('Form')
          .select('*')
          .eq('Delete', false)
          .order('CreatedAt', { ascending: false });

        if (error) {
          console.error('フォーム取得エラー:', error);
        } else {
          setForms(data || []);
        }
      } catch (error) {
        console.error('フォーム取得エラー詳細:', error);
      } finally {
        setLoadingForms(false);
      }
    };

    fetchForms();
  }, []);

  const handleClick = (formId: string) => {
    // Supabaseフォームのページに遷移
    router.push(`/project/${formId}`);
  };

  const create = () => {
    setCreateOpen(true);
  };

  const useai = () => {
    setCreateOpen(false);
    setUseAi(true);
  };

  const handleBack = () => {
    setUseAi(false);
    setCreateOpen(true);
  };

  // 新規フォーム作成関数
  const handleCreateNewForm = async () => {
    setLoading(true);
    
    try {
      const supabase = createClient();
      
      // 新しいフォームを作成
      const { data: newForm, error: createError } = await supabase
        .from('Form')
        .insert([{
          FormName: `新しいフォーム ${new Date().toLocaleString('ja-JP')}`,
          ImgID: '',
          Delete: false
        }])
        .select()
        .single();
      
      if (createError) {
        console.error('フォーム作成エラー:', createError);
        alert(`フォームの作成に失敗しました: ${createError.message}`);
        return;
      }
      
      if (newForm) {
        console.log('新しいフォームが作成されました:', newForm);
        // ローカルのフォームリストに追加
        setForms(prev => [newForm, ...prev]);
        // 新しいフォームのページに遷移
        router.push(`/project/${newForm.FormUUID}`);
      }
    } catch (error: any) {
      console.error('フォーム作成エラー詳細:', error);
      alert(`フォームの作成に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // フォーム削除関数（論理削除）
  const handleDeleteForm = async (formId: string, formName: string, event: React.MouseEvent) => {
    // クリックイベントの伝播を停止（親のButtonBaseがクリックされないように）
    event.stopPropagation();
    
    if (!confirm(`「${formName}」を削除しますか？\nこのフォーム内のすべてのセクションも同時に削除されます。`)) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // まず関連するSectionを論理削除
      const { error: sectionError } = await supabase
        .from('Section')
        .update({ Delete: true, UpdatedAt: new Date().toISOString() })
        .eq('FormUUID', formId)
        .eq('Delete', false);

      if (sectionError) {
        console.error('セクション削除エラー:', sectionError);
        alert(`セクションの削除に失敗しました: ${sectionError.message}`);
        return;
      }

      // 次にFormを論理削除
      const { error: formError } = await supabase
        .from('Form')
        .update({ Delete: true, UpdatedAt: new Date().toISOString() })
        .eq('FormUUID', formId)
        .eq('Delete', false);

      if (formError) {
        console.error('フォーム削除エラー:', formError);
        alert(`フォームの削除に失敗しました: ${formError.message}`);
        return;
      }

      // ローカルのフォームリストから削除
      setForms(prev => prev.filter(form => form.FormUUID !== formId));
      console.log(`フォーム ${formName} (ID: ${formId}) と関連セクションを論理削除しました`);
      
    } catch (error: any) {
      console.error('フォーム削除エラー詳細:', error);
      alert(`フォームの削除に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* ヘッダー */}
      <Header 
        title="プロジェクト一覧"
        showBackButton={false}
      />

      <Box sx={{ maxWidth: 500, margin: 'auto', pt: 10, pb: 4, px: 2 }}>
        {/* 新規作成 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            sx={{ width: 100, height: 100 }} 
            onClick={() => setCreateOpen(true)}
            disabled={loading}
          >
            <Typography variant="h3">{loading ? '...' : '＋'}</Typography>
          </Button>
          <Box sx={{ ml: 2 }}>
            <Typography variant="h6">新規フォーム作成</Typography>
            <Typography variant="body2" color="text.secondary">
              新しいアンケートフォームを作成します
            </Typography>
          </Box>
        </Box>
        
        {/* アンケート一覧 */}
        {loadingForms ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body2" color="text.secondary">
              フォームを読み込み中...
            </Typography>
          </Box>
        ) : (
          <>
            {/* Supabaseから取得したフォーム */}
            {forms.map((form) => (
              <Box
                key={`form-${form.FormUUID}`}
                sx={{ width: '100%', mb: 2 }}
              >
                <Card 
                  sx={{ 
                    display: 'flex', 
                    width: '100%',
                    cursor: 'pointer',
                    '&:hover': {
                      boxShadow: 2,
                      bgcolor: 'action.hover'
                    }
                  }}
                  onClick={() => handleClick(form.FormUUID)}
                >
                  <Avatar
                    variant="square"
                    sx={{ width: 100, height: 100, bgcolor: 'primary.light' }}
                  >
                    📝
                  </Avatar>
                  <CardContent sx={{ flex: 1 }}>
                    <Typography variant="subtitle1">{form.FormName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      作成日 {new Date(form.CreatedAt).toLocaleDateString('ja-JP')}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      最終更新日 {new Date(form.UpdatedAt).toLocaleDateString('ja-JP')}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                    <IconButton 
                      color="error"
                      onClick={(e) => handleDeleteForm(form.FormUUID, form.FormName, e)}
                      disabled={loading}
                      title="このフォームを削除"
                      sx={{ 
                        '&:hover': { bgcolor: 'error.light', color: 'white' }
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                </Card>
              </Box>
            ))}
          </>
        )}
      </Box>
      <Dialog open={createOpen} onClose={() => setCreateOpen(false)}>
        <DialogTitle>新規作成</DialogTitle>
        <DialogContent>
          <Typography sx={{ mt: 1 }}>アンケートの作成にAIを使用しますか？</Typography>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              setCreateOpen(false);
              router.push('/project/ai');
            }}
          >
            はい
          </Button>
          <Button
            variant="outlined"
            onClick={() => {
              setCreateOpen(false);
              handleCreateNewForm();
            }}
          >
            いいえ
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={useAi} onClose={() => setUseAi(false)}>
        <DialogTitle>初期設定</DialogTitle>
        <DialogContent>
          {/* 必要ならここに初期設定内容を追加 */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBack}>戻る</Button>
          <Button variant="contained" onClick={() => setUseAi(false)}>次へ</Button>
        </DialogActions>
      </Dialog>
      
    </Box>
  );
}
