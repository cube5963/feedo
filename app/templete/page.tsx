"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Button,
    Paper,
    TextField,
} from "@mui/material";

export default function Templete(){
    const [isloading, setLoading] = useState(true);
    const router = useRouter();

    function OnPush() {
        if (isloading) {
            setLoading(false);
            setTimeout(() => {
                router.push("/create");
            }, 2000);
        }
        else {
            alert("すでに作成中です");
        }
    }

    return(
        isloading ? (
        <div>
            <h1>テンプレート作成</h1>
            <h4>アンケートのタイトルと聞きたい内容、活用目的を記入してください。</h4>
            <h4>AIが最適なアンケートを作成します。</h4>
            <Paper>
                <TextField
                    label="アンケートのタイトル"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
                <TextField
                    label="聞きたい内容・活用目的"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                />
            </Paper>
            <div>
                <Button color="inherit">戻る</Button>
                <Button variant="contained" onClick={OnPush}>次へ</Button>
            </div>
        </div>
        ) : (
        <div>
            <h2>テンプレート作成中...</h2>
            <h1>FEEDO</h1>
        </div>
        )
    );
}