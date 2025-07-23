'use client'; // クライアントコンポーネント指定

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  ButtonBase,
  IconButton,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRouter } from 'next/navigation'; // App Router 用
import { createClient } from '@/utils/supabase/client'

// Supabaseフォーム型
interface FormData {
  FormID: number;
  FormName: string;
  ImgID: string;
  CreatedAt: string;
  UpdatedAt: string;
  Delete: boolean;
}

import { useState } from 'react';
import { useEffect } from 'react';
import { Modal, Button as AntdButton, Checkbox } from 'antd';

export default function Project() {
  const router = useRouter();
  const [createOpen, setCreateOpen] = useState(false);
  const [useAi, setUseAi] = useState(false);
  const [loading, setLoading] = useState(false);
  const [forms, setForms] = useState<FormData[]>([]);
  const [loadingForms, setLoadingForms] = useState(true);

  // Supabaseからフォーム一覧を取得
  useEffect(() => {
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
        router.push(`/project/${newForm.FormID}`);
      }
    } catch (error: any) {
      console.error('フォーム作成エラー詳細:', error);
      alert(`フォームの作成に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  // フォーム削除関数
  const handleDeleteForm = async (formId: number, formName: string, event: React.MouseEvent) => {
    // クリックイベントの伝播を停止（親のButtonBaseがクリックされないように）
    event.stopPropagation();
    
    if (!confirm(`「${formName}」を削除しますか？\nこのフォーム内のすべてのセクションも同時に削除されます。\nこの操作は取り消せません。`)) {
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();
      
      // まず関連するSectionを削除
      const { error: sectionError } = await supabase
        .from('Section')
        .delete()
        .eq('FormID', formId);

      if (sectionError) {
        console.error('セクション削除エラー:', sectionError);
        alert(`セクションの削除に失敗しました: ${sectionError.message}`);
        return;
      }

      // 次にFormを削除
      const { error: formError } = await supabase
        .from('Form')
        .delete()
        .eq('FormID', formId);

      if (formError) {
        console.error('フォーム削除エラー:', formError);
        alert(`フォームの削除に失敗しました: ${formError.message}`);
        return;
      }

      // ローカルのフォームリストから削除
      setForms(prev => prev.filter(form => form.FormID !== formId));
      console.log(`フォーム ${formName} (ID: ${formId}) と関連セクションを削除しました`);
      
    } catch (error: any) {
      console.error('フォーム削除エラー詳細:', error);
      alert(`フォームの削除に失敗しました: ${error?.message || 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>

      <Box sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
        {/* 新規作成 */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <Button 
            variant="outlined" 
            sx={{ width: 100, height: 100 }} 
            onClick={handleCreateNewForm}
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
                key={`form-${form.FormID}`}
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
                  onClick={() => handleClick(form.FormID.toString())}
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
                      Form ID: {form.FormID}
                    </Typography>
                  </CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', pr: 1 }}>
                    <IconButton 
                      color="error"
                      onClick={(e) => handleDeleteForm(form.FormID, form.FormName, e)}
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

      <Modal
        title="新規作成"
        open={createOpen}
        onCancel={() => setCreateOpen(false)}
        footer={(_, { }) => (
          <>
            <AntdButton type="primary" onClick={useai}>使用します</AntdButton>
            <AntdButton onClick={() => setCreateOpen(false)}>使用しません</AntdButton>
          </>
        )}
      >
        <p>AIを使用しますか？</p>
      </Modal>
      <Modal
        title="初期設定"
        open={useAi}
        onCancel={() => setUseAi(false)}
        footer={(_, { }) => (
          <>
            <AntdButton onClick={handleBack}>戻る</AntdButton>
            <AntdButton type="primary" onClick={() => setUseAi(false)}>次へ</AntdButton>
          </>
        )}
      >
        <p>AIにしてもらうサポートを選択してください。</p>
        <div>
          <Checkbox>アンケートのテンプレート作成</Checkbox>
          <br />
          <Checkbox>アンケートの要約とアドバイス</Checkbox>
          <br />
          <Checkbox>アンケートの質問文の自動改善</Checkbox>
        </div>
      </Modal>
    </>
  );
}
