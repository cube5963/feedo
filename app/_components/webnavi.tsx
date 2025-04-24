import {
    Button,
}from "@mui/material";

export default function Webnavi(){
    return(
        <div>
            <ul>
                <li>Feedo</li>
                <li>機能</li>
                <li>活用例</li>
                <li>プランと料金</li>
                <li><Button variant="contained">ログイン</Button></li>
                <li><Button variant="contained">登録</Button></li>
            </ul>
        </div>
    );
}