"use client";
import { useState } from "react";
import{
    Paper,
    TextField,
    Tab,
    IconButton,
    Checkbox,
} from "@mui/material";
import {
    TabPanel,
    TabContext,
    TabList,
} from "@mui/lab";


export default function Create(){
    const [value, setValue] = useState("1");
    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    return(
        <div>
            <TabContext value={value}>
                <TabList onChange={handleChange}>
                    <Tab label="質問" value="1"/>
                    <Tab label="統計" value="2"/>
                    <Tab label="設定" value="3"/>
                </TabList>
                <TabPanel value="1">
                    <Paper className="title">
                        <TextField
                            label="タイトル"//ここをUseStateで変更可能にする
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Paper>
                    {/*
                    Usestateで変化させた値の数、以下のPaperを表示させる。
                    最低一つまで残るようにする。
                    */}
                </TabPanel>
                <TabPanel value="2">
                    <Paper>
                        <TextField
                            label="統計"
                            multiline
                            rows={4}
                            fullWidth
                        />
                    </Paper>
                </TabPanel>
                <TabPanel value="3">
                    <Paper>
                        <TextField
                            label="設定"
                            multiline
                            rows={4}
                            fullWidth
                        />
                        <Checkbox /><span>アンケートのテンプレート作成</span>
                        <br />
                        <Checkbox /><span>アンケートの要約とアドバイス</span>
                        <br />
                        <Checkbox /><span>アンケートの質問文の自動改善</span>
                    </Paper>
                </TabPanel>
            </TabContext>
        </div>
    );
}