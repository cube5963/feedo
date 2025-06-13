"use client";
import {
    Paper,
    TextField,
    Button,
} from "@mui/material";
import Webnavi from "../_components/webnavi";
import { supabase } from "../utils/supabase/server";
import React, { useState } from 'react';

export default function SignUp() {

    const [formValues, setFormValues] = useState({
        email: '',
        password: '',
    });

    const submit = async (e: React.FormEvent) => {
        e.preventDefault();
        const { email, password } = formValues;
        if (!email || !password) {
            alert("メールアドレスとパスワードを入力してください。");
            return;
        }
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        if (error) {
            alert(`エラーが発生しました: ${error.message}`);
        } else {
            alert("登録が完了しました。確認メールをチェックしてください。");
        }
    }

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
                <TextField value={formValues.email} onChange={(e) => setFormValues({ ...formValues, email: e.target.value })} />
                <h3>パスワード</h3>
                <TextField value={formValues.password} onChange={(e) => setFormValues({ ...formValues, password: e.target.value })} />
                <br />
                <Button variant="contained" onClick={submit}>登録</Button>
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