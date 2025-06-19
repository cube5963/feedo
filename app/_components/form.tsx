"use client";
import React from 'react';
import { useState } from 'react';

import {
    Card,
    CardContent,
    Select,
    TextField,
    MenuItem,
    ListItemIcon,
    ListItemText,
    Stack,
    Box,
    SelectChangeEvent,
} from '@mui/material';
import RadioButtonCheckedIcon from '@mui/icons-material/RadioButtonChecked';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import LinearScaleIcon from '@mui/icons-material/LinearScale';
import ThumbsUpDownIcon from '@mui/icons-material/ThumbsUpDown';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import StarIcon from '@mui/icons-material/Star';
import BorderColorIcon from '@mui/icons-material/BorderColor';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';


const questionTypes = [
    {
        value: 'radio',
        label: '単一選択',
        icon: <RadioButtonCheckedIcon fontSize="small" />, 
        description: '1つだけ選べるラジオボタン形式の質問です。',
    },
    {
        value: 'checkbox',
        label: '複数選択',
        icon: <CheckBoxIcon fontSize="small" />, 
        description: '複数選択できるチェックボックス形式の質問です。',
    },
    {
        value: 'star',
        label: '評価',
        icon: <StarIcon fontSize="small" />, 
        description: '3〜10段階で評価できる質問です。',
    },
    {
        value: 'text',
        label: '自由記述',
        icon: <BorderColorIcon fontSize="small" />, 
        description: '自由にテキストを入力できる質問です。',
    },
    {
        value: 'two_choice',
        label: '二択',
        icon: <ThumbsUpDownIcon fontSize="small" />, 
        description: '2択（賛成/反対）で答える質問です。',
    },
    {
        value: 'slider',
        label: 'スライダー',
        icon: <LinearScaleIcon fontSize="small" />, 
        description: '数値をスライダーで選択できる質問です。',
    },
];

export default function Form(){
    const [selection, setSelection] = useState(1);
    const [questonType, setQuestionType] = useState('radio');
    if(selection >= 10){
        alert("選択肢の数は最大10個までです。");
        setSelection(10);
    }
    return(
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            label="質問"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                        />
                        <Select
                            value={questonType}
                            onChange={(e: SelectChangeEvent) => setQuestionType(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            {questionTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    <ListItemIcon>{type.icon}</ListItemIcon>
                                    <ListItemText primary={type.label} secondary={type.description} />
                                </MenuItem>
                            ))}
                        </Select>
                        {(questonType === "radio" || questonType === "checkbox") && (
                            <Box>
                                <IconButton color="primary" onClick={() => setSelection(selection + 1)}>
                                    <ThumbUpIcon />
                                </IconButton>
                                選択詞の数: {selection}
                            </Box>
                        )}
                        <Box display="flex" justifyContent="flex-end">
                            <IconButton color="primary">
                                <DeleteIcon />
                            </IconButton>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}