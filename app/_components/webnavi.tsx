import {
    autocompleteClasses,
    Button,
    AppBar,
}from "@mui/material";
import Image from "next/image";
import logo from "../../public/logo.png";

export default function Webnavi(){
    return(
        <AppBar
        style={{
            display: "flex",
            justifyContent: "space-between", 
            padding: "10px", 
            margin: 0,
            width: "100%",
            backgroundColor: "#fff", 
            borderBottom: "1px solid #ccc",
        }}>
            <ul 
            style={{display: "flex", 
            listStyleType: "none", 
            padding: 0, 
            margin: 0,
            width: "100%",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "20px",
            fontWeight: "bold",
            color: "#333",
            }}>
                <li>
                    <a href="/">
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
                    }}/>
                    </a>
                </li>
                <li>機能</li>
                <li>活用例</li>
                <li>プランと料金</li>
                <li>
                    <Button 
                    href="/signin" 
                    variant="contained"
                    style={{
                        backgroundColor: "#000",
                        color: "#fff",
                        padding: "10px 30px",
                        borderRadius: "5px",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        minWidth: "120px",
                    }}>
                        サインイン
                    </Button>
                </li>
                <li>
                    <Button 
                    href="/signup" 
                    variant="contained"
                    style={{
                        backgroundColor: "#1976d2",
                        color: "#fff",
                        padding: "10px 30px",
                        borderRadius: "5px",
                        textDecoration: "none",
                        fontSize: "16px",
                        fontWeight: "bold",
                        minWidth: "120px",
                    }}
                    >
                        登録
                    </Button>
                </li>
            </ul>
        </AppBar>
    );
}