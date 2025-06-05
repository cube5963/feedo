import {
    Card,
    Button,
    Box,
   ImageList ,
   ImageListItem,
   ImageListItemBar
} from "@mui/material";

const itemData = [
  {img: 'https://freeillust-classic.com/wp-content/uploads/0209000219.png',
  storename:'関と右崎旅館',
  author:'ヴィットー',
  },
  {
    img: 'https://t3.ftcdn.net/jpg/00/84/09/18/360_F_84091840_8wn1lAJ7jIuYRczt4PRqrrZUoAOoPVrO.jpg',
    storename:'右崎の化身ホテル',
    author:'うー',
  },
  {
    img: 'https://www.pakutaso.com/shared/img/thumb/OMG150918280I9A6410_TP_V.jpg',
    storename:'関を許さない',
    author:'う？',
  },
]

export default function Project(){
    return(
        
        <div>   
            ここにアカウントごとの管理画面を作成する。
            <div className="newCreate">
                <Button size="large">
                    <Card sx = {{minWidth:130,fontSize:80}}>+</Card>
                </Button>
                <span>新規作成</span>
            </div>
            <div className="management">

                  <ImageList sx={{ width: '500', height: '450' }}>
                    {itemData.map((item) => (
                        <ImageListItem key={item.img}>
                        <img
                            srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            src={`${item.img}?w=248&fit=crop&auto=format`}
                            alt={item.storename}
                            loading="lazy"
                        />           <ImageListItemBar
                            title={<span>{item.storename}お客様アンケート</span>}
                            subtitle={<span>by: {item.author}</span>}
                            position="below"
                        />
                        </ImageListItem>
                    ))}
                    </ImageList>

                <div className="store">
                    <Card>店舗画像</Card>
                    <span>店舗名</span>
                    <span>最終編集日 xxxx/xx/xx </span>
                    <span>回答数 x 件</span>
                </div>
                <div className="store">
                    <Card>店舗画像</Card>
                    <span>店舗名</span>
                    <span>最終編集日 xxxx/xx/xx </span>
                    <span>回答数 x 件</span>
                </div>
                <div className="store">
                    <Card>店舗画像</Card>
                    <span>店舗名</span>
                    <span>最終編集日 xxxx/xx/xx </span>
                    <span>回答数 x 件</span>
                </div>
            </div>
        </div>
    );
}