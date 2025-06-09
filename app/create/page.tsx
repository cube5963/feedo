"use client";
import { useState } from "react";
import Image from "next/image";
import logo from "../../public/logo.png";
import Form from "../_components/form";
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

function Sidebar() {
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
                {sidebarButtons.map(({ icon, label }) => (
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
                        />
                    </Box>
                ))}
            </Box>
        </Box>
    );
}

function TabPanelContent({ value }: { value: string }) {
    switch (value) {
        case "1":
            return (
                <TabPanel value="1">
                    <Paper className="title">
                        <TextField
                            label="タイトル"
                            fullWidth
                            inputProps={{ maxLength: 100, style: { imeMode: "active" } }}
                            multiline={false}
                            inputRef={input => {
                                if (input) {
                                    input.onmousedown = (e: MouseEvent) => {
                                        setTimeout(() => input.select(), 0);
                                    };
                                }
                            }}
                        />
                    </Paper>
                    <Form/>
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

export default function Create() {
    const [value, setValue] = useState("1");

    const handleChange = (event: React.SyntheticEvent, newValue: string) => {
        setValue(newValue);
    };

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
                        src={logo}
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
                {value === "1" && <Sidebar />}
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
