import {
    Button,
    Paper,
    TextField
} from "@mui/material";
import Webnavi from "../../_components/webnavi";

export default function SignIn() {
    return (
        <div>
            <Webnavi />
            <Paper
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    padding: "20px",
                    margin: "20px auto",
                    marginTop: "30px",
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
                    }} />
                <h3>メールアドレス</h3>
                <TextField
                    style={{
                        width: "50%",
                        marginBottom: "20px",
                        borderRadius: "5px",
                        border: "1px solid #ccc",
                    }} />
                <br />
                <a href="" style={{ marginTop: "10px" }}>パスワードをお忘れですか？</a>
                <a href="/account/signup" style={{ marginTop: "10px" }}>アカウントをお持ち出ない方はこちら</a>
                <Button variant="contained">ログイン</Button>
                <Button variant="outlined" startIcon=
                    {<img src="https://images-ext-1.discordapp.net/external/cPbexFq_vc92gA47x_BvRBqXQQkk0OlRugeuUNbcotg/https/developers.google.com/identity/images/g-logo.png?format=webp&quality=lossless&width=142&height=142"
                        style={{ width: "30px", height: "30px" }} />}
                    style={{ width: "200px", height: "50px" }}>
                    Sign in with Google
                </Button>
            </Paper>
        </div>
    );
}