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

type questionProps = {
    id: string;
    type: string;
    question: string;
    discription?: string;
    selection?: number;
    sliderMin?: number;
    sliderMax?: number;
    sliderStep?: number;
    options?: string[];
}

// 型定義追加
interface FormProps {
    showDelete?: boolean;
    onDelete?: () => void;
}

export default function Form({ showDelete = false, onDelete }: FormProps) {
    const [selection, setSelection] = useState(1);
    const [questonType, setQuestionType] = useState('radio');
    const [selecttext,setSelecttext] = useState<string[]>([]);
    // star用
    const [starSteps, setStarSteps] = useState(5); // 3～10
    // slider用
    const [sliderMin, setSliderMin] = useState(0);
    const [sliderMax, setSliderMax] = useState(10);
    const [sliderStep, setSliderStep] = useState(5);
    if(selection > 10){
        alert("選択肢の数は最大10個までです。");
        setSelection(10);
    }
    return(
        <>
            <Card>
                <CardContent>
                    <Stack spacing={2}>
                        <TextField
                            label="質問文"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={1}
                            inputProps={{
                                style: {
                                    height: 'auto',
                                },
                            }}
                            onFocus={e => {
                                // 初期状態で高さをリセット
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                            }}
                            onInput={e => {
                                const target = e.target as HTMLTextAreaElement;
                                target.style.height = 'auto';
                                target.style.height = `${target.scrollHeight}px`;
                            }}
                        />
                        <Select
                            value={questonType}
                            onChange={(e: SelectChangeEvent) => setQuestionType(e.target.value)}
                            displayEmpty
                            fullWidth
                        >
                            {questionTypes.map((type) => (
                                <MenuItem key={type.value} value={type.value}>
                                    <Box display="flex" alignItems="center">
                                        <ListItemIcon sx={{ minWidth: 32 }}>{type.icon}</ListItemIcon>
                                        <Box>
                                            <Box display="flex" alignItems="center">
                                                <span>{type.label}</span>
                                            </Box>
                                            <Box>
                                                <ListItemText secondary={type.description} />
                                            </Box>
                                        </Box>
                                    </Box>
                                </MenuItem>
                            ))}
                        </Select>
                        {(questonType === "radio" || questonType === "checkbox") && (
                            <Box>
                                選択肢の個数：
                                <Select
                                    value={selection}
                                    onChange={(e: SelectChangeEvent<number>) => setSelection(Number(e.target.value))}
                                    displayEmpty
                                    size="small"
                                    sx={{ width: 120 }}
                                >
                                    {[...Array(10)].map((_, i) => (
                                        <MenuItem key={i + 1} value={i + 1}>
                                            {i + 1} 個
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Box>
                        )}
                        {(questonType === "radio" || questonType === "checkbox") && (
                            <Stack spacing={1}>
                                {[...Array(selection)].map((_, idx) => (
                                    <TextField
                                        key={idx}
                                        label={`選択肢${idx + 1}`}
                                        value={selecttext[idx] || ""}
                                        onChange={e => {
                                            const newOptions = [...selecttext];
                                            newOptions[idx] = e.target.value;
                                            setSelecttext(newOptions);
                                        }}
                                        fullWidth
                                    />
                                ))}
                                <Box>
                                    {selecttext.map((option, idx) => (
                                        <Box key={idx} display="flex" alignItems="center" mt={1}>
                                            <span>{option}</span>
                                        </Box>
                                    ))}
                                </Box>
                            </Stack>
                        )}
                        {questonType === "star" && (
                            <Box>
                                <Box mt={1}>
                                    <Select
                                        value={starSteps}
                                        onChange={e => setStarSteps(Number(e.target.value))}
                                        size="small"
                                        sx={{ width: 120 }}
                                    >
                                        {[...Array(8)].map((_, i) => (
                                            <MenuItem key={i + 3} value={i + 3}>
                                                {i + 3} 段階
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </Box>
                            </Box>
                        )}
                        {questonType === "slider" && (
                            <Box>
                                <Box mt={1} display="flex" gap={2}>
                                    <TextField
                                        label="最小値"
                                        type="number"
                                        size="small"
                                        sx={{ width: 100 }}
                                        inputProps={{ min: 0, max: sliderMax - 1 }}
                                        value={sliderMin}
                                        onChange={e => {
                                            let min = Math.max(0, Number(e.target.value));
                                            let max = sliderMax;
                                            if (min >= max) max = min + 1 > 100 ? 100 : min + 1;
                                            setSliderMin(min);
                                            setSliderMax(max);
                                            if (sliderStep > max) setSliderStep(max);
                                        }}
                                    />
                                    <TextField
                                        label="最大値"
                                        type="number"
                                        size="small"
                                        sx={{ width: 100 }}
                                        inputProps={{ min: sliderMin + 1, max: 100 }}
                                        value={sliderMax}
                                        onChange={e => {
                                            let max = Math.min(100, Number(e.target.value));
                                            let min = sliderMin;
                                            if (max <= min) min = max - 1 < 0 ? 0 : max - 1;
                                            setSliderMin(min);
                                            setSliderMax(max);
                                            if (sliderStep > max) setSliderStep(max);
                                        }}
                                    />
                                    <TextField
                                        label="分割数"
                                        type="number"
                                        size="small"
                                        sx={{ width: 100 }}
                                        inputProps={{ min: 2, max: sliderMax }}
                                        value={sliderStep}
                                        onChange={e => {
                                            let val = Math.max(2, Math.min(Number(e.target.value), sliderMax));
                                            setSliderStep(val);
                                        }}
                                    />
                                </Box>
                            </Box>
                        )}
                        <Box display="flex" justifyContent="flex-end">
                            {showDelete && (
                                <IconButton color="primary" onClick={onDelete}>
                                    <DeleteIcon />
                                </IconButton>
                            )}
                        </Box>
                    </Stack>
                </CardContent>
            </Card>
        </>
    );
}