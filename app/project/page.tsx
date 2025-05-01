import {
    Card,
    Button,
} from "@mui/material";


export default function Project(){
    return(
        <div>
            ここにアカウントごとの管理画面を作成する。
            <div className="newCreate">
                <Button>
                    <Card>+</Card>
                </Button>
                <span>新規作成</span>
            </div>
            <div className="management">
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