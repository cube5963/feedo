import{
    Paper,
    TextField,
    Button,
}from "@mui/material";
import Webnavi from "../_components/webnavi";

export default function SignUp(){
    return(
        <div>
            <Webnavi/>
            <Paper>
                <h1>
                    新規登録
                </h1>
                <h3>ユーザーネーム</h3>
                <TextField/>
                <h3>メールアドレス</h3>
                <TextField/>
                <h3>パスワード</h3>
                <TextField/>
                <br />
                <Button variant="contained">a</Button>
                <Button variant="contained">b</Button>
                
            </Paper>
            <Paper>
                <h1>Googleアカウントで新規登録</h1>
                {/*GoogleAuthでグーグルアカウントでログインできるようにする。*/}
            </Paper>
            <a href="/signin">アカウントをお持ちの方はこちら</a>
        </div>
    );
}