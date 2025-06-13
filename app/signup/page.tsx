import {
    Paper,
    TextField,
    Button,
} from "@mui/material";
import Webnavi from "../_components/webnavi";
import { createClient } from './../utils/supabase/server'
import { cookies } from 'next/headers'
import { Form, Input } from "antd";

export default function SignUp() {
    const cookieStore = cookies();
    const supabase = createClient();

    return (
        <div>
            <Webnavi />
            <Paper style={{
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
                    新規登録
                </h1>

                <h3>メールアドレス</h3>
                <TextField />
                <h3>パスワード</h3>
                <TextField />
                <br />
                <Button variant="contained">登録</Button>
                <Button variant="outlined" startIcon=
                    {<img src="https://images-ext-1.discordapp.net/external/cPbexFq_vc92gA47x_BvRBqXQQkk0OlRugeuUNbcotg/https/developers.google.com/identity/images/g-logo.png?format=webp&quality=lossless&width=142&height=142"
                        style={{ width: "30px", height: "30px" }} />}
                    style={{ width: "200px", height: "50px", marginTop: "20px" }}>
                    Sign up with Google
                </Button>
            </Paper>
            <Paper>
                <h1>Googleアカウントで新規登録</h1>
            </Paper>
            <a href="/signin">アカウントをお持ちの方はこちら</a>*
        </div>
    );
}