import{
    Button,
    Paper,
    TextField
}from "@mui/material";
import Webnavi from "../_components/webnavi";

export default function SignIn(){
    return(
        <div>
            <Webnavi/>
            <Paper>
                <h1>
                    Login
                </h1>
                <h3>ユーザーネーム</h3>
                <TextField/>
                <h3>メールアドレス</h3>
                <TextField/>
                <br />
                <Button variant="contained">a</Button>
                <Button variant="contained">b</Button>
                
            </Paper>
            <Paper>
                <h1>Googleアカウントでサインイン</h1>
                {/*GoogleAuthでグーグルアカウントでログインできるようにする。*/}
            </Paper>
            <a href="/sidnup">アカウントをお持ち出ない方はこちら</a>
        </div>
    );
}