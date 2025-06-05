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
            <Paper
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                padding: "20px",
                margin: "20px auto",
                width: "60%",
                height: "50%",
                backgroundColor: "#fff",
                borderRadius: "10px",
                border: "1px solid #ccc",
            }}>
                <h1>
                    SignIn
                </h1>
                <h3>ユーザーネーム</h3>
                <TextField 
                style={{
                    width: "50%",
                    marginBottom: "20px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}/>
                <h3>メールアドレス</h3>
                <TextField
                style={{
                    width: "50%",
                    marginBottom: "20px",
                    borderRadius: "5px",
                    border: "1px solid #ccc",
                }}/>
                <br />
                <Button variant="contained">a</Button>
                <Button variant="contained">b</Button>
                
            </Paper>
            <Paper>
                <h1>Googleアカウントでサインイン</h1>
                {/*GoogleAuthでグーグルアカウントでログインできるようにする。*/}
            </Paper>
            <a href="/signup">アカウントをお持ち出ない方はこちら</a>
        </div>
    );
}