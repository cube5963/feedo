import {
    Button,
} from "@mui/material";

export default function NewProject(){
    return(
        <div>
            <h1>新規作成</h1>
            <h3>AIを使用しますか？</h3>
            <Button href="/setup" variant="contained">使用しません<span display="none">使用します</span></Button>
            <Button variant="outlined" color="inherit">使用しません</Button>
        </div>
    );
}
