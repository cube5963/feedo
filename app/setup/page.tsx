import {
    Checkbox,
    Button,
} from "@mui/material";

export default function Setup(){
    return(
        <div>
            <h1>初期設定</h1>
            <h3>AIにしてもらうサポートを選択してください。</h3>
            <div>
                <Checkbox /><span>アンケートのテンプレート作成</span>
                <br />
                <Checkbox /><span>アンケートの要約とアドバイス</span>
                <br />
                <Checkbox /><span>アンケートの質問文の自動改善</span>
            </div>
            <div>
                <Button color="inherit">戻る</Button>
                <Button variant="contained">次へ</Button>
            </div>
        </div>
    );
}
