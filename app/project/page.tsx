'use client'; // クライアントコンポーネント指定

import {
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Avatar,
  ButtonBase,
} from '@mui/material';
import { useRouter } from 'next/navigation'; // App Router 用
// アンケートデータ型
type SurveyItem = {
  img: string;
  title: string;
  date: string;
  answers: number;
  id: string;
};
const surveyData: SurveyItem[] = [
  {
    img: 'https://www.tobutoptours.co.jp/clubjtobuto/common/pdf/jrhotel.jpg',
    title: 'ホテルフィードお客様アンケート',
    date: '2025/2/28',
    answers: 37,
    id: 'hotel-feedo',
  },
  {
    img: 'https://cdn.4travel.jp/img/tcs/t/album/src/11/27/52/src_11275261.jpg?updated_at=1554462940',
    title: '府居土旅館お客様アンケート',
    date: '2024/12/12',
    answers: 507,
    id: 'fukyo-ryokan',
  },
  {
    img: 'https://cdn.pixabay.com/photo/2015/09/18/19/03/cabin-944108_1280.jpg',
    title: 'cottage FEEDOお客様アンケート',
    date: '2024/12/10',
    answers: 7,
    id: 'cottage-feedo',
  },
];
export default function Project() {
  const router = useRouter();

  const handleClick = (id: string) => {
    // 動的ページ遷移（仮）
    router.push('/survey/${id}');
  };

  return (
    <Box sx={{ maxWidth: 500, margin: 'auto', padding: 2 }}>
      {/* 新規作成 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <Button variant="outlined" sx={{ width: 100, height: 100 }}>
          <Typography variant="h3">＋</Typography>
        </Button>
        <Box sx={{ ml: 2 }}>
          <Typography variant="h6">新規作成</Typography>
          <Typography variant="body2" color="text.secondary">
            新しいアンケートの作成
          </Typography>
        </Box>
      </Box>

      {/* アンケート一覧 */}
      {surveyData.map((item) => (
        <ButtonBase
          key={item.id}
          onClick={() => handleClick(item.id)}
          sx={{ width: '100%', mb: 2, textAlign: 'left', borderRadius: 1 }}
        >
          <Card sx={{ display: 'flex', width: '100%' }}>
            <Avatar
              variant="square"
              src={item.img}
              alt={item.title}
              sx={{ width: 100, height: 100 }}
            />
            <CardContent>
              <Typography variant="subtitle1">{item.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                最終編集日 {item.date}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                回答数 {item.answers}件
              </Typography>
            </CardContent>
          </Card>
        </ButtonBase>
      ))}
    </Box>
  );
}
