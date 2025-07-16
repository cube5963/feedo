"use client";
import { useState, useCallback, useRef, useEffect } from "react";
import Image from "next/image";
import Form from "../../_components/form";
    import { createClient } from "@/utils/supabase/client";
import {
    Paper,
    TextField,
    Tab,
    Checkbox,
    Button,
    AppBar,
    Box,
} from "@mui/material";
import {
    TabPanel,
    TabContext,
    TabList,
} from "@mui/lab";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SaveIcon from '@mui/icons-material/Save';
import ShareIcon from '@mui/icons-material/Share';
import VisibilityIcon from '@mui/icons-material/Visibility';

const sidebarButtons = [
    {
        icon: <SaveIcon sx={{ fontSize: 36, color: "#888" }} />,
        label: "保存",
        action: "save",
    },
    {
        icon: <ShareIcon sx={{ fontSize: 36, color: "#888" }} />,
        label: "共有",
    },
    {
        icon: <VisibilityIcon sx={{ fontSize: 36, color: "#888" }} />,
        label: "プレビュー",
    },
    {
        icon: <AddCircleOutlineIcon sx={{ fontSize: 36, color: "#888" }} />,
        label: "質問追加",
        action: "add",
    },
];

function showTooltip(e: React.MouseEvent, label: string) {
    const tooltip = document.createElement("div");
    tooltip.textContent = label;
    tooltip.style.position = "fixed";
    tooltip.style.left = `${e.clientX + 10}px`;
    tooltip.style.top = `${e.clientY + 10}px`;
    tooltip.style.background = "#333";
    tooltip.style.color = "#fff";
    tooltip.style.padding = "4px 10px";
    tooltip.style.borderRadius = "4px";
    tooltip.style.fontSize = "14px";
    tooltip.style.zIndex = "9999";
    tooltip.className = "custom-tooltip";
    document.body.appendChild(tooltip);
}

function moveTooltip(e: React.MouseEvent) {
    const tooltip = document.querySelector(".custom-tooltip") as HTMLDivElement;
    if (tooltip) {
        tooltip.style.left = `${e.clientX + 10}px`;
        tooltip.style.top = `${e.clientY + 10}px`;
    }
}

function hideTooltip() {
    const tooltip = document.querySelector(".custom-tooltip");
    if (tooltip) tooltip.remove();
}

function Sidebar({ onAddForm, onSaveForm }: { onAddForm: () => void, onSaveForm: () => void }) {
    return (
        <Box
            sx={{
                width: "5%",
                minWidth: 100,
                maxWidth: 400,
                backgroundColor: "#fff",
                padding: "20px",
                boxSizing: "border-box",
                height: "100vh",
                position: "sticky",
                top: 0,
                borderRight: "1px solid #ccc",
            }}
        >
            <Box
                display="flex"
                flexDirection="column"
                gap={2}
                width="100%"
                alignItems="center"
                justifyContent="flex-start"
                height="100%"
            >
                {sidebarButtons.map(({ icon, label, action }) => (
                    <Box sx={{ width: "100%" }} key={label}>
                        <Button
                            variant="text"
                            startIcon={icon}
                            sx={{
                                justifyContent: "center",
                                fontSize: 20,
                                py: 2,
                                width: "100%",
                                border: "none",
                                boxShadow: "none",
                                color: "#888",
                                backgroundColor: "transparent",
                                "&:hover": {
                                    backgroundColor: "#f0f0f0",
                                },
                            }}
                            fullWidth
                            onMouseEnter={e => showTooltip(e, label)}
                            onMouseMove={moveTooltip}
                            onMouseLeave={hideTooltip}
                            onClick={
                                action === "add" ? onAddForm :
                                action === "save" ? onSaveForm : undefined
                            }
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}



export default function Create() {
    const [value, setValue] = useState("1");
    
    // DB型
    type FormDB = {
      FormID: number;
      FormName: string;
      ImgID: string;
      CreatedAt?: string;
      UpdatedAt?: string;
      Delete?: boolean;
    };

    type ProjectData = {
      title: string;
      forms: FormDB[];
      formContents: { [key: number]: any }; // 各フォームの内容を保存
    };

    const [forms, setForms] = useState<FormDB[]>([]);
    const [title, setTitle] = useState("");
    const [formContents, setFormContents] = useState<{ [key: number]: any }>({});

    // DBからデータ取得
    useEffect(() => {
      const fetchData = async () => {
        const supabase = createClient();
        
        // プロジェクトデータを取得（例：project_id = 1 として）
        const { data: projectData } = await supabase
          .from("Project")
          .select("*")
          .eq("ProjectID", 1)
          .single();
        
        if (projectData) {
          setTitle(projectData.Title || "");
        }
        
        // フォームデータを取得
        const { data: formsData, error } = await supabase.from("Form").select();
        if (!error && formsData) {
          setForms(formsData as FormDB[]);
        }

        // フォーム内容を取得
        const { data: projectDataContent } = await supabase
          .from("ProjectData")
          .select("FormContents")
          .eq("ProjectID", 1)
          .single();
        
        if (projectDataContent?.FormContents) {
          try {
            const contents = JSON.parse(projectDataContent.FormContents);
            setFormContents(contents);
          } catch (e) {
            console.error("フォーム内容の解析に失敗しました:", e);
          }
        }
      };
      fetchData();
    }, []);

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

    // フォーム追加（安定したIDを使用）
    const handleAddForm = useCallback(() => {
        const newForm: FormDB = {
            FormID: Math.floor(Math.random() * 1000000) + Date.now(), // より安定したID生成
            FormName: "新しいフォーム",
            ImgID: "",
            CreatedAt: new Date().toISOString(),
            UpdatedAt: new Date().toISOString(),
            Delete: false,
        };
        setForms(prev => [...prev, newForm]);
    }, []);

    // フォーム削除
    const handleDeleteForm = useCallback((id: number) => {
        setForms(prev => prev.filter(form => form.FormID !== id));
    }, []);

    // サイドバー「保存」ボタンでFormをSupabaseに保存
    const handleSaveForm = useCallback(async () => {
        const supabase = createClient();
        
        try {
            // 1. プロジェクトタイトルを保存
            await supabase.from("Project").upsert({
                ProjectID: 1, // 固定ID（実際は動的に設定）
                Title: title,
                UpdatedAt: new Date().toISOString(),
            });
            
            // 2. フォームデータを保存
            for (const form of forms) {
                const { error } = await supabase.from("Form").upsert({
                    FormID: form.FormID,
                    FormName: form.FormName,
                    ImgID: form.ImgID,
                    CreatedAt: form.CreatedAt,
                    UpdatedAt: new Date().toISOString(),
                    Delete: form.Delete ?? false,
                });
                if (error) {
                    console.error("保存エラー:", JSON.stringify(error, null, 2));
                    throw error;
                }
            }
            
            // 3. フォーム内容を保存（JSONとして）
            await supabase.from("ProjectData").upsert({
                ProjectID: 1,
                FormContents: JSON.stringify(formContents),
                UpdatedAt: new Date().toISOString(),
            });
            
            alert("保存完了しました！");
        } catch (error) {
            console.error("保存中にエラーが発生しました:", JSON.stringify(error, null, 2));
            console.error("エラー詳細:", error);
            alert("保存に失敗しました。コンソールでエラー詳細を確認してください。");
        }
    }, [title, forms, formContents]);

    // フォームデータ変更のコールバック
    const handleFormDataChange = useCallback((formId: number, data: any) => {
        setFormContents(prev => ({
            ...prev,
            [formId]: data
        }));
    }, []);

    // TabPanelContentを普通の関数として定義（メモ化を避ける）
    function TabPanelContent({ value }: { value: string }) {
        switch (value) {
            case "1":
                return (
                    <TabPanel value="1">
                        <Paper className="title" sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center', mb: 2 }}>
                            <TextField
                                label="タイトル"
                                fullWidth
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                inputProps={{ maxLength: 100, style: { imeMode: "active" } }}
                                multiline={false}
                                sx={{ maxWidth: 800, mx: 'auto', textAlign: 'center' }}
                                InputProps={{ style: { textAlign: 'center' } }}
                            />
                        </Paper>
                        {forms.map((form) => (
                            <Form 
                                key={form.FormID} 
                                showDelete={true} 
                                onDelete={() => handleDeleteForm(form.FormID)}
                                formData={formContents[form.FormID]}
                                onFormDataChange={(data) => handleFormDataChange(form.FormID, data)}
                            />
                        ))}
                    </TabPanel>
                );
            case "2":
                return (
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
                );
            case "3":
                return (
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
                );
            default:
                return null;
        }
    }

    return (
        <div>
            <AppBar
                position="static"
                elevation={0}
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "10px",
                    margin: 0,
                    width: "100%",
                    backgroundColor: "#fff",
                    borderBottom: "1px solid #ccc",
                }}
            >
                <a href="/project">
                    <Image
                        src="/logo.png"
                        alt="Logo"
                        height={40}
                        width={250}
                        style={{
                            width: "auto",
                            height: "auto",
                            maxWidth: "100%",
                            maxHeight: "100%",
                            objectFit: "contain",
                        }}
                    />
                </a>
            </AppBar>
            <Box display="flex" flexDirection="row" width="100%">
                {value === "1" && (
                    <Sidebar
                        onAddForm={handleAddForm}
                        onSaveForm={handleSaveForm}
                    />
                )}
                <Box flex={1} sx={{ transition: "margin-left 0.3s" }}>
                    <Box>
                        <TabContext value={value}>
                            <Box
                                sx={{
                                    position: "relative",
                                    overflow: "hidden",
                                    backgroundColor: "#fff",
                                    display: "flex",
                                    alignItems: "center",
                                    flexDirection: "row",
                                    transition: "max-width 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                                }}
                            >
                                <Box
                                    sx={{
                                        display: "flex",
                                        flexGrow: 1,
                                        width: "100%",
                                        opacity: 1,
                                        transform: "translateX(0)",
                                        pointerEvents: "auto",
                                        transition: "opacity 0.3s, transform 0.4s",
                                    }}
                                >
                                    <Box display="flex" justifyContent="center" alignItems="center" width="100%">
                                        <TabList onChange={handleChange} style={{ width: "60%", minWidth: 300 }}>
                                            <Tab label="質問" value="1" style={{ flex: 1 }} />
                                            <Tab label="統計" value="2" style={{ flex: 1 }} />
                                            <Tab label="設定" value="3" style={{ flex: 1 }} />
                                        </TabList>
                                    </Box>
                                </Box>
                            </Box>
                            <TabPanelContent value={value} />
                        </TabContext>
                    </Box>
                </Box>
            </Box>
        </div>
    );
}
