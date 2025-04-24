import{
    Button,
    Paper,
    TextField
}from "@mui/material";

export default function Login(){
    return(
        <div>
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
                {/*GoogleAuthでグーグルアカウントでログインできるようにする。*/}
            </Paper>
        </div>
    );
}