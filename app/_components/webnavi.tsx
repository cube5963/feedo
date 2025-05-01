import {
    Button,
}from "@mui/material";

export default function Webnavi(){
    return(
        <div>
            <ul>
                <li><a href="/">FEEDO</a></li>
                <li>機能</li>
                <li>活用例</li>
                <li>プランと料金</li>
                <li><Button href="/signin" variant="contained">サインイン</Button></li>
                <li><Button href="/signup" variant="contained">登録</Button></li>
            </ul>
        </div>
    );
}